import { IProduct } from "../../types/index.ts";
import { EVENTS, IAppEvents, IEvents } from "../base/Events.ts";

export class Catalog {
  private products!: IProduct[];
  private selectedProduct!: IProduct | null;

  constructor (private events: IEvents) {};

  getProducts(): IProduct[] {
    return [...this.products];
  };

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct ? { ...this.selectedProduct } : null;
  };

  getProductById(id: string): IProduct | null {
    const productById = this.products.find(product => product.id === id);
    return productById ? {...productById} : null;
  };

  setProducts(newProducts: IProduct[]): void {
    this.products = newProducts;
    this.emitChanged();
  };

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  };

  private emitChanged(): void {
    this.events.emit<IAppEvents['catalog:changed']>(EVENTS.CATALOG_CHANGED);
  }
}