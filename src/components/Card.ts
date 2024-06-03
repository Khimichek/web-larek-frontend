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

export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    button?: string;
}

export class Card extends Component<ICard> {
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
			this.setDisabled(this._button, true);
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

    set category(value: string) {
        this.setText(this._category, value);
        this.toggleClass(this._category, this.categoryProperties[value], true);
    }
}