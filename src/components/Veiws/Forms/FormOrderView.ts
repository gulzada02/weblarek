import { BaseForm } from "../Forms/BaseForm";
import { EventEmitter } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { TPayment } from "../../../types";

export class FormOrderView extends BaseForm {
  private events: EventEmitter;
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super( '#order');
    this.events = events;

    this.paymentButtons = Array.from(container.querySelectorAll<HTMLButtonElement>('[data-payment]'));
    this.addressInput = ensureElement<HTMLInputElement>('#order-address', container);

    this.addListeners();
  }

  private addListeners() {
    this.paymentButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const payment = btn.dataset.payment as TPayment;
        this.events.emit('form:paymentChanged', { payment });

        this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
        btn.classList.add('button_alt-active');
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit('form:addressChanged', { address: this.addressInput.value });
    });
  }

  public handleSubmit(event: Event): void {
    event.preventDefault();
    this.events.emit('form:orderSubmit');
  }

  public togglePaymentButtonStatus(payment: TPayment) {
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.dataset.payment === payment);
    });
  }

  public validate(errors: Record<string, boolean>): boolean {
  return this.checkIsFormValid(errors);
  }

  public setSubmitButton(enabled: boolean) {
    this.toggleSubmitButton(enabled);
  }

  public reset(): void {
    this.resetFormState();
  }
}