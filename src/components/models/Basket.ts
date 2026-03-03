import { IProduct } from "../../types/";

export class Basket {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  };

  addItem(item: IProduct): void {
    this.items.push(item);
  };

  deleteItem(item: IProduct): void {
    this.items = this.items.filter(elem => elem.id != item.id);
  };

  clearBasket(): void {
    this.items = [];
  };

  getTotalPrice(): number | null {
    if (this.items.length === 0) return null;
    return this.items.reduce((acc, item) => acc + (item.price ?? 0), 0);
  };

  containsItemById(id: string): boolean {
    return this.items.some(item => item.id === id);
  };
}