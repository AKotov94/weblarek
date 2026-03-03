import { IProduct } from "../../types/index.ts";

export class Catalog {
  private products: IProduct[];
  private selectedProduct!: IProduct | null;

  constructor (products: IProduct[]) {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  };

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct
  };

  getProductById(id: string): IProduct | null {
    return this.products.find(product => product.id === id) || null;
  };

  setProducts(newProducts: IProduct[]): void {
    this.products = newProducts;
  };

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  };
}