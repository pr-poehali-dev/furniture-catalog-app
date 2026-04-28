import { useState, useRef, useCallback, useEffect } from "react";
import Icon from "@/components/ui/icon";

const SCALE = 60; // px per meter

const MODULE_CATALOG = [
  { type: "base-40", label: "Тумба 40", w: 0.4, d: 0.6, color: "#2A2A2A", price: 18000, icon: "Square" },
  { type: "base-60", label: "Тумба 60", w: 0.6, d: 0.6, color: "#2A2A2A", price: 24000, icon: "Square" },
  { type: "base-80", label: "Тумба 80", w: 0.8, d: 0.6, color: "#2A2A2A", price: 30000, icon: "Square" },
  { type: "sink-80", label: "Мойка 80", w: 0.8, d: 0.6, color: "#1E2A3A", price: 32000, icon: "Droplets" },
  { type: "corner", label: "Угловая", w: 1.0, d: 1.0, color: "#252520", price: 48000, icon: "CornerDownRight" },
  { type: "tall-60", label: "Пенал 60", w: 0.6, d: 0.6, color: "#1A1A1A", price: 42000, icon: "RectangleVertical" },
  { type: "wall-60", label: "Навесной 60", w: 0.6, d: 0.35, color: "#333", price: 16000, icon: "PanelTop" },
  { type: "wall-80", label: "Навесной 80", w: 0.8, d: 0.35, color: "#333", price: 20000, icon: "PanelTop" },
];

type Wall = "top" | "right" | "bottom" | "left";

interface PlacedModule {
  id: string;
  type: string;
  label: string;
  w: number;
  d: number;
  color: string;
  price: number;
  wall: Wall;
  pos: number;
}

function getWallConfig(wall: Wall, roomW: number, roomH: number) {
  switch (wall) {
    case "top": return { axis: "x" as const, max: roomW, isVertical: false, flip: false };
    case "bottom": return { axis: "x" as const, max: roomW, isVertical: false, flip: true };
    case "left": return { axis: "y" as const, max: roomH, isVertical: true, flip: false };
    case "right": return { axis: "y" as const, max: roomH, isVertical: true, flip: true };
  }
}

function moduleScreenRect(m: PlacedModule, roomW: number, roomH: number, scale: number) {
  const mW = m.w * scale;
  const mD = m.d * scale;
  const pos = m.pos * scale;
  switch (m.wall) {
    case "top": return { x: pos, y: 0, w: mW, h: mD };
    case "bottom": return { x: pos, y: roomH * scale - mD, w: mW, h: mD };
    case "left": return { x: 0, y: pos, w: mD, h: mW };
    case "right": return { x: roomW * scale - mD, y: pos, w: mD, h: mW };
  }
}

const WALL_LABELS: Record<Wall, string> = { top: "Верхняя", right: "Правая", bottom: "Нижняя", left: "Левая" };
const WALL_ORDER: Wall[] = ["top", "right", "bottom", "left"];

export default function KitchenPlanner() {
  const [roomW, setRoomW] = useState(4.0);
  const [roomH, setRoomH] = useState(3.0);
  const [modules, setModules] = useState<PlacedModule[]>([]);
  const [selectedWall, setSelectedWall] = useState<Wall>("bottom");
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [hoverWall, setHoverWall] = useState<Wall | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const totalPrice = modules.reduce((s, m) => s + m.price, 0);
  const totalWidth = modules.reduce((s, m) => {
    if (m.wall === "top" || m.wall === "bottom") return s + m.w;
    return s + m.w;
  }, 0);

  const addModule = useCallback((cat: typeof MODULE_CATALOG[0]) => {
    const wallConf = getWallConfig(selectedWall, roomW, roomH);
    const wallMods = modules.filter(m => m.wall === selectedWall);
    const usedLength = wallMods.reduce((s, m) => s + m.w, 0);
    const maxLen = wallConf.max;
    if (usedLength + cat.w > maxLen) return;

    const newMod: PlacedModule = {
      id: `${cat.type}-${Date.now()}`,
      type: cat.type,
      label: cat.label,
      w: cat.w,
      d: cat.d,
      color: cat.color,
      price: cat.price,
      wall: selectedWall,
      pos: usedLength,
    };
    setModules(prev => [...prev, newMod]);
  }, [modules, selectedWall, roomW, roomH]);

  const removeModule = (id: string) => {
    setModules(prev => {
      const idx = prev.findIndex(m => m.id === id);
      if (idx < 0) return prev;
      const wall = prev[idx].wall;
      const removedW = prev[idx].w;
      const removedPos = prev[idx].pos;
      return prev
        .filter(m => m.id !== id)
        .map(m => m.wall === wall && m.pos > removedPos
          ? { ...m, pos: m.pos - removedW }
          : m
        );
    });
    setSelected(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const mod of [...modules].reverse()) {
      const r = moduleScreenRect(mod, roomW, roomH, SCALE);
      if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
        setSelected(mod.id);
        setDragging(mod.id);
        const offset = mod.wall === "left" || mod.wall === "right"
          ? (my - r.y) / SCALE
          : (mx - r.x) / SCALE;
        setDragOffset(offset);
        e.preventDefault();
        return;
      }
    }
    setSelected(null);
  };

  const handleCanvasMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    setModules(prev => {
      const mod = prev.find(m => m.id === dragging);
      if (!mod) return prev;
      const wallConf = getWallConfig(mod.wall, roomW, roomH);
      let rawPos = (mod.wall === "left" || mod.wall === "right")
        ? my / SCALE - dragOffset
        : mx / SCALE - dragOffset;
      rawPos = Math.max(0, Math.min(rawPos, wallConf.max - mod.w));
      const wallMods = prev.filter(m => m.wall === mod.wall && m.id !== dragging);
      let snapped = rawPos;
      for (const other of wallMods) {
        const gap = Math.abs(snapped - (other.pos + other.w));
        if (gap < 0.08) snapped = other.pos + other.w;
        const gap2 = Math.abs(snapped + mod.w - other.pos);
        if (gap2 < 0.08) snapped = other.pos - mod.w;
      }
      snapped = Math.max(0, Math.min(snapped, wallConf.max - mod.w));
      return prev.map(m => m.id === dragging ? { ...m, pos: snapped } : m);
    });
  }, [dragging, dragOffset, roomW, roomH]);

  const handleCanvasMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleCanvasMouseMove);
      window.addEventListener("mouseup", handleCanvasMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleCanvasMouseMove);
        window.removeEventListener("mouseup", handleCanvasMouseUp);
      };
    }
  }, [dragging, handleCanvasMouseMove, handleCanvasMouseUp]);

  const canvasW = roomW * SCALE;
  const canvasH = roomH * SCALE;

  const wallFill: Record<Wall, string> = {
    top: hoverWall === "top" ? "rgba(201,169,110,0.07)" : "transparent",
    bottom: hoverWall === "bottom" ? "rgba(201,169,110,0.07)" : "transparent",
    left: hoverWall === "left" ? "rgba(201,169,110,0.07)" : "transparent",
    right: hoverWall === "right" ? "rgba(201,169,110,0.07)" : "transparent",
  };

  return (
    <div className="font-golos">
      {/* Room size controls */}
      <div className="flex flex-wrap gap-6 mb-8 items-end">
        <div>
          <p className="font-golos text-xs tracking-[0.25em] uppercase mb-2" style={{ color: "rgba(245,239,230,0.4)" }}>Ширина помещения</p>
          <div className="flex items-center gap-3">
            <input type="range" min={2} max={8} step={0.1} value={roomW}
              onChange={e => setRoomW(Number(e.target.value))}
              className="w-32 cursor-pointer" style={{ accentColor: "#C9A96E" }} />
            <span className="font-cormorant text-2xl" style={{ color: "#C9A96E" }}>{roomW.toFixed(1)} м</span>
          </div>
        </div>
        <div>
          <p className="font-golos text-xs tracking-[0.25em] uppercase mb-2" style={{ color: "rgba(245,239,230,0.4)" }}>Глубина помещения</p>
          <div className="flex items-center gap-3">
            <input type="range" min={2} max={6} step={0.1} value={roomH}
              onChange={e => setRoomH(Number(e.target.value))}
              className="w-32 cursor-pointer" style={{ accentColor: "#C9A96E" }} />
            <span className="font-cormorant text-2xl" style={{ color: "#C9A96E" }}>{roomH.toFixed(1)} м</span>
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="font-golos text-xs tracking-[0.25em] uppercase mb-1" style={{ color: "rgba(245,239,230,0.3)" }}>Итого</p>
          <p className="font-cormorant text-3xl font-light" style={{ color: "#C9A96E" }}>{totalPrice.toLocaleString("ru-RU")} ₽</p>
          <p className="font-golos text-xs mt-1" style={{ color: "rgba(245,239,230,0.3)" }}>{modules.length} модулей · {totalWidth.toFixed(1)} м</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        {/* Canvas area */}
        <div>
          {/* Wall selector */}
          <div className="flex gap-2 mb-4">
            {WALL_ORDER.map(wall => (
              <button key={wall}
                onClick={() => setSelectedWall(wall)}
                className="font-golos text-xs px-3 py-1.5 border transition-all duration-200"
                style={{
                  borderColor: selectedWall === wall ? "#C9A96E" : "rgba(255,255,255,0.12)",
                  color: selectedWall === wall ? "#C9A96E" : "rgba(245,239,230,0.45)",
                  background: selectedWall === wall ? "rgba(201,169,110,0.1)" : "transparent",
                  letterSpacing: "0.1em",
                }}>
                {WALL_LABELS[wall]}
              </button>
            ))}
          </div>

          {/* 2D Plan */}
          <div className="relative overflow-auto" style={{ maxWidth: "100%" }}>
            <div
              ref={canvasRef}
              className="relative select-none"
              style={{
                width: canvasW,
                height: canvasH,
                background: "#181818",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: dragging ? "grabbing" : "default",
                minWidth: 200,
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
                `,
                backgroundSize: `${SCALE}px ${SCALE}px`,
              }}
              onMouseDown={handleCanvasMouseDown}
            >
              {/* Room walls */}
              <div className="absolute inset-0" style={{ border: "3px solid rgba(245,239,230,0.2)" }} />

              {/* Wall hover zones */}
              <div className="absolute top-0 left-0 right-0"
                style={{ height: 12, background: wallFill.top, cursor: "pointer", zIndex: 1 }}
                onClick={() => setSelectedWall("top")}
                onMouseEnter={() => setHoverWall("top")}
                onMouseLeave={() => setHoverWall(null)} />
              <div className="absolute bottom-0 left-0 right-0"
                style={{ height: 12, background: wallFill.bottom, cursor: "pointer", zIndex: 1 }}
                onClick={() => setSelectedWall("bottom")}
                onMouseEnter={() => setHoverWall("bottom")}
                onMouseLeave={() => setHoverWall(null)} />
              <div className="absolute top-0 bottom-0 left-0"
                style={{ width: 12, background: wallFill.left, cursor: "pointer", zIndex: 1 }}
                onClick={() => setSelectedWall("left")}
                onMouseEnter={() => setHoverWall("left")}
                onMouseLeave={() => setHoverWall(null)} />
              <div className="absolute top-0 bottom-0 right-0"
                style={{ width: 12, background: wallFill.right, cursor: "pointer", zIndex: 1 }}
                onClick={() => setSelectedWall("right")}
                onMouseEnter={() => setHoverWall("right")}
                onMouseLeave={() => setHoverWall(null)} />

              {/* Dimension labels */}
              <div className="absolute flex items-center justify-center"
                style={{ top: -22, left: 0, width: canvasW, fontSize: 11, color: "rgba(201,169,110,0.7)", fontFamily: "Golos Text, sans-serif", letterSpacing: "0.1em" }}>
                {roomW.toFixed(1)} м
              </div>
              <div className="absolute flex items-center justify-center"
                style={{ left: -28, top: 0, height: canvasH, width: 24, writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 11, color: "rgba(201,169,110,0.7)", fontFamily: "Golos Text, sans-serif", letterSpacing: "0.1em" }}>
                {roomH.toFixed(1)} м
              </div>

              {/* Wall active indicator */}
              {selectedWall === "top" && (
                <div className="absolute top-0 left-0 right-0" style={{ height: 3, background: "#C9A96E", zIndex: 2 }} />
              )}
              {selectedWall === "bottom" && (
                <div className="absolute bottom-0 left-0 right-0" style={{ height: 3, background: "#C9A96E", zIndex: 2 }} />
              )}
              {selectedWall === "left" && (
                <div className="absolute top-0 bottom-0 left-0" style={{ width: 3, background: "#C9A96E", zIndex: 2 }} />
              )}
              {selectedWall === "right" && (
                <div className="absolute top-0 bottom-0 right-0" style={{ width: 3, background: "#C9A96E", zIndex: 2 }} />
              )}

              {/* Modules */}
              {modules.map(mod => {
                const r = moduleScreenRect(mod, roomW, roomH, SCALE);
                const isSelected = selected === mod.id;
                const isWall = mod.type.startsWith("wall-");
                return (
                  <div
                    key={mod.id}
                    style={{
                      position: "absolute",
                      left: r.x,
                      top: r.y,
                      width: r.w,
                      height: r.h,
                      background: isWall
                        ? "rgba(70,70,100,0.7)"
                        : `${mod.color}ee`,
                      border: isSelected
                        ? "2px solid #C9A96E"
                        : "1px solid rgba(201,169,110,0.25)",
                      cursor: "grab",
                      zIndex: isSelected ? 10 : 5,
                      boxShadow: isSelected ? "0 0 0 1px rgba(201,169,110,0.4), inset 0 0 10px rgba(201,169,110,0.1)" : "none",
                      transition: dragging === mod.id ? "none" : "box-shadow 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    {/* Wood grain lines */}
                    {!isWall && Array.from({ length: Math.floor(r.w / 8) }).map((_, i) => (
                      <div key={i} style={{
                        position: "absolute",
                        top: 0, bottom: 0,
                        left: i * 8 + 4,
                        width: 1,
                        background: "rgba(255,255,255,0.04)",
                      }} />
                    ))}
                    <span style={{
                      fontSize: Math.min(r.w, r.h) > 30 ? 9 : 7,
                      color: "rgba(201,169,110,0.8)",
                      fontFamily: "Golos Text, sans-serif",
                      letterSpacing: "0.05em",
                      textAlign: "center",
                      padding: "2px",
                      lineHeight: 1.2,
                      zIndex: 1,
                      pointerEvents: "none",
                    }}>
                      {mod.label}
                    </span>
                    <span style={{
                      fontSize: 7,
                      color: "rgba(245,239,230,0.3)",
                      fontFamily: "Golos Text, sans-serif",
                      zIndex: 1,
                      pointerEvents: "none",
                    }}>
                      {mod.w * 100}см
                    </span>
                  </div>
                );
              })}

              {/* Center label */}
              {modules.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ pointerEvents: "none" }}>
                  <Icon name="MousePointer2" size={24} style={{ color: "rgba(245,239,230,0.1)" }} />
                  <p className="font-golos text-xs mt-2" style={{ color: "rgba(245,239,230,0.15)", letterSpacing: "0.1em" }}>
                    Выберите стену и добавьте модули
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Scale note */}
          <div className="flex items-center gap-3 mt-3">
            <div style={{ width: SCALE, height: 1, background: "rgba(201,169,110,0.4)" }} />
            <span className="font-golos text-xs" style={{ color: "rgba(245,239,230,0.3)" }}>1 метр</span>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Module list */}
          <div>
            <p className="font-golos text-xs tracking-[0.25em] uppercase mb-3" style={{ color: "rgba(245,239,230,0.4)" }}>
              Добавить модуль → {WALL_LABELS[selectedWall]} стена
            </p>
            <div className="space-y-1">
              {MODULE_CATALOG.map(cat => {
                const wallConf = getWallConfig(selectedWall, roomW, roomH);
                const used = modules.filter(m => m.wall === selectedWall).reduce((s, m) => s + m.w, 0);
                const canAdd = used + cat.w <= wallConf.max;
                return (
                  <button
                    key={cat.type}
                    onClick={() => addModule(cat)}
                    disabled={!canAdd}
                    className="w-full flex items-center justify-between px-3 py-2.5 border transition-all duration-200 text-left"
                    style={{
                      borderColor: canAdd ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                      background: "transparent",
                      opacity: canAdd ? 1 : 0.35,
                      cursor: canAdd ? "pointer" : "not-allowed",
                    }}
                    onMouseEnter={e => { if (canAdd) e.currentTarget.style.borderColor = "#C9A96E"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = canAdd ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"; }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon name={cat.icon as string} fallback="Square" size={13} style={{ color: "#C9A96E", opacity: 0.8 }} />
                      <span className="font-golos text-xs" style={{ color: "rgba(245,239,230,0.75)" }}>{cat.label}</span>
                      <span className="font-golos text-xs" style={{ color: "rgba(245,239,230,0.3)" }}>{cat.w * 100}см</span>
                    </div>
                    <span className="font-cormorant text-sm" style={{ color: "#C9A96E" }}>
                      {cat.price.toLocaleString("ru-RU")} ₽
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected module */}
          {selected && (() => {
            const mod = modules.find(m => m.id === selected);
            if (!mod) return null;
            return (
              <div className="p-4" style={{ border: "1px solid rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.04)" }}>
                <p className="font-golos text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(245,239,230,0.4)" }}>Выбранный элемент</p>
                <p className="font-cormorant text-xl" style={{ color: "#F5EFE6" }}>{mod.label}</p>
                <p className="font-golos text-xs mt-1" style={{ color: "rgba(245,239,230,0.4)" }}>
                  {mod.w * 100} × {mod.d * 100} см · {WALL_LABELS[mod.wall]} стена
                </p>
                <p className="font-cormorant text-lg mt-2" style={{ color: "#C9A96E" }}>{mod.price.toLocaleString("ru-RU")} ₽</p>
                <button
                  onClick={() => removeModule(mod.id)}
                  className="flex items-center gap-2 mt-3 font-golos text-xs transition-colors duration-200"
                  style={{ color: "rgba(245,239,230,0.35)", letterSpacing: "0.1em" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ff6b6b")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,239,230,0.35)")}>
                  <Icon name="Trash2" size={12} />
                  Удалить модуль
                </button>
              </div>
            );
          })()}

          {/* Plan summary */}
          {modules.length > 0 && (
            <div className="p-4" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
              <p className="font-golos text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(245,239,230,0.3)" }}>Состав</p>
              {WALL_ORDER.map(wall => {
                const wMods = modules.filter(m => m.wall === wall);
                if (!wMods.length) return null;
                return (
                  <div key={wall} className="mb-2">
                    <p className="font-golos text-xs mb-1" style={{ color: "rgba(245,239,230,0.4)", letterSpacing: "0.08em" }}>
                      {WALL_LABELS[wall]}:
                    </p>
                    {wMods.map(m => (
                      <div key={m.id} className="flex justify-between">
                        <span className="font-golos text-xs" style={{ color: "rgba(245,239,230,0.55)" }}>— {m.label}</span>
                        <span className="font-golos text-xs" style={{ color: "rgba(201,169,110,0.7)" }}>{m.price.toLocaleString("ru-RU")} ₽</span>
                      </div>
                    ))}
                  </div>
                );
              })}
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex justify-between">
                  <span className="font-golos text-xs uppercase tracking-wider" style={{ color: "rgba(245,239,230,0.4)" }}>Итого</span>
                  <span className="font-cormorant text-lg" style={{ color: "#C9A96E" }}>{totalPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>
            </div>
          )}

          <button
            className="gold-fill-btn w-full text-center block"
            style={{ paddingTop: "0.875rem", paddingBottom: "0.875rem" }}>
            Заказать по проекту
          </button>
          <p className="font-golos text-xs text-center" style={{ color: "rgba(245,239,230,0.2)" }}>
            Перезвоним и уточним детали
          </p>
        </div>
      </div>
    </div>
  );
}
