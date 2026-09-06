'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Star, Plus, Check, Send, Loader2, X, Sparkles,
  ExternalLink, ChevronLeft, ChevronRight, ShoppingBag,
  Bell, Heart, SlidersHorizontal, ArrowRight, Flame,
  Coffee, Utensils, Gift, Percent, Maximize2, Minimize2,
  Smartphone, Monitor, ShoppingCart, Trash2, CheckCircle2
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   TYPES & HELPERS
───────────────────────────────────────────────────────────────*/
interface DemoDish {
  id?: string;
  name: any;
  price: number;
  desc?: string;
  emoji?: string;
  image?: string;
  badge?: string;
  category?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji?: string;
  image?: string;
  options?: string[];
}

const getDishName = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val.ru || val.en || val.zh || Object.values(val)[0] || '';
  return String(val);
};

/* ═══════════════════════════════════════════════════════════
   DISH DETAIL MODAL (Interactive for all concepts)
═══════════════════════════════════════════════════════════ */
function InteractiveDishModal({
  dish,
  accentColor,
  onClose,
  onAdd
}: {
  dish: DemoDish;
  accentColor: string;
  onClose: () => void;
  onAdd: (item: DemoDish, qty: number, opts: string[]) => void;
}) {
  const [qty, setQty] = useState(1);
  const [selectedOpts, setSelectedOpts] = useState<string[]>([]);
  const [added, setAdded] = useState(false);

  const OPTIONS = [
    { name: 'Двойной сыр', price: 90 },
    { name: 'Фирменный соус', price: 70 },
    { name: 'Экстра порция', price: 150 },
  ];

  const toggleOpt = (optName: string) => {
    setSelectedOpts(prev =>
      prev.includes(optName) ? prev.filter(o => o !== optName) : [...prev, optName]
    );
  };

  const totalPrice = (dish.price + selectedOpts.length * 80) * qty;
  const nameStr = getDishName(dish.name);

  const handleConfirm = () => {
    setAdded(true);
    onAdd(dish, qty, selectedOpts);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden border-2 shadow-2xl bg-[#10141e] text-white"
        style={{ borderColor: accentColor + '60', boxShadow: `0 0 50px ${accentColor}30` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white/80 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media */}
        <div className="relative h-48 bg-black/40 flex items-center justify-center overflow-hidden">
          {dish.image ? (
            <img src={dish.image} alt={nameStr} className="w-full h-full object-cover" />
          ) : (
            <div className="text-6xl">{dish.emoji || '🍽'}</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#10141e] via-transparent to-transparent" />
          {dish.badge && (
            <span
              className="absolute top-4 left-4 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase text-white shadow-lg"
              style={{ background: accentColor }}
            >
              {dish.badge}
            </span>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-black">{nameStr}</h3>
            {dish.desc && <p className="text-xs text-slate-300 mt-1 leading-relaxed">{dish.desc}</p>}
            <p className="text-xl font-black mt-2" style={{ color: accentColor }}>
              {dish.price} ₽
            </p>
          </div>

          {/* Modifiers */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Дополнительные опции:
            </p>
            <div className="space-y-1.5">
              {OPTIONS.map(opt => {
                const active = selectedOpts.includes(opt.name);
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => toggleOpt(opt.name)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      active
                        ? 'bg-white/10 border-amber-400/60 text-white'
                        : 'bg-white/4 border-white/8 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          active ? 'bg-amber-500 border-amber-400' : 'border-white/30'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 text-black stroke-[3]" />}
                      </div>
                      <span>{opt.name}</span>
                    </div>
                    <span className="text-slate-400">+{opt.price} ₽</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & CTA */}
          <div className="pt-2 flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-2xl p-1.5">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center font-black text-sm"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-black">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center font-black text-sm"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-black flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98]"
              style={{ background: accentColor }}
            >
              {added ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Добавлено в заказ</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-black" />
                  <span>В заказ • {totalPrice} ₽</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CART & ORDER DRAWER
═══════════════════════════════════════════════════════════ */
function CartModal({
  items,
  accentColor,
  onClose,
  onRemove,
  onClear
}: {
  items: CartItem[];
  accentColor: string;
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const [ordered, setOrdered] = useState(false);
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-3xl p-6 border-2 shadow-2xl bg-[#0f131d] text-white"
        style={{ borderColor: accentColor + '60' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {ordered ? (
          <div className="text-center py-8 space-y-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2"
              style={{ borderColor: accentColor, background: accentColor + '20' }}
            >
              <Check className="w-8 h-8" style={{ color: accentColor }} />
            </div>
            <h3 className="text-xl font-black">Заказ отправлен на кухню!</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              Чек передан на терминал кассы (iiko / r_keeper). Время готовности: ~18–25 минут.
            </p>
            <button
              onClick={() => {
                onClear();
                onClose();
              }}
              className="px-6 py-3 rounded-2xl font-black text-xs uppercase text-black"
              style={{ background: accentColor }}
            >
              Отлично
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pr-8">
              <h3 className="text-lg font-black flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" style={{ color: accentColor }} />
                <span>Корзина заказа</span>
              </h3>
              <span className="text-xs text-slate-400">{items.length} поз.</span>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <p className="text-4xl">🛒</p>
                <p className="text-xs">Корзина пуста. Добавьте блюда из меню!</p>
              </div>
            ) : (
              <>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                  {items.map(it => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/4 border border-white/8"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{it.emoji || '🍽'}</span>
                        <div>
                          <p className="text-xs font-bold line-clamp-1">{it.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {it.quantity} x {it.price} ₽
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-white">
                          {it.price * it.quantity} ₽
                        </span>
                        <button
                          onClick={() => onRemove(it.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Итого:</span>
                    <span className="text-lg font-black" style={{ color: accentColor }}>
                      {total} ₽
                    </span>
                  </div>

                  <button
                    onClick={() => setOrdered(true)}
                    className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-black flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all"
                    style={{ background: accentColor }}
                  >
                    <span>Оформить демо-заказ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. PORTO BAR PHONE
═══════════════════════════════════════════════════════════ */
function PortoBarPhone({
  onSelectDish,
  onAddToCart
}: {
  onSelectDish: (d: DemoDish) => void;
  onAddToCart: (d: DemoDish) => void;
}) {
  const [dishes, setDishes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Устрицы');
  const TABS = ['Устрицы', 'Пицца', 'Паста', 'Напитки'];
  const FALLBACK = [
    { id: 'pb-1', name: 'Устрица Фин де Клер', price: 680, emoji: '🦪', desc: 'Свежая устрица №2 с лимоном и луковым шалот-соусом' },
    { id: 'pb-2', name: 'Тартар из тунца', price: 890, emoji: '🐟', desc: 'Спелое авокадо, манго-понзу, хрустящий чипс' },
    { id: 'pb-3', name: 'Фуа-гра с бриошью', price: 1890, emoji: '🍞', desc: 'Карамелизированный инжир, трюфельный демигляс' },
    { id: 'pb-4', name: 'Паста Карбонара', price: 1190, emoji: '🍝', desc: 'Гуанчиале, желтки фермерских яиц, пекорино романо' },
    { id: 'pb-5', name: 'Шампанское Моэт', price: 1600, emoji: '🥂', desc: 'Игристое брют, классический французский пейринг' },
    { id: 'pb-6', name: 'Тартар из говядины', price: 990, emoji: '🥩', desc: 'Мраморная вырезка Prime, каперсы, крутоны' },
  ];

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.dishes || data.items || [];
        if (list.length > 0) setDishes(list.slice(0, 8));
      })
      .catch(() => {});
  }, []);

  const display = dishes.length > 0 ? dishes : FALLBACK;

  return (
    <div className="w-full h-full bg-[#0d0f14] text-white overflow-y-auto scrollbar-none flex flex-col">
      <div className="sticky top-0 z-10 bg-[#0d0f14]/95 backdrop-blur px-4 pt-8 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
              <span className="text-[10px] font-black text-black">PB</span>
            </div>
            <div>
              <p className="text-[11px] font-black">Porto Bar</p>
              <p className="text-[9px] text-slate-400">Room 214 · Отель</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300">4.9</span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <div className="w-full bg-white/5 border border-white/8 text-slate-500 text-[10px] pl-9 pr-4 py-2.5 rounded-2xl">
            Поиск устриц, тартаров, вин...
          </div>
        </div>
      </div>

      <div
        className="relative mx-3 mt-3 rounded-2xl overflow-hidden h-24 flex items-end p-3"
        style={{ background: 'linear-gradient(135deg,#1a1200,#2d1f00)' }}
      >
        <img
          src="https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&q=70"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10">
          <p className="text-[8px] font-bold text-amber-400 uppercase tracking-wider">🦪 Шеф рекомендует</p>
          <p className="text-[13px] font-black text-white leading-tight">Морские деликатесы<br />и премиальный сервис</p>
        </div>
      </div>

      <div className="px-3 mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap border transition-all ${
              activeTab === t
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-white/5 text-slate-300 border-white/8'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="px-3 mt-3 text-[11px] font-black uppercase tracking-wider">🏆 Шедевры кухни</p>

      <div className="px-3 mt-2 grid grid-cols-2 gap-2 pb-6">
        {display.map((d: any, i) => (
          <div
            key={d.id || i}
            onClick={() => onSelectDish(d)}
            className="bg-[#161920] rounded-2xl overflow-hidden border border-white/6 hover:border-amber-400/40 transition-all cursor-pointer group"
          >
            <div className="h-[72px] bg-white/5 flex items-center justify-center text-2xl relative overflow-hidden">
              {d.image ? (
                <img
                  src={d.image}
                  alt={getDishName(d.name)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <span>{d.emoji || '🍽'}</span>
              )}
            </div>
            <div className="p-2">
              <p className="text-[10px] font-bold line-clamp-1 group-hover:text-amber-300 transition-colors">
                {getDishName(d.name)}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] font-black text-amber-400">{d.price} ₽</span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onAddToCart(d);
                  }}
                  className="w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center shadow-md active:scale-90 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. BRUNCH BISTRO PHONE
═══════════════════════════════════════════════════════════ */
function BrunchBistroPhone({
  onSelectDish,
  onAddToCart
}: {
  onSelectDish: (d: DemoDish) => void;
  onAddToCart: (d: DemoDish) => void;
}) {
  const [activeTab, setActiveTab] = useState('Панкейки');
  const TABS = ['Панкейки', 'Завтраки', 'Кофе', 'Боулы'];
  const MENU: Record<string, any[]> = {
    Панкейки: [
      { id: 'bb-1', name: 'Суфле-Панкейки', price: 780, desc: '3 японских пухлых панкейка с кленовым сиропом и взбитыми сливками', emoji: '🥞', badge: 'ХИТ' },
      { id: 'bb-2', name: 'Панкейки Матча', price: 820, desc: 'Зеленый чай матча, белый шоколад и малина', emoji: '🍵', badge: 'NEW' },
      { id: 'bb-3', name: 'Блины Рикотта', price: 690, desc: 'С лесными ягодами и цветочным медом', emoji: '🫐' },
      { id: 'bb-4', name: 'Американские', price: 560, desc: 'С кленовым сиропом и карамелизированным бананом', emoji: '🧇' },
    ],
    Завтраки: [
      { id: 'bb-5', name: 'Яйца Бенедикт', price: 690, desc: 'Слабосоленый лосось, бриошь, голландский соус', emoji: '🍳' },
      { id: 'bb-6', name: 'Авокадо Тост', price: 520, desc: 'Тартин на закваске, крем из рикотты, вяленые томаты', emoji: '🥑' },
      { id: 'bb-7', name: 'Боул Асаи', price: 650, desc: 'Органический асаи, кокосовые чипсы, свежая черника', emoji: '🫐' },
      { id: 'bb-8', name: 'Гранола с йогуртом', price: 420, desc: 'Запеченные овсяные хлопья, греческий йогурт, семена чиа', emoji: '🥣' },
    ],
    Кофе: [
      { id: 'bb-9', name: 'Флэт Уайт', price: 290, desc: 'Двойной шот specialty эспрессо и шелковистая микропенка', emoji: '☕', badge: 'ТОП' },
      { id: 'bb-10', name: 'Матча Латте', price: 350, desc: 'Церемониальный матча из Киото на овсяном молоке', emoji: '🍵' },
      { id: 'bb-11', name: 'Колд Брю', price: 380, desc: 'Холодное капельное заваривание 18 часов', emoji: '🧊' },
      { id: 'bb-12', name: 'Капучино', price: 280, desc: 'Эфиопия Иргачефф натуральной обработки', emoji: '☕' },
    ],
    Боулы: [
      { id: 'bb-13', name: 'Боул Будды', price: 720, desc: 'Киноа, хрустящий нут, авокадо, соус тахини', emoji: '🥗' },
      { id: 'bb-14', name: 'Poke Salmon', price: 890, desc: 'Свежий лосось, бобы эдамаме, чука, рис японика', emoji: '🍣' },
      { id: 'bb-15', name: 'Боул Манго', price: 650, desc: 'Манговое пюре, спирулина, семена тыквы', emoji: '🥭' },
      { id: 'bb-16', name: 'Греческий боул', price: 680, desc: 'Сыр фета, маслины каламата, огурцы, оливковое масло', emoji: '🫒' },
    ],
  };
  const items = MENU[activeTab] || MENU['Панкейки'];

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-none" style={{ background: '#FFF8F0', color: '#2D1810' }}>
      <div className="sticky top-0 z-10 px-4 pt-8 pb-3 border-b" style={{ background: '#FFF8F0', borderColor: '#F0E0D0' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#C05830' }}>
              <span className="text-[10px] font-black text-white">BB</span>
            </div>
            <div>
              <p className="text-[11px] font-black" style={{ color: '#2D1810' }}>Brunch's Bistro</p>
              <p className="text-[9px]" style={{ color: '#9B7B6A' }}>Eco Loyalty Club 🌿</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: '#C0583018', border: '1px solid #C0583040' }}>
            <Star className="w-3 h-3 fill-orange-600 text-orange-600" />
            <span className="text-[10px] font-bold" style={{ color: '#C05830' }}>4.8</span>
          </div>
        </div>
        <div className="w-full text-[10px] pl-9 pr-4 py-2.5 rounded-2xl relative" style={{ background: '#F5E8DC', border: '1px solid #E8D0BC', color: '#9B7B6A' }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#9B7B6A' }} />
          Поиск панкейков, кофе...
        </div>
      </div>

      <div className="relative mx-3 mt-3 rounded-2xl overflow-hidden h-24 flex items-end p-3" style={{ background: 'linear-gradient(135deg,#C05830,#A04020)' }}>
        <img src="https://images.unsplash.com/photo-1565299543923-37dd37887442?w=400&q=70" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10">
          <p className="text-[8px] font-bold text-orange-200 uppercase tracking-wider">🥞 Signature</p>
          <p className="text-[13px] font-black text-white leading-tight">Суфле-панкейки от шеф-повара</p>
        </div>
        <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full text-[8px] font-black text-white" style={{ background: '#2D1810' }}>🌿 ECO</div>
      </div>

      <div className="px-3 mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap border transition-all"
            style={activeTab === t ? { background: '#C05830', color: 'white', borderColor: '#A04020' } : { background: '#F5E8DC', color: '#9B7B6A', borderColor: '#E8D0BC' }}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="px-3 mt-3 text-[11px] font-black uppercase tracking-wider" style={{ color: '#2D1810' }}>✨ {activeTab}</p>

      <div className="px-3 mt-2 grid grid-cols-2 gap-2 pb-6">
        {items.map((d, i) => (
          <div
            key={d.id || i}
            onClick={() => onSelectDish(d)}
            className="rounded-2xl overflow-hidden border cursor-pointer hover:shadow-md transition-all group"
            style={{ background: 'white', borderColor: '#F0E0D0' }}
          >
            <div className="h-[72px] flex items-center justify-center text-2xl relative group-hover:scale-105 transition-transform" style={{ background: '#FDF0E6' }}>
              {d.emoji}
              {d.badge && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[8px] font-black text-white" style={{ background: '#C05830' }}>
                  {d.badge}
                </span>
              )}
            </div>
            <div className="p-2">
              <p className="text-[10px] font-bold line-clamp-1" style={{ color: '#2D1810' }}>{d.name}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] font-black" style={{ color: '#C05830' }}>{d.price} ₽</span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onAddToCart(d);
                  }}
                  className="w-6 h-6 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-sm"
                  style={{ background: '#C05830' }}
                >
                  <Plus className="w-3.5 h-3.5 text-white stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. BURGER DARK PHONE
═══════════════════════════════════════════════════════════ */
function BurgerDarkPhone({
  onSelectDish,
  onAddToCart
}: {
  onSelectDish: (d: DemoDish) => void;
  onAddToCart: (d: DemoDish) => void;
}) {
  const [activeTab, setActiveTab] = useState('Бургер');
  const CATS = [
    { label: 'Бургер', emoji: '🍔' },
    { label: 'Пицца', emoji: '🍕' },
    { label: 'Курица', emoji: '🍗' },
    { label: 'Картофель', emoji: '🍟' },
    { label: 'Напитки', emoji: '🥤' },
  ];
  const ITEMS = [
    { id: 'bg-1', name: 'Cheese Burger', price: 329, emoji: '🍔', desc: 'Котлета из сочной говядины, двойной чеддер, маринованные огурчики', badge: '' },
    { id: 'bg-2', name: 'Spicy Chicken', price: 389, emoji: '🍗', desc: 'Хрустящее острое филе, айсберг, авторский халапеньо соус', badge: 'SPICY' },
    { id: 'bg-3', name: 'Double Beef', price: 449, emoji: '🍔', desc: 'Две котлеты Black Angus, бекон, карамелизированный лук', badge: 'NEW' },
    { id: 'bg-4', name: 'BBQ Burger', price: 419, emoji: '🍔', desc: 'Дымный соус барбекю, луковые кольца фри, сыр гауда', badge: '' },
    { id: 'bg-5', name: 'Crispy Fries', price: 149, emoji: '🍟', desc: 'Золотистый хрустящий картофель с морской солью и паприкой', badge: '' },
    { id: 'bg-6', name: 'Cola 0.5L', price: 119, emoji: '🥤', desc: 'Ледяной газированный напиток', badge: '' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-none" style={{ background: '#141008' }}>
      <div className="px-4 pt-8 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[10px]">☰</div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-[11px] font-black text-white">A</div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">Hi, Alex 👋</p>
        <p className="text-[18px] font-black text-white leading-tight">Good Food</p>
        <p className="text-[18px] font-black leading-tight" style={{ color: '#E85C00' }}>Good Mood!</p>
      </div>

      <div className="px-4 mb-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-slate-500" />
          <div className="w-full bg-white/6 border border-white/8 text-[10px] text-slate-500 pl-9 pr-10 py-2.5 rounded-2xl">Search your favorite food</div>
          <div className="absolute right-3 w-5 h-5 rounded-md bg-white/10 flex items-center justify-center">
            <SlidersHorizontal className="w-3 h-3 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="px-4 flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {CATS.map(c => (
          <button
            key={c.label}
            onClick={() => setActiveTab(c.label)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl shrink-0 border transition-all text-[9px] font-bold"
            style={activeTab === c.label ? { background: '#E85C00', color: 'white', borderColor: '#E85C00' } : { background: '#1E1710', color: '#9B8B7A', borderColor: '#2A2018' }}
          >
            <span className="text-base leading-none">{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      <div className="mx-4 mt-3 rounded-2xl p-4 relative overflow-hidden flex items-center justify-between" style={{ background: 'linear-gradient(135deg,#1E1008,#2E1A08)' }}>
        <div className="z-10">
          <p className="text-[9px] text-orange-400 font-bold">🔥 Limited Time Offer</p>
          <p className="text-[13px] font-black text-white leading-tight">Spicy Burger</p>
          <p className="text-[13px] font-black leading-tight" style={{ color: '#E85C00' }}>Combo</p>
          <button className="mt-2 px-3 py-1.5 rounded-xl text-[10px] font-black text-white" style={{ background: '#E85C00' }}>Order Now</button>
        </div>
        <div className="text-right z-10">
          <p className="text-[22px] font-black text-white leading-none">20%</p>
          <p className="text-[12px] font-bold text-slate-300">OFF</p>
          <p className="text-2xl mt-1">🍟🥤</p>
        </div>
      </div>

      <div className="px-4 mt-3 flex items-center justify-between">
        <p className="text-[12px] font-black text-white">Popular Now</p>
        <span className="text-[10px] font-bold" style={{ color: '#E85C00' }}>View All</span>
      </div>

      <div className="px-4 mt-2 grid grid-cols-3 gap-2 pb-6">
        {ITEMS.map((item, i) => (
          <div
            key={item.id || i}
            onClick={() => onSelectDish(item)}
            className="rounded-2xl overflow-hidden border cursor-pointer hover:border-orange-500/50 transition-all"
            style={{ background: '#1E1710', borderColor: '#2A2018' }}
          >
            <div className="h-[60px] flex items-center justify-center text-xl relative" style={{ background: 'linear-gradient(135deg,#2E2010,#1E1008)' }}>
              {item.emoji}
              {item.badge && (
                <span className="absolute top-1 left-1 px-1 py-0.5 rounded text-[7px] font-black text-white" style={{ background: '#E85C00' }}>{item.badge}</span>
              )}
            </div>
            <div className="p-1.5">
              <p className="text-[9px] font-bold text-white line-clamp-1">{item.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-black text-white">{item.price} ₽</span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onAddToCart(item);
                  }}
                  className="w-5 h-5 rounded-full flex items-center justify-center active:scale-90 transition-all"
                  style={{ background: '#E85C00' }}
                >
                  <Plus className="w-3 h-3 text-white stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. CHAIN FAST FOOD PHONE
═══════════════════════════════════════════════════════════ */
function ChainFoodPhone({
  onSelectDish,
  onAddToCart
}: {
  onSelectDish: (d: DemoDish) => void;
  onAddToCart: (d: DemoDish) => void;
}) {
  const [activeTab, setActiveTab] = useState('Все');
  const CATS = [
    { label: 'Все', emoji: '🍗' },
    { label: 'Бургеры', emoji: '🍔' },
    { label: 'Сеты', emoji: '🪣' },
    { label: 'Снеки', emoji: '🍟' },
    { label: 'Напитки', emoji: '🥤' },
    { label: 'Десерты', emoji: '🍦' },
  ];
  const COMBOS = [
    { id: 'cf-1', name: '8 Pcs Chicken Bucket', desc: '8 сочных кусочков курицы в панировке + 2 картофеля фри + 2 соуса', price: 1290, rating: '4.8', emoji: '🪣', badge: 'BESTSELLER', badgeColor: '#E4002B' },
    { id: 'cf-2', name: 'Zinger Burger Combo', desc: 'Бургер с хрустящим куриным филе + картофель фри + напиток 0.5L', price: 590, rating: '4.7', emoji: '🍔', badge: 'POPULAR', badgeColor: '#FF6B00' },
    { id: 'cf-3', name: '5 Pcs Hot & Crispy', desc: '5 острых крылышек в фирменной панировке + чесночный дип', price: 849, rating: '4.6', emoji: '🍗', badge: 'SAVE 15%', badgeColor: '#16A34A' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-none" style={{ background: '#FDF7F0' }}>
      <div className="sticky top-0 z-10 px-4 pt-8 pb-3 border-b bg-white/90 backdrop-blur" style={{ borderColor: '#F0E0D0' }}>
        <div className="flex items-center justify-between mb-1">
          <div className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center text-[10px]">☰</div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-black text-white" style={{ background: '#E4002B' }}>3</span>
            </div>
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-black text-white" style={{ background: '#E4002B' }}>2</span>
            </div>
          </div>
        </div>
        <p className="text-[9px] text-gray-400">Hello, Chicken Lover! 👋</p>
        <p className="text-[16px] font-black leading-none" style={{ color: '#E4002B' }}>CrispyChain</p>
        <p className="text-[9px] text-gray-400">It's finger lickin' good.</p>
      </div>

      <div className="px-4 mt-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-gray-400" />
          <div className="w-full bg-white border border-gray-200 text-[10px] text-gray-400 pl-9 pr-10 py-2.5 rounded-2xl shadow-sm">Search for your favorite chicken...</div>
          <SlidersHorizontal className="absolute right-3 w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>

      <div className="mx-4 mt-3 rounded-2xl overflow-hidden h-28 relative flex items-end p-3" style={{ background: 'linear-gradient(135deg,#8B0000,#E4002B)' }}>
        <div className="relative z-10">
          <p className="text-[8px] text-red-200 font-bold uppercase tracking-wider">LIMITED TIME</p>
          <p className="text-[15px] font-black text-white leading-tight">CRISPY.<br />JUICY.<br />IRRESISTIBLE.</p>
        </div>
        <button className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-[10px] font-black" style={{ color: '#E4002B' }}>
          Order Now <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="px-4 mt-3 flex gap-3 overflow-x-auto scrollbar-none pb-1">
        {CATS.map(c => (
          <button key={c.label} onClick={() => setActiveTab(c.label)} className="flex flex-col items-center gap-1 shrink-0">
            <div
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-base shadow-sm"
              style={activeTab === c.label ? { borderColor: '#E4002B', background: '#E4002B18' } : { borderColor: '#E8D8C8', background: 'white' }}
            >
              {c.emoji}
            </div>
            <span className="text-[8px] font-bold" style={{ color: activeTab === c.label ? '#E4002B' : '#888' }}>{c.label}</span>
          </button>
        ))}
      </div>

      <div className="px-4 mt-3 flex items-center justify-between">
        <p className="text-[12px] font-black text-gray-900">Popular Combos</p>
        <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#E4002B' }}>View All <ArrowRight className="w-3 h-3" /></span>
      </div>

      <div className="px-4 mt-2 grid grid-cols-3 gap-2 pb-6">
        {COMBOS.map((c, i) => (
          <div
            key={c.id || i}
            onClick={() => onSelectDish(c)}
            className="rounded-2xl overflow-hidden border bg-white shadow-sm cursor-pointer hover:shadow-md transition-all"
            style={{ borderColor: '#F0E0D0' }}
          >
            <div className="h-[64px] relative flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg,#FDF0E0,#F8E0C8)' }}>
              {c.emoji}
              <span className="absolute top-1 left-1 px-1 py-0.5 rounded text-[7px] font-black text-white leading-none" style={{ background: c.badgeColor }}>
                {c.badge}
              </span>
            </div>
            <div className="p-1.5">
              <p className="text-[9px] font-bold text-gray-900 line-clamp-2 leading-tight">{c.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] font-black text-gray-900">{c.price} ₽</span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onAddToCart(c);
                  }}
                  className="w-5 h-5 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-sm"
                  style={{ background: '#E4002B' }}
                >
                  <Plus className="w-3 h-3 text-white stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. COFFEE SHOP PHONE
═══════════════════════════════════════════════════════════ */
function CoffeeShopPhone({
  onSelectDish,
  onAddToCart
}: {
  onSelectDish: (d: DemoDish) => void;
  onAddToCart: (d: DemoDish) => void;
}) {
  const DESSERTS = [
    { id: 'cs-1', name: 'Фисташковый торт', subtitle: 'Pistachio Bliss', price: 420, desc: 'Шелковистый фисташковый мусс, бисквит с матча, дробленые орехи', emoji: '🍰', bg: '#E8F0E0' },
    { id: 'cs-2', name: 'Шоколадный трюфель', subtitle: 'Chocolate Dream', price: 460, desc: 'Бельгийский горький шоколад 70%, пралине из фундука', emoji: '🍫', bg: '#F0E4D0' },
    { id: 'cs-3', name: 'Ягодный чизкейк', subtitle: 'Berry Delight', price: 440, desc: 'Сливочный чизкейк Нью-Йорк с ягодным конфитюром из черники', emoji: '🫐', bg: '#F0E0EC' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-none" style={{ background: '#F5F0E8' }}>
      <div className="sticky top-0 z-10 px-4 pt-8 pb-3 flex items-center justify-between" style={{ background: '#F5F0E8' }}>
        <div className="flex items-center gap-1">
          <Coffee className="w-4 h-4" style={{ color: '#2D5A3D' }} />
          <span className="text-[14px] font-black" style={{ color: '#1A3A2A' }}>Coffee<span style={{ color: '#C8A14B' }}>✦</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-500" />
          <ShoppingBag className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      <div className="px-4 pt-2 grid grid-cols-2 gap-3 items-center">
        <div>
          <p className="text-[9px] font-bold italic" style={{ color: '#C8A14B' }}>Life Happens, Coffee Helps</p>
          <p className="text-[17px] font-black leading-tight mt-1 font-serif" style={{ color: '#1A2A1A' }}>
            Sweet Moments Start <span style={{ color: '#C8A14B' }}>Here.</span>
          </p>
          <button className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black text-white" style={{ background: '#2D5A3D' }}>
            EXPLORE MORE <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="relative h-28 rounded-2xl overflow-hidden bg-amber-950/20">
          <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=70" alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="px-4 mt-4">
        <p className="text-[10px] font-black uppercase tracking-wider mb-3" style={{ color: '#1A3A2A' }}>Our Signature ✦</p>
        <div className="space-y-2.5 pb-6">
          {DESSERTS.map(d => (
            <div
              key={d.id}
              onClick={() => onSelectDish(d)}
              className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:shadow-md transition-all group"
              style={{ background: d.bg }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl bg-white/60 group-hover:scale-105 transition-transform">{d.emoji}</div>
              <div className="flex-1">
                <p className="text-[11px] font-black" style={{ color: '#1A3A2A' }}>{d.name}</p>
                <p className="text-[9px] italic" style={{ color: '#C8A14B' }}>{d.subtitle}</p>
                <p className="text-[11px] font-black mt-0.5" style={{ color: '#2D5A3D' }}>{d.price} ₽</p>
              </div>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onAddToCart(d);
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white active:scale-90 transition-all"
                style={{ background: '#C8A14B' }}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   6. CAFÉ WARM PHONE
═══════════════════════════════════════════════════════════ */
function CafeWarmPhone({
  onSelectDish,
  onAddToCart
}: {
  onSelectDish: (d: DemoDish) => void;
  onAddToCart: (d: DemoDish) => void;
}) {
  const MENU_ITEMS = [
    { id: 'cw-1', name: 'Cappuccino', price: 290, emoji: '☕', desc: 'Плотная сливочная пенка, арабика средней обжарки' },
    { id: 'cw-2', name: 'Chocolate Cake', price: 380, emoji: '🍰', desc: 'Влажный бисквит с шоколадным кремом и ягодами' },
    { id: 'cw-3', name: 'Chicken Sandwich', price: 490, emoji: '🥪', desc: 'Хрустящая чиабатта, куриная грудка су-вид, соус песто' },
    { id: 'cw-4', name: 'Iced Latte', price: 320, emoji: '🧊', desc: 'Освежающий эспрессо с молоком и колотым льдом' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-none" style={{ background: '#F8F2E8' }}>
      <div className="sticky top-0 z-10 px-4 pt-8 pb-2 flex items-center justify-between border-b" style={{ background: '#F8F2E8', borderColor: '#E8D8C0' }}>
        <div>
          <p className="text-[8px] text-gray-400 uppercase tracking-widest">CAFÉ</p>
          <p className="text-[10px] text-gray-400" style={{ color: '#8B6B4A' }}>COFFEE & MORE</p>
        </div>
        <button className="px-3 py-1.5 rounded-lg text-[9px] font-black text-white" style={{ background: '#5C3D2E' }}>ORDER ONLINE</button>
      </div>

      <div className="mx-3 mt-3 rounded-2xl overflow-hidden relative h-32">
        <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=70" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2" style={{ background: 'rgba(92,61,46,0.6)' }}>
          <p className="text-[8px] text-amber-200 italic">Welcome to Our Café</p>
          <p className="text-[14px] font-black text-white leading-tight font-serif">Good Coffee,<br />Great Moments</p>
        </div>
      </div>

      <div className="px-4 mt-3 text-center">
        <p className="text-[8px] text-amber-700">☕</p>
        <p className="text-[13px] font-black font-serif" style={{ color: '#3A2010' }}>Menu Highlights</p>
      </div>

      <div className="px-4 mt-2 grid grid-cols-2 gap-2.5 pb-6">
        {MENU_ITEMS.map((item, i) => (
          <div
            key={item.id || i}
            onClick={() => onSelectDish(item)}
            className="rounded-2xl overflow-hidden border bg-white cursor-pointer hover:shadow-md transition-all group"
            style={{ borderColor: '#E8D8C0' }}
          >
            <div className="h-16 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform" style={{ background: '#F5EAD8' }}>
              {item.emoji}
            </div>
            <div className="p-2 text-center">
              <p className="text-[10px] font-bold" style={{ color: '#3A2010' }}>{item.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] font-black" style={{ color: '#5C3D2E' }}>{item.price} ₽</span>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onAddToCart(item);
                  }}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-sm"
                  style={{ background: '#5C3D2E' }}
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   IPHONE FRAME WRAPPER
═══════════════════════════════════════════════════════════ */
function IPhoneFrame({
  children,
  accentGlow,
  isLarge = false
}: {
  children: React.ReactNode;
  accentGlow: string;
  isLarge?: boolean;
}) {
  const width = isLarge ? 320 : 270;
  const height = isLarge ? 640 : 560;

  return (
    <div
      className="relative mx-auto flex-shrink-0 transition-all duration-300"
      style={{
        width,
        height,
        borderRadius: 48,
        background: 'linear-gradient(145deg,#1c2030,#0d1018)',
        border: '3px solid #242b3d',
        boxShadow: `0 50px 100px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 60px ${accentGlow}`,
      }}
    >
      <div className="absolute -left-[3px] top-16 w-[3px] h-6 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -left-[3px] top-24 w-[3px] h-12 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -left-[3px] top-[152px] w-[3px] h-12 rounded-l-full bg-[#1a1f2e]" />
      <div className="absolute -right-[3px] top-20 w-[3px] h-16 rounded-r-full bg-[#1a1f2e]" />
      <div className="absolute inset-0 rounded-[44px] pointer-events-none" style={{ background: 'linear-gradient(145deg,rgba(255,255,255,0.06) 0%,transparent 40%)' }} />
      
      <div className="absolute inset-[3px] rounded-[44px] overflow-hidden bg-black">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-24 h-4.5 rounded-full bg-black flex items-center justify-between px-3 pointer-events-none shadow-md">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#181d29]" />
        </div>
        <div className="w-full h-full overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESTAURANTS CONFIG
═══════════════════════════════════════════════════════════ */
const RESTAURANTS = [
  {
    id: 'porto', name: 'Porto Bar', subtitle: 'Luxury Fine Dining', emblem: '🦪',
    accentColor: '#F59E0B', accentGlow: 'rgba(245,158,11,0.25)',
    designer: 'Marco Rossi 🇮🇹', location: 'Милан, Италия',
    rating: '4.99', cuisine: 'Устрицы · Шампанское · Room Service',
    tagline: 'Тёмная роскошь в стиле Michelin. Реальные блюда загружаются с вашего сервера. Золотые акценты, анимированные карточки.',
    avgCheck: '2 850 ₽', repeatRate: '+42%', delivery: '25–35 мин',
    features: ['Загрузка блюд из вашей базы данных', 'Система лояльности с баллами', 'Живой трекер заказа', 'Бесконтактная оплата СБП'],
  },
  {
    id: 'brunch', name: "Brunch's Bistro", subtitle: 'Nordic Botanical', emblem: '🥞',
    accentColor: '#C05830', accentGlow: 'rgba(192,88,48,0.25)',
    designer: 'Erik Lindström 🇸🇪', location: 'Стокгольм, Швеция',
    rating: '4.84', cuisine: 'Бранч · Панкейки · Specialty Coffee',
    tagline: 'Скандинавская лёгкость: кремовые тона, терракот, аппетитные фото. Eco Loyalty Club повышает возврат гостей.',
    avgCheck: '1 780 ₽', repeatRate: '+81%', delivery: '20–30 мин',
    features: ['Eco Loyalty Club с бонусами', 'Суфле-панкейки на заказ', 'Specialty кофе с картой', 'Бесконтактная оплата СБП'],
  },
  {
    id: 'burger', name: 'Burger Dark', subtitle: 'Fast Food Dark App', emblem: '🍔',
    accentColor: '#E85C00', accentGlow: 'rgba(232,92,0,0.25)',
    designer: 'Jordan Lee 🇺🇸', location: 'Нью-Йорк, США',
    rating: '4.91', cuisine: 'Бургеры · Комбо · Доставка',
    tagline: 'Агрессивный тёмный дизайн в стиле лучших food-delivery приложений. Максимальная конверсия через промо-баннеры и яркие CTA.',
    avgCheck: '890 ₽', repeatRate: '+73%', delivery: '15–25 мин',
    features: ['Тёмная тема с оранжевыми акцентами', 'Промо-баннер 20% OFF', 'Категории с emoji-иконками', 'Быстрый заказ в 2 клика'],
  },
  {
    id: 'chain', name: 'Chain Fast Food', subtitle: 'Light Red Style', emblem: '🍗',
    accentColor: '#E4002B', accentGlow: 'rgba(228,0,43,0.25)',
    designer: 'Anna Kim 🇰🇷', location: 'Сеул, Корея',
    rating: '4.88', cuisine: 'Курица · Комбо · Сеты',
    tagline: 'Светлый профессиональный дизайн в стиле мировых сетей. Чёткая иерархия, круглые категории, badges BESTSELLER/POPULAR.',
    avgCheck: '650 ₽', repeatRate: '+68%', delivery: '18–28 мин',
    features: ['Светлая тема, красные акценты', 'Круглые категории с emoji', 'Badges: BESTSELLER / POPULAR', 'Exclusive Offer баннер'],
  },
  {
    id: 'coffee', name: 'Coffee Shop', subtitle: 'Elegant Web Style', emblem: '☕',
    accentColor: '#2D5A3D', accentGlow: 'rgba(45,90,61,0.25)',
    designer: 'Sophie Martin 🇫🇷', location: 'Лион, Франция',
    rating: '4.93', cuisine: 'Кофе · Десерты · Выпечка',
    tagline: 'Элегантный кремовый стиль в духе европейских кофеен. Serif-типографика, золотые акценты, карточки десертов с поэтичными названиями.',
    avgCheck: '720 ₽', repeatRate: '+85%', delivery: '12–20 мин',
    features: ['Кремовый фон + зелёный + золото', 'Serif-типографика Müil-стиля', 'Карточки с поэтичными описаниями', 'Special Coffee секция'],
  },
  {
    id: 'cafe', name: 'Café Warm', subtitle: 'Cozy Warm Brown', emblem: '🥐',
    accentColor: '#5C3D2E', accentGlow: 'rgba(92,61,46,0.25)',
    designer: 'Luca Ferrari 🇮🇹', location: 'Флоренция, Италия',
    rating: '4.87', cuisine: 'Кафе · Выпечка · Обеды',
    tagline: 'Уютный тёплый коричневый стиль для кофеен и кафе. Тёплая атмосфера, "Why Choose Us", сетка меню с ценами.',
    avgCheck: '480 ₽', repeatRate: '+79%', delivery: '10–20 мин',
    features: ['Тёплые коричневые тона', '"Why Choose Us" секция', 'Классическая сетка меню', '"Visit Us Today" CTA блок'],
  },
];

/* ═══════════════════════════════════════════════════════════
   LEAD FORM MODAL
═══════════════════════════════════════════════════════════ */
function LeadModal({
  style,
  onClose
}: {
  style: { name: string; accentColor: string; accentGlow: string };
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: '', phone: '', restaurantName: '', comment: '', agree: true });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, preferredStyle: style.name })
      });
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || 'Ошибка');
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Не удалось отправить');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-3xl p-7 border-2 shadow-2xl bg-[#0d1117] text-white"
        style={{ borderColor: style.accentColor + '55', boxShadow: `0 0 60px ${style.accentGlow}` }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white">
          <X className="w-4 h-4" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2"
              style={{ borderColor: style.accentColor, background: style.accentColor + '20' }}
            >
              <Check className="w-8 h-8" style={{ color: style.accentColor }} />
            </div>
            <h3 className="text-xl font-black">Заявка принята!</h3>
            <p className="text-sm text-slate-300">Наш арт-директор свяжется с вами в Telegram в течение 15 минут.</p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-black text-sm text-black"
              style={{ background: style.accentColor }}
            >
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <h3 className="text-xl font-black">
                Заказать дизайн как <span style={{ color: style.accentColor }}>{style.name}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Адаптируем под ваш ресторан за 24–48 часов</p>
            </div>
            {error && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
                {error}
              </div>
            )}
            {[
              { key: 'name', label: 'Ваше имя *', ph: 'Алексей', req: true },
              { key: 'phone', label: 'Telegram или телефон *', ph: '@username или +7...', req: true },
              { key: 'restaurantName', label: 'Название заведения', ph: 'Кафе Москва', req: false },
            ].map(({ key, label, ph, req }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
                <input
                  type="text"
                  required={req}
                  value={(form as any)[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={ph}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:outline-none placeholder-slate-500"
                />
              </div>
            ))}
            <label className="flex items-center gap-2.5 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={e => setForm({ ...form, agree: e.target.checked })}
                style={{ accentColor: style.accentColor }}
              />
              <span>Согласен на обработку персональных данных</span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 text-black disabled:opacity-50 shadow-xl active:scale-[0.98] transition-all"
              style={{ background: style.accentColor }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /><span>Отправить заявку</span></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN GALLERY COMPONENT
═══════════════════════════════════════════════════════════ */
export function DesignShowcaseGallery() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState<'mobile' | 'desktop'>('mobile');
  const [selectedDish, setSelectedDish] = useState<DemoDish | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [leadStyle, setLeadStyle] = useState<null | { name: string; accentColor: string; accentGlow: string }>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const active = RESTAURANTS[activeIdx];

  const prev = () => setActiveIdx(i => (i - 1 + RESTAURANTS.length) % RESTAURANTS.length);
  const next = () => setActiveIdx(i => (i + 1) % RESTAURANTS.length);

  const handleAddToCart = (dish: DemoDish, qty: number = 1, options: string[] = []) => {
    const nameStr = getDishName(dish.name);
    const itemKey = `${dish.id || nameStr}-${options.sort().join('-')}`;
    setCartItems(prev => {
      const existing = prev.find(i => i.id === itemKey);
      if (existing) {
        return prev.map(i => (i.id === itemKey ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [
        ...prev,
        {
          id: itemKey,
          name: nameStr,
          price: dish.price,
          quantity: qty,
          emoji: dish.emoji,
          image: dish.image,
          options
        }
      ];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(it => it.id !== id));
  };

  const totalCartCount = cartItems.reduce((s, it) => s + it.quantity, 0);

  // Sync tab scroll
  useEffect(() => {
    const el = tabsRef.current?.children[activeIdx] as HTMLElement;
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIdx]);

  // Handle ESC key for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedDish) setSelectedDish(null);
        else if (cartOpen) setCartOpen(false);
        else if (isFullscreen) setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDish, cartOpen, isFullscreen]);

  const renderActivePhone = (isLarge = false) => {
    switch (active.id) {
      case 'porto':
        return <PortoBarPhone onSelectDish={setSelectedDish} onAddToCart={d => handleAddToCart(d, 1)} />;
      case 'brunch':
        return <BrunchBistroPhone onSelectDish={setSelectedDish} onAddToCart={d => handleAddToCart(d, 1)} />;
      case 'burger':
        return <BurgerDarkPhone onSelectDish={setSelectedDish} onAddToCart={d => handleAddToCart(d, 1)} />;
      case 'chain':
        return <ChainFoodPhone onSelectDish={setSelectedDish} onAddToCart={d => handleAddToCart(d, 1)} />;
      case 'coffee':
        return <CoffeeShopPhone onSelectDish={setSelectedDish} onAddToCart={d => handleAddToCart(d, 1)} />;
      case 'cafe':
        return <CafeWarmPhone onSelectDish={setSelectedDish} onAddToCart={d => handleAddToCart(d, 1)} />;
      default:
        return null;
    }
  };

  return (
    <section
      id="demo"
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#050810 0%,#070b14 60%,#050810 100%)' }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-0 transition-all duration-700">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20 transition-all duration-700"
          style={{ background: `radial-gradient(ellipse,${active.accentColor} 0%,transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Интерактивные примеры работ от наших дизайнеров</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-serif text-white leading-tight">
            Выберите стиль{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              вашего меню
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Каждый дизайн — полностью интерактивное приложение. Откройте на полный экран, потыкайте блюда,
            проверьте корзину и выберите концепцию для своего заведения.
          </p>
        </div>

        {/* Tab Carousel */}
        <div className="relative mb-10">
          <div
            ref={tabsRef}
            className="flex gap-2 overflow-x-auto scrollbar-none pb-2 px-1 justify-start lg:justify-center"
          >
            {RESTAURANTS.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setActiveIdx(i)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 transition-all duration-300 shrink-0 font-bold"
                style={
                  i === activeIdx
                    ? {
                        background: r.accentColor + '20',
                        borderColor: r.accentColor,
                        color: 'white',
                        boxShadow: `0 0 24px ${r.accentGlow}`,
                      }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        borderColor: 'rgba(255,255,255,0.10)',
                        color: '#94a3b8',
                      }
                }
              >
                <span className="text-lg leading-none">{r.emblem}</span>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-black leading-none">{r.name}</p>
                  <p className="text-[9px] opacity-60 mt-0.5">{r.subtitle}</p>
                </div>
                {i === activeIdx && (
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: r.accentColor }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center max-w-5xl mx-auto">
          {/* Phone Column */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Prev/Next arrows */}
              <button
                onClick={prev}
                className="absolute -left-10 sm:-left-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-all z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="absolute -right-10 sm:-right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-all z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <IPhoneFrame accentGlow={active.accentGlow}>
                {renderActivePhone()}
              </IPhoneFrame>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-1.5 mt-5">
              {RESTAURANTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIdx ? 20 : 6,
                    height: 6,
                    background: i === activeIdx ? active.accentColor : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>

            {/* Fullscreen Trigger Button under Phone */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all shadow-lg active:scale-95"
              >
                <Maximize2 className="w-4 h-4 text-amber-400" />
                <span>Открыть на весь экран и потыкать</span>
              </button>

              {totalCartCount > 0 && (
                <button
                  onClick={() => setCartOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-black shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Корзина ({totalCartCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div
            className="rounded-3xl p-6 sm:p-7 border-2 space-y-5 transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))',
              borderColor: active.accentColor + '40',
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${active.accentGlow}`,
            }}
          >
            {/* Designer */}
            <div className="text-xs text-slate-400">
              Дизайн: <span className="text-slate-200 font-semibold">{active.designer}</span> · {active.location}
            </div>

            {/* Title */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-serif">{active.name}</h3>
                <p className="text-sm font-bold mt-1" style={{ color: active.accentColor }}>
                  {active.subtitle}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{active.cuisine}</p>
              </div>
              <div
                className="flex items-center gap-1 px-3 py-1.5 rounded-2xl border shrink-0"
                style={{
                  background: active.accentColor + '18',
                  borderColor: active.accentColor + '40',
                  color: active.accentColor,
                }}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-sm font-black">{active.rating}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{active.tagline}</p>

            {/* Features */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Включённый функционал:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {active.features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-200 p-2 rounded-xl bg-black/30 border border-white/5"
                  >
                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: active.accentColor }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Ср. чек', value: active.avgCheck },
                { label: 'Повторные заказы', value: active.repeatRate },
                { label: 'Доставка', value: active.delivery },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-2xl text-center border border-white/5 bg-black/30">
                  <p className="text-sm font-black text-white">{s.value}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() =>
                  setLeadStyle({
                    name: active.name,
                    accentColor: active.accentColor,
                    accentGlow: active.accentGlow,
                  })
                }
                className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl"
                style={{
                  background: `linear-gradient(90deg,${active.accentColor},${active.accentColor}cc)`,
                  boxShadow: `0 8px 30px ${active.accentGlow}`,
                }}
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Хочу такой дизайн</span>
              </button>

              <button
                onClick={() => setIsFullscreen(true)}
                className="px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Maximize2 className="w-4 h-4 text-amber-400" />
                <span>Тест-драйв</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
         FULLSCREEN INTERACTIVE SIMULATOR STAGE
      ═══════════════════════════════════════════════════════════ */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[1000] bg-[#06080e] flex flex-col animate-fadeIn select-none overflow-hidden">
          {/* Top Bar */}
          <header className="px-4 py-3 bg-[#0a0d16] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0 z-30">
            {/* Restaurant Selector Tabs in Fullscreen */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {RESTAURANTS.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => setActiveIdx(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                    i === activeIdx
                      ? 'bg-white/15 text-white border-amber-400/60 shadow-md'
                      : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{r.emblem}</span>
                  <span>{r.name}</span>
                </button>
              ))}
            </div>

            {/* Controls Right */}
            <div className="flex items-center gap-2.5">
              {/* Device Mode Switcher */}
              <div className="hidden sm:flex items-center p-1 rounded-xl bg-white/6 border border-white/10">
                <button
                  onClick={() => setFullscreenMode('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    fullscreenMode === 'mobile' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Смартфон</span>
                </button>
                <button
                  onClick={() => setFullscreenMode('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    fullscreenMode === 'desktop' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Планшет / Десктоп</span>
                </button>
              </div>

              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all"
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>Корзина</span>
                {totalCartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Lead CTA */}
              <button
                onClick={() => {
                  setLeadStyle({
                    name: active.name,
                    accentColor: active.accentColor,
                    accentGlow: active.accentGlow,
                  });
                }}
                className="px-4 py-2 rounded-xl text-black font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                style={{ background: active.accentColor }}
              >
                Хочу такой дизайн
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all ml-1"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Interactive Screen Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 flex items-center justify-center relative">
            {fullscreenMode === 'mobile' ? (
              <div className="py-2 animate-fadeIn">
                <IPhoneFrame accentGlow={active.accentGlow} isLarge={true}>
                  {renderActivePhone(true)}
                </IPhoneFrame>
              </div>
            ) : (
              /* Wide Desktop / Tablet View */
              <div
                className="w-full max-w-5xl rounded-3xl overflow-hidden border-2 shadow-2xl animate-fadeIn flex flex-col h-[82vh]"
                style={{
                  background: '#0c0f17',
                  borderColor: active.accentColor + '50',
                  boxShadow: `0 0 60px ${active.accentGlow}`,
                }}
              >
                {/* Wide Header */}
                <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{active.emblem}</span>
                    <div>
                      <h2 className="text-xl font-black text-white">{active.name}</h2>
                      <p className="text-xs text-slate-400">{active.subtitle} • {active.cuisine}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{active.rating}</span>
                    </div>
                    <button
                      onClick={() => setCartOpen(true)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{totalCartCount}</span>
                    </button>
                  </div>
                </div>

                {/* Wide Body - Embedded Menu Preview */}
                <div className="flex-1 overflow-y-auto scrollbar-none p-6">
                  {renderActivePhone()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dish Detail Modal */}
      {selectedDish && (
        <InteractiveDishModal
          dish={selectedDish}
          accentColor={active.accentColor}
          onClose={() => setSelectedDish(null)}
          onAdd={handleAddToCart}
        />
      )}

      {/* Cart Modal */}
      {cartOpen && (
        <CartModal
          items={cartItems}
          accentColor={active.accentColor}
          onClose={() => setCartOpen(false)}
          onRemove={handleRemoveFromCart}
          onClear={() => setCartItems([])}
        />
      )}

      {/* Lead Form Modal */}
      {leadStyle && <LeadModal style={leadStyle} onClose={() => setLeadStyle(null)} />}
    </section>
  );
}
