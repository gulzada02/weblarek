import { EventEmitter } from "../../base/Events";
import { cloneTemplate } from "../../../utils/utils";
import { TPayment } from "../../../types";

export class FormOrderView {
  private container: HTMLElement;
  private events: EventEmitter;
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, events: EventEmitter) {
    this.container = cloneTemplate(template);
    this.events = events;

    this.paymentButtons = this.container.querySelectorAll<HTMLButtonElement>('[data-payment]');
    this.addressInput = this.container.querySelector<HTMLInputElement>('#order-address')!;
    this.submitButton = this.container.querySelector<HTMLButtonElement>('#order-submit')!;

    this.addListeners();
  }

  private addListeners() {
    // Слушаем выбор способа оплаты
    this.paymentButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const payment = btn.dataset.payment as TPayment;
        this.events.emit('form:paymentChanged', { payment });

        // визуально активная кнопка
        this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
        btn.classList.add('button_alt-active');
      });
    });

    // Слушаем изменение адреса
    this.addressInput.addEventListener('input', () => {
      this.events.emit('form:addressChanged', { address: this.addressInput.value });
    });

    // Слушаем сабмит формы
    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('form:orderSubmit');
    });
  }

  // Проверка валидности формы
  checkIsFormValid(errors: Record<string, boolean>): boolean {
    return !Object.values(errors).some(Boolean);
  }

  // Переключение состояния кнопки сабмита
  toggleSubmitButton(isEnabled: boolean) {
    this.submitButton.disabled = !isEnabled;
  }

  // Добавление/удаление класса ошибок
  toggleErrorClass(hasError: boolean) {
    if (hasError) {
      this.container.classList.add('form--error');
    } else {
      this.container.classList.remove('form--error');
    }
  }

  // Визуально активная кнопка оплаты
  togglePaymentButtonStatus(payment: TPayment) {
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.dataset.payment === payment);
    });
  }

  // Сброс формы
  resetFormState() {
    this.addressInput.value = '';
    this.toggleErrorClass(false);
    this.toggleSubmitButton(false);
    this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
  }

  // Возвращает DOM элемента формы
  render(): HTMLElement {
    return this.container;
  }
}
