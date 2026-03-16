import { cloneTemplate } from "../../utils/utils";
import { Card, ICardData } from "../base/Card";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";

export class CardPreview extends Card {

  constructor (
    container: HTMLElement, 
    private events: IEvents,
    data: ICardData,
    // private trigger: (IAppEvents['card:action']) => void
  ) {
    super(container)
    this.cardButton?.addEventListener('click', () => {
      this.events.emit<IAppEvents['card:action']>(EVENTS.CARD_ACTION, data)
    })
  }

  static create(data: ICardData, events: IEvents): HTMLElement {
    const template = cloneTemplate<HTMLElement>('#card-preview');
    const card = new CardPreview(template, events, data);
    return card.render(data)
  }

  protected updateFields(data: ICardData): void {
    super.updateFields(data);
    if (this.cardButton && data.buttonText) {
      this.cardButton.textContent = data.buttonText
    }
  }
}