import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";

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

  protected updateFields(data: ICardData): void {
    this.cardPrice.textContent =
      data.price !== null ? `${data.price} синапсов` : `Бесценно`;
    this.cardTitle.textContent = data.title;

    if (this.cardImage)
      this.setImage(this.cardImage, `${CDN_URL}${data.image}`);
    if (this.cardCategory) this.updateCategory(data.category);
    if (this.cardText) this.cardText.textContent = data.description;
  }

  private updateCategory(category: string): void {
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

  // Жалко нельзя сделать абстрактный статический метод - по концепции отлично подошел бы

  render(data: ICardData): HTMLElement {
    super.render(data);
    this.updateFields(data);
    return this.container;
  }
}
