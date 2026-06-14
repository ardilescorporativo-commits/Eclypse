import { useState, useEffect, useCallback, useRef } from "react";
import * as Lucide from "lucide-react";

const S = {
  get: async (k) => { 
    try { 
      const r = localStorage.getItem(k); 
      return r ? JSON.parse(r) : null; 
    } catch { return null; } 
  },
  set: async (k, v) => { 
    try { 
      localStorage.setItem(k, JSON.stringify(v)); 
    } catch {} 
  },
};

const T = {
  bg:"#08080D",    surface:"#0E0E16",   card:"#13131C",   border:"#1A1A28",
  gold:"#FF3B5C",  goldSoft:"#FF3B5C15", goldBright:"#FF6680",
  green:"#00E5A0", greenSoft:"#00E5A015",
  amber:"#FFB800", amberSoft:"#FFB80015",
  blue:"#4D9FFF",  blueSoft:"#4D9FFF15",
  purple:"#9B6DFF",purpleSoft:"#9B6DFF15",
  text:"#EEEEF5",  muted:"#5A5A78",     dim:"#1C1C28",
  red:"#FF3B5C",   redSoft:"#FF3B5C15",
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const fmt$ = (n) => "$"+toNum(n).toLocaleString("es",{minimumFractionDigits:0,maximumFractionDigits:0});
const fmtN = (n) => toNum(n).toLocaleString("es");
const toNum = (v) => { const n = parseFloat(String(v ?? 0).replace(/[^0-9.-]/g,"")); return isNaN(n)?0:n; };
const pct = (a, b) => b ? Math.round((toNum(a) / toNum(b)) * 100) : 0;
const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const monthLabel = (ym) => { if (!ym) return ""; const [y,m] = ym.split("-"); return `${months[+m-1]} ${y}`; };
const thisMonth = () => new Date().toISOString().slice(0,7);
const getMonth = (d) => (d||"").slice(0,7);

export default function App() {

const SEED = {
  clients:[
    { id:"c1", name:"Dani", niche:"Wellness", ig:"@dani_wellness", followers:"28K", startDate:"2026-04-01", revShare:30, onboardingFee:1200, status:"active", avatar:"D", photo:null,
      angles:["Educación problema","Lista de síntomas","Curiosidad + problema","Prueba social","Objeción directa","Resultado cliente","Contrarian","Rutina / día a día"],
      pains:["Inflamación crónica","Sistema nervioso","Fatiga crónica","Ansiedad alimentaria","Falta de energía","Sobrepeso","Estrés crónico","Insomnio"],
      buyReasons:["Resultado transformación","Contenido educativo","Urgencia / dolor fuerte","Prueba social / testimonio","Recomendación","Precio / oferta","Seguimiento persistente"],
      programs:["Plan Esencial","Plan Premium 3M","Plan Transformación 6M","Membresía Mensual"],
      objections:["Precio","Ahora no es buen momento","Consultar con su pareja","Miedo a no cumplirse","Viaje / evento próximo","Desconfianza por malas experiencias","Quiere acompañamiento presencial","Comparando otros programas","Tengo que pensarlo","Pagaré en X fecha","Sin objeción"],
    },
  ],
  content:[
    { id:"ct1", clientId:"c1", date:"2026-06-09", type:"Reel", topic:"Por qué tienes antojos por la noche", angle:"Curiosidad + problema", pain:"Ansiedad alimentaria", reach:31200, saves:890, shares:445, comments:112, followers_gained:234, leadsGenerated:22, salesLinked:9, revenue:1530, cashCollected:1530 },
    { id:"ct2", clientId:"c1", date:"2026-06-03", type:"Carrusel", topic:"5 señales de inflamación crónica", angle:"Lista de síntomas", pain:"Inflamación crónica", reach:9200, saves:540, shares:201, comments:63, followers_gained:89, leadsGenerated:14, salesLinked:5, revenue:870, cashCollected:870 },
    { id:"ct3", clientId:"c1", date:"2026-06-06", type:"Historia", topic:"Testimonio cliente", angle:"Prueba social", pain:"Falta de energía", reach:4100, saves:0, shares:12, comments:28, followers_gained:22, leadsGenerated:6, salesLinked:3, revenue:510, cashCollected:510 },
    { id:"ct4", clientId:"c1", date:"2026-06-01", type:"Reel", topic:"Síntomas del sistema nervioso sobreactivado", angle:"Educación problema", pain:"Sistema nervioso", reach:18400, saves:312, shares:89, comments:47, followers_gained:145, leadsGenerated:8, salesLinked:2, revenue:340, cashCollected:340 },
    { id:"ct5", clientId:"c1", date:"2026-05-15", type:"Carrusel", topic:"Cómo bajar la inflamación sin dieta", angle:"Contrarian", pain:"Inflamación crónica", reach:12400, saves:620, shares:180, comments:54, followers_gained:112, leadsGenerated:11, salesLinked:4, revenue:680, cashCollected:680 },
    { id:"ct6", clientId:"c1", date:"2026-05-08", type:"Reel", topic:"La raíz del cansancio crónico", angle:"Educación problema", pain:"Fatiga crónica", reach:22100, saves:710, shares:320, comments:88, followers_gained:198, leadsGenerated:17, salesLinked:7, revenue:1190, cashCollected:1190 },
  ],
  leads:[
    { id:"l1", clientId:"c1", name:"Ana López", source:"Reel Jun 9", stage:"conversación", firstContactDate:"2026-06-09", scheduledDate:"", date:"2026-06-09", showedUp:null, notes:"Interesada en plan 3 meses", saleAmount:0, cashCollected:0, isUpsell:false, isResell:false, paymentType:"", buyReason:"", program:"", callLink:"", objection:"" },
    { id:"l2", clientId:"c1", name:"María García", source:"Carrusel Jun 3", stage:"cerrado", firstContactDate:"2026-06-04", scheduledDate:"2026-06-06", date:"2026-06-04", showedUp:true, notes:"Plan básico", saleAmount:97, cashCollected:97, isUpsell:false, isResell:false, paymentType:"Upfront", buyReason:"Resultado transformación", program:"Plan Esencial", callLink:"", objection:"Sin objeción" },
    { id:"l3", clientId:"c1", name:"Sofia Ruiz", source:"Reel Jun 9", stage:"no-show", firstContactDate:"2026-06-10", scheduledDate:"2026-06-11", date:"2026-06-10", showedUp:false, notes:"", saleAmount:0, cashCollected:0, isUpsell:false, isResell:false, paymentType:"", buyReason:"", program:"", callLink:"", objection:"Ahora no es buen momento" },
    { id:"l4", clientId:"c1", name:"Carla Vega", source:"Historia Jun 6", stage:"cerrado", firstContactDate:"2026-06-07", scheduledDate:"2026-06-09", date:"2026-06-07", showedUp:true, notes:"Plan premium", saleAmount:197, cashCollected:197, isUpsell:false, isResell:false, paymentType:"2 cuotas", buyReason:"Contenido educativo", program:"Plan Premium 3M", callLink:"", objection:"Sin objeción" },
    { id:"l5", clientId:"c1", name:"Luisa Mora", source:"Carrusel Jun 3", stage:"llamada agendada", firstContactDate:"2026-06-11", scheduledDate:"2026-06-13", date:"2026-06-11", showedUp:true, notes:"Call mañana", saleAmount:0, cashCollected:0, isUpsell:false, isResell:false, paymentType:"", buyReason:"", program:"Plan Esencial", callLink:"https://cal.com/dani/consulta", objection:"" },
    { id:"l6", clientId:"c1", name:"Patricia Díaz", source:"Reel Jun 1", stage:"cerrado", firstContactDate:"2026-06-03", scheduledDate:"2026-06-05", date:"2026-06-03", showedUp:true, notes:"Upsell 6 meses", saleAmount:347, cashCollected:347, isUpsell:true, isResell:false, paymentType:"3 cuotas", buyReason:"Urgencia / dolor fuerte", program:"Plan Transformación 6M", callLink:"", objection:"Sin objeción" },
    { id:"l7", clientId:"c1", name:"Fernanda Ríos", source:"Reel Jun 9", stage:"nuevo lead", firstContactDate:"2026-06-10", scheduledDate:"", date:"2026-06-10", showedUp:null, notes:"", saleAmount:0, cashCollected:0, isUpsell:false, isResell:false, paymentType:"", buyReason:"", program:"", callLink:"", objection:"" },
    { id:"l8", clientId:"c1", name:"Valentina Cruz", source:"Carrusel Jun 3", stage:"no-show", firstContactDate:"2026-06-05", scheduledDate:"2026-06-07", date:"2026-06-05", showedUp:false, notes:"", saleAmount:0, cashCollected:0, isUpsell:false, isResell:false, paymentType:"", buyReason:"", program:"", callLink:"", objection:"Precio" },
  ],
  dailyChats:[
    { id:"dc1", clientId:"c1", date:"2026-06-09", uniqueChats:8, conversations:5, scheduled:2 },
    { id:"dc2", clientId:"c1", date:"2026-06-10", uniqueChats:6, conversations:4, scheduled:1 },
    { id:"dc3", clientId:"c1", date:"2026-06-11", uniqueChats:5, conversations:3, scheduled:2 },
  ],
  products:[
    { id:"p1", clientId:"c1", name:"Plan Esencial", price:97, type:"one-time", sales:8, active:true },
    { id:"p2", clientId:"c1", name:"Plan Premium 3M", price:197, type:"one-time", sales:4, active:true },
    { id:"p3", clientId:"c1", name:"Plan Transformación 6M", price:347, type:"one-time", sales:2, active:true },
    { id:"p4", clientId:"c1", name:"Membresía Mensual", price:37, type:"recurring", sales:11, active:true },
  ],
  billing:[
    { id:"b1", clientId:"c1", month:"2026-04", totalRevenue:1820, cashCollected:1820, revShare:30, revShareEarned:546, revShareCollected:true, notes:"" },
    { id:"b2", clientId:"c1", month:"2026-05", totalRevenue:2640, cashCollected:2640, revShare:30, revShareEarned:792, revShareCollected:true, notes:"" },
    { id:"b3", clientId:"c1", month:"2026-06", totalRevenue:3250, cashCollected:1820, revShare:30, revShareEarned:975, revShareCollected:false, notes:"" },
  ],
};

const LEAD_STAGES = [
  { id:"nuevo lead",        label:"Nuevo Lead",         color:T.blue },
  { id:"conversación",      label:"Conversación",       color:"#5B9BD5" },
  { id:"llamada agendada",  label:"Llamada Agendada",   color:T.purple },
  { id:"cerrado",           label:"Cerrado ✓",          color:T.green },
  { id:"seguimiento",       label:"Seguimiento",        color:T.gold },
  { id:"pendiente de pago", label:"Pendiente de Pago",  color:T.amber },
  { id:"no-show",           label:"No Show",            color:"#666680" },
  { id:"perdido",           label:"Perdido",            color:"#CC4444" },
];
const CONTENT_TYPES = ["Reel","Carrusel","Historia","Post","YouTube","Live"];

const NAV = [
  { id:"overview", icon:"◉", label:"Overview" },
  { id:"content",  icon:"✦", label:"Content Lab" },
  { id:"sales",    icon:"◈", label:"Ventas" },
  { id:"products", icon:"▣", label:"Productos" },
  { id:"billing",  icon:"◧", label:"Facturación" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:#08080D;color:${T.text};font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.5}
  ::-webkit-scrollbar{width:3px;height:3px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:${T.dim};border-radius:2px}
  input,select,textarea{background:${T.surface};border:1px solid ${T.border};color:${T.text};border-radius:8px;padding:9px 13px;font-family:'DM Sans',sans-serif;font-size:13px;outline:none;width:100%;transition:border-color .15s}
  input:focus,select:focus,textarea:focus{border-color:#FF3B5C}
  textarea{resize:vertical;min-height:80px}
  option{background:${T.card}}
  button{cursor:pointer;font-family:'DM Sans',sans-serif;border:none;border-radius:8px;transition:all .15s;font-weight:500}
  .syne{font-family:'Syne',sans-serif}
  .mono{font-family:'DM Mono',monospace}
  input[type=file]{display:none}
  @keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  .view-enter{animation:fadeSlideIn 0.22s ease forwards}
`;

const Tag = ({ color=T.muted, children, size="sm" }) => (
  <span style={{ background:color+"20", color,border:`1px solid ${color}35`,borderRadius:6,padding:size==="sm"?"2px 8px":"4px 12px",fontSize:size==="sm"?11:12,fontWeight:600,whiteSpace:"nowrap",letterSpacing:"0.03em" }}>{children}</span>
);
const Chip = ({ label, value, color=T.muted }) => (
  <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
    <span style={{ fontSize:18,fontWeight:700, color,fontFamily:"DM Mono,monospace" }}>{value}</span>
    <span style={{ fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em" }}>{label}</span>
  </div>
);
const KPI = ({ label, value, sub, color=T.gold, accent=false }) => (
  <div style={{ background:accent?color+"12":T.card,border:`1px solid ${accent?color+"30":T.border}`,borderRadius:12,padding:"16px 18px", borderLeft:accent?`3px solid ${color}`:`1px solid ${T.border}` }}>
    <div style={{ fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6 }}>{label}</div>
    <div style={{ fontSize:24,fontWeight:700, color,fontFamily:"DM Mono,monospace",lineHeight:1 }}>{value}</div>
    {sub&&<div style={{ fontSize:11,color:T.muted,marginTop:5 }}>{sub}</div>}
  </div>
);
const Btn = ({ onClick, children, variant="primary", size="md", full=false, style:sx={} }) => {
  const pad=size==="sm"?"5px 12px":size==="lg"?"12px 24px":"9px 18px", fs=size==="sm"?12:14;
  const v={ primary:{background:`linear-gradient(135deg,${T.gold},${T.goldBright})`,color:"#0a0a0f",fontWeight:700}, ghost:{background:"transparent",color:T.muted,border:`1px solid ${T.border}`}, subtle:{background:T.dim,color:T.text}, success:{background:T.greenSoft,color:T.green,border:`1px solid ${T.green}35`}, danger:{background:"#CC222222",color:"#CC4444",border:"1px solid #CC444435"}, amber:{background:T.amberSoft,color:T.amber,border:`1px solid ${T.amber}35`} };
  return <button onClick={onClick} style={{ padding:pad,fontSize:fs,width:full?"100%":"auto", ...v[variant], ...sx }}>{children}</button>;
};
const Divider = ({ label }) => (
  <div style={{ display:"flex",alignItems:"center",gap:12,margin:"6px 0" }}>
    <div style={{ flex:1,height:1,background:T.border }} />
    {label&&<span style={{ fontSize:10,color:T.gold,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:600 }}>{label}</span>}
    <div style={{ flex:1,height:1,background:T.border }} />
  </div>
);
const Modal = ({ title, onClose, width=560, children }) => (
  <div style={{ position:"absolute",inset:0,background:"#000000DD",zIndex:999,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"60px 20px 20px" }} onClick={onClose}>
    <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:28,width:"100%",maxWidth:width,maxHeight:"80vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
        <span className="syne" style={{ fontSize:17,fontWeight:800 }}>{title}</span>
        <button onClick={onClose} style={{ background:T.dim,border:"none",color:T.muted,width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:16 }}>×</button>
      </div>
      {children}
    </div>
  </div>
);
const Row = ({ children, gap=12, cols }) => {
  const count = cols || (Array.isArray(children)?children.length:1);
  return <div style={{ display:"grid",gridTemplateColumns:`repeat(${count},1fr)`, gap }}>{children}</div>;
};
const Field = ({ label, children }) => (
  <div><label style={{ fontSize:11,color:T.muted, display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em" }}>{label}</label>{children}</div>
);
const ProgressBar = ({ value, max, color=T.gold }) => {
  const p = max?Math.min(100,Math.round((value/max)*100)):0;
  return (
    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
      <div style={{ flex:1,height:5,background:T.surface,borderRadius:3,overflow:"hidden" }}>
        <div style={{ width:`${p}%`,height:"100%",background:color,borderRadius:3 }}/>
      </div>
      <span style={{ fontSize:11,color:T.muted,fontFamily:"DM Mono",width:30,textAlign:"right" }}>{p}%</span>
    </div>
  );
};
const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ display:"flex",gap:4,background:T.surface,borderRadius:10,padding:4,border:`1px solid ${T.border}` }}>
    {tabs.map(t=>(
      <button key={t.id} onClick={()=>onChange(t.id)} style={{ padding:"6px 14px",borderRadius:7,background:active===t.id?T.red:"transparent",color:active===t.id?"#fff":T.muted,fontSize:12,fontWeight:active===t.id?600:400,border:"none" }}>{t.label}</button>
    ))}
  </div>
);
const MonthPicker = ({ value, onChange, label="Mes" }) => (
  <Field label={label}><input type="month" value={value} onChange={e=>onChange(e.target.value)} /></Field>
);

function ListEditor({ title, items, onChange, onClose }) {
  const [list, setList] = useState([...items]);
  const [newItem, setNewItem] = useState("");
  const add = () => { if (newItem.trim()) { setList(p=>[...p,newItem.trim()]); setNewItem(""); } };
  const remove = (i) => setList(p=>p.filter((_,j)=>j!==i));
  return (
    <Modal title={title} onClose={onClose} width={420}>
      <div style={{ display:"flex",gap:8,marginBottom:16 }}>
        <input value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Agregar nuevo..." style={{ flex:1 }}/>
        <Btn onClick={add}>+</Btn>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:6,marginBottom:20, maxHeight:280,overflowY:"auto" }}>
        {list.map((item,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",gap:8,background:T.surface,borderRadius:8,padding:"8px 12px" }}>
            <span style={{ flex:1,fontSize:13 }}>{item}</span>
            <button onClick={()=>remove(i)} style={{ background:"none",border:"none",color:"#CC5555",cursor:"pointer",fontSize:16 }}>×</button>
          </div>
        ))}
      </div>
      <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={()=>{ onChange(list); onClose(); }}>Guardar</Btn>
      </div>
    </Modal>
  );
}

const EclypseIcon = ({size=22}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="corona" cx="72%" cy="28%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95"/>
        <stop offset="25%" stopColor="#FFE8A0" stopOpacity="0.7"/>
        <stop offset="55%" stopColor="#FF9040" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#FF3B5C" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="moonSurface" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1A1A24"/>
        <stop offset="100%" stopColor="#08080D"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="1.2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="20" cy="20" r="19" fill="url(#corona)"/>
    <circle cx="17" cy="20" r="14.5" fill="url(#moonSurface)"/>
    <path d="M23 6.5 C30 9 35 14 35 20 C35 26 30 31 23 33.5" stroke="white" strokeWidth="1.2" fill="none" opacity="0.9" filter="url(#glow)"/>
    <path d="M26 8.5 C32 11.5 36 15.5 36 20 C36 24.5 32 28.5 26 31.5" stroke="#FFE8A0" strokeWidth="0.6" fill="none" opacity="0.6"/>
    <path d="M28.5 11 C33.5 14 37 17 37 20 C37 23 33.5 26 28.5 29" stroke="#FF9040" strokeWidth="0.35" fill="none" opacity="0.4"/>
    <circle cx="17" cy="20" r="14.5" fill="none" stroke="white" strokeWidth="0.4" opacity="0.15"/>
  </svg>
);

function ClientAvatar({ client, size=40, onClick }) {
  if (client.photo) return (
    <div onClick={onClick} style={{ width:size,height:size,borderRadius:size/4,overflow:"hidden",cursor:onClick?"pointer":"default",flexShrink:0 }}>
      <img src={client.photo} alt={client.name} style={{ width:"100%",height:"100%", objectFit:"cover" }}/>
    </div>
  );
  return (
    <div onClick={onClick} style={{ width:size,height:size,borderRadius:size/4,background:T.red, display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.4,fontWeight:800,color:"#fff",fontFamily:"Syne",cursor:onClick?"pointer":"default",flexShrink:0 }}>
      {client.avatar||client.name[0]}
    </div>
  );
}

function ClientBar({ clients, selected, onSelect, onAdd, onEdit, showAll, onToggleAll }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", niche:"Wellness", ig:"", followers:"", revShare:30, onboardingFee:1000, startDate:new Date().toISOString().split("T")[0], status:"active", avatar:"", photo:null });
  const photoRef = useRef();

  const handlePhoto = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(p=>({...p, photo:ev.target.result}));
    reader.readAsDataURL(file);
  };
  const save = () => {
    if(!form.name) return;
    onAdd({...form, id:uid(), avatar:form.name[0].toUpperCase()});
    setShowForm(false);
    setForm({ name:"", niche:"Wellness", ig:"", followers:"", revShare:30, onboardingFee:1000, startDate:new Date().toISOString().split("T")[0], status:"active", avatar:"", photo:null });
  };

  return (
    <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:20,flexWrap:"wrap" }}>
      {onToggleAll && (
      <button onClick={onToggleAll} style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 14px",borderRadius:10,background:showAll?T.goldSoft:T.surface,border:`1px solid ${showAll?T.gold+"50":T.border}`,color:showAll?T.gold:T.muted,cursor:"pointer",fontSize:12,fontWeight:600 }}>
        ◈ General
      </button>
      )}
      {clients.map(c=>(
        <button key={c.id} onClick={()=>onSelect(c.id)} style={{ display:"flex",alignItems:"center",gap:10,padding:"7px 14px",borderRadius:10,background:(!showAll&&selected===c.id)?T.redSoft:T.surface,border:`1px solid ${(!showAll&&selected===c.id)?T.red+"50":T.border}`,color:(!showAll&&selected===c.id)?T.red:T.text,cursor:"pointer" }}>
          <ClientAvatar client={c} size={24}/>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontWeight:600,fontSize:12 }}>{c.name}</div>
            <div style={{ fontSize:10,color:T.muted }}>{c.niche}</div>
          </div>
          <button onClick={e=>{e.stopPropagation();onEdit(c);}} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:12, marginLeft:4 }}>✎</button>
        </button>
      ))}
      <Btn variant="ghost" size="sm" onClick={()=>setShowForm(true)}>+ Cliente</Btn>

      {showForm&&(
        <Modal title="Nuevo cliente" onClose={()=>setShowForm(false)}>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <div style={{ display:"flex",gap:16,alignItems:"center" }}>
              <div onClick={()=>photoRef.current.click()} style={{ width:60,height:60,borderRadius:10,background:form.photo?"transparent":T.dim,border:`2px dashed ${T.border}`,cursor:"pointer",overflow:"hidden", display:"flex",alignItems:"center",justifyContent:"center",color:T.muted,fontSize:22,flexShrink:0 }}>
                {form.photo?<img src={form.photo} style={{ width:"100%",height:"100%", objectFit:"cover" }}/>:"📷"}
              </div>
              <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto}/>
              <Field label="Nombre"><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Nombre del cliente"/></Field>
            </div>
            <Row><Field label="Nicho"><input value={form.niche} onChange={e=>setForm(p=>({...p,niche:e.target.value}))}/></Field><Field label="Instagram"><input value={form.ig} onChange={e=>setForm(p=>({...p,ig:e.target.value}))} placeholder="@handle"/></Field></Row>
            <Row><Field label="Seguidores"><input value={form.followers} onChange={e=>setForm(p=>({...p,followers:e.target.value}))} placeholder="28K"/></Field><Field label="Rev. Share (%)"><input type="number" value={form.revShare} onChange={e=>setForm(p=>({...p,revShare:+e.target.value}))}/></Field></Row>
            <Row><Field label="Onboarding ($)"><input type="number" value={form.onboardingFee} onChange={e=>setForm(p=>({...p,onboardingFee:+e.target.value}))}/></Field><Field label="Fecha inicio"><input type="date" value={form.startDate} onChange={e=>setForm(p=>({...p,startDate:e.target.value}))}/></Field></Row>
            <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
              <Btn variant="ghost" onClick={()=>setShowForm(false)}>Cancelar</Btn>
              <Btn onClick={save}>Agregar cliente</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function RevenueChart({ allBilling, clients }) {
  const allMonths = [...new Set(allBilling.map(b=>b.month))].filter(Boolean).sort();
  const labels = allMonths.map(m => { const [y,mo]=m.split("-"); return ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][+mo-1]+"'"+y.slice(2); });
  const revData = allMonths.map(m => allBilling.filter(b=>b.month===m).reduce((a,b)=>a+toNum(b.totalRevenue),0));
  const cashData = allMonths.map(m => allBilling.filter(b=>b.month===m).reduce((a,b)=>a+toNum(b.cashCollected),0));
  const COLORS = ["#FF3B5C","#00E5A0","#4D9FFF","#9B6DFF","#FFB800"];
  const clientRevs = clients.map((c,i) => ({ name:c.name, rev:allBilling.filter(b=>b.clientId===c.id).reduce((a,b)=>a+toNum(b.totalRevenue),0),color:COLORS[i%COLORS.length] }));
  const totalRev = clientRevs.reduce((a,c)=>a+c.rev,0);
  const hasData = allBilling.length > 0;

  const barRef = useChartJS((Chart, canvas) => new Chart(canvas, {
    type:"bar",
    data:{ labels, datasets:[
      { label:"Revenue", data:revData, backgroundColor:"#FF3B5C22", borderColor:"#FF3B5C", borderWidth:2,borderRadius:5, order:2 },
      { label:"Cash collected", data:cashData, type:"line", borderColor:"#00E5A0", backgroundColor:"#00E5A015", borderWidth:2, pointBackgroundColor:"#00E5A0", pointRadius:4, tension:0.4, fill:true, order:1 },
    ]},
    options:{ responsive:true, maintainAspectRatio:false, interaction:{mode:"index",intersect:false},
      plugins:{ legend:{display:false}, tooltip:{backgroundColor:"#13131C",titleColor:"#EEEEF5",bodyColor:"#5A5A78",borderColor:"#1A1A28",borderWidth:1,padding:10,callbacks:{label:ctx=>` ${ctx.dataset.label}: $${Math.round(ctx.raw).toLocaleString("es")}`}} },
      scales:{ x:{grid:{color:"#1A1A28"},ticks:{color:"#5A5A78",font:{size:10}}}, y:{grid:{color:"#1A1A28"},ticks:{color:"#5A5A78",font:{size:10},callback:v=>"$"+v.toLocaleString("es")},beginAtZero:true} }
    }
  }), [allBilling.length, allBilling.map(b=>b.totalRevenue+b.cashCollected).join()]);

  const donutRef = useChartJS((Chart, canvas) => {
    if (!clientRevs.some(c=>c.rev>0)) return null;
    return new Chart(canvas, {
      type:"doughnut",
      data:{ labels:clientRevs.map(c=>c.name), datasets:[{ data:clientRevs.map(c=>c.rev), backgroundColor:COLORS.slice(0,clients.length), borderColor:"#13131C", borderWidth:3, hoverOffset:6 }] },
      options:{ responsive:true, maintainAspectRatio:false, cutout:"68%",
        plugins:{ legend:{display:false}, tooltip:{backgroundColor:"#13131C",titleColor:"#EEEEF5",bodyColor:"#5A5A78",borderColor:"#1A1A28",borderWidth:1,padding:10,callbacks:{label:ctx=>` $${Math.round(ctx.raw).toLocaleString("es")}`}} }
      }
    });
  }, [allBilling.length, clients.length]);

  return (
    <div style={{ display:"grid",gridTemplateColumns:"1fr 260px",gap:16 }}>
      <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
          <div style={{ fontWeight:600,fontSize:13 }}>Revenue mensual</div>
          <div style={{ display:"flex",gap:14 }}>
            {[["Revenue","#FF3B5C"],["Cash","#00E5A0"]].map(([l,c])=>(
              <div key={l} style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#5A5A78" }}>
                <div style={{ width:8,height:8,borderRadius:2,background:c }}/>{l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position:"relative",height:200 }}>
          {hasData
            ? <canvas ref={barRef} role="img" aria-label="Revenue mensual vs cash collected"/>
            : <EmptyChart icon="📊" title="Sin meses registrados" hint="Ve a Facturación y registra los meses para ver la curva" height={180}/>
          }
        </div>
      </div>
      <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px" }}>
        <div style={{ fontWeight:600,fontSize:13,marginBottom:14 }}>Revenue por cliente</div>
        <div style={{ position:"relative",height:140 }}>
          {clientRevs.some(c=>c.rev>0)
            ? <canvas ref={donutRef} role="img" aria-label="Revenue por cliente"/>
            : <EmptyChart icon="🍩" title="Sin revenue aún" hint="Registra meses en Facturación" height={120}/>
          }
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:7,marginTop:12 }}>
          {clientRevs.map(c=>(
            <div key={c.name} style={{ display:"flex",alignItems:"center",gap:7 }}>
              <div style={{ width:7,height:7,borderRadius:"50%",background:c.color,flexShrink:0 }}/>
              <span style={{ flex:1,fontSize:11,color:"#EEEEF5" }}>{c.name}</span>
              <span style={{ fontSize:11,color:c.color,fontFamily:"DM Mono,monospace",fontWeight:600 }}>{fmt$(c.rev)}</span>
              <span style={{ fontSize:10,color:"#5A5A78" }}>{totalRev?Math.round(c.rev/totalRev*100):0}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SalesBarChart({ clientSalesData }) {
  const ref = useChartJS((Chart, canvas) => new Chart(canvas, {
    type:"bar",
    data:{ labels:clientSalesData.map(c=>c.name), datasets:[
      { label:"Leads", data:clientSalesData.map(c=>c.leads), backgroundColor:"#4D9FFF22", borderColor:"#4D9FFF", borderWidth:2,borderRadius:4 },
      { label:"Ventas", data:clientSalesData.map(c=>c.ventas), backgroundColor:"#00E5A022", borderColor:"#00E5A0", borderWidth:2,borderRadius:4 },
    ]},
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{backgroundColor:"#13131C",titleColor:"#EEEEF5",bodyColor:"#5A5A78",borderColor:"#1A1A28",borderWidth:1,padding:10} },
      scales:{ x:{grid:{color:"#1A1A28"},ticks:{color:"#5A5A78",font:{size:11}}}, y:{grid:{color:"#1A1A28"},ticks:{color:"#5A5A78",font:{size:11}},beginAtZero:true} }
    }
  }), [clientSalesData.length]);
  return <canvas ref={ref} role="img" aria-label="Leads y ventas por cliente"/>;
}

function OverviewGeneral({ clients, allContent, allLeads, allBilling, allProducts }) {
  const totalRev = allBilling.reduce((a,b)=>a+toNum(b.totalRevenue),0);
  const totalCash = allBilling.reduce((a,b)=>a+toNum(b.cashCollected),0);
  const closed = allLeads.filter(l=>l.stage==="cerrado");
  const totalSales = closed.length;
  const totalSaleRev = closed.reduce((a,l)=>a+toNum(l.saleAmount),0);
  const totalReach = allContent.reduce((a,c)=>a+toNum(c.reach),0);
  const totalLeadsGen = allContent.reduce((a,c)=>a+toNum(c.leadsGenerated),0);
  const thisM = thisMonth();
  const revThisM = allBilling.filter(b=>b.month===thisM).reduce((a,b)=>a+toNum(b.totalRevenue),0);
  const cashThisM = allBilling.filter(b=>b.month===thisM).reduce((a,b)=>a+toNum(b.cashCollected),0);
  const stagnant = totalRev - totalCash;
  const showedUp = allLeads.filter(l=>l.showedUp===true);
  const noShow = allLeads.filter(l=>l.showedUp===false);
  const closingRate = pct(closed.length, showedUp.length);
  const showUpRate = pct(showedUp.length, showedUp.length+noShow.length);
  const avgTicket = totalSales ? Math.round(totalSaleRev/totalSales) : 0;

  const clientSalesData = clients.map(c => ({
    name: c.name,
    ventas: allLeads.filter(l=>l.clientId===c.id&&l.stage==="cerrado").length,
    leads: allContent.filter(x=>x.clientId===c.id).reduce((a,x)=>a+toNum(x.leadsGenerated),0),
  }));

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:24 }}>
      <div>
        <div style={{ fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4 }}>Panel general · todos los clientes</div>
        <div className="syne" style={{ fontSize:26,fontWeight:800 }}>Eclypse Dashboard</div>
        <div style={{ color:T.muted,fontSize:13,marginTop:2 }}>{clients.length} {clients.length===1?"cliente activo":"clientes activos"}</div>
      </div>

      <Divider label="Revenue de clientes"/>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12 }}>
        <KPI label="Revenue total clientes" value={fmt$(totalRev)} color={T.green} accent/>
        <KPI label="Cash collected total" value={fmt$(totalCash)} color={T.green}/>
        <KPI label="Revenue este mes" value={fmt$(revThisM)} sub={`Cash: ${fmt$(cashThisM)}`} color={T.blue} accent/>
        <KPI label="Dinero estancado" value={fmt$(stagnant)} sub="Facturado sin cobrar" color={T.amber} accent/>
      </div>

      <RevenueChart allBilling={allBilling} clients={clients}/>

      <Divider label="Ventas generadas para clientes"/>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:12 }}>
        <KPI label="Ventas totales cerradas" value={totalSales} sub="Suma de todos los clientes" color={T.green} accent/>
        <KPI label="Revenue de ventas" value={fmt$(totalSaleRev)} color={T.green}/>
        <KPI label="Ticket promedio" value={fmt$(avgTicket)} sub="Por venta cerrada" color={T.purple} accent/>
        <KPI label="Show-up rate" value={`${showUpRate}%`} color={showUpRate>=70?T.green:T.amber}/>
        <KPI label="Closing rate" value={`${closingRate}%`} color={closingRate>=30?T.green:T.red} accent/>
        <KPI label="Leads generados" value={totalLeadsGen} sub="Desde contenido" color={T.blue}/>
      </div>

      {clients.length > 1 && (
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"18px 20px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
            <div style={{ fontWeight:600,fontSize:13 }}>Leads vs ventas por cliente</div>
            <div style={{ display:"flex",gap:16 }}>
              {[["Leads","#4D9FFF"],["Ventas cerradas","#00E5A0"]].map(([l,c])=>(
                <div key={l} style={{ display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#5A5A78" }}>
                  <div style={{ width:10,height:10,borderRadius:2,background:c }}/>
                  {l}
                </div>
              ))}
            </div>
          </div>
          <div style={{ position:"relative",height:160 }}>
            <SalesBarChart clientSalesData={clientSalesData}/>
          </div>
        </div>
      )}

      <Divider label="Alcance & contenido"/>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:12 }}>
        <KPI label="Reach total generado" value={fmtN(totalReach)} color={T.blue}/>
        <KPI label="Piezas publicadas" value={allContent.length} color={T.muted}/>
        <KPI label="Clientes activos" value={clients.filter(c=>c.status==="active").length} color={T.purple}/>
      </div>

      <Divider label="Por cliente"/>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {clients.map((c,i)=>{
          const COLORS=["#FF3B5C","#00E5A0","#4D9FFF","#9B6DFF","#FFB800"];
          const cBill = allBilling.filter(b=>b.clientId===c.id);
          const cClosed = allLeads.filter(l=>l.clientId===c.id&&l.stage==="cerrado");
          const cContent = allContent.filter(x=>x.clientId===c.id);
          const cRev = cBill.reduce((a,b)=>a+toNum(b.totalRevenue),0);
          const cCash = cBill.reduce((a,b)=>a+toNum(b.cashCollected),0);
          const cLeadsThisM = allLeads.filter(l=>l.clientId===c.id&&getMonth(l.date)===thisM).length;
          const color = COLORS[i%COLORS.length];
          return (
            <div key={c.id} style={{ background:T.card,border:`1px solid ${T.border}`, borderLeft:`3px solid ${color}`,borderRadius:12,padding:"14px 18px", display:"flex",alignItems:"center",gap:16 }}>
              <ClientAvatar client={c} size={40}/>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700 }}>{c.name}</div>
                <div style={{ fontSize:12,color:T.muted }}>{c.niche} · {c.ig}</div>
              </div>
              <div style={{ display:"flex",gap:22 }}>
                <Chip label="Revenue" value={fmt$(cRev)} color={T.green}/>
                <Chip label="Cash" value={fmt$(cCash)} color={T.green}/>
                <Chip label="Ventas" value={cClosed.length} color={T.purple}/>
                <Chip label="Contenido" value={cContent.length} color={T.blue}/>
                <Chip label="Leads mes" value={cLeadsThisM} color={T.amber}/>
              </div>
              <Tag color={c.status==="active"?T.green:T.muted}>{c.status==="active"?"Activo":"Inactivo"}</Tag>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OverviewClient({ client, content, leads, products, billing }) {
  const currentBill = billing.filter(b=>b.month===thisMonth());
  const totalRev = billing.reduce((a,b)=>a+b.totalRevenue,0);
  const totalCash = billing.reduce((a,b)=>a+b.cashCollected,0);
  const totalMyShare = billing.filter(b=>b.revShareCollected).reduce((a,b)=>a+b.revShareEarned,0);
  const myPending = billing.filter(b=>!b.revShareCollected).reduce((a,b)=>a+b.revShareEarned,0);
  const stagnant = (currentBill.reduce((a,b)=>a+b.totalRevenue,0))-(currentBill.reduce((a,b)=>a+b.cashCollected,0));
  const closed = leads.filter(l=>l.stage==="cerrado");
  const showedUp = leads.filter(l=>l.showedUp===true);
  const noShow = leads.filter(l=>l.showedUp===false);
  const conversations = leads.filter(l=>["conversación","llamada agendada"].includes(l.stage));
  const showUpRate = pct(showedUp.length, showedUp.length+noShow.length);
  const closingRate = pct(closed.length, showedUp.length);
  const noShowRate = pct(noShow.length, showedUp.length+noShow.length);
  const totalSaleRev = closed.reduce((a,l)=>a+(l.saleAmount||0),0);
  const totalSaleCash = closed.reduce((a,l)=>a+(l.cashCollected||0),0);
  const avgTicket = closed.length ? Math.round(totalSaleRev/closed.length) : 0;
  
  const aov = showedUp.length ? Math.round(totalSaleCash/showedUp.length) : 0;
  const bestContent = [...content].sort((a,b)=>b.revenue-a.revenue).slice(0,3);
  const topProduct = [...products].sort((a,b)=>b.sales-a.sales)[0];

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:24 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end" }}>
        <div style={{ display:"flex",gap:16,alignItems:"center" }}>
          <ClientAvatar client={client} size={52}/>
          <div>
            <div style={{ fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2 }}>Dashboard cliente</div>
            <div className="syne" style={{ fontSize:26,fontWeight:800 }}>{client.name}</div>
            <div style={{ color:T.muted,fontSize:13 }}>{client.niche} · {client.ig} · {client.followers}</div>
          </div>
        </div>
        <Tag color={client.status==="active"?T.green:T.muted} size="lg">Activo</Tag>
      </div>

      <Divider label="Financiero"/>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12 }}>
        <KPI label="Revenue total" value={fmt$(totalRev)} sub="Facturación bruta" color={T.green} accent/>
        <KPI label="Cash collected" value={fmt$(totalCash)} color={T.green}/>
        <KPI label="Dinero estancado" value={fmt$(stagnant)} sub="Mes actual" color={T.amber} accent/>

      </div>

      <RevenueMiniLine billing={billing}/>

      <Divider label="Ventas"/>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12 }}>
        <KPI label="Ventas realizadas" value={closed.length} sub={fmt$(totalSaleRev)} color={T.green} accent/>
        <KPI label="Convs. abiertas" value={conversations.length} color={T.blue}/>
        <KPI label="Show-up rate" value={`${showUpRate}%`} color={showUpRate>=70?T.green:T.amber} accent/>
        <KPI label="Closing rate" value={`${closingRate}%`} color={closingRate>=30?T.green:T.red} accent/>
        <KPI label="No-show rate" value={`${noShowRate}%`} color={noShowRate>30?T.red:T.amber}/>
        <KPI label="Ticket promedio" value={fmt$(avgTicket)} sub="Por venta" color={T.purple}/>
        <KPI label="AOV (cash/call)" value={fmt$(aov)} sub="Cash cobrado ÷ calls" color={T.purple} accent/>
      </div>

      <GoalProgress billing={billing} leads={leads}/>

      <Divider label="Contenido top (por revenue)"/>
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {bestContent.map((c,i)=>(
          <div key={c.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"13px 18px", display:"flex",alignItems:"center",gap:16 }}>
            <div className="syne" style={{ fontSize:18,fontWeight:800,color:i===0?T.gold:T.muted,width:36,textAlign:"center",flexShrink:0 }}>#{i+1}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontWeight:600,marginBottom:6 }}>{c.topic}</div>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}><Tag color={T.blue}>{c.type}</Tag><Tag color={T.purple}>{c.angle}</Tag></div>
            </div>
            <div style={{ display:"flex",gap:20 }}>
              <Chip label="Reach" value={fmtN(c.reach)} color={T.blue}/>
              <Chip label="Leads" value={c.leadsGenerated} color={T.purple}/>
              <Chip label="Revenue" value={fmt$(c.revenue)} color={T.green}/>
            </div>
          </div>
        ))}
      </div>

      <Divider label="Productos activos"/>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12 }}>
        {products.filter(p=>p.active).map(p=>(
          <div key={p.id} style={{ background:T.card,border:`1px solid ${p.id===topProduct?.id?T.green:T.border}`,borderRadius:12,padding:"14px 18px",position:"relative" }}>
            {p.id===topProduct?.id&&<div style={{ position:"absolute",top:10,right:10 }}><Tag color={T.green}>🏆 Top</Tag></div>}
            <div style={{ marginBottom:8 }}><Tag color={p.type==="recurring"?T.purple:T.blue}>{p.type==="recurring"?"Recurrente":"One-time"}</Tag></div>
            <div style={{ fontWeight:600,marginBottom:4, paddingRight: p.id===topProduct?.id?60:0 }}>{p.name}</div>
            <div className="mono" style={{ color:T.green,fontWeight:700,fontSize:16,marginBottom:4 }}>{fmt$(p.price)}</div>
            <div style={{ fontSize:12,color:T.muted }}>{toNum(p.sales)} ventas · {fmt$(toNum(p.price)*toNum(p.sales))} total</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadsTimelineChart({ leads }) {
  
  const monthMap = {};
  leads.forEach(l => {
    const m = getMonth(l.date);
    if (!m) return;
    if (!monthMap[m]) monthMap[m] = { total:0, closed:0 };
    monthMap[m].total++;
    if (l.stage === "cerrado") monthMap[m].closed++;
  });
  const months = Object.keys(monthMap).sort();
  const labels = months.map(m => { const [y,mo]=m.split("-"); return ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][+mo-1]+"'"+y.slice(2); });
  const totalData = months.map(m => monthMap[m].total);
  const closedData = months.map(m => monthMap[m].closed);

  const ref = useChartJS((Chart, canvas) => new Chart(canvas, {
    type:"line",
    data: { labels, datasets:[
      { label:"Leads totales", data:totalData, borderColor:"#4D9FFF", backgroundColor:"#4D9FFF15", borderWidth:2, pointBackgroundColor:"#4D9FFF", pointRadius:4, tension:0.4, fill:true },
      { label:"Cerrados", data:closedData, borderColor:"#00E5A0", backgroundColor:"transparent", borderWidth:2, pointBackgroundColor:"#00E5A0", pointRadius:4, tension:0.4, borderDash:[4,3] },
    ]},
    options: { responsive:true, maintainAspectRatio:false,
      interaction:{ mode:"index", intersect:false },
      plugins:{ legend:{display:false}, tooltip:{backgroundColor:"#13131C",titleColor:"#EEEEF5",bodyColor:"#5A5A78",borderColor:"#1A1A28",borderWidth:1,padding:10} },
      scales:{
        x:{ grid:{color:"#1A1A2820"}, ticks:{color:"#5A5A78",font:{size:10}} },
        y:{ grid:{color:"#1A1A28"}, ticks:{color:"#5A5A78",font:{size:10}}, beginAtZero:true, precision:0 }
      }
    }
  }), [leads.length, leads.map(l=>l.stage).join()]);

  if (months.length === 0) return (
    <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px" }}>
      <div style={{ fontWeight:600,fontSize:13,marginBottom:14 }}>Volumen de leads por mes</div>
      <EmptyChart icon="📅" title="Sin leads registrados" hint="Agrega leads al pipeline para ver la tendencia de volumen mensual"/>
    </div>
  );
  return (
    <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
        <div style={{ fontWeight:600,fontSize:13 }}>Volumen de leads por mes</div>
        <div style={{ display:"flex",gap:14 }}>
          {[["Leads totales","#4D9FFF","solid"],["Cerrados","#00E5A0","dashed"]].map(([l,c,t])=>(
            <div key={l} style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#5A5A78" }}>
              <div style={{ width:16,height:2, borderTop:`2px ${t==="dashed"?"dashed":"solid"} ${c}` }}/>
              {l}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position:"relative",height:180 }}>
        <canvas ref={ref} role="img" aria-label="Volumen de leads por mes"/>
      </div>
    </div>
  );
}

function BuyReasonsDonut({ leads }) {
  const closed = leads.filter(l => l.stage === "cerrado" && l.buyReason);
  const reasonMap = {};
  closed.forEach(l => { reasonMap[l.buyReason] = (reasonMap[l.buyReason]||0)+1; });
  const entries = Object.entries(reasonMap).sort((a,b)=>b[1]-a[1]);
  const COLORS = ["#FF3B5C","#4D9FFF","#00E5A0","#9B6DFF","#FFB800","#FF6680","#5BCEFF"];
  const total = closed.length;

  const ref = useChartJS((Chart, canvas) => {
    if (entries.length === 0) return null;
    return new Chart(canvas, {
      type:"doughnut",
      data:{ labels:entries.map(([r])=>r), datasets:[{ data:entries.map(([,v])=>v), backgroundColor:COLORS.slice(0,entries.length), borderColor:"#13131C", borderWidth:3, hoverOffset:6 }] },
      options:{ responsive:true, maintainAspectRatio:false, cutout:"65%",
        plugins:{ legend:{display:false}, tooltip:{backgroundColor:"#13131C",titleColor:"#EEEEF5",bodyColor:"#5A5A78",borderColor:"#1A1A28",borderWidth:1,padding:10,callbacks:{label:ctx=>`  ${ctx.raw} ventas (${Math.round(ctx.raw/total*100)}%)`}} }
      }
    });
  }, [closed.length, leads.map(l=>l.buyReason).join()]);

  return (
    <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px" }}>
      <div style={{ fontWeight:600,fontSize:13,marginBottom:14 }}>¿Por qué compran?</div>
      {entries.length === 0 ? (
        <EmptyChart icon="🧠" title="Sin razones registradas" hint="Al cerrar un lead selecciona la razón de compra para ver el patrón"/>
      ) : (
        <div style={{ display:"grid",gridTemplateColumns:"140px 1fr",gap:16,alignItems:"center" }}>
          <div style={{ position:"relative",height:140 }}>
            <canvas ref={ref} role="img" aria-label="Distribución de razones de compra"/>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
            {entries.map(([reason, count], i) => (
              <div key={reason} style={{ display:"flex",alignItems:"center",gap:8 }}>
                <div style={{ width:7,height:7,borderRadius:"50%",background:COLORS[i%COLORS.length],flexShrink:0 }}/>
                <span style={{ flex:1,fontSize:11,color:"#EEEEF5",overflow:"hidden", textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{reason}</span>
                <span style={{ fontSize:11,fontFamily:"DM Mono,monospace",color:COLORS[i%COLORS.length],fontWeight:600 }}>{count}</span>
                <span style={{ fontSize:10,color:"#5A5A78",width:30,textAlign:"right" }}>{Math.round(count/total*100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GoalProgress({ billing, leads }) {
  const tm = thisMonth();
  const [goals, setGoals] = useState({ revenue:5000, sales:10, cash:4000 });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({...goals});

  const billThisM = billing.filter(b=>b.month===tm);
  const revActual = billThisM.reduce((a,b)=>a+toNum(b.totalRevenue),0);
  const cashActual = billThisM.reduce((a,b)=>a+toNum(b.cashCollected),0);
  const salesActual = leads.filter(l=>l.stage==="cerrado"&&getMonth(l.date)===tm).length;

  const bars = [
    { label:"Revenue del mes", actual:revActual, goal:goals.revenue,color:"#FF3B5C", fmt:fmt$ },
    { label:"Cash collected", actual:cashActual, goal:goals.cash,color:"#00E5A0", fmt:fmt$ },
    { label:"Ventas cerradas", actual:salesActual, goal:goals.sales,color:"#4D9FFF", fmt:(n)=>String(n) },
  ];

  return (
    <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18 }}>
        <div>
          <div style={{ fontWeight:600,fontSize:13 }}>Objetivos del mes</div>
          <div style={{ fontSize:11,color:"#5A5A78",marginTop:2 }}>{["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][+tm.split("-")[1]-1]} {tm.split("-")[0]}</div>
        </div>
        <button onClick={()=>{ setDraft({...goals}); setEditing(true); }} style={{ background:"transparent",border:"1px solid #1A1A28",color:"#5A5A78",borderRadius:7,padding:"5px 12px",fontSize:11,cursor:"pointer" }}>✎ Editar metas</button>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
        {bars.map(({ label, actual, goal, color, fmt }) => {
          const p = goal > 0 ? Math.min(100, Math.round((actual/goal)*100)) : 0;
          const done = p >= 100;
          return (
            <div key={label}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                <span style={{ fontSize:12,color:"#EEEEF5" }}>{label}</span>
                <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                  <span style={{ fontFamily:"DM Mono,monospace",fontSize:12, color }}>{fmt(actual)}</span>
                  <span style={{ fontSize:11,color:"#5A5A78" }}>/ {fmt(goal)}</span>
                  <span style={{ fontSize:11,fontWeight:700,color:done?"#00E5A0":color }}>{p}%</span>
                </div>
              </div>
              <div style={{ height:8,background:"#1A1A28",borderRadius:4,overflow:"hidden",position:"relative" }}>
                <div style={{ width:`${p}%`,height:"100%",background:done?`linear-gradient(90deg,${color},#00E5A0)`:color,borderRadius:4,transition:"width 0.5s ease" }}/>
              </div>
            </div>
          );
        })}
      </div>
      {editing && (
        <Modal title="Definir metas del mes" onClose={()=>setEditing(false)} width={380}>
          {[["Meta de revenue ($)","revenue"],["Meta de cash collected ($)","cash"],["Meta de ventas cerradas","sales"]].map(([label,key])=>(
            <div key={key} style={{ marginBottom:14 }}>
              <label style={{ fontSize:11,color:"#5A5A78",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em" }}>{label}</label>
              <input type="number" value={draft[key]} onChange={e=>setDraft(p=>({...p,[key]:toNum(e.target.value)}))}/>
            </div>
          ))}
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:20 }}>
            <Btn variant="ghost" onClick={()=>setEditing(false)}>Cancelar</Btn>
            <Btn onClick={()=>{ setGoals(draft); setEditing(false); }}>Guardar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function useChartJS(callback, deps) {
  const ref = useRef();
  const inst = useRef();
  useEffect(() => {
    const load = () => {
      if (!window.Chart) { setTimeout(load, 80); return; }
      if (inst.current) inst.current.destroy();
      if (ref.current) inst.current = callback(window.Chart, ref.current);
    };
    if (window.Chart) load();
    else {
      const existing = document.getElementById("chartjs-cdn");
      if (!existing) {
        const s = document.createElement("script");
        s.id = "chartjs-cdn";
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
        s.onload = load;
        document.head.appendChild(s);
      } else { existing.addEventListener("load", load); setTimeout(load, 300); }
    }
    return () => { if (inst.current) { inst.current.destroy(); inst.current = null; } };
  }, deps);
  return ref;
}

const EmptyChart = ({ icon, title, hint, height=180 }) => (
  <div style={{ height, display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,border:"1px dashed #1A1A28",borderRadius:10 }}>
    <div style={{ fontSize:28,opacity:0.25 }}>{icon}</div>
    <div style={{ fontSize:13,color:"#3A3A50",fontWeight:600 }}>{title}</div>
    <div style={{ fontSize:11,color:"#2E2E42",textAlign:"center",maxWidth:220,lineHeight:1.5 }}>{hint}</div>
  </div>
);

function FunnelChart({ chats, convs, scheduled, showedUp, closed }) {
  const steps = [
    { label:"Chats únicos", value:chats,color:"#4D9FFF" },
    { label:"Conversaciones", value:convs,color:"#9B6DFF" },
    { label:"Agendas", value:scheduled,color:"#FFB800" },
    { label:"Show-up", value:showedUp,color:"#FF3B5C" },
    { label:"Cerrados", value:closed,color:"#00E5A0" },
  ];
  const max = Math.max(...steps.map(s=>s.value), 1);
  return (
    <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px" }}>
      <div style={{ fontWeight:600,fontSize:13,marginBottom:18 }}>Embudo de conversión</div>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {steps.map((s,i) => {
          const w = Math.max(8, Math.round((s.value/max)*100));
          const prev = i > 0 ? steps[i-1].value : null;
          const drop = prev && prev > 0 ? Math.round((1-(s.value/prev))*100) : null;
          return (
            <div key={s.label} style={{ display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ width:130,fontSize:11,color:"#5A5A78",textAlign:"right",flexShrink:0 }}>{s.label}</div>
              <div style={{ flex:1,position:"relative",height:32, display:"flex",alignItems:"center" }}>
                <div style={{ width:`${w}%`,height:32,background:s.color+"25",border:`1px solid ${s.color}50`,borderRadius:6, display:"flex",alignItems:"center", paddingLeft:10,minWidth:40,transition:"width .4s" }}>
                  <span style={{ fontFamily:"DM Mono,monospace",fontWeight:700,fontSize:14,color:s.color }}>{s.value}</span>
                </div>
                {drop !== null && drop > 0 && (
                  <span style={{ marginLeft:10,fontSize:10,color:"#5A5A78" }}>▼ {drop}% drop</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {chats===0&&convs===0&&closed===0 ? (
        <div style={{ marginTop:16,padding:"14px",border:"1px dashed #1A1A28",borderRadius:8,textAlign:"center" }}>
          <div style={{ fontSize:11,color:"#2E2E42" }}>Registra chats del día y agrega leads para ver el embudo activo</div>
        </div>
      ) : (
        <div style={{ display:"flex",gap:20,marginTop:18, paddingTop:14, borderTop:"1px solid #1A1A28" }}>
          {[
            ["Chat → Conv", chats>0?Math.round(convs/chats*100):0, "#9B6DFF"],
            ["Conv → Agenda", convs>0?Math.round(scheduled/convs*100):0, "#FFB800"],
            ["Agenda → Show", scheduled>0?Math.round(showedUp/scheduled*100):0, "#FF3B5C"],
            ["Show → Cierre", showedUp>0?Math.round(closed/showedUp*100):0, "#00E5A0"],
          ].map(([l,v,c]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"DM Mono,monospace",fontWeight:700,fontSize:16,color:c }}>{v}%</div>
              <div style={{ fontSize:10,color:"#5A5A78",marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReachByMonthChart({ content }) {
  const allMonths = [...new Set(content.map(c=>getMonth(c.date)))].filter(Boolean).sort();
  const reachData = allMonths.map(m => content.filter(c=>getMonth(c.date)===m).reduce((a,c)=>a+toNum(c.reach),0));
  const leadsData = allMonths.map(m => content.filter(c=>getMonth(c.date)===m).reduce((a,c)=>a+toNum(c.leadsGenerated),0));
  const labels = allMonths.map(m => { const [y,mo]=m.split("-"); return ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][+mo-1]+" '"+y.slice(2); });

  const ref = useChartJS((Chart, canvas) => new Chart(canvas, {
    type:"bar",
    data:{
      labels,
      datasets:[
        { label:"Reach", data:reachData, backgroundColor:"#4D9FFF20", borderColor:"#4D9FFF", borderWidth:2,borderRadius:5, yAxisID:"yReach" },
        { label:"Leads", data:leadsData, type:"line", borderColor:"#FF3B5C", backgroundColor:"#FF3B5C15", borderWidth:2, pointBackgroundColor:"#FF3B5C", pointRadius:4, tension:0.4, fill:true, yAxisID:"yLeads" },
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      interaction:{ mode:"index", intersect:false },
      plugins:{ legend:{display:false}, tooltip:{ backgroundColor:"#13131C", titleColor:"#EEEEF5", bodyColor:"#5A5A78", borderColor:"#1A1A28", borderWidth:1,padding:10 } },
      scales:{
        yReach:{ position:"left", grid:{ color:"#1A1A28" }, ticks:{ color:"#5A5A78", font:{size:10}, callback:v=>v>=1000?Math.round(v/1000)+"K":v }, beginAtZero:true },
        yLeads:{ position:"right", grid:{ drawOnChartArea:false }, ticks:{ color:"#FF3B5C55", font:{size:10} }, beginAtZero:true },
        x:{ grid:{ color:"#1A1A2820" }, ticks:{ color:"#5A5A78", font:{size:10} } }
      }
    }
  }), [content.length]);

  if (allMonths.length < 2) return (
    <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px" }}>
      <div style={{ fontWeight:600,fontSize:13,marginBottom:14 }}>Reach & Leads por mes</div>
      <EmptyChart icon="📈" title="Sin datos suficientes" hint="Registra contenido de al menos 2 meses para ver la tendencia"/>
    </div>
  );
  return (
    <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
        <div style={{ fontWeight:600,fontSize:13 }}>Reach & Leads por mes</div>
        <div style={{ display:"flex",gap:16 }}>
          {[["Reach","#4D9FFF","bar"],["Leads","#FF3B5C","line"]].map(([l,c,t])=>(
            <div key={l} style={{ display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#5A5A78" }}>
              <div style={{ width:10,height:t==="line"?2:10,borderRadius:2,background:c,marginTop:t==="line"?4:0 }}/>
              {l}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position:"relative",height:200 }}>
        <canvas ref={ref} role="img" aria-label="Reach y leads por mes"/>
      </div>
    </div>
  );
}

function ContentROIChart({ content }) {
  const validContent = content.filter(c=>toNum(c.reach)>0&&toNum(c.revenue)>=0);
  const COLORS = {"Reel":"#FF3B5C","Carrusel":"#4D9FFF","Historia":"#FFB800","Post":"#9B6DFF","YouTube":"#00E5A0","Live":"#FF6680"};

  const ref = useChartJS((Chart, canvas) => new Chart(canvas, {
    type:"scatter",
    data:{
      datasets: Object.entries(COLORS).map(([type,color]) => ({
        label:type,
        data: validContent.filter(c=>c.type===type).map(c=>({ x:toNum(c.reach), y:toNum(c.revenue), label:c.topic })),
        backgroundColor:color+"99", borderColor:color, pointRadius:6, pointHoverRadius:9,
      })).filter(d=>d.data.length>0)
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{display:false},
        tooltip:{ backgroundColor:"#13131C", titleColor:"#EEEEF5", bodyColor:"#5A5A78", borderColor:"#1A1A28", borderWidth:1,padding:10,
          callbacks:{ label: ctx => [`  ${ctx.raw.label||""}`,`  Reach: ${Math.round(ctx.raw.x).toLocaleString("es")}`,`  Revenue: $${Math.round(ctx.raw.y).toLocaleString("es")}`] }
        }
      },
      scales:{
        x:{ grid:{color:"#1A1A28"}, ticks:{color:"#5A5A78",font:{size:10},callback:v=>v>=1000?Math.round(v/1000)+"K":v}, title:{display:true,text:"Reach",color:"#5A5A78",font:{size:10}} },
        y:{ grid:{color:"#1A1A28"}, ticks:{color:"#5A5A78",font:{size:10},callback:v=>"$"+v.toLocaleString("es")}, beginAtZero:true, title:{display:true,text:"Revenue",color:"#5A5A78",font:{size:10}} }
      }
    }
  }), [validContent.length]);

  if (validContent.length < 3) return (
    <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px" }}>
      <div style={{ fontWeight:600,fontSize:13,marginBottom:14 }}>ROI por pieza — Reach vs Revenue</div>
      <EmptyChart icon="🎯" title="Registra al menos 3 piezas" hint="Con reach y revenue completados para ver cuál tipo de contenido tiene mejor retorno"/>
    </div>
  );
  const typeColors = [...new Set(validContent.map(c=>c.type))];
  return (
    <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
        <div>
          <div style={{ fontWeight:600,fontSize:13 }}>ROI por pieza — Reach vs Revenue</div>
          <div style={{ fontSize:11,color:"#5A5A78",marginTop:2 }}>Arriba a la derecha = mejor rendimiento</div>
        </div>
        <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
          {typeColors.map(t=>(
            <div key={t} style={{ display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#5A5A78" }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:COLORS[t]||"#888" }}/>
              {t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position:"relative",height:220 }}>
        <canvas ref={ref} role="img" aria-label="Scatter plot de reach vs revenue por pieza de contenido"/>
      </div>
    </div>
  );
}

function RevenueMiniLine({ billing }) {
  const sorted = [...billing].sort((a,b)=>a.month.localeCompare(b.month));
  const labels = sorted.map(b => { const [y,m]=b.month.split("-"); return ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][+m-1]; });
  const revData = sorted.map(b=>toNum(b.totalRevenue));
  const cashData = sorted.map(b=>toNum(b.cashCollected));

  const ref = useChartJS((Chart, canvas) => new Chart(canvas, {
    type:"line",
    data:{
      labels,
      datasets:[
        { label:"Revenue", data:revData, borderColor:"#FF3B5C", backgroundColor:"#FF3B5C12", borderWidth:2, pointBackgroundColor:"#FF3B5C", pointRadius:3, tension:0.4, fill:true },
        { label:"Cash", data:cashData, borderColor:"#00E5A0", backgroundColor:"transparent", borderWidth:2, pointBackgroundColor:"#00E5A0", pointRadius:3, tension:0.4, borderDash:[4,3] },
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{ backgroundColor:"#13131C", titleColor:"#EEEEF5", bodyColor:"#5A5A78", borderColor:"#1A1A28", borderWidth:1,padding:8, callbacks:{ label: ctx=>`  ${ctx.dataset.label}: $${Math.round(ctx.raw).toLocaleString("es")}` } } },
      scales:{
        x:{ grid:{display:false}, ticks:{color:"#5A5A78",font:{size:10}} },
        y:{ grid:{color:"#1A1A28"}, ticks:{color:"#5A5A78",font:{size:10},callback:v=>"$"+v.toLocaleString("es")}, beginAtZero:true }
      }
    }
  }), [billing.length, billing.map(b=>b.totalRevenue).join(",")]);

  if (sorted.length < 2) return (
    <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"16px 20px" }}>
      <div style={{ fontWeight:600,fontSize:13,marginBottom:12 }}>Tendencia de revenue</div>
      <EmptyChart icon="💰" title="Sin historial aún" hint="Registra al menos 2 meses en Facturación para ver la curva de crecimiento" height={140}/>
    </div>
  );
  return (
    <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"16px 20px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
        <div style={{ fontWeight:600,fontSize:13 }}>Tendencia de revenue</div>
        <div style={{ display:"flex",gap:14 }}>
          {[["Revenue","#FF3B5C","solid"],["Cash collected","#00E5A0","dashed"]].map(([l,c,t])=>(
            <div key={l} style={{ display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#5A5A78" }}>
              <div style={{ width:16,height:2,background:t==="dashed"?"transparent":"none", borderTop:`2px ${t==="dashed"?"dashed":"solid"} ${c}` }}/>
              {l}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position:"relative",height:140 }}>
        <canvas ref={ref} role="img" aria-label="Tendencia de revenue mensual"/>
      </div>
    </div>
  );
}

function ContentLab({ clientId, client, content, onAdd, onUpdate, onDelete, onUpdateClient }) {
  const angles = (client && client.angles) || [];
  const pains = (client && client.pains) || [];
  const updateAngles = list => onUpdateClient({...client, angles:list});
  const updatePains = list => onUpdateClient({...client, pains:list});
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showAngles, setShowAngles] = useState(false);
  const [showPains, setShowPains] = useState(false);
  const [viewMode, setViewMode] = useState("general"); 
  const [filterMonth, setFilterMonth] = useState(thisMonth());
  const [sortBy, setSortBy] = useState("revenue");
  const [filterType, setFilterType] = useState("all");
  const emptyForm = { type:"Reel", topic:"", angle:angles[0]||"", pain:pains[0]||"", date:new Date().toISOString().split("T")[0], reach:"", saves:"", shares:"", comments:"", followers_gained:"", leadsGenerated:"", salesLinked:"", revenue:"", cashCollected:"" };
  const [form, setForm] = useState(emptyForm);

  const displayed = viewMode==="month" ? content.filter(c=>getMonth(c.date)===filterMonth) : content;
  const filtered = displayed.filter(c=>filterType==="all"||c.type===filterType).sort((a,b)=>b[sortBy]-a[sortBy]);

  const totalReach = displayed.reduce((a,c)=>a+c.reach,0);
  const totalLeads = displayed.reduce((a,c)=>a+c.leadsGenerated,0);
  const totalRevenue = displayed.reduce((a,c)=>a+c.revenue,0);
  const totalCash = displayed.reduce((a,c)=>a+c.cashCollected,0);
  const totalSaves = displayed.reduce((a,c)=>a+c.saves,0);
  const totalFollowers = displayed.reduce((a,c)=>a+(c.followers_gained||0),0);
  const totalSales = displayed.reduce((a,c)=>a+c.salesLinked,0);
  const totalPieces = displayed.length;

  const byType = {};
  CONTENT_TYPES.forEach(t=>{ byType[t]=displayed.filter(c=>c.type===t).length; });

  const byAngle = {};
  displayed.forEach(c=>{ byAngle[c.angle]=(byAngle[c.angle]||0)+c.revenue; });
  const byPain = {};
  displayed.forEach(c=>{ byPain[c.pain]=(byPain[c.pain]||0)+c.revenue; });

  const allMonths = [...new Set(content.map(c=>getMonth(c.date)))].sort().reverse();

  const openEdit = (item) => { setEditItem(item); setForm(item); setShowForm(true); };
  const save = () => {
    if(!form.topic) return;
    const data = { ...form, clientId, reach:+form.reach||0, saves:+form.saves||0, shares:+form.shares||0, comments:+form.comments||0, followers_gained:+form.followers_gained||0, leadsGenerated:+form.leadsGenerated||0, salesLinked:+form.salesLinked||0, revenue:+form.revenue||0, cashCollected:+form.cashCollected||0 };
    if(editItem) onUpdate({...data, id:editItem.id});
    else onAdd({...data, id:uid()});
    setShowForm(false); setEditItem(null); setForm(emptyForm);
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>
          <div className="syne" style={{ fontSize:20,fontWeight:800 }}>Content Lab</div>
          <div style={{ color:T.muted,fontSize:12,marginTop:2 }}>Laboratorio de contenido · qué publica · qué convierte · qué escalar</div>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <Btn variant="ghost" size="sm" onClick={()=>setShowAngles(true)}>✎ Ángulos</Btn>
          <Btn variant="ghost" size="sm" onClick={()=>setShowPains(true)}>✎ Dolores</Btn>
          <Btn onClick={()=>{ setEditItem(null); setForm(emptyForm); setShowForm(true); }}>+ Contenido</Btn>
        </div>
      </div>

      {/* VIEW TOGGLE */}
      <div style={{ display:"flex",gap:12,alignItems:"center" }}>
        <TabBar tabs={[{id:"general",label:"General"},{id:"month",label:"Por mes"}]} active={viewMode} onChange={setViewMode}/>
        {viewMode==="month"&&<div style={{ width:180 }}><input type="month" value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{ padding:"6px 10px",fontSize:13 }}/></div>}
        <div style={{ marginLeft:"auto",fontSize:12,color:T.muted }}>{viewMode==="month"?monthLabel(filterMonth):"Todo el período"} · <span style={{ color:T.text }}>{totalPieces} piezas</span></div>
      </div>

      {/* CONTENT TYPE BREAKDOWN */}
      <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
        {CONTENT_TYPES.map(t=>(
          <div key={t} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 14px",textAlign:"center" }}>
            <div style={{ fontFamily:"DM Mono",fontWeight:700,fontSize:18,color:byType[t]>0?T.text:T.muted }}>{byType[t]}</div>
            <div style={{ fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em" }}>{t}s</div>
          </div>
        ))}
        <div style={{ background:T.red+"18",border:`1px solid ${T.red}35`,borderRadius:8,padding:"8px 14px",textAlign:"center" }}>
          <div style={{ fontFamily:"DM Mono",fontWeight:700,fontSize:18,color:T.red }}>{totalPieces}</div>
          <div style={{ fontSize:10,color:T.red,textTransform:"uppercase",letterSpacing:"0.06em" }}>Total</div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:12 }}>
        <KPI label="Reach total" value={fmtN(totalReach)} color={T.blue}/>
        <KPI label="Guardados" value={fmtN(totalSaves)} color={T.amber}/>
        <KPI label="Seguidores ganados" value={fmtN(totalFollowers)} color={T.blue} accent/>
        <KPI label="Leads generados" value={totalLeads} color={T.purple}/>
        <KPI label="Ventas atribuidas" value={totalSales} color={T.green}/>
        <KPI label="Revenue atribuido" value={fmt$(totalRevenue)} color={T.green} accent/>
        <KPI label="Cash collected" value={fmt$(totalCash)} color={T.green}/>
      </div>

      {/* ANGLE + PAIN */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 18px" }}>
          <div style={{ fontWeight:600,marginBottom:12,fontSize:13 }}>Revenue por ángulo</div>
          {Object.entries(byAngle).sort((a,b)=>b[1]-a[1]).map(([angle,rev])=>(
            <div key={angle} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
              <div style={{ width:110,fontSize:11,color:T.text,whiteSpace:"nowrap",overflow:"hidden", textOverflow:"ellipsis" }}>{angle}</div>
              <div style={{ flex:1 }}><ProgressBar value={rev} max={Math.max(...Object.values(byAngle),1)} color={T.red}/></div>
              <div className="mono" style={{ fontSize:11,color:T.green,width:55,textAlign:"right" }}>{fmt$(rev)}</div>
            </div>
          ))}
          {Object.keys(byAngle).length===0&&<div style={{ color:T.muted,fontSize:12 }}>Sin datos</div>}
        </div>
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 18px" }}>
          <div style={{ fontWeight:600,marginBottom:12,fontSize:13 }}>Revenue por dolor</div>
          {Object.entries(byPain).sort((a,b)=>b[1]-a[1]).map(([pain,rev])=>(
            <div key={pain} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
              <div style={{ width:110,fontSize:11,color:T.text,whiteSpace:"nowrap",overflow:"hidden", textOverflow:"ellipsis" }}>{pain}</div>
              <div style={{ flex:1 }}><ProgressBar value={rev} max={Math.max(...Object.values(byPain),1)} color={T.purple}/></div>
              <div className="mono" style={{ fontSize:11,color:T.green,width:55,textAlign:"right" }}>{fmt$(rev)}</div>
            </div>
          ))}
          {Object.keys(byPain).length===0&&<div style={{ color:T.muted,fontSize:12 }}>Sin datos</div>}
        </div>
      </div>

      <ReachByMonthChart content={displayed}/>
      <ContentROIChart content={displayed}/>

            {/* MONTHLY SUMMARIES (only in general view) */}
      {viewMode==="general"&&allMonths.length>0&&(
        <div>
          <div style={{ fontWeight:600,marginBottom:12 }}>Resumen por mes</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {allMonths.map(m=>{
              const mc = content.filter(c=>getMonth(c.date)===m);
              const mReach = mc.reduce((a,c)=>a+c.reach,0);
              const mSaves = mc.reduce((a,c)=>a+c.saves,0);
              const mLeads = mc.reduce((a,c)=>a+c.leadsGenerated,0);
              const mSales = mc.reduce((a,c)=>a+c.salesLinked,0);
              const mRev = mc.reduce((a,c)=>a+c.revenue,0);
              const mCash = mc.reduce((a,c)=>a+c.cashCollected,0);
              return (
                <div key={m} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 18px" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <span style={{ fontWeight:600,fontSize:13 }}>{monthLabel(m)}</span>
                    <span style={{ fontSize:11,color:T.muted }}>{mc.length} piezas</span>
                  </div>
                  <div style={{ display:"flex",gap:20,marginTop:8,flexWrap:"wrap" }}>
                    {[["Reach",fmtN(mReach),T.blue],["Guardados",fmtN(mSaves),T.amber],["Leads",mLeads,T.purple],["Ventas",mSales,T.green],["Revenue",fmt$(mRev),T.green],["Cash",fmt$(mCash),T.green]].map(([l,v,c])=>(
                      <div key={l}><span style={{ fontSize:10,color:T.muted }}>{l} </span><span style={{ fontFamily:"DM Mono",fontWeight:600,color:c,fontSize:12 }}>{v}</span></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENT LIST */}
      <div>
        <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:12,flexWrap:"wrap" }}>
          <div style={{ display:"flex",gap:5 }}>
            {["all",...CONTENT_TYPES].map(t=>(
              <button key={t} onClick={()=>setFilterType(t)} style={{ padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:filterType===t?T.red:T.dim,color:filterType===t?"#fff":T.muted,border:"none",cursor:"pointer" }}>{t==="all"?"Todo":t}</button>
            ))}
          </div>
          <div style={{ marginLeft:"auto", display:"flex",gap:5,alignItems:"center" }}>
            <span style={{ fontSize:11,color:T.muted }}>Ordenar:</span>
            {[["revenue","Revenue"],["reach","Reach"],["leadsGenerated","Leads"],["saves","Saves"]].map(([k,l])=>(
              <button key={k} onClick={()=>setSortBy(k)} style={{ padding:"3px 9px",borderRadius:5,fontSize:11,background:sortBy===k?T.redSoft:"transparent",color:sortBy===k?T.red:T.muted,border:`1px solid ${sortBy===k?T.red+"50":T.border}`,cursor:"pointer" }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {filtered.map(c=>(
            <div key={c.id} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"13px 18px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600,marginBottom:5 }}>{c.topic}</div>
                  <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}><Tag color={T.blue}>{c.type}</Tag><Tag color={T.purple}>{c.angle}</Tag><Tag color={T.red}>{c.pain}</Tag><Tag color={T.muted}>{c.date}</Tag></div>
                </div>
                <div style={{ display:"flex",gap:16, marginLeft:12 }}>
                  <Chip label="Reach" value={fmtN(c.reach)} color={T.blue}/>
                  <Chip label="Saves" value={fmtN(c.saves)} color={T.amber}/>
                  <Chip label="Leads" value={c.leadsGenerated} color={T.purple}/>
                  <Chip label="Ventas" value={c.salesLinked} color={T.green}/>
                  <Chip label="Revenue" value={fmt$(c.revenue)} color={T.green}/>
                </div>
                <div style={{ display:"flex",gap:6, marginLeft:12 }}>
                  <Btn variant="ghost" size="sm" onClick={()=>openEdit(c)}>✎</Btn>
                  <Btn variant="danger" size="sm" onClick={()=>onDelete(c.id)}>×</Btn>
                </div>
              </div>
              <div style={{ display:"flex",gap:14 }}>
                <span style={{ fontSize:11,color:T.muted }}>👥 +{c.followers_gained||0} seguidores</span>
                <span style={{ fontSize:11,color:T.muted }}>💬 {c.comments} comentarios</span>
                <span style={{ fontSize:11,color:T.muted }}>↗ {c.shares} shares</span>
              </div>
            </div>
          ))}
          {filtered.length===0&&<div style={{ color:T.muted,textAlign:"center",padding:32 }}>Sin contenido. Agrega el primero.</div>}
        </div>
      </div>

      {showAngles&&<ListEditor title="Ángulos de comunicación" items={angles} onChange={updateAngles} onClose={()=>setShowAngles(false)}/>}
      {showPains&&<ListEditor title="Dolores del cliente" items={pains} onChange={updatePains} onClose={()=>setShowPains(false)}/>}

      {showForm&&(
        <Modal title={editItem?"Editar contenido":"Registrar contenido"} onClose={()=>setShowForm(false)} width={620}>
          <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
            <Row><Field label="Tipo"><select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>{CONTENT_TYPES.map(t=><option key={t}>{t}</option>)}</select></Field><Field label="Fecha"><input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></Field></Row>
            <Field label="Tema / Título"><input value={form.topic} onChange={e=>setForm(p=>({...p,topic:e.target.value}))} placeholder="Ej:5 señales de inflamación crónica"/></Field>
            <Row><Field label="Ángulo de comunicación"><select value={form.angle} onChange={e=>setForm(p=>({...p,angle:e.target.value}))}>{angles.map(a=><option key={a}>{a}</option>)}</select></Field><Field label="Dolor que aborda"><select value={form.pain} onChange={e=>setForm(p=>({...p,pain:e.target.value}))}>{pains.map(p=><option key={p}>{p}</option>)}</select></Field></Row>
            <Divider label="Alcance"/>
            <Row cols={3}><Field label="Reach"><input type="number" value={form.reach} onChange={e=>setForm(p=>({...p,reach:e.target.value}))}/></Field><Field label="Saves"><input type="number" value={form.saves} onChange={e=>setForm(p=>({...p,saves:e.target.value}))}/></Field><Field label="Shares"><input type="number" value={form.shares} onChange={e=>setForm(p=>({...p,shares:e.target.value}))}/></Field></Row>
            <Row cols={3}><Field label="Comentarios"><input type="number" value={form.comments} onChange={e=>setForm(p=>({...p,comments:e.target.value}))}/></Field><Field label="Seguidores ganados"><input type="number" value={form.followers_gained} onChange={e=>setForm(p=>({...p,followers_gained:e.target.value}))}/></Field><Field label="Leads generados"><input type="number" value={form.leadsGenerated} onChange={e=>setForm(p=>({...p,leadsGenerated:e.target.value}))}/></Field></Row>
            <Divider label="Ventas atribuidas"/>
            <Row cols={3}><Field label="Ventas directas"><input type="number" value={form.salesLinked} onChange={e=>setForm(p=>({...p,salesLinked:e.target.value}))}/></Field><Field label="Revenue ($)"><input type="number" value={form.revenue} onChange={e=>setForm(p=>({...p,revenue:e.target.value}))}/></Field><Field label="Cash collected ($)"><input type="number" value={form.cashCollected} onChange={e=>setForm(p=>({...p,cashCollected:e.target.value}))}/></Field></Row>
            <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:6 }}>
              {editItem&&<Btn variant="danger" onClick={()=>{ onDelete(editItem.id); setShowForm(false); }}>Eliminar</Btn>}
              <Btn variant="ghost" onClick={()=>setShowForm(false)}>Cancelar</Btn>
              <Btn onClick={save}>Guardar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ChatLogPanel({ dc, viewMode, filterMonth, onUpdateChat, onDeleteChat }) {
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [calMonth, setCalMonth] = useState(filterMonth || thisMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  if (viewMode === "month") {
    const monthDc = dc.filter(d => getMonth(d.date) === filterMonth).sort((a,b)=>b.date.localeCompare(a.date));
    return (
      <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"16px 18px" }}>
        <div style={{ fontWeight:600,marginBottom:12 }}>Log de chats diarios — {monthLabel(filterMonth)}</div>
        {monthDc.length === 0 && <div style={{ color:"#5A5A78",fontSize:13 }}>Sin registros este mes.</div>}
        <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
          {monthDc.map(d=>(
            <ChatLogRow key={d.id} d={d}
              isEditing={editItem?.id===d.id}
              editForm={editItem?.id===d.id?editForm:null}
              setEditForm={setEditForm}
              onEdit={()=>{setEditItem(d);setEditForm({...d,uniqueChats:String(d.uniqueChats),conversations:String(d.conversations),scheduled:String(d.scheduled)});}}
              onDelete={()=>onDeleteChat(d.id)}
              onSave={()=>{onUpdateChat({...editItem,...editForm,uniqueChats:toNum(editForm.uniqueChats),conversations:toNum(editForm.conversations),scheduled:toNum(editForm.scheduled)});setEditItem(null);}}
              onCancelEdit={()=>setEditItem(null)}/>
          ))}
        </div>

      </div>
    );
  }

  const allMonths = [...new Set(dc.map(d=>getMonth(d.date)))].filter(Boolean).sort().reverse();
  const calDc = dc.filter(d=>getMonth(d.date)===calMonth);
  const [cy, cm] = calMonth.split("-").map(Number);
  const firstDay = new Date(cy, cm-1, 1).getDay();
  const daysInMonth = new Date(cy, cm, 0).getDate();
  const cells = [];
  for (let i=0; i<firstDay; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);
  const dcByDay = {};
  calDc.forEach(d => { const day = parseInt(d.date.split("-")[2]); dcByDay[day] = d; });

  const selectedEntry = selectedDay ? dcByDay[selectedDay] : null;

  return (
    <div style={{ background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"16px 18px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
        <div style={{ fontWeight:600,fontSize:13 }}>Log de chats diarios</div>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          <button onClick={()=>{const i=allMonths.indexOf(calMonth);if(i<allMonths.length-1){setCalMonth(allMonths[i+1]);setSelectedDay(null);}}} style={{background:"none",border:"1px solid #2A2A3E",color:"#9090AA",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:13}}>‹</button>
          <span style={{fontSize:13,fontWeight:600,color:"#EEEEF5",minWidth:80,textAlign:"center"}}>{monthLabel(calMonth)}</span>
          <button onClick={()=>{const i=allMonths.indexOf(calMonth);if(i>0){setCalMonth(allMonths[i-1]);setSelectedDay(null);}}} style={{background:"none",border:"1px solid #2A2A3E",color:"#9090AA",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:13}}>›</button>
        </div>
      </div>

      {/* Day headers */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4 }}>
        {["Do","Lu","Ma","Mi","Ju","Vi","Sá"].map(d=>(
          <div key={d} style={{fontSize:10,color:"#6A6A88",textAlign:"center",padding:"3px 0",fontWeight:600,letterSpacing:"0.04em"}}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:12 }}>
        {cells.map((day,i)=>{
          if(!day) return <div key={`e${i}`}/>;
          const entry = dcByDay[day];
          const hasData = !!entry;
          const isSelected = selectedDay === day;
          return (
            <div key={day}
              onClick={()=>{ if(hasData) setSelectedDay(isSelected ? null : day); }}
              style={{
                borderRadius:7,padding:"6px 2px",textAlign:"center",
                background: isSelected ? "#FF3B5C30" : hasData ? "#252535" : "transparent",
                border:`1px solid ${isSelected ? "#FF3B5C80" : hasData ? "#3A3A55" : "#1E1E2E"}`,
                cursor:hasData?"pointer":"default",
                minHeight:44,display:"flex",flexDirection:"column",
                alignItems:"center",justifyContent:"center",gap:3,
                transition:"all 0.12s"
              }}>
              <div style={{fontSize:12,color:hasData?"#CCCCDD":"#4A4A60",fontWeight:hasData?600:400}}>{day}</div>
              {hasData&&(
                <div style={{fontSize:9,color:isSelected?"#FF6680":"#9090BB",fontFamily:"DM Mono,monospace",fontWeight:600,letterSpacing:"0.02em"}}>
                  {entry.uniqueChats}c
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedEntry && (
        <div style={{ background:"#1A1A2E",border:"1px solid #2A2A45",borderRadius:10,padding:"12px 16px",marginBottom:12 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div>
              <div style={{ fontSize:12,color:"#EEEEF5",fontWeight:600,marginBottom:6 }}>{selectedEntry.date}</div>
              <div style={{ display:"flex",gap:18 }}>
                <span style={{ fontSize:13 }}>💬 <b style={{color:"#7BAFD4"}}>{selectedEntry.uniqueChats}</b> <span style={{fontSize:11,color:"#5A5A78"}}>chats únicos</span></span>
                <span style={{ fontSize:13 }}>🗣 <b style={{color:"#9B6DFF"}}>{selectedEntry.conversations}</b> <span style={{fontSize:11,color:"#5A5A78"}}>convs.</span></span>
                <span style={{ fontSize:13 }}>📅 <b style={{color:"#00E5A0"}}>{selectedEntry.scheduled}</b> <span style={{fontSize:11,color:"#5A5A78"}}>agendas</span></span>
              </div>
            </div>
            <div style={{ display:"flex",gap:6 }}>
              <button onClick={()=>{setEditItem(selectedEntry);setEditForm({...selectedEntry,uniqueChats:String(selectedEntry.uniqueChats),conversations:String(selectedEntry.conversations),scheduled:String(selectedEntry.scheduled)});setSelectedDay(null);}}
                style={{background:"none",border:"1px solid #2A2A3E",color:"#9090AA",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12}}>✎ Editar</button>
              <button onClick={()=>{onDeleteChat(selectedEntry.id);setSelectedDay(null);}}
                style={{background:"none",border:"1px solid #CC444440",color:"#CC5555",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12}}>× Borrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Month summary list */}
      {calDc.length>0&&(
        <div style={{borderTop:"1px solid #1A1A28",paddingTop:10}}>
          <div style={{fontSize:11,color:"#5A5A78",marginBottom:6}}>Todos los registros — {monthLabel(calMonth)}</div>
          <div style={{display:"flex",flexDirection:"column",gap:3,maxHeight:160,overflowY:"auto"}}>
            {calDc.sort((a,b)=>b.date.localeCompare(a.date)).map(d=>(
              <ChatLogRow key={d.id} d={d}
                isEditing={editItem?.id===d.id}
                editForm={editItem?.id===d.id?editForm:null}
                setEditForm={setEditForm}
                onEdit={()=>{setEditItem(d);setEditForm({...d,uniqueChats:String(d.uniqueChats),conversations:String(d.conversations),scheduled:String(d.scheduled)});}}
                onDelete={()=>onDeleteChat(d.id)}
                onSave={()=>{onUpdateChat({...editItem,...editForm,uniqueChats:toNum(editForm.uniqueChats),conversations:toNum(editForm.conversations),scheduled:toNum(editForm.scheduled)});setEditItem(null);}}
                onCancelEdit={()=>setEditItem(null)}/>
            ))}
          </div>
        </div>
      )}


    </div>
  );
}


function ChatLogRow({d, onEdit, onDelete, isEditing, editForm, setEditForm, onSave, onCancelEdit}) {
  if (isEditing && editForm) {
    return (
      <div style={{background:"#1A1A2E",border:"1px solid #2A2A45",borderRadius:8,padding:"10px 12px",marginBottom:4}}>
        <div style={{fontSize:11,color:"#9090AA",marginBottom:8,fontFamily:"DM Mono,monospace"}}>{d.date}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
          {[["Chats únicos","uniqueChats","#7BAFD4"],["Conversaciones","conversations","#9B6DFF"],["Agendas","scheduled","#00E5A0"]].map(([l,k,c])=>(
            <div key={k}>
              <div style={{fontSize:10,color:c,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600}}>{l}</div>
              <input type="number" value={editForm[k]}
                onChange={e=>setEditForm(p=>({...p,[k]:e.target.value}))}
                style={{background:"#0E0E16",border:"1px solid #2A2A3E",color:"#EEEEF5",borderRadius:6,padding:"6px 8px",width:"100%",fontSize:13,fontFamily:"DM Mono,monospace"}}/>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onCancelEdit} style={{background:"none",border:"1px solid #2A2A3E",color:"#6A6A88",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:12}}>Cancelar</button>
          <button onClick={onSave} style={{background:"#FF3B5C",color:"#fff",border:"none",borderRadius:6,padding:"5px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>Guardar</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"7px 4px",borderBottom:"1px solid #1A1A28"}}>
      <span style={{fontFamily:"DM Mono,monospace",fontSize:11,color:"#6A6A88",width:78,flexShrink:0}}>{d.date}</span>
      <span style={{fontSize:12}}>💬 <b style={{color:"#7BAFD4"}}>{d.uniqueChats}</b></span>
      <span style={{fontSize:12}}>🗣 <b style={{color:"#9B6DFF"}}>{d.conversations}</b></span>
      <span style={{fontSize:12}}>📅 <b style={{color:"#00E5A0"}}>{d.scheduled}</b></span>
      <div style={{marginLeft:"auto",display:"flex",gap:4}}>
        <button onClick={onEdit} style={{background:"none",border:"1px solid #2A2A3E",color:"#9090AA",borderRadius:5,padding:"4px 10px",cursor:"pointer",fontSize:11}}>✎</button>
        <button onClick={onDelete} style={{background:"none",border:"1px solid #CC444430",color:"#CC5555",borderRadius:5,padding:"4px 10px",cursor:"pointer",fontSize:11}}>×</button>
      </div>
    </div>
  );
}

function ChatLogEditModal({form, setForm, onSave, onClose}) {
  return (
    <Modal title="Editar registro" onClose={onClose} width={380}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
        {[["Chats únicos","uniqueChats"],["Conversaciones","conversations"],["Agendas","scheduled"]].map(([l,k])=>(
          <div key={k}><label style={{fontSize:10,color:"#5A5A78",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</label><input type="number" value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/></div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={onSave}>Guardar</Btn>
      </div>
    </Modal>
  );
}

function DaysInFunnelChart({ leads }) {
  const closed = leads.filter(l => l.stage === "cerrado" && l.daysInFunnel != null && l.daysInFunnel >= 0);
  if (closed.length === 0) return (
    <div style={{background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px"}}>
      <div style={{fontWeight:600,fontSize:13,marginBottom:14}}>Tiempo promedio en embudo</div>
      <EmptyChart icon="⏱" title="Sin datos aún" hint="Registra fechas de contacto y agenda en los leads cerrados para ver esta métrica"/>
    </div>
  );
  const avg = Math.round(closed.reduce((a,l)=>a+l.daysInFunnel,0)/closed.length);
  
  const BUCKETS = [
    {label:"0–3 días",min:0,max:3,color:"#00E5A0"},
    {label:"4–7 días",min:4,max:7,color:"#4D9FFF"},
    {label:"8–14 días",min:8,max:14,color:"#9B6DFF"},
    {label:"15–30 días",min:15,max:30,color:"#FFB800"},
    {label:"+30 días",min:31,max:9999,color:"#FF3B5C"},
  ];
  const bucketCounts = BUCKETS.map(b=>closed.filter(l=>l.daysInFunnel>=b.min&&l.daysInFunnel<=b.max).length);
  const total = closed.length;

  const ref = useChartJS((Chart, canvas) => new Chart(canvas, {
    type:"doughnut",
    data:{
      labels:BUCKETS.map(b=>b.label),
      datasets:[{data:bucketCounts,backgroundColor:BUCKETS.map(b=>b.color),borderColor:"#13131C",borderWidth:3,hoverOffset:6}]
    },
    options:{responsive:true,maintainAspectRatio:false,cutout:"65%",
      plugins:{legend:{display:false},tooltip:{backgroundColor:"#13131C",titleColor:"#EEEEF5",bodyColor:"#5A5A78",borderColor:"#1A1A28",borderWidth:1,padding:10,callbacks:{label:ctx=>`  ${ctx.raw} leads (${Math.round(ctx.raw/total*100)}%)`}}}
    }
  }), [closed.length, closed.map(l=>l.daysInFunnel).join()]);

  return (
    <div style={{background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div>
          <div style={{fontWeight:600,fontSize:13}}>Tiempo promedio en embudo</div>
          <div style={{fontSize:11,color:"#5A5A78",marginTop:2}}>Desde primer contacto hasta agenda</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:26,fontWeight:700,color:"#FF3B5C",fontFamily:"DM Mono,monospace"}}>{avg}d</div>
          <div style={{fontSize:10,color:"#5A5A78"}}>promedio · {total} leads</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"130px 1fr",gap:16,alignItems:"center"}}>
        <div style={{position:"relative",height:130}}>
          <canvas ref={ref} role="img" aria-label="Distribución de días en embudo"/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {BUCKETS.map((b,i)=>{
            const count = bucketCounts[i];
            const pct = total ? Math.round(count/total*100) : 0;
            return (
              <div key={b.label} style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:b.color,flexShrink:0}}/>
                <span style={{flex:1,fontSize:11,color:"#EEEEF5"}}>{b.label}</span>
                <span style={{fontSize:11,fontFamily:"DM Mono,monospace",color:b.color,fontWeight:600}}>{count}</span>
                <span style={{fontSize:10,color:"#5A5A78",width:32,textAlign:"right"}}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ObjectionsChart({ leads }) {
  const withObj = leads.filter(l=>l.objection&&l.objection!=="Sin objeción"&&l.stage!=="cerrado");
  const objMap = {};
  withObj.forEach(l=>{ objMap[l.objection]=(objMap[l.objection]||0)+1; });
  const entries = Object.entries(objMap).sort((a,b)=>b[1]-a[1]);
  const COLORS=["#FF3B5C","#FFB800","#4D9FFF","#9B6DFF","#00E5A0","#FF6680","#5BCEFF"];
  const total = withObj.length;

  const ref = useChartJS((Chart, canvas) => {
    if(entries.length===0) return null;
    return new Chart(canvas, {
      type:"bar",
      data:{
        labels:entries.map(([o])=>o.length>18?o.slice(0,18)+"…":o),
        datasets:[{data:entries.map(([,v])=>v),backgroundColor:COLORS.slice(0,entries.length).map(c=>c+"88"),borderColor:COLORS.slice(0,entries.length),borderWidth:2,borderRadius:5}]
      },
      options:{responsive:true,maintainAspectRatio:false,indexAxis:"y",
        plugins:{legend:{display:false},tooltip:{backgroundColor:"#13131C",titleColor:"#EEEEF5",bodyColor:"#5A5A78",borderColor:"#1A1A28",borderWidth:1,padding:10,callbacks:{label:ctx=>`  ${ctx.raw} leads (${Math.round(ctx.raw/total*100)}%)`}}},
        scales:{x:{grid:{color:"#1A1A28"},ticks:{color:"#5A5A78",font:{size:10}},beginAtZero:true},y:{grid:{display:false},ticks:{color:"#5A5A78",font:{size:10}}}}
      }
    });
  }, [withObj.length, withObj.map(l=>l.objection).join()]);

  return (
    <div style={{background:"#13131C",border:"1px solid #1A1A28",borderRadius:12,padding:"18px 20px"}}>
      <div style={{fontWeight:600,fontSize:13,marginBottom:14}}>Objeciones más frecuentes</div>
      {entries.length===0
        ? <EmptyChart icon="🛡" title="Sin objeciones registradas" hint="Selecciona la objeción al registrar leads no cerrados para ver el patrón"/>
        : <div style={{position:"relative",height:Math.max(120,entries.length*34)}}><canvas ref={ref} role="img" aria-label="Objeciones más frecuentes"/></div>
      }
    </div>
  );
}

function SalesDash({ clientId, client, leads, dailyChats, cContent, onAddLead, onUpdateLead, onDeleteLead, onAddChat, onUpdateChat, onDeleteChat, onUpdateClient }) {
  const buyReasons = (client && client.buyReasons) || [];
  const programs = (client && client.programs) || [];
  const objections = (client && client.objections) || [];
  const updateBuyReasons = list => onUpdateClient({...client, buyReasons:list});
  const updatePrograms = list => onUpdateClient({...client, programs:list});
  const updateObjections = list => onUpdateClient({...client, objections:list});
  const [viewMode, setViewMode] = useState("general");
  const [filterMonth, setFilterMonth] = useState(thisMonth());
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showChatForm, setShowChatForm] = useState(false);
  const [showBuyReasons, setShowBuyReasons] = useState(false);
  const [showObjections, setShowObjections] = useState(false);
  const [showPrograms, setShowPrograms] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const emptyLead = { name:"", source:"", stage:"nuevo lead", date:new Date().toISOString().split("T")[0], showedUp:null, notes:"", saleAmount:0, cashCollected:0, isUpsell:false, isResell:false, buyReason:"" };
  const [leadForm, setLeadForm] = useState(emptyLead);
  const [chatForm, setChatForm] = useState({ date:new Date().toISOString().split("T")[0], uniqueChats:0, conversations:0, scheduled:0 });

  const displayedLeads = viewMode==="month" ? leads.filter(l=>getMonth(l.date)===filterMonth) : leads;
  const displayedChats = viewMode==="month" ? dailyChats.filter(d=>getMonth(d.date)===filterMonth) : dailyChats;

  const closed = displayedLeads.filter(l=>l.stage==="cerrado");
  const showedUp = displayedLeads.filter(l=>l.showedUp===true);
  const noShow = displayedLeads.filter(l=>l.showedUp===false);
  const upsells = displayedLeads.filter(l=>l.isUpsell);
  const resells = displayedLeads.filter(l=>l.isResell);
  const totalRevClosed = closed.reduce((a,l)=>a+(l.saleAmount||0),0);
  const totalCashClosed = closed.reduce((a,l)=>a+(l.cashCollected||0),0);
  const totalChats = displayedChats.reduce((a,d)=>a+d.uniqueChats,0);
  const totalConvs = displayedChats.reduce((a,d)=>a+d.conversations,0);
  const totalSched = displayedChats.reduce((a,d)=>a+d.scheduled,0);
  const schedulingRate = pct(totalSched, totalConvs);
  const showUpRate = pct(showedUp.length, showedUp.length+noShow.length);
  const closingRate = pct(closed.length, showedUp.length);
  const noShowRate = pct(noShow.length, showedUp.length+noShow.length);

  const openEdit = (lead) => { setEditLead(lead); setLeadForm({...lead, saleAmount:String(lead.saleAmount||""), cashCollected:String(lead.cashCollected||""), firstContactDate:lead.firstContactDate||"", scheduledDate:lead.scheduledDate||"", callLink:lead.callLink||"", program:lead.program||"", paymentType:lead.paymentType||"", buyReason:lead.buyReason||"", objection:lead.objection||""}); setShowLeadForm(true); };
  const saveLead = () => {
    const daysInFunnel = (leadForm.firstContactDate && leadForm.scheduledDate)
      ? Math.max(0, Math.round((new Date(leadForm.scheduledDate)-new Date(leadForm.firstContactDate))/(1000*60*60*24)))
      : null;
    const data = { ...leadForm, clientId, saleAmount:toNum(leadForm.saleAmount), cashCollected:toNum(leadForm.cashCollected), daysInFunnel };
    if(editLead) onUpdateLead({...data, id:editLead.id});
    else onAddLead({...data, id:uid()});
    setShowLeadForm(false); setEditLead(null); setLeadForm(emptyLead);
  };
  const saveChat = () => {
    onAddChat({...chatForm, id:uid(), clientId, uniqueChats:toNum(chatForm.uniqueChats), conversations:toNum(chatForm.conversations), scheduled:toNum(chatForm.scheduled)});
    setShowChatForm(false);
    setChatForm({ date:new Date().toISOString().split("T")[0], uniqueChats:"", conversations:"", scheduled:"" });
  };

  const onDragStart = (e, lead) => { e.dataTransfer.setData("leadId", lead.id); };
  const onDrop = (e, stageId) => {
    const id = e.dataTransfer.getData("leadId");
    const lead = leads.find(l=>l.id===id);
    if(lead) onUpdateLead({...lead, stage:stageId});
    setDragOver(null);
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>
          <div className="syne" style={{ fontSize:20,fontWeight:800 }}>Dashboard de Ventas</div>
          <div style={{ color:T.muted,fontSize:12,marginTop:2 }}>Pipeline desde DMs · métricas de conversión · seguimiento diario</div>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <Btn variant="ghost" size="sm" onClick={()=>setShowBuyReasons(true)}>✎ Razones</Btn>
          <Btn variant="ghost" size="sm" onClick={()=>setShowObjections(true)}>✎ Objeciones</Btn>
          <Btn variant="ghost" size="sm" onClick={()=>setShowPrograms(true)}>✎ Programas</Btn>
          <Btn variant="subtle" size="sm" onClick={()=>setShowChatForm(true)}>+ Chats del día</Btn>
          <Btn onClick={()=>{ setEditLead(null); setLeadForm(emptyLead); setShowLeadForm(true); }}>+ Nuevo lead</Btn>
        </div>
      </div>

      <div style={{ display:"flex",gap:12,alignItems:"center" }}>
        <TabBar tabs={[{id:"general",label:"General"},{id:"month",label:"Por mes"}]} active={viewMode} onChange={setViewMode}/>
        {viewMode==="month"&&<div style={{ width:180 }}><input type="month" value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{ padding:"6px 10px",fontSize:13 }}/></div>}
      </div>

      {/* KPIs */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12 }}>
        <KPI label="Revenue cerrado" value={fmt$(totalRevClosed)} color={T.green} accent/>
        <KPI label="Cash collected" value={fmt$(totalCashClosed)} color={T.green}/>
        <KPI label="Ventas cerradas" value={closed.length} color={T.green}/>
        <KPI label="Upsells" value={upsells.length} sub={fmt$(upsells.reduce((a,l)=>a+(l.saleAmount||0),0))} color={T.purple}/>
        <KPI label="Resells" value={resells.length} sub={fmt$(resells.reduce((a,l)=>a+(l.saleAmount||0),0))} color={T.blue}/>
        <KPI label="Chats únicos" value={totalChats} sub="Nuevos DMs abiertos" color={T.blue}/>
        <KPI label="Conversaciones" value={totalConvs} color={T.blue}/>
        <KPI label="Agendas" value={totalSched} color={T.purple}/>
        <KPI label="% Agendamiento" value={`${schedulingRate}%`} sub="Convs → agendas" color={T.purple} accent/>
        <KPI label="Show-up rate" value={`${showUpRate}%`} color={showUpRate>=70?T.green:T.amber} accent/>
        <KPI label="Closing rate" value={`${closingRate}%`} color={closingRate>=30?T.green:T.red} accent/>
        <KPI label="No-show rate" value={`${noShowRate}%`} color={noShowRate>30?T.red:T.amber}/>
      </div>

      <FunnelChart
        chats={totalChats}
        convs={totalConvs}
        scheduled={totalSched}
        showedUp={showedUp.length}
        closed={closed.length}
      />

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        <LeadsTimelineChart leads={displayedLeads}/>
        <BuyReasonsDonut leads={displayedLeads}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <DaysInFunnelChart leads={displayedLeads}/>
        <ObjectionsChart leads={displayedLeads}/>
      </div>

      {/* DAILY CHATS LOG */}
      {dailyChats.length>0&&(
        <ChatLogPanel dc={dailyChats} viewMode={viewMode} filterMonth={filterMonth} onUpdateChat={onUpdateChat} onDeleteChat={onDeleteChat}/>
      )}

      {/* PIPELINE KANBAN con drag & drop */}
      <div>
        <div style={{ fontWeight:600,marginBottom:12 }}>Pipeline</div>
        <div style={{ display:"flex",gap:10,overflowX:"auto", paddingBottom:8 }}>
          {LEAD_STAGES.map(stage=>{
            const stageleads = displayedLeads.filter(l=>l.stage===stage.id);
            const stageRev = stageleads.reduce((a,l)=>a+(l.saleAmount||0),0);
            return (
              <div key={stage.id} style={{ minWidth:190,flexShrink:0 }}
                onDragOver={e=>{ e.preventDefault(); setDragOver(stage.id); }}
                onDragLeave={()=>setDragOver(null)}
                onDrop={e=>onDrop(e,stage.id)}>
                <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:10,padding:"6px 10px",background:dragOver===stage.id?stage.color+"20":T.surface,borderRadius:8,border:`1px solid ${dragOver===stage.id?stage.color+"50":T.border}`,transition:"all .15s" }}>
                  <div style={{ width:7,height:7,borderRadius:"50%",background:stage.color }}/>
                  <span style={{ fontWeight:600,fontSize:11,flex:1 }}>{stage.label}</span>
                  <span style={{ background:T.dim,color:T.muted,borderRadius:8,padding:"1px 7px",fontSize:10 }}>{stageleads.length}</span>
                  {stageRev>0&&<span className="mono" style={{ fontSize:10,color:T.green }}>{fmt$(stageRev)}</span>}
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                  {stageleads.map(lead=>(
                    <div key={lead.id} draggable onDragStart={e=>onDragStart(e,lead)}
                      style={{ background:T.card,border:`1px solid ${T.border}`, borderLeft:`3px solid ${stage.color}`,borderRadius:10,padding:12,cursor:"grab", userSelect:"none" }}>
                      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                        <span style={{ fontWeight:600,fontSize:12 }}>{lead.name}</span>
                        <button onClick={()=>openEdit(lead)} style={{ background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:12 }}>✎</button>
                      </div>
                      <div style={{ fontSize:11,color:T.muted,marginBottom:6 }}>{lead.source}</div>
                      {lead.saleAmount>0&&<div className="mono" style={{ fontSize:12,color:T.green,marginBottom:4 }}>{fmt$(lead.saleAmount)}{lead.cashCollected<lead.saleAmount?` (${fmt$(lead.cashCollected)} cash)`:""}
                      </div>}
                      <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
                        {lead.showedUp===true&&<Tag color={T.green}>Show ✓</Tag>}
                        {lead.showedUp===false&&<Tag color={T.amber}>No show</Tag>}
                        {lead.isUpsell&&<Tag color={T.purple}>🔼</Tag>}
                        {lead.isResell&&<Tag color={T.blue}>♻</Tag>}
                      </div>
                    </div>
                  ))}
                  {stageleads.length===0&&<div style={{ borderRadius:10,padding:"14px",border:`1px dashed ${T.border}`,fontSize:11,color:T.muted,textAlign:"center" }}>Vacío</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showObjections&&<ListEditor title="Objeciones / motivos de no cierre" items={objections} onChange={updateObjections} onClose={()=>setShowObjections(false)}/>}
      {showPrograms&&<ListEditor title="Programas ofrecidos" items={programs} onChange={updatePrograms} onClose={()=>setShowPrograms(false)}/>}
      {showBuyReasons&&<ListEditor title="Razones de compra" items={buyReasons} onChange={updateBuyReasons} onClose={()=>setShowBuyReasons(false)}/>}

      {showChatForm&&(
        <Modal title="Registrar chats del día" onClose={()=>setShowChatForm(false)} width={420}>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <Field label="Fecha"><input type="date" value={chatForm.date} onChange={e=>setChatForm(p=>({...p,date:e.target.value}))}/></Field>
            <Row cols={3}>
              <Field label="Chats únicos"><input type="number" value={chatForm.uniqueChats} onChange={e=>setChatForm(p=>({...p,uniqueChats:e.target.value}))}/></Field>
              <Field label="Conversaciones"><input type="number" value={chatForm.conversations} onChange={e=>setChatForm(p=>({...p,conversations:e.target.value}))}/></Field>
              <Field label="Agendas"><input type="number" value={chatForm.scheduled} onChange={e=>setChatForm(p=>({...p,scheduled:e.target.value}))}/></Field>
            </Row>
            <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
              <Btn variant="ghost" onClick={()=>setShowChatForm(false)}>Cancelar</Btn>
              <Btn onClick={saveChat}>Registrar</Btn>
            </div>
          </div>
        </Modal>
      )}

      {showLeadForm&&(
        <Modal title={editLead?"Editar lead":"Nuevo lead"} onClose={()=>setShowLeadForm(false)} width={640}>
          <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
            <Row><Field label="Nombre"><input value={leadForm.name} onChange={e=>setLeadForm(p=>({...p,name:e.target.value}))} placeholder="Nombre del lead"/></Field>
            <Field label="Fuente (contenido)">
              <select value={leadForm.source} onChange={e=>setLeadForm(p=>({...p,source:e.target.value}))}>
                <option value="">— Seleccionar contenido —</option>
                {cContent.map(c=><option key={c.id} value={`${c.type}: ${c.topic}`}>{c.type}: {c.topic.slice(0,40)}{c.topic.length>40?"...":""}</option>)}
                <option value="__custom__">✎ Escribir manualmente...</option>
              </select>
              {leadForm.source==="__custom__"&&<input style={{marginTop:6}} value={leadForm.sourceCustom||""} onChange={e=>setLeadForm(p=>({...p,sourceCustom:e.target.value}))} placeholder="Describe la fuente..."/>}
            </Field></Row>
            <Row><Field label="Etapa"><select value={leadForm.stage} onChange={e=>setLeadForm(p=>({...p,stage:e.target.value}))}>{LEAD_STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></Field>
            <Field label="Programa ofrecido"><select value={leadForm.program} onChange={e=>setLeadForm(p=>({...p,program:e.target.value}))}>
              <option value="">— Seleccionar —</option>
              {programs.map(r=><option key={r}>{r}</option>)}
            </select></Field></Row>
            <Row><Field label="Fecha de primer contacto"><input type="date" value={leadForm.firstContactDate} onChange={e=>setLeadForm(p=>({...p,firstContactDate:e.target.value}))}/></Field>
            <Field label="Fecha de agenda"><input type="date" value={leadForm.scheduledDate} onChange={e=>setLeadForm(p=>({...p,scheduledDate:e.target.value}))}/></Field></Row>
            {leadForm.firstContactDate&&leadForm.scheduledDate&&(
              <div style={{background:"#1A1A28",borderRadius:8,padding:"8px 14px",fontSize:12,color:"#5A5A78"}}>
                ⏱ <span style={{color:"#EEEEF5",fontWeight:600}}>{Math.max(0,Math.round((new Date(leadForm.scheduledDate)-new Date(leadForm.firstContactDate))/(1000*60*60*24)))} días</span> desde primer contacto hasta agenda
              </div>
            )}
            <Field label="¿Hizo show-up?">
              <div style={{display:"flex",gap:8,marginTop:4}}>
                {[["true","Sí ✓",T.green],["false","No show",T.amber],["null","N/A",T.muted]].map(([v,l,c])=>(
                  <button key={v} onClick={()=>setLeadForm(p=>({...p,showedUp:v==="null"?null:v==="true"}))} style={{flex:1,padding:"7px",borderRadius:8,border:`1px solid ${(leadForm.showedUp===null&&v==="null")||(String(leadForm.showedUp)===v)?c+"60":T.border}`,background:(leadForm.showedUp===null&&v==="null")||(String(leadForm.showedUp)===v)?c+"20":"transparent",color:(leadForm.showedUp===null&&v==="null")||(String(leadForm.showedUp)===v)?c:T.muted,cursor:"pointer",fontSize:12,fontWeight:600}}>{l}</button>
                ))}
              </div>
            </Field>
            <Row><Field label="Monto de venta ($)"><input type="number" value={leadForm.saleAmount} onChange={e=>setLeadForm(p=>({...p,saleAmount:e.target.value}))}/></Field>
            <Field label="Cash collected ($)"><input type="number" value={leadForm.cashCollected} onChange={e=>setLeadForm(p=>({...p,cashCollected:e.target.value}))}/></Field></Row>
            <Field label="Forma de pago">
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
                {["Upfront","2 cuotas","3 cuotas","4 cuotas","Especial"].map(pt=>(
                  <button key={pt} onClick={()=>setLeadForm(p=>({...p,paymentType:p.paymentType===pt?"":pt}))} style={{padding:"5px 12px",borderRadius:8,fontSize:12,border:`1px solid ${leadForm.paymentType===pt?T.green+"60":T.border}`,background:leadForm.paymentType===pt?T.greenSoft:"transparent",color:leadForm.paymentType===pt?T.green:T.muted,cursor:"pointer"}}>{pt}</button>
                ))}
              </div>
            </Field>
            <Field label="Razón de compra"><select value={leadForm.buyReason} onChange={e=>setLeadForm(p=>({...p,buyReason:e.target.value}))}><option value="">— Seleccionar —</option>{buyReasons.map(r=><option key={r}>{r}</option>)}</select></Field>
            <Field label="Objeción / motivo de no cierre"><select value={leadForm.objection} onChange={e=>setLeadForm(p=>({...p,objection:e.target.value}))}><option value="">— Seleccionar —</option>{objections.map(o=><option key={o}>{o}</option>)}</select></Field>
            <Field label="Link de llamada"><input value={leadForm.callLink} onChange={e=>setLeadForm(p=>({...p,callLink:e.target.value}))} placeholder="https://..."/></Field>
            <div style={{display:"flex",gap:8}}>
              {[["isUpsell","🔼 Upsell",T.purple],["isResell","♻ Resell",T.blue]].map(([k,l,c])=>(
                <button key={k} onClick={()=>setLeadForm(p=>({...p,[k]:!p[k]}))} style={{flex:1,padding:"7px",borderRadius:8,border:`1px solid ${leadForm[k]?c+"60":T.border}`,background:leadForm[k]?c+"20":"transparent",color:leadForm[k]?c:T.muted,cursor:"pointer",fontSize:12}}>{l}</button>
              ))}
            </div>
            <Field label="Notas"><textarea value={leadForm.notes} onChange={e=>setLeadForm(p=>({...p,notes:e.target.value}))} placeholder="Contexto del lead..."/></Field>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              {editLead&&<Btn variant="danger" onClick={()=>{onDeleteLead(editLead.id);setShowLeadForm(false);}}>Eliminar</Btn>}
              <Btn variant="ghost" onClick={()=>setShowLeadForm(false)}>Cancelar</Btn>
              <Btn onClick={saveLead}>Guardar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ProductsDash({ clientId, products, leads, onAdd, onUpdate, onDelete }) {
  const [viewMode, setViewMode] = useState("general");
  const [filterMonth, setFilterMonth] = useState(thisMonth());
  const [showForm, setShowForm] = useState(false);
  const [editP, setEditP] = useState(null);
  const [form, setForm] = useState({ name:"", price:"", type:"one-time", active:true });

  const closedLeads = leads.filter(l=>l.stage==="cerrado"&&toNum(l.saleAmount)>0);
  const displayedLeads = viewMode==="month" ? closedLeads.filter(l=>getMonth(l.date)===filterMonth) : closedLeads;

  const productSalesFromPipeline = {};
  closedLeads.forEach(l => {
    if (l.program) productSalesFromPipeline[l.program] = (productSalesFromPipeline[l.program]||0)+1;
  });
  
  const enrichedProducts = products.map(p => ({
    ...p,
    pipelineSales: productSalesFromPipeline[p.name] || 0,
    pipelineRevenue: (productSalesFromPipeline[p.name]||0) * toNum(p.price),
  }));
  const totalRevenue = enrichedProducts.reduce((a,p)=>a+p.pipelineRevenue, 0) || enrichedProducts.reduce((a,p)=>a+toNum(p.price)*toNum(p.sales),0);
  const upsells = displayedLeads.filter(l=>l.isUpsell);
  const resells = displayedLeads.filter(l=>l.isResell);
  const avgLTV = closedLeads.length ? Math.round(closedLeads.reduce((a,l)=>a+toNum(l.saleAmount),0)/closedLeads.length) : 0;
  const uniqueBuyers = new Set(closedLeads.map(l=>l.name)).size;
  const topProduct = [...enrichedProducts].sort((a,b)=>(b.pipelineSales||b.sales)-(a.pipelineSales||a.sales))[0];

  const openEdit = (p) => { setEditP(p); setForm(p); setShowForm(true); };
  const save = () => {
    const data = { ...form, price:+form.price||0, clientId };
    if(editP) onUpdate({...data, id:editP.id, sales:editP.sales});
    else onAdd({...data, id:uid(), sales:0});
    setShowForm(false); setEditP(null); setForm({ name:"", price:"", type:"one-time", active:true });
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>
          <div className="syne" style={{ fontSize:20,fontWeight:800 }}>Productos & LTV</div>
          <div style={{ color:T.muted,fontSize:12,marginTop:2 }}>Catálogo · LTV · upsells · resells</div>
        </div>
        <Btn onClick={()=>{ setEditP(null); setShowForm(true); }}>+ Producto</Btn>
      </div>

      <div style={{ display:"flex",gap:12,alignItems:"center" }}>
        <TabBar tabs={[{id:"general",label:"General"},{id:"month",label:"Por mes"}]} active={viewMode} onChange={setViewMode}/>
        {viewMode==="month"&&<div style={{ width:180 }}><input type="month" value={filterMonth} onChange={e=>setFilterMonth(e.target.value)} style={{ padding:"6px 10px",fontSize:13 }}/></div>}
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12 }}>
        <KPI label="Revenue productos" value={fmt$(totalRevenue)} color={T.green} accent/>
        <KPI label="LTV promedio" value={fmt$(avgLTV)} sub="Por cliente cerrado" color={T.gold} accent/>
        <KPI label="Compradores únicos" value={uniqueBuyers} color={T.blue}/>
        <KPI label="Upsell rate" value={`${pct(upsells.length,closedLeads.length)}%`} sub={`${upsells.length} upsells`} color={T.purple}/>
        <KPI label="Resell rate" value={`${pct(resells.length,closedLeads.length)}%`} sub={`${resells.length} resells`} color={T.blue}/>
        <KPI label="Productos activos" value={products.filter(p=>p.active).length} color={T.amber}/>
      </div>

      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden" }}>
        <div style={{ padding:"13px 18px", borderBottom:`1px solid ${T.border}`, display:"flex",justifyContent:"space-between" }}>
          <span style={{ fontWeight:600 }}>Catálogo</span>
          {topProduct&&<span style={{ fontSize:12,color:T.green }}>🏆 Top: {topProduct.name}</span>}
        </div>
        {products.map((p,i)=>(
          <div key={p.id} onClick={()=>openEdit(p)} style={{ display:"flex",alignItems:"center",gap:14,padding:"13px 18px", borderBottom:i<products.length-1?`1px solid ${T.border}`:"none",cursor:"pointer" }}>
            <div style={{ width:34,height:34,borderRadius:8,background:p.active?T.greenSoft:T.dim, display:"flex",alignItems:"center",justifyContent:"center" }}>
              <span style={{ fontSize:14 }}>{p.type==="recurring"?"🔄":"⚡"}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600 }}>{p.name} {p.id===topProduct?.id&&<span style={{ fontSize:10,color:T.green }}>🏆</span>}</div>
              <div style={{ fontSize:12,color:T.muted }}>{p.type==="recurring"?"Recurrente":"One-time"} · {enrichedProducts.find(ep=>ep.id===p.id)?.pipelineSales||toNum(p.sales)} ventas (pipeline)</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div className="mono" style={{ fontWeight:700,color:T.green }}>{fmt$(p.price)}</div>
              <div style={{ fontSize:11,color:T.muted }}>{fmt$(toNum(p.price)*toNum(p.sales))} total</div>
            </div>
            <div style={{ width:90 }}><ProgressBar value={p.sales} max={Math.max(...products.map(x=>x.sales),1)} color={T.green}/></div>
            <Tag color={p.active?T.green:T.muted}>{p.active?"Activo":"Inactivo"}</Tag>
          </div>
        ))}
        {products.length===0&&<div style={{ padding:32,textAlign:"center",color:T.muted }}>Sin productos.</div>}
      </div>

      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 18px" }}>
        <div style={{ fontWeight:600,marginBottom:12 }}>Historial upsells & resells</div>
        {[...upsells.map(l=>({...l,tag:"upsell"}))]
          .concat(resells.map(l=>({...l,tag:"resell"})))
          .sort((a,b)=>(b.date||"").localeCompare(a.date||""))
          .slice(0,8).map(l=>(
          <div key={l.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"7px 0", borderBottom:`1px solid ${T.border}` }}>
            <Tag color={l.tag==="upsell"?T.purple:T.blue}>{l.tag==="upsell"?"🔼 Upsell":"♻ Resell"}</Tag>
            <span style={{ flex:1,fontSize:13 }}>{l.name}</span>
            <span style={{ fontSize:11,color:T.muted }}>{l.source}</span>
            <span className="mono" style={{ color:T.green,fontWeight:600 }}>{fmt$(l.saleAmount)}</span>
          </div>
        ))}
        {upsells.length+resells.length===0&&<div style={{ color:T.muted,fontSize:12 }}>Sin upsells ni resells registrados.</div>}
      </div>

      {showForm&&(
        <Modal title={editP?"Editar producto":"Nuevo producto"} onClose={()=>setShowForm(false)} width={440}>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <Field label="Nombre"><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Plan Premium 3 meses"/></Field>
            <Row><Field label="Precio ($)"><input type="number" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))}/></Field><Field label="Tipo"><select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}><option value="one-time">One-time</option><option value="recurring">Recurrente</option></select></Field></Row>
            <Field label="Estado">
              <div style={{ display:"flex",gap:8,marginTop:4 }}>
                {[["true","Activo",T.green],["false","Inactivo",T.muted]].map(([v,l,c])=>(
                  <button key={v} onClick={()=>setForm(p=>({...p,active:v==="true"}))} style={{ flex:1,padding:"7px",borderRadius:8,border:`1px solid ${String(form.active)===v?c+"60":T.border}`,background:String(form.active)===v?c+"20":"transparent",color:String(form.active)===v?c:T.muted,cursor:"pointer",fontSize:12 }}>{l}</button>
                ))}
              </div>
            </Field>
            <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
              {editP&&<Btn variant="danger" onClick={()=>{ onDelete(editP.id); setShowForm(false); }}>Eliminar</Btn>}
              <Btn variant="ghost" onClick={()=>setShowForm(false)}>Cancelar</Btn>
              <Btn onClick={save}>Guardar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function BillingDash({ clients, allBilling, selectedClient, showAll, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editB, setEditB] = useState(null);
  const [form, setForm] = useState({ clientId:selectedClient, month:thisMonth(), totalRevenue:"", cashCollected:"", revShare:30, revShareCollected:false, notes:"" });
  const client = clients.find(c=>c.id===selectedClient);

  const displayed = showAll ? allBilling : allBilling.filter(b=>b.clientId===selectedClient);
  const totalRev = displayed.reduce((a,b)=>a+b.totalRevenue,0);
  const totalCash = displayed.reduce((a,b)=>a+b.cashCollected,0);
  const totalMyEarned = displayed.reduce((a,b)=>a+b.revShareEarned,0);
  const totalMyCash = displayed.filter(b=>b.revShareCollected).reduce((a,b)=>a+b.revShareEarned,0);
  const totalMyPending = displayed.filter(b=>!b.revShareCollected).reduce((a,b)=>a+b.revShareEarned,0);
  const stagnant = totalRev - totalCash;

  const openEdit = (b) => { setEditB(b); setForm({...b, totalRevenue:b.totalRevenue, cashCollected:b.cashCollected}); setShowForm(true); };
  const save = () => {
    const rev = +form.totalRevenue||0, cash = +form.cashCollected||0, rs = +form.revShare||0;
    const revShareEarned = Math.round(rev*(rs/100));
    const data = { ...form, totalRevenue:rev, cashCollected:cash, revShare:rs, revShareEarned };
    if(editB) onUpdate({...data, id:editB.id});
    else onAdd({...data, id:uid()});
    setShowForm(false); setEditB(null);
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>
          <div className="syne" style={{ fontSize:20,fontWeight:800 }}>Facturación</div>
          <div style={{ color:T.muted,fontSize:12,marginTop:2 }}>Revenue bruto · cash collected · tu corte · dinero estancado</div>
        </div>
        <Btn onClick={()=>{ setEditB(null); setForm({ clientId:selectedClient, month:thisMonth(), totalRevenue:"", cashCollected:"", revShare:client?.revShare||30, revShareCollected:false, notes:"" }); setShowForm(true); }}>+ Registrar mes</Btn>
      </div>

      {/* EXPLAINER */}
      <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 16px",fontSize:12,color:T.muted,lineHeight:1.7 }}>
        <span style={{ color:T.text,fontWeight:600 }}>¿Cómo funciona? </span>
        Cada mes registras: <span style={{ color:T.green }}>Revenue bruto</span> (lo que tu cliente facturó en total) · <span style={{ color:T.green }}>Cash collected</span> (lo que realmente cobró de ese revenue) · La diferencia es el <span style={{ color:T.amber }}>dinero estancado</span>. Tu corte se calcula automáticamente según el % de rev. share del mes.
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12 }}>
        <KPI label="Facturación total" value={fmt$(totalRev)} sub="Revenue bruto" color={T.green} accent/>
        <KPI label="Cash collected total" value={fmt$(totalCash)} color={T.green}/>
        <KPI label="Dinero estancado" value={fmt$(stagnant)} sub="Facturado sin cobrar" color={T.amber} accent/>
        <KPI label="Mi corte total" value={fmt$(totalMyEarned)} sub="Rev. share generado" color={T.gold}/>
        <KPI label="Mi cash cobrado" value={fmt$(totalMyCash)} color={T.gold} accent/>
        <KPI label="Mi pendiente" value={fmt$(totalMyPending)} sub="Por cobrar" color={T.amber} accent/>
      </div>

      <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden" }}>
        <div style={{ padding:"13px 18px", borderBottom:`1px solid ${T.border}` }}><span style={{ fontWeight:600 }}>Historial mensual</span></div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:T.surface }}>
              {(!showAll?["Mes","Revenue","Cash","Estancado","Mi corte","Estado",""]
                :["Cliente","Mes","Revenue","Cash","Estancado","Mi corte","Estado",""]).map(h=>(
                <th key={h} style={{ padding:"9px 14px",fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"left",whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {displayed.sort((a,b)=>b.month.localeCompare(a.month)).map(b=>{
                const delta = b.totalRevenue-b.cashCollected;
                const cli = clients.find(c=>c.id===b.clientId);
                return (
                  <tr key={b.id} style={{ borderBottom:`1px solid ${T.border}` }}>
                    {showAll&&<td style={{ padding:"11px 14px",fontSize:12 }}><div style={{ display:"flex",alignItems:"center",gap:8 }}><ClientAvatar client={cli||{name:"?",avatar:"?"}} size={20}/><span>{cli?.name}</span></div></td>}
                    <td className="mono" style={{ padding:"11px 14px",fontSize:12 }}>{monthLabel(b.month)}</td>
                    <td style={{ padding:"11px 14px",color:T.green,fontFamily:"DM Mono",fontSize:12 }}>{fmt$(b.totalRevenue)}</td>
                    <td style={{ padding:"11px 14px",fontFamily:"DM Mono",fontSize:12 }}>{fmt$(b.cashCollected)}</td>
                    <td style={{ padding:"11px 14px",color:delta>0?T.amber:T.muted,fontFamily:"DM Mono",fontSize:12 }}>{delta>0?`-${fmt$(delta)}`:"—"}</td>
                    <td style={{ padding:"11px 14px",color:T.red,fontFamily:"DM Mono",fontSize:12 }}>{fmt$(b.revShareEarned)} <span style={{ color:T.muted,fontSize:10 }}>({b.revShare}%)</span></td>
                    <td style={{ padding:"11px 14px" }}>
                      <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                        <Tag color={b.revShareCollected?T.green:T.amber}>{b.revShareCollected?"Cobrado":"Pendiente"}</Tag>
                        {!b.revShareCollected&&<Btn variant="success" size="sm" onClick={()=>onUpdate({...b,revShareCollected:true})}>✓</Btn>}
                      </div>
                    </td>
                    <td style={{ padding:"11px 14px" }}>
                      <div style={{ display:"flex",gap:4 }}>
                        <Btn variant="ghost" size="sm" onClick={()=>openEdit(b)}>✎</Btn>
                        <Btn variant="danger" size="sm" onClick={()=>onDelete(b.id)}>×</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {displayed.length===0&&<div style={{ padding:32,textAlign:"center",color:T.muted }}>Sin meses registrados.</div>}
        </div>
      </div>

      {showForm&&(
        <Modal title={editB?"Editar mes":"Registrar mes"} onClose={()=>setShowForm(false)} width={500}>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {showAll&&<Field label="Cliente"><select value={form.clientId} onChange={e=>{ const c=clients.find(x=>x.id===e.target.value); setForm(p=>({...p,clientId:e.target.value,revShare:c?.revShare||30})); }}>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>}
            <Row>
              <Field label="Mes"><input type="month" value={form.month} onChange={e=>setForm(p=>({...p,month:e.target.value}))}/></Field>
              <Field label="Rev. share (%)"><input type="number" value={form.revShare} onChange={e=>setForm(p=>({...p,revShare:+e.target.value}))}/></Field>
            </Row>
            <Row>
              <Field label="Revenue bruto ($)"><input type="number" value={form.totalRevenue} onChange={e=>setForm(p=>({...p,totalRevenue:e.target.value}))} placeholder="3250"/></Field>
              <Field label="Cash collected ($)"><input type="number" value={form.cashCollected} onChange={e=>setForm(p=>({...p,cashCollected:e.target.value}))} placeholder="1820"/></Field>
            </Row>
            <div style={{ background:T.surface,borderRadius:8,padding:12,fontSize:13 }}>
              Tu corte estimado (<span style={{ color:T.red }}>{form.revShare}%</span>): <span style={{ color:T.red,fontWeight:700,fontFamily:"DM Mono" }}>{fmt$(Math.round((+form.totalRevenue||0)*form.revShare/100))}</span>
              {form.totalRevenue&&form.cashCollected&&<span style={{ color:T.amber, marginLeft:16 }}>Estancado: <span style={{ fontFamily:"DM Mono" }}>{fmt$((+form.totalRevenue||0)-(+form.cashCollected||0))}</span></span>}
            </div>
            <Field label="Notas (opcional)"><input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Obs del mes..."/></Field>
            <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
              {editB&&<Btn variant="danger" onClick={()=>{ onDelete(editB.id); setShowForm(false); }}>Eliminar</Btn>}
              <Btn variant="ghost" onClick={()=>setShowForm(false)}>Cancelar</Btn>
              <Btn onClick={save}>Guardar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function EditClientModal({ client, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({...client});
  const photoRef = useRef();
  const handlePhoto = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(p=>({...p,photo:ev.target.result}));
    reader.readAsDataURL(file);
  };
  return (
    <Modal title="Editar cliente" onClose={onClose}>
      <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
        <div style={{ display:"flex",gap:16,alignItems:"center" }}>
          <div onClick={()=>photoRef.current.click()} style={{ width:64,height:64,borderRadius:10,overflow:"hidden",cursor:"pointer",border:`2px dashed ${T.border}`,flexShrink:0, display:"flex",alignItems:"center",justifyContent:"center" }}>
            {form.photo?<img src={form.photo} style={{ width:"100%",height:"100%", objectFit:"cover" }}/>:<span style={{ color:T.muted,fontSize:22 }}>📷</span>}
          </div>
          <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto}/>
          <Field label="Nombre"><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></Field>
        </div>
        <Row><Field label="Nicho"><input value={form.niche} onChange={e=>setForm(p=>({...p,niche:e.target.value}))}/></Field><Field label="Instagram"><input value={form.ig} onChange={e=>setForm(p=>({...p,ig:e.target.value}))}/></Field></Row>
        <Row><Field label="Seguidores"><input value={form.followers} onChange={e=>setForm(p=>({...p,followers:e.target.value}))}/></Field><Field label="Rev. Share (%)"><input type="number" value={form.revShare} onChange={e=>setForm(p=>({...p,revShare:+e.target.value}))}/></Field></Row>
        <Field label="Estado">
          <div style={{ display:"flex",gap:8,marginTop:4 }}>
            {[["active","Activo",T.green],["inactive","Inactivo",T.muted]].map(([v,l,c])=>(
              <button key={v} onClick={()=>setForm(p=>({...p,status:v}))} style={{ flex:1,padding:"7px",borderRadius:8,border:`1px solid ${form.status===v?c+"60":T.border}`,background:form.status===v?c+"20":"transparent",color:form.status===v?c:T.muted,cursor:"pointer",fontSize:12 }}>{l}</button>
            ))}
          </div>
        </Field>
        <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
          <Btn variant="danger" onClick={()=>{ onDelete(client.id); onClose(); }}>Eliminar cliente</Btn>
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={()=>{ onSave(form); onClose(); }}>Guardar</Btn>
        </div>
      </div>
    </Modal>
  );
}


  const [view, setView] = useState("overview");
  const [clients, setClients] = useState(SEED.clients);
  const [selectedClient, setSelectedClient] = useState("c1");
  const [showAll, setShowAll] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [content, setContent] = useState(SEED.content);
  const [leads, setLeads] = useState(SEED.leads);
  const [dailyChats, setDailyChats] = useState(SEED.dailyChats);
  const [products, setProducts] = useState(SEED.products);
  const [billing, setBilling] = useState(SEED.billing);
  // angles/pains/buyReasons/programs/objections now live on each client object
  const [loaded, setLoaded] = useState(false);

  useEffect(()=>{
    (async()=>{
      try {
        const d = await S.get("eclypse-v1");
        if(d){
          if(d.clients?.length) setClients(d.clients);
          if(d.content?.length) setContent(d.content);
          if(d.leads?.length) setLeads(d.leads);
          if(d.dailyChats?.length) setDailyChats(d.dailyChats);
          if(d.products?.length) setProducts(d.products);
          if(d.billing?.length) setBilling(d.billing);
          
          if(d.selectedClient) setSelectedClient(d.selectedClient);
        }
      } catch(e) { console.error("Storage load error:", e); }
      setLoaded(true);
    })();
  },[]);

  const persist = useCallback(async(patch)=>{
    try {
      const data = { clients, content, leads, dailyChats, products, billing, selectedClient, ...patch };
      await S.set("eclypse-v1", data);
    } catch(e) { console.error("Save error:", e); }
  },[clients,content,leads,dailyChats,products,billing,selectedClient]);

  const client = clients.find(c=>c.id===selectedClient)||clients[0];
  const cContent = content.filter(c=>c.clientId===selectedClient);
  const cLeads = leads.filter(l=>l.clientId===selectedClient);
  const cChats = dailyChats.filter(d=>d.clientId===selectedClient);
  const cProducts = products.filter(p=>p.clientId===selectedClient);
  const cBilling = billing.filter(b=>b.clientId===selectedClient);

  const upClients = (list) => { setClients(list); persist({clients:list}); };
  const upContent = (list) => { setContent(list); persist({content:list}); };
  const upLeads = (list) => { setLeads(list); persist({leads:list}); };
  const upChats = (list) => { setDailyChats(list); persist({dailyChats:list}); };
  const upProducts = (list) => { setProducts(list); persist({products:list}); };
  const upBilling = (list) => { setBilling(list); persist({billing:list}); };

  if(!loaded) return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <style>{css}</style>
      <div style={{ textAlign:"center" }}>
        <EclypseIcon size={48}/>
        <div className="syne" style={{ fontSize:22,fontWeight:800,color:T.text,marginTop:14,letterSpacing:"0.08em" }}>ECLYPSE</div>
        <div style={{ fontSize:12,color:T.muted,marginTop:6,letterSpacing:"0.12em" }}>LOADING...</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",position:"relative" }}>
      <style>{css}</style>

      {/* HEADER */}
      <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`,padding:"0 24px", display:"flex",alignItems:"center",gap:24,height:50,position:"sticky",top:0,zIndex:100 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <EclypseIcon size={20}/>
          <span className="syne" style={{ fontSize:13,fontWeight:800,letterSpacing:"0.06em",color:T.text }}>ECLYPSE</span>
        </div>
        <div style={{ flex:1, display:"flex",gap:2 }}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setView(n.id)} style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 13px",borderRadius:7,background:view===n.id?T.goldSoft:"transparent",border:view===n.id?`1px solid ${T.gold}40`:"1px solid transparent",color:view===n.id?T.gold:T.muted,fontSize:12,fontWeight:view===n.id?600:400,cursor:"pointer" }}>
              <span style={{ fontSize:12 }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex:1,padding:"22px 24px",overflowY:"auto" }}>
        <ClientBar
          clients={clients} selected={selectedClient}
          onSelect={(id)=>{ setSelectedClient(id); setShowAll(false); persist({selectedClient:id}); }}
          onAdd={(c)=>{ const list=[...clients,c]; upClients(list); setSelectedClient(c.id); setShowAll(false); }}
          onEdit={(c)=>setEditingClient(c)}
          showAll={["overview","billing","content"].includes(view) ? showAll : false}
          onToggleAll={["overview","billing","content"].includes(view) ? ()=>setShowAll(p=>!p) : null}
        />

        {editingClient&&(
          <EditClientModal
            client={editingClient}
            onSave={(updated)=>{ upClients(clients.map(c=>c.id===updated.id?updated:c)); setEditingClient(null); }}
            onDelete={(id)=>{ upClients(clients.filter(c=>c.id!==id)); if(selectedClient===id&&clients.length>1) setSelectedClient(clients.find(c=>c.id!==id)?.id); setEditingClient(null); }}
            onClose={()=>setEditingClient(null)}
          />
        )}

        <div key={view+(showAll?"_all":"_"+selectedClient)} className="view-enter">
        {view==="overview" && (showAll
          ? <OverviewGeneral clients={clients} allContent={content} allLeads={leads} allBilling={billing} allProducts={products}/>
          : client&&<OverviewClient client={client} content={cContent} leads={cLeads} products={cProducts} billing={cBilling}/>
        )}
        {view==="content" && client&&(
          <ContentLab clientId={selectedClient} client={client} content={showAll?content:cContent}
            onAdd={item=>upContent([...content,item])}
            onUpdate={item=>upContent(content.map(c=>c.id===item.id?item:c))}
            onDelete={id=>upContent(content.filter(c=>c.id!==id))}
            onUpdateClient={updated=>upClients(clients.map(c=>c.id===updated.id?updated:c))}
          />
        )}
        {view==="sales" && client&&(
          <SalesDash clientId={selectedClient} client={client} leads={cLeads} dailyChats={cChats} cContent={cContent}
            onAddLead={item=>upLeads([...leads,item])}
            onUpdateLead={item=>upLeads(leads.map(l=>l.id===item.id?item:l))}
            onDeleteLead={id=>upLeads(leads.filter(l=>l.id!==id))}
            onAddChat={item=>upChats([...dailyChats,item])}
            onUpdateChat={item=>{ const l=dailyChats.map(x=>x.id===item.id?item:x); setDailyChats(l); persist({dailyChats:l}); }}
            onDeleteChat={id=>{ const l=dailyChats.filter(x=>x.id!==id); setDailyChats(l); persist({dailyChats:l}); }}
            onUpdateClient={updated=>upClients(clients.map(c=>c.id===updated.id?updated:c))}
          />
        )}
        {view==="products" && client&&(
          <ProductsDash clientId={selectedClient} products={cProducts} leads={cLeads}
            onAdd={item=>upProducts([...products,item])}
            onUpdate={item=>upProducts(products.map(p=>p.id===item.id?item:p))}
            onDelete={id=>upProducts(products.filter(p=>p.id!==id))}
          />
        )}
        {view==="billing" && (
          <BillingDash clients={clients} allBilling={billing} selectedClient={selectedClient} showAll={showAll}
            onAdd={item=>upBilling([...billing,item])}
            onUpdate={item=>upBilling(billing.map(b=>b.id===item.id?item:b))}
            onDelete={id=>upBilling(billing.filter(b=>b.id!==id))}
          />
        )}
        </div>
      </div>
    </div>
  );
}

