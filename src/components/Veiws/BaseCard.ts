import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IProduct } from "../../types";

export abstract class BaseCard extends Component<IProduct> {
  protected element: HTMLElement;
  protected events: IEvents;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected product?: IProduct;

  constructor(container: HTMLElement, events: IEvents) {
    super(container)
    this.id = ''
    this._title = ensureElement<HTMLElement>('.card__title', container)
    this._price = ensureElement<HTMLElement>('.card__price', container)
    this.element = container
    this.events = events
  }
  set id(value: string){
    this.id = value
  }

  set title(value: string){
    this._title.textContent = value
  }

  set price(value: number | null){
    this._price.textContent = value !== null ? `${value} синапсов` : 'Бесценно'
  }
}
