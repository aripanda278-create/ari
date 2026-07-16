import {firebaseConfig} from "./firebase-config.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {getAuth,signInAnonymously,signInWithRedirect,GoogleAuthProvider,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {getFirestore,collection,doc,setDoc,getDoc,addDoc,deleteDoc,onSnapshot,query,orderBy,limit,serverTimestamp} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const I={
hr:{gateText:"Uđi kao član ili se prijavi Google računom za upravljačke ovlasti.",enterMember:"Uđi kao član",administration:"Administracija",commandOverview:"Pregled zapovjedništva",avatar:"Avatar ime",language:"Jezik",enter:"Uđi u HQ",dashboard:"Dashboard",map:"Karta",reservations:"Rezervacije",diplomacy:"Diplomacija",operations:"Operacije",activity:"Aktivnost",members:"Članovi M",villages:"Sela M",population:"Populacija",activeReservations:"Aktivne rezervacije",online:"Online",relations:"Odnosi",latestChanges:"Zadnje promjene",search:"Igrač, selo, savez ili x|y",areaM:"Područje M",wholeServer:"Cijeli server",friends:"M + ally + NAP",enemies:"Neprijatelji",apply:"Primijeni",selectedVillage:"Odabrano selo",player:"Igrač",type:"Vrsta",normalVillage:"Obično selo",strategicPoint:"Strateška točka",priority:"Prioritet",high:"Visok",medium:"Srednji",low:"Nizak",status:"Status",planned:"Planirano",confirmed:"Potvrđeno",settled:"Osnovano",note:"Bilješka",save:"Spremi",locationCheck:"Provjera lokacije",coordinates:"Koordinate",editedBy:"Uredio",allianceTag:"Oznaka saveza",relation:"Odnos",name:"Naziv",attack:"Napad",defense:"Obrana",artifact:"Artefakt",time:"Vrijeme",active:"Aktivno",done:"Završeno",participants:"Sudionici",action:"Radnja"},
en:{gateText:"Enter as a member or use Google sign-in for command privileges.",enterMember:"Enter as member",administration:"Administration",commandOverview:"Command overview",avatar:"Avatar name",language:"Language",enter:"Enter HQ",dashboard:"Dashboard",map:"Map",reservations:"Reservations",diplomacy:"Diplomacy",operations:"Operations",activity:"Activity",members:"M members",villages:"M villages",population:"Population",activeReservations:"Active reservations",online:"Online",relations:"Relations",latestChanges:"Latest changes",search:"Player, village, alliance or x|y",areaM:"M area",wholeServer:"Whole server",friends:"M + allies + NAP",enemies:"Enemies",apply:"Apply",selectedVillage:"Selected village",player:"Player",type:"Type",normalVillage:"Normal village",strategicPoint:"Strategic point",priority:"Priority",high:"High",medium:"Medium",low:"Low",status:"Status",planned:"Planned",confirmed:"Confirmed",settled:"Settled",note:"Note",save:"Save",locationCheck:"Location check",coordinates:"Coordinates",editedBy:"Edited by",allianceTag:"Alliance tag",relation:"Relation",name:"Name",attack:"Attack",defense:"Defense",artifact:"Artifact",time:"Time",active:"Active",done:"Done",participants:"Participants",action:"Action"},
pl:{gateText:"Wejdź jako członek lub użyj Google do uprawnień dowódczych.",enterMember:"Wejdź jako członek",administration:"Administracja",commandOverview:"Przegląd dowództwa",avatar:"Nazwa avatara",language:"Język",enter:"Wejdź do HQ",dashboard:"Panel",map:"Mapa",reservations:"Rezerwacje",diplomacy:"Dyplomacja",operations:"Operacje",activity:"Aktywność",members:"Członkowie M",villages:"Wioski M",population:"Populacja",activeReservations:"Aktywne rezerwacje",online:"Online",relations:"Relacje",latestChanges:"Ostatnie zmiany",search:"Gracz, wioska, sojusz lub x|y",areaM:"Obszar M",wholeServer:"Cały serwer",friends:"M + sojusznicy + NAP",enemies:"Wrogowie",apply:"Zastosuj",selectedVillage:"Wybrana wioska",player:"Gracz",type:"Typ",normalVillage:"Zwykła wioska",strategicPoint:"Punkt strategiczny",priority:"Priorytet",high:"Wysoki",medium:"Średni",low:"Niski",status:"Status",planned:"Planowane",confirmed:"Potwierdzone",settled:"Założone",note:"Notatka",save:"Zapisz",locationCheck:"Sprawdzenie lokalizacji",coordinates:"Współrzędne",editedBy:"Edytował",allianceTag:"Tag sojuszu",relation:"Relacja",name:"Nazwa",attack:"Atak",defense:"Obrona",artifact:"Artefakt",time:"Czas",active:"Aktywne",done:"Zakończone",participants:"Uczestnicy",action:"Akcja"},
ru:{gateText:"Войдите как участник или используйте Google для командных прав.",enterMember:"Войти как участник",administration:"Администрация",commandOverview:"Обзор командования",avatar:"Имя аватара",language:"Язык",enter:"Войти в HQ",dashboard:"Панель",map:"Карта",reservations:"Бронирования",diplomacy:"Дипломатия",operations:"Операции",activity:"Активность",members:"Участники M",villages:"Деревни M",population:"Население",activeReservations:"Активные бронирования",online:"Онлайн",relations:"Отношения",latestChanges:"Последние изменения",search:"Игрок, деревня, альянс или x|y",areaM:"Зона M",wholeServer:"Весь сервер",friends:"M + союзники + NAP",enemies:"Враги",apply:"Применить",selectedVillage:"Выбранная деревня",player:"Игрок",type:"Тип",normalVillage:"Обычная деревня",strategicPoint:"Стратегическая точка",priority:"Приоритет",high:"Высокий",medium:"Средний",low:"Низкий",status:"Статус",planned:"Запланировано",confirmed:"Подтверждено",settled:"Основано",note:"Заметка",save:"Сохранить",locationCheck:"Проверка локации",coordinates:"Координаты",editedBy:"Изменил",allianceTag:"Тег альянса",relation:"Отношение",name:"Название",attack:"Атака",defense:"Оборона",artifact:"Артефакт",time:"Время",active:"Активно",done:"Завершено",participants:"Участники",action:"Действие"},
es:{gateText:"Entra como miembro o usa Google para privilegios de mando.",enterMember:"Entrar como miembro",administration:"Administración",commandOverview:"Resumen del mando",avatar:"Nombre de avatar",language:"Idioma",enter:"Entrar al HQ",dashboard:"Panel",map:"Mapa",reservations:"Reservas",diplomacy:"Diplomacia",operations:"Operaciones",activity:"Actividad",members:"Miembros de M",villages:"Aldeas de M",population:"Población",activeReservations:"Reservas activas",online:"En línea",relations:"Relaciones",latestChanges:"Últimos cambios",search:"Jugador, aldea, alianza o x|y",areaM:"Zona M",wholeServer:"Servidor completo",friends:"M + aliados + NAP",enemies:"Enemigos",apply:"Aplicar",selectedVillage:"Aldea seleccionada",player:"Jugador",type:"Tipo",normalVillage:"Aldea normal",strategicPoint:"Punto estratégico",priority:"Prioridad",high:"Alta",medium:"Media",low:"Baja",status:"Estado",planned:"Planificado",confirmed:"Confirmado",settled:"Fundado",note:"Nota",save:"Guardar",locationCheck:"Comprobar ubicación",coordinates:"Coordenadas",editedBy:"Editado por",allianceTag:"Etiqueta de alianza",relation:"Relación",name:"Nombre",attack:"Ataque",defense:"Defensa",artifact:"Artefacto",time:"Hora",active:"Activo",done:"Finalizado",participants:"Participantes",action:"Acción"}};

const $=id=>document.getElementById(id);
Object.assign(I.hr,{gateText:"Uđi kao član ili se prijavi Google računom za upravljačke ovlasti.",enterMember:"Uđi kao član",commandOverview:"Pregled zapovjedništva",dashboard:"Pregled",members:"Članovi M",villages:"Sela M",population:"Populacija",activeReservations:"Aktivne rezervacije",latestChanges:"Zadnje promjene",search:"Igrač, selo, savez ili x|y",areaM:"Područje M",selectedVillage:"Odabrano selo",player:"Igrač",normalVillage:"Obično selo",strategicPoint:"Strateška točka",confirmed:"Potvrđeno",note:"Bilješka",locationCheck:"Provjera lokacije",editedBy:"Uredio",participants:"Sudionici"});
const MOJIBAKE_FIXES=[["ÄŚ","Č"],["ÄŒ","Č"],["ÄŤ","č"],["Ä‡","ć"],["Ä†","Ć"],["Ä‘","đ"],["Ä","Đ"],["Ĺˇ","š"],["Ĺ ","Š"],["Ĺľ","ž"],["Ĺ˝","Ž"],["â€”","—"],["â€¦","…"],["Â·","·"],["âš ","⚠"],["âś“","✓"],["â€","☀"],["âľ","☾"],["â…","★"],["â†","☆"],["Ă—","×"]];
function repairText(value){let out=String(value??"");for(const [bad,good] of MOJIBAKE_FIXES)out=out.split(bad).join(good);return out}
const FULL_TRANSLATIONS={
  "Strateški alati":"Strategic tools","Kalkulatori i planeri povezani s kartom.":"Calculators and planners connected to the map.","Vrijeme putovanja":"Travel time","Evidencija vojske":"Troop ledger","Konverter":"Converter",
  "Odakle i kamo":"Origin and destination","Upiši koordinate ili odaberi sela izravno na karti.":"Enter coordinates or select villages directly on the map.","Polazište X|Y":"Origin X|Y","Cilj X|Y":"Target X|Y","Odaberi na karti":"Pick on map","Jedinica":"Unit","Brzina turnira (%)":"Tournament Square (%)","Bonus brzine (%)":"Speed bonus (%)","Vrijeme udara":"Arrival time","Izračunaj putovanje":"Calculate travel",
  "REZULTAT PUTA":"TRAVEL RESULT","polja":"tiles","polja/h":"tiles/h","turnir":"tournament","bonus":"bonus","Dolazak ako krene sada:":"Arrival if sent now:","Polazak:":"Departure:","Udar:":"Arrival:","Povratak:":"Return:","Izračun koristi osnovnu brzinu jedinice; turnir se primjenjuje nakon prvih 20 polja. Provjeri brzinu svijeta i posebne bonuse.":"The calculation uses the unit's base speed; Tournament Square applies after the first 20 tiles. Verify world speed and special bonuses.",
  "Crop & Farm Finder":"Crop & Farm Finder","Traži slobodne lokacije, rezervirane croppere i slabije vanjske mete u blizini.":"Find free locations, reserved croppers and weaker external targets nearby.","Centar X|Y":"Center X|Y","Radijus":"Radius","Prikaz":"View","Slobodne lokacije":"Free locations","Označeni 15c":"Marked 15c","Označeni 9c":"Marked 9c","Moguće farme":"Potential farms","Analiziraj područje":"Analyze area","Rezultati će se pojaviti ovdje.":"Results will appear here.",
  "Evidencija vojske saveza M":"M alliance troop ledger","Map podaci ne sadrže vojsku. Ovdje se unose provjerene brojke; ostaju u ovom pregledniku.":"Map data does not contain troops. Enter verified numbers here; they remain in this browser.","Izvezi CSV":"Export CSV","Igrač":"Player","Tip":"Type","Pješadija":"Infantry","Konjica":"Cavalry","Opsadne":"Siege","Izviđači":"Scouts","Spremi provjereni unos":"Save verified entry","Ukupno":"Total","Uloga":"Role",
  "Attack / Defense Planner":"Attack / Defense Planner","Naziv":"Name","Vrsta":"Type","Pravi napad":"Real attack","Obrana":"Defense","Opskrba / WW":"Supply / WW","Polazište":"Origin","Cilj":"Target","Željeni dolazak":"Desired arrival","Količina":"Amount","Dodaj u vremensku crtu":"Add to timeline","Koordinirana vremenska crta":"Coordinated timeline","Nema unosa u vremenskoj crti.":"No timeline entries.",
  "Konverter koordinata":"Coordinate converter","Zalijepi tekst, BBCode, CSV ili popis koordinata…":"Paste text, BBCode, CSV or a coordinate list…","Pronađi i pretvori":"Find and convert","Čiste koordinate":"Clean coordinates","Kopiraj":"Copy","Pronađeno:":"Found:","jedinstvenih koordinata":"unique coordinates",
  "Svi savezi":"All alliances","Samo M":"M only","Samo [M]":"[M] only","Samo SC":"SC only","Samo vanjski":"External only","Samo ENEMY":"Enemies only","Sakrij sve":"Hide all","Prikaz karte":"Map view","M + saveznici + NAP":"M + allies + NAP","Neprijatelji":"Enemies","Vanjski savezi":"External alliances","Sakrij sela":"Hide villages","Kotačić za zoom · povuci za pomicanje":"Scroll to zoom · drag to move","Odabrano selo":"Selected village","Slojevi saveza":"Alliance layers","Traži savez...":"Search alliance...","Igrači bez saveza":"Players without alliance","Natari":"Natars","Klikni savez u popisu slojeva.":"Click an alliance in the layer list.","Prati":"Follow","Sakrij":"Hide","Fokusiraj":"Focus"
};
const REVERSE_TRANSLATIONS=Object.fromEntries(Object.entries(FULL_TRANSLATIONS).map(([hr,en])=>[en,hr]));
function translateUiString(value){let out=repairText(value),dict=lang==="en"?FULL_TRANSLATIONS:REVERSE_TRANSLATIONS;for(const key of Object.keys(dict).sort((a,b)=>b.length-a.length))out=out.split(key).join(dict[key]);return out}
function translateWholeUI(root=document.body){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode()))if(node.nodeValue.trim())node.nodeValue=translateUiString(node.nodeValue);root.querySelectorAll?.("[placeholder],[title]").forEach(el=>{if(el.placeholder)el.placeholder=translateUiString(el.placeholder);if(el.title)el.title=translateUiString(el.title)})}
const OWNER_EMAIL="aripanda278@gmail.com";
const DATA=window.MAP_DATA||[], OWN="M", tribes={1:"Romans",2:"Teutons",3:"Gauls",5:"Natars",6:"Egyptians",7:"Huns",8:"Spartans",9:"Vikings"};
for(const v of DATA){v.village=repairText(v.village);v.player=repairText(v.player);v.alliance=repairText(v.alliance)}
let lang=localStorage.getItem("mhq_lang")||"hr",avatar=localStorage.getItem("mhq_avatar")||"",uid="",db,auth,currentUser=null,role="member",profile={};
let reservations=[],diplomacy={"[M]":{rel:"ally",note:"ALLY"},"SC":{rel:"nap",note:"NAP"}},operations=[],presence=[],activities=[],users=[];
let own=DATA.filter(v=>v.alliance===OWN),center={x:0,y:0},zoom={x:-70,y:-70,w:140,h:140},current=[],selected=null;
const ALLIANCE_STATS={};
for(const v of DATA){
  const key=v.alliance||"";
  ALLIANCE_STATS[key]??={tag:key,villages:0,population:0,players:new Set()};
  ALLIANCE_STATS[key].villages++;
  ALLIANCE_STATS[key].population+=Number(v.population)||0;
  ALLIANCE_STATS[key].players.add(v.playerId);
}
const ALLIANCE_TAGS=Object.keys(ALLIANCE_STATS).filter(Boolean).sort((a,b)=>ALLIANCE_STATS[b].villages-ALLIANCE_STATS[a].villages);
let visibleAlliances=new Set((()=>{try{return JSON.parse(localStorage.getItem("mhq_visible_alliances")||"null")||ALLIANCE_TAGS}catch{return ALLIANCE_TAGS}})());
let showNoAlliance=localStorage.getItem("mhq_show_no_alliance")!=="false";
let showNatars=localStorage.getItem("mhq_show_natars")!=="false";
let selectedAlliance=null;
let favorites=new Set((()=>{try{return JSON.parse(localStorage.getItem("mhq_favorite_alliances")||"[]")}catch{return[]}})());
let brightMode=localStorage.getItem("mhq_bright_mode")==="true";let selectedMember=null;
if(own.length) center={x:own.reduce((s,v)=>s+v.x,0)/own.length,y:own.reduce((s,v)=>s+v.y,0)/own.length};
const tr=k=>I[lang]?.[k]||I.en[k]||k;
function applyLang(){document.documentElement.lang=lang;document.querySelectorAll("[data-i18n]").forEach(e=>e.textContent=tr(e.dataset.i18n));document.querySelectorAll("[data-i18n-placeholder]").forEach(e=>e.placeholder=tr(e.dataset.i18nPlaceholder));$("langTop").value=lang}
const baseApplyLang=applyLang;applyLang=function(){baseApplyLang();translateWholeUI()};
const isAdmin=()=>role==="owner"||role==="admin"; const isOwner=()=>role==="owner";
function rel(a){return a===OWN?"own":(diplomacy[a]?.rel||"neutral")} function dd(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function safe(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function toast(message){let h=document.querySelector(".toastHost");if(!h){h=document.createElement("div");h.className="toastHost";document.body.appendChild(h)}const t=document.createElement("div");t.className="toast";t.textContent=message;h.appendChild(t);setTimeout(()=>t.remove(),3200)}
function allianceDistance(tag){const vs=DATA.filter(v=>v.alliance===tag);if(!vs.length||!own.length)return null;let best=999;for(const a of vs)for(const m of own){const d=dd(a,m);if(d<best)best=d}return best}
function setVisualMode(value){brightMode=Boolean(value);localStorage.setItem("mhq_bright_mode",String(brightMode));document.body.classList.toggle("brightMode",brightMode);if($("visualMode"))$("visualMode").textContent=brightMode?"☾":"☀"}
async function logAction(action){try{await addDoc(collection(db,"activity"),{avatar,uid,role,action,createdAt:serverTimestamp()})}catch(e){console.warn(e)}}
async function memberLogin(){avatar=$("avatarInput").value.trim();lang=$("languageInput").value;if(!avatar)return $("gateStatus").textContent="Avatar name required.";localStorage.setItem("mhq_avatar",avatar);localStorage.setItem("mhq_lang",lang);$("gateStatus").textContent="Connecting…";await signInAnonymously(auth)}
async function googleLogin(){avatar=$("avatarInput").value.trim();lang=$("languageInput").value;if(!avatar)return $("gateStatus").textContent=lang==="en"?"Enter your avatar name first.":"Prvo upiši avatar ime.";localStorage.setItem("mhq_avatar",avatar);localStorage.setItem("mhq_lang",lang);$("gateStatus").textContent=lang==="en"?"Redirecting to Google…":"Preusmjeravam na Google…";try{const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:"select_account"});await signInWithRedirect(auth,provider)}catch(error){console.error(error);const code=error?.code||"unknown";$("gateStatus").textContent=(lang==="en"?"Google sign-in failed":"Google prijava nije uspjela")+` (${code}).`}}
async function ensureProfile(u){const ref=doc(db,"users",u.uid),snap=await getDoc(ref);const owner=(u.email||"").toLowerCase()===OWNER_EMAIL;let old=snap.exists()?snap.data():{};role=owner?"owner":(old.role||"member");if(owner)avatar=avatar||old.avatar||"Pacov";profile={...old,avatar,email:u.email||"",provider:u.isAnonymous?"anonymous":"google",role};await setDoc(ref,{avatar,email:u.email||"",provider:u.isAnonymous?"anonymous":"google",role,lastSeen:serverTimestamp()},{merge:true})}
async function start(u){setVisualMode(brightMode);currentUser=u;uid=u.uid;await ensureProfile(u);$("gate").classList.add("hidden");$("app").classList.remove("hidden");$("me").textContent=avatar;$("roleBadge").textContent=role.toUpperCase();if(isOwner())$("me").textContent=avatar||"Pacov";$("roleBadge").className=`role ${role}`;document.body.classList.toggle("isOwner",isOwner());$("adminNav").classList.toggle("hidden",!isAdmin());document.querySelectorAll(".adminOnly").forEach(e=>e.classList.toggle("locked",!isAdmin()));$("rstatus").disabled=!isAdmin();if(!isAdmin())$("rstatus").value="planned";$("resPermission").textContent=isAdmin()?"Admin: potpuno uređivanje":"Član: možeš napraviti i obrisati samo vlastiti plan";applyLang();await heartbeat();setInterval(heartbeat,45000);listen();renderStatic();
  const last=localStorage.getItem("mhq_last_view");const btn=last&&document.querySelector(`nav button[data-view="${last}"]`);if(btn&&!btn.classList.contains("hidden"))btn.click()
}
async function heartbeat(){await setDoc(doc(db,"presence",uid),{avatar,role,lastSeen:serverTimestamp()},{merge:true});await setDoc(doc(db,"users",uid),{lastSeen:serverTimestamp()},{merge:true})}
function listen(){
 onSnapshot(collection(db,"reservations"),s=>{reservations=s.docs.map(d=>({id:d.id,...d.data()}));renderRes();renderDash();draw();$("sync").textContent="● Synced"},e=>showError(e));
 onSnapshot(collection(db,"diplomacy"),s=>{const x={"[M]":{rel:"ally",note:"ALLY"},"SC":{rel:"nap",note:"NAP"}};s.forEach(d=>x[d.id]=d.data());diplomacy=x;renderDip();renderDash();applyMap()});
 onSnapshot(collection(db,"operations"),s=>{operations=s.docs.map(d=>({id:d.id,...d.data()}));renderOps()});
 onSnapshot(collection(db,"presence"),s=>{const now=Date.now();presence=s.docs.map(d=>d.data()).filter(p=>{const t=p.lastSeen?.toMillis?.()||0;return now-t<150000});$("kOnline").textContent=presence.length;$("onlineUsers").innerHTML=presence.slice(0,7).map(p=>`<span class="badge">● ${safe(p.avatar)}</span>`).join("")});
 onSnapshot(query(collection(db,"activity"),orderBy("createdAt","desc"),limit(80)),s=>{activities=s.docs.map(d=>d.data());renderActivity();renderDash()});
 if(isAdmin())onSnapshot(collection(db,"users"),s=>{users=s.docs.map(d=>({id:d.id,...d.data()}));renderUsers()});
}
function showError(e){console.error(e);$("sync").textContent="⚠ Sync error"}

const M_MEMBERS=(()=>{
  const by={};
  for(const v of own){
    by[v.playerId]??={id:v.playerId,name:v.player,tribe:v.tribe,villages:[],population:0};
    by[v.playerId].villages.push(v);by[v.playerId].population+=Number(v.population)||0;
  }
  return Object.values(by);
})();
function renderMembers(){
  if(!$("memberBody"))return;
  const q=($("memberSearch").value||"").toLowerCase(),sort=$("memberSort").value;
  let list=M_MEMBERS.filter(m=>m.name.toLowerCase().includes(q));
  list.sort(sort==="name"?(a,b)=>a.name.localeCompare(b.name):sort==="villages"?(a,b)=>b.villages.length-a.villages.length:(a,b)=>b.population-a.population);
  $("memberBody").innerHTML=list.map(m=>`<tr data-member="${m.id}" class="${selectedMember?.id===m.id?"memberRowActive":""}">
    <td><b>${safe(m.name)}</b></td><td>${tribes[m.tribe]||m.tribe}</td><td>${m.villages.length}</td>
    <td>${m.population.toLocaleString()}</td><td>${Math.round(m.population/Math.max(1,m.villages.length)).toLocaleString()}</td>
    <td>${safe((m.villages.find(v=>v.capital)||m.villages[0])?.village||"—")}</td></tr>`).join("");
  document.querySelectorAll("[data-member]").forEach(r=>r.onclick=()=>showMember(Number(r.dataset.member)));
  $("memberTotal").textContent=M_MEMBERS.length;
  $("memberVillageTotal").textContent=own.length;
  $("memberAvgPop").textContent=Math.round(own.reduce((s,v)=>s+v.population,0)/Math.max(1,M_MEMBERS.length)).toLocaleString();
  const top=[...M_MEMBERS].sort((a,b)=>b.population-a.population)[0];$("memberTop").textContent=top?.name||"—";
}
function showMember(id){
  selectedMember=M_MEMBERS.find(m=>Number(m.id)===Number(id));if(!selectedMember)return;
  $("memberDetail").innerHTML=`<h2>${safe(selectedMember.name)}</h2><span class="badge">${tribes[selectedMember.tribe]||selectedMember.tribe}</span>
    <div class="statBlock"><div><b>${selectedMember.villages.length}</b>Sela</div><div><b>${selectedMember.population.toLocaleString()}</b>Populacija</div></div>
    <h3>Sela</h3>${[...selectedMember.villages].sort((a,b)=>b.population-a.population).map(v=>`<div class="memberVillage"><b>${safe(v.village)}</b><br>${v.x}|${v.y} · ${v.population} pop.${v.capital?" · Glavno":""}</div>`).join("")}`;
  $("focusMember").classList.remove("hidden");renderMembers()
}
function focusSelectedMember(){
  if(!selectedMember)return;
  current=selectedMember.villages;
  const minX=Math.min(...current.map(v=>v.x)),maxX=Math.max(...current.map(v=>v.x)),minY=Math.min(...current.map(v=>-v.y)),maxY=Math.max(...current.map(v=>-v.y));
  zoom={x:minX-7,y:minY-7,w:Math.max(18,maxX-minX+14),h:Math.max(18,maxY-minY+14)};
  document.querySelector('nav button[data-view="map"]').click();draw();toast(`Prikazana sela: ${selectedMember.name}`)
}

function renderStatic(){
  $("kMembers").textContent=new Set(own.map(v=>v.playerId)).size;
  $("kVillages").textContent=own.length;
  $("kPop").textContent=own.reduce((s,v)=>s+v.population,0).toLocaleString();
  $("kAlliances").textContent=ALLIANCE_TAGS.length.toLocaleString();
  $("kExternalNear").textContent=DATA.filter(v=>v.alliance!==OWN&&v.tribe!==5&&dd(v,center)<=55).length.toLocaleString();
  $("kEnemyVillages").textContent=DATA.filter(v=>rel(v.alliance)==="enemy").length.toLocaleString();
  renderAllianceLayers();renderIntel();renderMembers();applyMap()
}
function renderDash(){$("kRes").textContent=reservations.filter(r=>r.status!=="settled").length;$("dipSummary").innerHTML=Object.entries(diplomacy).map(([k,v])=>`<span class="badge">${safe(k)} · ${safe(v.rel).toUpperCase()}</span>`).join("");$("latest").innerHTML=activities.slice(0,8).map(a=>`<div><b>${safe(a.avatar)}</b> · ${safe(a.action)}</div>`).join("")||"—"}
function persistLayers(){
  localStorage.setItem("mhq_visible_alliances",JSON.stringify([...visibleAlliances]));
  localStorage.setItem("mhq_show_no_alliance",String(showNoAlliance));
  localStorage.setItem("mhq_show_natars",String(showNatars));
}
function layerAllows(v){
  if(v.tribe===5)return showNatars;
  if(!v.alliance)return showNoAlliance;
  return visibleAlliances.has(v.alliance);
}
function applyMap(){
  const scope=$("mapScope").value,term=$("search").value.toLowerCase().trim();
  current=DATA.filter(v=>{
    const inScope=scope==="world"||dd(v,center)<=55;
    const matches=!term||(`${v.player} ${v.village} ${v.alliance} ${v.x}|${v.y}`).toLowerCase().includes(term);
    return inScope&&matches&&layerAllows(v);
  });
  if(scope==="world")zoom={x:-205,y:-205,w:410,h:410};
  else zoom={x:center.x-24,y:-center.y-24,w:48,h:48};
  updateVisibleCount();
  draw();
}
function cls(v){if(v.tribe===5)return"natar";return rel(v.alliance)}

function relationRank(tag){
  return {own:0,ally:1,nap:2,enemy:3,neutral:4}[rel(tag)]??5;
}
function renderAllianceLayers(){
  const q=($("allianceSearch")?.value||"").toLowerCase();
  const tags=[...ALLIANCE_TAGS].sort((a,b)=>relationRank(a)-relationRank(b)||ALLIANCE_STATS[b].villages-ALLIANCE_STATS[a].villages||a.localeCompare(b));
  $("allianceLayers").innerHTML=tags.filter(tag=>tag.toLowerCase().includes(q)).map(tag=>{
    const s=ALLIANCE_STATS[tag],r=rel(tag),checked=visibleAlliances.has(tag)?"checked":"";
    return `<label class="allianceRow ${favorites.has(tag)?"favorite":""}" data-alliance-row="${safe(tag)}"><input type="checkbox" data-alliance="${safe(tag)}" ${checked}><strong title="${safe(tag)}">${safe(tag)}</strong><span><span class="relPill ${r}">${r.toUpperCase()}</span><span class="allianceMeta">${s.villages}v · ${s.players.size}p</span></span></label>`;
  }).join("");
  document.querySelectorAll("[data-alliance-row]").forEach(row=>row.onclick=e=>{if(e.target.tagName!=="INPUT")showAllianceIntel(row.dataset.allianceRow)});
  document.querySelectorAll("[data-alliance]").forEach(cb=>cb.onchange=()=>{
    if(cb.checked)visibleAlliances.add(cb.dataset.alliance);else visibleAlliances.delete(cb.dataset.alliance);
    persistLayers();applyMap();
  });
  $("showNoAlliance").checked=showNoAlliance;
  $("showNatars").checked=showNatars;
  updateVisibleCount();
}
function updateVisibleCount(){
  const special=(showNoAlliance?1:0)+(showNatars?1:0);
  if($("visibleAllianceCount"))$("visibleAllianceCount").textContent=`${visibleAlliances.size+special} slojeva`;
}
function applyPreset(name){
  if(name==="all")visibleAlliances=new Set(ALLIANCE_TAGS);
  if(name==="none")visibleAlliances=new Set();
  if(name==="ours")visibleAlliances=new Set(["M"]);
  if(name==="allyOnly")visibleAlliances=new Set(["[M]"]);
  if(name==="napOnly")visibleAlliances=new Set(["SC"]);
  if(name==="oursAlly")visibleAlliances=new Set(["M","[M]"]);
  if(name==="friends")visibleAlliances=new Set(["M","[M]","SC"]);
  if(name==="external")visibleAlliances=new Set(ALLIANCE_TAGS.filter(t=>t!=="M"&&t!=="[M]"&&t!=="SC"));
  if(name==="enemies")visibleAlliances=new Set(ALLIANCE_TAGS.filter(t=>rel(t)==="enemy"));
  showNoAlliance=name==="all"||name==="external";
  showNatars=name==="all"||name==="external";
  persistLayers();renderAllianceLayers();applyMap();
}


function showAllianceIntel(tag){
  selectedAlliance=tag;
  const s=ALLIANCE_STATS[tag],r=rel(tag),dist=allianceDistance(tag);
  if(!s)return;
  $("allianceIntel").innerHTML=`<h2>${safe(tag)}</h2><span class="relPill ${r}">${r.toUpperCase()}</span>
    <div class="statBlock"><div><b>${s.players.size}</b>Igrači</div><div><b>${s.villages}</b>Sela</div>
    <div><b>${s.population.toLocaleString()}</b>Populacija</div><div><b>${dist==null?"—":dist.toFixed(1)}</b>Najbliže M</div></div>
    <div class="clusterBar"><i style="width:${Math.min(100,s.villages/Math.max(1,own.length)*100)}%"></i></div>`;
  $("allianceIntelActions").classList.remove("hidden");
  $("favoriteAlliance").textContent=favorites.has(tag)?"★ Praćen":"☆ Prati";
  $("adminRelationActions").classList.toggle("hidden",!isAdmin()||tag===OWN);
}
function clearAllianceIntel(){selectedAlliance=null;$("allianceIntel").textContent="Klikni savez u popisu slojeva.";$("allianceIntelActions").classList.add("hidden");$("adminRelationActions").classList.add("hidden")}
function focusAllianceOnMap(tag){
  const vs=DATA.filter(v=>v.alliance===tag);if(!vs.length)return;
  const minX=Math.min(...vs.map(v=>v.x)),maxX=Math.max(...vs.map(v=>v.x));
  const minY=Math.min(...vs.map(v=>-v.y)),maxY=Math.max(...vs.map(v=>-v.y));
  const pad=8;zoom={x:minX-pad,y:minY-pad,w:Math.max(22,maxX-minX+pad*2),h:Math.max(22,maxY-minY+pad*2)};
  visibleAlliances.add(tag);persistLayers();current=DATA.filter(v=>layerAllows(v));draw();toast(`Fokus: ${tag}`)
}
function toggleFavorite(tag){
  if(favorites.has(tag))favorites.delete(tag);else favorites.add(tag);
  localStorage.setItem("mhq_favorite_alliances",JSON.stringify([...favorites]));
  renderAllianceLayers();renderIntel();if(selectedAlliance===tag)showAllianceIntel(tag)
}
function renderIntel(){
  if(!$("intelBody"))return;
  const q=($("intelSearch")?.value||"").toLowerCase(),rf=$("intelRelation")?.value||"all";
  const rows=ALLIANCE_TAGS.map(tag=>{const s=ALLIANCE_STATS[tag];return{tag,s,r:rel(tag),d:allianceDistance(tag)}})
    .filter(x=>(!q||x.tag.toLowerCase().includes(q))&&(rf==="all"||x.r===rf))
    .sort((a,b)=>(favorites.has(b.tag)-favorites.has(a.tag))||b.s.villages-a.s.villages);
  $("intelBody").innerHTML=rows.map(x=>`<tr><td><button class="starBtn ${favorites.has(x.tag)?"on":""}" data-star="${safe(x.tag)}">${favorites.has(x.tag)?"★":"☆"}</button></td>
    <td><b>${safe(x.tag)}</b></td><td><span class="relPill ${x.r}">${x.r.toUpperCase()}</span></td><td>${x.s.players.size}</td>
    <td>${x.s.villages}</td><td>${x.s.population.toLocaleString()}</td><td>${Math.round(x.s.population/Math.max(1,x.s.villages)).toLocaleString()}</td>
    <td>${x.d==null?"—":x.d.toFixed(1)}</td><td><button data-intel-focus="${safe(x.tag)}">Karta</button></td></tr>`).join("");
  document.querySelectorAll("[data-star]").forEach(b=>b.onclick=()=>toggleFavorite(b.dataset.star));
  document.querySelectorAll("[data-intel-focus]").forEach(b=>b.onclick=()=>{document.querySelector('nav button[data-view="map"]').click();showAllianceIntel(b.dataset.intelFocus);focusAllianceOnMap(b.dataset.intelFocus)});
  $("kFavorites").textContent=favorites.size;
  const ext=rows.filter(x=>x.tag!==OWN&&x.tag!=="[M]"&&x.tag!=="SC");
  $("kLargestExternal").textContent=ext[0]?`${ext[0].tag} (${ext[0].s.villages})`:"—";
  const near=[...ext].filter(x=>x.d!=null).sort((a,b)=>a.d-b.d)[0];
  $("kNearestExternal").textContent=near?`${near.tag} (${near.d.toFixed(1)})`:"—"
}
function exportVisibleCsv(){
  const rows=[["x","y","village","player","alliance","population","tribe"],...current.map(v=>[v.x,v.y,v.village,v.player,v.alliance,v.population,tribes[v.tribe]||v.tribe])];
  const csv=rows.map(r=>r.map(x=>`"${String(x??"").replaceAll('"','""')}"`).join(",")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="mhq-map-view.csv";a.click();URL.revokeObjectURL(a.href)
}

function draw(){const s=$("svg");s.innerHTML="";s.setAttribute("viewBox",`${zoom.x} ${zoom.y} ${zoom.w} ${zoom.h}`);const step=zoom.w>250?25:10;for(let n=-400;n<=400;n+=step){for(const h of [0,1]){const l=document.createElementNS("http://www.w3.org/2000/svg","line");l.setAttribute(h?"x1":"y1",n);l.setAttribute(h?"x2":"y2",n);l.setAttribute(h?"y1":"x1",-400);l.setAttribute(h?"y2":"x2",400);l.setAttribute("class",n===0?"axis":"grid");s.appendChild(l)}}for(const v of current){const c=document.createElementNS("http://www.w3.org/2000/svg","circle");c.setAttribute("cx",v.x);c.setAttribute("cy",-v.y);c.setAttribute("r",Math.max(.8,Math.min(3,1+Math.sqrt(v.population)/17)));c.setAttribute("class","v "+cls(v));c.onmouseenter=e=>showTip(e,v);c.onmouseleave=()=>$("tip").style.display="none";c.onclick=()=>selectVillage(v);s.appendChild(c)}for(const r of reservations){const c=document.createElementNS("http://www.w3.org/2000/svg","circle");c.setAttribute("cx",r.x);c.setAttribute("cy",-r.y);c.setAttribute("r",4);c.setAttribute("class","res");s.appendChild(c)}}
function showTip(e,v){const t=$("tip");t.innerHTML=`<b>${safe(v.village)}</b><br>${v.x}|${v.y}<br>${safe(v.player)} · ${safe(v.alliance||"—")}`;t.style.display="block";t.style.left=(e.offsetX+12)+"px";t.style.top=(e.offsetY+12)+"px"}
function selectVillage(v){selected=v;$("selected").innerHTML=`<b>${safe(v.village)}</b><br><span class="badge">${v.x}|${v.y}</span><br>${safe(v.player)} · ${safe(v.alliance||"—")}<br>${tribes[v.tribe]||v.tribe} · ${v.population}`;$("reserveSelected").classList.remove("hidden")}
function locCheck(){const x=+$("rx").value,y=+$("ry").value;if(!Number.isFinite(x)||!Number.isFinite(y))return;const hit=DATA.find(v=>v.x===x&&v.y===y);let near={d:999,v:null};for(const v of DATA){if(rel(v.alliance)==="enemy"&&dd({x,y},v)<near.d)near={d:dd({x,y},v),v}}const conflict=reservations.find(r=>r.x===x&&r.y===y);$("locCheck").innerHTML=(hit?`⚠ Zauzeto: ${safe(hit.player)} / ${safe(hit.village)}`:"✓ Slobodno u trenutnoj map.sql snimci")+(conflict?`<br>⚠ Već rezervirao: ${safe(conflict.player)}`:"")+`<br>Najbliži ENEMY: ${near.v?near.d.toFixed(1)+" · "+safe(near.v.player):"—"}`}
function canDeleteRes(r){return isAdmin()||(r.ownerUid===uid&&r.status==="planned")}
function renderRes(){$("resBody").innerHTML=reservations.sort((a,b)=>(b.updatedAt?.seconds||0)-(a.updatedAt?.seconds||0)).map(r=>`<tr><td><b>${r.x}|${r.y}</b></td><td>${safe(r.player)}</td><td>${safe(r.type)}</td><td>${safe(r.priority)}</td><td><span class="badge">${safe(r.status)}</span></td><td>${safe(r.updatedBy||"—")}</td><td>${canDeleteRes(r)?`<button class="danger" data-delres="${r.id}">×</button>`:""}</td></tr>`).join("");document.querySelectorAll("[data-delres]").forEach(b=>b.onclick=async()=>{const r=reservations.find(x=>x.id===b.dataset.delres);if(!r||!canDeleteRes(r))return;await deleteDoc(doc(db,"reservations",r.id));logAction(`obrisao/la rezervaciju ${r.x}|${r.y}`)})}
function renderDip(){$("dipBody").innerHTML=Object.entries(diplomacy).map(([k,v])=>`<tr><td><b>${safe(k)}</b></td><td><span class="badge">${safe(v.rel).toUpperCase()}</span></td><td>${safe(v.note||"")}</td><td>${safe(v.updatedBy||"system")}</td></tr>`).join("")}
function renderOps(){$("opBody").innerHTML=operations.map(o=>`<tr><td><b>${safe(o.name)}</b></td><td>${safe(o.type)}</td><td>${safe(o.time||"—")}</td><td><span class="badge">${safe(o.status)}</span></td><td>${safe(o.updatedBy||"—")}</td><td>${isAdmin()?`<button class="danger" data-delop="${o.id}">×</button>`:""}</td></tr>`).join("");document.querySelectorAll("[data-delop]").forEach(b=>b.onclick=async()=>{await deleteDoc(doc(db,"operations",b.dataset.delop));logAction("obrisao/la operaciju")})}
function renderActivity(){$("activityBody").innerHTML=activities.map(a=>`<tr><td>${a.createdAt?.toDate?.().toLocaleString()||"—"}</td><td>${safe(a.avatar||"—")}</td><td>${safe(a.action||"—")}</td></tr>`).join("")}
function renderUsers(){$("usersBody").innerHTML=users.sort((a,b)=>({owner:0,admin:1,member:2}[a.role]??3)-({owner:0,admin:1,member:2}[b.role]??3)).map(u=>`<tr><td><b>${safe(u.avatar||"—")}</b></td><td>${safe(u.email||u.provider||"anonymous")}</td><td><span class="role ${safe(u.role||"member")}">${safe((u.role||"member").toUpperCase())}</span></td><td>${u.lastSeen?.toDate?.().toLocaleString()||"—"}</td><td>${isOwner()&&u.role!=="owner"&&u.provider==="google"?`<button data-role="${u.role==='admin'?'member':'admin'}" data-user="${u.id}">${u.role==='admin'?'Makni admina':'Postavi admina'}</button>`:""}</td></tr>`).join("");document.querySelectorAll("[data-user]").forEach(b=>b.onclick=async()=>{const target=users.find(u=>u.id===b.dataset.user);if(!target||!isOwner())return;await setDoc(doc(db,"users",target.id),{role:b.dataset.role,roleUpdatedBy:avatar,roleUpdatedAt:serverTimestamp()},{merge:true});logAction(`${b.dataset.role==='admin'?'dodijelio/la ADMIN':'uklonio/la ADMIN'} korisniku ${target.avatar}`)})}

// --- Strategic toolkit -----------------------------------------------------
const toolsNav=document.createElement("button");toolsNav.dataset.view="tools";toolsNav.innerHTML="⌁ <span>Strateški alati</span>";document.querySelector("nav .navFoot")?.before(toolsNav);
const quickFilters=document.querySelector(".quickFilters");if(quickFilters){quickFilters.innerHTML=`<span class="filterLabel">${lang==="en"?"Map view":"Prikaz karte"}</span><select id="mapPresetSelect"><option value="all">${lang==="en"?"All alliances":"Svi savezi"}</option><option value="ours">${lang==="en"?"M only":"Samo M"}</option><option value="friends">${lang==="en"?"M + allies + NAP":"M + saveznici + NAP"}</option><option value="enemies">${lang==="en"?"Enemies":"Neprijatelji"}</option><option value="external">${lang==="en"?"External alliances":"Vanjski savezi"}</option><option value="none">${lang==="en"?"Hide villages":"Sakrij sela"}</option></select><span class="filterHint">${lang==="en"?"Scroll to zoom · drag to move":"Kotačić za zoom · povuci za pomicanje"}</span>`;$("mapPresetSelect").onchange=e=>applyPreset(e.target.value)}
const profileBox=document.createElement("div");profileBox.id="allianceProfile";profileBox.className="card allianceProfile";profileBox.innerHTML='<div class="emptyState">Odaberi savez za detaljan profil, igrače i analizu.</div>';$('intel')?.append(profileBox);

const UNIT_SPEEDS={
  "Legionar":6,"Pretorijanac":5,"Imperijanac":7,"Equites Legati":16,"Equites Imperatoris":14,"Equites Caesaris":10,"Ovan":4,"Vatreni katapult":3,
  "Batinaš":7,"Kopljanik":7,"Sjekiraš":6,"Izviđač":9,"Paladin":10,"Teutonski vitez":9,"Ovan (Teutonci)":4,"Katapult (Teutonci)":3,
  "Falanga":7,"Mačevalac":6,"Pathfinder":17,"Theutates grom":19,"Druidski jahač":16,"Haeduanski jahač":13,"Ovan (Gali)":4,"Trebuchet":3,
  "Heroj / prilagođeno":6
};
let mapPickMode=null;
function readLocalJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{localStorage.removeItem(key);return fallback}}
let troopLedger=readLocalJson("mhq_troops",{});
let localPlans=readLocalJson("mhq_plans",[]);
function parseCoord(value){const m=String(value||"").match(/(-?\d{1,3})\s*[|,;/ ]\s*(-?\d{1,3})/);if(!m)return null;const p={x:Number(m[1]),y:Number(m[2])};return Math.abs(p.x)<=400&&Math.abs(p.y)<=400?p:null}
function travelSeconds(a,b,speed,ts=0,bonus=0){const d=dd(a,b),s=speed*(1+bonus/100);if(d<=20||ts<=0)return d/s*3600;return (20/s+(d-20)/(s*(1+ts/100)))*3600}
function durationText(sec){sec=Math.max(0,Math.round(sec));const d=Math.floor(sec/86400),h=Math.floor(sec%86400/3600),m=Math.floor(sec%3600/60),s=sec%60;return `${d?d+"d ":""}${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`}
function fmtDate(date){return date&&Number.isFinite(date.getTime())?date.toLocaleString("hr-HR") : "—"}
function calculateTravel(){const a=parseCoord($("fromCoord")?.value),b=parseCoord($("toCoord")?.value);if(!a||!b)return $("travelResult").innerHTML='<div class="emptyState warning">Upiši valjane koordinate u obliku x|y.</div>';const speed=Number($("unitSelect").value),ts=Number($("tournamentBonus").value)||0,bonus=Number($("speedBonus").value)||0,sec=travelSeconds(a,b,speed,ts,bonus),distance=dd(a,b);const arrival=$("arrivalAt").value?new Date($("arrivalAt").value):null,departure=arrival?new Date(arrival.getTime()-sec*1000):null,returnAt=arrival?new Date(arrival.getTime()+sec*1000):new Date(Date.now()+sec*2*1000);$("travelResult").innerHTML=`<p class="eyebrow">REZULTAT PUTA</p><div class="travelHero"><b>${durationText(sec)}</b><span>${distance.toFixed(2)} polja</span></div><div class="statBlock"><div><b>${speed}</b>polja/h</div><div><b>${ts}%</b>turnir</div><div><b>${bonus}%</b>bonus</div></div><div class="routeLine"><span>${a.x}|${a.y}</span><i></i><span>${b.x}|${b.y}</span></div>${arrival?`<p><strong>Polazak:</strong> ${fmtDate(departure)}<br><strong>Udar:</strong> ${fmtDate(arrival)}<br><strong>Povratak:</strong> ${fmtDate(returnAt)}</p>`:`<p><strong>Dolazak ako krene sada:</strong> ${fmtDate(new Date(Date.now()+sec*1000))}<br><strong>Povratak:</strong> ${fmtDate(returnAt)}</p>`}<small class="mut">Izračun koristi osnovnu brzinu jedinice; turnir se primjenjuje nakon prvih 20 polja. Provjeri brzinu svijeta i posebne bonuse.</small>`}
const originalSelectVillage=selectVillage;selectVillage=function(v){if(mapPickMode){$(mapPickMode==="from"?"fromCoord":"toCoord").value=`${v.x}|${v.y}`;mapPickMode=null;document.querySelector('nav button[data-view="tools"]')?.click();calculateTravel();toast("Koordinate preuzete s karte");return}originalSelectVillage(v)};
function startMapPick(kind){mapPickMode=kind;document.querySelector('nav button[data-view="map"]')?.click();toast(`Klikni selo za ${kind==="from"?"polazište":"cilj"}`)}

function alliancePlayers(tag){const by={};for(const v of DATA.filter(x=>x.alliance===tag)){by[v.playerId]??={id:v.playerId,name:v.player,tribe:v.tribe,villages:[],population:0};by[v.playerId].villages.push(v);by[v.playerId].population+=Number(v.population)||0}return Object.values(by).sort((a,b)=>b.population-a.population)}
function renderAllianceProfile(tag){const s=ALLIANCE_STATS[tag];if(!s)return;const villages=DATA.filter(v=>v.alliance===tag),players=alliancePlayers(tag),cx=villages.reduce((n,v)=>n+v.x,0)/villages.length,cy=villages.reduce((n,v)=>n+v.y,0)/villages.length,spread=villages.reduce((n,v)=>n+Math.hypot(v.x-cx,v.y-cy),0)/villages.length,capitals=villages.filter(v=>v.capital).length,avgPlayer=s.population/Math.max(1,players.length),nearEnemy=villages.filter(v=>rel(v.alliance)==="enemy"||DATA.some(e=>rel(e.alliance)==="enemy"&&dd(v,e)<=10)).length;profileBox.innerHTML=`<div class="profileHead"><div><p class="eyebrow">ALLIANCE PROFILE</p><h2>${safe(tag)}</h2><span class="relPill ${rel(tag)}">${rel(tag).toUpperCase()}</span></div><button data-profile-map="${safe(tag)}" class="primary">Prikaži na karti</button></div><div class="cards miniCards"><div class="card metric"><span>Igrači</span><b>${players.length}</b></div><div class="card metric"><span>Sela</span><b>${s.villages}</b></div><div class="card metric"><span>Populacija</span><b>${s.population.toLocaleString()}</b></div><div class="card metric"><span>Pop / igrač</span><b>${Math.round(avgPlayer).toLocaleString()}</b></div><div class="card metric"><span>Sela / igrač</span><b>${(s.villages/Math.max(1,players.length)).toFixed(1)}</b></div><div class="card metric"><span>Raspršenost</span><b>${spread.toFixed(1)}</b></div></div><div class="analysisStrip"><span><b>${capitals}</b> glavnih sela</span><span><b>${Math.round(s.population/s.villages)}</b> prosjek sela</span><span><b>${Math.round(cx)}|${Math.round(cy)}</b> centar saveza</span><span><b>${nearEnemy}</b> sela u rizičnoj zoni</span></div><h3>Igrači saveza</h3><div class="tablewrap"><table><thead><tr><th>Igrač</th><th>Pleme</th><th>Sela</th><th>Populacija</th><th>Najveće selo</th><th>Raspon</th></tr></thead><tbody>${players.map(p=>{const top=[...p.villages].sort((a,b)=>b.population-a.population)[0],xs=p.villages.map(v=>v.x),ys=p.villages.map(v=>v.y);return `<tr><td><b>${safe(p.name)}</b></td><td>${tribes[p.tribe]||p.tribe}</td><td>${p.villages.length}</td><td>${p.population.toLocaleString()}</td><td>${safe(top?.village||"—")} · ${top?.population||0}</td><td>${(Math.hypot(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys))).toFixed(1)}</td></tr>`}).join("")}</tbody></table></div>`;profileBox.querySelector("[data-profile-map]").onclick=()=>{document.querySelector('nav button[data-view="map"]')?.click();showAllianceIntel(tag);focusAllianceOnMap(tag)};profileBox.scrollIntoView({behavior:"smooth",block:"start"})}
const baseShowAllianceIntel=showAllianceIntel;showAllianceIntel=function(tag){baseShowAllianceIntel(tag);renderAllianceProfile(tag)};
const baseRenderIntel=renderIntel;renderIntel=function(){baseRenderIntel();$("intelBody")?.querySelectorAll("tr").forEach(row=>{row.classList.add("clickableRow");row.onclick=e=>{if(e.target.closest("button"))return;const tag=row.cells[1]?.textContent?.trim();if(tag)renderAllianceProfile(tag)}})};
const MAP_PALETTE={own:"#f0a23a",ally:"#4d9de0",nap:"#9b7ede",enemy:"#e45756",natar:"#8d99ae",none:"#b8c2cc"};
function allianceMapColor(v){if(v.tribe===5)return MAP_PALETTE.natar;const relation=rel(v.alliance);if(relation!=="neutral")return MAP_PALETTE[relation];if(!v.alliance)return MAP_PALETTE.none;let hash=0;for(const ch of v.alliance)hash=(hash*31+ch.charCodeAt(0))|0;return `hsl(${Math.abs(hash)%360} 62% 58%)`}
const SVG_NS="http://www.w3.org/2000/svg";
function svgEl(name,attrs={}){const el=document.createElementNS(SVG_NS,name);for(const [key,value] of Object.entries(attrs))el.setAttribute(key,value);return el}
function terrainColor(x,y){const n=Math.abs((x*73856093)^(y*19349663))%11;return n<2?"#c8d7a2":n<5?"#dce2b5":n<8?"#e7dfb4":"#d3d6a5"}
function drawTravianMap(){const s=$("svg");s.innerHTML="";s.setAttribute("viewBox",`${zoom.x} ${zoom.y} ${zoom.w} ${zoom.h}`);s.classList.toggle("tileZoom",zoom.w<=55);const close=zoom.w<=55,detailed=zoom.w<=28;
  s.append(svgEl("rect",{x:zoom.x,y:zoom.y,width:zoom.w,height:zoom.h,class:"mapBase"}));
  if(close){const x0=Math.floor(zoom.x)-1,x1=Math.ceil(zoom.x+zoom.w)+1,y0=Math.floor(zoom.y)-1,y1=Math.ceil(zoom.y+zoom.h)+1;for(let x=x0;x<=x1;x++)for(let sy=y0;sy<=y1;sy++){const gy=-sy,tile=svgEl("rect",{x:x-.5,y:sy-.5,width:1,height:1,class:"terrainTile"});tile.style.fill=terrainColor(x,gy);s.append(tile)}for(let x=Math.ceil(x0/5)*5;x<=x1;x+=5){const label=svgEl("text",{x:x+.08,y:zoom.y+.72,class:"coordLabel"});label.textContent=x;s.append(label)}for(let sy=Math.ceil(y0/5)*5;sy<=y1;sy+=5){const label=svgEl("text",{x:zoom.x+.1,y:sy-.08,class:"coordLabel"});label.textContent=-sy;s.append(label)}}
  else{const step=zoom.w>250?25:10;for(let n=-400;n<=400;n+=step){s.append(svgEl("line",{x1:n,x2:n,y1:-400,y2:400,class:n===0?"axis":"grid"}));s.append(svgEl("line",{y1:n,y2:n,x1:-400,x2:400,class:n===0?"axis":"grid"}))}}
  for(const v of current){const color=allianceMapColor(v);let marker;if(close){marker=svgEl("g",{class:`villageMarker ${cls(v)}`});const tile=svgEl("rect",{x:v.x-.38,y:-v.y-.34,width:.76,height:.68,rx:.1,class:"villageTile"});tile.style.fill=color;const roof=svgEl("path",{d:`M ${v.x-.25} ${-v.y-.05} L ${v.x} ${-v.y-.27} L ${v.x+.25} ${-v.y-.05} Z`,class:"villageRoof"});marker.append(tile,roof);if(detailed){const label=svgEl("text",{x:v.x+.48,y:-v.y+.18,class:"villageLabel"});label.textContent=v.player;marker.append(label)}}else{marker=svgEl("circle",{cx:v.x,cy:-v.y,r:Math.max(.46,Math.min(1.22,.4+Math.sqrt(Number(v.population)||0)/35)),class:`v ${cls(v)}`});marker.style.fill=color}marker.onmouseenter=e=>showTip(e,v);marker.onmouseleave=()=>$("tip").style.display="none";marker.onclick=()=>selectVillage(v);s.append(marker)}
  for(const r of reservations)s.append(svgEl("circle",{cx:r.x,cy:-r.y,r:close ? .48 : 2.2,class:"res"}))
}
draw=drawTravianMap;

function renderTroops(){const rows=Object.values(troopLedger).sort((a,b)=>b.total-a.total),sum=k=>rows.reduce((n,r)=>n+(Number(r[k])||0),0);$("troopSummary").innerHTML=`<div class="card metric"><span>Ukupno evidentirano</span><b>${sum("total").toLocaleString()}</b></div><div class="card metric"><span>OFF igrači</span><b>${rows.filter(r=>r.role==="off").length}</b></div><div class="card metric"><span>DEF igrači</span><b>${rows.filter(r=>r.role==="def").length}</b></div>`;$("troopBody").innerHTML=rows.map(r=>`<tr><td><b>${safe(r.player)}</b></td><td><span class="badge">${safe(r.role).toUpperCase()}</span></td><td>${r.inf.toLocaleString()}</td><td>${r.cav.toLocaleString()}</td><td>${r.siege.toLocaleString()}</td><td>${r.scout.toLocaleString()}</td><td><b>${r.total.toLocaleString()}</b></td><td><button class="danger" data-del-troop="${safe(r.player)}">×</button></td></tr>`).join("")||'<tr><td colspan="8" class="mut">Još nema provjerenih unosa.</td></tr>';document.querySelectorAll("[data-del-troop]").forEach(b=>b.onclick=()=>{delete troopLedger[b.dataset.delTroop];localStorage.setItem("mhq_troops",JSON.stringify(troopLedger));renderTroops()})}
function saveTroops(){const player=$("troopPlayer").value,inf=Number($("troopInf").value)||0,cav=Number($("troopCav").value)||0,siege=Number($("troopSiege").value)||0,scout=Number($("troopScout").value)||0;if(!player)return;troopLedger[player]={player,role:$("troopRole").value,inf,cav,siege,scout,total:inf+cav+siege+scout,updatedAt:new Date().toISOString()};localStorage.setItem("mhq_troops",JSON.stringify(troopLedger));renderTroops();toast("Evidencija spremljena")}
function analyzeCropFarm(){const c=parseCoord($("cropCenter").value);if(!c)return toast("Upiši centar kao x|y");const radius=Math.min(200,Math.max(1,Number($("cropRadius").value)||25)),type=$("cropType").value;let rows=[];if(type==="farms")rows=DATA.filter(v=>v.tribe!==5&&v.alliance!==OWN&&dd(c,v)<=radius&&v.population<180).sort((a,b)=>a.population-b.population||dd(c,a)-dd(c,b)).slice(0,80).map(v=>({coord:`${v.x}|${v.y}`,name:v.player,detail:`${v.population} pop · ${v.alliance||"bez saveza"}`,distance:dd(c,v)}));else if(type==="15c"||type==="9c")rows=reservations.filter(r=>r.type===type&&dd(c,r)<=radius).map(r=>({coord:`${r.x}|${r.y}`,name:r.player,detail:`rezervirano · ${r.status}`,distance:dd(c,r)}));else{const occupied=new Set(DATA.map(v=>`${v.x}|${v.y}`)),reserved=new Set(reservations.map(r=>`${r.x}|${r.y}`));for(let x=Math.ceil(c.x-radius);x<=Math.floor(c.x+radius);x++)for(let y=Math.ceil(c.y-radius);y<=Math.floor(c.y+radius);y++){const p={x,y},key=`${x}|${y}`,d=dd(c,p);if(d<=radius&&!occupied.has(key)&&!reserved.has(key))rows.push({coord:key,name:"Slobodna lokacija",detail:"nije zauzeta u snimci karte",distance:d})}rows.sort((a,b)=>a.distance-b.distance);rows=rows.slice(0,80)}$("cropResults").innerHTML=`<div class="sectionHead"><h3>${type==="farms"?"Moguće mete (procjena)":"Rezultati"}</h3><span class="badge">${rows.length}</span></div>${type==="farms"?'<p class="notice">Ovo nije dokaz neaktivnosti: karta nema online status ni izvještaje. Provjeri metu prije napada.</p>':""}<div class="finderList">${rows.map(r=>`<button data-found="${r.coord}"><b>${r.coord}</b><span>${safe(r.name)} · ${safe(r.detail)} · ${r.distance.toFixed(1)} polja</span></button>`).join("")||'<div class="emptyState">Nema rezultata u zadanom području.</div>'}</div>`;document.querySelectorAll("[data-found]").forEach(b=>b.onclick=()=>{$("toCoord").value=b.dataset.found;document.querySelector('[data-tool="travelTool"]')?.click()})}
function renderPlans(){localPlans.sort((a,b)=>new Date(a.departure)-new Date(b.departure));$("planTimeline").innerHTML=localPlans.map((p,i)=>`<div class="planItem ${p.type}"><div><span class="badge">${safe(p.type).toUpperCase()}</span> <b>${safe(p.name||"Plan")}</b><p>${safe(p.player||"—")} · ${p.from} → ${p.to} · ${Number(p.amount||0).toLocaleString()} jedinica</p><small>Polazak ${fmtDate(new Date(p.departure))} · Dolazak ${fmtDate(new Date(p.arrival))}</small></div><button class="danger" data-del-plan="${i}">×</button></div>`).join("")||'<div class="emptyState">Nema unosa u vremenskoj crti.</div>';document.querySelectorAll("[data-del-plan]").forEach(b=>b.onclick=()=>{localPlans.splice(Number(b.dataset.delPlan),1);localStorage.setItem("mhq_plans",JSON.stringify(localPlans));renderPlans()})}
function addPlan(){const a=parseCoord($("planFrom").value),b=parseCoord($("planTo").value),arrival=new Date($("planArrival").value),speed=Number($("planUnit").value);if(!a||!b||!Number.isFinite(arrival.getTime()))return toast("Unesi koordinate i vrijeme dolaska");const sec=travelSeconds(a,b,speed,0,0);localPlans.push({name:$("planName").value,type:$("planType").value,from:`${a.x}|${a.y}`,to:`${b.x}|${b.y}`,player:$("planPlayer").value,amount:Number($("planAmount").value)||0,arrival:arrival.toISOString(),departure:new Date(arrival.getTime()-sec*1000).toISOString()});localStorage.setItem("mhq_plans",JSON.stringify(localPlans));renderPlans();toast("Plan dodan")}
function exportRows(name,rows){const csv=rows.map(r=>r.map(x=>`"${String(x??"").replaceAll('"','""')}"`).join(",")).join("\n"),a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
function initToolkit(){const opts=Object.entries(UNIT_SPEEDS).map(([n,s])=>`<option value="${s}">${n} · ${s} polja/h</option>`).join("");$("unitSelect").innerHTML=opts;$("planUnit").innerHTML=opts;$("troopPlayer").innerHTML=M_MEMBERS.map(m=>`<option>${safe(m.name)}</option>`).join("");$("cropCenter").value=`${Math.round(center.x)}|${Math.round(center.y)}`;document.querySelectorAll("[data-tool]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-tool],.toolPanel").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.tool).classList.add("active")});$("pickFrom").onclick=()=>startMapPick("from");$("pickTo").onclick=()=>startMapPick("to");$("calculateTravel").onclick=calculateTravel;$("findCrops").onclick=analyzeCropFarm;$("saveTroops").onclick=saveTroops;$("addPlan").onclick=addPlan;$("convertCoords").onclick=()=>{const found=[...$("coordInput").value.matchAll(/(-?\d{1,3})\s*[|,;\/]\s*(-?\d{1,3})/g)].map(m=>`${Number(m[1])}|${Number(m[2])}`),unique=[...new Set(found)];$("coordOutput").value=unique.join("\n");$("coordCount").textContent=`Pronađeno: ${unique.length} jedinstvenih koordinata`};$("copyCoords").onclick=()=>navigator.clipboard.writeText($("coordOutput").value).then(()=>toast("Koordinate kopirane"));$("exportTroops").onclick=()=>exportRows("mhq-troops.csv",[["player","role","infantry","cavalry","siege","scouts","total"],...Object.values(troopLedger).map(r=>[r.player,r.role,r.inf,r.cav,r.siege,r.scout,r.total])]);renderTroops();renderPlans()}
function cleanStaticText(){const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=walker.nextNode()))n.nodeValue=repairText(n.nodeValue);document.querySelectorAll("[placeholder],[title]").forEach(el=>{if(el.placeholder)el.placeholder=repairText(el.placeholder);if(el.title)el.title=repairText(el.title)})}
try{initToolkit();cleanStaticText()}catch(error){console.error("Toolkit initialization failed",error)}
["languageInput","langTop"].forEach(id=>$(id)?.querySelectorAll("option").forEach(option=>{if(!["hr","en"].includes(option.value))option.remove()}));if(!["hr","en"].includes(lang))lang="hr";
new MutationObserver(changes=>{for(const change of changes)for(const node of change.addedNodes)if(node.nodeType===Node.ELEMENT_NODE)translateWholeUI(node)}).observe(document.body,{childList:true,subtree:true});

document.querySelectorAll("[data-open-view]").forEach(b=>b.onclick=()=>document.querySelector(`nav button[data-view="${b.dataset.openView}"]`)?.click());
document.querySelectorAll("nav button[data-view]").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));$(b.dataset.view).classList.add("active");localStorage.setItem("mhq_last_view",b.dataset.view);if(b.dataset.view==="intel")renderIntel()});
$("enterBtn").onclick=memberLogin;$("googleBtn").onclick=googleLogin;$("languageInput").onchange=()=>{lang=$("languageInput").value;applyLang()};$("langTop").onchange=()=>{lang=$("langTop").value;localStorage.setItem("mhq_lang",lang);applyLang()};
$("accountBtn").onclick=()=>{$("accountName").textContent=avatar;$("accountIdentity").textContent=currentUser?.email||"Anonymous member";$("accountRole").textContent=role.toUpperCase();$("accountModal").classList.remove("hidden")};$("closeAccount").onclick=()=>$("accountModal").classList.add("hidden");$("signOutBtn").onclick=async()=>{localStorage.removeItem("mhq_avatar");await signOut(auth);location.reload()};
$("applyMap").onclick=applyMap;$("search").oninput=applyMap;
$("mapScope").onchange=applyMap;
$("allianceSearch").oninput=renderAllianceLayers;
$("showNoAlliance").onchange=()=>{showNoAlliance=$("showNoAlliance").checked;persistLayers();applyMap()};
$("showNatars").onchange=()=>{showNatars=$("showNatars").checked;persistLayers();applyMap()};
$("resetLayers").onclick=()=>applyPreset("all");
$("exportMap").onclick=exportVisibleCsv;
$("clearAllianceIntel").onclick=clearAllianceIntel;
$("focusAlliance").onclick=()=>selectedAlliance&&focusAllianceOnMap(selectedAlliance);
$("favoriteAlliance").onclick=()=>selectedAlliance&&toggleFavorite(selectedAlliance);
$("hideAlliance").onclick=()=>{if(!selectedAlliance)return;visibleAlliances.delete(selectedAlliance);persistLayers();renderAllianceLayers();applyMap();toast(`${selectedAlliance} sakriven`)};
document.querySelectorAll("[data-setrel]").forEach(b=>b.onclick=async()=>{if(!isAdmin()||!selectedAlliance)return;await setDoc(doc(db,"diplomacy",selectedAlliance),{rel:b.dataset.setrel,note:"",updatedBy:avatar,updatedAt:serverTimestamp()});logAction(`postavio/la ${selectedAlliance} kao ${b.dataset.setrel}`)});
$("intelSearch").oninput=renderIntel;$("intelRelation").onchange=renderIntel;
$("memberSearch").oninput=renderMembers;$("memberSort").onchange=renderMembers;$("focusMember").onclick=focusSelectedMember;
$("visualMode").onclick=()=>setVisualMode(!brightMode);
document.querySelectorAll("[data-preset]").forEach(b=>b.onclick=()=>applyPreset(b.dataset.preset));["rx","ry"].forEach(i=>$(i).oninput=locCheck);$("reserveSelected").onclick=()=>{if(!selected)return;$("rx").value=selected.x;$("ry").value=selected.y;locCheck();document.querySelector('nav button[data-view="reservations"]').click()};
$("saveRes").onclick=async()=>{const x=+$("rx").value,y=+$("ry").value,player=$("rplayer").value.trim();if(!Number.isFinite(x)||!Number.isFinite(y)||!player)return alert("Nedostaju koordinate ili igrač.");if(reservations.some(r=>r.x===x&&r.y===y))return alert("Te koordinate su već rezervirane.");await addDoc(collection(db,"reservations"),{x,y,player,type:$("rtype").value,priority:$("rpriority").value,status:isAdmin()?$("rstatus").value:"planned",note:$("rnote").value,ownerUid:uid,updatedBy:avatar,updatedAt:serverTimestamp()});logAction(`rezervirao/la ${x}|${y} za ${player}`)};
$("saveDip").onclick=async()=>{if(!isAdmin())return;const tag=$("dipTag").value.trim();if(!tag)return;await setDoc(doc(db,"diplomacy",tag),{rel:$("dipRel").value,note:$("dipNote").value,updatedBy:avatar,updatedAt:serverTimestamp()});logAction(`postavio/la ${tag} kao ${$("dipRel").value}`)};
$("saveOp").onclick=async()=>{if(!isAdmin())return;const name=$("opName").value.trim();if(!name)return;await addDoc(collection(db,"operations"),{name,type:$("opType").value,time:$("opTime").value,status:$("opStatus").value,players:$("opPlayers").value,note:$("opNote").value,updatedBy:avatar,updatedAt:serverTimestamp()});logAction(`kreirao/la operaciju ${name}`)};
const svg=$("svg");let drag=null;svg.onwheel=e=>{e.preventDefault();const f=e.deltaY>0?1.15:.87;zoom.x+=zoom.w*(1-f)/2;zoom.y+=zoom.h*(1-f)/2;zoom.w*=f;zoom.h*=f;draw()};svg.onmousedown=e=>drag={x:e.clientX,y:e.clientY,z:{...zoom}};window.onmouseup=()=>drag=null;window.onmousemove=e=>{if(!drag)return;zoom.x=drag.z.x-(e.clientX-drag.x)*zoom.w/svg.clientWidth;zoom.y=drag.z.y-(e.clientY-drag.y)*zoom.h/svg.clientHeight;draw()};
setVisualMode(brightMode);
if("serviceWorker" in navigator)navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
try{const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);onAuthStateChanged(auth,u=>{if(u&&avatar)start(u).catch(error=>{console.error(error);$("gateStatus").textContent=`Profile load failed (${error?.code||error?.message||"unknown"}).`})});if(avatar){$("avatarInput").value=avatar;$("languageInput").value=lang}applyLang()}catch(e){$("gateStatus").textContent=`Firebase config error (${e?.code||e?.message||"unknown"}).`;console.error(e)}
