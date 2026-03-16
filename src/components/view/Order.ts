import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Order extends Component<HTMLElement> {
  private buttonContainer: HTMLElement;
  private orderInput;
  private orderButton;
  private orderErrors;

  constructor(events: IEvents) {
    const template = ensureElement<HTMLTemplateElement>('#order');
    super(template);
    this.buttonContainer = ensureElement<HTMLElement>('.order__buttons', this.container);
    this.orderInput = ensureElement<HTMLElement>('.form__input', this.container);
    this.orderButton = ensureElement<HTMLElement>('.order__button', this.container);
    this.orderErrors = ensureElement<HTMLElement>('.form__errors', this.container)
  }
}