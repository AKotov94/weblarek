import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents, EVENTS, IAppEvents } from "../base/Events";

export class Modal extends Component<HTMLElement> {
  private modalContent: HTMLElement;
  private modalButtonClose: HTMLButtonElement;

  constructor(private events: IEvents) {
    const container = ensureElement('.modal');
    super(container);
    this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);
    this.modalButtonClose = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.container.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.container || e.target === this.modalButtonClose) {
        this.events.emit<IAppEvents['modal:close']>(EVENTS.MODAL_CLOSE)
      }
    })
  }

  render (element: HTMLElement): HTMLElement {
    this.modalContent.innerHTML = '';
    this.modalContent.appendChild(element);
    return this.container
  }

  close(): void {
    this.container.classList.remove('modal_active');
  }

  open(element: HTMLElement): void {
    this.container.classList.add('modal_active');
    this.render(element);
  } 
}