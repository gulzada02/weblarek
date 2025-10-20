// src/components/Views/HeaderView.ts
import { EventEmitter } from "../base/Events";

export class HeaderView {
  private header: HTMLElement;
  private basketButton: HTMLElement;
  private basketCounter: HTMLElement;
  private events: EventEmitter;

  constructor(header: HTMLElement, events: EventEmitter) {
    this.header = header;
    this.events = events;

    // Находим кнопку корзины и счётчик
    this.basketButton = this.header.querySelector<HTMLElement>('.header__basket')!;
    this.basketCounter = this.header.querySelector<HTMLElement>('.header__basket-counter')!;

    // Навешиваем обработчик на кнопку корзины
    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  // Свойство для количества товаров в корзине
  set counter(value: number) {
    this.basketCounter.textContent = String(value);
  }

  get counter(): number {
    return parseInt(this.basketCounter.textContent || '0', 10);
  }
}
