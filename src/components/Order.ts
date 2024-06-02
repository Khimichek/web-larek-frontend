import { Form } from "./common/Form";
import {IOrderContacts, IOrderAddress, IOrderForm} from "../types/index";
import {EventEmitter, IEvents} from "./base/Events";
import {ensureElement} from "../utils/utils";

export class OrderAddress extends Form<IOrderAddress> {
    protected _onlineButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _paymentContainer: HTMLDivElement;
    payment: string;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._paymentContainer = ensureElement<HTMLDivElement>('.order__buttons', this.container);
        this._onlineButton = this._paymentContainer.querySelector('[name="card"]');
        this._cashButton = this._paymentContainer.querySelector('[name="cash"]');

        if (this._cashButton) {
			this._cashButton.addEventListener('click', (el) => {
                el.preventDefault();
				this._cashButton.classList.add('button_alt-active');
				this._onlineButton.classList.remove('button_alt-active');
				this.setPayment('payment', 'При получении');
			});
		}
		if (this._onlineButton) {
			this._onlineButton.addEventListener('click', (el) => {
                el.preventDefault;
				this._onlineButton.classList.add('button_alt-active');
				this._cashButton.classList.remove('button_alt-active');
				this.setPayment('payment', 'Онлайн');
			});
		}
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = '';
    }

    setPayment(field: keyof IOrderForm, value: string) {
        this.events.emit('order.payment:change', {field, value,});
    }
}

export class OrderContacts extends Form<IOrderContacts> {

    protected _button: HTMLElement;
    protected _email: HTMLElement;
    protected _phone: HTMLElement;

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container, events);

        this._button = container.querySelector('.button[type="submit"]');
        this._email = this.container.querySelector('input[name="email"]');
        this._phone = this.container.querySelector('button[type="submit"]');
    
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('success:open');
            });
        }
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}