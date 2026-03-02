import { IProduct } from "../../types/index.ts";

export class Catalog {
  products: IProduct[];
  selectedProduct!: IProduct | null;

  constructor (products: IProduct[]) {
    this.products = products;
  }

  setProducts(newProducts: IProduct[]): void {
    this.products = newProducts;
  };

  getProducts(): IProduct[] {
    return this.products;
  };

  getProductById(id: string): IProduct | null {
    return this.products.find(product => product.id === id) || null;
  };

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  };

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct
  };
}