import { EventEmitter } from "../../base/Events";
import { cloneTemplate } from "../../../utils/utils";

export class FormContactsView {
  private container: HTMLElement;
  private events: EventEmitter;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, events: EventEmitter) {
    this.container = cloneTemplate(template);
    this.events = events;

    this.emailInput = this.container.querySelector<HTMLInputElement>('#contacts-email')!;
    this.phoneInput = this.container.querySelector<HTMLInputElement>('#contacts-phone')!;
    this.submitButton = this.container.querySelector<HTMLButtonElement>('#contacts-submit')!;

    this.addListeners();
  }

  private addListeners() {
    // Слушаем изменение email
    this.emailInput.addEventListener('input', () => {
      this.events.emit('form:emailChanged', { email: this.emailInput.value });
    });

    // Слушаем изменение телефона
    this.phoneInput.addEventListener('input', () => {
      this.events.emit('form:phoneChanged', { phone: this.phoneInput.value });
    });

    // Слушаем сабмит формы
    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('form:contactsSubmit');
    });
  }

  // Проверка валидности формы
  checkIsFormValid(errors: Record<string, boolean>): boolean {
    return !Object.values(errors).some(Boolean);
  }

  // Включение/отключение кнопки сабмита
  toggleSubmitButton(isEnabled: boolean) {
    this.submitButton.disabled = !isEnabled;
  }

  // Добавление/удаление класса ошибок
  toggleErrorClass(hasError: boolean) {
    if (hasError) {
      this.container.classList.add('form--error');
    } else {
      this.container.classList.remove('form--error');
    }
  }

  // Сброс состояния формы
  resetFormState() {
    this.emailInput.value = '';
    this.phoneInput.value = '';
    this.toggleErrorClass(false);
    this.toggleSubmitButton(false);
  }

  // Возвращает DOM элемента формы
  render(): HTMLElement {
    return this.container;
  }
}
