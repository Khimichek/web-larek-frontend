interface IPage {
    items: IProduct[];
 }

interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

interface IProductModel {
    items: IProduct[];
    preview: string | null;
    setItems(items: IProduct[]): void; // чтобы установить после загрузки из апи
    getProduct(id: string): IProduct; //чтобы получить при рендере списков
}

interface IBucket {
    total: number,
    items: IProduct[];
}

interface IBucketModel {
    items: Map<string, number>;
    add(id: string): void;
    remove(id: string): void;
}

interface IOrderModel
 {
    payment: TPaymentMethod;
    email: string;
    phone: string;
    address: string;
}

interface IOrder extends IOrderModel {
    items: string[]
}

interface IOrderResult {
    id: string;
    total: number;
}

interface IEventEmitter {
    emit: (event: string, data: unknown) => void;
}

// Отображение
interface IViewConstructor {
    new(container: HTMLElement, events?: IEventEmitter): IView; // На входе контейнер, в него будем выводить
}

// Конструктор отображения
interface IView {
    render(data?: object): HTMLElement; // Устанавливаем данные, возвращвем контейнер
}

// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте

type TPaymentMethod = 'cash' | 'online' | null;

type TProductBaseInfo = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>;

type TProductInfo = Pick<IProduct, 'description' | 'image' | 'title' | 'category' | 'price'>;

type TProductInBucket = Pick<IProduct, 'id' | 'title' | 'price'>;

type TContactsForm = Pick<IOrderModel, 'email' | 'phone'>;

type TAddressForm = Pick<IOrderModel, 'payment' | 'address'>;