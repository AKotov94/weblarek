import { IApi, FetchData, IOrder } from "../../types";

export class ApiCommunication {
  api: IApi;

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

  async sendOrder(orderData: Promise<IOrder>) {
    try {
      return await this.api.post('/order/', orderData);
    } catch (error) {
      console.error('Произошла ошибка при отправке данных:', error);
      throw error;
    }
  }
}