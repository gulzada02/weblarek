import './scss/styles.scss';
import { Products } from './components/base/Models/Products';
import { Cart } from './components/base/Models/Cart';
import { Buyer } from './components/base/Models/Buyer';
import { apiProducts } from './utils/data';
import { ServerService } from './components/base/Models/ServerService';
import { Api } from './components/base/Api'; 
import { ProductCard } from './view/ProductCard';

import { CDN_URL, categoryMap, API_URL } from './utils/constants';
import { IProduct, IOrderRequest } from './types';

//DOM 
const gallery = document.querySelector<HTMLElement>('main.gallery')!;
const modalRoot = document.getElementById('modal-container') as HTMLElement;
const modalCloseBtn = modalRoot.querySelector('.modal__close') as HTMLElement;
const modalContent = modalRoot.querySelector('.modal__content') as HTMLElement;
const headerBasketBtn = document.querySelector<HTMLElement>('.header__basket')!;
const headerBasketCounter = document.querySelector<HTMLElement>('.header__basket-counter')!;



function cloneTemplate(id: string): HTMLElement {
  const tpl = document.getElementById(id) as HTMLTemplateElement | null;
  if (!tpl) throw new Error(`Template #${id} not found`);
  return tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
}

function openModal(node: HTMLElement) {
  modalContent.replaceChildren(node);
  modalRoot.classList.add('modal_active'); 
  document.body.classList.add('no-scroll');
}
function closeModal() {
  modalRoot.classList.remove('modal_active');
  modalContent.replaceChildren();
  document.body.classList.remove('no-scroll');
}

modalCloseBtn.addEventListener('click', () => closeModal());
modalRoot.addEventListener('click', (e) => {
  if (e.target === modalRoot) closeModal();
});

//models & service 
const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

const api = new Api(API_URL);
const serverService = new ServerService(api);

//UI update helpers
function updateHeaderCounter() {
  headerBasketCounter.textContent = String(cartModel.getItemCount());
}

// render gallery changes
function renderGallery() {
  const products = productsModel.getProducts();
  
  
  const nodes: HTMLElement[] = products.map(p => {
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    const card = new ProductCard(template, () => openProductPreview(p));

    card.setTitle(p.title);
    card.setPrice(p.price);
    card.setCategory(p.category);
    card.setImage(p.image);

    return card.element;
  });

  gallery.replaceChildren(...nodes);
}


//product preview 
function openProductPreview(product: IProduct) {
  const template = document.getElementById('card-preview') as HTMLTemplateElement;
  const card = new ProductCard(template, () => {}); 

  card.setTitle(product.title);
  card.setPrice(product.price);
  card.setImage(`${CDN_URL}/${product.image}`);
  card.setCategory(product.category);

  const text = card.element.querySelector('.card__text') as HTMLElement | null;
  const btn = card.element.querySelector('.card__button') as HTMLButtonElement | null;

  if (text) text.textContent = product.description;

  if (btn && product.price !== null) {
    if (cartModel.hasItem(product.id)) {
      btn.textContent = 'Удалить из корзины';
      btn.addEventListener('click', () => {
        cartModel.removeItem(product.id);
        closeModal(); 
      });
    } else {
      btn.textContent = 'В корзину';
      btn.addEventListener('click', () => {
        cartModel.addItem(product);
        closeModal(); 
      });
    }
  }

  openModal(card.element);
}



//open cart modal
function openCart() {
  const basket = cloneTemplate('basket');
  const list = basket.querySelector('.basket__list') as HTMLElement;
  const priceEl = basket.querySelector('.basket__price') as HTMLElement;
  const orderBtn = basket.querySelector('.basket__button') as HTMLButtonElement;

  const items = cartModel.getItems();
  if (items.length === 0) {

    list.textContent = 'Корзина пуста';
    orderBtn.disabled = true;
    if (priceEl) priceEl.textContent = '0 синапсов';
  } else {
    list.replaceChildren(); 
    items.forEach((it, idx) => {
      const li = cloneTemplate('card-basket');
      const indexEl = li.querySelector('.basket__item-index') as HTMLElement | null;
      const titleEl = li.querySelector('.card__title') as HTMLElement | null;
      const priceItemEl = li.querySelector('.card__price') as HTMLElement | null;
      const delBtn = li.querySelector('.basket__item-delete') as HTMLButtonElement | null;

      if (indexEl) indexEl.textContent = String(idx + 1);
      if (titleEl) titleEl.textContent = it.title;
      if (priceItemEl) priceItemEl.textContent = `${it.price ?? 'н/д'} синапсов`;
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          cartModel.removeItem(it.id);
        });
      }

      list.appendChild(li);
    });

    if (priceEl) priceEl.textContent = `${cartModel.getTotalPrice()} синапсов`;
    orderBtn.disabled = false;
  }

  //order button opens order form
  orderBtn.addEventListener('click', () => {
    openOrderForm();
  }, { once: true }); 

  openModal(basket);
}

//order form 
function openOrderForm() {
  const orderNode = cloneTemplate('order'); 
  const paymentButtons = Array.from(orderNode.querySelectorAll('.button.button_alt')) as HTMLButtonElement[];
  const addressInput = orderNode.querySelector('input[name="address"]') as HTMLInputElement;
  const nextBtn = orderNode.querySelector('.order__button') as HTMLButtonElement;
  const errorsEl = orderNode.querySelector('.form__errors') as HTMLElement | null;

  const current = buyerModel.getData();
  if (current.address && addressInput) addressInput.value = current.address;
  if (current.payment) {
    paymentButtons.forEach(b => {
      if (b.getAttribute('name') === current.payment) {
        b.classList.add('button_alt-active');
      }
    });
  }

  //payment selection
  paymentButtons.forEach(btn => {
    btn.addEventListener('click', () => {

      paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
      btn.classList.add('button_alt-active');

      const chosen = btn.getAttribute('name') as ('card'|'cash') | null;
      if (chosen) buyerModel.setPayment(chosen);
      checkStep1Validity();
    });
  });

  //address input
  addressInput.addEventListener('input', () => {
    buyerModel.setAddress(addressInput.value);
    checkStep1Validity();
  });

  function checkStep1Validity() {
    const data = buyerModel.getData();
    const valid = !!data.payment && !!(addressInput.value && addressInput.value.trim().length > 0);
    nextBtn.disabled = !valid;
    if (errorsEl) errorsEl.textContent = '';
  }

  checkStep1Validity();

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openContactsForm();
  }, { once: true });

  openModal(orderNode);
}

//contacts form 
function openContactsForm() {
  const contactsNode = cloneTemplate('contacts');
  const emailInput = contactsNode.querySelector('input[name="email"]') as HTMLInputElement;
  const phoneInput = contactsNode.querySelector('input[name="phone"]') as HTMLInputElement;
  const payBtn = contactsNode.querySelector('button[type="submit"]') as HTMLButtonElement;
  const errorsEl = contactsNode.querySelector('.form__errors') as HTMLElement | null;
 


  const cur = buyerModel.getData();
  if (cur.email && emailInput) emailInput.value = cur.email;
  if (cur.phone && phoneInput) phoneInput.value = cur.phone;

  function checkStep2Validity() {
    const e = emailInput.value.trim();
    const p = phoneInput.value.trim();
    const valid = e.length > 0 && p.length > 0;
    payBtn.disabled = !valid;
    if (errorsEl) errorsEl.textContent = '';
  }

  emailInput.addEventListener('input', () => {
    buyerModel.setEmail(emailInput.value);
    checkStep2Validity();
  });
  phoneInput.addEventListener('input', () => {
    buyerModel.setPhone(phoneInput.value);
    checkStep2Validity();
  });

  payBtn.addEventListener('click', async (ev) => {
    ev.preventDefault();

    const errors = buyerModel.validate();
    if (Object.keys(errors).length > 0) {
      if (errorsEl) errorsEl.textContent = Object.values(errors).join('; ');
      return;
    }

    const total = cartModel.getTotalPrice(); 

    /* const order: IOrderRequest = {
      buyer: buyerModel.getData(),
      items: cartModel.getItems()
    };*/ 

    try {
      //await serverService.sendOrder(order);
      cartModel.clear();
      buyerModel.clear();
      showSuccess(total);

    } catch (err) {
      console.error('Order send failed', err);
      if (errorsEl) errorsEl.textContent = 'Ошибка при отправке заказа. Попробуйте позже.';
    }
  }, { once: true });

  openModal(contactsNode);
}

function showSuccess(total:number) {
  const node = cloneTemplate('success');
  const description = node.querySelector('.order-success__description') as HTMLElement | null;
  const closeBtn = node.querySelector('.order-success__close') as HTMLButtonElement | null;

   if (description) {
    description.textContent = `Списано ${total.toLocaleString('ru-RU')} синапсов`;
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeModal();
      renderGallery();
    });
  }
  openModal(node);
}

//model event
productsModel.on('products:change', () => {
  renderGallery();
});

productsModel.on('product:selected', (product: IProduct) => {
  openProductPreview(product);
});

cartModel.on('cart:change', () => {
  updateHeaderCounter();
  if (modalRoot.classList.contains('modal_active') && modalContent.querySelector('.basket')) {
    openCart();
  }
});

buyerModel.on('buyer:change', () => {
});

headerBasketBtn.addEventListener('click', () => openCart());

(async function loadCatalog() {
  try {
    const products = await serverService.fetchProducts();
    productsModel.setProducts(products);
  } catch (err) {
    console.warn('Failed to fetch products from server, fallback to local data', err);
    productsModel.setProducts(apiProducts.items);
  }
})();

updateHeaderCounter();
