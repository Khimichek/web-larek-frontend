import { Api, ApiListResponse } from './base/Api';
import {IOrder, IOrderResult, IOrderAPI, IProduct} from "../types";

export interface IWebLarekAPI {
    getProductList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getProductList(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderProducts(order: IOrderAPI): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

	orderProductsSuccess(order: IOrderAPI) {
		return this.post('/order', order)
			.then((result: IOrderResult) => {
				result
			})
			.catch((err) => {
				console.error(err);
			});
	}

}