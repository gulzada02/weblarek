import { EventEmitter } from "../base/Events";
import { IProduct } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";

export class CardForBasket {
  private container: HTMLElement;
  private events: EventEmitter;
  private imgEl: HTMLImageElement;
  private titleEl: HTMLElement;
  private priceEl: HTMLElement;
  private deleteBtn: HTMLButtonElement;
  public index: number = 0;

  constructor(template: HTMLTemplateElement, events: EventEmitter) {
    this.container = cloneTemplate(template);
    this.events = events;

    this.imgEl = this.container.querySelector<HTMLImageElement>('.basket__img')!;
    this.titleEl = this.container.querySelector<HTMLElement>('.basket__title')!;
    this.priceEl = this.container.querySelector<HTMLElement>('.basket__price')!;
    this.deleteBtn = this.container.querySelector<HTMLButtonElement>('.basket__delete')!;

    this.addListeners();
  }

  private addListeners() {
    this.deleteBtn.addEventListener('click', () => {
      const productId = this.container.dataset.id!;
      this.events.emit('product:delete', { id: productId });
    });
  }

  public render(product: IProduct): HTMLElement {
    this.container.dataset.id = product.id;
    this.imgEl.src = `${CDN_URL}/${product.image}`;
    this.imgEl.alt = product.title;
    this.titleEl.textContent = `${this.index}. ${product.title}`;
    this.priceEl.textContent = product.price !== null ? `${product.price} ₽` : 'Нет в наличии';

    return this.container;
  }
}
 