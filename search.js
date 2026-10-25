/* Search aliases are discovery terms, not new scheme names, eligibility or benefits. */
(()=>{
'use strict';
const normalize=s=>String(s||'').normalize('NFC').toLowerCase().replace(/[\u200b-\u200d\ufeff]/g,'').replace(/[౦-౯]/g,c=>String(c.charCodeAt(0)-0x0c66)).replace(/[^\p{L}\p{M}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
const rules=[
 [/NSAP/i,'nsap ఎన్ ఎస్ ఏ పి జాతీయ సామాజిక సహాయం social pension'],
 [/PMAY/i,'pmay pmayg pm awas pm awaas ఆవాస్ ఆవాస పీఎం ఆవాస్ గ్రామీణ ఇల్లు'],
 [/Ujjwala|PMUY/i,'ujjwala ujwala pmuy ఉజ్వల ఉజ్జ్వల ఉజ్జ్వల ఉచిత గ్యాస్'],
 [/Surya Ghar/i,'pmsuryaghar pm surya ghar suryaghar సూర్యఘర్ సూర్య ఘర్ సోలార్ solar'],
 [/ADIP/i,'adip ఏడీఐపీ ఏ డి ఐ పి సహాయక పరికరాలు'],
 [/JANMAN/i,'pmjanman pm janman జన్మన్ జన్ మన్ పీవీటీజీ pvtg'],
 [/NLM|Livestock/i,'nlm livestock పశుపోషణ పశువులు పశువుల'],
 [/Rythu Bima/i,'rythu bima raitu bima రైతుబీమా రైతు బీమా రైతు భీమా'],
 [/agriculture-power/i,'free agricultural electricity ఉచిత వ్యవసాయ విద్యుత్ వ్యవసాయ కరెంటు'],
 [/TRICOR/i,'tricor ట్రైకార్ ట్రికార్ ఎస్టీ కార్పొరేషన్'],
 [/BC Corporation/i,'bc corporation బీసీ కార్పొరేషన్ బిసి కార్పొరేషన్'],
 [/SC Corporation/i,'sc corporation ఎస్సీ కార్పొరేషన్ ఎస్ సి భూమి'],
 [/Dalit Bandhu/i,'dalitbandhu dalit bandhu దళితబంధు దళిత బంధు'],
 [/Vidya Bharosa/i,'vidyabharosa vidya bharosa విద్యాభరోసా విద్యా భరోసా'],
 [/Mahila Shakti/i,'mahila shakthi mahila shakti ఇందిరా మహిళాశక్తి ఇందిరా మహిళా శక్తి'],
 [/Kanti Velugu/i,'kantivelugu kanti velugu కంటివెలుగు కంటి వెలుగు'],
 [/MCH Kit/i,'mch kit మాతా శిశు కిట్ ఎంసీహెచ్ కిట్'],
 [/Mission Bhagiratha/i,'jal jeevan mission jjm జల్ జీవన్ మిషన్ జలజీవన్ మిషన్ భగీరథ'],

 [/Gramodyog|gvy-/i,'gramodyog gramodyoga gramodhyog gram udyog grama udyog gram udyogu gramudyog gramaudyog gramodyog vikas yojana gvy kvic గ్రామోద్యోగ గ్రామోధ్యోగ గ్రామోద్యోగ్ గ్రామ ఉద్యోగ గ్రామ ఉద్యోగు గ్రామ ఉద్యోగా గ్రామ ఉద్యోగ్ గ్రామ ఉద్యోగం గ్రామోద్యోగ వికాస యోజన గ్రామోద్యోగ వికాస్ యోజన ఖాదీ కేవీఐసీ జివివై జీ వీ వై'],
 [/Rythu Bharosa/i,'rythu bharosa raitu bharosa రైతు భరోసా రైతుభరోసా'],
 [/PM-KISAN/i,'pm kisan pmkisan పీఎం కిసాన్ పి ఎం కిసాన్ రైతు కిసాన్'],
 [/Cheyutha.*Pensions/i,'pension pensions aasara asara cheyutha పెన్షన్ పెన్షన్లు పింఛను పించను పింఛన్ ఆసరా చేయూత'],
 [/Gruha Jyothi/i,'gruha jyothi gruhajyothi gruha jyoti గృహజ్యోతి గృహ జ్యోతి కరెంటు ఉచిత విద్యుత్'],
 [/Indiramma Housing/i,'indiramma illu indlu housing ఇందిరమ్మ ఇల్లు ఇళ్ళు ఇండ్లు ఇళ్లు'],
 [/Ration|ePDS/i,'ration rashan rice రేషన్ రేషను బియ్యం రేషన్ కార్డు రేషన్ కార్డ్'],
 [/Aarogyasri/i,'arogyasri aarogyasri arogya sri ఆరోగ్యశ్రీ ఆరోగ్య శ్రీ ఆరోగ్యశ్రి'],
 [/Ayushman|PM-JAY/i,'ayushman ayushman bharat pmjay pm jay ఆయుష్మాన్ భారత్ ఆయుష్మాన్ కార్డు'],
 [/Kalyana Lakshmi|Shaadi Mubarak/i,'kalyana lakshmi kalyanalakshmi shadi mubarak shaadi mubarak కళ్యాణలక్ష్మి కళ్యాణ లక్ష్మి కల్యాణ లక్ష్మి షాదీ ముబారక్'],
 [/Maha Lakshmi/i,'mahalakshmi maha lakshmi మహాలక్ష్మి మహా లక్ష్మి'],
 [/MUDRA/i,'mudra pmmy ముద్ర ముద్రా పీఎం ముద్ర'],
 [/PMEGP/i,'pmegp పీఎంఈజీపీ పి ఎం ఈ జి పి'],
 [/Vishwakarma/i,'vishwakarma viswakarma విశ్వకర్మ విశ్వ కర్మ'],
 [/SVANidhi/i,'svanidhi sva nidhi స్వానిధి స్వ నిధి'],
 [/Stree Nidhi/i,'streenidhi stree nidhi స్త్రీనిధి స్త్రీ నిధి'],
 [/SHG|Women.s groups/i,'shg self help groups మహిళా సంఘాలు మహిళ సంఘం డ్వాక్రా dwcra dwakra'],
 [/Post-Matric|Scholarship/i,'scholarship scholarships స్కాలర్షిప్ స్కాలర్ షిప్ ఉపకార వేతనం ఉపకారవేతనం'],
 [/Sukanya/i,'sukanya samriddhi సుకన్య సమృద్ధి సుకన్యసమృద్ధి'],
 [/Bhu Bharati|Dharani|Land Records/i,'bhu bharati bhubharati bhu bharathi dharani భూభారతి భూ భారతి ధరణి భూమి రికార్డులు'],
 [/Aadhaar/i,'aadhar adhar aadhaar ఆధార్ ఆధారు ఆధార్ కార్డ్ ఆధార్ కార్డు'],
 [/MeeSeva/i,'meeseva mee seva మీసేవ మీ సేవ'],
 [/SADAREM/i,'sadarem సదరం సదారెం సదారమ్'],
 [/e-Shram/i,'eshram e shram ఈశ్రమ్ ఈ శ్రమ్'],
 [/Udyam Registration/i,'udyam udhyam ఉద్యమ్ ఉద్యం ఎంఎస్ఎంఈ'],
 [/VB-G RAM G/i,'vb g ram g ఉపాధి హామీ ఉపాధిహామీ'],
 [/PMJJBY/i,'pmjjby జీవన్ జ్యోతి జీవనజ్యోతి ప్రధాన్ మంత్రి జీవన్ జ్యోతి బీమా యోజన'],
 [/PMSBY/i,'pmsby సురక్ష బీమా ప్రధాన్ మంత్రి సురక్ష బీమా యోజన'],
 [/Rajiv Yuva/i,'rajiv yuva vikasam రాజీవ్ యువ వికాసం రాజీవ్ యువ వికాసమ్'],
 [/PMMVY/i,'pmmvy మాతృ వందన మాతృవందన'],
 [/PMKVY/i,'pmkvy కౌశల్ వికాస్ కౌశల్య వికాస్'],
 [/RSETI/i,'rseti ఆర్సెటి ఆర్ సెటి'],
 [/ITI/i,'iti ఐటీఐ ఐ టి ఐ'],
 [/POLYCET|Polytechnic/i,'polycet polytechnic పాలిసెట్ పాలిటెక్నిక్'],
 [/National Career/i,'ncs ఎన్సిఎస్ జాబ్స్ jobs ఉద్యోగాలు'],
 [/eGramSwaraj/i,'egramswaraj gram swaraj ఈ గ్రామ స్వరాజ్ గ్రామస్వరాజ్'],
 [/Royal Chess/i,'chess చెస్ చదరంగం']
];
const ignored=new Set(['scheme','schemes','yojana','yojna','పథకం','పథకము','పథకాలు','స్కీమ్','వివరాలు','గురించి','కోసం','చెప్పండి','ఏమిటి','ఏంటి','కావాలి','చూపించు','details','about','please','show','me','the']);
function prepare(sections){return sections.flatMap(s=>s.items.map((it,i)=>{
 const aliases=rules.filter(([r])=>r.test(it.e+' '+it.id+' '+s.id)).map(x=>x[1]).join(' ');
 return{s,it,i,title:normalize(it.t+' '+it.e),names:normalize(aliases),body:normalize(it.d+' '+it.de),section:normalize(s.te+' '+s.en)};
}));}
function find(rows,raw){const q=normalize(raw);if(q.length<2)return[];const words=q.split(' ').filter(w=>!ignored.has(w)),tokens=words.length?words:q.split(' ');const phrase=tokens.join(' '),compact=phrase.replace(/ /g,'');
 return rows.map(r=>{const text=r.title+' '+r.names+' '+r.body+' '+r.section,joined=text.replace(/ /g,'');let score=0;
 if(r.title.includes(q))score=100;else if(r.names.includes(q))score=90;
 else if(tokens.every(w=>text.includes(w)))score=60+tokens.filter(w=>r.title.includes(w)||r.names.includes(w)).length;
 else if(compact.length>=4&&joined.includes(compact))score=45;
 return{...r,score};}).filter(r=>r.score).sort((a,b)=>b.score-a.score);
}
window.GS_SEARCH={normalize,prepare,find};
})();
