import { ICardActions } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { Card, TCardData } from "./Card";

export type TCardBasket = Required<Pick<TCardData, 'title' | 'price' | 'index'>>

export class CardBasket extends Card<TCardBasket> {
  constructor(actions?: ICardActions) {
    const template = cloneTemplate<HTMLElement>("#card-basket");
    super(template);
    if (actions?.onClick) {
      this.cardButton?.addEventListener("click", actions.onClick);
    }
  }

  set index(value: number) {
    if (this.cardIndex)
    this.cardIndex.textContent = `${value + 1}`
  }
}
