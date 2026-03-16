import { cloneTemplate } from "../../utils/utils";
import { Card, ICardData } from "../base/Card";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";

export class CardBasket extends Card {

  constructor(
    container: HTMLElement, 
    private events: IEvents, 
    data: ICardData,
  ) {
    super(container);
    this.cardButton?.addEventListener('click', () => {
      this.events.emit<IAppEvents['card:action']>(EVENTS.CARD_ACTION, data)
    })
  }

  static create(data: ICardData, events: IEvents): HTMLElement {
    const template = cloneTemplate<HTMLElement>('#card-basket');
    const card = new CardBasket(template, events, data);
    return card.render(data)
  }

  protected updateFields(data: ICardData): void {
    super.updateFields(data);
    if (this.cardIndex && data.index) {
      this.cardIndex.textContent = `${data.index + 1}`;
    }
  }
}
  