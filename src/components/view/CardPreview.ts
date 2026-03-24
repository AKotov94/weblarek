import { cloneTemplate } from "../../utils/utils";
import { Card, CardButtonText, ICardData } from "./Card";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";
import { CDN_URL } from "../../utils/constants";

export class CardPreview extends Card {
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

  set image(src: string) {
    this.setImage(this.cardImage!, `${CDN_URL}${src}`);
  }
  
  set category(value: string) {
    this.updateCategory(value);
  }

  set description(content: string) {
    this.cardText!.textContent = content;
  }

  set buttonText(content: CardButtonText) {
    this.cardButton!.textContent = content;
    this.cardButton!.disabled = content === "Недоступно";
  }

  static create(data: ICardData, events: IEvents): HTMLElement {
    const template = cloneTemplate<HTMLTemplateElement>("#card-preview");
    const card = new CardPreview(template, events, data);
    return card.render(data);
  }
}
