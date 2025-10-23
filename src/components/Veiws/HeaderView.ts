import { IHeaderData } from "../../types";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export class HeaderView extends Component<IHeaderData> {
  private header: HTMLElement;
  private basketButton: HTMLElement;
  private basketCounter: HTMLElement;
  private events: EventEmitter;

  constructor(header: HTMLElement, events: EventEmitter) {
    super(header);
    this.header = header;
    this.events = events;

    // корзинка и счётчик
    this.basketButton = this.header.querySelector<HTMLElement>('.header__basket') as HTMLElement;
    this.basketCounter = this.header.querySelector<HTMLElement>('.header__basket-counter') as HTMLElement;


    // обработчик на кнопку корзины
    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  // количество товаров в корзине
  set counter(value: number) {
    this.basketCounter.textContent = String(value);
  }
}
