import { EventEmitter } from "../base/Events";
import { IProduct } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";

export class CardForCatalog {
  private container: HTMLElement;
  private imgEl: HTMLImageElement;
  private titleEl: HTMLElement;
  private categoryEl: HTMLElement;
  private priceEl: HTMLElement;
  private buttonEl: HTMLButtonElement;
  private events: EventEmitter;

  constructor(template: HTMLTemplateElement, events: EventEmitter) {
    this.container = cloneTemplate(template);
    this.events = events;

    this.imgEl = this.container.querySelector<HTMLImageElement>('.card__img')!;
    this.titleEl = this.container.querySelector<HTMLElement>('.card__title')!;
    this.categoryEl = this.container.querySelector<HTMLElement>('.card__category')!;
    this.priceEl = this.container.querySelector<HTMLElement>('.card__price')!;
    this.buttonEl = this.container.querySelector<HTMLButtonElement>('.card__btn')!;

    this.addListeners();
  }

  private addListeners() {
    // Клик по всей карточке для открытия модалки
    this.container.addEventListener('click', (e) => {
      const id = this.container.dataset.id;
      if (!id) return;
      // Если клик по кнопке "Купить", это отдельное событие
      if (e.target === this.buttonEl && !this.buttonEl.disabled) {
        this.events.emit('product:submit', { id });
      } else {
        this.events.emit('product:select', { id });
      }
    });
  }

  public render(product: IProduct): HTMLElement {
    this.container.dataset.id = product.id;
    this.imgEl.src = `${CDN_URL}/${product.image}`;
    this.imgEl.alt = product.title;
    this.titleEl.textContent = product.title;
    this.categoryEl.textContent = categoryMap[product.category as keyof typeof categoryMap] || product.category;
    this.priceEl.textContent = product.price !== null ? `${product.price} ₽` : 'Нет в наличии';

    this.buttonEl.disabled = product.price === null;
    this.buttonEl.textContent = product.price === null ? 'Недоступно' : 'Купить';

    return this.container;
  }
}
