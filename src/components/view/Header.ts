import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents, EVENTS, IAppEvents } from "../base/Events";

export class Header extends Component<number> {
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

  render(count: number): HTMLElement {
    this.basketCounter.textContent = `${count}`
    return this.container
  }

  reset():void {
    this.render(0);
  }
}