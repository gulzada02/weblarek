import { IApi } from '../../../types';
import { IProduct, IBuyer } from '../../../types';

export class ServerService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async fetchProducts(): Promise<IProduct[]> {
    const response = await this.api.get<{ items: IProduct[] }>('/product/');
    return response.items;
  }

  async sendOrder(order: IBuyer & { items: IProduct[] }): Promise<void> {
    await this.api.post('/order/', order);
  }
}
