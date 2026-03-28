import { IProduct } from "../../types/";
import { EVENTS, IAppEvents, IEvents } from "../base/Events";

export class Basket {
  private items: IProduct[] = [];

  constructor (private events: IEvents) {}

  getItems(): IProduct[] {
    return [...this.items];
  };

  addItem(item: IProduct): void {
    this.items.push(item);
    this.emitChanged();
  };

  deleteItem(item: IProduct): void {
    this.items = this.items.filter(elem => elem.id !== item.id);
    this.emitChanged();
  };

  clearBasket(): void {
    this.items = [];
    this.emitChanged();
  };

  getTotalPrice(): number {
    return this.items.reduce((acc, item) => acc + (item.price ?? 0), 0);
  };

  containsItemById(id: string): boolean {
    return this.items.some(item => item.id === id);
  };

  private emitChanged(): void {
    this.events.emit<IAppEvents['basket:changed']>(EVENTS.BASKET_CHANGED);
  };
}