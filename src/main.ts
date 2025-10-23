import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/Events'; 
export const events = new EventEmitter();

import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer, TPayment } from './components/Models/Buyer';
import { IProduct } from './types';
import { Api} from './components/base/Api';
import { ServerService } from './components/Models/ServerService';

const baseApi = new Api(API_URL);
const serverService = new ServerService(baseApi);

import { GalleryView } from './components/Veiws/GalleryView';
import { Modal } from './components/Veiws/Modal';
import { HeaderView } from './components/Veiws/HeaderView';
import { BasketView } from './components/Veiws/BasketView';
import { SuccessView } from './components/Veiws/SuccessView';
import { FormOrderView } from './components/Veiws/Forms/FormOrderView';
import { FormContactsView } from './components/Veiws/Forms/FormContactsView';
import { CardForCatalog } from './components/Veiws/CardForCatalog';
import { CardForPreview } from './components/Veiws/CardForPreview';
import { CardForBasket } from './components/Veiws/CardForBasket';

const cardForCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardForPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardForBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const formOrderTemplate = ensureElement<HTMLTemplateElement>("#order");
const formContactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");

const galleryElement = ensureElement<HTMLElement>(".gallery");
const headerElement = ensureElement<HTMLElement>(".header");
const modalElement = ensureElement<HTMLElement>(".modal");

const productsModel = new Products();
const basketModel = new Basket(events);
const buyerModel = new Buyer();

const galleryView = new GalleryView(galleryElement);
const headerView = new HeaderView(headerElement, events);
const modal = new Modal(modalElement, events);
const basketView = new BasketView(cloneTemplate<HTMLDivElement>(basketTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), events);
const formOrderView = new FormOrderView(cloneTemplate(formOrderTemplate), events);
const formContactsView = new FormContactsView(cloneTemplate(formContactsTemplate), events);

serverService.fetchProducts()
  .then((products: IProduct[]) => {
    productsModel.setProducts(products);
    console.log(productsModel.getProducts());
  })
  .catch((err: unknown) => console.error('Не удалось загрузить товары: ', err));
  
events.on('products:change', (products: IProduct[]) => {
  const cards = products.map(product => {
    return new CardForCatalog(cloneTemplate(cardForCatalogTemplate), events).render(product)});
  galleryView.galleryList = cards;
});

events.on('product:selected:set', (product: IProduct) => {
  const card = new CardForPreview(cloneTemplate(cardForPreviewTemplate), events)

  if (product && product.price === null) {
    card.toggleButtonState(false);
  } else if (product && basketModel.hasItem(product.id)) {
    card.buttonText = 'Удалить из корзины';
  } else {
    card.buttonText = 'В корзину';
  }

  modal.open(card.render(product))
})

events.on('product:select', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) productsModel.setSelectedProduct(product);
});

events.on('product:submit', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (!product) return;

  if (!basketModel.hasItem(data.id)) basketModel.addItem(product);
  else basketModel.removeItem(data.id);

  modal.close();
});

events.on('basket:listChange', (data: { items: IProduct[], totalPrice: number, count: number }) => {
  const cards = data.items.map((product: IProduct, index: number) => {
    const card = new CardForBasket(cloneTemplate(cardForBasketTemplate), events);
    card.index = index + 1;
    return card.render(product);
  });

  basketView.basketList = cards;
  basketView.totalPrice = data.totalPrice;
  basketView.setEmptyMessage(data.count > 0);
  basketView.toggleSubmitButton(data.count > 0);
  headerView.counter = data.count;
});


events.on('basket:open', () => {
  const hasProducts = basketModel.getItemCount() > 0;
  basketView.toggleSubmitButton(hasProducts);
  basketView.setEmptyMessage(hasProducts);
  modal.open(basketView.render());
});

events.on('product:delete', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id)
  if(product) basketModel.removeItem(product.id);
});

events.on('basket:placeOrder', () => {
  modal.setContent(formOrderView.render());
});

//forms 
events.on('form:paymentChanged', ({ payment }: { payment: TPayment }) => buyerModel.setPayment(payment));
events.on('form:addressChanged', ({ address }: { address: string }) => buyerModel.setAddress(address));
events.on('form:orderSubmit', () => modal.setContent(formContactsView.render()));
events.on('form:emailChanged', ({ email }: { email: string }) => buyerModel.setEmail(email));
events.on('form:phoneChanged', ({ phone }: { phone: string }) => buyerModel.setPhone(phone));

events.on('buyer:change', ({ field }: { field: keyof ReturnType<Buyer['getData']> }) => {
  const errorsRecord: Record<string, boolean> = {};
  const errors = buyerModel.validate();
  Object.keys(errors).forEach(key => {
    errorsRecord[key] = !!errors[key as keyof typeof errors];
  });

  const selectedPayment = buyerModel.getData().payment;

if (field === 'payment' || field === 'address') {
  const isValid = formOrderView.checkIsFormValid(errorsRecord); 
  formOrderView.togglePaymentButtonStatus(Boolean(selectedPayment) ? selectedPayment : null); 
  formOrderView.toggleSubmitButton(isValid);
  if (selectedPayment) formOrderView.togglePaymentButtonStatus(selectedPayment);
} else if (field === 'email' || field === 'phone') {
  const isValid = formContactsView.checkIsFormValid(errorsRecord); 
  formContactsView.toggleSubmitButton(isValid);
}
});

events.on('form:contactsSubmit', () => {
  const buyerData = buyerModel.getData();
  const purchases = basketModel.getItems();

  modal.setContent(document.createElement('div'));

  const orderData = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: basketModel.getTotalPrice(),
    items: purchases.map((p: IProduct) => p.id),
  };

  setTimeout(() => {
    baseApi.post('/orders', orderData)
      .then(() => {
        basketModel.clear();
        buyerModel.clear();
        headerView.counter = basketModel.getItemCount();
        modal.setContent(successView.render());
        formOrderView.resetFormState();
        formContactsView.reset();
      })
      .catch((err: unknown) => console.error('Не удалось разместить заказ: ', err));
  }, 1000);
});

events.on('success:confirm', () => modal.close());

events.on('modal:close', () => {
  productsModel.clearSelectedProduct()
  modal.close();
});


