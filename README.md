# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
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
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.


## Интерфейсы

### IProduct
`interface IProduct` {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

### IBuyer
`interface IBuyer` {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

### TOrder
`type TOrder = IBuyer &` {
  total: number;
  items: string[];
};

## Модели

### Products
Хранит список товаров и выбранный товар.

Свойства:
`private products: IProduct[]` — массив товаров
`private selectedProduct: IProduct | null` — текущий выбранный товар

Методы:
`setProducts(products: IProduct[]): void` — установить список товаров
`getProducts(): IProduct[]` — вернуть все товары
`getProductById(id: string): IProduct | undefined` — найти товар по ID
`setSelectedProduct(product: IProduct): void` — выбрать товар для просмотра
`clearSelectedProduct(): void` — очистить выбранный товар

### Basket
Управляет корзиной: добавление, удаление, подсчет стоимости.

Свойства:
`private items: IProduct[]` — товары в корзине

Методы:
`getItems(): IProduct[]` — список товаров
`addItem(product: IProduct): void` — добавить товар
`removeItem(productId: string): void` — удалить товар по ID
`clear(): void` — очистить корзину
`getTotalPrice(): number` — сумма всех товаров
`getItemCount(): number` — количество товаров
`hasItem(productId: string): boolean` — проверка наличия товара

### Buyer
Хранит и валидирует данные покупателя.

Свойства:
`private payment: TPayment | null` — способ оплаты
`private email: string` — email
`private phone: string` — телефон
`private address: string` — адрес доставки

Методы:
`setPayment(payment: TPayment): void` — установить оплату
`setEmail(email: string): void` — установить email
`setPhone(phone: string): void` — установить телефон
`setAddress(address: string): void` — установить адрес
`getData(): IBuyer` — получить все данные
`validate(): Partial<Record<keyof IBuyer, string>>` — проверка данных, возвращает ошибки
`clear(): void` — очистка данных

### ServerService
Сервис для работы с API.

Конструктор:
`constructor(private api: IApi)`
`api` — экземпляр `Api` для запросов

Методы:
`fetchProducts(): Promise<IProduct[]>` — загрузка товаров с сервера
`sendOrder(order: TOrder): Promise<{ total: number }>` — отправка заказа

## Представления (Views)

### BaseCard
Базовая карточка товара.

Методы:
`render(data: IProduct): HTMLElement` — отображает товар
`setText(element: HTMLElement, text: string): void` — устанавливает текст
`setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает изображение

#### Наследники BaseCard

CardForCatalog — карточка в каталоге (`product:select`)
CardForPreview — карточка в модальном окне (`product:submit`)
CardForBasket — карточка в корзине (`product:delete`)

### BaseForm
Базовый класс для форм в приложении. Наследуется от `Component<IFormErrorData>`. 
Отвечает за управление состоянием кнопки отправки, отображение ошибок и сброс состояния формы.  

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents)`
`container — DOM-элемент формы`
`events` — объект для работы с событиями (EventEmitter)

Свойства:
`protected submitButton: HTMLButtonElement` — кнопка отправки формы
`protected error: HTMLElement` — элемент для отображения ошибок

Сеттеры:
`set errorText(text: string)` — устанавливает текст ошибки в элемент .form__errors

Методы:
`toggleSubmitButton(enabled: boolean): void` — включает или отключает кнопку отправки
`toggleErrors(value: boolean): void` — показывает или скрывает блок с ошибками `.form__errors-active`
`resetFormState(): void` — сбрасывает текст ошибки и блокирует кнопку отправки

#### Наследники BaseForm
FormOrderView — форма заказа (`payment:changed`, `address:changed`, `form:order:submit`)
FormContactsView — контактная форма (`form:email:changed`, `form:phone:changed`, `form:contacts:submit`)

### Modal
Модальное окно

Методы:
`open(content: HTMLElement): void` — открыть
`close(): void` — закрыть
`setContent(content: HTMLElement): void` — установить содержимое

События:
`modal:close`

### Остальные представления
GalleryView — отображает карточки (`galleryList`, `clear()`)
BasketView — корзина (`basket:open`, `basket:listChange`, `basket:placeOrder`)
FormOrderView — форма заказа (`payment:changed`, `address:changed`, `form:order:submit`)
FormContactsView — контактная форма (`form:email:changed`, `form:phone:changed`, `form:contacts:submit`)
SuccessView — сообщение об успешном заказе (`success:click`)


## Событийная модель
Все компоненты взаимодействуют через `EventEmitter`.

`products:change`      | Загрузка товаров                
`product:select`       | Выбор товара                    
`product:selected:set` | Открытие карточки предпросмотра 
`product:submit`       | Добавление/удаление из корзины  
`basket:open`          | Открытие корзины                
`basket:listChange`    | Обновление корзины              
`basket:placeOrder`    | Переход к форме заказа          
`payment:changed`      | Изменение способа оплаты        
`address:changed`      | Изменение адреса доставки       
`form:order:submit`    | Отправка формы заказа           
`form:contacts:submit` | Отправка контактной формы       
`modal:close`          | Закрытие модального окна        
`success:click`        | Завершение заказа               
