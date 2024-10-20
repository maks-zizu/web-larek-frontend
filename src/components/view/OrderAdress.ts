import { IPayment } from '../../types';

/**
 * Интерфейс формы с оплатой и доставкой
 */
interface IOrderAdress {
	payment: IPayment; // Способ оплаты
	address: string; // Адрес доставки
}
