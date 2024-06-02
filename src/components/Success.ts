import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";
import { EventEmitter } from "./base/Events";

export interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (this._close) {
            this._close.addEventListener('click', () => {
                events.emit('success:close');
            });
        }
    }

    set total(value: number) {
        const description = `Списано ${value} синапсов`;
        this.setText(this._total, description);
    }
}