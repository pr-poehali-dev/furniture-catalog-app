import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import KitchenPlanner from "@/components/KitchenPlanner";

const HERO_IMG = "https://cdn.poehali.dev/projects/1e1e25b9-148b-42a8-a65e-b6215ef6cf0a/files/7008296f-d410-4d23-a2f0-d65b3b57e0cc.jpg";
const SOFA_IMG = "https://cdn.poehali.dev/projects/1e1e25b9-148b-42a8-a65e-b6215ef6cf0a/files/191f7064-a9d1-4b1f-ac18-1c895f9de517.jpg";
const WARDROBE_IMG = "https://cdn.poehali.dev/projects/1e1e25b9-148b-42a8-a65e-b6215ef6cf0a/files/11c7134f-4e62-4593-a56a-3be7ffee1384.jpg";

const CATALOG = [
  { id: 1, name: "Диван OSLO", mat: "Велюр / Дуб", price: "от 185 000 ₽", img: SOFA_IMG, tag: "Хит" },
  { id: 2, name: "Шкаф LUND", mat: "Шпон ореха / Металл", price: "от 240 000 ₽", img: WARDROBE_IMG, tag: "Новинка" },
  { id: 3, name: "Стол BERG", mat: "Массив дуба / Сталь", price: "от 95 000 ₽", img: HERO_IMG, tag: null },
];

const PORTFOLIO = [
  { id: 1, title: "Квартира на Патриарших", area: "180 м²", year: "2024", img: HERO_IMG },
  { id: 2, title: "Загородный дом", area: "420 м²", year: "2024", img: SOFA_IMG },
  { id: 3, title: "Пентхаус в Москва-Сити", area: "310 м²", year: "2023", img: WARDROBE_IMG },
];



function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });
  const [heroLoaded, setHeroLoaded] = useState(false);

  const catalogInView = useInView();
  const portfolioInView = useInView();
  const configInView = useInView();
  const contactInView = useInView();

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const navItems = [
    { id: "home", label: "Главная" },
    { id: "catalog", label: "Каталог" },
    { id: "configurator", label: "Конфигуратор" },
    { id: "portfolio", label: "Портфолио" },
    { id: "contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0D0D0D", color: "#F5EFE6" }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-6"
        style={{ background: "linear-gradient(to bottom, rgba(13,13,13,0.97) 0%, transparent 100%)" }}>
        <button onClick={() => scrollTo("home")}
          className="font-cormorant text-2xl font-light tracking-[0.3em] transition-colors duration-300"
          style={{ color: "#F5EFE6" }}>
          FORMA
        </button>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className={`nav-link ${activeSection === item.id ? "active" : ""}`}>
              {item.label}
            </button>
          ))}
        </div>

        <button onClick={() => scrollTo("contacts")} className="hidden md:block gold-border-btn">
          Заказать проект
        </button>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color: "#F5EFE6" }}>
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10"
          style={{ background: "#0D0D0D" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className="font-cormorant text-4xl font-light transition-colors duration-300 hover:text-gold-DEFAULT"
              style={{ color: "#F5EFE6" }}>
              {item.label}
            </button>
          ))}
          <button onClick={() => scrollTo("contacts")} className="gold-fill-btn mt-6">Заказать проект</button>
        </div>
      )}

      {/* ===== HERO ===== */}
      <section id="home" className="relative flex items-end overflow-hidden" style={{ height: "100vh" }}>
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="FORMA Мебель" className="w-full h-full object-cover"
            style={{ filter: "brightness(0.3)" }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #0D0D0D 0%, rgba(13,13,13,0.3) 50%, transparent 100%)" }} />
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <p className="font-golos text-xs tracking-[0.4em] opacity-60 uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: "#C9A96E" }}>
            Дизайнерская мебель на заказ
          </p>
        </div>

        <div className="absolute left-16 top-1/4 bottom-1/4 w-px hidden lg:block"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.35), transparent)" }} />

        <div className="relative z-10 px-8 md:px-16 pb-24 max-w-4xl">
          <p className={`font-golos text-xs tracking-[0.4em] uppercase mb-6 opacity-0-init ${heroLoaded ? "animate-fade-up" : ""}`}
            style={{ color: "#C9A96E", animationFillMode: "forwards" }}>
            Мебель ручной работы · Москва
          </p>
          <h1 className={`font-cormorant font-light leading-none opacity-0-init ${heroLoaded ? "animate-fade-up animate-delay-200" : ""}`}
            style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", color: "#F5EFE6", animationFillMode: "forwards" }}>
            Форма<br />
            <span style={{ color: "#C9A96E" }}>и</span> суть
          </h1>
          <p className={`font-golos text-base md:text-lg max-w-md mt-8 leading-relaxed opacity-0-init ${heroLoaded ? "animate-fade-up animate-delay-400" : ""}`}
            style={{ color: "rgba(245,239,230,0.55)", animationFillMode: "forwards" }}>
            Создаём мебель, которая становится частью вашего пространства. Каждый предмет — результат диалога между мастером и заказчиком.
          </p>
          <div className={`flex flex-wrap gap-4 mt-10 opacity-0-init ${heroLoaded ? "animate-fade-up animate-delay-600" : ""}`}
            style={{ animationFillMode: "forwards" }}>
            <button onClick={() => scrollTo("catalog")} className="gold-fill-btn">Смотреть каталог</button>
            <button onClick={() => scrollTo("configurator")} className="gold-border-btn">Настроить мебель</button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-golos text-xs tracking-widest uppercase" style={{ color: "rgba(245,239,230,0.3)" }}>Прокрутите</span>
          <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, #C9A96E, transparent)" }} />
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 px-8 md:px-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { num: "12", label: "лет на рынке" },
            { num: "840+", label: "реализованных проектов" },
            { num: "47", label: "мастеров в команде" },
            { num: "6", label: "шоурумов в Москве" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-cormorant text-5xl font-light" style={{ color: "#C9A96E" }}>{s.num}</div>
              <div className="font-golos text-xs tracking-wider mt-2 uppercase" style={{ color: "rgba(245,239,230,0.4)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATALOG ===== */}
      <section id="catalog" className="py-24 px-8 md:px-16">
        <div ref={catalogInView.ref}>
          <div className="flex items-end justify-between mb-16">
            <div className="relative">
              <span className="section-num absolute -top-8 -left-4">01</span>
              <p className="font-golos text-xs tracking-[0.4em] uppercase mb-3" style={{ color: "#C9A96E" }}>Коллекции</p>
              <h2 className={`font-cormorant text-5xl md:text-6xl font-light opacity-0-init ${catalogInView.visible ? "animate-fade-up" : ""}`}
                style={{ color: "#F5EFE6", animationFillMode: "forwards" }}>
                Каталог
              </h2>
            </div>
            <button className="hidden md:block gold-border-btn">Весь каталог</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
            {CATALOG.map((item, i) => (
              <div key={item.id}
                className={`card-hover group cursor-pointer opacity-0-init ${catalogInView.visible ? "animate-fade-up" : ""}`}
                style={{ background: "#1A1A1A", animationFillMode: "forwards", animationDelay: `${i * 0.15}s` }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                  <img src={item.img} alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: "brightness(0.8)" }} />
                  {item.tag && (
                    <div className="absolute top-4 left-4 px-3 py-1"
                      style={{ background: "#C9A96E", color: "#0D0D0D", fontSize: "0.65rem", letterSpacing: "0.15em", fontFamily: "Golos Text, sans-serif", textTransform: "uppercase" }}>
                      {item.tag}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-cormorant text-2xl font-light tracking-wider" style={{ color: "#F5EFE6" }}>{item.name}</h3>
                  <p className="font-golos text-xs mt-1 tracking-wider" style={{ color: "rgba(245,239,230,0.35)" }}>{item.mat}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-cormorant text-xl" style={{ color: "#C9A96E" }}>{item.price}</span>
                    <button className="font-golos text-xs tracking-wider uppercase transition-colors duration-300 hover:text-cream"
                      style={{ color: "rgba(245,239,230,0.35)" }}>
                      Подробнее →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONFIGURATOR ===== */}
      <section id="configurator" className="py-24 px-8 md:px-16" style={{ background: "#111" }}>
        <div ref={configInView.ref}>
          <div className="relative mb-12">
            <span className="section-num absolute -top-8 -left-4">02</span>
            <p className="font-golos text-xs tracking-[0.4em] uppercase mb-3" style={{ color: "#C9A96E" }}>Планировщик кухни</p>
            <h2 className={`font-cormorant text-5xl md:text-6xl font-light opacity-0-init ${configInView.visible ? "animate-fade-up" : ""}`}
              style={{ color: "#F5EFE6", animationFillMode: "forwards" }}>
              Конфигуратор
            </h2>
            <p className="font-golos text-sm mt-3 max-w-xl" style={{ color: "rgba(245,239,230,0.4)", lineHeight: 1.7 }}>
              Задайте размеры комнаты, выберите стену и расставьте корпуса — вид сверху в масштабе 1:1.
              Перетащите модули для перекомпоновки.
            </p>
          </div>
          <KitchenPlanner />
        </div>
      </section>

      {/* ===== PORTFOLIO ===== */}
      <section id="portfolio" className="py-24 px-8 md:px-16">
        <div ref={portfolioInView.ref}>
          <div className="flex items-end justify-between mb-16">
            <div className="relative">
              <span className="section-num absolute -top-8 -left-4">03</span>
              <p className="font-golos text-xs tracking-[0.4em] uppercase mb-3" style={{ color: "#C9A96E" }}>Реализованные объекты</p>
              <h2 className={`font-cormorant text-5xl md:text-6xl font-light opacity-0-init ${portfolioInView.visible ? "animate-fade-up" : ""}`}
                style={{ color: "#F5EFE6", animationFillMode: "forwards" }}>
                Портфолио
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PORTFOLIO.map((p, i) => (
              <div key={p.id}
                className={`group relative cursor-pointer overflow-hidden opacity-0-init ${portfolioInView.visible ? "animate-fade-up" : ""}`}
                style={{ animationFillMode: "forwards", animationDelay: `${i * 0.15}s`, aspectRatio: "3/4" }}>
                <img src={p.img} alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ filter: "brightness(0.45)" }} />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(13,13,13,0.92) 0%, transparent 55%)" }} />
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="w-8 h-px mb-4" style={{ background: "#C9A96E" }} />
                  <h3 className="font-cormorant text-2xl font-light" style={{ color: "#F5EFE6" }}>{p.title}</h3>
                  <div className="flex gap-4 mt-2">
                    <span className="font-golos text-xs tracking-wider" style={{ color: "rgba(245,239,230,0.4)" }}>{p.area}</span>
                    <span className="font-golos text-xs tracking-wider" style={{ color: "rgba(245,239,230,0.4)" }}>{p.year}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Icon name="ArrowUpRight" size={20} style={{ color: "#C9A96E" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACTS ===== */}
      <section id="contacts" className="py-24 px-8 md:px-16" style={{ background: "#111" }}>
        <div ref={contactInView.ref}>
          <div className="grid md:grid-cols-2 gap-20 max-w-6xl mx-auto">
            <div>
              <div className="relative mb-12">
                <span className="section-num absolute -top-8 -left-4">04</span>
                <p className="font-golos text-xs tracking-[0.4em] uppercase mb-3" style={{ color: "#C9A96E" }}>Свяжитесь с нами</p>
                <h2 className={`font-cormorant text-5xl md:text-6xl font-light opacity-0-init ${contactInView.visible ? "animate-fade-up" : ""}`}
                  style={{ color: "#F5EFE6", animationFillMode: "forwards" }}>
                  Контакты
                </h2>
              </div>

              <div className="space-y-8">
                {[
                  { icon: "MapPin", label: "Адрес", val: "Москва, ул. Дизайнерская, 12\nШоурум открыт пн–сб 10:00–20:00" },
                  { icon: "Phone", label: "Телефон", val: "+7 (495) 123-45-67" },
                  { icon: "Mail", label: "Email", val: "hello@forma-mebel.ru" },
                ].map((c, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                      style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                      <Icon name={c.icon} fallback="CircleAlert" size={16} style={{ color: "#C9A96E" }} />
                    </div>
                    <div>
                      <p className="font-golos text-xs tracking-wider uppercase mb-1" style={{ color: "rgba(245,239,230,0.35)" }}>{c.label}</p>
                      <p className="font-golos text-sm whitespace-pre-line" style={{ color: "rgba(245,239,230,0.75)" }}>{c.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-12">
                {["Instagram", "Youtube", "MessageCircle"].map((ic, i) => (
                  <button key={i} className="w-10 h-10 flex items-center justify-center transition-colors duration-300"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "#C9A96E")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}>
                    <Icon name={ic} fallback="CircleAlert" size={14} style={{ color: "rgba(245,239,230,0.4)" }} />
                  </button>
                ))}
              </div>
            </div>

            <div className={`opacity-0-init ${contactInView.visible ? "animate-fade-up animate-delay-300" : ""}`}
              style={{ animationFillMode: "forwards" }}>
              <div className="space-y-4">
                {[
                  { key: "name", label: "Ваше имя", type: "text", placeholder: "Александр Петров" },
                  { key: "phone", label: "Телефон", type: "tel", placeholder: "+7 (___) ___-__-__" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="font-golos text-xs tracking-[0.2em] uppercase mb-2 block"
                      style={{ color: "rgba(245,239,230,0.35)" }}>
                      {field.label}
                    </label>
                    <input type={field.type} placeholder={field.placeholder}
                      value={contactForm[field.key as keyof typeof contactForm]}
                      onChange={e => setContactForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full bg-transparent py-3 font-golos text-sm focus:outline-none transition-colors duration-300"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.12)",
                        color: "#F5EFE6",
                      }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = "#C9A96E")}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.12)")} />
                  </div>
                ))}
                <div>
                  <label className="font-golos text-xs tracking-[0.2em] uppercase mb-2 block"
                    style={{ color: "rgba(245,239,230,0.35)" }}>
                    Ваш запрос
                  </label>
                  <textarea placeholder="Опишите, какую мебель вы хотите..."
                    rows={4}
                    value={contactForm.message}
                    onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-transparent py-3 font-golos text-sm focus:outline-none transition-colors duration-300 resize-none"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.12)",
                      color: "#F5EFE6",
                    }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = "#C9A96E")}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.12)")} />
                </div>
                <button className="gold-fill-btn w-full text-center block" style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
                  Отправить заявку
                </button>
                <p className="font-golos text-xs text-center mt-2" style={{ color: "rgba(245,239,230,0.2)" }}>
                  Перезвоним в течение 2 часов в рабочее время
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-8 md:px-16" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-cormorant text-xl font-light tracking-[0.3em]" style={{ color: "rgba(245,239,230,0.3)" }}>FORMA</span>
          <span className="font-golos text-xs tracking-wider" style={{ color: "rgba(245,239,230,0.18)" }}>© 2024 FORMA. Мебель на заказ в Москве</span>
          <button className="font-golos text-xs tracking-wider transition-colors duration-300 hover:opacity-60"
            style={{ color: "rgba(245,239,230,0.18)" }}>
            Политика конфиденциальности
          </button>
        </div>
      </footer>
    </div>
  );
}