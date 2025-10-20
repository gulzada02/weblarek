// BaseForm.ts
import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export abstract class BaseForm extends Component<any> {
  public form: HTMLFormElement;
  public submitButton: HTMLButtonElement;

  constructor(selector: string) {
    const formEl = ensureElement<HTMLFormElement>(selector);
    super(formEl);
    this.form = formEl;

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  protected abstract handleSubmit(event: Event): void;

  public checkIsFormValid(errors: Record<string, boolean>): boolean {
    return !Object.values(errors).some(Boolean);
  }

  public toggleSubmitButton(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }

  public resetFormState(): void {
    this.form.reset();
  }
}
