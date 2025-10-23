import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IProduct } from "../../types";

export abstract class BaseCard extends Component<IProduct> {
  protected _id: string;
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this._id = ''
    this._title = ensureElement<HTMLElement>('.card__title', container)
    this._price = ensureElement<HTMLElement>('.card__price', container)
  }
  set id(value: string){
    this._id = value
  }

  set title(value: string){
    this._title.textContent = value
  }

  set price(value: number | null){
    this._price.textContent = value !== null ? `${value} синапсов` : 'Бесценно'
  }
}
