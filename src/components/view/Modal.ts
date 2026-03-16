import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents, EVENTS } from "../base/Events";

export interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  private modalContent: HTMLElement;
  private modalButtonClose: HTMLButtonElement;

  constructor(private events: IEvents) {
    const container = ensureElement('.modal')
    super(container);
    this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container)
    this.modalButtonClose = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.modalButtonClose.addEventListener('click', () => this.events.emit(EVENTS.MODAL_CLOSE));
    this.container.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.container) {
        this.events.emit(EVENTS.MODAL_CLOSE)
      }
    })
  }

  render (data: IModalData): HTMLElement {
    this.modalContent.innerHTML = '';
    this.modalContent.appendChild(data.content);
    return this.container
  }

  close(): void {
    this.container.classList.remove('modal_active');
  }

  open(data: IModalData): void {
    this.container.classList.add('modal_active');
    this.render(data)
  } 
}