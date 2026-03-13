import { Card } from "../base/Card";
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { cloneTemplate } from "../../utils/utils";

export class CardCatalog extends Card {

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
  }

  static create(data: IProduct, events: IEvents): HTMLElement {
    const template = cloneTemplate<HTMLElement>('#card-catalog')
    const card = new CardCatalog(template, events);
    return card.render(data)
  }

  render(data: IProduct): HTMLElement {
    super.render(data);
    return this.container;
  }

}