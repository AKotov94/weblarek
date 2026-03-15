import { Component } from "../base/Component";
import { IProduct } from "../../types";

export class Gallery extends Component<HTMLElement[]> {
  constructor(container:HTMLElement) {
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