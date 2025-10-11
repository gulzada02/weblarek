export abstract class BaseCard {
  public element: HTMLElement;

  constructor(template: HTMLTemplateElement) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  }

  render(): HTMLElement {
    return this.element;
  }
}

