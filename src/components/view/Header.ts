import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents, EVENTS, IAppEvents } from "../base/Events";

interface IHeaderData {
  count: number;
}

export class Header extends Component<IHeaderData> {
  private basketCounter: HTMLElement;
  private basketButton: HTMLButtonElement;
  
  constructor(private events: IEvents) {
    const container = ensureElement('.header');
    super(container);
    this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit<IAppEvents['basket:open']>(EVENTS.BASKET_OPEN)
    });
  };

  render(data: IHeaderData): HTMLElement {
    this.basketCounter.textContent = `${data.count}`
    return this.container
  }

  reset():void {
    this.render( {count: 0} )
  }
}