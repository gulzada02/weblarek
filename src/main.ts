import './scss/styles.scss';

// ================== CONSTANTS & UTILS ==================
import { categoryMap, API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// ================== EVENT EMITTER ==================
import { EventEmitter } from './components/base/Events';
export const events = new EventEmitter();

// ================== MODELS ==================
import { Products, IProduct } from './types'; 
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

// ================== API ==================
import { Api } from './components/base/Api';
const apiClient = new Api(API_URL);

// ================== VIEWS ==================
import { GalleryView } from './components/Veiws/GalleryView';
import { ModalView } from './components/Veiws/ModalView';
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
const modalElement = ensureElement<HTMLElement>(".modal");

// ================== MODELS ==================
const productsModel = new Products();
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

// ================== VIEWS ==================
const galleryView = new GalleryView(galleryElement);
const headerView = new HeaderView(headerElement, events);
const modalView = new ModalView(modalElement, events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), events);
const formOrderView = new FormOrderView(cloneTemplate(formOrderTemplate), events);
const formContactsView = new FormContactsView(cloneTemplate(formContactsTemplate), events);

// ================== INITIAL DATA ==================
apiClient.getAllProducts()
  .then((products: IProduct[]) => productsModel.setProducts(products))
  .catch(err => console.error('Ошибка загрузки товаров:', err));

// ================== PRODUCTS EVENTS ==================
productsModel.on('products:change', (products: IProduct[]) => {
  const cards = products.map(product =>
    new CardForCatalog(cloneTemplate(cardForCatalogTemplate), events, CDN_URL, categoryMap).render(product)
  );
  galleryView.galleryList = cards;
});

productsModel.on('product:selected', (product: IProduct) => {
  const card = new CardForPreview(cloneTemplate(cardForPreviewTemplate), events, CDN_URL, categoryMap);

  if (product.price === null) card.toggleButtonState(false);
  else if (basketModel.isInBasket(product.id)) card.buttonText = 'Удалить из корзины';
  else card.buttonText = 'Купить';

  modalView.open(card.render(product));
});

// ================== USER INTERACTIONS ==================
events.on('product:select', ({ id }: { id: string }) => {
  const product = productsModel.getProductById(id);
  if (product) productsModel.setSelectedProduct(product);
});

events.on('product:submit', ({ id }: { id: string }) => {
  const product = productsModel.getProductById(id);
  if (!product) return;

  if (!basketModel.isInBasket(id)) basketModel.addProduct(product);
  else basketModel.removeProduct(product);

  modalView.close();
});

events.on('basket:listChange', (data: { purchases: IProduct[], totalPrice: number, quantity: number }) => {
  const cards = data.purchases.map((product, index) =>
    new CardForBasket(cloneTemplate(cardForBasketTemplate), events, index + 1).render(product)
  );

  basketView.basketList = cards;
  basketView.totalPrice = data.totalPrice;
  basketView.setEmptyMessage(data.quantity > 0);
  basketView.toggleSubmitButton(data.quantity > 0);
  headerView.counter = data.quantity;
});

events.on('basket:open', () => {
  const hasProducts = basketModel.getQuantity() > 0;
  basketView.toggleSubmitButton(hasProducts);
  basketView.setEmptyMessage(hasProducts);
  modalView.open(basketView.render());
});

events.on('product:delete', ({ id }: { id: string }) => {
  const product = productsModel.getProductById(id);
  if (product) basketModel.removeProduct(product);
});

events.on('basket:placeOrder', () => modalView.content = formOrderView.render());

// ================== FORMS ==================
events.on('form:paymentChanged', ({ payment }: { payment: string }) => buyerModel.setPayment(payment));
events.on('form:addressChanged', ({ address }: { address: string }) => buyerModel.setAddress(address));
events.on('form:orderSubmit', () => modalView.content = formContactsView.render());
events.on('form:emailChanged', ({ email }: { email: string }) => buyerModel.setEmail(email));
events.on('form:phoneChanged', ({ phone }: { phone: string }) => buyerModel.setPhone(phone));

// ================== SUCCESS / MODAL ==================
events.on('success:confirm', () => modalView.close());
events.on('modal:close', () => {
  productsModel.setSelectedProduct(null);
  modalView.close();
});
