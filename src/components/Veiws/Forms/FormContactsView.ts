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

    this.submitButton.disabled = true;

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('form:phoneChanged', { phone: this.phoneInput.value });
      this.validateForm();
    });

    this.emailInput.addEventListener('input', () => {
      this.events.emit('form:emailChanged', { email: this.emailInput.value });
      this.validateForm();
    });

    this.submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.validateForm()) {
        this.events.emit("form:contactsSubmit", {
          email: this.emailInput.value.trim(),
          phone: this.phoneInput.value.trim(),
        });
      }
    }); 
  }

  private validateForm(): boolean {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!emailRegex.test(email)) {
      this.error.textContent = "Некорректный email";
      isValid = false;
    } else {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        this.error.textContent = "Некорректный номер телефона";
        isValid = false;
      } else {
        this.error.textContent = "";
      }
    }

    this.submitButton.disabled = !isValid;
    return isValid;
  }

  resetFormState(): void {
    super.resetFormState();
    this.emailInput.value = "";
    this.phoneInput.value = "";
  }
}
