import { cloneTemplate } from "../../utils/utils";
import { Card, ICardData } from "./Card";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";

export class CardBasket extends Card {
  constructor(
    container: HTMLElement,
    private events: IEvents,
    data: ICardData,
  ) {
    super(container);
    this.cardButton?.addEventListener("click", () => {
      this.events.emit<IAppEvents["card:action"]>(EVENTS.CARD_ACTION, data);
    });
  }

  set index(value: number) {
    this.cardIndex!.textContent = `${value + 1}`
  }

  static create(data: ICardData, events: IEvents): HTMLElement {
    const template = cloneTemplate<HTMLElement>("#card-basket");
    const card = new CardBasket(template, events, data);
    return card.render(data);
  }
}
