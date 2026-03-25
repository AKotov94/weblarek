import { Card, TCardData } from "./Card";
import { cloneTemplate } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";
import { ICardActions } from "../../types";

export type TCardCatalog = Required<Pick<TCardData, 'title' | 'price' | 'image' | 'category'>>

export class CardCatalog extends Card<TCardCatalog> {
  constructor(actions?: ICardActions) {
    const template = cloneTemplate<HTMLElement>("#card-catalog");
    super(template);
    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }

  set image(src: string) {
    if (this.cardImage)
    this.setImage(this.cardImage, `${CDN_URL}${src}`);
  }

  set category(value: string) {
    this.updateCategory(value);
  }
}
