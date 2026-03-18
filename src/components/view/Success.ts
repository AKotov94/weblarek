import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";

export class Success extends Component<number> {
  private priceContainer: HTMLElement;
  private successButton: HTMLButtonElement;

  constructor(private events: IEvents) {
    const template = cloneTemplate('#success');
    super(template);
    this.priceContainer = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.successButton.addEventListener('click', () => {
      this.events.emit<IAppEvents['order:success']>(EVENTS.ORDER_SUCCESS)
    });
  }

  render(totalPrice: number): HTMLElement {
    super.render(totalPrice);
    this.priceContainer.textContent = `Списано ${totalPrice} синапсов`
    return this.container
  }
}