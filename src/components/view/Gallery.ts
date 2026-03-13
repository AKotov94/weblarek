import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { CardCatalog } from "./CardCatalog";

export class Gallery extends Component<IProduct[]> {
  constructor(container:HTMLElement, private events: IEvents) {
    super(container);
  }

  setGalleryContent(data: IProduct[]):void {
    super.render(data);
    this.container.innerHTML = '';
    data.forEach(card => {
      const cardElement = CardCatalog.create(card, this.events);
      this.container.appendChild(cardElement)
    });
  };
}