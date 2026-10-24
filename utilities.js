/* Clipboard helpers and local-only printable drafts. No submission or persistence. */
(function(){
const tr=(a,b)=>document.documentElement.lang==='te'?a:b;
async function copy(value){
 try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(value);toast(tr('లింక్ కాపీ అయింది','Link copied'));}
 catch(e){const d=document.getElementById('copyDialog');document.getElementById('copyValue').value=value;document.getElementById('copyHelp').textContent=tr('లింక్‌ను నొక్కి పట్టుకొని కాపీ చేయండి','Press and hold the link to copy it');d.showModal();document.getElementById('copyValue').select();}
}
window.gsCopyLink=copy;
function links(){document.querySelectorAll('a[href]').forEach(a=>{if(a.dataset.gsCopy||!a.getAttribute('href')||a.getAttribute('href').startsWith('#'))return;a.dataset.gsCopy='1';const b=document.createElement('button');b.type='button';b.className='linkcopy';b.dataset.gsCopyButton='1';b.textContent=tr('లింక్ కాపీ','Copy link');b.setAttribute('aria-label',tr('లింక్ కాపీ: ','Copy link: ')+(a.textContent.trim()||a.href));b.onclick=()=>copy(a.href);if(a.classList.contains('ebtn')){const wrap=document.createElement('div');wrap.className='ecopywrap';a.replaceWith(wrap);wrap.append(a,b);}else a.insertAdjacentElement('afterend',b);});}
let queued=false;const observer=new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;links();});});observer.observe(document.body,{childList:true,subtree:true});
document.addEventListener('gs-language',()=>{document.querySelectorAll('[data-gs-copy-button]').forEach(b=>b.textContent=tr('లింక్ కాపీ','Copy link'));});links();
window.gsPrintText=function(title,text){
 if(!text.trim()){toast(tr('ముందు వివరాలు రాయండి','Write the details first'));return;}
 const area=document.getElementById('printArea');area.replaceChildren();const h=document.createElement('h1');h.textContent=title;const p=document.createElement('pre');p.textContent=text;const note=document.createElement('p');note.textContent=tr('వ్యక్తిగత ముసాయిదా మాత్రమే. అధికారికంగా సమర్పించిన దరఖాస్తు / ఫిర్యాదు కాదు.','Personal draft only. Not an officially submitted application / complaint.');area.append(h,p,note);
 const clear=()=>{area.replaceChildren();document.body.classList.remove('gs-printing');};window.addEventListener('afterprint',clear,{once:true});document.body.classList.add('gs-printing');try{window.print();}catch(e){clear();toast(tr('మీ బ్రౌజర్ మెనూలో Print వాడండి','Use Print in your browser menu'));}
};
window.gsPrintCalc=kind=>{const ids=kind==='si'?['siP','siR','siRP','siT','siTP']:['emiP','emiR','emiN'];const res=document.getElementById(kind==='si'?'siRes':'emiRes');if(!res.textContent){toast(tr('ముందు లెక్కించండి','Calculate first'));return;}const text=ids.map(id=>{const e=document.getElementById(id);return (document.querySelector('label[for="'+id+'"]')?.textContent||id)+': '+(e.tagName==='SELECT'?e.options[e.selectedIndex].text:e.value)}).join('\n')+'\n\n'+res.textContent;gsPrintText(kind==='si'?tr('సాదా వడ్డీ అంచనా','Simple interest estimate'):tr('EMI అంచనా - ఫీజులు చేర్చలేదు','EMI estimate - fees excluded'),text);};
window.gsPrintComplaint=()=>gsPrintText(tr('గ్రామ ఫిర్యాదు ముసాయిదా','Village complaint draft'),document.getElementById('compText')?.value||'');
window.gsPrintDraft=()=>gsPrintText(document.getElementById('draftTitle').value||tr('వ్యక్తిగత ముసాయిదా','Personal draft'),document.getElementById('draftBody').value);
})();
