import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const code = fs.readFileSync('dist/data.js','utf8');
const {entries,links} = vm.runInNewContext(code+';HEALTHOPEDIA;');
assert.equal(entries.length,662);
assert.equal(new Set(entries.map(e=>e.id)).size,662);
assert.equal(entries.filter(e=>!e.catalog&&e.type==='guide').length,14);
assert.equal(entries.filter(e=>!e.catalog&&e.type==='reference').length,14);
const whoEntries=entries.filter(e=>!e.catalog);
assert.equal(whoEntries.length,28);
assert.equal(entries.filter(e=>e.catalog).length,634);
const sourceLabels = new Set(entries.filter(e=>e.catalog).map(e=>e.sourceLabel));
assert.ok([...sourceLabels].some(label => label.includes('3,000 Remedies')));
assert.ok(sourceLabels.has('Swiss Cancer League assessment'));
const cancerEntry = entries.find(e => e.id === 'source-cancer-claims');
assert.equal(cancerEntry.type,'reference');
assert.equal(cancerEntry.sourceReview,true);
assert.match(cancerEntry.reason,/not validate/);
assert.match(cancerEntry.safety,/Do not use this as cancer treatment/);
const starts=[1,7,13,17,23,31,37,43,49,55,61,67,71,79,85,91,97,105,111,117,125,129,135,141,147,151,157,163];
assert.deepEqual(Array.from(whoEntries,e=>e.page),starts);
for (const e of entries) {
  for (const field of ['name','form','category','concern','condition','botanical','use','detailPages','safety','evidence']) assert.ok(e[field],`${e.id}: missing ${field}`);
  assert.ok(e.ingredients.length,`${e.id}: no ingredient explanation`);
  for (const i of e.ingredients) assert.ok(i.name && i.part && i.role);
  if(e.type==='guide') {assert.ok(e.steps.length>=4);assert.ok(e.batch);}
  else {assert.ok(e.reason);assert.equal(e.steps,undefined);}
  if(e.extraLink) assert.ok(links[e.extraLink]);
}
for(const id of ['dhattura','daruharidra','triphala','lashuna','lodhra','haridra-wound','chaturbhadra','kapikacchu','source-cancer-claims']) {
  assert.equal(entries.find(e=>e.id===id).type,'reference',`${id}: high-risk recipe exposed`);
}
assert.match(entries.find(e=>e.id==='ashvagandha').safety,/pregnancy and breastfeeding/);
for (const url of Object.values(links)) assert.equal(new URL(url).protocol,'https:');
const html=fs.readFileSync('dist/index.html','utf8');
assert.match(html,/<dialog[^>]+aria-labelledby="dialog-title"/);
for(const filename of ['app.js','data.js','styles.css']) assert.ok(html.includes(filename));
assert.ok(!html.includes('https://'), 'Unexpected remote asset in HTML');
const published=fs.readdirSync('dist');
assert.deepEqual(published.sort(),['app.js','assets','data.js','firebase.js','index.html','manifest.webmanifest','privacy.html','styles.css']);
const assets=fs.readdirSync('dist/assets');
assert.deepEqual(assets.sort(),['healthopedia-logo-3d.png','ingredient-atlas.png','recipe-digestive.webp','recipe-general.webp','recipe-respiratory.webp','recipe-skin.webp']);
for(const asset of assets) assert.ok(fs.statSync(`dist/assets/${asset}`).size > 100000);
const app=fs.readFileSync('dist/app.js','utf8');
const css=fs.readFileSync('dist/styles.css','utf8');
assert.match(app,/full 3,000-entry index/);
assert.match(app,/No child doses/);
assert.match(app,/not the full Hulda Clark book/);
assert.match(app,/card-art/);
assert.match(app,/loading="lazy"/);
assert.match(app,/Source claim · no recipe/);
assert.match(app,/Source review · no treatment protocol/);
assert.match(app,/conditionAliases/);
assert.match(app,/erectile dysfunction/);
assert.match(app,/period pain/);
assert.match(app,/diarrhea/);
assert.match(app,/data-card-open/);
assert.match(app,/ingredient-gallery/);
assert.match(app,/pdf-library/);
assert.match(app,/data-source-doc/);
assert.match(app,/Selected Healthopedia source PDF/);
assert.match(css,/ingredient-atlas\.png/);
assert.match(css,/\.pdf-frame/);
assert.match(css,/\.pdf-tabs/);
new vm.Script(app);
console.log('PASS: 28 WHO monographs; 14 guides; 14 WHO references; 633 source-index cards plus 1 cancer source-review card; safety boundaries; no remote assets or raw PDFs in dist.');
