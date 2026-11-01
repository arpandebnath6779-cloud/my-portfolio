import { instructions, profile } from "./knowledge-base.mjs";
const MAX=12,MSG=2500,BODY=18000,WINDOW=60000,LIMIT=12,buckets=new Map();
const origins=()=>new Set(["https://arpandebnath6779-cloud.github.io",process.env.URL,...(process.env.ALLOWED_ORIGINS||"").split(",").map(x=>x.trim())].filter(Boolean).map(x=>x.replace(/\/$/,"")));
function json(data,status,origin=""){const h={"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","Vary":"Origin"};if(origin){h["Access-Control-Allow-Origin"]=origin;h["Access-Control-Allow-Methods"]="POST, OPTIONS";h["Access-Control-Allow-Headers"]="Content-Type";h["Access-Control-Max-Age"]="86400"}return new Response(JSON.stringify(data),{status,headers:h})}
function allowed(key){const now=Date.now(),b=buckets.get(key);if(!b||now-b.start>=WINDOW){buckets.set(key,{start:now,count:1});return true}return ++b.count<=LIMIT}
function valid(ms){return Array.isArray(ms)&&ms.length>0&&ms.length<=MAX&&ms.every(m=>m&&["user","assistant"].includes(m.role)&&typeof m.content==="string"&&m.content.trim()&&m.content.length<=MSG)&&ms.at(-1).role==="user"}
function getText(d){if(typeof d.output_text==="string")return d.output_text.trim();return(d.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text||"").join("\n").trim()}
export default async (req,ctx)=>{
 const origin=req.headers.get("origin")||"",normalized=origin.replace(/\/$/,""),ok=origin&&origins().has(normalized)?origin:"";
 if(origin&&!ok)return json({error:"This site is not allowed to use ArpanX."},403);
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:{...(ok?{"Access-Control-Allow-Origin":ok}:{}),"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Access-Control-Max-Age":"86400","Vary":"Origin"}});
 if(req.method!=="POST")return json({error:"Use POST to send a message."},405,ok);
 if(!process.env.OPENAI_API_KEY)return json({error:"ArpanX is not configured yet. Add OPENAI_API_KEY in Netlify Functions settings."},503,ok);
 const ip=ctx?.ip||req.headers.get("x-nf-client-connection-ip")||"unknown";if(!allowed(ip))return json({error:"Please wait a minute before sending more messages."},429,ok);
 if(Number(req.headers.get("content-length")||0)>BODY)return json({error:"Message is too large."},413,ok);
 let body;try{body=await req.json()}catch{return json({error:"Send a valid chat message."},400,ok)}
 if(!valid(body?.messages)||JSON.stringify(body).length>BODY)return json({error:"Send up to 12 messages, each under 2,500 characters."},400,ok);
 try{
  const upstream=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+process.env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-6-luna",instructions:instructions()+"\n\nPortfolio knowledge (JSON):\n"+JSON.stringify(profile),input:body.messages.map(m=>({role:m.role,content:[{type:"input_text",text:m.content}]})),max_output_tokens:650,store:false}),signal:AbortSignal.timeout(30000)});
  const data=await upstream.json().catch(()=>({}));if(!upstream.ok){console.error("ArpanX provider error",upstream.status,data?.error?.type||"unknown");return json({error:upstream.status===429?"ArpanX is busy right now. Try again shortly.":"ArpanX couldn’t complete that reply. Please try again."},upstream.status===429?429:502,ok)}
  const reply=getText(data);return reply?json({reply},200,ok):json({error:"ArpanX returned an empty reply. Please try again."},502,ok)
 }catch(e){console.error("ArpanX request error",e?.name||"unknown");return json({error:"ArpanX couldn’t connect just now. Please try again."},502,ok)}
};