import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { AppEvents } from "../../../utils/constants";

export abstract class BaseForm<T> extends Component<T> {
  protected form: HTMLFormElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.form = this.container as HTMLFormElement;
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  protected  handleSubmit(event: Event): void {
    event.preventDefault();
      this.events.emit(AppEvents.FORM_ORDER_SUBMIT);
    }

  public checkIsFormValid(errors: Record<string, boolean>): boolean {
    return !Object.values(errors).some(Boolean);
  }

  public toggleSubmitButton(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }

  protected resetFormState(): void {
    this.form.reset();
  }
}
