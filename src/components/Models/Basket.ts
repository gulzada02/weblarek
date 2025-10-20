import { IProduct } from '../../types';
import { EventEmitter } from './EventEmitter';

export class Basket extends EventEmitter {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.emit('cart:change', this.items);
    this.emit('cart:add', product);
  }

  removeItem(productId: string): void {
    const index = this.items.findIndex(p => p.id === productId);
    if (index !== -1) {
      const removed = this.items.splice(index, 1)[0];
      this.emit('cart:change', this.items);
      this.emit('cart:remove', removed);
    }
  }

  clear(): void {
    this.items = [];
    this.emit('cart:change', this.items);
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  hasItem(productId: string): boolean {
    return this.items.some(p => p.id === productId);
  }
}



