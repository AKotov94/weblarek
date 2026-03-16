import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EVENTS, IEvents } from "../base/Events";
import { createElement } from "../../utils/utils";

export interface IBasketData {
  items: HTMLElement[],
  totalPrice: number
}

export class BasketView extends Component<IBasketData> {
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
      this.events.emit(EVENTS.BASKET_ORDER)
    })
  }

  render(data: IBasketData): HTMLElement {
    this.basketList.innerHTML = '';
    if (data.items.length === 0) {
      const emptyBasket = createElement('div',
      // Да, инлайново, но захотелось отцентровать :)
      { style: 'display: flex; block-size: 100%; justify-content: center; align-items: center;' },
      createElement('p', { textContent: 'Корзина пуста' }));
      this.basketList.appendChild(emptyBasket);
      this.orderButton.disabled = true;
      } else {
      data.items.map((card)=> {
        this.basketList.appendChild(card);
      })
      this.orderButton.disabled = false;
    }
    this.basketTotalPrice.textContent = `${data.totalPrice} синапсов`
    return this.container
  }
}