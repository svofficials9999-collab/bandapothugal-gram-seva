/* Official notification feed. No push subscription, personal data or timers. */
(function(root){
'use strict';
const KEY='gs.notice.read.v1';
function official(url){try{const u=new URL(url);return u.protocol==='https:' && /(^|\.)(gov\.in|nic\.in)$/.test(u.hostname);}catch(e){return false;}}
function validDate(d){return typeof d==='string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d+'T00:00:00Z'));}
function cleanFeed(data,today){
 if(!data || data.schema!==1 || !Array.isArray(data.items)) throw Error('Invalid notification feed');
 const seen=new Set();
 return data.items.filter(n=>{
  if(!n || !/^[a-z0-9-]{1,100}$/.test(n.id||'') || !/^[a-z0-9-]{1,40}$/.test(n.revision||'') || seen.has(n.id))return false;
  if(!n.te || !n.en || !n.quote || !official(n.source) || !validDate(n.published) || !validDate(n.checked) || n.published>today || n.checked>today)return false;
  if(n.expires && (!validDate(n.expires)||n.expires<today))return false;
  seen.add(n.id);return true;
 });
}
function token(n){return n.id+':'+n.revision;}
function readSet(storage){try{const a=JSON.parse(storage.getItem(KEY)||'[]');return new Set(Array.isArray(a)?a.filter(x=>typeof x==='string'):[]);}catch(e){return new Set();}}
function unread(items,read){return items.filter(n=>!read.has(token(n)));}
const api={cleanFeed,token,readSet,unread,KEY};
if(typeof module==='object' && module.exports){module.exports=api;return;}
let store;try{store=localStorage;}catch(e){store={getItem:()=>null,setItem:()=>{}};}
let items=[],read=readSet(store),state='loading',pending=false,lastSuccess=null;
const tr=(a,b)=>document.documentElement.lang==='te'?a:b;
const el=id=>document.getElementById(id);
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function paint(){
 const count=unread(items,read).length;
 const label=tr('కొత్త పథకాల సమాచారం','Scheme updates');
 el('notifyBtn').setAttribute('aria-label',label+': '+count+' '+tr('చదవనివి','unread'));
 el('notifyBtn').title=label;
 el('notifyCount').textContent=count>99?'99+':String(count);
 el('notifyCount').hidden=count===0;
 el('notifyTitle').textContent=label;
 el('notifyRefresh').textContent=tr('మళ్ళీ చూడండి','Refresh');
 el('notifyRefresh').disabled=pending;
 el('notifyClose').setAttribute('aria-label',tr('మూసివేయండి','Close'));
 el('notifyInfo').textContent=tr('అధికారికంగా సరిచూసిన కొత్త పథకాలు / మార్పులు మాత్రమే. యాప్ తెరిచినప్పుడు లేదా తిరిగి వచ్చినప్పుడు ఆన్‌లైన్‌లో సమాచారం తెస్తుంది. యాప్ మూసి ఉన్నప్పుడు పుష్ అలర్ట్‌లు రావు. ఫోన్ ఐకాన్ బాడ్జ్ మీ ఫోన్ / బ్రౌజర్ మద్దతుపై ఆధారపడుతుంది; ఆకుపచ్చ రంగు హామీ లేదు.','Only new schemes / changes checked against official sources. Updates load online when you open or return to the app. No push alerts while the app is closed. A phone-icon badge depends on your phone / browser; its color cannot be guaranteed.');
 el('notifyState').textContent=state==='loading'?tr('సమాచారం తెస్తున్నాం...','Loading updates...'):state==='offline'?tr('ఆఫ్‌లైన్ / సమాచారం తెచ్చుకోలేకపోయాం. చివరిసారి సేవ్ అయిన సమాచారం మాత్రమే; తాజా సమాచారం నిర్ధారించలేదు.','Offline / unable to refresh. Showing saved information only; latest updates are not confirmed.'):tr('చివరి విజయవంతమైన సమాచారం: ','Last successful refresh: ')+(lastSuccess?new Date(lastSuccess).toLocaleString(document.documentElement.lang==='te'?'te-IN':'en-IN'):'');
 el('notifyList').innerHTML=items.length?items.map((n,i)=>'<article class="ncard"><h3>'+esc(tr(n.te,n.en))+'</h3><p>'+esc(tr(n.summaryTe||'',n.summaryEn||''))+'</p><p class="nmeta">'+esc(tr('ప్రకటన: ','Published: ')+n.published+' · '+tr('సరిచూసిన తేదీ: ','Checked: ')+n.checked)+'</p><details><summary>'+tr('అధికారిక మూలంలోని వాక్యం','Exact official source text')+'</summary><blockquote>'+esc(n.quote)+'</blockquote></details><a href="'+esc(n.source)+'" target="_blank" rel="noopener">'+tr('అధికారిక మూలం తెరవండి','Open official source')+'</a><button data-read="'+i+'" '+(read.has(token(n))?'disabled':'')+'>'+ (read.has(token(n))?tr('చదివారు ✓','Read ✓'):tr('చదివినట్లుగా గుర్తించండి','Mark as read'))+'</button></article>').join(''):'<p class="nempty">'+(state==='ok'?tr('ఇప్పటికి కొత్తగా ధృవీకరించిన పథకాల నోటిఫికేషన్లు చేర్చలేదు.','No newly verified scheme notifications have been added yet.'):tr('సేవ్ చేసిన నోటిఫికేషన్లు లేవు. ఆన్‌లైన్‌లో మళ్ళీ చూడండి.','No saved notifications. Try refreshing online.'))+'</p>';
 el('notifyList').querySelectorAll('[data-read]').forEach(b=>b.onclick=()=>{
  read.add(token(items[Number(b.dataset.read)]));
  try{localStorage.setItem(KEY,JSON.stringify([...read]));}catch(e){}
  paint();
 });
 document.dispatchEvent(new CustomEvent('gs-notice-count',{detail:count}));
 try{const p=count && navigator.setAppBadge?navigator.setAppBadge(count):!count && navigator.clearAppBadge?navigator.clearAppBadge():null;if(p && p.catch)p.catch(()=>{});}catch(e){}
}
async function refresh(){
 if(pending)return;pending=true;paint();
 try{
  const r=await fetch('notifications.json',{cache:'no-store'});if(!r.ok)throw Error('Feed unavailable');
  const data=await r.json();items=cleanFeed(data,new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'}));
  try{localStorage.setItem('gs.notice.cache.v1',JSON.stringify(data));}catch(e){}
  lastSuccess=Date.now();state='ok';
 }catch(e){items=cleanFeed({schema:1,items},new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'}));state='offline';}
 finally{pending=false;paint();}
}
function init(){
 try{items=cleanFeed(JSON.parse(localStorage.getItem('gs.notice.cache.v1')),new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'}));}catch(e){}
 const dialog=el('notifyDialog');
 el('notifyBtn').onclick=()=>{paint();dialog.showModal();};
 el('notifyClose').onclick=()=>dialog.close();
 el('notifyRefresh').onclick=refresh;
 dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
 document.addEventListener('gs-language',paint);
 window.addEventListener('online',refresh);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refresh();});
 window.addEventListener('storage',e=>{if(e.key===KEY){read=readSet(localStorage);paint();}});
 refresh();
}
root.GS_NOTIFICATIONS={refresh};
init();
})(typeof window==='undefined'?globalThis:window);
