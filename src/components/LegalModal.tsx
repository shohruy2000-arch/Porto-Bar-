'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText, Building2, AlertTriangle, CreditCard, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type LegalTab = 'privacy' | 'terms' | 'requisites' | 'refund' | 'alcohol';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy'
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-panel w-full max-w-2xl rounded-3xl border border-porto-gold/30 shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col max-h-[88vh] overflow-hidden bg-neutral-950 text-gray-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-porto-card/40">
            <div className="flex items-center space-x-2.5">
              <Shield className="w-5 h-5 text-porto-gold" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-porto-gold-bright">
                  Правовая информация
                </h3>
                <p className="text-[9px] uppercase tracking-widest text-gray-400">
                  ООО «Движение ВВЕРХ И ВПЕРЕД» • Porto Bar
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/5 overflow-x-auto scrollbar-none bg-black/30 px-2 py-1 gap-1">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-porto-gold text-porto-bg shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              152-ФЗ Политика данных
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-porto-gold text-porto-bg shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Публичная оферта
            </button>
            <button
              onClick={() => setActiveTab('requisites')}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'requisites'
                  ? 'bg-porto-gold text-porto-bg shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Реквизиты
            </button>
            <button
              onClick={() => setActiveTab('refund')}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'refund'
                  ? 'bg-porto-gold text-porto-bg shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Оплата и возврат
            </button>
            <button
              onClick={() => setActiveTab('alcohol')}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'alcohol'
                  ? 'bg-porto-gold text-porto-bg shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              18+ Алкоголь & Аллергены
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs text-gray-300 leading-relaxed space-y-4 scrollbar-thin">
            {activeTab === 'privacy' && (
              <div className="space-y-3.5 text-left">
                <h4 className="text-sm font-bold text-porto-gold uppercase tracking-wider">
                  Политика обработки персональных данных (152-ФЗ РФ)
                </h4>
                <p>
                  Настоящая Политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных, предпринимаемые <strong>ООО «Движение ВВЕРХ И ВПЕРЕД»</strong> (ОГРН 1217700021912, ИНН 9729304162), далее — «Оператор».
                </p>

                <h5 className="font-bold text-white uppercase text-[11px] pt-1">1. Категории обрабатываемых данных</h5>
                <p>Оператор обрабатывает следующие персональные данные Пользователей:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Фамилия, имя, отчество;</li>
                  <li>Контактный номер телефона и адрес электронной почты;</li>
                  <li>Адрес доставки заказов либо номер комнаты в гостинице «Аструс» / номер стола;</li>
                  <li>История заказов, бронирований и участия в программе лояльности;</li>
                  <li>Обезличенные данные о посетителях (файлы «cookie», IP-адрес, данные об устройстве).</li>
                </ul>

                <h5 className="font-bold text-white uppercase text-[11px] pt-1">2. Цели обработки персональных данных</h5>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Оформление, приготовление, доставка и выдача заказов Пользователю;</li>
                  <li>Бронирование столов в ресторане Porto Bar;</li>
                  <li>Регистрация и обслуживание в клубной программе лояльности PORTO Club;</li>
                  <li>Информирование о статусе заказа и предоставление сервисных уведомлений;</li>
                  <li>Улучшение качества обслуживания и работы цифрового сервиса.</li>
                </ul>

                <h5 className="font-bold text-white uppercase text-[11px] pt-1">3. Безопасность и конфиденциальность</h5>
                <p>
                  Оператор обеспечивает сохранность персональных данных и принимает все возможные правовые, организационные и технические меры, исключающие доступ к персональным данным неуполномоченных лиц. Персональные данные ни при каких условиях не передаются третьим лицам, за исключением случаев, связанных с исполнением действующего законодательства РФ.
                </p>
                <p>
                  Срок обработки персональных данных является неограниченным. Пользователь может в любой момент отозвать свое согласие на обработку персональных данных, направив Оператору письменное уведомление или обратившись по телефону <strong>+7 (495) 797-85-66</strong>.
                </p>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-3.5 text-left">
                <h4 className="text-sm font-bold text-porto-gold uppercase tracking-wider">
                  Пользовательское соглашение и публичная оферта
                </h4>
                <p>
                  Настоящий документ является публичной офертой <strong>ООО «Движение ВВЕРХ И ВПЕРЕД»</strong> (ресторан-бар Porto Bar) в соответствии со ст. 437 Гражданского кодекса РФ и содержит все существенные условия оказания услуг общественного питания и доставки готовых блюд.
                </p>

                <h5 className="font-bold text-white uppercase text-[11px] pt-1">1. Оформление и прием заказов</h5>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Оформление заказов осуществляется через сайт <strong>porto-bar.ru</strong>, по внутреннему телефону <strong>2227</strong> или городскому номеру <strong>+7 (495) 797-85-66</strong>.</li>
                  <li>Доставка готовых блюд осуществляется в пределах установленной зоны обслуживания (до 2 км от заведения) либо в номера гостиницы «Аструс».</li>
                  <li>Время приема заказов соответствует часам работы заведения: ежедневно с 12:00 до 24:00.</li>
                </ul>

                <h5 className="font-bold text-white uppercase text-[11px] pt-1">2. Цены и оплата</h5>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Все цены в меню указаны в российских рублях (₽) и включают установленные налоги.</li>
                  <li>Оплата производится при получении заказа: наличными средствами либо банковской картой через мобильный терминал курьера/официанта.</li>
                </ul>

                <h5 className="font-bold text-white uppercase text-[11px] pt-1">3. Качество и претензии</h5>
                <p>
                  Исполнитель гарантирует соответствие приготовленных блюд действующим санитарным нормам (СанПиН) и стандартам общественного питания РФ. В случае возникновения претензий к комплектации или качеству блюд, гость имеет право незамедлительно заявить об этом для замены блюда либо перерасчета стоимости.
                </p>
              </div>
            )}

            {activeTab === 'requisites' && (
              <div className="space-y-3.5 text-left">
                <h4 className="text-sm font-bold text-porto-gold uppercase tracking-wider">
                  Реквизиты юридического лица и контакты
                </h4>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5 font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Наименование организации</span>
                      <span className="text-white font-semibold">ООО «Движение ВВЕРХ И ВПЕРЕД»</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">ОГРН</span>
                      <span className="text-white font-mono font-bold">1217700021912</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">ИНН / КПП</span>
                      <span className="text-white font-mono font-bold">9729304162 / 772901001</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Контактный телефон</span>
                      <span className="text-porto-gold-bright font-bold">+7 (495) 797-85-66</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-2">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Фактический и юридический адрес</span>
                    <span className="text-gray-200">
                      119571, Россия, г. Москва, проспект Ленинский, дом 146, 1 этаж (Гостиница «Аструс», ресторан-бар Porto Bar)
                    </span>
                  </div>

                  <div className="border-t border-white/5 pt-2">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Режим работы</span>
                    <span className="text-gray-200">Ежедневно: с 12:00 до 24:00 (без выходных)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'refund' && (
              <div className="space-y-3.5 text-left">
                <h4 className="text-sm font-bold text-porto-gold uppercase tracking-wider">
                  Правила оплаты, отмены заказов и возврата
                </h4>
                <p>
                  В соответствии с Законом РФ «О защите прав потребителей» № 2300-1 и Правилами оказания услуг общественного питания (Постановление Правительства РФ № 1515):
                </p>

                <h5 className="font-bold text-white uppercase text-[11px] pt-1">1. Способы оплаты</h5>
                <p>
                  Оплата заказов осуществляется в рублях РФ при получении заказа (в номере, за столом или при доставке курьером) следующими способами:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Банковскими картами Visa, MasterCard, МИР через платежный POS-терминал;</li>
                  <li>Наличными денежными средствами;</li>
                  <li>С использованием накопленных бонусных баллов программы лояльности PORTO Club.</li>
                </ul>

                <h5 className="font-bold text-white uppercase text-[11px] pt-1">2. Отмена заказа и отказ от услуги</h5>
                <p>
                  Потребитель вправе в любой момент отказаться от заказанного блюда / доставки при условии оплаты фактически понесенных исполнителем расходов, связанных с исполнением обязательств по данному договору (ст. 32 Закона РФ «О защите прав потребителей»). Если приготовление блюда еще не началось на кухне, отмена производится без удержания расходов.
                </p>

                <h5 className="font-bold text-white uppercase text-[11px] pt-1">3. Возврат денежных средств</h5>
                <p>
                  В случае выявления ненадлежащего качества блюда либо несоответствия заказу, возврат денежных средств осуществляется тем же способом, которым производилась оплата (наличными сразу либо на банковскую карту плательщика в установленные банковской системой сроки от 1 до 5 рабочих дней).
                </p>
              </div>
            )}

            {activeTab === 'alcohol' && (
              <div className="space-y-3.5 text-left">
                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Уведомление об алкогольной продукции и аллергенах</span>
                </h4>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                  <h5 className="font-black text-amber-300 uppercase text-[11px]">
                    🔞 Ограничение продажи алкогольной продукции (171-ФЗ РФ)
                  </h5>
                  <p className="text-gray-300 leading-relaxed">
                    Дистанционная продажа алкогольной продукции в соответствии с Федеральным законом от 22.11.1995 № 171-ФЗ не осуществляется. Вся алкогольная продукция, представленная в меню бара, доступна исключительно для заказа и употребления на территории заведения гостям, достигшим <strong>18-летнего возраста</strong> (при предъявлении документа, удостоверяющего личность).
                  </p>
                  <p className="text-amber-200/90 font-semibold italic text-[11px]">
                    Чрезмерное употребление алкоголя вредит вашему здоровью!
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <h5 className="font-black text-white uppercase text-[11px]">
                    ⚠️ Предупреждение об аллергенах и составе блюд
                  </h5>
                  <p className="text-gray-300 leading-relaxed">
                    Информация о калорийности (КБЖУ), весе и составе блюд представлена в подробных карточках каждого блюда меню. Если у вас имеется индивидуальная непереносимость, аллергия на орехи, глютен, лактозу, морепродукты или иные ингредиенты, пожалуйста, заблаговременно сообщите об этом официанту или укажите в комментарии к заказу.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 bg-porto-card/30 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
            <span>© 2026 Porto Bar. Все права защищены.</span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-porto-gold text-porto-bg font-black uppercase tracking-wider rounded-full hover:bg-porto-gold-bright transition-all cursor-pointer shadow-md"
            >
              Закрыть
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
