import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IHeaderData {
  count: number;
}

export class Header extends Component<IHeaderData> {
  private BasketCounter: HTMLElement;
  private BasketButton: HTMLButtonElement
  
  constructor(container:HTMLElement, private events: IEvents) {
    super(container);
    this.BasketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.BasketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.BasketButton.addEventListener('click', () => {
      this.events.emit('basket:open')
    });
  };

  setHeaderBasketCount(data: IHeaderData): void {
    this.BasketCounter.textContent = `${data.count}`;
  };
}