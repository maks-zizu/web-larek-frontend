import { IEvents } from '../base/events';
import { AppStateModel } from '../model/AppStateModel';
import { LarekApi } from '../model/LarekApi';
import { Modal } from '../view/Modal';
import { OrderContacts } from '../view/OrderContacts';
import { ProductPreview } from '../view/ProductPreview';
import { Success } from '../view/Success';
import { IMainPresenter, IOrderData, IProduct } from '../../types';
import { OrderAddress } from '../view/OrderAdress';

export class MainPresenter implements IMainPresenter {
	public events: IEvents;
	public model: AppStateModel;
	public api: LarekApi;
	public modal: Modal;

	constructor(
		events: IEvents,
		model: AppStateModel,
		api: LarekApi,
		modal: Modal
	) {
		this.events = events;
		this.model = model;
		this.api = api;
		this.modal = modal;
		this.bindEvents();
	}

	public bindEvents(): void {
		// Событие для добавления/удаления товара в корзине
		this.events.on<{ productId: string }>(
			'toggleBasketItem',
			({ productId }) => {
				this.model.toggleBasketItem(productId);
			}
		);

		this.events.on('checkout', () => this.handleCheckout());

		// События заказа
		this.events.on<{ payment: string; address: string }>(
			'orderAddressSubmitted',
			({ payment, address }) => {
				this.model.setOrderField('payment', payment);
				this.model.setOrderField('address', address);
				this.openContactsForm();
			}
		);

		this.events.on<{ email: string; phone: string }>(
			'orderContactsSubmitted',
			({ email, phone }) => {
				this.model.setOrderField('email', email);
				this.model.setOrderField('phone', phone);
				this.submitOrder();
			}
		);

		this.events.on('orderSubmitted', (orderData: IOrderData) => {
			this.showSuccess(orderData.total);
		});

		// Событие для открытия информации о товаре
		this.events.on<{ productId: string }>(
			'openProductInfo',
			async ({ productId }) => {
				const product = this.model.getProductInfo(productId);
				if (product) {
					this.showProductPreview(product);
				}
			}
		);

		// Закрытие модального окна при получении события 'closeModal'
		this.events.on('closeModal', () => {
			this.modal.close();
		});
	}

	/**
	 * Асинхронная загрузка списка продуктов из API и обновление модели
	 */
	async loadProducts(): Promise<void> {
		const products = await this.api.getProductList();
		this.model.setProductList(products);
	}

	/**
	 * Показ формы для выбора способа оплаты и адреса
	 */
	public handleCheckout(): void {
		const orderAddress = new OrderAddress(this.events);
		this.modal.setContent(orderAddress.getElement());
		this.modal.open();
	}

	/**
	 * Открытие формы для ввода контактных данных
	 */
	public openContactsForm(): void {
		const orderContacts = new OrderContacts(this.events);
		this.modal.setContent(orderContacts.getElement());
		this.modal.open();
	}

	/**
	 * Асинхронная отправка заказа на сервер с использованием API, обновление состояния и уведомление об успешном оформлении заказа
	 */
	public async submitOrder(): Promise<void> {
		const order = {
			...this.model.order,
			items: this.model.basket.map((el) => el),
			total: this.model.getTotalBasketPrice(),
		};
		const orderData = await this.api.createOrder(order);
		this.events.emit('orderSubmitted', orderData);
		this.model.clearBasket();
	}

	/**
	 * Показ сообщения об успешном оформлении заказа
	 */
	public showSuccess(total: number): void {
		const successMessage = new Success(total);
		this.modal.setContent(successMessage.getElement());
		this.modal.open();
	}

	/**
	 * Показ информации о товаре в модальном окне
	 */
	public showProductPreview(product: IProduct): void {
		const productPreview = new ProductPreview(this.events);
		const isInBasket = this.model.isProductInBasket(product.id);
		productPreview.renderProductData(product, isInBasket);
		this.modal.setContent(productPreview.getElement());
		this.modal.open();
	}
}
