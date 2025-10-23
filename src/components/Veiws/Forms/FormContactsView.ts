import { BaseForm } from "../Forms/BaseForm";
import { EventEmitter } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { AppEvents } from "../../../utils/constants";

export class FormContactsView<T> extends BaseForm<T> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>('[name=email]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('[name=phone]', container);

    this.addListeners();
  }

  private addListeners() {
    this.emailInput.addEventListener('input', () => {
      this.events.emit('form:emailChanged', { email: this.emailInput.value });
    });

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('form:phoneChanged', { phone: this.phoneInput.value });
    });
  }

  public handleSubmit(event: Event): void {
  event.preventDefault();
  this.events.emit(AppEvents.FORM_ORDER_SUBMIT);
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
