import { Card } from "./Card";
import { cloneTemplate } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";

export class CardCatalog extends Card {
  constructor(actions?) {
    const template = cloneTemplate<HTMLElement>("#card-catalog");
    super(template);
    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }

  set image(src: string) {
    this.setImage(this.cardImage!, `${CDN_URL}${src}`);
  }

  set category(value: string) {
    this.updateCategory(value);
  }
}
