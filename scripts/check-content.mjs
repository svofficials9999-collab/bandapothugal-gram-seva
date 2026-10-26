// Offline structural release gate. Live source checks remain a separate step.
import fs from 'node:fs';import vm from 'node:vm';
const c={window:{}};for(const f of ['schemes.js','directory.js','creative-data.js'])vm.runInNewContext(fs.readFileSync(f,'utf8'),c);
const {GS_DATA:d,GS_DIRECTORY:directory,GS_CREATIVE_DATA:creative}=c.window,ids=new Set();
for(const sec of d.sections){if(!sec.items.length)throw Error('Empty section: '+sec.id);for(const it of sec.items){if(!it.id||ids.has(it.id))throw Error('Missing/duplicate card ID: '+it.id);ids.add(it.id);for(const k of ['t','e','d','de','s','u'])if(!it[k])throw Error('Missing '+k+': '+it.id);}}
for(const row of directory)for(const id of row.targets)if(!ids.has(id))throw Error('Missing index target '+id);
function urls(v){if(Array.isArray(v))v.forEach(urls);else if(v&&typeof v==='object')Object.values(v).forEach(urls);else if(typeof v==='string'&&/^https?:\/\//.test(v)){if(/\s/.test(v))throw Error('Whitespace in URL '+v);new URL(v);}}
urls(d);urls(creative);for(const track of creative.tracks){if(!creative.videos.some(v=>v.tracks.includes(track.id)))throw Error('No video '+track.id);const seen=new Set();for(const l of track.lessons){if(seen.has(l.id))throw Error('Duplicate lesson '+l.id);seen.add(l.id);}}
const html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');for(const match of html.matchAll(/<script src="([^"]+)"/g)){if(!sw.includes("'./"+match[1]+"'"))throw Error('Entry script missing exact offline cache key: '+match[1]);}
console.log(`PASS ${ids.size} service IDs, ${directory.length} index rows, ${creative.tracks.length} tracks, ${creative.videos.length} videos, URL invariants and exact entry-script cache keys`);
