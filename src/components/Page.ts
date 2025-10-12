import { Component } from '../components/base/Component';
import { Modal } from '../view/Modal';

export class Page<T> extends Component<T> {
  private modal: Modal;

  constructor(container: HTMLElement, modal: Modal) {
    super(container);
    this.modal = modal;
  }

  openPreviewModal(content: HTMLElement): void {
    this.modal.show(content);
  }

  closePreviewModal(): void {
    this.modal.close();
  }
}
