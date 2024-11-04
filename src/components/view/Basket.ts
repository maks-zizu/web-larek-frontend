import { IBasket } from '../../types/index';
import { IEvents } from '../base/events';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class Basket implements IBasket {
	private basketElement: HTMLElement;
	private basketList: HTMLElement;
	private totalPriceElement: HTMLElement;
	private checkoutButton: HTMLButtonElement;
	private events: IEvents;
	private basketButton: HTMLButtonElement;

	constructor(events: IEvents) {
		this.events = events;

		// Клонируем шаблон корзины
		this.basketElement = cloneTemplate<HTMLElement>('#basket');

		// Находим элементы внутри корзины
		this.basketList = ensureElement('.basket__list', this.basketElement);
		this.totalPriceElement = ensureElement(
			'.basket__price',
			this.basketElement
		);
		this.checkoutButton = ensureElement(
			'.basket__button',
			this.basketElement
		) as HTMLButtonElement;

		this.basketButton = ensureElement(
			'.button',
			this.basketElement
		) as HTMLButtonElement;

		// Привязываем события
		this.bindEvents();
	}

	private bindEvents() {
		// Обработчик нажатия на кнопку "Оформить"
		this.checkoutButton.addEventListener('click', () => {
			this.events.emit('checkout');
		});

		this.setCheckoutButtonEnabled(false);
	}

	/**
	 * Устанавливает элементы товаров в корзине.
	 */
	public setBasketItems(basketItemElements: HTMLElement[]): void {
		// Очищаем список товаров в корзине
		this.basketList.innerHTML = '';

		// Добавляем элементы товаров в корзину
		basketItemElements.forEach((itemElement) => {
			this.basketList.appendChild(itemElement);
		});
	}

	/**
	 * Устанавливает общую стоимость корзины.
	 */
	public setTotalPrice(totalPrice: number): void {
		this.totalPriceElement.textContent = `${totalPrice} синапсов`;
	}

	/**
	 * Включает или отключает кнопку оформления заказа.
	 */
	public setCheckoutButtonEnabled(enabled: boolean): void {
		this.basketButton.disabled = !enabled;
	}

	/**
	 * Возвращает основной элемент корзины.
	 */
	public getElement(): HTMLElement {
		return this.basketElement;
	}
}
