import { EventEmitter } from "../base/Events";
import { IProduct } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";

export class CardForPreview {
  private container: HTMLElement;
  private events: EventEmitter;
  private imgEl: HTMLImageElement;
  private titleEl: HTMLElement;
  private categoryEl: HTMLElement;
  private priceEl: HTMLElement;
  private buttonEl: HTMLButtonElement;
  private _buttonText: string = 'Купить';

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
    this.buttonEl.addEventListener('click', () => {
      const productId = this.container.dataset.id!;
      this.events.emit('product:submit', { id: productId });
    });
  }

  public toggleButtonState(enabled: boolean) {
    this.buttonEl.disabled = !enabled;
  }

  set buttonText(text: string) {
    this._buttonText = text;
    this.buttonEl.textContent = text;
  }

  public render(product: IProduct): HTMLElement {
    this.container.dataset.id = product.id;
    this.imgEl.src = `${CDN_URL}/${product.image}`;
    this.imgEl.alt = product.title;
    this.titleEl.textContent = product.title;
    this.categoryEl.textContent = categoryMap[product.category as keyof typeof categoryMap] || product.category;
    this.priceEl.textContent = product.price !== null ? `${product.price} ₽` : 'Нет в наличии';

    this.buttonEl.textContent = this._buttonText;
    this.buttonEl.disabled = product.price === null;

    return this.container;
  }
}
