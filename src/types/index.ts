// Перечисление категорий товаров
export type ICategory =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ICategory;
	price: number | null;
}

// Способы оплаты
export type IPayment = 'cash' | 'card';

export interface IOrder {
	items: string[]; // массив id выбранных товаров
	total: number; // общая сумма заказа
	payment: IPayment;
	address: string;
	email: string;
	phone: string;
}

export interface IOrderData {
	id: string; // id заказа
	total: number; // сумма заказа
}

export interface ILarekApi {
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	createOrder: (order: IOrder) => Promise<IOrderData>;
}
