export abstract class BaseForm {
  protected form: HTMLFormElement;

  constructor(selector: string) {
    this.form = document.querySelector(selector)!;
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  protected abstract handleSubmit(event: Event): void;

  render(): HTMLFormElement {
    return this.form;
  }
}
