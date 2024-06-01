export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    getId(): string;
}

export interface ICard extends IProduct {
    button?: string;
}

export interface IOrderAddress {
    payment: string;
    address: string;
}

export interface IOrderContacts {
    email: string;
    phone: string;
}

/*export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}*/

export interface IOrder {
	id: string;
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: IProduct[];
}

export interface IOrderAPI {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}


export interface IOrderResult {
    id: string[];
    total: number;
}

export interface ISuccess {
    total: number;
}

export interface IModalData {
    content: HTMLElement;
}
  
export interface IBasketView {
    items: HTMLElement[];
    total: number;
    button: HTMLButtonElement;
}

export interface IBasketModel {
    items: IProduct[];
    getTotal(): number;
    add(id: IProduct): void;
    remove(id: IProduct): void;
    clearBasket(): void;
}

export interface IBasketProduct {
    deleteButton: string;
    index: number;
    title: string;
    price: number;
}

export interface IEventEmitter {
    emit: (event: string, data: unknown) => void;
}

export type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;
//export type TPaymentMethod = 'cash' | 'online' | null;
export type IOrderForm = IOrderAddress & IOrderContacts;
export type IFormErrors = Partial<Record<keyof IOrder, string>>;