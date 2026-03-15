import { Card } from "../base/Card";
import { IProduct } from "../../types";
import { IEvents, EVENTS, IAppEvents } from "../base/Events";
import { cloneTemplate } from "../../utils/utils";

export class CardCatalog extends Card {

  constructor(
    container: HTMLElement,
    private events: IEvents,
    data: IProduct
  ) {
    super(container);
    this.container.addEventListener('click', () => {
      this.events.emit<IAppEvents['card:preview']>(EVENTS.CARD_PREVIEW, data);
  });
  }

  static create(data: IProduct, events: IEvents): HTMLElement {
    const template = cloneTemplate<HTMLElement>('#card-catalog');
    const card = new CardCatalog(template, events, data);
    return card.render(data)
  }

  render(data: IProduct): HTMLElement {
    super.render(data);
    return this.container;
  }
}