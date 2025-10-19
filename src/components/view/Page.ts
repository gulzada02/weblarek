
import { Component } from '../base/Component';
import { Modal } from '../view/Modal';
import { ProductCard } from '../view/ProductCard';
import { IProduct } from '../../types';

export class Page<T> extends Component<T> {
  private modal: Modal;

  constructor(container: HTMLElement, modal: Modal) {
    super(container);
    this.modal = modal;
  }

  cloneTemplate(templateId: string): HTMLTemplateElement {
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    if (!template) {
      throw new Error(`Template with id "${templateId}" not found`);
    }
    return template
  } 

  openProductPreview(product: IProduct, cartModel: { hasItem: (id: string) => boolean; addItem: (p: IProduct) => void; removeItem: (id: string) => void; }) {
    const template = document.getElementById("card-preview") as HTMLTemplateElement;
    const card = new ProductCard(template, () => {});
    card.setTitle(product.title);
    card.setPrice(product.price);
    const img = product.image.startsWith('/') ? product.image.slice(1) : product.image;
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
          this.closePreviewModal();
        });
      } else {
        btn.textContent = "В корзину";
        btn.addEventListener("click", () => {
          cartModel.addItem(product);
          this.closePreviewModal();
        });
      }
    }
    this.openPreviewModal(card.element);
  }

  renderGallery(
    productsModel: { getProducts: () => IProduct[] },
    galleryEl: HTMLElement,
    openProductPreview: (product: IProduct) => void
  ) {
    const products = productsModel.getProducts();
    const nodes: HTMLElement[] = products.map((p) => {
      const template = document.getElementById("card-catalog") as HTMLTemplateElement;
      const card = new ProductCard(template, () => openProductPreview(p));
      card.setTitle(p.title);
      card.setPrice(p.price);
      card.setCategory(p.category);
      const img = p.image.startsWith('/') ? p.image.slice(1) : p.image;
  card.setCardImage(img);
      return card.element;
    });
    galleryEl.replaceChildren(...nodes);
  }

  openPreviewModal(content: HTMLElement): void {
    this.modal.show(content);
  }

  closePreviewModal(): void {
    this.modal.close();
  }

  openCartModal(content: HTMLElement): void {
    this.modal.show(content);
  }

  closeCartModal(): void {
    this.modal.close();
  }

  openOrderFormModal(content: HTMLElement): void {
    this.modal.show(content);
  }

  closeOrderFormModal(): void {
    this.modal.close();
  }

  openContactFormModal(content: HTMLElement): void {
    this.modal.show(content);
  }

  closeContactFormModal(): void {
    this.modal.close();
  }

  showSuccsess(content: HTMLElement): void {
    this.modal.show(content);
  }

  closeSuccsess(): void {
    this.modal.close();
  }


}






