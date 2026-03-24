import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

export type CardButtonText = "В корзину" | "Удалить из корзины" | "Недоступно";
export interface ICardData extends IProduct {
  buttonText?: CardButtonText;
  index?: number;
}

export abstract class Card extends Component<ICardData> {
  protected cardPrice: HTMLElement;
  protected cardTitle: HTMLElement;
  protected cardImage?: HTMLImageElement | null;
  protected cardCategory?: HTMLElement | null;
  protected cardButton?: HTMLButtonElement | null;
  protected cardText?: HTMLElement | null;
  protected cardIndex?: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.cardPrice = ensureElement<HTMLElement>(".card__price", this.container);
    this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);

    this.cardImage = this.container.querySelector(".card__image");
    this.cardCategory = this.container.querySelector(".card__category");
    this.cardButton = this.container.querySelector(".card__button");
    this.cardText = this.container.querySelector(".card__text");
    this.cardIndex = this.container.querySelector(".basket__item-index");
  }

  set price(value: number | null) {
    this.cardPrice.textContent =
      value !== null ? `${value} синапсов` : `Бесценно`;
  }

  set title(content: string) {
    this.cardTitle.textContent = content;
  }

  protected updateCategory(category: string): void {
    this.cardCategory!.textContent = category;
    this.cardCategory!.classList.remove(
      ...Array.from(this.cardCategory!.classList).filter((cls) =>
        cls.startsWith("card__category_"),
      ),
    );
    this.cardCategory!.classList.add(
      categoryMap[category as keyof typeof categoryMap],
    );
  }
}
