import { IEvents } from '../base/events';
import { AppStateModel } from '../model/AppStateModel';
import { OrderAddress } from '../view/OrderAdress';
import { OrderContacts } from '../view/OrderContacts';
import { ProductPreview } from '../view/ProductPreview';
import { Success } from '../view/Success';
import { Modal } from '../view/Modal';
import { IMainController, IOrderData, IProduct } from '../../types';

export class MainController implements IMainController {
	public events: IEvents;
	public model: AppStateModel;
	public modal: Modal;

	constructor(events: IEvents, model: AppStateModel, modal: Modal) {
		this.events = events;
		this.model = model;
		this.modal = modal;
		this.bindEvents();
	}

	public bindEvents(): void {
		this.events.on<{ productId: string }>('addToBasket', ({ productId }) => {
			this.model.addToBasket(productId);
		});

		this.events.on('loadProducts', () => {
			this.model.loadProducts();
		});

		this.events.on<{ productId: string }>(
			'removeFromBasket',
			({ productId }) => {
				this.model.removeFromBasket(productId);
			}
		);

		this.events.on('checkout', () => {
			this.handleCheckout();
		});

		this.events.on<{ payment: string; address: string }>(
			'orderAddressSubmitted',
			(data) => {
				this.model.setOrderField('payment', data.payment);
				this.model.setOrderField('address', data.address);
				this.openContactsForm();
			}
		);

		this.events.on<{ email: string; phone: string }>(
			'orderContactsSubmitted',
			(data) => {
				this.model.setOrderField('email', data.email);
				this.model.setOrderField('phone', data.phone);
				this.submitOrder();
			}
		);

		this.events.on('orderSubmitted', (orderData: IOrderData) => {
			this.showSuccess(orderData.total);
		});

		this.events.on<{ productId: string }>(
			'openProductInfo',
			async ({ productId }) => {
				const product = await this.model.getProductInfo(productId);
				this.showProductPreview(product);
			}
		);
	}

	public handleCheckout(): void {
		const orderAddress = new OrderAddress(this.events);
		this.modal.setContent(orderAddress.getElement());
		this.modal.open();
	}

	public openContactsForm(): void {
		const orderContacts = new OrderContacts(this.events);
		this.modal.setContent(orderContacts.getElement());
		this.modal.open();
	}

	public async submitOrder(): Promise<void> {
		await this.model.submitOrder();
	}

	public showSuccess(total: number): void {
		const successMessage = new Success(total);
		this.modal.setContent(successMessage.getElement());
		this.modal.open();
	}

	public showProductPreview(product: IProduct): void {
		const productPreview = new ProductPreview(product, this.events, this.model);
		this.modal.setContent(productPreview.getElement());
		this.modal.open();
	}
}
