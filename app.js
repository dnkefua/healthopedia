'use strict';
(() => {
  const {entries, links, reviewDate} = HEALTHOPEDIA;
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const external = (url, label) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a>`;
  const state = {view:'library', category:'All concerns', condition:'all', type:'all', query:'', saved:new Set(), current:null, sourceDoc:'who'};
  const key = 'healthopedia-collection-v2';
  let storageAvailable = true, opener = null, toastTimer;
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(stored)) state.saved = new Set(stored.filter(id => entries.some(e => e.id === id)));
  } catch { storageAvailable = false; }
  const categories = ['All concerns', ...new Set(entries.map(e => e.concern))];
  const allConditions = [...new Set(entries.map(e => e.condition))].sort();
  $('categories').innerHTML = categories.map(c => `<button data-category="${escape(c)}" aria-pressed="${c === state.category}">${escape(c)}</button>`).join('');
  const badge = e => `<span class="badge ${e.catalog || e.sourceReview ? 'reference' : e.type}">${e.sourceReview ? 'Source review · no treatment protocol' : e.catalog ? 'Source claim · no recipe' : e.type === 'guide' ? 'Preparation guide' : 'Reference only'}</span>`;
  const savedLabel = e => `${state.saved.has(e.id) ? 'Remove' : 'Save'} ${e.name}${e.id.startsWith('haridra') ? ' — '+e.form : ''}${state.saved.has(e.id) ? ' from collection' : ' to collection'}`;
  const artwork = {
    'Digestion':'assets/recipe-digestive.webp',
    'Respiratory':'assets/recipe-respiratory.webp',
    'Cough & cold':'assets/recipe-respiratory.webp',
    'Skin':'assets/recipe-skin.webp',
    'General health':'assets/recipe-general.webp',
    'Eyes & ears':'assets/recipe-general.webp',
    'Pain & movement':'assets/recipe-skin.webp',
    'Pain':'assets/recipe-skin.webp',
    'Fever':'assets/recipe-general.webp',
    'Liver & yellowing':'assets/recipe-general.webp',
    'Parasites':'assets/recipe-digestive.webp',
    'Reproductive health':'assets/recipe-general.webp',
    'Dental':'assets/recipe-digestive.webp',
    'Urinary health':'assets/recipe-general.webp'
  };
  const artAlt = e => `${e.name} botanical preparation illustration`;
  const ingredientKind = ingredient => {
    const text = `${ingredient.name} ${ingredient.part}`.toLocaleLowerCase();
    if (/oil|wax|honey|carrier/.test(text)) return 'oil';
    if (/bark|wood|stem/.test(text)) return 'bark';
    if (/leaf|leaves|whole plant|flower|flowers|herb/.test(text)) return 'leaf';
    if (/root|rhizome|bulb|corm|tuber/.test(text)) return 'root';
    if (/seed|fruit|berry|pepper|pod|clove|cardamom|nut/.test(text)) return 'seed';
    return 'powder';
  };
  const ingredientKindLabel = kind => ({
    root:'Root or rhizome ingredient image',
    seed:'Seed, spice or fruit ingredient image',
    bark:'Bark ingredient image',
    leaf:'Leafy herb or flower ingredient image',
    oil:'Oil, wax or carrier ingredient image',
    powder:'Powdered or mineral ingredient image'
  }[kind]);
  const ingredientThumb = ingredient => `<span class="ingredient-photo ${ingredientKind(ingredient)}" role="img" aria-label="${escape(ingredientKindLabel(ingredientKind(ingredient)))}"></span>`;
  const ingredientGallery = e => `<div class="ingredient-gallery" aria-label="Ingredient images">${e.ingredients.map(i => `<figure>${ingredientThumb(i)}<figcaption>${escape(i.name)}</figcaption></figure>`).join('')}</div>`;
  function notify(text) {
    $('toast').textContent = text;
    $('toast').classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 4200);
  }
  const normalizeSearch = value => String(value)
    .toLocaleLowerCase()
    .replace(/\bed\b/g, 'erectile dysfunction')
    .replace(/disfucntion|disfunction/g, 'dysfunction')
    .replace(/diarrhoea|diarrhea/g, 'diarrhea')
    .replace(/haemorrhoids|hemorrhoids/g, 'hemorrhoids')
    .replace(/conjunctivitis|pink eye/g, 'pinkeye');
  const conditionAliases = {
    'Acidity & gastritis':['acid reflux','heartburn','stomach acid','gastric pain','burning stomach','stomach pain','ulcer symptoms'],
    'Bedtime anxiety':['night anxiety','sleep anxiety','restlessness at night','cannot sleep','insomnia'],
    'Cancer cure claims':['cancer','tumor','tumour','malignancy','oncology','hulda clark','cure for all cancers','parasite protocol','zapper','black walnut','wormwood','cloves'],
    'Common cold':['cold','flu-like symptoms','runny nose','blocked nose','sneezing','congestion','catarrh'],
    'Conjunctivitis':['pink eye','red eye','eye infection','itchy eyes','watery eyes'],
    'Constipation':['hard stool','cannot pass stool','slow bowel','bowel movement','irregular bowel'],
    'Cough':['coughing','dry cough','productive cough','chest cough','throat cough'],
    'Diarrhoea':['diarrhea','loose stool','watery stool','stomach upset','runs','frequent stool'],
    'Digestion':['digestive support','stomach support','after eating','bloating','gas','indigestion','gut health'],
    'Earache':['ear pain','ear infection','ear discomfort','pain in ear'],
    'Eczema':['dermatitis','skin rash','itchy rash','inflamed skin','dry itchy skin'],
    'Eye discharge':['watery eye','sticky eye','eye mucus','eye drainage','pus in eye'],
    'Fever':['high temperature','temperature','feverish','body heat','febrile'],
    'Focus & attention':['attention','concentration','focus','adhd','learning attention','mental focus'],
    'Fungal skin disease':['fungus','ringworm','athlete foot','skin fungus','yeast skin','tinea'],
    'Growing pains':['leg pain','child leg pain','growth pain','night leg pain'],
    'Haemorrhoids / piles':['hemorrhoids','piles','rectal swelling','anal pain','rectal pain','bleeding piles'],
    'Head lice':['lice','nits','hair lice','scalp lice','itchy scalp'],
    'Headache':['head pain','migraine','tension headache','pressure headache'],
    'Hyperactivity':['overactive','restless child','cannot sit still','impulsivity','adhd'],
    'Immune health':['immunity','immune support','resistance','wellness support'],
    'Indigestion':['dyspepsia','upset stomach','bloating','gas','stomach discomfort','slow digestion'],
    'Intestinal parasites':['worms','intestinal worms','parasites','deworming','pinworm','roundworm'],
    'Irritability & sleep':['irritability','cranky','restless sleep','sleep help','sleep support','insomnia'],
    'Itchy skin':['itch','skin itch','pruritus','skin irritation','rash'],
    'Jaundice':['yellow eyes','yellow skin','liver yellowing','hepatitis signs','bilirubin'],
    'Joint pain':['arthritis','joint ache','knee pain','elbow pain','inflammation pain','rheumatism'],
    'Malaise & weakness':['fatigue','weakness','low energy','tiredness','exhaustion','debility'],
    'Mild colds':['cold','sniffles','runny nose','blocked nose','sneezing','congestion'],
    'Mild cough':['cough','coughing','tickly cough','dry cough','chest cough'],
    'Motion sickness':['travel sickness','car sickness','nausea in car','sea sickness','vomiting while travelling'],
    'Nausea & vomiting':['nausea','vomiting','throwing up','queasy','sick stomach','morning sickness'],
    'Painful menstruation':['period pain','menstrual cramps','cramps','dysmenorrhea','painful periods','menstruation pain'],
    'Scabies':['mites','skin mites','itchy burrows','contagious itch','scabies rash'],
    'Sexual dysfunction':['erectile dysfunction','impotence','low libido','libido','sexual health','fertility','male fertility','performance anxiety'],
    'Sleep quality':['sleep','insomnia','restful sleep','poor sleep','wakefulness','night rest'],
    'Sore throat':['throat pain','scratchy throat','tonsil pain','pain swallowing','pharyngitis'],
    'Sprain':['twist','ankle sprain','strain','swelling after injury','ligament injury'],
    'Teething pain':['teething','gum pain','baby gum pain','tooth eruption','sore gums'],
    'Toothache':['tooth pain','dental pain','cavity pain','gum pain','mouth pain','tooth infection'],
    'Tummy ache':['stomach ache','belly ache','abdominal pain','stomach pain','tummy pain','cramps'],
    'Urinary disorders':['urine problem','urinary tract','uti','burning urine','frequent urination','bladder','kidney stone'],
    'Vaginal discharge':['discharge','white discharge','vaginal infection','yeast infection','odor','pelvic symptoms'],
    'Wounds':['cut','cuts','grazes','open wound','skin injury','bleeding wound','infection risk']
  };
  const concernAliases = {
    'Cough & cold':['respiratory','breathing','throat','cold medicine'],
    'Dental':['tooth','mouth','gum','oral health'],
    'Digestion':['stomach','gut','bowel','abdomen','digestive'],
    'Eyes & ears':['eye','ear','vision','hearing'],
    'Fever':['temperature','infection signs'],
    'General health':['wellness','energy','immune','sleep','focus'],
    'Liver & yellowing':['liver','yellow eyes','yellow skin'],
    'Pain':['ache','pain relief','swelling','injury'],
    'Parasites':['worms','parasite','deworming'],
    'Reproductive health':['fertility','sexual health','period','menstrual','vaginal'],
    'Skin':['rash','itch','skin infection','wound'],
    'Urinary health':['urine','bladder','kidney','uti']
  };
  const ailmentAliases = e => [
    ...(conditionAliases[e.condition] || []),
    ...(concernAliases[e.concern] || [])
  ];
  const conditionsForCategory = () => allConditions.filter(condition =>
    state.category === 'All concerns' || entries.some(e => e.concern === state.category && e.condition === condition)
  );
  const conditionCount = condition => entries.filter(e =>
    e.condition === condition && (state.category === 'All concerns' || e.concern === state.category)
  ).length;
  function syncAilmentControls() {
    const conditions = conditionsForCategory();
    if (state.condition !== 'all' && !conditions.includes(state.condition)) state.condition = 'all';
    $('condition-filter').innerHTML = `<option value="all">${state.category === 'All concerns' ? 'All ailments' : `All ${state.category}`}</option>${conditions.map(c => `<option value="${escape(c)}">${escape(c)} (${conditionCount(c)})</option>`).join('')}`;
    $('condition-filter').value = state.condition;
    $('ailment-buttons').innerHTML = `<button data-condition="all" aria-pressed="${state.condition === 'all'}">${state.category === 'All concerns' ? 'All ailments' : `All ${escape(state.category)}`}</button>${conditions.map(c => `<button data-condition="${escape(c)}" aria-pressed="${c === state.condition}">${escape(c)} <span>${conditionCount(c)}</span></button>`).join('')}`;
  }
  const searchable = e => [
    e.name,e.form,e.category,e.concern,e.condition,e.botanical,e.use,e.safety,e.reason,e.sourceClaim,
    ...(e.keywords || []), ...ailmentAliases(e),
    ...e.ingredients.flatMap(i => [i.name,i.part,i.role])
  ].filter(Boolean).join(' ');
  function filtered() {
    const terms = normalizeSearch(state.query).trim().split(/\s+/).filter(Boolean);
    return entries.filter(e => {
      const text = normalizeSearch(searchable(e));
      return (state.view !== 'saved' || state.saved.has(e.id)) && (state.category === 'All concerns' || e.concern === state.category) && (state.condition === 'all' || e.condition === state.condition) && (state.type === 'all' || e.type === state.type) && terms.every(t => text.includes(t));
    });
  }
  function card(e) {
    return `<article class="card" data-card-open="${e.id}" tabindex="0" aria-label="Open ${escape(e.condition)} information for ${escape(e.name)}"><div class="card-art"><img src="${artwork[e.category]}" alt="${escape(artAlt(e))}" loading="lazy"><span class="art-caption">${e.type === 'guide' ? 'recipe method' : e.sourceReview ? 'source review' : e.catalog ? 'source index' : 'source note'}</span></div><div class="card-top"><span class="category-label">${escape(e.concern)}</span><button class="save-button" data-save="${e.id}" aria-pressed="${state.saved.has(e.id)}" aria-label="${escape(savedLabel(e))}">${state.saved.has(e.id) ? '♥' : '♡'}</button></div><p class="condition-label">${e.sourceReview ? 'Critical source review' : e.catalog ? 'Source index indication' : 'Traditional indication'}: ${escape(e.condition)}</p><h3>${escape(e.condition)}</h3><p class="subtitle">${escape(e.name)} · ${escape(e.form)}</p><p class="botanical-name">${escape(e.botanical)}</p><p class="use">${escape(e.use)}</p>${badge(e)}<div class="card-bottom"><span>${escape(e.sourceLabel || 'WHO · chapter')} p. ${e.page}</span><button data-open="${e.id}" aria-label="Read ${escape(e.condition)} — ${escape(e.name)}">Read ${e.type === 'guide' ? 'recipe' : e.sourceReview ? 'source review' : e.catalog ? 'source note' : 'reference'} ↗</button></div></article>`;
  }
  function render() {
    syncAilmentControls();
    document.querySelectorAll('nav [data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === state.view)));
    document.querySelectorAll('[data-category]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.category === state.category)));
    document.querySelectorAll('[data-condition]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.condition === state.condition)));
    $('saved-count').textContent = state.saved.size;
    const sourceView = state.view === 'sources';
    $('browse-controls').hidden = sourceView;
    $('grid').hidden = sourceView;
    $('sources-view').hidden = !sourceView;
    $('section-kicker').textContent = sourceView ? 'TRANSPARENCY & EVIDENCE' : state.view === 'saved' ? 'YOUR PERSONAL REFERENCE SHELF' : 'THE REFERENCE SHELF';
    $('section-title').textContent = sourceView ? 'Three documents. Different evidence.' : state.view === 'saved' ? 'My collection.' : 'What are you trying to address?';
    if (sourceView) { $('result-count').textContent = '3 source reviews'; syncSourceReader(); return; }
    const shown = filtered();
    $('result-count').textContent = `${shown.length} of ${state.view === 'saved' ? state.saved.size : entries.length} ${state.view === 'saved' ? 'saved entries' : 'ailment references'}`;
    $('grid').innerHTML = shown.length ? shown.map(card).join('') : `<div class="empty"><h3>${state.view === 'saved' && !state.saved.size ? 'A little room for your discoveries.' : 'No matching entries.'}</h3><p>${state.view === 'saved' && !state.saved.size ? 'Save entries with the heart button to keep them here on this device.' : 'Try another ingredient, a broader topic, or reset your filters.'}</p><button class="button" ${state.view === 'saved' && !state.saved.size ? 'data-view="library"' : 'data-reset'}>${state.view === 'saved' && !state.saved.size ? 'Browse the library' : 'Reset filters'}</button></div>`;
  }
  function resetFilters() {state.category='All concerns';state.condition='all';state.type='all';state.query='';$('search').value='';$('type-filter').value='all';render();}
  function toggleSave(id) {
    const e = entries.find(e => e.id === id); if (!e) return;
    const wasSaved = state.saved.has(id);
    wasSaved ? state.saved.delete(id) : state.saved.add(id);
    try {localStorage.setItem(key, JSON.stringify([...state.saved]));storageAvailable=true;} catch {storageAvailable=false;}
    const activeSave = document.activeElement?.dataset.save;
    render();
    if (state.current === id && $('detail').open) {
      const b = $('dialog-content').querySelector('[data-save]');
      b.textContent = state.saved.has(id) ? '♥ Saved to collection' : '♡ Save to collection';
      b.setAttribute('aria-pressed',String(state.saved.has(id)));
      b.setAttribute('aria-label',savedLabel(e));
    } else if(activeSave) {
      (document.querySelector(`#grid [data-save="${id}"]`) || $('grid').querySelector('button') || $('search')).focus({preventScroll:true});
    }
    notify((wasSaved ? 'Removed from collection.' : 'Saved to your collection.') + (storageAvailable ? '' : ' Browser storage unavailable; this change lasts only for this session.'));
  }
  function showDialog(html) {
    opener = document.activeElement;
    $('dialog-content').innerHTML = html;
    $('detail').showModal();
    $('detail').scrollTop = 0;
    $('close-dialog').focus({preventScroll:true});
  }
  function openEntry(id) {
    const e = entries.find(e => e.id === id); if (!e) return;
    state.current = id;
    const stepSection = e.type === 'guide' ? `<h3>Preparation method</h3><p><strong>${escape(e.batch)}</strong></p><p>This is a paraphrase of the source’s manufacturing method, not instructions to take or apply the product. A qualified clinician or pharmacist must determine whether medicinal use is appropriate and specify any dose.</p><ol>${e.steps.map(s => `<li>${escape(s)}</li>`).join('')}</ol><p><strong>Storage note:</strong> Keep dry and away from children. Home preparation does not establish purity, potency, sterility or a validated shelf life. Discard contaminated or deteriorated material; appearance alone cannot establish safety.</p>` : `<h3>Why there is no recipe</h3><p>${escape(e.reason)}</p>`;
    const trace = e.sourceReview ? `<p>${escape(e.sourceClaim)} The app preserves this record for search and safety review, not as a treatment protocol.</p><div class="source-links">${external(links.cancerReview,'Open your supplied cancer assessment')}${external(links.cancer,'National Cancer Institute: complementary and alternative medicine')}</div>` : e.catalog ? `<p>${escape(e.sourceClaim || `The table of contents in the supplied 3,000 Herbal Remedy with Instructions document lists this source claim on PDF page ${e.page}.`)} The full claim was not clinically validated or imported as a prescription.</p><div class="source-links">${external(links.collection,'Open your supplied 3,000-remedy PDF')}${external(links.children,'NCCIH: children and complementary approaches')}</div>` : `<p>WHO, <em>Traditional Herbal Remedies for Primary Health Care</em> (2010). Relevant preparation / precaution text: printed pp. ${escape(e.detailPages)}. PDF page numbers are 12 higher than printed page numbers.</p><div class="source-links">${external(links.whoPdf+'#page='+(e.page+12),'Open official WHO PDF at this chapter')}${external(links.who,'WHO publication record')}${external(links.whoShared,'Your shared copy of the WHO manual')}${e.extraLink ? external(links[e.extraLink],'Additional safety / evidence reference') : external(links.safety,'NCCIH: safety of complementary approaches')}</div>`;
    const ingredientRows = e.ingredients.map(i=>`<tr><td><div class="ingredient-name-cell">${ingredientThumb(i)}<span>${escape(i.name)}<small>${escape(i.part)}</small></span></div></td><td>${escape(i.role)}</td></tr>`).join('');
    showDialog(`<img class="detail-art" src="${artwork[e.category]}" alt="${escape(artAlt(e))}"><div class="detail-heading">${badge(e)}<h2 id="dialog-title">${escape(e.condition)}</h2><p class="detail-subtitle">${escape(e.name)} · ${escape(e.form)} · <em>${escape(e.botanical)}</em></p></div><div class="detail-meta">${escape(e.concern)} / ${e.sourceReview ? 'critical source review' : e.catalog ? '3,000 Remedies source index' : `WHO 2010 / chapter starts at printed p. ${e.page} (PDF p. ${e.page+12})`}</div>${e.keywords?.length ? `<p class="source-note"><strong>Also indexed under:</strong> ${e.keywords.map(escape).join(', ')}.</p>` : ''}<p>${escape(e.use)}</p><div class="callout"><strong>Read before considering use</strong><p>${escape(e.safety)}</p><p>No personalized dosing, child dosing or pregnancy recommendations are provided. Do not stop or replace prescribed treatment.</p></div><h3>Constituents first</h3><p>These are the products or ingredients named for this entry. Images are visual guides by ingredient type; they are not identity verification for foraging, purchase or dosing.</p>${ingredientGallery(e)}<h3>What each ingredient does in the source</h3><p>Constituents and traditional roles are summarized from the source. A plausible mechanism is not proof that a recipe works.</p><table class="ingredient-table"><thead><tr><th scope="col">Ingredient / part</th><th scope="col">Function or rationale</th></tr></thead><tbody>${ingredientRows}</tbody></table>${stepSection}${e.editorial ? `<div class="callout"><strong>Editorial change</strong><p>${escape(e.editorial)}</p></div>` : ''}<h3>Evidence, not assumptions</h3><p>${escape(e.evidence)}</p><h3>Trace the source</h3>${trace}<p class="source-note">Editorial source check: ${reviewDate}. Educational summary; not independently reviewed or approved by a clinician. No affiliation with or endorsement by WHO is implied.</p><div class="detail-actions"><button data-save="${e.id}" aria-pressed="${state.saved.has(e.id)}" aria-label="${escape(savedLabel(e))}">${state.saved.has(e.id) ? '♥ Saved to collection' : '♡ Save to collection'}</button><button data-print>Print / save PDF</button></div>`);
  }
  const pdfSources = [
    {id:'who', title:'Traditional Herbal Remedies for Primary Health Care', label:'WHO manual', url:links.whoShared, fallback:links.whoPdf, meta:'181 pages · 28 monographs · strongest recipe source', tone:'Primary source', summary:'This is the main preparation source. Healthopedia extracted the 28 monographs, separated preparation notes from dosing, and withheld higher-risk applications.', focus:'Best for plant identity, ingredient roles, preparation context and historical precautions.'},
    {id:'remedies', title:'3,000 Herbal Remedy with Instructions', label:'3,000-remedy index', url:links.collection, fallback:links.collection, meta:'1,003 pages · 3,000 TOC entries · source claims only', tone:'Index source', summary:'This document is used as a searchable source index. Repeated herb/ailment claims are grouped for browsing; child-dose instructions are not published.', focus:'Best for finding ailment wording and herb names from the supplied collection, not for validated prescriptions.'},
    {id:'cancer', title:'Assessment of “Cure for All Cancers”', label:'Cancer-claim assessment', url:links.cancerReview, fallback:links.cancerReview, meta:'3 pages · critical assessment · no protocol', tone:'Safety review', summary:'This supplied file assesses Hulda Clark cancer-cure claims. It is displayed as a cautionary source, not as a cancer-treatment recipe book.', focus:'Best for understanding why Healthopedia does not reproduce cancer protocols or device claims.'}
  ];
  const sourceLibrary = () => `<section class="pdf-library" aria-labelledby="pdf-library-title"><div class="pdf-library-head"><p class="eyebrow">SOURCE READER</p><h3 id="pdf-library-title">Open the three supplied PDFs inside Healthopedia.</h3><p>Select a document to preview it, read the editorial handling note, or open the original PDF in a new tab. If a provider blocks the embedded preview, the open button remains the accessible fallback.</p></div><div class="pdf-tabs" role="tablist" aria-label="Supplied PDF documents">${pdfSources.map(doc=>`<button id="pdf-tab-${escape(doc.id)}" role="tab" aria-controls="pdf-panel" aria-selected="${doc.id===state.sourceDoc}" tabindex="${doc.id===state.sourceDoc ? '0' : '-1'}" data-source-doc="${escape(doc.id)}"><span>${escape(doc.label)}</span><small>${escape(doc.meta)}</small></button>`).join('')}</div><div class="pdf-reader-shell"><aside class="pdf-reader-notes" id="pdf-source-summary" aria-live="polite"></aside><div class="pdf-frame-wrap" role="tabpanel" id="pdf-panel" aria-labelledby="pdf-tab-${escape(state.sourceDoc)}"><iframe id="pdf-frame" class="pdf-frame" title="Selected Healthopedia source PDF" loading="lazy" referrerpolicy="no-referrer"></iframe></div></div></section>`;
  function syncSourceReader() {
    const doc = pdfSources.find(item => item.id === state.sourceDoc) || pdfSources[0];
    if (!doc || !$('pdf-frame')) return;
    document.querySelectorAll('[data-source-doc]').forEach(button => {
      const selected = button.dataset.sourceDoc === doc.id;
      button.setAttribute('aria-selected', String(selected));
      button.setAttribute('tabindex', selected ? '0' : '-1');
    });
    $('pdf-panel')?.setAttribute('aria-labelledby', `pdf-tab-${doc.id}`);
    $('pdf-frame').src = doc.url;
    $('pdf-frame').title = `${doc.title} PDF preview`;
    $('pdf-source-summary').innerHTML = `<span class="badge reference">${escape(doc.tone)}</span><h4>${escape(doc.title)}</h4><p>${escape(doc.summary)}</p><dl><div><dt>What to use it for</dt><dd>${escape(doc.focus)}</dd></div><div><dt>How Healthopedia handles it</dt><dd>${escape(doc.meta)}</dd></div></dl><div class="source-links">${external(doc.url,'Open supplied PDF')}${doc.fallback !== doc.url ? external(doc.fallback,'Open alternate official copy') : ''}</div>`;
  }
  $('sources-view').innerHTML = `<p class="source-note">All three supplied links were examined. The WHO manual supplies the 28 verified monographs; the 3,000-remedy document contributes a clearly labelled 32-entry source-index preview.</p><article class="source-card"><span class="badge">PRIMARY HISTORICAL SOURCE · 28 MONOGRAPHS</span><h3>Traditional Herbal Remedies for Primary Health Care</h3><p>World Health Organization, 2010 · 181 PDF pages · ISBN 9789290223825.</p><p>The complete PDF was obtained from WHO’s repository. The plant identity, preparation and precaution sections across all 28 monographs were inspected. This app provides original summaries, selected ingredient-preparation methods and page references, not a reproduction of the book.</p><p><strong>Important limitation:</strong> a 2010 manual is not current clinical approval. Broad historical safety claims, hazardous applications and instructions for serious conditions are not adopted automatically. ${entries.filter(e=>!e.catalog&&e.type==='guide').length} entries have preparation methods without dosing; the other ${entries.filter(e=>!e.catalog&&e.type==='reference').length} are reference-only.</p><p>${external(links.who,'WHO publication record')} · ${external(links.whoShared,'Open your supplied PDF')}</p></article><article class="source-card"><span class="badge reference">SOURCE INDEX · NOT VALIDATED FOR PRESCRIBING</span><h3>3,000 Herbal Remedy with Instructions</h3><p>Shared document: 1,003 PDF pages. Authorship, clinical review and supporting evidence were not verified.</p><p>The cover, contents and sample recipes on PDF pages 93–95 were examined. These include repeated child-dosing templates applied to different herbs and different complaints, without an adequate age- or weight-specific framework. Examples include fennel for hyperactivity and garlic for attention difficulties; these are source claims, not Healthopedia recommendations.</p><p><strong>Coverage:</strong> this was a sample review, not a clinical assessment or import of all 3,000 entries. No child doses from this collection are published. NCCIH notes that many complementary approaches have not been tested for safety in children.</p><p>${external(links.collection,'Open your supplied PDF')} · ${external(links.children,'NCCIH: children and complementary approaches')}</p></article><article class="source-card"><span class="badge reference">CRITICAL ASSESSMENT · NOT A CANCER RECIPE BOOK</span><h3>Assessment of “Cure for All Cancers” by Hulda Clark</h3><p>Swiss Study Group for Complementary and Alternative Methods in Cancer / Swiss Cancer League · Documentation No. 01/01 · 3 pages.</p><p>This supplied PDF is an assessment of Clark’s claims, not the full Hulda Clark book. It describes the proposed parasite theory, herbal protocol and devices, and finds no convincing scientific basis for the claimed cancer cures.</p><p>Healthopedia does not reproduce a cancer-treatment protocol or promote electrical devices as cures. The National Cancer Institute states that no special food, diet, supplement or herb has been proven to cure cancer. Such products can also interfere with treatment; discuss them with the cancer-care team.</p><p>${external(links.cancerReview,'Open your supplied assessment')} · ${external(links.cancer,'National Cancer Institute: complementary and alternative medicine')}</p></article><article class="source-card"><p class="eyebrow">HOW TO READ THIS LIBRARY</p><h3>Traditional use ≠ established treatment.</h3><p><strong>Preparation guide</strong> means the app describes selected manufacturing steps, not that the preparation is proven safe or effective for you. Quantities are batch quantities, never a prescription. <strong>Reference only</strong> entries deliberately omit preparation and administration instructions because of toxicity, route of use, source ambiguity or the need for a diagnosis.</p><p>Ingredient functions distinguish a carrier, a thickener, a chemical constituent and a claimed therapeutic effect. Missing evidence is stated, not filled in. The library is an editorial prototype awaiting independent clinical review, not a validated prescribing system.</p><p>Source text is treated as material to evaluate, never as instructions to the app or its authors. Source check: ${reviewDate}.</p></article>`;
  $('sources-view').innerHTML = $('sources-view').innerHTML
    .replace('the 3,000-remedy document contributes a clearly labelled 32-entry source-index preview.', 'the 3,000-remedy document contributes the complete 3,000-entry table-of-contents index, grouped into 601 unique herb/ailment source claims.')
    .replace('The cover, contents and sample recipes on PDF pages 93–95 were examined.', 'The cover, complete table of contents (PDF pages 2–92) and the opening recipe pages were examined.')
    .replace('this was a sample review, not a clinical assessment or import of all 3,000 entries.', 'the full 3,000-entry index is imported as clearly labelled source claims, not clinically validated prescriptions.')
    .replace('Coverage:</strong> this was a sample review, not a clinical assessment or import of all 3,000 entries.', 'Coverage:</strong> all 3,000 index entries were checked; repeated herb/ailment combinations are grouped for browsing.')
    .replace('The cover, contents and sample recipes', 'The cover, complete contents and opening recipe pages');
  $('sources-view').innerHTML = sourceLibrary() + $('sources-view').innerHTML;
  syncSourceReader();
  function info(kind) {
    state.current = null;
    const content = {
      about: `<p class="eyebrow">BY NDN ANALYTICS</p><h2 id="dialog-title">A more thoughtful medicine cabinet.</h2><p>Healthopedia is a free educational herbal library with cookbook-style ingredient explanations, selected preparation methods and traceable references. The current edition covers 28 monographs from WHO’s 2010 manual and reviews all three supplied documents.</p><p>Free access means no payment to read the information. It does not mean free physical medicines, free ingredients, a pharmacy service, or guaranteed treatment. No products are dispensed here.</p><p>This edition is not independently clinically reviewed. Historical content is separated from evidence and safety cautions, and risky recipes are withheld. A qualified healthcare professional should assess any intended medicinal use.</p><p>Use search to find plants or historical indications, filter by topic or entry type, and save entries to your device. Open any entry to print its ingredients, cautions and references.</p>`,
      safety: `<p class="eyebrow">READ BEFORE USE</p><h2 id="dialog-title">Natural does not mean risk-free.</h2><p>This is not a diagnosis, prescribing or medication-interaction service. There is no universal safe dose for a herb, and an ingredient’s chemistry does not prove a treatment benefit.</p><ul><li>Ask a qualified clinician or pharmacist before medicinal use, particularly for children, pregnancy, breastfeeding, chronic illness, upcoming surgery or use with other medicines.</li><li>Use correctly identified, quality-controlled ingredients. Do not forage based on this app, substitute plant species or assume a home preparation is sterile or standardized.</li><li>Never use homemade eye drops, internal Datura preparations, unreviewed vaginal washes, or nonsterile powder on wounds.</li><li>Do not use these entries for cancer treatment or stop prescribed medicines.</li><li>Severe allergic reactions, breathing difficulty, chest pain, uncontrolled bleeding, suspected poisoning, or sudden severe neurological symptoms need emergency medical help. Contact your local emergency service.</li></ul><p>Reference-only entries contain no recipe. Preparation guides contain no medicinal or child doses. Their publication is not a safety endorsement.</p><div class="source-links">${external(links.safety,'NCCIH: safety')}${external(links.children,'NCCIH: children and complementary approaches')}</div>`,
      privacy: `<p class="eyebrow">SIMPLE BY DESIGN</p><h2 id="dialog-title">Your collection stays here.</h2><p>This app has no login, analytics, forms or health-record backend. Searches are processed in your browser and are not sent to an app server. Saved entry IDs are stored in this browser’s local storage; they do not sync between devices.</p><p>Your hosting provider may keep ordinary access logs. Opening external references takes you to a separate website with its own privacy practices.</p><p>Clearing browser data removes your collection. If storage is blocked, you can still browse and save entries for the current session only.</p><div class="detail-actions"><button id="clear-collection">Clear saved collection</button></div>`
    };
    showDialog(content[kind]);
  }
  document.addEventListener('click', event => {
    const home = event.target.closest('a[href="#library"]');
    if (home) { state.view='library'; render(); return; }
    const b = event.target.closest('button'); if (!b) return;
    if (b.dataset.sourceDoc) {state.sourceDoc=b.dataset.sourceDoc;syncSourceReader();b.focus({preventScroll:true});}
    else if (b.dataset.view) {state.view=b.dataset.view;render();$('library').scrollIntoView();}
    else if (b.dataset.category) {state.category=b.dataset.category;state.condition='all';render();}
    else if (b.dataset.condition) {state.condition=b.dataset.condition;render();}
    else if (b.dataset.open) openEntry(b.dataset.open);
    else if (b.dataset.save) toggleSave(b.dataset.save);
    else if (b.hasAttribute('data-print')) window.print();
    else if (b.hasAttribute('data-reset') || b.id==='reset') resetFilters();
    else if (b.id==='about-button') info('about');
    else if (b.id==='safety-button') info('safety');
    else if (b.id==='privacy-button') info('privacy');
    else if (b.id==='close-dialog') $('detail').close();
    else if (b.id==='clear-collection') {
      if (!state.saved.size) return notify('Your collection is already empty.');
      if (!window.confirm('Remove all saved entries from this browser?')) return;
      state.saved.clear();
      try {localStorage.removeItem(key);} catch {storageAvailable=false;}
      render();notify('Saved collection cleared.');
    }
  });
  $('grid').addEventListener('click', event => {
    if (event.target.closest('button,a')) return;
    const c = event.target.closest('[data-card-open]');
    if (c) openEntry(c.dataset.cardOpen);
  });
  $('grid').addEventListener('keydown', event => {
    if (!['Enter',' '].includes(event.key)) return;
    const c = event.target.closest('[data-card-open]');
    if (!c || event.target.closest('button,a')) return;
    event.preventDefault();
    openEntry(c.dataset.cardOpen);
  });
  $('sources-view').addEventListener('keydown', event => {
    const active = event.target.closest('[data-source-doc]');
    if (!active || !['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const buttons = [...document.querySelectorAll('[data-source-doc]')];
    const current = buttons.indexOf(active);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
    state.sourceDoc = buttons[next].dataset.sourceDoc;
    syncSourceReader();
    buttons[next].focus({preventScroll:true});
  });
  $('search').addEventListener('input', e => {state.query=e.target.value;render();});
  $('condition-filter').addEventListener('change', e => {state.condition=e.target.value;render();});
  $('type-filter').addEventListener('change', e => {state.type=e.target.value;render();});
  $('detail').addEventListener('close', () => {
    state.current=null;
    if(opener?.isConnected) opener.focus({preventScroll:true});
    else $('search').focus({preventScroll:true});
  });
  $('detail').addEventListener('click', e => {if(e.target === $('detail')) {const r=$('detail').getBoundingClientRect();if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) $('detail').close();}});
  render();
})();
