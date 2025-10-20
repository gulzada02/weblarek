import { EventEmitter } from "../base/Events";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class BasketView {
  private container: HTMLElement;
  private events: EventEmitter;
  private listContainer: HTMLElement;
  private totalPriceElement: HTMLElement;
  private submitButton: HTMLButtonElement;
  private emptyMessage: HTMLElement;

  private _basketList: HTMLElement[] = [];
  private _totalPrice: number = 0;

  constructor(container: HTMLElement, events: EventEmitter) {
    this.container = container;
    this.events = events;

    this.listContainer = this.container.querySelector<HTMLElement>('.basket__list')!;
    this.totalPriceElement = this.container.querySelector<HTMLElement>('.basket__total-price')!;
    this.submitButton = this.container.querySelector<HTMLButtonElement>('.basket__submit')!;
    this.emptyMessage = this.container.querySelector<HTMLElement>('.basket__empty')!;

    // Навешиваем обработчик на кнопку оформления заказа
    this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.submitButton.addEventListener('click', () => {
      this.events.emit('basket:placeOrder');
    });

  }

  // Рендер списка карточек корзины
  set basketList(cards: HTMLElement[]) {
    this._basketList = cards;
    this.renderList();
  }

  get basketList(): HTMLElement[] {
    return this._basketList;
  }

  // Общая сумма
  set totalPrice(value: number) {
    this._totalPrice = value;
    this.totalPriceElement.textContent = `${value} ₽`;
  }

  get totalPrice(): number {
    return this._totalPrice;
  }

  // Показываем или скрываем сообщение "Корзина пуста"
  setEmptyMessage(hasItems: boolean) {
    if (hasItems) {
      this.emptyMessage.style.display = 'none';
    } else {
      this.emptyMessage.style.display = 'block';
    }
  }

  // Активируем или деактивируем кнопку сабмита
  toggleSubmitButton(enabled: boolean) {
    this.submitButton.disabled = !enabled;
  }

  // Отрендерить список карточек
  private renderList() {
    this.listContainer.innerHTML = '';
    this._basketList.forEach(card => {
      this.listContainer.appendChild(card);
    });
  }

  // Полный рендер корзины
  render(): HTMLElement {
    this.renderList();
    this.totalPriceElement.textContent = `${this._totalPrice} ₽`;
    return this.container;
  }
}
