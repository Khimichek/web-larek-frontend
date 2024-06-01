import {Component} from "../base/Component";
import {cloneTemplate, createElement, ensureElement, formatNumber} from "../../utils/utils";
import {EventEmitter} from "../base/events";
import { IBasketProduct } from "../../types";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    button: HTMLButtonElement;
    selected: string[];
}

interface IBasketActions {
    onClick: (event: MouseEvent) => void;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this.button = this.container.querySelector('.button');

        if (this.button) {
            this.button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this.button, false);
        } else {
            this.setDisabled(this.button, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, `${formatNumber(total)} синапсов`);
    }
}

export class BasketProduct extends Component<IBasketProduct> {
    protected _deleteButton: HTMLButtonElement;
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, actions?: IBasketActions) {
        super(container); 

        this._deleteButton = ensureElement<HTMLButtonElement>('.card__button', container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);

		if (this._deleteButton) {
			this._deleteButton.addEventListener('click', (evt) => {
				this.container.remove();
				actions?.onClick(evt);
			});
        }
    }

    set title(value: string) {
		this.setText(this._title, value);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set price(value: number) {
		this.setText(this._price, value + ' синапсов');
	}
}
