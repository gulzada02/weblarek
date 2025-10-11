import { IProduct } from '../../../types';
import { EventEmitter } from '../Models/EventEmitter';


export class Products extends EventEmitter {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(products: IProduct[] = []) {
    super();
    if (products.length) this.setProducts(products);
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.emit('products:change', this.products);

  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.emit('product:selected', product);

  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}

