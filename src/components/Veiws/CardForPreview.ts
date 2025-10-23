import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";
import { BaseCard } from "./BaseCard";

export class CardForPreview extends BaseCard {
  private imageElement: HTMLImageElement;
  private category: HTMLElement;
  private button: HTMLButtonElement;
  private descriptionElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this.category = ensureElement<HTMLElement>('.card__category', container);
    this.button = ensureElement<HTMLButtonElement>('.card__button', container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);

    this.button.addEventListener('click', () => {
      this.events.emit('product:submit', {id: this._id})
    })
  }

  set image(src: string) {
  this.setImage(
      this.imageElement,
      CDN_URL + `${src}`,
      this._title.textContent
    )
  }

  set description(text: string) {
    this.descriptionElement.textContent = text
  }

  toggleButtonState(enabled: boolean) {
    this.button.disabled = !enabled;
  }

  set buttonText(text: string) {
    this.button.textContent = text;
  }

}
