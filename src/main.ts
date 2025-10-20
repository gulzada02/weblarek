import './scss/styles.scss';

// ================== CONSTANTS & UTILS ==================
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// ================== EVENT EMITTER ==================
import { EventEmitter } from './components/base/Events'; 
export const events = new EventEmitter();

// ================== MODELS ==================
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer, TPayment } from './components/Models/Buyer';
import { IProduct } from './types';

// ================== API ==================
import { Api, ApiClient} from './components/base/Api';
const baseApi = new Api(import.meta.env.VITE_API_URL || API_URL);
const apiClient = new ApiClient(baseApi)
apiClient.getAllProducts()
  .then(data => productsModel.setProducts(data))
  .catch(error => console.error('Ошибка загрузки товаров:', error))

// ================== VIEWS ==================
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

// ================== TEMPLATES ==================
const cardForCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardForPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardForBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const formOrderTemplate = ensureElement<HTMLTemplateElement>("#order");
const formContactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");


// ================== ELEMENTS ==================
const galleryElement = ensureElement<HTMLElement>(".gallery");
const headerElement = ensureElement<HTMLElement>(".header");

// ================== MODELS ==================
const productsModel = new Products();
const basketModel = new Basket(events);
const buyerModel = new Buyer();

// ================== VIEWS ==================
const galleryView = new GalleryView(galleryElement);
const headerView = new HeaderView(headerElement, events);
const modal = new Modal('.modal__container', events);
const basketView = new BasketView(cloneTemplate<HTMLDivElement>(basketTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), events);
const formOrderView = new FormOrderView(cloneTemplate(formOrderTemplate), events);
const formContactsView = new FormContactsView(cloneTemplate(formContactsTemplate), events);

// ================== INITIAL DATA ==================
baseApi.get<IProduct[]>('/products')
  .then(products => productsModel.setProducts(products))
  .catch(err => console.error('Ошибка загрузки товаров:', err));

// ================== PRODUCTS EVENTS ==================
productsModel.on('products:change', (products: IProduct[]) => {
  const cards = products.map(product => new CardForCatalog(cardForCatalogTemplate, events).render(product));
  galleryView.galleryList = cards;
});

productsModel.on('product:selected', (product: IProduct) => {
  const card = new CardForPreview(cardForPreviewTemplate, events);

  if (product.price === null) card.toggleButtonState(false);
  else if (basketModel.hasItem(product.id)) card.buttonText = 'Удалить из корзины';
  else card.buttonText = 'Купить';

  modal.open(card.render(product));
});

// ================== USER INTERACTIONS ==================
events.on('product:select', ({ id }: { id: string }) => {
  const product = productsModel.getProductById(id);
  if (product) productsModel.setSelectedProduct(product);
});

events.on('product:submit', ({ id }: { id: string }) => {
  const product = productsModel.getProductById(id);
  if (!product) return;

  if (!basketModel.hasItem(id)) basketModel.addItem(product);
  else basketModel.removeItem(id);

  modal.close();
});

events.on('basket:listChange', (data: { purchases: IProduct[], totalPrice: number, quantity: number }) => {
  const cards = data.purchases.map((product: IProduct, index: number) => {
    const card = new CardForBasket(cloneTemplate(cardForBasketTemplate), events);
    card.index = index + 1;
    return card.render(product);
  });

  basketView.basketList = cards;
  basketView.totalPrice = data.totalPrice;
  basketView.setEmptyMessage(data.quantity > 0);
  basketView.toggleSubmitButton(data.quantity > 0);
  headerView.counter = data.quantity;
});

events.on('basket:open', () => {
  const hasProducts = basketModel.getItemCount() > 0;
  basketView.toggleSubmitButton(hasProducts);
  basketView.setEmptyMessage(hasProducts);
  modal.open(basketView.render());
});

events.on('product:delete', ({ id }: { id: string }) => {
  basketModel.removeItem(id);
});

events.on('basket:placeOrder', () => {
  modal.setContent(formOrderView.render());
});

// ================== FORMS ==================
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
        formOrderView.reset();
        formContactsView.reset();
      })
      .catch((err: unknown) => console.error('Не удалось разместить заказ: ', err));
  }, 1000);
});
// ================== SUCCESS ==================
events.on('success:confirm', () => modal.close());

// ================== MODAL ==================
events.on('modal:close', () => {
  const selected = productsModel.getSelectedProduct();
  if (selected) productsModel.setSelectedProduct(null);
  modal.close();
});