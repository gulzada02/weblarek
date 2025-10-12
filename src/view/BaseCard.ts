import { Component } from '../components/base/Component';

export abstract class BaseCard extends Component<any> {
  protected _element: HTMLElement;
  constructor(template: HTMLTemplateElement) {
    const element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(element);
    this._element = element;
  }

  public get element(): HTMLElement {
    return this._element;
  }
}
