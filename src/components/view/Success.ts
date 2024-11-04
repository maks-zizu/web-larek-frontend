import { ISuccess } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

export class Success implements ISuccess {
	private element: HTMLElement;
	private events: IEvents; // Экземпляр событий для эмита
	private descriptionElement: HTMLElement;

	constructor(events: IEvents) {
		this.events = events;

		// Клонируем шаблон сообщения об успешном заказе
		const template = document.getElementById('success') as HTMLTemplateElement;
		this.element = template.content.firstElementChild.cloneNode(
			true
		) as HTMLElement;

		// Инициализируем элемент
		this.init();
	}

	private init() {
		this.descriptionElement = ensureElement(
			'.order-success__description',
			this.element
		);
		const closeButton = ensureElement('.order-success__close', this.element);

		// Обработчик нажатия на кнопку закрытия
		closeButton.addEventListener('click', () => {
			// Отправляем событие на закрытие модального окна и очистку корзины
			this.events.emit('success:close');
		});
	}

	public setTotal(total: number): void {
		// Устанавливаем текст сообщения с обновлённой суммой
		this.descriptionElement.textContent = `Списано ${total} синапсов`;
	}

	public getElement(): HTMLElement {
		return this.element;
	}
}
