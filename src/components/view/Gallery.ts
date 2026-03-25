import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IViewGallery {
  items: HTMLElement[]
}

export class Gallery extends Component<IViewGallery> {
  constructor() {
    const container = ensureElement('.gallery')
    super(container);
  }

  set items(cards: HTMLElement[]) {
    this.container.innerHTML = '';
    cards.forEach(card => {
      this.container.appendChild(card)
    });
  }
}