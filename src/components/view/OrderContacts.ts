import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IOrderContacts } from '../../types';

export class OrderContacts implements IOrderContacts {
	public email = '';
	public phone = '';

	private formElement: HTMLFormElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;
	private events: IEvents;

	constructor(events: IEvents) {
		this.events = events;

		// Клонируем шаблон формы контактов
		const template = document.getElementById('contacts') as HTMLTemplateElement;
		this.formElement = template.content.firstElementChild.cloneNode(
			true
		) as HTMLFormElement;

		// Находим элементы формы
		this.emailInput = ensureElement(
			'input[name="email"]',
			this.formElement
		) as HTMLInputElement;
		this.phoneInput = ensureElement(
			'input[name="phone"]',
			this.formElement
		) as HTMLInputElement;
		this.submitButton = ensureElement(
			'.button',
			this.formElement
		) as HTMLButtonElement;

		// Инициализация событий
		this.bindEvents();
	}

	private bindEvents() {
		// Обработчик ввода email
		this.emailInput.addEventListener('input', () => {
			this.email = this.emailInput.value.trim();
			this.validateForm();
		});

		// Обработчик ввода телефона
		this.phoneInput.addEventListener('input', () => {
			this.phone = this.phoneInput.value.trim();
			this.validateForm();
		});

		// Обработчик отправки формы
		this.formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			this.events.emit('orderContactsSubmitted', {
				email: this.email,
				phone: this.phone,
			});
		});
	}

	private validateForm() {
		if (this.email && this.phone) {
			this.submitButton.disabled = false;
		} else {
			this.submitButton.disabled = true;
		}
	}

	public getElement(): HTMLElement {
		return this.formElement;
	}
}
