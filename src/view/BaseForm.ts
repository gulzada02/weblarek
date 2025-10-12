import { Component } from "../components/base/Component";

export abstract class BaseForm extends Component<any> {
  protected form: HTMLFormElement;

  constructor(selector: string) {
    const formEl = document.querySelector<HTMLFormElement>(selector)!;
    super(formEl); 
    this.form = formEl;
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  protected abstract handleSubmit(event: Event): void;
}