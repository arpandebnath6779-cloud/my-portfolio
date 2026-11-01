(() => {
"use strict";
const API=window.ARPANX_API_URL||"/.netlify/functions/arpanx",KEY="arpanx-chat-v1";
const intro={role:"assistant",content:"Hey! I’m **ArpanX** — Arpan’s portfolio assistant. Ask me about his projects, biomedical engineering journey, interests, or how to get in touch. What would you like to explore?"};
const root=document.getElementById("arpanx");if(!root)return;
const panel=root.querySelector(".ax-window"),launch=root.querySelector(".ax-launcher"),list=root.querySelector(".ax-messages"),form=root.querySelector(".ax-form"),input=root.querySelector(".ax-input"),send=root.querySelector(".ax-send"),banner=root.querySelector(".ax-banner");
let busy=false,messages=(()=>{try{const x=JSON.parse(sessionStorage.getItem(KEY));if(Array.isArray(x)&&x.length&&x.every(m=>["user","assistant"].includes(m.role)&&typeof m.content==="string"))return x.slice(-24)}catch{}return [intro]})();
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function md(text){
const blocks=[];
let s=esc(text).replace(/\x60{3}([^\n]*)\n([\s\S]*?)\x60{3}/g,(_,lang,code)=>{
const safeLang=lang.trim().replace(/[^\w-]/g,"");
blocks.push('<pre><code'+(safeLang?' class="language-'+safeLang+'"':'')+'>'+code.replace(/\n$/,"")+'</code></pre>');
return "AXCODE"+(blocks.length-1)+"TOKEN";
});
s=s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,(match,label,raw)=>{
try{const url=new URL(raw);if(["https:","mailto:"].includes(url.protocol))return '<a href="'+esc(url.href)+'"'+(url.protocol==="https:"?' target="_blank" rel="noopener noreferrer"':'')+'>'+label+'</a>'}catch{}
return label;
});
s=s.replace(/\x60([^\x60]+)\x60/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>").replace(/\n/g,"<br>");
return s.replace(/AXCODE(\d+)TOKEN/g,(_,i)=>blocks[Number(i)]||"");
}
function save(){try{sessionStorage.setItem(KEY,JSON.stringify(messages.slice(-24)))}catch{}}
function draw(){list.replaceChildren();messages.forEach((m,i)=>{const a=document.createElement("article");a.className="ax-message "+(m.role==="user"?"ax-message-user":"");const l=document.createElement("span");l.className="ax-message-label";l.textContent=m.role==="user"?"You":"ArpanX";const b=document.createElement("div");b.className="ax-bubble";b.innerHTML=md(m.content);a.append(l,b);if(m.role==="assistant"&&i>0){const actions=document.createElement("div");actions.className="ax-message-actions";const copy=document.createElement("button");copy.textContent="COPY";copy.onclick=async()=>{try{await navigator.clipboard.writeText(m.content);copy.textContent="COPIED";setTimeout(()=>copy.textContent="COPY",1000)}catch{}};actions.append(copy);if(i===messages.length-1){const again=document.createElement("button");again.textContent="REGENERATE";again.onclick=regenerate;actions.append(again)}a.append(actions)}list.append(a)});if(busy){const t=document.createElement("article");t.className="ax-message";t.innerHTML='<span class="ax-message-label">ArpanX</span><div class="ax-bubble ax-typing">Thinking…</div>';list.append(t)}list.scrollTop=list.scrollHeight}
function push(m){messages.push(m);messages=messages.slice(-24);save();draw()}
function setBusy(v){busy=v;send.disabled=v;input.disabled=v;send.textContent=v?"…":"↗";draw()}
async function request(){if(busy)return;const text=input.value.trim();if(!text)return;if(text.length>2500){banner.hidden=false;banner.textContent="Please keep each message under 2,500 characters.";return}banner.hidden=true;input.value="";input.style.height="auto";push({role:"user",content:text});setBusy(true);try{const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:messages.slice(-12)})});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||(r.status===404?"The ArpanX service is not connected yet. See ARPANX_SETUP.md.":"Please try again in a moment."));if(typeof d.reply!=="string"||!d.reply.trim())throw Error("The assistant returned an empty reply.");push({role:"assistant",content:d.reply.trim()})}catch(e){banner.hidden=false;banner.textContent=e instanceof TypeError?"ArpanX needs its secure Netlify service. See ARPANX_SETUP.md to connect it.":e.message;messages.pop();save();draw()}finally{setBusy(false);input.focus()}}
async function regenerate(){if(busy||messages.length<2)return;messages.pop();const i=messages.map(m=>m.role).lastIndexOf("user");if(i<0)return;messages=messages.slice(0,i+1);save();setBusy(true);try{const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:messages.slice(-12)})});const d=await r.json().catch(()=>({}));if(!r.ok||typeof d.reply!=="string")throw Error();push({role:"assistant",content:d.reply.trim()})}catch{push({role:"assistant",content:"I couldn’t regenerate that response. Please try again."})}finally{setBusy(false)}}
function open(){panel.dataset.open="true";panel.setAttribute("aria-hidden","false");launch.hidden=true;input.focus();draw()}
function close(){panel.dataset.open="false";panel.setAttribute("aria-hidden","true");launch.hidden=false;launch.focus()}
launch.onclick=open;root.querySelector(".ax-close").onclick=close;root.querySelector(".ax-minimize").onclick=()=>panel.dataset.compact=panel.dataset.compact==="true"?"false":"true";root.querySelector(".ax-clear").onclick=()=>{if(!busy){messages=[intro];save();banner.hidden=true;draw()}};
root.querySelectorAll(".ax-suggestion").forEach(b=>b.onclick=()=>{input.value=b.dataset.prompt;form.requestSubmit()});
form.onsubmit=e=>{e.preventDefault();request()};input.oninput=()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,110)+"px"};input.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit()}if(e.key==="Escape")close()};document.addEventListener("keydown",e=>{if(e.key==="Escape"&&panel.dataset.open==="true")close()});panel.setAttribute("aria-hidden","true");draw();
})();