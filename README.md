# Проектная работа "Веб-ларек"

## Содержание

- [Стек](#стек)
- [Структура основных компонентов проекта](#структура-основных-компонентов-проекта)
- [Установка и запуск](#установка-и-запуск)
- [Описание интерфейса](#описание-интерфейса)
- [Архитектура](#архитектура)
- [Базовые классы (Base)](#базовые-классы-base)
- [Модели данных (Model)](#модели-данных-model)
- [Специальные компоненты](#специальные-компоненты)
- [Отображения (View)](#отображения-view)
- [Презентер (Presenters)](#презентер-presenters)
- [Связь между слоями Model и View через Presenter](#связь-между-слоями-model-и-view-через-presenter)
  - [Как осуществляется связь](#как-осуществляется-связь)
  - [Конкретные пользовательские события и их обработка](#конкретные-пользовательские-события-и-их-обработка)
  - [Пример полного сценария взаимодействия между слоями](#пример-полного-сценария-взаимодействия-между-слоями)

## Стек

HTML, SCSS, TS, Webpack

## Структура основных компонентов проекта

```bash
web-larek/
├── src/
│   ├── components/         # Компоненты приложения
│   │   ├── base/           # Базовые классы и утилиты
│   │   ├── controller/     # Контроллеры (представители)
│   │   ├── model/          # Модели данных и API
│   │   └── view/           # Отображения (представления)
│   ├── pages/
│   │   └── index.html      # Главная страница приложения
│   ├── scss/               # Стили приложения
│   ├── types/              # Типы и интерфейсы TypeScript
│   │   └── index.ts        # Общие типы для проекта
│   ├── utils/              # Вспомогательные функции и константы
│   │   ├── constants.ts    # Константы проекта
│   │   └── utils.ts        # Утилиты для различных задач
│   └── index.ts            # Точка входа приложения
├── .env                    # Переменные окружения
├── package.json            # Конфигурация npm и зависимости
├── README.md               # Документация проекта
└── webpack.config.js       # Конфигурация сборщика Webpack
```

## Установка и запуск

Создать файла .env с ключем `API_ORIGIN`, который указывает на адрес сервера API:

```
API_ORIGIN=https://example.com
```

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание интерфейса

- Просмотр списка товаров и счетчика товаров в корзине (MainPage)
- Просмотр харатеристик товара (ProductCard, ProductPreview)
- Просмотр корзины (Basket)
- Оформление заказа (OrderAdress, OrderContacts, Success)

## Архитектура

Проект реализован с использованием архитектурного паттерна MVP (Model-View-Presenter), обеспечивающего четкое разделение ответственностей между слоями приложения:

`Model (Модель)`:

- В проекте роль модели выполняет AppStateModel, который управляет состоянием приложения и содержит бизнес-логику.
- Модель отвечает за обработку данных, их хранение и управление ими (добавление/удаление из корзины, получение данных от LarekApi и т.д.).
- Она сама не взаимодействует напрямую с представлением, а только оповещает об изменениях через EventEmitter.

`View (Представление)`:

- Представления (MainPage, ProductCard, Basket, Modal и другие классы) отображают данные и принимают пользовательские действия. Каждое представление отвеч-ает за отображение и реакцию на действия в рамках своей области ответственности, не зная деталей работы модели.
- View также обрабатывает клики и другие события, передавая действия через EventEmitter.

`Presenter (Презентер)`:

- MainPresenter выступает в роли посредника между Model и View, принимая на себя связь между ними.
- Презентер обрабатывает пользовательские события и запросы от представлений, при необходимости запрашивает данные у модели и затем передает их в представления для отображения.
- В данном случае MainPresenter реализует логику перехода между состояниями представления (например, показ модальных окон для корзины или информации о товаре), следя за тем, чтобы View и Model оставались независимыми друг от друга.

### Основные части архитектуры

- Базовые классы (Base): Предоставляют общие функциональности для других компонентов.
- Модели данных (Model): Управляют данными и бизнес-логикой приложения.
- Отображения (View): Отвечают за пользовательский интерфейс и взаимодействие с пользователем.
- Презентер (Presenter): Связывают модели и отображения, обрабатывают события и управляют потоком данных.

### Взаимодействие компонентов

1. Пользователь взаимодействует с интерфейсом через View.
2. View отправляет события в Presenter.
3. Presenter обрабатывает события и взаимодействует с Model.
4. Model обновляет данные и уведомляет об изменениях через EventEmitter.
5. Presenter получает обновления от Model и обновляет View.

## Базовые классы (Base)

### Класс `API`

Базовый класс для взаимодействия с серверным API. Содержит методы для выполнения HTTP-запросов и обработки ответов.

### Базовый класс `EventEmitter`

Обеспечивает работу событий внутри приложения. Предоставляет методы установить и снять слушатели событий и эмиссии событий.

Атрибуты:

- listeners: { [event: string]: Function[] } — объект, содержащий списки слушателей для каждого события.

Методы:

- on<T>(event: string, listener: (data: T) => void): void — подписывает слушателя на определенное событие.
- emit<T>(event: string, data: T): void — эмитирует событие и передает данные всем подписанным слушателям.
- off(event: string, listener: Function): void — отписывает слушателя от события.

### Абстрактный `Model`

Абстрактный класс, служит базовым для всех моделей данных. Содержит методы для эмиссии событий при изменении состояния.

Атрибуты:

- events: IEvents — экземпляр EventEmitter для эмиссии событий.

Методы:

- emit(event: string, data?: any): void — эмитирует событие через EventEmitter.

## Модели данных (Model)

### Класс `AppStateModel`

Главная модель приложения, управляющая состоянием товаров, корзины и заказа. Взаимодействует с `LarekApi` для получения данных и оформления заказа.

Функции:

- Хранение списка товаров, информации о конкретном товаре, корзины и заказа.
- Методы для управления корзиной и оформлением заказа.
- Взаимодействие с LarekApi для получения данных.

Атрибуты:

- productList: IProduct[] — массив, содержащий список всех товаров.
- productInfo: IProduct — объект, содержащий данные о выбранном пользователем товаре для предпросмотра.
- basket: string[] — массив productId, представляющих товары в корзине.
- order: IOrder — объект с данными заказа, включая элементы, стоимость и контактную информацию.

Методы:

- constructor(events: IEvents) — инициализирует модель и связывает события.
- setProductList(products: IProduct[]): void — сохраняет список товаров и эмитирует событие productsLoaded.
- setProductInfo(product: IProduct): void — устанавливает выбранный товар для предпросмотра.
- addToBasket(productId: string): void — добавляет товар в корзину.
- removeFromBasket(productId: string): void — удаляет товар из корзины.
- clearBasket(): void — очищает корзину.
- getBasketCount(): number — возвращает количество товаров в корзине.
- getTotalBasketPrice(): number — возвращает общую стоимость товаров в корзине.
- setOrderField(field: keyof IOrder, value: string): void — задает поле для заказа.
- setOrder(): void — инициализирует текущий заказ на основе содержимого корзины.
- toggleBasketItem(productId: string): void — переключает наличие товара в корзине.
- getBasketProducts(): IProduct[] — возвращает список объектов IProduct для корзины на основе productId.

## Специальные компоненты

Данный набор компонентов необходим для работы с API и другими службами.

### Класс `LarekApi`

Класс для взаимодействия с API магазина. Реализует методы для получения списка товаров, информации о товаре и создания заказа.

Функции:

- Получение списка товаров (getProductList).
- Получение информации о товаре (getProductItem).
- Создание заказа (createOrder).

Атрибуты:

- readonly cdn: string — базовый URL для загрузки изображений товаров.
- baseUrl: string — базовый URL для API запросов.
- options?: RequestInit — опции для HTTP-запросов.

Методы:

- getProductList(): Promise<IProduct[]> — получает список товаров.
- getProductItem(id: string): Promise<IProduct> — получает информацию о конкретном товаре по его ID.
- createOrder(order: IOrder): Promise<IOrderData> — создает новый заказ.

## Отображения (View)

### Обстрактный класс `BaseView`

Абстрактный класс BaseView служит базовым для всех представлений (View). Он обеспечивает базовую функциональность для привязки событий и рендеринга данных.

Атрибуты:

- protected events: IEvents — экземпляр EventEmitter для подписки на события.
- protected rootElement: HTMLElement — корневой элемент DOM для отображения содержимого.

Методы:

- constructor(events: IEvents, rootElement: HTMLElement) — инициализирует представление с EventEmitter и корневым элементом.
- public abstract render(data?: any): void — абстрактный метод для рендеринга данных, реализуется в подклассах.

### Глобальные компоненты

Данный набор компонентов необходим для работы со страницей.

### Класс `MainPage`

Отображение главной страницы приложения. Отображает список товаров и количество товаров в корзине.

Атрибуты:

- private galleryElement: HTMLElement — элемент галереи, в котором отображаются карточки товаров.

Методы:

- constructor(events: IEvents, rootElement: HTMLElement) — создает экземпляр MainPage и инициализирует галерею.
- public setProductCards(productCardElements: HTMLElement[]): void — добавляет карточки товаров в галерею.
- public render(): HTMLElement — возвращает корневой элемент страницы.

### Класс `ProductCard`

Представляет собой карточку товара в каталоге. Он отображает информацию о товаре и обрабатывает клики пользователя.

Атрибуты:

- private element: HTMLElement — DOM-элемент карточки товара.
- private product: IProduct — данные товара.
- private events: IEvents — экземпляр EventEmitter для эмиссии событий.

Методы:

- constructor(product: IProduct, events: IEvents) — инициализирует карточку товара с данными товара и EventEmitter.
- private init(): void — инициализирует элементы карточки и привязывает обработчики событий.
- public getElement(): HTMLElement — возвращает DOM-элемент карточки.
- public get id(): string — возвращает ID товара.
- public get title(): string — возвращает название товара.
- public get category(): string — возвращает категорию товара.
- public get image(): string — возвращает URL изображения товара.
- public get description(): string — возвращает описание товара.
- public get price(): number | null — возвращает цену товара.

### Класс `ProductPreview`

Класс ProductPreview отвечает за отображение подробной информации о товаре в модальном окне. Он позволяет добавлять или удалять товар из корзины непосредственно из предпросмотра.

Атрибуты:

- private element: HTMLElement — DOM-элемент предпросмотра товара.
- private productId: string — id текущего товара, сохраняется для передачи в событие добавления/удаления из корзины.
- private events: IEvents — экземпляр EventEmitter для обработки событий.
- private addButton: HTMLButtonElement — кнопка для добавления/удаления товара из корзины.
- private titleElement: HTMLElement — элемент для отображения заголовка товара.
- private categoryElement: HTMLElement — элемент для отображения категории товара.
- private imageElement: HTMLImageElement — элемент для отображения изображения товара.
- private priceElement: HTMLElement — элемент для отображения цены товара.
- private descriptionElement: HTMLElement — элемент для отображения описания

Методы:

- constructor(events: IEvents) - Инициализирует экземпляр класса ProductPreview, принимает экземпляр IEvents для обработки событий. Загружает шаблон карточки предпросмотра и инициализирует внутренние элементы.
- private init(): void — инициализирует элементы и привязывает обработчики событий.
- public renderProductData(product: IProduct, isInBasket: boolean): void — отображает информацию о товаре, обновляет текстовые и графические данные карточки, а также изменяет состояние кнопки в зависимости от того, находится ли товар в корзине.
- private updateButtonLabel(isInBasket = false): void — обновляет текст кнопки добавления/удаления товара на основе его наличия в корзине.
- private handleButtonClick(): void — обрабатывает событие клика на кнопку добавления/удаления товара из корзины и отправляет событие toggleBasketItem с ID товара. Также инициирует закрытие модального окна после нажатия.
- public getElement(): HTMLElement — возвращает корневой DOM-элемент предпросмотра товара для отображения в модальном окне.

### Класс `BasketItem`

BasketItem представляет собой элемент корзины с товарами, отображающий информацию о продукте и позволяющий удалять его из корзины.

Атрибуты:

- private itemElement: HTMLElement — DOM-элемент, представляющий элемент корзины.
- private product: IProduct — данные о продукте, представленные в корзине.
- private events: IEvents — экземпляр EventEmitter для управления событиями.

Методы:

- constructor(product: IProduct, events: IEvents) — создает экземпляр BasketItem.
- private init(): void — инициализирует элементы внутри корзины и привязывает обработчики событий.
- public setIndex(index: number): void — устанавливает индекс элемента в списке корзины.
- public getElement(): HTMLElement — возвращает DOM-элемент корзины.

### Класс `Basket`

Класс Basket представляет корзину товаров. Он отображает список товаров в корзине и позволяет оформить заказ.

Атрибуты:

- private basketElement: HTMLElement — корневой DOM-элемент корзины, который содержит все элементы корзины.
- private basketList: HTMLElement — элемент списка, в котором отображаются товары, добавленные в корзину.
- private totalPriceElement: HTMLElement — элемент, отображающий общую стоимость всех товаров в корзине.
- private checkoutButton: HTMLButtonElement — кнопка для перехода к оформлению заказа.
- private events: IEvents — экземпляр EventEmitter для обработки событий, связанных с корзиной.
- private basketButton: HTMLButtonElement — кнопка корзины в заголовке для вызова модального окна корзины.

Методы:

- constructor(events: IEvents) — создает экземпляр класса Basket и инициализирует его, связывая с переданным экземпляром EventEmitter для обработки событий корзины. Находит элементы корзины в DOM и привязывает события.
- private bindEvents(): void — привязывает обработчики событий для корзины, такие как клик по кнопке оформления заказа, который вызывает событие checkout.
- public setBasketItems(basketItemElements: HTMLElement[]): void — принимает массив DOM-элементов товаров и отображает их в корзине. Предварительно очищает текущий список товаров.
- public setTotalPrice(totalPrice: number): void — обновляет элемент, отображающий общую стоимость товаров в корзине, с учетом переданной суммы.
- public setCheckoutButtonEnabled(enabled: boolean): void — включает или отключает кнопку оформления заказа в зависимости от наличия товаров в корзине.
- public getElement(): HTMLElement — возвращает корневой элемент корзины, который может быть использован для добавления корзины на страницу.

### Класс `OrderAdress`

Представляет форму оформления заказа с информацией об способе оплаты и адресом доставки.

Атрибуты:

- public payment: IPayment — выбранный способ оплаты.
- public address: string — указанный адрес доставки.
- private formElement: HTMLFormElement — DOM-элемент формы.
- private paymentButtons: NodeListOf<HTMLButtonElement> — кнопки выбора способа оплаты.
- private addressInput: HTMLInputElement — поле ввода адреса.
- private submitButton: HTMLButtonElement — кнопка отправки формы.
- private events: IEvents — экземпляр EventEmitter.

Методы:

- constructor(events: IEvents) — инициализирует форму.
- private bindEvents(): void — привязывает обработчики событий формы.
- private validateForm(): void — проверяет валидность формы и активирует/деактивирует кнопку отправки.
- public reset(): void — сбрасывает поля формы.
- public getElement(): HTMLElement — возвращает DOM-элемент формы.

### Класс `OrderContacts`

Представляет форму оформления заказа с контактной информацией покупателя.

Атрибуты:

- public email: string — введенный email.
- public phone: string — введенный номер телефона.
- private formElement: HTMLFormElement — DOM-элемент формы.
- private emailInput: HTMLInputElement — поле ввода email.
- private phoneInput: HTMLInputElement — поле ввода телефона.
- private submitButton: HTMLButtonElement — кнопка отправки формы.
- private events: IEvents — экземпляр EventEmitter.

Методы:

- constructor(events: IEvents) — инициализирует форму.
- private bindEvents(): void — привязывает обработчики событий формы.
- private validateForm(): void — проверяет валидность формы и активирует/деактивирует кнопку отправки.
- public reset(): void — сбрасывает поля формы.
- public getElement(): HTMLElement — возвращает DOM-элемент формы.

### Класс `Success`

Отображает информацию об успешно оформленном заказе.

Атрибуты:

- private element: HTMLElement — DOM-элемент для сообщения об успехе.
- private descriptionElement: HTMLElement — элемент для отображения текста с суммой заказа.
- private events: IEvents — экземпляр EventEmitter для обработки событий закрытия.

Методы:

- constructor(events: IEvents) — инициализирует DOM-элемент с привязкой событий.
- private init(): void — инициализирует элементы и привязывает обработчик события закрытия.
- public setTotal(total: number): void — устанавливает общую стоимость заказа и обновляет текст сообщения.
- public getElement(): HTMLElement — возвращает DOM-элемент сообщения.

### Класс `Modal`

Управление модальным окном, включая его отображение, скрытие и обновление содержимого. Он также управляет прокруткой фона при открытии/закрытии.

Функции:

- Открытие и закрытие модальных окон.
- Управление содержимым модального окна.
- Обработка событий внутри модального окна.
- Управление прокруткой фона.

Атрибуты:

- private modalElement: HTMLElement — корневой элемент модального окна.
- private modalContainer: HTMLElement — контейнер для содержимого модального окна.
- private modalContent: HTMLElement — элемент для добавления содержимого.
- private closeButton: HTMLElement — кнопка для закрытия окна.
- private wrapper: HTMLElement — элемент фона (страницы) для блокировки прокрутки.

Методы:

- constructor() — инициализирует модальное окно, элементы и события.
- private bindEvents() — добавляет обработчики закрытия модального окна.
- public setContent(content: HTMLElement) — заменяет содержимое модального окна новым содержимым.
- public open() — открывает окно и блокирует прокрутку фона.
- public close() — закрывает окно и разблокирует прокрутку фона.

## Презентер (Presenters)

### `MainPresenter`

Класс `MainPresenter` выступает в роли презентера и связывает пользовательские действия с моделью `AppStateModel`. Он обрабатывает события от представлений и вызывает соответствующие методы модели.

Атрибуты:

- public events: IEvents — экземпляр EventEmitter для обмена событиями между компонентами.
- public model: AppStateModel — модель состояния приложения, содержащая данные о товарах, корзине и заказах.
- public api: LarekApi — экземпляр API-клиента для взаимодействия с сервером.
- public modal: Modal — экземпляр класса Modal для управления отображением модальных окон.
- private orderAddress: OrderAddress — экземпляр класса OrderAddress для отображения формы с информацией о доставке.
- private orderContacts: OrderContacts — экземпляр класса OrderContacts для отображения формы с контактной информацией.
- private successMessage: Success — экземпляр класса Success для отображения сообщения об успешном оформлении заказа.
- private productPreview: ProductPreview — экземпляр класса ProductPreview для предпросмотра товара.

Методы:

- constructor(events: IEvents, model: AppStateModel, api: LarekApi, modal: Modal) — инициализирует объект презентера, связывая его с событиями, моделью, API и модальным окном.
- public bindEvents(): void — регистрирует обработчики событий интерфейса, включая добавление и удаление товара из корзины, оформление заказа и показ модальных окон для ввода информации.
- public async loadProducts(): Promise<void> — загружает список продуктов через API и обновляет модель с их данными.
- public handleCheckout(): void — инициирует процесс оформления заказа, открывая форму для ввода адреса и способа оплаты.
- public openContactsForm(): void — открывает форму для ввода контактной информации (телефон и email).
- public async submitOrder(): Promise<void> — отправляет заказ через API, обновляет модель, очищает корзину и уведомляет об успешном оформлении заказа.
- public showSuccess(total: number): void — отображает сообщение об успешном оформлении заказа, указывая итоговую сумму.
- public showProductPreview(product: IProduct): void — открывает предпросмотр товара в модальном окне и позволяет добавить/удалить его из корзины.

Обработка событий в bindEvents():

- `toggleBasketItem` — добавляет или удаляет товар из корзины на основе его текущего состояния.
- `checkout` — открывает окно оформления заказа.
- `orderAddressSubmitted` — обрабатывает отправку данных адреса и метода оплаты.
- `orderContactsSubmitted` — обрабатывает ввод контактных данных клиента.
- `orderSubmitted` — обрабатывает успешное завершение заказа.
- `openProductInfo` — открывает окно предпросмотра товара.
- `closeModal` — закрывает модальное окно.

## Связь между слоями Model и View через Presenter

### Как осуществляется связь

1. EventEmitter используется для обмена событиями между слоями View, Model и Presenter.

- View эмитирует события пользовательских действий (например, нажатия кнопок), которые подписываются в Presenter.
- Model эмитирует события об изменениях данных (например, обновление корзины), на которые подписываются Presenter и View.

2. Presenter (в данном случае MainPresenter):

- Подписывается на события от View, обрабатывает их, вызывает соответствующие методы в Model.
- Слушает изменения состояния от Model, обновляя View с помощью вызова методов для рендеринга или обновления данных.

3. Model:

- Изменяет состояние данных в ответ на действия от Presenter.
- Эмитирует события, чтобы уведомить View о необходимости обновить отображение.

### Конкретные пользовательские события и их обработка:

#### Клики по элементам интерфейса:

- Клик на товар в каталоге (`openProductInfo`):

  - View (через ProductCard) эмитирует openProductInfo с productId.
  - Presenter подписывается на openProductInfo, получает данные товара из Model и вызывает showProductPreview.

- Клик на кнопку "В корзину" или "Удалить из корзины" (`toggleBasketItem`):

  - View (ProductPreview) эмитирует событие toggleBasketItem.
  - Presenter подписывается на toggleBasketItem и вызывает toggleBasketItem в Model для добавления или удаления товара.
  - Model обновляет корзину и эмитирует basket:change.
  - View (Basket, MainPage) подписывается на basket:change и обновляет отображение корзины и счётчика.

- Клик на кнопку корзины в шапке сайта (открытие корзины):

  - View: При клике открывается корзина с помощью Modal, отображая содержимое, полученное от Basket.

- Клик на кнопку "Оформить" (`checkout`):

  - View (Basket) эмитирует checkout, который инициирует отображение формы с адресом и способом оплаты через Presenter.
  - Перед отображением формы, MainPresenter проверяет, есть ли товары в корзине, и не позволяет начать оформление заказа, если корзина пуста.

#### Отправка форм:

- Отправка формы выбора способа оплаты и адреса (`orderAddressSubmitted`):

  - View (OrderAddress): Эмитирует orderAddressSubmitted с данными формы.
  - Presenter подписывается на orderAddressSubmitted и вызывает openContactsForm для отображения следующей формы.

- Отправка формы контактных данных (`orderContactsSubmitted`):

  - View (OrderContacts): Эмитирует orderContactsSubmitted.
  - Presenter подписывается на orderContactsSubmitted и вызывает submitOrder для отправки заказа.

#### Обновления состояния:

- Обновление корзины (`basket:change`):

  - Model: После изменения корзины эмитирует basket:change.
  - View (Basket, MainPage): Подписаны на basket:change для обновления корзины и счётчика.
  - При первой загрузке приложения, после загрузки продуктов, View (Basket) инициализирует состояние кнопки "Оформить" в соответствии с наличием товаров в корзине.

- Загрузка списка товаров (`productsLoaded`):

  - Model загружает данные о товарах, затем эмитирует productsLoaded.
  - View (MainPage) подписывается на productsLoaded и вызывает render.
  - После загрузки продуктов, View инициализирует состояние корзины и кнопки "Оформить".

- Оформление заказа (`orderSubmitted`):

  - Model отправляет данные заказа через API, после успешного ответа от сервера эмитирует orderSubmitted.
  - Presenter подписывается на orderSubmitted и вызывает showSuccess для отображения сообщения об успешном оформлении заказа.
  - View (Success) показывает сообщение об успешном оформлении заказа.

### Пример полного сценария взаимодействия между слоями:

1. Пользователь нажимает на карточку товара в каталоге.

- View (ProductCard): Эмитирует событие openProductInfo с productId.
- Presenter (MainPresenter):
  - Подписывается на openProductInfo.
  - Получает данные товара из model.getProductInfo(productId).
  - Вызывает showProductPreview для отображения модального окна с предпросмотром товара.

2. Пользователь нажимает кнопку "В корзину" в предпросмотре товара.

- View (ProductPreview) эмитирует toggleBasketItem.
- Presenter:
  - Подписан на событие toggleBasketItem.
  - Вызывает model.toggleBasketItem(productId) для добавления товара в корзину.
- Model:
  - Обновляет состояние корзины.
  - Эмитирует basket:change для уведомления о том, что корзина обновилась.
- View (Basket, MainPage):
  - Подписаны на basket:change.
  - Обновляют отображение корзины, счётчика и состояние кнопки "Оформить".

3. Пользователь кликает на кнопку "Оформить" в корзине.

- View: Эмитирует событие checkout.
- Presenter:
  - Подписан на checkout.
  - Вызывает handleCheckout для отображения формы с адресом и оплатой.

4. Пользователь заполняет форму адреса и нажимает "Далее".

- View (OrderAddress): Эмитирует orderAddressSubmitted с payment и address.
- Presenter:
  - Подписан на orderAddressSubmitted.
  - Вызывает model.setOrderField для сохранения данных.
  - Вызывает openContactsForm для отображения следующей формы с контактными данными.

5. Пользователь заполняет контактные данные и нажимает "Отправить заказ".

- View (OrderContacts) эмитирует orderContactsSubmitted с email и phone.
- Presenter:
  - Подписан на orderContactsSubmitted.
  - Вызывает submitOrder для отправки заказа.
  - Вызывает showSuccess для отображения сообщения об успешном оформлении заказа.
- Model:
  - Обрабатывает заказ и отправляет данные на сервер.
  - После успешного ответа эмитирует orderSubmitted.
- View (Success):
  - Подписан на orderSubmitted и отображает сообщение об успешном заказе.
  - Подписан на success:close.
  - Вызывает modal.close() для закрытия модального окна.
