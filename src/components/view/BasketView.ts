import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";
import { createElement } from "../../utils/utils";

export interface IBasketViewData {
  content: HTMLElement[],
  total: number
}

export class BasketView extends Component<IBasketViewData> {
  private basketList: HTMLElement;
  private basketTotalPrice: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor(private events: IEvents) {
    const template = cloneTemplate<HTMLTemplateElement>('#basket');
    super(template);
    this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketTotalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.orderButton.addEventListener('click', () => {
      this.events.emit<IAppEvents['basket:order']>(EVENTS.BASKET_ORDER)
    })
  }

  set content(items: HTMLElement[]) {
    this.basketList.innerHTML = '';
    this.orderButton.disabled = items.length === 0;
    if (items.length === 0) {
      this.basketList.appendChild(this.renderEmpty());
      } else {
      items.forEach((card)=> {
        this.basketList.appendChild(card);
      })
    }
  };

  set total(price: number) {
    this.basketTotalPrice.textContent = `${price} синапсов`
  }
  
  private renderEmpty(): HTMLElement {
    return createElement('div',
      // Да, инлайново, но захотелось отцентровать :)
      { style: 'display: flex; block-size: 100%; justify-content: center; align-items: center;' },
      createElement('p', { textContent: 'Корзина пуста' }));
  }
}