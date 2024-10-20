/**
 * Интерфейс карточки товара
 */
interface IProductCard {
	id: string;
	title: string;
	category: string;
	image: string;
	description: string;
	price: number | null;
}
