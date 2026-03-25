import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents, EVENTS, IAppEvents } from "../base/Events";

export interface IViewModal {
  content: HTMLElement
}

export class Modal extends Component<IViewModal> {
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

  set content(element: HTMLElement) {
    this.modalContent.innerHTML = '';
    this.modalContent.appendChild(element);
  }

  close(): void {
    this.container.classList.remove('modal_active');
  }

  open(content: IViewModal): void {
    this.container.classList.add('modal_active');
    this.render(content);
  } 
}