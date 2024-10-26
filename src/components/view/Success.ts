import { ISuccess } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Success implements ISuccess {
	public total: number; // Общая стоимость заказа
	private element: HTMLElement;

	constructor(totalPrice: number) {
		this.total = totalPrice;

		// Клонируем шаблон сообщения об успешном заказе
		const template = document.getElementById('success') as HTMLTemplateElement;
		this.element = template.content.firstElementChild.cloneNode(
			true
		) as HTMLElement;

		// Инициализируем элемент
		this.init();
	}

	private init() {
		const descriptionElement = ensureElement(
			'.order-success__description',
			this.element
		);
		const closeButton = ensureElement('.order-success__close', this.element);

		// Устанавливаем текст сообщения
		descriptionElement.textContent = `Списано ${this.total} синапсов`;

		// Обработчик нажатия на кнопку закрытия
		closeButton.addEventListener('click', () => {
			// Закрываем модальное окно или перенаправляем пользователя
			window.location.reload();
		});
	}

	public getElement(): HTMLElement {
		return this.element;
	}
}
