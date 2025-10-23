import { IGalleryData } from "../../types";
import { Component } from "../base/Component";

export class GalleryView extends Component<IGalleryData> {
  constructor(container: HTMLElement) {
    super(container)
  }

  // Сеттер для карточек галереи
  set galleryList(cards: HTMLElement[]) {
    this.container.replaceChildren(...cards)
  }
}
