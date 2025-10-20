
export class GalleryView {
  private container: HTMLElement;
  private _galleryList: HTMLElement[] = [];
  

  constructor(container: HTMLElement) {
    this.container = container;
  }

  // Сеттер для карточек галереи
  set galleryList(cards: HTMLElement[]) {
    this._galleryList = cards;
    this.render();
  }

  // Получение текущих карточек
  get galleryList(): HTMLElement[] {
    return this._galleryList;
  }

  // Метод рендера
  render(): void {
    this.container.innerHTML = "";
    this._galleryList.forEach(card => {
      this.container.appendChild(card);
    });
  }

  // Можно добавить вспомогательный метод для обновления одной карточки
  updateCard(card: HTMLElement, index: number): void {
    const existing = this.container.children[index];
    if (existing) {
      this.container.replaceChild(card, existing);
    }
  }
}
