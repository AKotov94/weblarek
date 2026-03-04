import { IApi, FetchData, IOrder, OrderResponse } from "../../types";

export class ApiCommunication {
  protected api: IApi;

  constructor (apiInstance: IApi) {
    this.api = apiInstance;
  }

  async fetchProducts(): Promise<FetchData> {
    try {
      return await this.api.get<FetchData>('/product/');
    } catch (error) {
      console.error('Произошла ошибка при получении данных:', error);
      throw error;
    }
  }

  async sendOrder(orderData: IOrder): Promise<OrderResponse> {
    try {
      return await this.api.post('/order/', orderData);
    } catch (error) {
      console.error('Произошла ошибка при отправке данных:', error);
      throw error;
    }
  }
}