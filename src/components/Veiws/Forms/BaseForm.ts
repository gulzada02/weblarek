import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { IFormErrorData } from "../../../types";

export abstract class BaseForm extends Component<IFormErrorData> {
  protected submitButton: HTMLButtonElement;
  protected error: HTMLElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('[type="submit"]', container);
    this.error = ensureElement<HTMLElement>('.form__errors', container);

    // Общий обработчик сабмита
    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  protected abstract onSubmit(): void;

  set errorText(text: string) {
    this.error.textContent = text;
  }

  toggleSubmitButton(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }

  toggleErrors(value: boolean): void {
    this.error.classList.toggle('form__errors-active', value);
  }

  resetFormState(): void {
    this.error.textContent = '';
    this.submitButton.disabled = true;
  }
}
