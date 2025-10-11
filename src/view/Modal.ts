export class Modal {
  private modal: HTMLElement;
  private closeBtn: HTMLElement;

  constructor(selector: string) {
    this.modal = document.querySelector(selector)!;
    this.closeBtn = this.modal.querySelector('.modal__close')!;

    this.closeBtn.addEventListener('click', () => this.close());
  }

  show(content: HTMLElement) {
    this.modal.querySelector('.modal__content')!.replaceChildren(content);
    this.modal.classList.add('modal_active');
  }

  close() {
    this.modal.classList.remove('modal_active');
  }
}

