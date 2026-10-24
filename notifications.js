/* Official notification feed. No push subscription, personal data or timers. */
(function(root){
'use strict';
const KEY='gs.notice.read.v1';
function official(url){try{const u=new URL(url);return u.protocol==='https:' && (/(^|\.)(gov\.in|nic\.in)$/.test(u.hostname)||['sbi.bank.in','bankofbaroda.bank.in','www.unionbankofindia.bank.in'].includes(u.hostname));}catch(e){return false;}}
function validDate(d){return typeof d==='string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d+'T00:00:00Z')) && new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;}
function cleanFeed(data,today){
 if(!data || data.schema!==1 || !Array.isArray(data.items)) throw Error('Invalid notification feed');
 const seen=new Set();
 return data.items.filter(n=>{
  if(!n || !/^[a-z0-9-]{1,100}$/.test(n.id||'') || !/^[a-z0-9-]{1,40}$/.test(n.revision||'') || seen.has(n.id))return false;
  if(!n.te || !n.en || !n.quote || !official(n.source) || !validDate(n.published) || !validDate(n.checked) || n.published>today || n.checked>today)return false;
  if(n.category && !['scheme','course','accommodation'].includes(n.category))return false;
  if(n.cost && !['free','paid','unknown'].includes(n.cost))return false;
  if(n.sectionIds && (!Array.isArray(n.sectionIds)||n.sectionIds.some(x=>typeof x!=='string'||!/^[-a-z0-9]{1,40}$/.test(x))))return false;
  for(const k of ['applicationStart','applicationEnd','courseStart','courseEnd'])if(n[k]&&!validDate(n[k]))return false;
  if(n.applicationStart&&n.applicationEnd&&n.applicationStart>n.applicationEnd)return false;
  if(n.courseStart&&n.courseEnd&&n.courseStart>n.courseEnd)return false;
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
let filter='all';
let items=[],read=readSet(store),state='loading',pending=false,lastSuccess=null;
const tr=(a,b)=>document.documentElement.lang==='te'?a:b;
const el=id=>document.getElementById(id);
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function windowText(n){
 const today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'});let a=[];
 if(n.applicationStart||n.applicationEnd){let status=n.applicationStart&&today<n.applicationStart?tr('దరఖాస్తులు ఇంకా ప్రారంభం కాలేదు','Applications not yet open'):n.applicationEnd&&today>n.applicationEnd?tr('దరఖాస్తు గడువు ముగిసింది','Application deadline passed'):n.applicationStart&&n.applicationEnd?tr('దరఖాస్తు తేదీల పరిధిలో ఉంది','Within application dates'):tr('దరఖాస్తు స్థితి నిర్ధారించాలి','Confirm application status');a.push(status+': '+(n.applicationStart||tr('ప్రారంభం తెలియదు','start unknown'))+' → '+(n.applicationEnd||tr('ముగింపు తెలియదు','end unknown')));}
 else a.push(tr('దరఖాస్తు తేదీలు నిర్ధారించలేదు','Application dates not confirmed'));
 if(n.courseStart||n.courseEnd){let status=n.courseStart&&today<n.courseStart?tr('కోర్సు ఇంకా ప్రారంభం కాలేదు','Course not yet started'):n.courseEnd&&today>n.courseEnd?tr('కోర్సు తేదీలు ముగిశాయి','Course dates ended'):n.courseStart&&n.courseEnd?tr('కోర్సు తేదీల పరిధిలో ఉంది','Within course dates'):tr('కోర్సు స్థితి నిర్ధారించాలి','Confirm course status');a.push(status+': '+(n.courseStart||'?')+' → '+(n.courseEnd||'?'));}
 else if(n.category==='course')a.push(tr('కోర్సు తేదీలు నిర్ధారించలేదు','Course dates not confirmed'));
 return a.join(' · ');
}
function sectionBar(id){
 const matched=items.filter(n=>(n.sectionIds||[]).includes(id));
 return '<div class="gs-section-notices" style="margin-top:12px;border:1px solid #a4cfc2;border-radius:10px;background:#f1fbf6;padding:10px;font-size:12px;line-height:1.65;overflow-wrap:anywhere;text-align:left"><b>'+tr('ప్రకటనలు / దరఖాస్తు తేదీలు','Notices / application dates')+'</b>'+ (state==='offline'?'<p>'+tr('ఆఫ్‌లైన్: తాజా స్థితి నిర్ధారించలేదు','Offline: current status not confirmed')+'</p>':'')+(state==='loading'?'<p>'+tr('ప్రకటనలు తనిఖీ చేస్తున్నాం...','Checking notices...')+'</p>':matched.length?matched.map(n=>'<p style="margin:8px 0"><b>'+esc(tr(n.te,n.en))+'</b><br>'+esc(windowText(n))+'<br><a href="'+esc(n.source)+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">'+tr('అధికారిక ప్రకటన','Official notice')+'</a></p>').join(''):'<p style="margin:6px 0">'+tr('ప్రస్తుతం ఈ విభాగానికి తేదీలతో ధృవీకరించిన ప్రకటన చేర్చలేదు. క్రింది జాబితా ఇప్పుడు దరఖాస్తులు తెరిచి ఉన్నాయని కాదు.','No dated verified notice added for this section yet. The listing does not mean applications are open now.')+'</p>')+'</div>';
}
function paintSections(){
 document.querySelectorAll('[data-notice-section]').forEach(e=>{const old=e.querySelector('.gs-section-notices');if(old)old.remove();e.insertAdjacentHTML('beforeend',sectionBar(e.dataset.noticeSection));});
 const h=el('sectionNoticeBar');if(h){const id=el('stName').dataset.sid;h.innerHTML=id&&!id.startsWith('special:')?sectionBar(id):'';h.hidden=el('cardList').style.display!=='flex'||!id||id.startsWith('special:');}
}
function paint(){
 const count=unread(items,read).length;
 const label=tr('పథకాలు / కోర్సులు / వసతి సమాచారం','Schemes / courses / accommodation');
 el('notifyBtn').setAttribute('aria-label',label+': '+count+' '+tr('చదవనివి','unread'));
 el('notifyBtn').title=label;
 el('notifyCount').textContent=count>99?'99+':String(count);
 el('notifyCount').hidden=count===0;
 el('notifyTitle').textContent=label;
 el('notifyRefresh').textContent=tr('మళ్ళీ చూడండి','Refresh');
 el('notifyRefresh').disabled=pending;
 el('notifyClose').setAttribute('aria-label',tr('మూసివేయండి','Close'));
 el('notifyInfo').textContent=tr('అధికారికంగా సరిచూసిన పథకాలు, ఉచిత / ఫీజు కోర్సులు, వసతి ప్రకటనలు మాత్రమే. ఫీజు ఉన్నది అంటే చెల్లింపు అనుమతి కాదు; నమోదు / చెల్లింపు జరగదు. యాప్ తెరిచినప్పుడు లేదా తిరిగి వచ్చినప్పుడు ఆన్‌లైన్‌లో సమాచారం తెస్తుంది. యాప్ మూసి ఉన్నప్పుడు పుష్ అలర్ట్‌లు రావు. ఫోన్ ఐకాన్ బాడ్జ్ మీ ఫోన్ / బ్రౌజర్ మద్దతుపై ఆధారపడుతుంది; ఆకుపచ్చ రంగు హామీ లేదు.','Only schemes, free/paid courses and accommodation notices checked against official sources. A paid listing is not payment permission; no enrollment or payment is made. Updates load online when you open or return to the app. No push alerts while the app is closed. A phone-icon badge depends on your phone / browser; its color cannot be guaranteed.');
 el('notifyState').textContent=state==='loading'?tr('సమాచారం తెస్తున్నాం...','Loading updates...'):state==='offline'?tr('ఆఫ్‌లైన్ / సమాచారం తెచ్చుకోలేకపోయాం. చివరిసారి సేవ్ అయిన సమాచారం మాత్రమే; తాజా సమాచారం నిర్ధారించలేదు.','Offline / unable to refresh. Showing saved information only; latest updates are not confirmed.'):tr('చివరి విజయవంతమైన సమాచారం: ','Last successful refresh: ')+(lastSuccess?new Date(lastSuccess).toLocaleString(document.documentElement.lang==='te'?'te-IN':'en-IN'):'');
 const visible=items.filter(n=>filter==='all'||(n.category||'scheme')===filter);
 el('noticeFilterLabel').textContent=tr('రకం: ','Type: ');
 el('noticeFilter').innerHTML=[['all','అన్నీ','All'],['scheme','పథకాలు','Schemes'],['course','కోర్సులు','Courses'],['accommodation','వసతి','Accommodation']].map(a=>'<option value="'+a[0]+'" '+(filter===a[0]?'selected':'')+'>'+tr(a[1],a[2])+'</option>').join('');
 el('notifyList').innerHTML=visible.length?visible.map(n=>{const i=items.indexOf(n);return '<article class="ncard"><h3>'+esc(tr(n.te,n.en))+'</h3><p>'+esc(windowText(n))+'</p><p class="nmeta">'+esc(tr({scheme:'పథకం',course:'కోర్సు',accommodation:'వసతి'}[n.category||'scheme'],{scheme:'Scheme',course:'Course',accommodation:'Accommodation'}[n.category||'scheme'])+' · '+tr({free:'ఉచితం',paid:'ఫీజు ఉంది',unknown:'ఖర్చు నిర్ధారించలేదు'}[n.cost||'unknown'],{free:'Free',paid:'Paid',unknown:'Cost not confirmed'}[n.cost||'unknown']))+'</p><p>'+esc(tr(n.summaryTe||'',n.summaryEn||''))+'</p><p class="nmeta">'+esc(tr('ప్రకటన: ','Published: ')+n.published+' · '+tr('సరిచూసిన తేదీ: ','Checked: ')+n.checked)+'</p><details><summary>'+tr('అధికారిక మూలంలోని వాక్యం','Exact official source text')+'</summary><blockquote>'+esc(n.quote)+'</blockquote></details><a href="'+esc(n.source)+'" target="_blank" rel="noopener">'+tr('అధికారిక మూలం తెరవండి','Open official source')+'</a><button data-read="'+i+'" '+(read.has(token(n))?'disabled':'')+'>'+ (read.has(token(n))?tr('చదివారు ✓','Read ✓'):tr('చదివినట్లుగా గుర్తించండి','Mark as read'))+'</button></article>';}).join(''):'<p class="nempty">'+(state==='ok'?tr('ఈ రకంలో కొత్తగా ధృవీకరించిన నోటిఫికేషన్లు ఇంకా లేవు. కోర్సు జాబితా ఉండటం కొత్త బ్యాచ్ ప్రకటన కాదు.','No newly verified notifications in this category yet. A course listing is not a new batch announcement.'):tr('సేవ్ చేసిన నోటిఫికేషన్లు లేవు. ఆన్‌లైన్‌లో మళ్ళీ చూడండి.','No saved notifications. Try refreshing online.'))+'</p>';
 el('notifyList').querySelectorAll('[data-read]').forEach(b=>b.onclick=()=>{
  read.add(token(items[Number(b.dataset.read)]));
  try{localStorage.setItem(KEY,JSON.stringify([...read]));}catch(e){}
  paint();
 });
 paintSections();
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
 const label=document.createElement('label');label.innerHTML='<span id="noticeFilterLabel"></span><select id="noticeFilter" style="min-height:44px;max-width:100%;padding:8px;border:1px solid #b8c7d9;border-radius:8px;background:white"></select>';el('notifyList').before(label);
 el('noticeFilter').onchange=e=>{filter=e.target.value;paint();};
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
root.GS_NOTIFICATIONS={refresh,paintSections};
init();
})(typeof window==='undefined'?globalThis:window);
