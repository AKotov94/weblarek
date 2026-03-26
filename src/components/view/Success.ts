import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";

export interface IViewSuccess {
  total: number
}

export class Success extends Component<IViewSuccess> {
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
  
  set total(value: number) {
    this.priceContainer.textContent = `Списано ${value} синапсов`
  }
}