import { EventEmitter } from "../base/Events";

export class Modal {
  private modal: HTMLElement;
  private closeBtn: HTMLElement;
  private contentContainer: HTMLElement;
  private events: EventEmitter;

  private _handleEscape = (evt: KeyboardEvent) => {
    if (evt.key === "Escape") {
      this.close();
    }
  };

  constructor(selector: string, events: EventEmitter) {
    const modalEl = document.querySelector(selector);
    if (!modalEl) throw new Error(`Modal with selector "${selector}" not found`);
    this.modal = modalEl as HTMLElement;
    this.events = events;

    const closeBtn = this.modal.querySelector('.modal__close');
    if (!closeBtn) throw new Error(`Close button not found in modal`);
    this.closeBtn = closeBtn as HTMLElement;

    const contentContainer = this.modal.querySelector('.modal__content');
    if (!contentContainer) throw new Error(`Modal content container not found`);
    this.contentContainer = contentContainer as HTMLElement;

    // Закрытие по кнопке
    this.closeBtn.addEventListener('click', () => this.close());

    // Закрытие по клику на фон
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  open(content: HTMLElement): void {
    this.setContent(content);
    this.modal.classList.add('modal_active');
    document.addEventListener('keydown', this._handleEscape);
    document.body.classList.add('no-scroll');
  }

  setContent(content: HTMLElement): void {
    this.clearContent();
    this.contentContainer.appendChild(content);
  }

  get content(): HTMLElement {
    return this.contentContainer;
  }

  set content(content: HTMLElement) {
    this.setContent(content);
  }

  close(): void {
    this.modal.classList.remove('modal_active');
    this.clearContent();
    document.removeEventListener('keydown', this._handleEscape);
    document.body.classList.remove('no-scroll');
    this.events.emit('modal:close');
  }

  clearContent(): void {
    this.contentContainer.innerHTML = '';
  }

  showLoader(): void {
    this.contentContainer.innerHTML = `<div class="loader">Загрузка...</div>`;
  }
}
