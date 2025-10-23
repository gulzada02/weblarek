import { BaseForm } from "../Forms/BaseForm";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export class FormContactsView extends BaseForm {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>('[name=email]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('[name=phone]', container);

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('form:phoneChanged', { phone: this.phoneInput.value });
    });

    this.emailInput.addEventListener('input', () => {
      this.events.emit('form:emailChanged', { email: this.emailInput.value });
    });

    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('form:contacts:submit');
    }); 
  }
}
