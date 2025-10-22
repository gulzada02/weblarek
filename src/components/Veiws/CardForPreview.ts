import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { BaseCard } from "./BaseCard";

export class CardForPreview extends BaseCard {
  private button: HTMLButtonElement;
  private _buttonText: string = 'Купить';

  constructor(container: HTMLTemplateElement, events: EventEmitter) {
    super(container, events);

    this.image = ensureElement<HTMLImageElement>('.card__image', this.element);
    this.title = ensureElement<HTMLElement>('.card__title', this.element);
    this.category = ensureElement<HTMLElement>('.card__category', this.element);
    this.price = ensureElement<HTMLElement>('.card__price', this.element);
    this.button = ensureElement<HTMLButtonElement>('.card__button', this.element);

    this.addListeners();
  }

  private addListeners() {
    this.button.addEventListener('click', (e) => {
      e.stopPropagation(); 
      const productId = this.element.dataset.id!;
      this.events.emit('product:submit', { id: productId });
    });
  }

  public toggleButtonState(enabled: boolean) {
    this.button.disabled = !enabled;
  }

  set buttonText(text: string) {
    this._buttonText = text;
    this.button.textContent = text;
  }

  public render(product: IProduct): HTMLElement {
    this.element.dataset.id = product.id;

    this.image.src = `${CDN_URL}/${product.image}`;
    this.image.alt = product.title;
    this.title.textContent = product.title;
    this.category.textContent = categoryMap[product.category as keyof typeof categoryMap] || product.category;
    this.price.textContent = product.price !== null ? `${product.price} синапсов` : 'Нет в наличии';

    this.button.textContent = this._buttonText;
    this.button.disabled = product.price === null;

    return this.element;
  }
}
