import { BaseForm } from '../Forms/BaseForm'; 
 
export class OrderForm<T> extends BaseForm<T> { 
  protected handleSubmit(event: Event): void { 
    event.preventDefault(); 
    console.log('Order form submitted'); 
  } 
}