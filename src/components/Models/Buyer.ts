import { EventEmitter } from '../base/Events';
import { IBuyer } from '../../types';

export type TPayment = 'card' | 'cash';

export class Buyer extends EventEmitter {
  private payment: TPayment | null = null;
  private email = '';
  private phone = '';
  private address = '';

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.emit('buyer:change', { field: 'payment' });
  }

  setEmail(email: string): void {
    this.email = email;
    this.emit('buyer:change', { field: 'email' });
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.emit('buyer:change', { field: 'phone' });
  }

  setAddress(address: string): void {
    this.address = address;
    this.emit('buyer:change', { field: 'address' });
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
    this.emit('buyer:change', { field: 'all' });
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    if (!this.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.email) errors.email = 'Укажите email';
    if (!this.phone) errors.phone = 'Укажите телефон';
    if (!this.address) errors.address = 'Укажите адрес';
    return errors;
  }
}
