import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

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

const MATERIALS = ["Дуб натуральный", "Орех американский", "Ясень беленый", "Лак матовый", "Лак глянцевый"];
const COLORS = ["#1A1A1A", "#3D2B1F", "#6B5040", "#C4A882", "#E8DDD0", "#F5EFE6"];
const SIZES = [
  { label: "Ш", min: 60, max: 300, unit: "см" },
  { label: "В", min: 40, max: 250, unit: "см" },
  { label: "Г", min: 30, max: 100, unit: "см" },
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
  const [selectedMaterial, setSelectedMaterial] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [sizes, setSizes] = useState([180, 80, 60]);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });
  const [heroLoaded, setHeroLoaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
          <div className="relative mb-16">
            <span className="section-num absolute -top-8 -left-4">02</span>
            <p className="font-golos text-xs tracking-[0.4em] uppercase mb-3" style={{ color: "#C9A96E" }}>Персонализация</p>
            <h2 className={`font-cormorant text-5xl md:text-6xl font-light opacity-0-init ${configInView.visible ? "animate-fade-up" : ""}`}
              style={{ color: "#F5EFE6", animationFillMode: "forwards" }}>
              Конфигуратор
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 max-w-6xl">
            <div className="space-y-10">
              <div>
                <p className="font-golos text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(245,239,230,0.4)" }}>Материал</p>
                <div className="flex flex-wrap gap-2">
                  {MATERIALS.map((m, i) => (
                    <button key={i} onClick={() => setSelectedMaterial(i)}
                      className="font-golos text-xs px-4 py-2 border transition-all duration-300"
                      style={{
                        borderColor: selectedMaterial === i ? "#C9A96E" : "rgba(255,255,255,0.1)",
                        color: selectedMaterial === i ? "#C9A96E" : "rgba(245,239,230,0.45)",
                        background: selectedMaterial === i ? "rgba(201,169,110,0.08)" : "transparent",
                      }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-golos text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(245,239,230,0.4)" }}>Цвет / отделка</p>
                <div className="flex gap-3">
                  {COLORS.map((c, i) => (
                    <button key={i} onClick={() => setSelectedColor(i)}
                      className="w-8 h-8 rounded-full transition-all duration-300"
                      style={{
                        background: c,
                        border: selectedColor === i ? "2px solid #C9A96E" : "2px solid rgba(255,255,255,0.1)",
                        boxShadow: selectedColor === i ? "0 0 0 2px rgba(201,169,110,0.3)" : "none",
                        transform: selectedColor === i ? "scale(1.25)" : "scale(1)",
                      }} />
                  ))}
                </div>
              </div>

              <div>
                <p className="font-golos text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(245,239,230,0.4)" }}>Размеры</p>
                {SIZES.map((s, i) => (
                  <div key={i} className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="font-golos text-xs tracking-wider" style={{ color: "rgba(245,239,230,0.4)" }}>{s.label}</span>
                      <span className="font-cormorant text-lg" style={{ color: "#C9A96E" }}>
                        {sizes[i]} {s.unit}
                      </span>
                    </div>
                    <input type="range" min={s.min} max={s.max} value={sizes[i]}
                      onChange={e => {
                        const newSizes = [...sizes];
                        newSizes[i] = Number(e.target.value);
                        setSizes(newSizes);
                      }}
                      className="w-full cursor-pointer appearance-none h-px"
                      style={{ accentColor: "#C9A96E", background: "rgba(255,255,255,0.1)" }} />
                    <div className="flex justify-between mt-1">
                      <span className="font-golos text-xs" style={{ color: "rgba(245,239,230,0.15)" }}>{s.min}</span>
                      <span className="font-golos text-xs" style={{ color: "rgba(245,239,230,0.15)" }}>{s.max}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-golos text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(245,239,230,0.4)" }}>Превью</p>
              <div className="relative border overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)", aspectRatio: "4/3" }}>
                <img src={SOFA_IMG} alt="Превью" className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.65)", mixBlendMode: "luminosity" }} />
                <div className="absolute inset-0 flex items-end p-6"
                  style={{ background: "linear-gradient(to top, rgba(13,13,13,0.85) 0%, transparent 60%)" }}>
                  <div>
                    <p className="font-cormorant text-2xl" style={{ color: "#F5EFE6" }}>{MATERIALS[selectedMaterial]}</p>
                    <p className="font-golos text-xs mt-1 tracking-wider" style={{ color: "rgba(245,239,230,0.4)" }}>
                      {sizes[0]} × {sizes[1]} × {sizes[2]} см
                    </p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full"
                  style={{ background: COLORS[selectedColor], border: "2px solid #C9A96E" }} />
              </div>

              <div className="mt-6 cursor-pointer transition-colors duration-300 p-6 text-center"
                style={{ border: "1px dashed rgba(255,255,255,0.15)" }}
                onClick={() => fileRef.current?.click()}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#C9A96E")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}>
                {uploadedPhoto ? (
                  <img src={uploadedPhoto} alt="Фото интерьера" className="w-full max-h-40 object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Icon name="Upload" size={20} style={{ color: "rgba(245,239,230,0.25)" }} />
                    <p className="font-golos text-xs tracking-wider" style={{ color: "rgba(245,239,230,0.25)" }}>Загрузите фото вашего интерьера</p>
                    <p className="font-golos text-xs" style={{ color: "rgba(245,239,230,0.15)" }}>JPG, PNG · до 10 МБ</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </div>

              <button onClick={() => scrollTo("contacts")} className="gold-fill-btn w-full mt-6 text-center block">
                Отправить заявку с параметрами
              </button>
            </div>
          </div>
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