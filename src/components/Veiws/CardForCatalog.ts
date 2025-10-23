import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { BaseCard } from "./BaseCard";


export class CardForCatalog extends BaseCard {
  private _image: HTMLImageElement;
  private category: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this.category = ensureElement<HTMLElement>('.card__category', container);
  
    this.container.addEventListener('click', () => {
      this.events.emit('product:select', {id: this._id});
    });
  }

  set image(src: string){
    this.setImage(
      this._image, CDN_URL + `${src.slice(0, -3)+'png'}`,
      this._title.textContent
    )
  }

  set categoryText(value: string){
    this.category.textContent = categoryMap[value as keyof typeof categoryMap] || value,
    this.category.title = value, 
    this.category.dataset.category = value,
    this.category.className = `card__category card__category--${value.toLowerCase()}`,
    this.element.dataset.category = value
  }

  set productData(product: IProduct){
    this.product = product,
    this.id = product.id, 
    this.title = product.title,
    this.price = product.price,
    this.image = product.image,
    this.categoryText = product.category
  }

  set altText(value: string){
    this._image.alt = value
  }

  set buttonText(value: string){  
    this.buttonText = value;
  }
}
