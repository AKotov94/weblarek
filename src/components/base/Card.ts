import { Component } from "./Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";

export abstract class Card extends Component<IProduct> {
  protected cardPrice: HTMLElement;
  protected cardTitle: HTMLElement;
  protected cardImage?: HTMLElement | null;
  protected cardCategory?: HTMLElement | null;
  protected cardButton?: HTMLElement | null;
  protected cardText?: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);

    this.cardImage = this.container.querySelector('.card__image');
    this.cardCategory = this.container.querySelector('.card__category');
    this.cardButton = this.container.querySelector('.card__button');
    this.cardText = this.container.querySelector('.card__text');
  };

  protected updateFields(data: IProduct): void {
    this.cardPrice.textContent = data.price !== null ? `${data.price} синапсов` : `Бесценно`;
    this.cardTitle.textContent = data.title;
    if (this.cardImage) this.setImage(this.cardImage as HTMLImageElement, `${CDN_URL}${data.image}`)
    if (this.cardCategory) {
      this.cardCategory.textContent = data.category;
      const classesToRemove = Array.from(this.cardCategory.classList).filter(cls => cls.startsWith('card__category_'));
      this.cardCategory.classList.remove(...classesToRemove);
      this.cardCategory.classList.add(categoryMap[data.category as keyof typeof categoryMap])
    }
    if (this.cardText) this.cardText.textContent = data.description;
  }

  // Жалко нельзя сделать абстрактный статичсекий метод - по концепции отлично подошел бы

  render(data: IProduct): HTMLElement {
    super.render(data);
    this.updateFields(data);
    return this.container
  }
}