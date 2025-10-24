import { BaseForm } from "../Forms/BaseForm";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { TPayment } from "../../../types";

export class FormOrderView extends BaseForm {
  private _cardPayButton: HTMLButtonElement
  private _cashPayButton: HTMLButtonElement
  private _address: HTMLInputElement
  private _selectedPayment?: TPayment;


  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)
    this._cardPayButton = ensureElement<HTMLButtonElement>('[name="card"]', container)
    this._cashPayButton = ensureElement<HTMLButtonElement>('[name="cash"]', container)
    this._address = ensureElement<HTMLInputElement>('[name="address"]', container)
    this.error = ensureElement<HTMLElement>('.form__errors', container);

    this.submitButton.disabled = true;

     this._cardPayButton.addEventListener("click", () => {
      this._selectedPayment = "card";
      this.togglePaymentButtonStatus("card");
      this.events.emit("form:paymentChanged", { payment: "card" });
      this.validateForm();
    });

      this._cashPayButton.addEventListener("click", () => {
      this._selectedPayment = "cash";
      this.togglePaymentButtonStatus("cash");
      this.events.emit("form:paymentChanged", { payment: "cash" });
      this.validateForm();
    });

    this._address.addEventListener('input', () => {
      this.events.emit('address:input', { address: this._address.value })
      this.validateForm();
    })

    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('form:orderSubmit',{
        payment: this._selectedPayment,
        address: this._address.value.trim(),
      });
    });
  }

  private validateForm(): boolean {
    let isValid = true;

      if (!this._address.value.trim()) {
      this.error.textContent = 'Необходимо указать адрес';
      isValid = false;
    } else {
      this.error.textContent = '';
    }

     if (!this._selectedPayment) {
      isValid = false;
    }

    this.submitButton.disabled = !isValid;

    return isValid;
  }
  
  protected handleSubmit(event: Event): void {
  event.preventDefault();
  this.events.emit('form:order:submit');
}

  resetFormState(): void {
    super.resetFormState()
    this.clear()
    this._selectedPayment = undefined;
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