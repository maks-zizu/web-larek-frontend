import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IOrderAddress, IPayment } from '../../types/index';

export class OrderAddress implements IOrderAddress {
	public payment: IPayment = 'cash'; // По умолчанию
	public address = '';

	private formElement: HTMLFormElement;
	private paymentButtons: NodeListOf<HTMLButtonElement>;
	private addressInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;
	private events: IEvents;

	constructor(events: IEvents) {
		this.events = events;

		// Клонируем шаблон формы заказа
		const template = document.getElementById('order') as HTMLTemplateElement;
		this.formElement = template.content.firstElementChild.cloneNode(
			true
		) as HTMLFormElement;

		// Находим элементы формы
		this.paymentButtons = this.formElement.querySelectorAll(
			'.order__buttons .button_alt'
		);
		this.addressInput = ensureElement(
			'input[name="address"]',
			this.formElement
		) as HTMLInputElement;
		this.submitButton = ensureElement(
			'.order__button',
			this.formElement
		) as HTMLButtonElement;

		// Инициализация событий
		this.bindEvents();
	}

	private bindEvents() {
		// Обработчики выбора способа оплаты
		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.paymentButtons.forEach((btn) =>
					btn.classList.remove('button_alt-active')
				);
				button.classList.add('button_alt-active');
				this.payment = button.name as IPayment;
				this.validateForm();
			});
		});

		// Обработчик ввода адреса
		this.addressInput.addEventListener('input', () => {
			this.address = this.addressInput.value.trim();
			this.validateForm();
		});

		// Обработчик отправки формы
		this.formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			this.events.emit('orderAddressSubmitted', {
				payment: this.payment,
				address: this.address,
			});
		});
	}

	private validateForm() {
		if (this.payment && this.address) {
			this.submitButton.disabled = false;
		} else {
			this.submitButton.disabled = true;
		}
	}

	public getElement(): HTMLElement {
		return this.formElement;
	}
}
