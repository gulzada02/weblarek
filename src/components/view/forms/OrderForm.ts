import { BaseForm } from './BaseForm'; 
 
export class OrderForm extends BaseForm { 
  protected handleSubmit(event: Event): void { 
    event.preventDefault(); 
    console.log('Order form submitted'); 
  } 
}