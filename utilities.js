/* Clipboard helpers and local-only printable drafts. No submission or persistence. */
(function(){
const tr=(a,b)=>document.documentElement.lang==='te'?a:b;
async function copy(value){
 try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(value);toast(tr('లింక్ కాపీ అయింది','Link copied'));}
 catch(e){const d=document.getElementById('copyDialog');document.getElementById('copyValue').value=value;document.getElementById('copyHelp').textContent=tr('లింక్‌ను నొక్కి పట్టుకొని కాపీ చేయండి','Press and hold the link to copy it');d.showModal();document.getElementById('copyValue').select();}
}
window.gsCopyLink=copy;
function links(){document.querySelectorAll('a[href]').forEach(a=>{if(a.dataset.gsCopy||!a.getAttribute('href')||a.getAttribute('href').startsWith('#'))return;a.dataset.gsCopy='1';const b=document.createElement('button');b.type='button';b.className='linkcopy';b.dataset.gsCopyButton='1';b.textContent=tr('లింక్ కాపీ','Copy link');b.setAttribute('aria-label',tr('లింక్ కాపీ: ','Copy link: ')+(a.textContent.trim()||a.href));b.onclick=()=>copy(a.href);if(a.classList.contains('ebtn')){const wrap=document.createElement('div');wrap.className='ecopywrap';a.replaceWith(wrap);wrap.append(a,b);}else a.insertAdjacentElement('afterend',b);});}
// System emoji fonts are not reliable on all devices. Replace decorative emoji
// with bundled inline vector shapes, while leaving text, form values and labels intact.
const glyphs=/[\p{Extended_Pictographic}\u2600-\u27bf](?:[\uFE0E\uFE0F\u200D]|[\p{Extended_Pictographic}\u2600-\u27bf])*/gu;
const shape={
 '🔊':'<path d="M3 9h4l5-4v14l-5-4H3zM16 8q5 4 0 8M19 5q8 7 0 14"/>',
 '📱':'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/>',
 '☎':'<path d="M5 3 3 7c0 7 7 14 14 14l4-2-4-5-3 2-6-6 2-3z"/>',
 '📅':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18M7 15h3M14 15h3"/>',
 '📝':'<path d="M15 3H4v18h16V10M10 14l2-5 7-7 3 3-7 7z"/>',
 '🏦':'<path d="m2 8 10-6 10 6zM3 21h18M5 10v8M10 10v8M15 10v8M20 10v8"/>',
 '⚠':'<path d="m12 2 10 19H2zM12 8v6M12 17v1"/>',
 '🔍':'<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/>',
 '⏹':'<rect x="5" y="5" width="14" height="14" rx="1"/>',
 '⬇':'<path d="M12 2v14m-6-6 6 6 6-6M3 19v3h18v-3"/>',
 '✕':'<path d="m5 5 14 14M19 5 5 19"/>',
 '✓':'<path d="m3 12 6 6L21 4"/>',
 '✅':'<path d="m3 12 6 6L21 4"/>'
};
function vector(token){const span=document.createElement('span');span.className='gs-vector';span.setAttribute('aria-hidden','true');span.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(shape[token.replace(/[\uFE0E\uFE0F]/g,'')]||'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>')+'</svg>';return span;}
function vectors(){const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),nodes=[];let n;while(n=walker.nextNode()){if(n.parentElement?.closest('script,style,textarea,svg,[contenteditable]'))continue;glyphs.lastIndex=0;if(glyphs.test(n.data))nodes.push(n);}for(const node of nodes){const text=node.data,frag=document.createDocumentFragment();let last=0;glyphs.lastIndex=0;for(const m of text.matchAll(glyphs)){frag.append(document.createTextNode(text.slice(last,m.index)),vector(m[0]));last=m.index+m[0].length;}frag.append(document.createTextNode(text.slice(last)));node.replaceWith(frag);}document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(e=>{glyphs.lastIndex=0;if(glyphs.test(e.placeholder)){glyphs.lastIndex=0;e.placeholder=e.placeholder.replace(glyphs,'').trim();}});}
let queued=false;const observer=new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;links();vectors();});});observer.observe(document.body,{childList:true,subtree:true});
document.addEventListener('gs-language',()=>{document.querySelectorAll('[data-gs-copy-button]').forEach(b=>b.textContent=tr('లింక్ కాపీ','Copy link'));});links();vectors();
window.gsPrintText=function(title,text){
 if(!text.trim()){toast(tr('ముందు వివరాలు రాయండి','Write the details first'));return;}
 const area=document.getElementById('printArea');area.replaceChildren();const h=document.createElement('h1');h.textContent=title;const p=document.createElement('pre');p.textContent=text;const note=document.createElement('p');note.textContent=tr('వ్యక్తిగత ముసాయిదా మాత్రమే. అధికారికంగా సమర్పించిన దరఖాస్తు / ఫిర్యాదు కాదు.','Personal draft only. Not an officially submitted application / complaint.');area.append(h,p,note);
 const clear=()=>{area.replaceChildren();document.body.classList.remove('gs-printing');};window.addEventListener('afterprint',clear,{once:true});document.body.classList.add('gs-printing');try{window.print();}catch(e){clear();toast(tr('మీ బ్రౌజర్ మెనూలో Print వాడండి','Use Print in your browser menu'));}
};
window.gsPrintCalc=kind=>{const ids=kind==='si'?['siP','siR','siRP','siT','siTP']:['emiP','emiR','emiN'];const res=document.getElementById(kind==='si'?'siRes':'emiRes');if(!res.textContent){toast(tr('ముందు లెక్కించండి','Calculate first'));return;}const text=ids.map(id=>{const e=document.getElementById(id);return (document.querySelector('label[for="'+id+'"]')?.textContent||id)+': '+(e.tagName==='SELECT'?e.options[e.selectedIndex].text:e.value)}).join('\n')+'\n\n'+res.textContent;gsPrintText(kind==='si'?tr('సాదా వడ్డీ అంచనా','Simple interest estimate'):tr('EMI అంచనా - ఫీజులు చేర్చలేదు','EMI estimate - fees excluded'),text);};
window.gsPrintComplaint=()=>gsPrintText(tr('గ్రామ ఫిర్యాదు ముసాయిదా','Village complaint draft'),document.getElementById('compText')?.value||'');
window.gsPrintDraft=()=>gsPrintText(document.getElementById('draftTitle').value||tr('వ్యక్తిగత ముసాయిదా','Personal draft'),document.getElementById('draftBody').value);
})();
