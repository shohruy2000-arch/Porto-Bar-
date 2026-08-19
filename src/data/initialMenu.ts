import { Dish, Category, Promotion } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: { ru: 'Завтраки', en: 'Breakfasts', zh: '早餐' } },
  { id: 'cat-2', name: { ru: 'Закуски', en: 'Starters', zh: '前菜' } },
  { id: 'cat-3', name: { ru: 'Салаты', en: 'Salads', zh: '沙拉' } },
  { id: 'cat-4', name: { ru: 'Супы', en: 'Soups', zh: '汤' } },
  { id: 'cat-5', name: { ru: 'Паста', en: 'Pasta', zh: '意面' } },
  { id: 'cat-6', name: { ru: 'Пицца', en: 'Pizza', zh: '披萨' } },
  { id: 'cat-7', name: { ru: 'Горячие блюда', en: 'Main dishes', zh: '热菜' } },
  { id: 'cat-8', name: { ru: 'Рыба и морепродукты', en: 'Fish & Seafood', zh: '鱼和海鲜' } },
  { id: 'cat-9', name: { ru: 'Десерты', en: 'Desserts', zh: '甜点' } },
  { id: 'cat-10', name: { ru: 'Кофе', en: 'Coffee', zh: '咖啡' } },
  { id: 'cat-11', name: { ru: 'Чай', en: 'Tea', zh: '茶' } },
  { id: 'cat-12', name: { ru: 'Напитки', en: 'Drinks', zh: '软饮' } },
  { id: 'cat-13', name: { ru: 'Бар', en: 'Bar', zh: '酒吧' } }
];

export const INITIAL_DISHES: Dish[] = [
  // BREAKFASTS
  {
    id: 'dish-1',
    category: 'cat-1',
    name: {
      ru: 'Яйца Бенедикт с лососем',
      en: 'Eggs Benedict with Salmon',
      zh: '烟熏三文鱼班尼迪克蛋'
    },
    description: {
      ru: 'Нежные яйца пашот с малосольным лососем и голландским соусом на хрустящей бриоши.',
      en: 'Poached eggs with lightly salted salmon and hollandaise sauce on a crispy brioche.',
      zh: '香脆布里欧修面包配水波蛋、微咸三文鱼和荷兰酱。'
    },
    price: 680,
    weight: '240 г',
    image: '/images/interior-4.jpg',
    visible: true,
    labels: ['recommended', 'new'],
    prepTime: 15,
    kbju: {
      calories: 540,
      proteins: 26,
      fats: 34,
      carbs: 32
    }
  },
  {
    id: 'dish-2',
    category: 'cat-1',
    name: {
      ru: 'Сырники из фермерского творога',
      en: 'Farm Cottage Cheese Pancakes',
      zh: '农庄自制奶渣饼'
    },
    description: {
      ru: 'Подаются с фермерской сметаной и малиновым конфитюром.',
      en: 'Served with farm sour cream and raspberry coulis.',
      zh: '配以农庄酸奶油和覆盆子果酱。'
    },
    price: 450,
    weight: '180 г',
    image: '',
    visible: true,
    labels: ['bestseller'],
    prepTime: 20,
    kbju: {
      calories: 360,
      proteins: 20,
      fats: 14,
      carbs: 38
    }
  },

  // STARTERS
  {
    id: 'dish-3',
    category: 'cat-2',
    name: {
      ru: 'Брускетта с томатами и базиликом',
      en: 'Tomato & Basil Bruschetta',
      zh: '意式番茄罗勒烤面包'
    },
    description: {
      ru: 'Хрустящий чиабатта с ароматными томатами, чесноком, базиликом и бальзамическим кремом.',
      en: 'Crispy ciabatta with fragrant tomatoes, garlic, basil, and balsamic reduction.',
      zh: '香脆夏巴塔面包配芳香番茄、大蒜、罗勒和巴萨米克醋。'
    },
    price: 390,
    weight: '150 г',
    image: '/images/interior-2.jpg',
    visible: true,
    labels: ['vegetarian'],
    prepTime: 25,
    kbju: {
      calories: 220,
      proteins: 6,
      fats: 9,
      carbs: 29
    }
  },
  {
    id: 'dish-4',
    category: 'cat-2',
    name: {
      ru: 'Плато средиземноморских сыров',
      en: 'Mediterranean Cheese Platter',
      zh: '地中海干酪拼盘'
    },
    description: {
      ru: 'Ассорти из благородных сыров: пармезан, горгонзола, пекорино, подается с медом и орехами.',
      en: 'Assortment of fine cheeses: parmesan, gorgonzola, pecorino, served with honey and nuts.',
      zh: '精选干酪拼盘：帕玛森、戈贡佐拉、佩科里诺，配以蜂蜜和坚果。'
    },
    price: 1100,
    weight: '220 г',
    image: '/images/interior-3.jpg',
    visible: true,
    labels: ['recommended'],
    prepTime: 10,
    kbju: {
      calories: 760,
      proteins: 38,
      fats: 62,
      carbs: 12
    }
  },

  // SALADS
  {
    id: 'dish-5',
    category: 'cat-3',
    name: {
      ru: 'Салат Цезарь с тигровыми креветками',
      en: 'Caesar Salad with Tiger Prawns',
      zh: '鲜虾凯撒沙拉'
    },
    description: {
      ru: 'Хрустящий романо, сочные обжаренные креветки, гренки, сыр пармезан и фирменный соус.',
      en: 'Crisp romaine lettuce, juicy pan-seared prawns, croutons, parmesan cheese, and house Caesar dressing.',
      zh: '清脆罗马生菜、多汁煎虎虾、烤面包丁、帕玛森干酪和招牌凯撒酱。'
    },
    price: 790,
    weight: '250 г',
    image: '',
    visible: true,
    labels: ['bestseller'],
    prepTime: 15,
    kbju: {
      calories: 410,
      proteins: 24,
      fats: 26,
      carbs: 20
    }
  },
  {
    id: 'dish-6',
    category: 'cat-3',
    name: {
      ru: 'Салат с осьминогом и картофелем',
      en: 'Octopus and Potato Salad',
      zh: '八爪鱼土豆沙拉'
    },
    description: {
      ru: 'Обжаренный на гриле осьминог с молодым картофелем, томатами черри, оливками и лимонной заправкой.',
      en: 'Grilled octopus with baby potatoes, cherry tomatoes, olives, and lemon dressing.',
      zh: '烤八爪鱼配小土豆、樱桃番茄、橄榄和柠檬汁。'
    },
    price: 1450,
    weight: '210 г',
    image: '/images/interior-1.jpg',
    visible: true,
    labels: ['recommended', 'new'],
    prepTime: 20,
    kbju: {
      calories: 310,
      proteins: 18,
      fats: 15,
      carbs: 25
    }
  },

  // SOUPS
  {
    id: 'dish-7',
    category: 'cat-4',
    name: {
      ru: 'Суп Том Ям с морепродуктами',
      en: 'Seafood Tom Yum Soup',
      zh: '海鲜冬阴功汤'
    },
    description: {
      ru: 'Пряный тайский суп на кокосовом молоке с креветками, кальмарами, мидиями и грибами.',
      en: 'Spicy Thai soup with coconut milk, prawns, squid, mussels, and mushrooms.',
      zh: '泰式酸辣椰奶汤，配以鲜虾、鱿鱼、贻贝和蘑菇。'
    },
    price: 850,
    weight: '350 г',
    image: '',
    visible: true,
    labels: ['spicy', 'bestseller'],
    prepTime: 25,
    kbju: {
      calories: 280,
      proteins: 20,
      fats: 12,
      carbs: 16
    }
  },
  {
    id: 'dish-8',
    category: 'cat-4',
    name: {
      ru: 'Средиземноморский Буйабес',
      en: 'Mediterranean Bouillabaisse',
      zh: '马赛海鲜鱼汤'
    },
    description: {
      ru: 'Насыщенный рыбный суп с морепродуктами, белой рыбой, томатами и чесночными тостами.',
      en: 'Rich fish soup with seafood, white fish, tomatoes, and garlic toasts.',
      zh: '浓郁鱼汤配海鲜、白鱼、番茄和大蒜吐司。'
    },
    price: 980,
    weight: '400 г',
    image: '',
    visible: true,
    labels: ['recommended'],
    prepTime: 10,
    kbju: {
      calories: 340,
      proteins: 30,
      fats: 14,
      carbs: 18
    }
  },

  // PASTA
  {
    id: 'dish-9',
    category: 'cat-5',
    name: {
      ru: 'Спагетти Карбонара',
      en: 'Spaghetti Carbonara',
      zh: '意式蛋黄培根面'
    },
    description: {
      ru: 'Классическая паста с хрустящим гуанчиале, яичным желтком, сыром пекорино романо и черным перцем.',
      en: 'Classic pasta with crispy guanciale, egg yolk, pecorino romano cheese, and black pepper.',
      zh: '经典意面配香脆培根、蛋黄、罗马佩科里诺干酪 и 黑胡椒。'
    },
    price: 620,
    weight: '300 г',
    image: '',
    visible: true,
    labels: ['bestseller'],
    prepTime: 15,
    kbju: {
      calories: 720,
      proteins: 26,
      fats: 36,
      carbs: 72
    }
  },

  // PIZZA
  {
    id: 'dish-10',
    category: 'cat-6',
    name: {
      ru: 'Пицца Маргарита',
      en: 'Pizza Margherita',
      zh: '玛格丽特披萨'
    },
    description: {
      ru: 'Классическая пицца с соусом из спелых томатов, сыром моцарелла и свежим базиликом.',
      en: 'Classic pizza with ripe tomato sauce, mozzarella cheese, and fresh basil.',
      zh: '经典披萨配熟番茄沙司、马苏里拉奶酪和新鲜罗勒。'
    },
    price: 550,
    weight: '350 г',
    image: '',
    visible: true,
    labels: ['vegetarian'],
    prepTime: 20,
    kbju: {
      calories: 840,
      proteins: 34,
      fats: 30,
      carbs: 108
    }
  },

  // MAIN DISHES
  {
    id: 'dish-11',
    category: 'cat-7',
    name: {
      ru: 'Филе-Миньон с соусом Порто',
      en: 'Filet Mignon with Porto Sauce',
      zh: '菲力牛排配波特酒汁'
    },
    description: {
      ru: 'Нежнейшая говяжья вырезка с запеченными овощами и соусом на основе красного портвейна.',
      en: 'Tender beef tenderloin with roasted vegetables and red port wine reduction sauce.',
      zh: '极嫩牛里脊配烤时蔬和红波特红酒调制沙司。'
    },
    price: 1850,
    weight: '250 г',
    image: '/images/interior-5.jpg',
    visible: true,
    labels: ['recommended'],
    prepTime: 25,
    kbju: {
      calories: 510,
      proteins: 42,
      fats: 32,
      carbs: 14
    }
  },
  {
    id: 'dish-12',
    category: 'cat-7',
    name: {
      ru: 'Утиная грудка с ягодным соусом',
      en: 'Duck Breast with Berry Sauce',
      zh: '鸭胸配浆果沙司'
    },
    description: {
      ru: 'Сочная утиная грудка с карамелизированной грушей и кисло-сладким соусом из лесных ягод.',
      en: 'Juicy duck breast with caramelized pear and sweet & sour wild berry sauce.',
      zh: '多汁鸭胸配焦糖梨和野生浆果酸甜沙司。'
    },
    price: 950,
    weight: '220 г',
    image: '',
    visible: true,
    labels: ['new'],
    prepTime: 10,
    kbju: {
      calories: 460,
      proteins: 32,
      fats: 28,
      carbs: 20
    }
  },

  // FISH & SEAFOOD
  {
    id: 'dish-13',
    category: 'cat-8',
    name: {
      ru: 'Дорадо на гриле с травами',
      en: 'Grilled Seabream with Herbs',
      zh: '烤金头鲷配香草'
    },
    description: {
      ru: 'Целая дорадо, запеченная с розмарином, тимьяном и лимоном, подается с оливковым маслом.',
      en: 'Whole seabream baked with rosemary, thyme, and lemon, served with olive oil.',
      zh: '整条金头鲷加入迷迭香、百里香和柠檬烤制，配以橄榄油。'
    },
    price: 1200,
    weight: '300 г',
    image: '/images/veranda-1.jpg',
    visible: true,
    labels: ['recommended'],
    prepTime: 15,
    kbju: {
      calories: 320,
      proteins: 36,
      fats: 15,
      carbs: 3
    }
  },
  {
    id: 'dish-14',
    category: 'cat-8',
    name: {
      ru: 'Лосось Fusion с имбирным соусом',
      en: 'Ginger Glazed Fusion Salmon',
      zh: '姜汁融合三文鱼'
    },
    description: {
      ru: 'Нежное филе лосося с диким рисом под имбирно-соевой глазурью с кунжутом.',
      en: 'Tender salmon fillet with wild rice under a ginger-soy glaze and sesame seeds.',
      zh: '鲜嫩三文鱼排配野生米饭，淋上生姜酱油汁和芝麻。'
    },
    price: 1350,
    weight: '260 г',
    image: '/images/veranda-2.jpg',
    visible: true,
    labels: ['bestseller'],
    prepTime: 20,
    kbju: {
      calories: 480,
      proteins: 34,
      fats: 24,
      carbs: 30
    }
  },

  // DESSERTS
  {
    id: 'dish-15',
    category: 'cat-9',
    name: {
      ru: 'Тирамису Классико',
      en: 'Classic Tiramisu',
      zh: '经典提拉米苏'
    },
    description: {
      ru: 'Воздушный крем маскарпоне с печеньем савоярди, пропитанным крепким эспрессо и ликером Amaretto.',
      en: 'Light mascarpone cream with savoiardi ladyfingers soaked in strong espresso and Amaretto liqueur.',
      zh: '轻盈马苏里拉奶酪奶油配浸泡在浓咖啡和阿玛雷托酒中的手指饼干。'
    },
    price: 490,
    weight: '150 г',
    image: '',
    visible: true,
    labels: ['bestseller'],
    prepTime: 25,
    kbju: {
      calories: 430,
      proteins: 7,
      fats: 25,
      carbs: 44
    }
  },

  // COFFEE
  {
    id: 'dish-16',
    category: 'cat-10',
    name: { ru: 'Капучино', en: 'Cappuccino', zh: '卡布奇诺' },
    description: { ru: 'Классический кофе с молочной пенкой.', en: 'Classic coffee with milk foam.', zh: '经典咖啡配牛奶泡沫。' },
    price: 280,
    weight: '200 мл',
    image: '',
    visible: true,
    labels: [],
    prepTime: 10,
    kbju: {
      calories: 110,
      proteins: 5,
      fats: 6,
      carbs: 9
    }
  },
  {
    id: 'dish-17',
    category: 'cat-10',
    name: { ru: 'Флэт Уайт', en: 'Flat White', zh: '澳白咖啡' },
    description: { ru: 'Двойной эспрессо с горячим молоком.', en: 'Double espresso with hot milk.', zh: '双份浓缩咖啡配热牛奶。' },
    price: 320,
    weight: '200 мл',
    image: '',
    visible: true,
    labels: [],
    prepTime: 15,
    kbju: {
      calories: 130,
      proteins: 7,
      fats: 7,
      carbs: 11
    }
  },

  // TEA
  {
    id: 'dish-18',
    category: 'cat-11',
    name: { ru: 'Чай Молочный Улун', en: 'Milk Oolong Tea', zh: '奶香乌龙茶' },
    description: { ru: 'Китайский оолон с тонким молочно-сливочным ароматом.', en: 'Chinese oolong with a delicate milky-creamy aroma.', zh: '带有微妙奶香奶油香气的中国乌龙茶。' },
    price: 380,
    weight: '500 мл',
    image: '',
    visible: true,
    labels: [],
    prepTime: 20,
    kbju: {
      calories: 0,
      proteins: 0,
      fats: 0,
      carbs: 0
    }
  },

  // DRINKS
  {
    id: 'dish-19',
    category: 'cat-12',
    name: { ru: 'Лимонад Цитрус-Имбирь', en: 'Citrus Ginger Lemonade', zh: '柑橘生姜柠檬汽水' },
    description: { ru: 'Освежающий домашний лимонад с лимоном, апельсином, грейпфрутом и соком свежего имбиря.', en: 'Refreshing homemade lemonade with lemon, orange, grapefruit, and fresh ginger juice.', zh: '自制清爽柠檬汽水配柠檬、橙子、西柚和新鲜生姜汁。' },
    price: 350,
    weight: '300 мл',
    image: '',
    visible: true,
    labels: ['recommended'],
    prepTime: 25,
    kbju: {
      calories: 95,
      proteins: 0,
      fats: 0,
      carbs: 23
    }
  },

  // BAR
  {
    id: 'dish-20',
    category: 'cat-13',
    name: { ru: 'Апероль Шприц', en: 'Aperol Spritz', zh: '阿佩罗起泡鸡尾酒' },
    description: { ru: 'Игристое вино, аперитив Aperol, газированная вода, ломтик апельсина.', en: 'Sparkling wine, Aperol aperitif, soda water, orange slice.', zh: '起泡酒、阿佩罗开胃酒、苏打水、橙子片。' },
    price: 650,
    weight: '250 мл',
    image: '',
    visible: true,
    labels: ['bestseller'],
    prepTime: 10,
    kbju: {
      calories: 175,
      proteins: 0,
      fats: 0,
      carbs: 24
    }
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    title: {
      ru: '10% Скидка гостям гостиницы Аструс',
      en: '10% Discount for Astrus Hotel Guests',
      zh: '阿斯特鲁斯酒店宾客 9 折优惠'
    },
    description: {
      ru: 'Покажите ключ от номера (карту гостя) вашему официанту при оформлении счета.',
      en: 'Present your room key (guest card) to your waiter when requesting the bill.',
      zh: '结账时向服务员出示您的房卡（宾客卡）即可享受优惠。'
    },
    image: '/images/interior-1.jpg',
    active: true
  },
  {
    id: 'promo-2',
    title: {
      ru: 'Счастливые часы: 1+1 на все десерты!',
      en: 'Happy Hours: 1+1 on All Desserts!',
      zh: '欢乐时光：甜点买一送一！'
    },
    description: {
      ru: 'Каждый будний день с 16:00 до 18:00 при заказе любого фирменного кофе.',
      en: 'Every weekday from 4:00 PM to 6:00 PM when ordering any signature coffee.',
      zh: '工作日下午 4:00 至 6:00，点购任意招牌咖啡即可享受。'
    },
    image: '/images/interior-4.jpg',
    active: true
  }
];
