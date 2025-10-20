import { Component } from "../../base/Component";

export abstract class BaseForm extends Component<any> {
  protected form: HTMLFormElement;
  protected submitButton: HTMLButtonElement;

  constructor(selector: string) {
    const formEl = document.querySelector<HTMLFormElement>(selector)!;
    super(formEl);
    this.form = formEl;
    this.submitButton = this.form.querySelector('button[type="submit"]')!;
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  protected abstract handleSubmit(event: Event): void;

  protected checkIsFormValid(errors: Record<string, boolean>): boolean {
    return !Object.values(errors).some(Boolean);
  }

  protected toggleSubmitButton(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }

  protected resetFormState(): void {
    this.form.reset();
  }
}
