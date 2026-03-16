import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class Gallery extends Component<HTMLElement[]> {
  constructor() {
    const container = ensureElement('.gallery')
    super(container);
  }

  render(cards: HTMLElement[]):HTMLElement {
    this.container.innerHTML = '';
    cards.forEach(card => {
      this.container.appendChild(card)
    });
    return this.container
  };
}