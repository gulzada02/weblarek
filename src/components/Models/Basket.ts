import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Basket  {
  private events: EventEmitter;
  private items: IProduct[] = [];

  constructor(events: EventEmitter) {
    this.events = events;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('basket:listChange', {
      purchases: this.items,
      totalPrice: this.getTotalPrice(),
      quantity: this.getItemCount()
    });
    this.events.emit('basket:add', product);
  }

  removeItem(productId: string): void {
    const index = this.items.findIndex(p => p.id === productId);
    if (index !== -1) {
      const removed = this.items.splice(index, 1)[0];
      this.events.emit('basket:listChange', {
        purchases: this.items,
        totalPrice: this.getTotalPrice(),
        quantity: this.getItemCount()
      });
      this.events.emit('basket:remove', removed);
    }
  }

  clear(): void {
    this.items = [];
    this.events.emit('basket:listChange', {
      purchases: this.items,
      totalPrice: 0,
      quantity: 0
    });
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

  getItems(): IProduct[] {
    return this.items;
  }
}
