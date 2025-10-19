import { IApi } from '../../types';
import { IProduct, IBuyer, IOrderRequest, productsApi, IProductResponse} from '../../types';

export class ServerService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

 async fetchProducts(): Promise<IProduct[]> {
  const response = await this.api.get<IProduct[] | { items: IProduct[] }>('/product/');
  return Array.isArray(response) ? response : response.items;
}


  async sendOrder(order: IOrderRequest): Promise<void> {
    await this.api.post('/order/', order);
  }
}


