import { IProduct } from "../../types/index.ts";

export class Catalog {
  private products!: IProduct[];
  private selectedProduct!: IProduct | null;

  constructor () {};

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
    this.products = newProducts; // В принципе, LLM советует и в методах set* присваивать копию, а не ссылку, но мне кажется это избыточным
  };

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  };
}