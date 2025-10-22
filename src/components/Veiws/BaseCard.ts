import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export abstract class BaseCard {
  protected element: HTMLElement;
  protected events: EventEmitter;

  protected image!: HTMLImageElement;
  protected title!: HTMLElement;
  protected category!: HTMLElement;
  protected price!: HTMLElement;

  constructor(container: HTMLTemplateElement, events: EventEmitter) {
    const first = container.content.firstElementChild;
    if (!first || !(first instanceof HTMLElement)) {
      throw new Error('Template must have an HTMLElement as its root element');
    }

    this.element = ensureElement<HTMLElement>(first);
    this.events = events;
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public abstract render(data: any): HTMLElement;
}
