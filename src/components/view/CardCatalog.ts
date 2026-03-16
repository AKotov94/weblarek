import { Card, ICardData } from "../base/Card";
import { IEvents, EVENTS, IAppEvents } from "../base/Events";
import { cloneTemplate } from "../../utils/utils";

export class CardCatalog extends Card {

  constructor(
    container: HTMLElement,
    private events: IEvents,
    data: ICardData
  ) {
    super(container);
    this.container.addEventListener('click', () => {
      this.events.emit<IAppEvents['card:preview']>(EVENTS.CARD_PREVIEW, data);
  });
  }

  static create(data: ICardData, events: IEvents): HTMLElement {
    const template = cloneTemplate<HTMLElement>('#card-catalog');
    const card = new CardCatalog(template, events, data);
    return card.render(data)
  }
}