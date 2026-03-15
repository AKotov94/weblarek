import { IProduct } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { Card } from "../base/Card";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";

export class CardBasket extends Card {

  constructor(
    container: HTMLElement, 
    private events: IEvents, 
    data: IProduct,
    private index: number
  ) {
    super(container);
    this.cardButton?.addEventListener('click', () => {
      this.events.emit<IAppEvents['card:action']>(EVENTS.CARD_ACTION, data)
    })
  }

  static create(data: IProduct, events: IEvents, index: number): HTMLElement {
    const template = cloneTemplate<HTMLElement>('#card-basket');
    const card = new CardBasket(template, events, data, index);
    return card.render(data)
  }

  render(data: IProduct) {
    super.render(data);
    this.cardIndex!.textContent = `${this.index + 1}`; // Это допустимо? Можно написать через if, но если шаблона нет, то все равно все развалится
    return this.container
  }
}
  