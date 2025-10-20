import { BaseForm } from "../Forms/BaseForm";
import { EventEmitter } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export class FormContactsView extends BaseForm {
  private events: EventEmitter;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super('#contacts'); 
    this.events = events;

    this.emailInput = ensureElement<HTMLInputElement>('#contacts-email', container);
    this.phoneInput = ensureElement<HTMLInputElement>('#contacts-phone', container);

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
    this.events.emit('form:contactsSubmit');
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