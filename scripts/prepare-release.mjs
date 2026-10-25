// Run once before every content release: node scripts/prepare-release.mjs YYYY-MM-DD
// Release date is not a claim that every card was reverified. Keep each card's u.
import fs from 'node:fs';import crypto from 'node:crypto';
const date=process.argv[2];if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||new Date(date).toISOString().slice(0,10)!==date)throw Error('Use a valid YYYY-MM-DD release date');
const stamp=date.split('-').reverse().join('-');let data=fs.readFileSync('schemes.js','utf8'),sw=fs.readFileSync('sw.js','utf8'),html=fs.readFileSync('index.html','utf8');
data=data.replace(/"built": "[^"]+"/,`"built": "${stamp}"`);if(data.includes('"releaseDate":'))data=data.replace(/"releaseDate": "[^"]+"/,`"releaseDate": "${stamp}"`);else data=data.replace(/"built": "[^"]+",/,`"built": "${stamp}",\n  "releaseDate": "${stamp}",`);
const old=Number(sw.match(/gramseva-v(\d+)/)[1]),next=old+1;sw=sw.replaceAll(`gramseva-v${old}`,`gramseva-v${next}`).replaceAll(`?v=${old}`,`?v=${next}`);html=html.replaceAll(`?v=${old}`,`?v=${next}`);sw=sw.replace(/const DATA_SHA='[^']+'/,`const DATA_SHA='${crypto.createHash('sha256').update(data).digest('hex')}'`);
fs.writeFileSync('schemes.js',data);fs.writeFileSync('sw.js',sw);fs.writeFileSync('index.html',html);console.log(`Prepared v${next}, release ${stamp}; per-card source dates unchanged.`);
