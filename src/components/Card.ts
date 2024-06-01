import {Component} from "./base/Component";
import {IProduct} from "../types";
import {bem, createElement, ensureElement} from "../utils/utils";
//import clsx from "clsx";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface IButtonOptions {
	disabledButton: boolean;
	buttonText: string;
}

export interface ICard<T> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    button?: string;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement;
    _button?: HTMLButtonElement;

    categoryProperties: { [key: string]: string } = {
        'софт-скил': 'card__category_soft',
        'другое': 'card__category_other',
        'дополнительное': 'card__category_additional',
        'кнопка': 'card__category_button',
        'хард-скил': 'card__category_hard',
    };

    constructor(protected blockName: string, container: HTMLElement, buttonOptions?: IButtonOptions, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._category = container.querySelector(`.${blockName}__category`)

		if (buttonOptions?.disabledButton) {
			this.setDisabled(this._button, buttonOptions.disabledButton);
			this.setText(this._button, buttonOptions.buttonText);
		}
        
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }

    set price(value: number | null) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (!value) {
			this.setDisabled(this._button, true);
            this.setText(this._button, 'Нельзя купить');
		}
	}
/*
    //устанавливаем текст на кнопку
	set buttonText(value: string) {
		this.setText(this._button, value);
		// обновляем состояние кнопки в зависимости от текста
		if (value === 'Уже в корзине') {
			this.setDisabled(this._button, true);
		}
	}
*/

set category(value: string) {
    this.setText(this._category, value);
    this._category.classList.add(this.categoryProperties[value]);
}
}

//export type CatalogItemStatus = {
 //   status: LotStatus,
 //   label: string
//};

/*export class CatalogItem extends Card<CatalogItemStatus> {
    protected _status: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._status = ensureElement<HTMLElement>(`.card__status`, container);
    }

    set status({ status, label }: CatalogItemStatus) {
        this.setText(this._status, label);
        this._status.className = clsx('card__status', {
            [bem(this.blockName, 'status', 'active').name]: status === 'active',
            [bem(this.blockName, 'status', 'closed').name]: status === 'closed'
        });
    }
}*/

/*
interface IAuctionActions {
    onSubmit: (price: number) => void;
}*/

/*export class Auction extends Component<AuctionStatus> {
    protected _time: HTMLElement;
    protected _label: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _input: HTMLInputElement;
    protected _history: HTMLElement;
    protected _bids: HTMLElement
    protected _form: HTMLFormElement;

    constructor(container: HTMLElement, actions?: IAuctionActions) {
        super(container);

        this._time = ensureElement<HTMLElement>(`.lot__auction-timer`, container);
        this._label = ensureElement<HTMLElement>(`.lot__auction-text`, container);
        this._button = ensureElement<HTMLButtonElement>(`.button`, container);
        this._input = ensureElement<HTMLInputElement>(`.form__input`, container);
        this._bids = ensureElement<HTMLElement>(`.lot__history-bids`, container);
        this._history = ensureElement<HTMLElement>('.lot__history', container);
        this._form = ensureElement<HTMLFormElement>(`.lot__bid`, container);

        this._form.addEventListener('submit', (event) => {
            event.preventDefault();
            actions?.onSubmit?.(parseInt(this._input.value));
            return false;
        });
    }

    set time(value: string) {
        this.setText(this._time, value);
    }
    set label(value: string) {
        this.setText(this._label, value);
    }
    set nextBid(value: number) {
        this._input.value = String(value);
    }
    set history(value: number[]) {
        this._bids.replaceChildren(...value.map(item => createElement<HTMLUListElement>('li', {
            className: 'lot__history-item',
            textContent: formatNumber(item)
        })));
    }

    set status(value: LotStatus) {
        if (value !== 'active') {
            this.setHidden(this._history);
            this.setHidden(this._form);
        } else {
            this.setVisible(this._history);
            this.setVisible(this._form);
        }
    }

    focus() {
        this._input.focus();
    }
}

export interface BidStatus {
    amount: number;
    status: boolean;
}

/*export class BidItem extends Card<BidStatus> {
    protected _amount: HTMLElement;
    protected _status: HTMLElement;
    protected _selector: HTMLInputElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('bid', container, actions);
        this._amount = ensureElement<HTMLElement>(`.bid__amount`, container);
        this._status = ensureElement<HTMLElement>(`.bid__status`, container);
        this._selector = container.querySelector(`.bid__selector-input`);

        if (!this._button && this._selector) {
            this._selector.addEventListener('change', (event: MouseEvent) => {
                actions?.onClick?.(event);
            })
        }
    }

    set status({ amount, status }: BidStatus) {
        this.setText(this._amount, formatNumber(amount));

        if (status) this.setVisible(this._status);
        else this.setHidden(this._status);
    }
}*/