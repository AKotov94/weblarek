import { cloneTemplate } from "../../utils/utils";
import { Card, CardButtonText, TCardData } from "./Card";
import { CDN_URL } from "../../utils/constants";
import { ICardActions } from "../../types";

export type TCardPreview = Required<Pick<TCardData, 'title' | 'price' | 'image' | 'category' | 'description' | 'buttonText'>>

export class CardPreview extends Card<TCardPreview> {
  constructor(actions?: ICardActions) {
    const template = cloneTemplate<HTMLTemplateElement>("#card-preview");
    super(template);
    if (actions?.onClick) {
      this.cardButton?.addEventListener("click", actions.onClick);
    }
  }

  set image(value: string) {
    this.setImage(this.cardImage!, `${CDN_URL}${value}`);
  }
  
  set category(value: string) {
    this.updateCategory(value);
  }

  set description(value: string) {
    if (this.cardText)
    this.cardText.textContent = value;
  }

  set buttonText(value: CardButtonText) {
    if (this.cardButton) {
      this.cardButton.textContent = value;
    this.cardButton.disabled = value === "Недоступно";
    }
  }
}
