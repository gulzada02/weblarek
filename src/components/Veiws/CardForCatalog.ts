import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { BaseCard } from "./BaseCard";

export class CardForCatalog extends BaseCard {
  constructor(template: HTMLTemplateElement, events: EventEmitter) {
    super(template, events);

    this.image = ensureElement<HTMLImageElement>('.card__image', this.element);
    this.title = ensureElement<HTMLElement>('.card__title', this.element);
    this.category = ensureElement<HTMLElement>('.card__category', this.element);
    this.price = ensureElement<HTMLElement>('.card__price', this.element);

    this.addListeners();
  }

  private addListeners() {
    this.element.addEventListener('click', () => {
      const id = this.element.dataset.id;
      if (id) this.events.emit('product:select', { id });
    });
  }

  public render(product: IProduct): HTMLElement {
    this.element.dataset.id = product.id;

    this.image.src = `${CDN_URL}/${product.image}`;
    this.image.alt = product.title;
    this.title.textContent = product.title;
    this.category.textContent = categoryMap[product.category as keyof typeof categoryMap] || product.category;
    this.price.textContent = product.price !== null ? `${product.price} синапсов` : 'Нет в наличии';

    return this.element;
  }
}
