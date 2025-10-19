import "./scss/styles.scss";
import { Products } from "./components/Models/Products";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { apiProducts } from "./utils/data";
import { ServerService } from "./components/Models/ServerService";
import { Api } from "./components/base/Api";
import { ProductCard } from "./components/view/ProductCard";
import { Modal } from "./components/view/Modal";
import { Page } from "./components/view/Page";
import { API_URL, CDN_URL } from "./utils/constants"; 
import { IProduct } from "./types";

// DOM элементы
const modalRoot = document.getElementById("modal-container") as HTMLElement;
const modalContent = modalRoot.querySelector(".modal__content") as HTMLElement;
const headerBasketBtn = document.querySelector<HTMLElement>(".header__basket")!;
const headerBasketCounter = document.querySelector<HTMLElement>(".header__basket-counter")!;
const gallery = document.querySelector<HTMLElement>("main.gallery")!;

// Модели и сервисы
const modal = new Modal("#modal-container");
const page = new Page<unknown>(document.body, modal);
const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();
const api = new Api(API_URL);
const serverService = new ServerService(api);


// Закрытие модалки по клику
modalRoot.querySelector(".modal__close")?.addEventListener("click", () => modal.close());
modalRoot.addEventListener("click", (e) => {
  if (e.target === modalRoot) modal.close();
});

// --- Главный контроллер приложения ---
const app = {
  updateHeaderCounter: () => {
    headerBasketCounter.textContent = String(cartModel.getItemCount());
  },

  renderGallery: () => {
    page.renderGallery(productsModel, gallery, app.openProductPreview);
  },

  openProductPreview: (product: IProduct) => {
    const template = page.cloneTemplate("card-preview");
    const card = new ProductCard(template, () => {});

    card.setTitle(product.title);
    card.setPrice(product.price);
    
    // корректный путь к картинке через CDN_URL
    const img = product.image.startsWith('/') ? CDN_URL + product.image : product.image;
    card.setCardImage(img);
    card.setCategory(product.category);

    const text = card.element.querySelector(".card__text") as HTMLElement | null;
    const btn = card.element.querySelector(".card__button") as HTMLButtonElement | null;
    if (text) text.textContent = product.description;

    if (btn && product.price !== null) {
      if (cartModel.hasItem(product.id)) {
        btn.textContent = "Удалить из корзины";
        btn.addEventListener("click", () => {
          cartModel.removeItem(product.id);
          page.closePreviewModal();
        });
      } else {
        btn.textContent = "В корзину";
        btn.addEventListener("click", () => {
          cartModel.addItem(product);
          page.closePreviewModal();
        });
      }
    }

    page.openPreviewModal(card.element);
  },

  openCart: () => {
    const basket = page.cloneTemplate("basket");
    const list = basket.querySelector(".basket__list") as HTMLElement;
    const priceEl = basket.querySelector(".basket__price") as HTMLElement;
    const orderBtn = basket.querySelector(".basket__button") as HTMLButtonElement;

    const items = cartModel.getItems();
    if (items.length === 0) {
      list.textContent = "Корзина пуста";
      orderBtn.disabled = true;
      priceEl.textContent = "0 синапсов";
    } else {
      list.replaceChildren();
      items.forEach((it, idx) => {
        const li = page.cloneTemplate("card-basket");
        li.querySelector(".basket__item-index")!.textContent = String(idx + 1);
        li.querySelector(".card__title")!.textContent = it.title;
        
        // --- ДОБАВЛЕНО --- путь к картинке в корзине, если есть img
        const imgEl = li.querySelector("img") as HTMLImageElement | null;
        if (imgEl && it.image) imgEl.src = it.image.startsWith('/') ? CDN_URL + it.image : it.image;

        li.querySelector(".card__price")!.textContent = `${it.price ?? "н/д"} синапсов`;
        li.querySelector(".basket__item-delete")!.addEventListener("click", () => {
          cartModel.removeItem(it.id);
        });
        list.appendChild(li);
      });
      priceEl.textContent = `${cartModel.getTotalPrice()} синапсов`;
      orderBtn.disabled = false;
    }

    orderBtn.addEventListener("click", () => app.openOrderForm(), { once: true });
    page.openPreviewModal(basket);
  },

  openOrderForm: () => {
    const orderNode = page.cloneTemplate("order");
    const paymentButtons = Array.from(orderNode.querySelectorAll(".button.button_alt")) as HTMLButtonElement[];
    const addressInput = orderNode.querySelector('input[name="address"]') as HTMLInputElement;
    const nextBtn = orderNode.querySelector(".order__button") as HTMLButtonElement;
    const errorsEl = orderNode.querySelector(".form__errors") as HTMLElement | null;

    const current = buyerModel.getData();
    if (current.address) addressInput.value = current.address;
    if (current.payment) {
      paymentButtons.forEach((b) => {
        if (b.getAttribute("name") === current.payment) b.classList.add("button_alt-active");
      });
    }

    const validate = () => {
      const data = buyerModel.getData();
      const valid = !!data.payment && !!addressInput.value.trim();
      nextBtn.disabled = !valid;
      if (errorsEl) errorsEl.textContent = "";
    };

    paymentButtons.forEach((btn) =>
      btn.addEventListener("click", () => {
        paymentButtons.forEach((b) => b.classList.remove("button_alt-active"));
        btn.classList.add("button_alt-active");
        buyerModel.setPayment(btn.getAttribute("name") as "card" | "cash");
        validate();
      })
    );

    addressInput.addEventListener("input", () => {
      buyerModel.setAddress(addressInput.value);
      validate();
    });

    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      app.openContactsForm();
    }, { once: true });

    validate();
    page.openPreviewModal(orderNode);
  },

  openContactsForm: () => {
    const contactsNode = page.cloneTemplate("contacts");
    const emailInput = contactsNode.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = contactsNode.querySelector('input[name="phone"]') as HTMLInputElement;
    const payBtn = contactsNode.querySelector('button[type="submit"]') as HTMLButtonElement;
    const errorsEl = contactsNode.querySelector(".form__errors") as HTMLElement | null;

    const validate = () => {
      const e = emailInput.value.trim();
      const p = phoneInput.value.trim();
      const valid = e.length > 0 && p.length > 0;
      payBtn.disabled = !valid;
      if (errorsEl) errorsEl.textContent = "";
    };

    emailInput.addEventListener("input", () => {
      buyerModel.setEmail(emailInput.value);
      validate();
    });
    phoneInput.addEventListener("input", () => {
      buyerModel.setPhone(phoneInput.value);
      validate();
    });

    payBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const errors = buyerModel.validate();
      if (Object.keys(errors).length > 0) {
        if (errorsEl) errorsEl.textContent = Object.values(errors).join("; ");
        return;
      }

      const total = cartModel.getTotalPrice();
      try {
        cartModel.clear();
        buyerModel.clear();
        app.showSuccess(total);
      } catch (err) {
        if (errorsEl) errorsEl.textContent = "Ошибка при отправке заказа.";
      }
    }, { once: true });

    validate();
    page.openPreviewModal(contactsNode);
  },

  showSuccess: (total: number) => {
    const node = page.cloneTemplate("success");
    node.querySelector(".order-success__description")!.textContent = `Списано ${total.toLocaleString("ru-RU")} синапсов`;
    node.querySelector(".order-success__close")!.addEventListener("click", () => {
      page.closePreviewModal();
      app.renderGallery();
    });
    page.openPreviewModal(node);
  }
};

// Подписки на события моделей
productsModel.on("products:change", app.renderGallery);
productsModel.on("product:selected", app.openProductPreview);
cartModel.on("cart:change", () => {
  app.updateHeaderCounter();
  if (modalRoot.classList.contains("modal_active") && modalContent.querySelector(".basket")) {
    app.openCart();
  }
});
buyerModel.on("buyer:change", () => {});

// Открытие корзины
headerBasketBtn.addEventListener("click", () => app.openCart());

// Загрузка каталога
serverService.fetchProducts()
  .then((products) => productsModel.setProducts(products))
  .catch((err) => {
    console.warn("Failed to fetch products, fallback to local data", err);
    productsModel.setProducts(apiProducts.items);
  });
