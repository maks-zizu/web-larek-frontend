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
	private orderAddress: OrderAddress;
	private orderContacts: OrderContacts;
	private successMessage: Success;
	private productPreview: ProductPreview;

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

		// Создаем экземпляры форм и сообщений один раз
		this.orderAddress = new OrderAddress(this.events);
		this.orderContacts = new OrderContacts(this.events);
		this.successMessage = new Success(this.events);
		this.productPreview = new ProductPreview(this.events);

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
			({ productId }) => {
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
	public async loadProducts(): Promise<void> {
		try {
			const products = await this.api.getProductList();
			this.model.setProductList(products);
		} catch (error) {
			console.error('Ошибка при загрузке продуктов:', error);
		}
	}

	/**
	 * Показ формы для выбора способа оплаты и адреса
	 */
	public handleCheckout(): void {
		// this.orderAddress.reset(); // Сброс формы перед использованием
		this.modal.setContent(this.orderAddress.getElement());
		this.modal.open();
	}

	/**
	 * Открытие формы для ввода контактных данных
	 */
	public openContactsForm(): void {
		// this.orderContacts.reset(); // Сброс формы перед использованием
		this.modal.setContent(this.orderContacts.getElement());
		this.modal.open();
	}

	/**
	 * Асинхронная отправка заказа на сервер с использованием API, обновление состояния и уведомление об успешном оформлении заказа
	 */
	public async submitOrder(): Promise<void> {
		try {
			const order = {
				...this.model.order,
				items: [...this.model.basket],
				total: this.model.getTotalBasketPrice(),
			};
			const orderData = await this.api.createOrder(order);
			this.events.emit('orderSubmitted', orderData);
			this.model.clearBasket();
		} catch (error) {
			console.error('Ошибка при отправке заказа:', error);
		}
	}

	/**
	 * Показ сообщения об успешном оформлении заказа
	 */
	public showSuccess(total: number): void {
		this.successMessage.setTotal(total); // Устанавливаем сумму заказа
		this.modal.setContent(this.successMessage.getElement());
		this.modal.open();
	}

	/**
	 * Показ информации о товаре в модальном окне
	 */
	public showProductPreview(product: IProduct): void {
		const isInBasket = this.model.isProductInBasket(product.id);
		this.productPreview.renderProductData(product, isInBasket);
		this.modal.setContent(this.productPreview.getElement());
		this.modal.open();
	}
}
