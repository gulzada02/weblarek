import { BaseForm } from "../Forms/BaseForm";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { TPayment } from "../../../types";

export class FormOrderView extends BaseForm {
  private _cardPayButton: HTMLButtonElement
  private _cashPayButton: HTMLButtonElement
  private _address: HTMLInputElement

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)
    this._cardPayButton = ensureElement<HTMLButtonElement>('[name="card"]', container)
    this._cashPayButton = ensureElement<HTMLButtonElement>('[name="cash"]', container)
    this._address = ensureElement<HTMLInputElement>('[name="address"]', container)

    this._cardPayButton.addEventListener('click', () => {
      this.events.emit('card:select', { payment: 'card' })
    })

    this._cashPayButton.addEventListener('click', () => {
      this.events.emit('cash:select', { payment: 'cash' })
    })

    this._address.addEventListener('input', () => {
      this.events.emit('address:input', { address: this._address.value })
    })

    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('form:order:submit')
    })
  }
  
  protected handleSubmit(event: Event): void {
  event.preventDefault();
  this.events.emit('form:order:submit');
}

  resetFormState(): void {
    super.resetFormState()
    this.clear()
    this._cardPayButton.classList.remove('button_alt-active')
    this._cashPayButton.classList.remove('button_alt-active')
  }

  togglePaymentButtonStatus(status: TPayment): void {
    this._cardPayButton.classList.toggle('button_alt-active', status === 'card')
    this._cashPayButton.classList.toggle('button_alt-active', status === 'cash')
  }

  clear(): void {
    this._address.value = ''
  }
}