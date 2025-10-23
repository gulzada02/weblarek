import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { BaseCard } from "./BaseCard";

export class CardForPreview extends BaseCard {
  private image: HTMLImageElement;
  private category: HTMLElement;
  private button: HTMLButtonElement;
  private _buttonText: string = 'Купить';

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.image = ensureElement<HTMLImageElement>('.card__image', this.element);
    this.category = ensureElement<HTMLElement>('.card__category', this.element);
    this.button = ensureElement<HTMLButtonElement>('.card__button', this.element);

    this.addListeners();
  }

  private addListeners() {
    this.button.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = this._id;
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
    this._id = product.id;

    this.image.src = `${CDN_URL}/${product.image}`;
    this.image.alt = product.title;
    this._title.textContent = product.title;
    this.category.textContent =
      categoryMap[product.category as keyof typeof categoryMap] || product.category;
    this._price.textContent =
      product.price !== null ? `${product.price} синапсов` : 'Нет в наличии';

    this.button.textContent = this._buttonText;
    this.button.disabled = product.price === null;

    return this.element;
  }
}
