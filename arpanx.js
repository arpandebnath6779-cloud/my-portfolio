(() => {
"use strict";
const DB_URL=new URL("./data/arpanx-faq.json",document.currentScript?.src||location.href);
const STORE_KEY="arpanx-faq-chat-v1";
const WELCOME={role:"assistant",content:"Hey! 👋 I’m ArpanX, your guide to Arpan Debnath’s portfolio.\n\nCurious about Arpan? Ask me about his background, education, technical skills, projects, interests and more!"};
const NO_MATCH="Sorry! I don’t have that information in my knowledge base yet. Try asking something about Arpan’s education, skills, projects or interests.";
const root=document.getElementById("arpanx");
if(!root)return;
const launcher=root.querySelector(".ax-launcher"),panel=root.querySelector(".ax-window");
const messagesEl=root.querySelector(".ax-messages"),form=root.querySelector(".ax-form");
const input=root.querySelector(".ax-input"),send=root.querySelector(".ax-send");
const banner=root.querySelector(".ax-banner"),categoriesEl=root.querySelector(".ax-category-list");
const questionList=root.querySelector(".ax-question-list");
let faq=[],messages=loadMessages(),busy=false;
function loadMessages(){try{const saved=JSON.parse(sessionStorage.getItem(STORE_KEY)||"null");if(Array.isArray(saved)&&saved.length&&saved.every(m=>["user","assistant"].includes(m.role)&&typeof m.content==="string"))return saved.slice(-30)}catch{}return[WELCOME]}
function save(){try{sessionStorage.setItem(STORE_KEY,JSON.stringify(messages.slice(-30)))}catch{}}
function escapeHTML(value){return String(value).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function renderMarkdown(text){
 if(typeof text==="string"&&text.includes("\\n")&&!text.includes("\n"))text=text.replace(/\\n/g,"\n").replace(/\\r/g,"\n");
 const blocks=[];let safe=escapeHTML(text);
 safe=safe.replace(/\x60{3}([^\n]*)\n([\s\S]*?)\x60{3}/g,(_,lang,code)=>{const cls=lang.trim().replace(/[^\w-]/g,"");blocks.push("<pre><code"+(cls?' class="language-'+cls+'"':"")+">"+code.replace(/\n$/,"")+"</code></pre>");return"AXFAQCODE"+(blocks.length-1)+"END"});
 safe=safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,(all,label,raw)=>{try{const url=new URL(raw);if(["https:","mailto:"].includes(url.protocol))return'<a href="'+escapeHTML(url.href)+'"'+(url.protocol==="https:"?' target="_blank" rel="noopener noreferrer"':"")+">"+label+"</a>"}catch{}return label});
 safe=safe.replace(/\x60([^\x60]+)\x60/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>");
 const html=safe.split(/\n\n+/).map(part=>{if(/^AXFAQCODE\d+END$/.test(part))return part;const lines=part.split("\n");if(lines.length&&lines.every(line=>/^[-*] /.test(line)))return"<ul>"+lines.map(line=>"<li>"+line.slice(2)+"</li>").join("")+"</ul>";return"<p>"+lines.join("<br>")+"</p>"}).join("");
 return html.replace(/AXFAQCODE(\d+)END/g,(_,i)=>blocks[Number(i)]||"");
}
function render(){
 messagesEl.replaceChildren();
 messages.forEach((message,index)=>{
  const article=document.createElement("article");article.className="ax-message "+(message.role==="user"?"ax-message-user":"ax-message-assistant");
  const label=document.createElement("span");label.className="ax-message-label";label.textContent=message.role==="user"?"You":"ArpanX";
  const bubble=document.createElement("div");bubble.className="ax-bubble";bubble.innerHTML=renderMarkdown(message.content);article.append(label,bubble);
  if(message.role==="assistant"&&index>0){
   const actions=document.createElement("div");actions.className="ax-message-actions";
   const copy=document.createElement("button");copy.type="button";copy.textContent="COPY";copy.onclick=async()=>{try{await navigator.clipboard.writeText(message.content);copy.textContent="COPIED";setTimeout(()=>copy.textContent="COPY",1000)}catch{}};
   actions.append(copy);
   if(index===messages.length-1){const again=document.createElement("button");again.type="button";again.textContent="REPEAT";again.onclick=()=>answerQuestion(messages.filter(m=>m.role==="user").at(-1)?.content||"");actions.append(again)}
   article.append(actions);
   if(Array.isArray(message.followUps)&&message.followUps.length){const follow=document.createElement("div");follow.className="ax-followups";message.followUps.slice(0,3).forEach(text=>{const b=document.createElement("button");b.type="button";b.textContent=text;b.onclick=()=>answerQuestion(text);follow.append(b)});article.append(follow)}
  }
  messagesEl.append(article);
 });
 if(busy){const typing=document.createElement("article");typing.className="ax-message";typing.innerHTML='<span class="ax-message-label">ArpanX</span><div class="ax-bubble ax-typing">Thinking…</div>';messagesEl.append(typing)}
 messagesEl.scrollTop=messagesEl.scrollHeight;
}
function setBusy(value){busy=value;send.disabled=value;input.disabled=value;send.textContent=value?"…":"↗";render()}
function normalize(value){return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/&/g," and ").replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim()}
const stopWords=new Set(["a","an","and","are","as","at","be","can","could","does","do","did","for","from","he","her","his","i","in","is","it","me","my","of","on","or","please","tell","that","the","their","there","they","this","to","what","when","where","which","who","why","with","would","you","your","arpan","debnath"]);
const synonymGroups=[["university","college","institution","institute"],["study","studying","education","academic"],["skill","skills","strength","strengths","know","knows"],["project","projects","build","built"],["email","mail","contact","reach"],["career","goal","goals","ambition","ambitions","plan","plans"],["interest","interests","hobby","hobbies","enjoy"],["certificate","certificates","certification","certifications","achievement","achievements"]];
const synonymMap=new Map();synonymGroups.forEach(group=>group.forEach(word=>synonymMap.set(word,group[0])));
function tokens(value){return normalize(value).split(" ").filter(word=>word&&!stopWords.has(word))}
function editDistanceOne(a,b){if(Math.abs(a.length-b.length)>1)return false;let i=0,j=0,edits=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue}if(++edits>1)return false;if(a.length>b.length)i++;else if(b.length>a.length)j++;else{i++;j++}}if(i<a.length||j<b.length)edits++;return edits<=1}
function closeToken(a,b){if(a===b)return true;const ca=synonymMap.get(a)||a,cb=synonymMap.get(b)||b;if(ca===cb)return true;return Math.min(a.length,b.length)>=5&&editDistanceOne(a,b)}
function matchQuestion(query){
 if(!faq.length)return null;
 const nq=normalize(query);
 if(!nq)return null;
 const direct=faq.find(item=>[item.question,...item.variations].some(alias=>normalize(alias)===nq));
 if(direct)return direct;
 const qTokens=tokens(query);
 if(!qTokens.length){if(/\b(about|who|arpan)\b/.test(nq))return faq.find(item=>item.id===1);return null}
 let best=null,bestScore=0,second=0;
 for(const item of faq){
  const aliases=[item.question,...item.variations];
  let aliasScore=0;
  for(const alias of aliases){
   const na=normalize(alias);
   if(nq.includes(na)||na.includes(nq)){aliasScore=Math.max(aliasScore,0.92);continue}
   const aTokens=tokens(alias);if(!aTokens.length)continue;
   const hits=qTokens.filter(q=>aTokens.some(a=>closeToken(q,a))).length;
   const coverage=hits/qTokens.length,precision=hits/aTokens.length;
   aliasScore=Math.max(aliasScore,0.68*coverage+0.32*precision);
  }
  const keywordHits=qTokens.filter(q=>(item.keywords||[]).some(k=>closeToken(q,k))).length;
  const keywordScore=keywordHits/qTokens.length;
  const score=Math.max(aliasScore,0.76*aliasScore+0.24*keywordScore);
  if(score>bestScore){second=bestScore;bestScore=score;best=item}else if(score>second)second=score;
 }
 return bestScore>=0.43?best:null;
}
function categoryLabel(category){return({"Personal Introduction":"About Arpan","Education":"Education","Technical Skills":"Skills","Projects":"Projects","Career and Goals":"Career Goals","Achievements and Certifications":"Achievements","Personal Interests":"Interests","Contact and Social Media":"Contact"})[category]||category}
function renderCategories(){
 categoriesEl.replaceChildren();
 const categories=[...new Set(faq.map(item=>item.category))];
 categories.forEach(category=>{const b=document.createElement("button");b.type="button";b.className="ax-category-button";b.textContent=categoryLabel(category);b.setAttribute("aria-label","Browse "+categoryLabel(category)+" questions");b.onclick=()=>showCategory(category);categoriesEl.append(b)});
}
function showCategory(category){
 questionList.replaceChildren();questionList.hidden=false;
 const back=document.createElement("button");back.type="button";back.className="ax-question-option ax-question-back";back.textContent="← Topics";back.onclick=()=>{questionList.hidden=true};questionList.append(back);
 faq.filter(item=>item.category===category).forEach(item=>{const b=document.createElement("button");b.type="button";b.className="ax-question-option";b.textContent=item.question;b.onclick=()=>answerQuestion(item.question);questionList.append(b)});
}
function addMessage(message){messages.push(message);messages=messages.slice(-30);save();render()}
function answerQuestion(text){
 if(busy)return;
 const question=String(text||"").trim();if(!question)return;
 if(question.length>500){banner.hidden=false;banner.textContent="Please keep your question under 500 characters.";return}
 banner.hidden=true;input.value="";input.style.height="auto";
 addMessage({role:"user",content:question});setBusy(true);
 window.setTimeout(()=>{const match=matchQuestion(question);const result=match?{role:"assistant",content:match.answer,followUps:match.followUps,category:match.category}:{role:"assistant",content:NO_MATCH,followUps:["Where does Arpan study?","What are Arpan’s technical skills?","What projects has he worked on?"]};addMessage(result);setBusy(false)},260);
}
function open(){panel.dataset.open="true";panel.setAttribute("aria-hidden","false");launcher.hidden=true;input.focus();render()}
function close(){panel.dataset.open="false";panel.setAttribute("aria-hidden","true");launcher.hidden=false;launcher.focus()}
launcher.addEventListener("click",open);root.querySelector(".ax-close").addEventListener("click",close);
root.querySelector(".ax-minimize").addEventListener("click",()=>panel.dataset.compact=panel.dataset.compact==="true"?"false":"true");
root.querySelector(".ax-clear").addEventListener("click",()=>{if(busy)return;messages=[WELCOME];try{sessionStorage.removeItem(STORE_KEY)}catch{}banner.hidden=true;questionList.hidden=true;render()});
form.addEventListener("submit",event=>{event.preventDefault();answerQuestion(input.value)});
input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,110)+"px"});
input.addEventListener("keydown",event=>{if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();form.requestSubmit()}if(event.key==="Escape")close()});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&panel.dataset.open==="true")close()});
panel.setAttribute("aria-hidden","true");render();
fetch(DB_URL).then(response=>{if(!response.ok)throw new Error("FAQ database request failed");return response.json()}).then(data=>{if(!Array.isArray(data)||data.length<100)throw new Error("FAQ database is incomplete");faq=data;renderCategories();render()}).catch(()=>{banner.hidden=false;banner.textContent="ArpanX couldn’t load its question library. Please refresh the portfolio.";});
})();