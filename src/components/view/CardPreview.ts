import { IProduct } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { Card } from "../base/Card";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";

export class CardPreview extends Card {

  constructor (
    container: HTMLElement, 
    private events: IEvents,
    data: IProduct,
  ) {
    super(container)
    this.cardButton?.addEventListener('click', () => {
      this.events.emit<IAppEvents['card:action']>(EVENTS.CARD_ACTION, data)
    })
  }

  static create(data: IProduct, events: IEvents): HTMLElement {
    const template = cloneTemplate<HTMLElement>('#card-preview');
    const card = new CardPreview(template, events, data);
    return card.render(data)
  }

  render(data: IProduct): HTMLElement {
    super.render(data);
    return this.container;
  }
}