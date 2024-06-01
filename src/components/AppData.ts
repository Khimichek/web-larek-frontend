//import _ from "lodash";

import {Model} from "./base/Model";
import {IFormErrors, IAppState, IOrderAPI, IBasketItem, IProduct, IOrder, IOrderForm, IOrderAddress, IOrderContacts} from "../types/index";

export type CatalogChangeEvent = {
    catalog: Product[]
};

export class Product extends Model<IProduct> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    isOrdered: boolean;
    index: number;
    getId(): string {
		return this.id;
	}
}

export class AppState extends Model<IAppState> {
    basket: string[] = [];
	_catalog: Product[];
	loading: boolean;
	orderAddress: IOrderAddress = {
		payment: '',
		address: '',
	};

	contacts: IOrderContacts = {
		email: '',
		phone: '',
	};

	protected _order: IOrder = {
		id: '',
		payment: '',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};
    preview: string | null;
    formErrors: IFormErrors = {};
	
    get order() {
		return this._order;
	}
    

    getOrderAPI() {
		const orderApi: IOrderAPI = {
			payment: this._order.payment,
			email: this._order.email,
			phone: this._order.phone,
			address: this._order.address,
			total: 0,
			items: [],
		};
		orderApi.items = this._order.items.map((item) => item.id);
		orderApi.total = this.getTotal();
		return orderApi;
	}


    getProducts(): Product[] {
        return this._catalog;
    }

	findOrderItem(item: Product) {
		const orderItemIndex = this._order.items.findIndex(
			(id) => id.getId() === item.id
		);

		if (orderItemIndex !== -1) {
			return orderItemIndex;
		} else {
			return null;
		}
	}

// Добавление товара в корзину
    addBasket(item: Product) {
        if (this.findOrderItem(item) === null) {
			this._order.items.push(item);
            this.emitChanges('basket:changed');
		}
	}

    removeBasket(item: Product) {
		this._order.items = this._order.items.filter((el) => el.id != item.id);
		this.emitChanges('basket:changed');
    }

    /*getBasketProducts = (): IProduct[] =>
        this.catalog
            .filter((item) => item.isOrdered);*/


    clearBasket() {
        //this.basket = []
        this._order.items = [];
        this.emitChanges('basket:changed');
    }

/*    getTotal() {
        let sum = 0;
        this.basket.forEach(item => { sum = sum + item.price });
        return sum;
    }*/
	getTotal() {
		this._order.total = this._order.items.reduce((a, c) => a + c.price, 0);
		return this._order.total; //+100; //add error to test
	}

    setCatalog(items: IProduct[]) {
        this._catalog = items.map(item => new Product(item, this.events));
        this.emitChanges('items:changed', { catalog: this._catalog });
    }

    setPreview(item: Product) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    updateCounter(): number {
        return this.basket.length;
    }

    setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrderAddress()) {
			this.events.emit('order:ready', this.order);
		}

		if (this.validateOrderContact()) {
			this.events.emit('order:ready', this.order);
		}
	}

    validateOrderAddress() {
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = 'введите адрес доставки';
		}
		if (!this.order.payment) {
			errors.payment = 'выберете способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

    validateOrderContact() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'укажите адрес эл.почты';
		}

		if (!this.order.phone) {
			errors.phone = 'введите номер телефона';
		}

		this.formErrors = errors;
		this.events.emit('formErrorsContacts:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}
}