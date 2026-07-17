// ==UserScript==
// @name         M HQ Travian Map Collector
// @namespace    https://aripanda278-create.github.io/ari/
// @version      1.0.0
// @description  Collects oasis and cropper tiles already loaded by the normal Travian map.
// @match        https://*.travian.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(()=>{
  "use strict";
  const STORE="mhq_collected_tiles_v1",tiles=new Map();
  try{for(const v of JSON.parse(localStorage.getItem(STORE)||"[]"))tiles.set(`${v.x}|${v.y}`,v)}catch{}
  const save=()=>localStorage.setItem(STORE,JSON.stringify([...tiles.values()]));
  const text=v=>String(v??"");
  const valid=(x,y)=>Number.isInteger(x)&&Number.isInteger(y)&&Math.abs(x)<=400&&Math.abs(y)<=400;
  function bonusesFrom(raw){
    const out={},names={1:"wood",2:"clay",3:"iron",4:"crop"};let m;
    const token=/\{a\.r([1-4])\}[\s\S]{0,60}?(25|50)%/gi;while((m=token.exec(raw)))out[names[m[1]]]=Math.max(out[names[m[1]]]||0,+m[2]);
    for(const [name,rx] of Object.entries({wood:/wood|lumber|drvo/i,clay:/clay|glina/i,iron:/iron|željez/i,crop:/crop|wheat|grain|žito/i})){const hit=raw.match(new RegExp(`(?:${rx.source})[\\s\\S]{0,30}?(25|50)%|(?:25|50)%[\\s\\S]{0,30}?(?:${rx.source})`,"i"));if(hit){const n=+(hit[1]||raw.match(/(25|50)%/)?.[1]||0);if(n)out[name]=Math.max(out[name]||0,n)}}
    return out;
  }
  function classify(v){
    if(Array.isArray(v)){
      const x=Number(v[0]),y=Number(v[1]),field=Number(v[2]),land=Number(v[3]);if(!valid(x,y))return null;
      if(field===1)return{x,y,kind:"cropper9",bonuses:{},rawClass:`legacy-field-${field}`,rawTitle:""};
      if(field===6)return{x,y,kind:"cropper15",bonuses:{},rawClass:`legacy-field-${field}`,rawTitle:""};
      if(field===0&&[3,6,9,10,11,12].includes(land)){const b={};if(land===3)b.wood=25;else if(land===6)b.clay=25;else if(land===9)b.iron=25;else if(land===12)b.crop=50;return{x,y,kind:"oasis",bonuses:b,rawClass:`legacy-oasis-${land}`,rawTitle:""}}
      return null;
    }
    if(!v||typeof v!=="object")return null;const x=Number(v.x),y=Number(v.y);if(!valid(x,y))return null;
    const rawClass=text(v.c||v.className||v.tileClass||v.type),rawTitle=text(v.t||v.title||v.tooltip||v.html),raw=`${rawClass} ${rawTitle}`,field=Number(v.fieldType??v.fieldComposition??NaN),land=Number(v.oasisType??v.landscapeType??NaN);let kind="";
    if(field===6)kind="cropper15";else if(field===1)kind="cropper9";
    else if(v.isOasis===true||Number.isFinite(land))kind="oasis";
    else if(/\{k\.f6\}|(?:^|\D)15c(?:\D|$)|cropper.?15/i.test(raw))kind="cropper15";
    else if(/\{k\.f1\}|(?:^|\D)9c(?:\D|$)|cropper.?9/i.test(raw))kind="cropper9";
    else if(/\{k\.fo\}|oasis|oaza/i.test(raw))kind="oasis";
    if(!kind)return null;const bonuses=kind==="oasis"?bonusesFrom(raw):{};if(kind==="oasis"&&!Object.keys(bonuses).length){if(land===3)bonuses.wood=25;else if(land===6)bonuses.clay=25;else if(land===9)bonuses.iron=25;else if(land===12)bonuses.crop=50}return{x,y,kind,bonuses,occupied:Boolean(v.u||v.playerId||v.ownerId),rawClass:rawClass.slice(0,500),rawTitle:rawTitle.slice(0,1000)};
  }
  function collect(payload){let added=0;const seen=new Set();function walk(v){if(!v||typeof v==="string"||typeof v==="number"||typeof v==="boolean")return;if(seen.has(v))return;seen.add(v);const tile=classify(v);if(tile){const key=`${tile.x}|${tile.y}`,old=tiles.get(key);tiles.set(key,{...(old||{}),...tile,bonuses:{...(old?.bonuses||{}),...(tile.bonuses||{})}});if(!old)added++}if(Array.isArray(v))for(const x of v)walk(x);else for(const x of Object.values(v))walk(x)}walk(payload);if(added){save();updatePanel()}return added}
  function parse(raw){try{return typeof raw==="string"?JSON.parse(raw):raw}catch{return null}}
  const originalOpen=XMLHttpRequest.prototype.open,originalSend=XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open=function(method,url){this.__mhqUrl=text(url);return originalOpen.apply(this,arguments)};
  XMLHttpRequest.prototype.send=function(){if(/map|tile|position|ajax/i.test(this.__mhqUrl||""))this.addEventListener("load",()=>collect(parse(this.responseType==="json"?this.response:this.responseText)));return originalSend.apply(this,arguments)};
  if(window.fetch){const originalFetch=window.fetch;window.fetch=async function(){const response=await originalFetch.apply(this,arguments),url=text(arguments[0]?.url||arguments[0]);if(/map|tile|position|ajax/i.test(url))response.clone().json().then(collect).catch(()=>{});return response}}
  function exportData(){const payload={format:"mhq-travian-map-v1",server:location.host,collectedAt:new Date().toISOString(),tiles:[...tiles.values()]},blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`mhq-map-${location.host}-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  let panel,count;
  function updatePanel(){if(count)count.textContent=`${tiles.size} tiles`}
  function mount(){if(panel||!document.body)return;panel=document.createElement("div");panel.id="mhq-map-collector";panel.innerHTML=`<b>M HQ map collector</b><span id="mhq-count"></span><small>Move around the Travian map normally.</small><div><button id="mhq-export">Export JSON</button><button id="mhq-clear">Clear</button><button id="mhq-hide">–</button></div>`;Object.assign(panel.style,{position:"fixed",right:"16px",bottom:"16px",zIndex:"999999",background:"#173b2b",color:"white",padding:"12px",borderRadius:"12px",boxShadow:"0 10px 35px #0007",font:"13px system-ui",display:"grid",gap:"7px",maxWidth:"270px"});panel.querySelectorAll("button").forEach(b=>Object.assign(b.style,{border:0,borderRadius:"7px",padding:"7px 9px",marginRight:"4px",cursor:"pointer"}));document.body.append(panel);count=panel.querySelector("#mhq-count");updatePanel();panel.querySelector("#mhq-export").onclick=exportData;panel.querySelector("#mhq-clear").onclick=()=>{if(confirm("Clear all collected M HQ map tiles?")){tiles.clear();save();updatePanel()}};panel.querySelector("#mhq-hide").onclick=()=>panel.remove()}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
})();
