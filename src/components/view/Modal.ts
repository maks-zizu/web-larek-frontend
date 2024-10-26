import { IModal } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Modal implements IModal {
	private modalElement: HTMLElement;
	private modalContainer: HTMLElement;
	private modalContent: HTMLElement;
	private closeButton: HTMLElement;

	constructor() {
		// Находим элементы модального окна
		this.modalElement = ensureElement('#modal-container');
		this.modalContainer = ensureElement('.modal__container', this.modalElement);
		this.modalContent = ensureElement('.modal__content', this.modalElement);
		this.closeButton = ensureElement('.modal__close', this.modalElement);

		// Привязываем события
		this.bindEvents();
	}

	private bindEvents() {
		// Закрытие модального окна при нажатии на кнопку закрытия
		this.closeButton.addEventListener('click', () => {
			this.close();
		});

		// Закрытие модального окна при клике вне контейнера
		this.modalElement.addEventListener('click', (event) => {
			if (event.target === this.modalElement) {
				this.close();
			}
		});
	}

	public setContent(content: HTMLElement): void {
		// Очищаем содержимое и добавляем новый контент
		this.modalContent.innerHTML = '';
		this.modalContent.appendChild(content);
	}

	public open(): void {
		this.modalElement.classList.add('modal_active');
	}

	public close(): void {
		this.modalElement.classList.remove('modal_active');
	}
}
