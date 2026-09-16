// Small initialization/event regression harness, not a browser replacement.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function boot(initial, blocked = false) {
  const elements = new Map();
  const events = new Map();
  const values = new Map([['healthopedia-collection-v2',initial]]);
  const element = id => {
    if (!elements.has(id)) elements.set(id, {innerHTML:'',textContent:'',value:'',hidden:false,open:false,dataset:{},classList:{add(){},remove(){}},addEventListener(event,fn){events.set(`${id}:${event}`,fn);},setAttribute(){},querySelector(){return null;},focus(){}});
    return elements.get(id);
  };
  const document={getElementById:element,querySelectorAll:()=>[],activeElement:null,addEventListener:(event,fn)=>events.set(event,fn)};
  const localStorage={getItem:k=>{if(blocked)throw Error('Blocked');return values.get(k);},setItem:(k,v)=>{if(blocked)throw Error('Blocked');values.set(k,v);},removeItem:k=>values.delete(k)};
  const context=vm.createContext({document,localStorage,setTimeout:()=>0,clearTimeout(){},window:{}});
  vm.runInContext(fs.readFileSync('dist/data.js','utf8'),context);
  vm.runInContext(fs.readFileSync('dist/app.js','utf8'),context);
  function clickButton(dataset){const button={dataset,hasAttribute:name=>name==='data-reset'&&dataset.reset!==undefined};events.get('click')({target:{closest:selector=>selector==='button'?button:null}});}
  function save(id){clickButton({save:id});}
  function search(query){
    element('search').value=query;
    events.get('search:input')({target:{value:query}});
    return element('grid').innerHTML;
  }
  return {element,values,save,search,clickButton};
}

for (const initial of ['not JSON','null','{}','123','["obsolete-id"]']) {
  const app=boot(initial);
  assert.equal(app.element('saved-count').textContent,0);
    assert.equal((app.element('grid').innerHTML.match(/class="card"/g)||[]).length,661);
}
const valid=boot('["trikatu","trikatu","missing"]');
assert.equal(valid.element('saved-count').textContent,1);
valid.save('trikatu');
assert.equal(valid.element('saved-count').textContent,0);
valid.save('ela');
assert.deepEqual(JSON.parse(valid.values.get('healthopedia-collection-v2')),['ela']);
const blocked=boot(null,true);
blocked.save('ela');
assert.equal(blocked.element('saved-count').textContent,1);
assert.match(blocked.element('toast').textContent,/only for this session/);
const searchApp=boot('[]');
for (const [query, expected] of [
  ['sexual disfucntion','Sexual dysfunction'],
  ['ED','Sexual dysfunction'],
  ['fertility','Sexual dysfunction'],
  ['diarrhea','Diarrhoea'],
  ['period pain','Painful menstruation'],
  ['pink eye','Conjunctivitis'],
  ['hemorrhoids','Haemorrhoids / piles'],
  ['UTI','Urinary disorders'],
  ['worms','Intestinal parasites']
]) {
  assert.match(searchApp.search(query), new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')), `${query} should find ${expected}`);
}
const buttonApp=boot('[]');
buttonApp.clickButton({category:'Reproductive health'});
assert.match(buttonApp.element('ailment-buttons').innerHTML,/Sexual dysfunction/);
assert.match(buttonApp.element('ailment-buttons').innerHTML,/Painful menstruation/);
assert.equal((buttonApp.element('grid').innerHTML.match(/class="card"/g)||[]).length,3);
buttonApp.clickButton({condition:'Sexual dysfunction'});
assert.equal((buttonApp.element('grid').innerHTML.match(/class="card"/g)||[]).length,1);
assert.match(buttonApp.element('grid').innerHTML,/Kapikacchu/);
buttonApp.clickButton({category:'Pain'});
assert.match(buttonApp.element('ailment-buttons').innerHTML,/Growing pains/);
assert.match(buttonApp.element('ailment-buttons').innerHTML,/Joint pain/);
assert.ok((buttonApp.element('grid').innerHTML.match(/class="card"/g)||[]).length > 3);
console.log('PASS: malformed, wrong-type, duplicate, unknown and blocked storage; in-session save fallback; valid collection writes; ailment synonym search; concern and ailment buttons.');
