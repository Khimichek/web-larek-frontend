interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
}

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

interface ICard extends IProduct {
    button?: string;
}

interface IOrderAddress {
    payment: TPaymentMethod;
    address: string;
}

interface IOrderContacts {
    email: string;
    phone: string;
}

interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

interface IOrderResult {
    id: string;
    total: number;
}

interface ISuccess {
    total: number;
}

interface IModalData {
    content: HTMLElement;
}
  
interface IBasketView {
    items: HTMLElement[];
    total: number;
}

interface IEventEmitter {
    emit: (event: string, data: unknown) => void;
}

type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;
type TPaymentMethod = 'cash' | 'online' | null;
type IOrderForm = IOrderAddress & IOrderContacts;
type FormErrors = Partial<Record<keyof IOrder, string>>;