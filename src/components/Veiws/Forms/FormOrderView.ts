import { BaseForm } from "../Forms/BaseForm";
import { EventEmitter, IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { TPayment } from "../../../types";
import { IValidationErrors } from "../../../types";
import { AppEvents } from "../../../utils/constants";


export class FormOrderView<T> extends BaseForm<T> {
  private _cardPayButton: HTMLButtonElement
  private _cashPayButton: HTMLButtonElement
  private _address: HTMLInputElement

  constructor(container: HTMLElement, events: IEvents){
    super(container, events)
    this._cardPayButton = ensureElement<HTMLButtonElement>('[name="card"]', container)
    this._cashPayButton = ensureElement<HTMLButtonElement>('[name="cash"]', container)
    this._address = ensureElement<HTMLInputElement>('[name="address"]', container)

    // ------------ LISTENERS ------------
    this._cardPayButton.addEventListener('click', () => {
      this.events.emit(AppEvents.FORM_PAYMENT_CHANGED, { payment: 'card' })
    })

    this._cashPayButton.addEventListener('click', () => {
      this.events.emit(AppEvents.FORM_PAYMENT_CHANGED, { payment: 'cash' })
    })

    this._address.addEventListener('input', () => {
      this.events.emit(AppEvents.FORM_ADDRESS_CHANGED, { address: this._address.value })
    })

    this._cashPayButton.addEventListener('click', (event) => { event.preventDefault()
      this.events.emit(AppEvents.FORM_ORDER_SUBMIT)
    })

    this.container.addEventListener('focusin', (event) => {
      if (event.target instanceof HTMLInputElement)
      this.events.emit(AppEvents.FORM_INPUT_FOCUS)
    })
  }

  protected handleSubmit(event: Event): void {
  event.preventDefault();
  this.events.emit(AppEvents.FORM_ORDER_SUBMIT);
}

  checkIsFormValid(errors: IValidationErrors): boolean {
    this.clear()
    return !errors.payment && !errors.address
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