import { IProduct } from "../../types";
import { EventEmitter, IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { BaseCard } from "./BaseCard";

export class CardForCatalog extends BaseCard {
  private imageElement: HTMLImageElement;
  private category: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this.category = ensureElement<HTMLElement>('.card__category', container);
  }

  set image(src: string){
    this.setImage(
      this.imageElement,
      CDN_URL + `${src}`,
      this._title.textContent
    )
  }
}
