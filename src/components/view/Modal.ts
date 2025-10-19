// Модальное окно
export class Modal {
  private modal: HTMLElement;
  private closeBtn: HTMLElement;

  // Обработчик Escape как стрелочная функция, чтобы сохранить контекст this
  private _handleEscape = (evt: KeyboardEvent) => {
    if (evt.key === "Escape") {
      this.close();
    }
  };

  constructor(selector: string) {
    const modalEl = document.querySelector(selector);
    if (!modalEl) throw new Error(`Modal with selector "${selector}" not found`);
    this.modal = modalEl as HTMLElement;

    const closeBtn = this.modal.querySelector('.modal__close');
    if (!closeBtn) throw new Error(`Close button not found in modal`);
    this.closeBtn = closeBtn as HTMLElement;

    // Закрытие по кнопке
    this.closeBtn.addEventListener('click', () => this.close());

    // Закрытие по клику на фон
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  show(content: HTMLElement) {
    const contentContainer = this.modal.querySelector('.modal__content');
    if (!contentContainer) throw new Error(`Modal content container not found`);
    contentContainer.replaceChildren(content);

    this.modal.classList.add('modal_active');

    // Навешиваем обработчик на Esc
    document.addEventListener('keydown', this._handleEscape);

    // Блокировка прокрутки страницы
    document.body.classList.add('no-scroll');
  }

  close() {
    this.modal.classList.remove('modal_active');

    const contentContainer = this.modal.querySelector('.modal__content');
    if (contentContainer) contentContainer.replaceChildren();

    // Снимаем обработчик на Esc
    document.removeEventListener('keydown', this._handleEscape);

    // Разблокировка прокрутки
    document.body.classList.remove('no-scroll');
  }
}
