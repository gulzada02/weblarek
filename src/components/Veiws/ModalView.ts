import { EventEmitter } from "../base/Events";

export class ModalView {
  private modal: HTMLElement;
  private contentContainer: HTMLElement;
  private events: EventEmitter;

  constructor(modal: HTMLElement, events: EventEmitter) {
    this.modal = modal;
    this.events = events;

    // Ищем контейнер для контента внутри модалки
    this.contentContainer = this.modal.querySelector<HTMLElement>('.modal__content')!;
    
    // Слушаем клик по кнопке закрытия модального окна
    const closeButton = this.modal.querySelector<HTMLElement>('.modal__close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }

    // Можно закрывать модалку при клике вне контента
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  // Метод открытия модального окна с контентом
  open(content: HTMLElement): void {
    this.setContent(content);
    this.modal.classList.add('modal_active');
  }

  // Метод закрытия модального окна
  close(): void {
    this.modal.classList.remove('modal_active');
    this.clearContent();
    this.events.emit('modal:close'); // Генерация события закрытия
  }

  // Метод для установки контента модального окна
  setContent(content: HTMLElement): void {
    this.clearContent();
    this.contentContainer.appendChild(content);
  }

  // Очистка содержимого
  clearContent(): void {
    this.contentContainer.innerHTML = '';
  }

  // Дополнительно можно показать лоадер
  showLoader(): void {
    this.contentContainer.innerHTML = `<div class="loader">Загрузка...</div>`;
  }

  // Геттер для контента, если нужен
  get content(): HTMLElement {
    return this.contentContainer;
  }

  set content(content: HTMLElement) {
    this.setContent(content);
  }
}
