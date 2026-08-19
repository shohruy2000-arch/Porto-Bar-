'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, MultilingualText } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translate: (text: MultilingualText | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.menu': { ru: 'Меню', en: 'Menu', zh: '菜单' },
  'nav.promotions': { ru: 'Акции', en: 'Promotions', zh: '特惠活动' },
  'nav.waiter': { ru: 'Официант', en: 'Call Waiter', zh: '呼叫服务员' },
  'nav.roomService': { ru: 'В номер 2227', en: 'Room Order', zh: '客房送餐' },
  'nav.loyalty': { ru: 'Porto Club', en: 'Porto Club', zh: '俱乐部' },
  
  // Hero & Contacts Info
  'hero.slogan': { 
    ru: '«Выберите что хотите заказать, <span class="text-porto-gold-bright font-black not-italic">добавьте в корзину</span> и <span class="text-porto-gold-bright font-black not-italic">покажите официанту</span>.<br/><span class="text-gray-400 text-[10.5px] mt-1.5 block not-italic font-sans font-medium tracking-wide">Для заказа в номер — оформите заказ в корзине, указав номер комнаты</span>»', 
    en: '“Choose what you want to order, <span class="text-porto-gold-bright font-black not-italic">add to cart</span> and <span class="text-porto-gold-bright font-black not-italic">show to the waiter</span>.<br/><span class="text-gray-400 text-[10.5px] mt-1.5 block not-italic font-sans font-medium tracking-wide">For room service — place your order in the cart, specifying your room number</span>”', 
    zh: '“选择您想点的菜品，<span class="text-porto-gold-bright font-black not-italic">加入购物车</span>并<span class="text-porto-gold-bright font-black not-italic">向服务员出示</span>。<br/><span class="text-gray-400 text-[10px] mt-1.5 block not-italic font-sans font-medium tracking-wide">如需客房送餐 — 请在购物车中提交订单，并注明您的房间号</span>”' 
  },
  'hero.openMenu': { ru: 'Открыть меню', en: 'Open Menu', zh: '查看菜单' },
  'info.location': { 
    ru: 'Мы находимся на первом этаже гостиницы Аструс', 
    en: 'We are located on the first floor of the Astrus hotel', 
    zh: '我们位于阿斯特鲁斯酒店一楼' 
  },
  'info.phone': { ru: 'Телефон:', en: 'Phone:', zh: '电话：' },
  'info.roomOrder': { ru: 'Заказ в номер:', en: 'Room service:', zh: '客房送餐：' },
  'info.roomSpeedDial': { ru: 'Внутренний номер:', en: 'Internal line:', zh: '内线：' },
  
  // Placeholders & Statuses
  'placeholder.photoTitle': { ru: 'ФОТО В РАЗРАБОТКЕ', en: 'PHOTO IN PROGRESS', zh: '图片整理中' },
  'placeholder.photoSubtitle': { ru: 'СКОРО БУДЕТ ДОБАВЛЕНО', en: 'COMING SOON', zh: '敬请期待' },
  
  // Labels & Details
  'label.new': { ru: 'Новинка', en: 'New', zh: '新品' },
  'label.bestseller': { ru: 'Хит', en: 'Bestseller', zh: '畅销' },
  'label.recommended': { ru: 'Шеф рекомендует', en: 'Chef recommends', zh: '主厨推荐' },
  'label.vegetarian': { ru: 'Вегетарианское', en: 'Vegetarian', zh: '素食' },
  'label.spicy': { ru: 'Острое', en: 'Spicy', zh: '辣' },
  'label.weight': { ru: 'Вес:', en: 'Weight:', zh: '重量：' },
  'label.price': { ru: 'Цена:', en: 'Price:', zh: '价格：' },
  'label.rub': { ru: '₽', en: 'RUB', zh: '卢布' },
  'label.prepTime': { ru: 'Время приготовления:', en: 'Prep time:', zh: '烹饪时间：' },
  'label.mins': { ru: 'мин', en: 'min', zh: '分钟' },
  'label.prepTimeNotice': {
    ru: '* При высокой загруженности кухни время приготовления может быть увеличено',
    en: '* During high kitchen workload, preparation time may be increased',
    zh: '* 厨房忙碌时，烹饪时间可能会延长'
  },
  
  // Interface
  'ui.search': { ru: 'Поиск блюд, описаний...', en: 'Search dishes, descriptions...', zh: '搜索菜品、描述...' },
  'ui.allCategories': { ru: 'Все категории', en: 'All categories', zh: '全部类别' },
  'ui.noItems': { ru: 'Блюда не найдены', en: 'No dishes found', zh: '未找到相关菜品' },
  'ui.close': { ru: 'Закрыть', en: 'Close', zh: '关闭' },
  
  // Call Waiter Modal
  'waiter.title': { ru: 'Вызов официанта', en: 'Call Waiter', zh: '呼叫服务员' },
  'waiter.subtitle': { ru: 'Укажите номер вашего стола', en: 'Please enter your table number', zh: '请填写您的桌号' },
  'waiter.tablePlaceholder': { ru: 'Номер стола', en: 'Table number', zh: '桌号' },
  'waiter.callBtn': { ru: 'Вызвать официанта', en: 'Call Waiter', zh: '呼叫服务员' },
  'waiter.success': { 
    ru: 'Официант успешно вызван на стол', 
    en: 'Waiter successfully called to table', 
    zh: '呼叫服务员成功！桌号' 
  },
  'waiter.successDesc': { 
    ru: 'Ожидайте, время прибытия около 2 минут.', 
    en: 'Please wait, average arrival time is 2 minutes.', 
    zh: '请稍候，预计服务员将在2分钟内到达。' 
  },
  
  // Room Order Modal
  'cart.title': { ru: 'Заказ в номер', en: 'Room Service Order', zh: '客房送餐清单' },
  'cart.subtitle': { 
    ru: 'Выберите блюда в меню, введите ваш номер комнаты и позвоните по внутреннему телефону 2227 для оформления заказа.', 
    en: 'Select dishes, enter your room number, and call extension 2227 to place your order.', 
    zh: '请在菜单中选择菜品，输入您的房间号，拨打内线 2227 即可下单。' 
  },
  'cart.roomPlaceholder': { ru: 'Номер комнаты', en: 'Room number', zh: '房间号' },
  'cart.empty': { ru: 'Ваш список заказа пуст', en: 'Your order list is empty', zh: '您的清单是空的' },
  'cart.addInstructions': { ru: 'Добавьте блюда в меню', en: 'Add dishes from the menu', zh: '请在菜单中添加菜品' },
  'cart.callActionBtn': { ru: 'Позвонить 2227 и заказать', en: 'Call 2227 to Order', zh: '拨打 2227 下单' },
  'cart.addToCart': { ru: 'В заказ', en: 'Add to Order', zh: '添加' },
  'cart.itemsCount': { ru: 'позиций', en: 'items', zh: '件' },
  'cart.total': { ru: 'Итого:', en: 'Total:', zh: '总计：' },
  'cart.checkoutBtn': { ru: 'Оформить заказ', en: 'Checkout', zh: '去结算' },
  'promo.banner.eligible': {
    ru: '🎉 Вы получили Пиццу Маргарита в подарок при доставке в номер!',
    en: '🎉 You earned a free Pizza Margherita with room delivery!',
    zh: '🎉 您的客房送餐已获赠免费玛格丽特披萨！'
  },
  'promo.banner.notEligible': {
    ru: 'Добавьте блюд еще на {amount} ₽ для подарка (Пицца Маргарита)!',
    en: 'Add {amount} ₽ more to get a free Pizza Margherita!',
    zh: '再添加 {amount} ₽ 即可获赠玛格丽特披萨！'
  },
  'promo.giftLabel': {
    ru: 'Подарок по акции',
    en: 'Promo Gift',
    zh: '特惠赠品'
  },
  'promo.closed': {
    ru: 'Мы закрыты, но вы можете сделать заказ завтра )',
    en: 'We are closed, but you can place an order tomorrow )',
    zh: '我们已打烊，但您可以明天再下单 )'
  },
  'promo.workHoursText': {
    ru: 'Часы работы: с {start} до {end}',
    en: 'Working hours: from {start} to {end}',
    zh: '营业时间：{start} 至 {end}'
  },
  
  // Admin Login
  'admin.login': { ru: 'Вход в панель управления', en: 'Admin Panel Login', zh: '后台登录' },
  'admin.password': { ru: 'Пароль', en: 'Password', zh: '密码' },
  'admin.loginBtn': { ru: 'Войти', en: 'Log In', zh: '登录' },
  'admin.wrongPassword': { ru: 'Неверный пароль', en: 'Incorrect password', zh: '密码错误' },
  'admin.backToSite': { ru: 'Вернуться на сайт', en: 'Back to Site', zh: '返回前台' },
  
  // Admin Panel
  'admin.dashboard': { ru: 'Панель управления', en: 'Admin Dashboard', zh: '管理控制台' },
  'admin.tabDishes': { ru: 'Блюда', en: 'Dishes', zh: '菜品管理' },
  'admin.tabCategories': { ru: 'Категории', en: 'Categories', zh: '类别管理' },
  'admin.tabPromotions': { ru: 'Акции', en: 'Promotions', zh: '特惠管理' },
  'admin.addDish': { ru: 'Добавить блюдо', en: 'Add Dish', zh: '添加菜品' },
  'admin.editDish': { ru: 'Редактировать блюдо', en: 'Edit Dish', zh: '编辑菜品' },
  'admin.delete': { ru: 'Удалить', en: 'Delete', zh: '删除' },
  'admin.save': { ru: 'Сохранить', en: 'Save', zh: '保存' },
  'admin.cancel': { ru: 'Отмена', en: 'Cancel', zh: '取消' },
  'admin.hide': { ru: 'Скрыть', en: 'Hide', zh: '隐藏' },
  'admin.show': { ru: 'Показать', en: 'Show', zh: '显示' },
  'admin.uploadPhoto': { ru: 'Загрузить фото', en: 'Upload Photo', zh: '上传图片' },
  'admin.photoUrl': { ru: 'Ссылка на фото', en: 'Photo URL', zh: '图片链接' },
  
  'admin.dishNameRU': { ru: 'Название RU', en: 'Name RU', zh: '俄文名称' },
  'admin.dishNameEN': { ru: 'Название EN', en: 'Name EN', zh: '英文名称' },
  'admin.dishNameZH': { ru: 'Название 中文', en: 'Name 中文', zh: '中文名称' },
  'admin.dishDescRU': { ru: 'Описание RU', en: 'Description RU', zh: '俄文描述' },
  'admin.dishDescEN': { ru: 'Описание EN', en: 'Description EN', zh: '英文描述' },
  'admin.dishDescZH': { ru: 'Описание 中文', en: 'Description 中文', zh: '中文描述' },
  
  'admin.price': { ru: 'Цена (₽)', en: 'Price (RUB)', zh: '价格 (卢布)' },
  'admin.weight': { ru: 'Вес / Объем', en: 'Weight / Volume', zh: '重量 / 容量' },
  'admin.category': { ru: 'Категория', en: 'Category', zh: '类别' },
  'admin.labels': { ru: 'Метки блюда', en: 'Dish Badges', zh: '菜品标签' },
  'admin.addCategory': { ru: 'Создать категорию', en: 'Create Category', zh: '创建新类别' },
  'admin.addPromo': { ru: 'Создать акцию', en: 'Create Promotion', zh: '创建特惠' },
  'admin.active': { ru: 'Активна', en: 'Active', zh: '启用' },
  'admin.inactive': { ru: 'Скрыта', en: 'Hidden', zh: '停用' },
  
  'label.itemsLeft': { ru: 'Осталось: {qty} шт', en: 'Only {qty} left', zh: '仅剩 {qty} 件' },
  'profile.repeatOrder': { ru: 'Повторить заказ', en: 'Repeat Order', zh: '再次购买' },
  'booking.error.dateTime': { ru: 'Выберите дату и время бронирования', en: 'Please select date and time for booking', zh: '请选择预订日期和时间' },
  'booking.error.name': { ru: 'Введите ваше имя', en: 'Please enter your name', zh: '请输入您的姓名' },
  'booking.error.phone': { ru: 'Введите корректный номер телефона', en: 'Please enter a valid phone number', zh: '请输入正确的电话号码' },
  'booking.error.unknown': { ru: 'Не удалось отправить запрос. Попробуйте еще раз.', en: 'Failed to send request. Please try again.', zh: '无法提交请求。请再试一次。' },
  'booking.error.server': { ru: 'Ошибка при создании бронирования', en: 'Error creating booking', zh: '创建预订时发生错误' },

  'booking.at': { ru: 'в', en: 'at', zh: '于' },
  'booking.guestsShort': { ru: 'чел.', en: 'guest(s)', zh: '人' },
  'booking.zoneLabel': { ru: 'Зона:', en: 'Zone:', zh: '区域：' },

  // Booking Modal
  'booking.title': { ru: 'Бронирование стола', en: 'Table Booking', zh: '预订桌位' },
  'booking.btn': { ru: 'Забронировать столик', en: 'Book a Table', zh: '预订桌位' },
  'booking.step': { ru: 'Шаг {step} из 3', en: 'Step {step} of 3', zh: '第 {step} 步（共 3 步）' },
  'booking.params': { ru: 'Параметры визита', en: 'Visit Details', zh: '预订参数' },
  'booking.date': { ru: 'Дата', en: 'Date', zh: '日期' },
  'booking.time': { ru: 'Время', en: 'Time', zh: '时间' },
  'booking.guestsCount': { ru: 'Количество гостей', en: 'Number of Guests', zh: '随行人数' },
  'booking.zone': { ru: 'Зона и пожелания', en: 'Zone & Special Wishes', zh: '位置与偏好' },
  'booking.whereSeat': { ru: 'Где желаете сесть?', en: 'Where would you prefer to sit?', zh: '您的座席偏好？' },
  'booking.zoneInside': { ru: 'Внутри (Зал)', en: 'Inside (Hall)', zh: '室内（大厅）' },
  'booking.zoneVeranda': { ru: 'Веранда', en: 'Veranda', zh: '露台' },
  'booking.wishes': { ru: 'Ваши пожелания', en: 'Your wishes', zh: '特别备注' },
  'booking.wishesPlaceholder': { 
    ru: 'Например: свой алкоголь, стол рядом с телевизором посмотреть футбол, или уединенное место...', 
    en: 'E.g., own alcohol, table near TV for football, or a quiet spot...', 
    zh: '例如：自带酒水、靠近电视看球赛、安静的位置...' 
  },
  'booking.fastWishes': { ru: 'Быстрые пожелания:', en: 'Quick suggestions:', zh: '常用备注：' },
  'booking.contacts': { ru: 'Контакты гостя', en: 'Guest Contacts', zh: '联系人信息' },
  'booking.dateAndTime': { ru: 'Дата и время:', en: 'Date & Time:', zh: '日期和时间：' },
  'booking.guests': { ru: 'Гостей:', en: 'Guests:', zh: '人数：' },
  'booking.wishesLabel': { ru: 'Пожелания:', en: 'Wishes:', zh: '偏好：' },
  'booking.name': { ru: 'Ваше имя', en: 'Your Name', zh: '您的姓名' },
  'booking.phone': { ru: 'Номер телефона', en: 'Phone Number', zh: '电话号码' },
  'booking.successSaved': { ru: 'Запрос сохранен офлайн!', en: 'Request saved offline!', zh: '预订已离线保存！' },
  'booking.successOnline': { ru: 'Столик забронирован!', en: 'Table booked successfully!', zh: '桌位预订成功！' },
  'booking.offlineMsg': { 
    ru: 'Вы находитесь офлайн. Заявка на бронирование надежно сохранена на устройстве и будет автоматически направлена менеджеру ресторана, как только восстановится связь!', 
    en: 'You are offline. The reservation request has been safely saved on your device and will be sent automatically as soon as your connection is restored!', 
    zh: '您当前处于离线状态。预订申请已保存在本地，将在网络恢复后自动提交给餐厅经理！' 
  },
  'booking.onlineMsg': { 
    ru: 'Ваша заявка успешно отправлена администратору. Мы свяжемся с вами по номеру {phone} для подтверждения брони.', 
    en: 'Your request has been successfully sent to the host. We will contact you at {phone} to confirm the reservation.', 
    zh: '预订请求已成功发送。我们将通过电话 {phone} 与您确认。' 
  },
  'booking.namePlaceholder': { ru: 'Иван', en: 'John', zh: '张三' },
  
  // Suggestion chips
  'booking.suggest.tv': { ru: '📺 У телевизора', en: '📺 Near the TV', zh: '📺 靠近电视' },
  'booking.suggest.tvText': { ru: 'хочется сидеть рядом с телевизором для просмотра трансляции', en: 'prefer a table near the TV to watch the broadcast', zh: '希望能坐在电视机旁观看直播' },
  'booking.suggest.quiet': { ru: '🤫 Уединенное место', en: '🤫 Quiet spot', zh: '🤫 安静的位置' },
  'booking.suggest.quietText': { ru: 'хочется уединенное место, где никто не будет мешать', en: 'prefer a quiet, secluded table where no one will disturb us', zh: '希望能有一个安静、不易被打扰的位置' },
  'booking.suggest.alcohol': { ru: '🥂 Свой алкоголь', en: '🥂 Own alcohol', zh: '🥂 自带酒水' },
  'booking.suggest.alcoholText': { ru: 'планируем принести свой алкоголь', en: 'plan to bring our own alcohol', zh: '计划自带酒水' },
  'booking.suggest.window': { ru: '🪟 У окна', en: '🪟 By the window', zh: '🪟 靠窗' },
  'booking.suggest.windowText': { ru: 'желательно столик у окна', en: 'prefer a table by the window', zh: '希望能安排靠窗의桌位' },
  'booking.suggest.birthday': { ru: '🎂 День рождения', en: '🎂 Birthday', zh: '🎂 生日' },
  'booking.suggest.birthdayText': { ru: 'у нас день рождения, отмечаем праздник', en: 'we are celebrating a birthday', zh: '我们过生日庆祝' },

  // General buttons
  'btn.back': { ru: 'Назад', en: 'Back', zh: '返回' },
  'btn.next': { ru: 'Далее', en: 'Next', zh: '下一步' },
  'btn.confirm': { ru: 'Подтвердить', en: 'Confirm', zh: '确认' },
  'btn.sending': { ru: 'Отправка...', en: 'Sending...', zh: '发送中...' },
  'btn.excellent': { ru: 'Отлично', en: 'Excellent', zh: '太棒了' },

  // Statuses
  'status.outOfStock': { ru: 'Нет в наличии', en: 'Out of Stock', zh: '售罄' },
  'status.soldOut': { ru: 'Закончилось', en: 'Sold Out', zh: '已售完' },

  // Dish details
  'detail.prev': { ru: 'Предыдущее блюдо', en: 'Previous Dish', zh: '上一道菜' },
  'detail.next': { ru: 'Следующее блюдо', en: 'Next Dish', zh: '下一道菜' },
  'detail.swipe': { ru: '← Свайп для просмотра →', en: '← Swipe to browse →', zh: '← 左右滑动浏览 →' },
  'detail.description': { ru: 'Описание', en: 'Description', zh: '描述' },
  'detail.nutrition': { ru: 'Пищевая ценность (на порцию)', en: 'Nutritional Value (per serving)', zh: '营养价值（每份）' },
  'detail.calories': { ru: 'Калории:', en: 'Calories:', zh: '热量：' },
  'detail.proteins': { ru: 'Белки:', en: 'Proteins:', zh: '蛋白质：' },
  'detail.fats': { ru: 'Жиры:', en: 'Fats:', zh: '脂肪：' },
  'detail.carbs': { ru: 'Углеводы:', en: 'Carbohydrates:', zh: '碳水化合物：' },
  'detail.caloriesValueShort': { ru: 'ккал', en: 'kcal', zh: '千卡' },
  'detail.gramsValueShort': { ru: 'г', en: 'g', zh: '克' },
  'detail.proteinsShort': { ru: 'Б:', en: 'P:', zh: '蛋:' },
  'detail.fatsShort': { ru: 'Ж:', en: 'F:', zh: '脂:' },
  'detail.carbsShort': { ru: 'У:', en: 'C:', zh: '碳:' },
  'detail.available': { ru: 'Доступно к заказу:', en: 'Available to order:', zh: '可订购数量：' },

  // Call waiter offline keys
  'waiter.calling': { ru: 'Вызов...', en: 'Calling...', zh: '呼叫中...' },
  'waiter.offlineSuccess': { ru: 'Вызов сохранен офлайн!', en: 'Call saved offline!', zh: '呼叫请求已离线保存！' },
  'waiter.offlineMsg': {
    ru: 'Вы находитесь офлайн. Вызов стола сохранен на вашем устройстве и будет передан официанту автоматически, как только восстановится связь!',
    en: 'You are offline. The table call has been saved on your device and will be transmitted to the waiter automatically as soon as connection is restored!',
    zh: '您当前处于离线状态。呼叫请求已保存在本地，网络恢复后将自动发送给服务员！'
  },

  // Room Service & Delivery Checkout
  'checkout.title': { ru: 'Детали заказа', en: 'Order Details', zh: '订单详情' },
  'checkout.subtitle': { ru: 'Оформление цифрового заказа', en: 'Digital Order Placement', zh: '在线确认订单' },
  'checkout.orderType': { ru: 'Тип заказа', en: 'Order Type', zh: '订单类型' },
  'checkout.deliveryRoom': { ru: 'В номер', en: 'To Room', zh: '送客房' },
  'checkout.deliveryAddressTab': { ru: 'Доставка', en: 'Delivery', zh: '外卖配送' },
  'checkout.deliveryTable': { ru: 'За стол', en: 'To Table', zh: '堂食（送至桌位）' },
  'checkout.deliveryTakeaway': { ru: 'С собой', en: 'Takeaway', zh: '打包带走' },
  'checkout.roomLabel': { ru: 'Номер комнаты (Hotel Astrus)', en: 'Room number (Hotel Astrus)', zh: '房间号（阿斯特鲁斯酒店）' },
  'checkout.tableLabel': { ru: 'Номер стола (В ресторане)', en: 'Table number (In restaurant)', zh: '桌号（餐厅内）' },
  'checkout.phoneLabel': { ru: 'Контактный телефон', en: 'Contact Phone', zh: '联系电话' },
  'checkout.addressLabel': { ru: 'Адрес доставки', en: 'Delivery Address', zh: '配送地址' },
  'checkout.addressPlaceholder': { ru: 'Введите улицу и дом...', en: 'Enter street and house number...', zh: '输入街道及门牌号...' },
  'checkout.apartmentLabel': { ru: 'Кв. / Офис', en: 'Apt / Office', zh: '房号 / 办公室' },
  'checkout.entranceLabel': { ru: 'Подъезд', en: 'Entrance', zh: '单元' },
  'checkout.floorLabel': { ru: 'Этаж', en: 'Floor', zh: '楼层' },
  'checkout.intercomLabel': { ru: 'Домофон', en: 'Intercom', zh: '门禁' },
  'checkout.commentLabel': { ru: 'Комментарий для курьера', en: 'Courier Comment', zh: '配送备注' },
  'checkout.commentPlaceholder': { ru: 'Например: код домофона, оставить у двери...', en: 'E.g., door code, leave at door...', zh: '例如：门禁密码，请放门口...' },
  'checkout.inDeliveryZone': { ru: '✓ В зоне доставки (~{dist} км от Porto Bar)', en: '✓ Within delivery zone (~{dist} km from Porto Bar)', zh: '✓ 在配送范围内（距 Porto Bar ~{dist} 公里）' },
  'checkout.outOfDeliveryZone': { ru: 'Извините, мы доставляем в пределах {radius} км.', en: 'Sorry, we only deliver within {radius} km.', zh: '抱歉，我们仅在 {radius} 公里范围内提供配送。' },
  'checkout.deliveryNotAvailable': { ru: 'Извините, по вашему адресу доставка невозможна.', en: 'Sorry, delivery to your address is not available.', zh: '抱歉，您的地址暂不支持配送。' },
  'checkout.yandexEdaAlternative': { ru: 'Либо же вы можете оформить заказ в Яндекс Еда:', en: 'Or you can place your order via Yandex Eda:', zh: '或者您可以通过 Yandex Eda 下单：' },
  'checkout.orderViaYandexEda': { ru: 'Заказать в Яндекс Еда 🛵', en: 'Order via Yandex Eda 🛵', zh: '前往 Yandex Eda 下单 🛵' },
  'checkout.pinLocation': { ru: 'Укажите точку на карте или адрес', en: 'Pin point on map or enter address', zh: '在地图选点或输入地址' },
  'checkout.myLocation': { ru: 'Моё местоположение', en: 'My location', zh: '定位我的位置' },
  'checkout.addressSearching': { ru: 'Определяем адрес...', en: 'Detecting address...', zh: '正在解析地址...' },
  'checkout.summaryCourierDelivery': { ru: 'Доставка курьером:', en: 'Courier delivery:', zh: '配送费用：' },
  'checkout.summaryTitle': { ru: 'Сумма заказа:', en: 'Subtotal:', zh: '菜品小计：' },
  'checkout.summaryDelivery': { ru: 'Доставка в номер:', en: 'Room delivery fee:', zh: '送餐服务费：' },
  'checkout.summaryTotal': { ru: 'Итого к оплате:', en: 'Total amount:', zh: '应付总额：' },
  'checkout.paymentTitle': { ru: 'Способ оплаты при получении', en: 'Payment Method upon Receipt', zh: '支付方式（送达时）' },
  'checkout.paymentTerminal': { ru: 'Картой (Терминал)', en: 'By Card (Terminal)', zh: '刷卡（移动终端）' },
  'checkout.paymentCash': { ru: 'Наличными', en: 'In Cash', zh: '现金支付' },
  'checkout.btnBack': { ru: 'Назад к корзине', en: 'Back to Cart', zh: '返回购物车' },
  'checkout.btnSubmit': { ru: 'Отправить заказ', en: 'Place Order', zh: '提交订单' },
  'checkout.restaurantClosed': { ru: 'Ресторан закрыт. Оформление заказов временно недоступно.', en: 'The restaurant is closed. Ordering is temporarily unavailable.', zh: '餐厅已打烊。暂时无法提交订单。' },
  'checkout.phoneRequired': { ru: 'Укажите номер телефона', en: 'Please specify your phone number', zh: '请填写联系电话' },
  'checkout.addressRequired': { ru: 'Укажите адрес доставки в пределах {radius} км', en: 'Please specify delivery address within {radius} km', zh: '请在 {radius} 公里范围内指定配送地址' },
  'checkout.outOfRangeError': { ru: 'Адрес находится вне зоны доставки (более {radius} км)', en: 'Address is outside delivery zone (> {radius} km)', zh: '该地址超出配送范围（超过 {radius} 公里）' },
  'checkout.roomRequired': { ru: 'Укажите номер комнаты', en: 'Please specify your room number', zh: '请填写房间号' },
  'checkout.tableRequired': { ru: 'Укажите номер стола', en: 'Please specify your table number', zh: '请填写桌号' },
  'checkout.welcomeLoyalty': { ru: 'Рады видеть вас, {name}! Телефон заполнен автоматически.', en: 'Welcome back, {name}! Your phone number was pre-filled.', zh: '欢迎回来，{name}！已自动填入您的手机号。' },

  // Order Success Modal
  'checkout.successOffline': { ru: 'Заказ сохранен офлайн!', en: 'Order saved offline!', zh: '订单已离线保存！' },
  'checkout.successOnline': { ru: 'Заказ успешно оформлен!', en: 'Order placed successfully!', zh: '订单提交成功！' },
  'checkout.successOfflineMsg': {
    ru: 'Вы находитесь офлайн. Ваш заказ надежно сохранен на устройстве и будет отправлен на кухню ПОРТО-БАР автоматически, как только восстановится связь!',
    en: 'You are offline. Your order has been safely saved on your device and will be sent to the PORTO-BAR kitchen automatically as soon as connection is restored!',
    zh: '您当前处于离线状态。订单已保存在本地，将在网络恢复后自动发送至 ПОРТО-БАР 厨房！'
  },
  'checkout.successOnlineMsg': {
    ru: 'Ваш заказ передан на кухню ресторана ПОРТО-БАР. Ожидайте подтверждения, официант свяжется с вами по номеру {phone}.',
    en: 'Your order has been sent to the PORTO-BAR kitchen. Please wait for confirmation; a waiter will contact you at {phone}.',
    zh: '您的订单已送往 ПОРТО-БАР 厨房。请稍候，服务员将拨打 {phone} 与您确认。'
  },
  'checkout.successDetailsTitle': { ru: 'Детали доставки', en: 'Delivery Details', zh: '配送明细' },
  'checkout.successTypeRoom': { ru: 'В номер: {val}', en: 'To room: {val}', zh: '送至客房：{val}' },
  'checkout.successTypeTable': { ru: 'За стол: {val}', en: 'To table: {val}', zh: '送至桌位：{val}' },
  'checkout.successTypeTakeaway': { ru: 'На вынос', en: 'Takeaway', zh: '打包带走' },
  'checkout.successMethodTerminal': { ru: 'Карта (Терминал)', en: 'Card (Terminal)', zh: '刷卡支付' },
  'checkout.successMethodCash': { ru: 'Наличные', en: 'Cash', zh: '现金支付' },
  'checkout.successPaymentMethod': { ru: 'Способ оплаты', en: 'Payment Method', zh: '支付方式' },
  
  // Room order progressive gift
  'cart.promoGiftTitle': { ru: 'Акция: Подарок к заказу', en: 'Promotion: Free Order Gift', zh: '特惠活动：订购赠礼' },
  'cart.promoGiftProgress': { ru: 'Добавьте блюд еще на {amount} ₽, чтобы получить бесплатную Пиццу Маргариту в подарок! 🍕', en: 'Add {amount} ₽ more to get a free Pizza Margherita! 🍕', zh: '再添加 {amount} ₽ 即可获赠玛格丽特披萨！🍕' },
  'cart.promoGiftSuccess': { ru: '🎉 Пицца Маргарита (0 ₽) добавлена в подарок к доставке!', en: '🎉 Free Pizza Margherita (0 ₽) added to your delivery!', zh: '🎉 玛格丽特披萨（0 ₽）已作为赠品添加至您的订单！' },

  // Stories navigation
  'stories.swipeDown': { ru: 'Листайте вниз', en: 'Swipe down', zh: '向下滑动' },
  'stories.mute': { ru: 'Выключить звук', en: 'Mute', zh: '静音' },
  'stories.unmute': { ru: 'Включить звук', en: 'Unmute', zh: '开启声音' },

  // Loyalty Modal
  'loyalty.title': { ru: 'Вход в PORTO Club', en: 'Join PORTO Club', zh: '加入 PORTO 俱乐部' },
  'loyalty.titleCabinet': { ru: 'Личный кабинет', en: 'Personal Account', zh: '个人中心' },
  'loyalty.subtitle': { ru: 'Экосистема лояльности и заказов', en: 'Loyalty & Order Ecosystem', zh: '会员特权与历史订单' },
  'loyalty.subtitleCabinet': { ru: 'Рады видеть вас, {name}', en: 'Welcome back, {name}', zh: '欢迎您，{name}' },
  'loyalty.method.tg': { ru: 'Telegram', en: 'Telegram', zh: '电报' },
  'loyalty.method.email': { ru: 'Email', en: 'Email', zh: '电子邮箱' },
  'loyalty.method.vk': { ru: 'VK ID', en: 'VK ID', zh: 'VK ID' },
  'loyalty.method.phone': { ru: 'Телефон', en: 'Phone', zh: '电话' },
  
  'loyalty.tg.desc': { ru: 'Безопасный и бесплатный вход через нашего Telegram-бота. Бот мгновенно подтвердит авторизацию и привяжет вашу карту.', en: 'Secure and free login via our Telegram bot. The bot will instantly authorize and link your card.', zh: '通过我们的 Telegram 机器人进行安全且免费的登录。机器人将立即进行授权并关联您的卡片。' },
  'loyalty.tg.btn': { ru: 'Войти через Telegram', en: 'Log in with Telegram', zh: '通过 Telegram 登录' },
  'loyalty.tg.loading': { ru: 'Инициализация...', en: 'Initializing...', zh: '初始化中...' },
  'loyalty.tg.sessionText': { ru: 'Наш бот сгенерировал сессию. Пожалуйста, отправьте боту код подтверждения:', en: 'Our bot generated a session. Please send the confirmation code to the bot:', zh: '我们的机器人已生成一个会话。请向机器人发送验证码：' },
  'loyalty.tg.openLink': { ru: 'Открыть Telegram и отправить', en: 'Open Telegram & Send', zh: '打开 Telegram 并发送' },
  'loyalty.tg.waiting': { ru: 'Ожидаем подтверждения в боте...', en: 'Waiting for bot confirmation...', zh: '等待机器人确认...' },
  
  'loyalty.email.desc': { ru: 'Мы отправим 4-значный код подтверждения на ваш Email для безопасного входа.', en: 'We will send a 4-digit confirmation code to your email for secure access.', zh: '我们将向您的邮箱发送一个4位验证码以进行安全登录。' },
  'loyalty.email.label': { ru: 'Email адрес', en: 'Email Address', zh: '电子邮箱地址' },
  'loyalty.email.getBtn': { ru: 'Получить код', en: 'Get Code', zh: '获取验证码' },
  'loyalty.email.sentMsg': { ru: 'Код отправлен на {email}. Проверьте папку «Входящие» и «Спам».', en: 'Code sent to {email}. Please check your Inbox and Spam folders.', zh: '验证码已发送至 {email}。请检查您的收件箱和垃圾邮件文件夹。' },
  'loyalty.email.demo': { ru: '🛡️ Демо-режим (SMTP не настроен): Введите {code}', en: '🛡️ Demo Mode (SMTP inactive): Enter {code}', zh: '🛡️ 演示模式 (SMTP 未配置)：请输入 {code}' },
  'loyalty.email.codeLabel': { ru: 'Введите 4-значный код', en: 'Enter 4-digit Code', zh: '请输入4位验证码' },
  'loyalty.email.verifyBtn': { ru: 'Подтвердить код', en: 'Verify Code', zh: '确认验证码' },
  'loyalty.email.verifying': { ru: 'Проверка...', en: 'Verifying...', zh: '正在验证...' },
  'loyalty.email.change': { ru: 'Изменить email', en: 'Change Email', zh: '更改邮箱' },
  
  'loyalty.vk.desc': { ru: 'Войдите с помощью единой учетной записи VK ID.', en: 'Log in using your VK ID account.', zh: '使用 VK ID 账号登录。' },
  'loyalty.vk.btn': { ru: 'Войти через VK ID', en: 'Log in with VK ID', zh: '通过 VK ID 登录' },
  
  'loyalty.phone.desc': { ru: 'Классический вход по номеру телефона (демо-версия без СМС).', en: 'Classic login by phone number (demo version without SMS).', zh: '传统的电话号码登录（无短信验证的演示版）。' },
  'loyalty.phone.label': { ru: 'Номер телефона', en: 'Phone Number', zh: '电话号码' },
  'loyalty.phone.btn': { ru: 'Войти', en: 'Log In', zh: '登录' },
  'loyalty.phone.loading': { ru: 'Авторизация...', en: 'Authorizing...', zh: '正在登录...' },
  
  'loyalty.reg.title': { ru: 'Вы успешно подтвердили аккаунт! Заполните имя и телефон, чтобы выпустить виртуальную карту и получить приветственные 100 баллов!', en: 'Account verified! Complete your name and phone number to issue a virtual card and get 100 welcome points!', zh: '账号验证成功！请填写姓名和电话号码，即可开通虚拟会员卡并获赠 100 迎新积分！' },
  'loyalty.reg.name': { ru: 'Ваше Имя', en: 'Your Name', zh: '您的姓名' },
  'loyalty.reg.namePlaceholder': { ru: 'Иван Петров', en: 'John Smith', zh: '张三' },
  'loyalty.reg.phone': { ru: 'Номер телефона', en: 'Phone Number', zh: '电话号码' },
  'loyalty.reg.btn': { ru: 'Получить карту клуба', en: 'Get Club Card', zh: '获取会员卡' },
  'loyalty.reg.loading': { ru: 'Создание карты...', en: 'Creating Card...', zh: '会员卡生成中...' },
  'loyalty.reg.cancel': { ru: 'Отмена', en: 'Cancel', zh: '取消' },
  
  'loyalty.tab.card': { ru: 'Карта клуба', en: 'Club Card', zh: '会员卡' },
  'loyalty.tab.orders': { ru: 'Мои Заказы', en: 'My Orders', zh: '历史订单' },
  
  'loyalty.card.pts': { ru: 'PTS', en: 'PTS', zh: '积分' },
  'loyalty.card.balance': { ru: 'Баланс баллов', en: 'Points Balance', zh: '可用积分' },
  'loyalty.card.number': { ru: 'Card Number', en: 'Card Number', zh: '卡号' },
  'loyalty.card.wallet': { ru: 'Добавить в Apple Wallet', en: 'Add to Apple Wallet', zh: '添加到 Apple Wallet' },
  'loyalty.card.qrLabel': { ru: 'Код для официанта', en: 'Code for Waiter', zh: '示以服务员扫码' },
  'loyalty.card.memberText': { ru: '{tier} Участник', en: '{tier} Member', zh: '{tier} 会员' },
  'loyalty.card.qrDesc': { ru: 'Показывайте QR-код официанту при расчете, чтобы копить или списывать баллы.', en: 'Show this QR code to the waiter upon payment to collect or redeem points.', zh: '付款时向服务员出示此二维码，即可累计或抵扣积分。' },
  'loyalty.card.historyTitle': { ru: 'История начислений', en: 'Transaction History', zh: '交易积分记录' },
  'loyalty.card.historyEmpty': { ru: 'История пуста', en: 'History is empty', zh: '暂无积分记录' },
  
  'loyalty.orders.title': { ru: 'Ваши недавние заказы', en: 'Your Recent Orders', zh: '历史订单明细' },
  'loyalty.orders.loading': { ru: 'Загрузка истории заказов...', en: 'Loading order history...', zh: '正在加载订单历史...' },
  'loyalty.orders.empty': { ru: 'Вы пока не совершали заказов', en: 'You have not placed any orders yet', zh: '您目前没有任何订单' },
  'loyalty.orders.emptyDesc': { ru: 'Оформить заказ можно прямо из меню', en: 'You can place orders directly from the menu', zh: '您可以直接在菜单中下单' },
  'loyalty.orders.id': { ru: 'Заказ ID: {val}', en: 'Order ID: {val}', zh: '订单 ID: {val}' },
  'loyalty.orders.method': { ru: 'Способ получения:', en: 'Delivery Method:', zh: '配送方式：' },
  'loyalty.orders.total': { ru: 'Итого:', en: 'Total:', zh: '总计：' },
  'loyalty.orders.logout': { ru: 'Выйти из аккаунта', en: 'Log Out', zh: '退出登录' },
  'loyalty.orders.qrClose': { ru: 'Нажмите в любое место, чтобы закрыть', en: 'Click anywhere to close', zh: '点击任意空白处关闭' },
  'loyalty.orders.qrWaiterHint': { ru: 'Покажите этот код официанту', en: 'Show this code to the waiter', zh: '向服务员出示此代码' },
  
  'loyalty.status.received': { ru: 'Принят', en: 'Accepted', zh: '已接单' },
  'loyalty.status.preparing': { ru: 'Готовится', en: 'Preparing', zh: '配餐中' },
  'loyalty.status.completed': { ru: 'Выполнен', en: 'Completed', zh: '已完成' },
  'loyalty.status.cancelled': { ru: 'Отменен', en: 'Cancelled', zh: '已取消' },
  
  'loyalty.vkSim.title': { ru: 'Авторизация VK ID', en: 'VK ID Authorization', zh: 'VK ID 登录' },
  'loyalty.vkSim.desc': { ru: 'Введите ваши данные для симуляции входа через API VK ID.', en: 'Enter your details to simulate login via VK ID API.', zh: '请输入信息模拟 VK ID 账号登录。' },
  'loyalty.vkSim.name': { ru: 'Имя и Фамилия', en: 'First & Last Name', zh: '姓名' },
  'loyalty.vkSim.profileUrl': { ru: 'Ссылка на профиль (необяз.)', en: 'Profile Link (optional)', zh: '个人主页链接（可选）' },
  'loyalty.vkSim.btn': { ru: 'Подключить профиль VK', en: 'Connect VK Profile', zh: '关联 VK 账户' },
  
  'loyalty.error.noItemsAvailable': { ru: 'К сожалению, все блюда из этого заказа сейчас недоступны или закончились в наличии.', en: 'Unfortunately, all items from this order are currently unavailable or out of stock.', zh: '很抱歉，此订单中的所有菜品当前都处于售罄或不可用状态。' },
  'loyalty.error.repeatFailed': { ru: 'Не удалось повторить заказ. Пожалуйста, попробуйте еще раз.', en: 'Failed to repeat order. Please try again.', zh: '复制订单失败。请重试。' },
  'loyalty.error.botConnection': { ru: 'Не удалось подключиться к боту.', en: 'Failed to connect to the bot.', zh: '无法连接到机器人。' },
  'loyalty.error.sendOtp': { ru: 'Ошибка отправки кода.', en: 'Error sending verification code.', zh: '验证码发送失败。' },
  'loyalty.error.invalidOtp': { ru: 'Неверный код.', en: 'Invalid code.', zh: '验证码错误。' },
  'loyalty.error.vkLogin': { ru: 'Ошибка входа через VK', en: 'VK ID login error', zh: 'VK ID 登录错误' },
  'loyalty.error.auth': { ru: 'Ошибка авторизации.', en: 'Authorization error.', zh: '登录授权失败。' },
  'loyalty.success.cardIssued': { ru: 'Поздравляем! Карта успешно выпущена.', en: 'Congratulations! Your card has been successfully issued.', zh: '恭喜！会员卡已成功开通。' },
  'loyalty.error.registration': { ru: 'Ошибка создания аккаунта.', en: 'Account creation error.', zh: '创建账户时出错。' },
  
  'error.network': { ru: 'Ошибка сети.', en: 'Network error.', zh: '网络错误。' },
  'error.connection': { ru: 'Ошибка соединения.', en: 'Connection error.', zh: '连接错误。' },

  // PWA & Push Prompts
  'pwa.unsupportedPush': { ru: 'Ваш браузер не поддерживает Push-уведомления.', en: 'Your browser does not support push notifications.', zh: '您的浏览器不支持推送通知。' },
  'pwa.pushFailed': { ru: 'Не удалось подписаться на уведомления. Попробуйте еще раз.', en: 'Failed to subscribe to notifications. Please try again.', zh: '订阅通知失败。请重试。' },
  'pwa.title': { ru: 'Приложение Porto Bar', en: 'Porto Bar App', zh: 'Porto Bar 应用' },
  'pwa.iosInstructions': { ru: 'Нажмите кнопку Share и выберите На экран Домой', en: 'Press the Share button and select Add to Home Screen', zh: '点击分享按钮并选择“添加到主屏幕”' },
  'pwa.androidInstructions': { ru: 'Установите на экран для быстрого заказа', en: 'Install on screen for quick ordering', zh: '安装到屏幕以实现快速下单' },
  'pwa.download': { ru: 'Скачать', en: 'Download', zh: '下载' },
  'pwa.pushTitle': { ru: 'Включите уведомления', en: 'Enable Notifications', zh: '开启通知' },
  'pwa.pushSubtitle': { ru: 'Узнавайте о статусе заказов и акциях первым', en: 'Be the first to know order statuses and promotions', zh: '第一时间获取订单状态与优惠信息' },
  'pwa.pushEnable': { ru: 'Включить', en: 'Enable', zh: '开启' },
  'pwa.pushActivating': { ru: 'Запуск...', en: 'Activating...', zh: '启动中...' },

  // Printed menu
  'menu.printed': { ru: 'Печатное меню', en: 'Printed Menu', zh: '纸质菜单' },
  'menu.printedSubtitle': { ru: 'Оригинальное печатное меню Порто-Бар', en: 'Original Printed Menu of Porto Bar', zh: 'Porto-Bar 纸质原件菜单' },
  'menu.printedHint': { ru: 'Вы можете приблизить изображение на телефоне или сохранить его. Приятного аппетита!', en: 'You can zoom in or save the image on your phone. Bon appetit!', zh: '您可以放大或保存图片到手机。祝您用餐愉快！' },
  'menu.recommended': { ru: 'Рекомендуем', en: 'Recommended', zh: '主厨推荐' },
  'menu.fromPrice': { ru: 'от', en: 'from', zh: '起' },

  // Stories & News
  'stories.newsTitle': { ru: 'Новости и события', en: 'News & Highlights', zh: '最新动态与特惠' },
  'stories.defaultCta': { ru: 'Перейти к меню', en: 'View Menu', zh: '查看菜单' },
  'stories.viewCategory': { ru: 'Смотреть раздел', en: 'Explore Category', zh: '查看分类' },
  'stories.viewMenu': { ru: 'Посмотреть меню', en: 'Explore Menu', zh: '浏览菜单' },
  'stories.bookTable': { ru: 'Забронировать стол', en: 'Reserve a Table', zh: '预订桌位' },
  'stories.openCart': { ru: 'Перейти в корзину', en: 'Go to Cart', zh: '前往购物车' }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ru');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('porto_language');
      if (stored === 'ru' || stored === 'en' || stored === 'zh') {
        setLanguageState(stored);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('porto_language', lang);
    }
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation['ru'] || key;
  };

  const translate = (text: MultilingualText | undefined): string => {
    if (!text) return '';
    return text[language] || text['ru'] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
