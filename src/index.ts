import './scss/styles.scss';

import {WebLarekAPI} from "./components/WebLarekApi";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/Events";
import {AppState, CatalogChangeEvent, Product} from "./components/AppData";
import {Page} from "./components/Page";
//import {Auction, AuctionItem, BidItem, CatalogItem} from "./components/Card";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket, BasketProduct} from "./components/common/Basket";
//import {Tabs} from "./components/common/Tabs";
import {IProduct, IOrderResult, IOrderAddress, IOrderContacts, IOrderForm, ICard} from "./types";
import { Card, IButtonOptions } from './components/Card';
import {OrderAddress, OrderContacts} from "./components/Order";
import {Success} from "./components/common/Success";

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
//const bids = new Basket(cloneTemplate(bidsTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderAddress = new OrderAddress(cloneTemplate(orderTemplate), events);
const contacts = new OrderContacts(cloneTemplate(contactsTemplate), events);
//const success = new Success(cloneTemplate(successTemplate), { onClick: () => modal.close() });

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Открыть форму адреса и способа оплаты
events.on('order:open', () => {
    modal.render({
        content: orderAddress.render({
            address: orderAddress.address,
            payment: orderAddress.payment,
            valid: false,
            errors: []
        })
    });
});

// Изменилось состояние валидации формы адреса и способа оплаты
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const {address, payment} = errors;
	orderAddress.valid = !address && !payment;
	orderAddress.errors = Object.values({address, payment}).filter((i) => !!i).join(' и ');
});

// После сабмита первой формы, открываем форму контактов
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось одно из полей в обеих формах
events.on(
	/^(order|contacts)\..*:change/, (data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
});

// Изменилось состояние валидации формы контактов
events.on('formErrorsContacts:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({phone, email}).filter((i) => !!i).join(' и ');
});

// Отправлена форма заказа
events.on('success:open', () => {
    api.orderProducts(appData.getOrderAPI())
        .then(() => {
            const success = new Success(cloneTemplate(successTemplate), events);
			success.total = appData.getTotal();
            modal.close();
            appData.clearBasket();
            page.counter = appData.basket.length;
            modal.render({
                content: success.render({})
            });
        })
        .catch(err => {
            console.error(err);
        })
});

events.on('success:close', () => {
	modal.close();
})


// Открытие корзины
events.on('basket:open', () => {
    page.setCounter(appData.order.items.length);
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basket.render({
                total: appData.getTotal(),
            })
        ])
    });
});

// Отображение элементов в корзине
events.on('basket:changed', () => {
	const basketProducts = appData.order.items.map((item, index) => {
		const basketItem = new BasketProduct(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:remove', item),
		});
		return basketItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
            
		});
	});
	basket.render({
		items: basketProducts,
		total: appData.getTotal(),
	});
});

// Удаление из корзины и обновление счетчика
events.on('basket:remove', (item: Product) => {
    appData.removeBasket(item);
    page.setCounter(appData.order.items.length);
});

// Открытие карточки товара
events.on('card:select', (item: Product) => {
    appData.setPreview(item);
});

// Изменена открытая карточка товара (точнее её кнопка, после добавления в корзину)
events.on('preview:changed', (item: Product) => {
	const showCard = (item: Product, buttonOptions: IButtonOptions) => {
		const card = new Card(
			'card',
			cloneTemplate(cardPreviewTemplate),
			buttonOptions,
			{
				onClick: () => events.emit('basket:item-add', item),
			}
		);

		modal.render({
			content: card.render(item),
		});
	};

	if (item) {
		api
			.getProductItem(item.id)
			.then((result) => {
				item.description = result.description;
				showCard(item, {
					disabledButton: appData.findOrderItem(item) != null,
					buttonText: 'Уже в корзине',
				});
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

//Добавляем карточки в корзину
events.on('basket:item-add', (item: Product) => {
	appData.addBasket(item);
    page.setCounter(appData.order.items.length);
	modal.close();
});

// Блокируем прокрутку страницы, если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем лоты с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

// Выводим карточки
events.on('items:changed', () => {
	page.catalog = appData.getProducts().map(item => {
		const card = new Card(
			'card',
			cloneTemplate(cardCatalogTemplate),
			null,
			{
				onClick: () => events.emit('preview:changed', item),
			}
		);
		return card.render(item);
	});
});


