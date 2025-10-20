import { EventEmitter } from "../base/Events";


export class SuccessView {
  private container: HTMLElement;
  private events: EventEmitter;
  private button: HTMLButtonElement;
  private totalPriceElement: HTMLElement;

  private _totalPrice: number = 0;

  constructor(template: HTMLTemplateElement, events: EventEmitter) {
    this.container = (template);
    this.events = events;

    this.button = this.container.querySelector<HTMLButtonElement>('.success__button')!;
    this.totalPriceElement = this.container.querySelector<HTMLElement>('.success__total-price')!;

    this.button.addEventListener('click', () => {
      this.events.emit('success:confirm');
    });
  }

  set totalPrice(value: number) {
    this._totalPrice = value;
    this.totalPriceElement.textContent = `${value} ₽`;
  }

  get totalPrice(): number {
    return this._totalPrice;
  }

  // Возвращает отрендеренный элемент
  render(): HTMLElement {
    this.totalPriceElement.textContent = `${this._totalPrice} ₽`;
    return this.container;
  }
}
