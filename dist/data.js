/* Original editorial summaries of WHO (2010). Printed page + 12 = PDF page.
   A preparation guide describes manufacture, not a prescription or an endorsed treatment. */
'use strict';
const HEALTHOPEDIA = (() => {
  const links = {
    who: 'https://www.who.int/publications-detail-redirect/9789290223825',
    whoPdf: 'https://iris.who.int/server/api/core/bitstreams/bc668cc1-6747-402e-8e43-bceb5f9d27ef/content',
    whoShared: 'https://acrobat.adobe.com/id/urn:aaid:sc:AP:c758bfd6-07e0-4593-a4a5-507874b313ee',
    collection: 'https://acrobat.adobe.com/id/urn:aaid:sc:AP:98ddbd00-49f2-4bed-97cb-347142fbc3ce',
    cancerReview: 'https://acrobat.adobe.com/id/urn:aaid:sc:AP:004a753d-81ee-4483-b43a-9b72dc135217',
    safety: 'https://www.nccih.nih.gov/health/safety',
    children: 'https://www.nccih.nih.gov/health/children-and-the-use-of-complementary-health-approaches',
    cancer: 'https://www.cancer.gov/about-cancer/treatment/cam',
    eyes: 'https://www.fda.gov/drugs/buying-using-medicine-safely/what-you-should-know-about-eye-drops',
    wounds: 'https://www.nhs.uk/conditions/cuts-and-grazes/',
    lice: 'https://www.cdc.gov/lice/treatment/index.html',
    ashwagandha: 'https://www.nccih.nih.gov/health/ashwagandha',
    turmeric: 'https://www.nccih.nih.gov/health/turmeric'
  };
  const I = (name, part, role) => ({name, part, role});
  const powder = (material, mesh = '85') => [
    'Use correctly identified, quality-controlled ' + material + '. Do not substitute a similar-looking wild plant.',
    'Remove foreign matter. Use completely dry material and clean, dry grinding equipment.',
    'Grind into a powder and pass through a ' + mesh + '-mesh sieve, as described in the source.',
    'Place in a clean, dry, airtight container. Label the botanical name, plant part and preparation date.'
  ];
  const entries = [];
  function add(id, name, form, category, botanical, use, page, detailPages, ingredients, safety, options = {}) {
    entries.push({id, name, form, category, botanical, use, page, detailPages, ingredients, safety,
      type: options.steps ? 'guide' : 'reference',
      evidence: 'The 2010 WHO manual documents this traditional use. Its inclusion is not proof of clinical benefit, and the described home preparation has not been independently clinically validated by Healthopedia.',
      ...options});
  }
  add('amalaki','Amalaki','Seedless fruit powder','Digestion','Phyllanthus emblica',
    'Traditional use: acidity and gastritis.',1,'3–4',
    [I('Amalaki','Dried, mature, seedless fruit','The fruit is the sole plant ingredient. The source lists vitamin C and other constituents; this does not establish an antacid effect or a standardized vitamin dose.')],
    'Persistent stomach pain, difficulty swallowing, vomiting blood or black stools need medical assessment. A sour preparation may aggravate symptoms. Do not assume the source’s broad safety claims apply to pregnancy or children.',
    {steps:powder('dried, mature, seedless Phyllanthus emblica fruit','80'),batch:'Single-ingredient powder; no batch weight specified here.'});
  add('trikatu','Trikatu','Three-spice powder','Respiratory','Zingiber officinale · Piper nigrum · Piper longum',
    'Traditional use: common-cold symptoms.',7,'8–10',
    [I('Dry ginger','50 g dried rhizome','Supplies gingerols and shogaols. Provides pungency; traditionally included for digestive and warming effects.'),
     I('Black pepper','50 g dried fruit','Supplies piperine and aromatic oils. Adds pungency; the formula’s traditional role is not evidence of antiviral activity.'),
     I('Long pepper','50 g dried fruit','A second pepper species with piperine and other alkaloids. It is not interchangeable with black pepper in this source.')],
    'Avoid medicinal use during pregnancy. May cause burning or stomach irritation. Concentrated herbal products can interact with medicines; ask a pharmacist before use. Breathing difficulty, chest pain or persistent fever require care.',
    {steps:['Weigh 50 g each of authenticated dried ginger rhizome, black pepper fruit and long pepper fruit. These are batch quantities, not doses.','Clean and dry the materials; grind each to a fine powder.','Sieve through an 85-mesh sieve and mix the three equal portions thoroughly.','Store in a clean, dry, airtight labelled container, away from sunlight.'],
     batch:'150 g batch · three equal parts · not a serving size'});
  add('daruharidra','Daruharidra','Historical eye preparation','Eyes & ears','Berberis aristata',
    'Source indication: conjunctivitis.',13,'15–16',
    [I('Daruharidra','Stem or root','The source describes berberine-containing plant material and a traditional extract. This is not evidence that a homemade extract is safe for the eye.')],
    'Do not put homemade herbal liquids, honey or nonsterile preparations into the eyes. Eye pain, light sensitivity or changes in vision require prompt assessment.',
    {reason:'The book describes an eye application made outside sterile manufacturing conditions. Those instructions are intentionally not reproduced.',extraLink:'eyes'});
  add('haritaki','Haritaki','Seedless fruit powder','Digestion','Terminalia chebula',
    'Traditional use: constipation.',17,'19–21',
    [I('Haritaki','Dried, ripe, seedless fruit','The source lists chebulinic and chebulagic acids and describes a traditional laxative role. Chemical constituents alone do not prove effectiveness.')],
    'The source advises against use during pregnancy. Persistent constipation, a new change in bowel habits, severe abdominal pain or bleeding require assessment. Do not use as a substitute for evaluating bowel obstruction.',
    {steps:powder('dried, ripe, seedless Terminalia chebula fruit'),batch:'Single-ingredient powder; no dose supplied.'});
  add('pippali','Pippali','Long-pepper fruit powder','Respiratory','Piper longum',
    'Traditional use: cough.',23,'25–28',
    [I('Long pepper','Dried fruit, not root','Piperine-containing alkaloids and aromatic oils contribute pungency. The traditional cough indication does not establish treatment of an infection.')],
    'The source discourages large amounts and prolonged use, and cautions against pregnancy and use when trying to conceive. May irritate the stomach. Coughing blood, breathing difficulty or a persistent cough need assessment.',
    {steps:powder('dried Piper longum fruit'),batch:'Single-ingredient powder; no dose supplied.'});
  add('kutaja','Kutaja','Bark monograph','Digestion','Holarrhena antidysenterica',
    'Source indication: diarrhoea.',31,'33–34',
    [I('Kutaja','Stem bark','Contains alkaloids including conessine. The source describes an antidiarrhoeal role; the plant is not a replacement for rehydration or diagnosis.')],
    'Diarrhoea can cause dangerous dehydration. Blood in stools, severe pain, dehydration or persistent symptoms need medical care. The source notes constipation, distension and a concern in hypertension.',
    {reason:'Treatment depends on the cause and the person’s hydration. Medicinal preparation and dosing should be reviewed by a clinician.'});
  add('lashuna','Lashuna','Garlic oil monograph','Eyes & ears','Allium sativum',
    'Source indication: earache.',37,'39–40',
    [I('Garlic','Bulb','Sulfur-containing compounds underlie some laboratory activity; that does not establish safety inside an ear.'),
     I('Mustard oil','Oil carrier','Acts as the carrier in the historical formula, not a proven treatment for the cause of ear pain.')],
    'Do not put this homemade preparation into an ear. A perforated eardrum or an infection may require different treatment. Ear discharge, hearing loss or severe pain warrants assessment.',
    {reason:'An ear examination is needed before choosing treatment. Heating and instillation instructions are omitted.'});
  add('shirisha','Shirisha','Bark monograph','Skin','Albizzia lebbeck',
    'Source indication: eczema.',43,'45–46',
    [I('Shirisha','Stem bark','The source lists tannins and catechin and describes a traditional astringent role. Laboratory or traditional activity is not proof of eczema benefit.')],
    'Do not use this for anaphylaxis despite broad claims in the source. Breathing difficulty or swelling of the tongue or throat is an emergency. Pregnancy safety has not been established.',
    {reason:'The source includes broad allergy claims beyond demonstrated clinical benefit. Medicinal use needs professional review.'});
  add('triphala','Triphala','Historical eye-wash monograph','Eyes & ears','Terminalia chebula · Terminalia belerica · Phyllanthus emblica',
    'Source indication: eye discharge.',49,'52–53',
    [I('Haritaki','Seedless dried fruit','One of the three fruit ingredients; the source describes tannin-containing material.'),
     I('Bibhitaki','Seedless dried fruit','Second fruit component of the traditional formula.'),
     I('Amalaki','Seedless dried fruit','Third fruit component; nutrients and plant compounds do not make the mixture sterile.')],
    'Do not use a homemade Triphala eye wash. Eye products must be sterile. Pain, light sensitivity or altered vision need prompt care.',
    {reason:'The source’s homemade eye-rinse instructions are intentionally withheld because of contamination risk.',extraLink:'eyes'});
  add('kiratatikta','Kiratatikta','Whole-plant monograph','General health','Swertia chirata',
    'Source indication: fever.',55,'57–58',
    [I('Kiratatikta','Dried whole plant','The source lists xanthones and mangiferin. Their presence is not proof that this treats the infection causing a fever.')],
    'Fever may need diagnosis and specific treatment, including testing for malaria where relevant. The source warns about combination with blood-glucose-lowering medicines.',
    {reason:'A fever remedy must not delay evaluation of a serious infection. Preparation and dosing are not provided.'});
  add('karanja','Karanja','Seed and oil monograph','Skin','Pongamia pinnata',
    'Source indication: fungal skin disease.',61,'63–64',
    [I('Karanja','Seed or seed oil','Contains fixed oils and flavonoid constituents. The source describes traditional skin use, not an established substitute for antifungal medicines.')],
    'Do not swallow Karanja oil: the source identifies internal oil use as toxic. It advises against internal use in pregnancy and nursing. Skin symptoms may have non-fungal causes.',
    {reason:'Toxicity and uncertainty about diagnosis make this a reference entry, not a home-treatment recipe.'});
  add('pippalimoola','Pippalimoola','Long-pepper root monograph','Pain & movement','Piper longum',
    'Source indication: headache.',67,'68–69',
    [I('Long pepper','Root in the text; conflicting table entry','The monograph describes alkaloids and essential oils. The root is a different plant part from the fruit used in Pippali.')],
    'A sudden severe headache, weakness, confusion, fever with stiff neck or a head injury requires urgent assessment.',
    {reason:'Source-quality flag: the monograph text specifies roots, but its composition table says fruit and its image captions are inconsistent. No recipe is published until identity is resolved.'});
  add('chaturbhadra','Chaturbhadra','Four-herb monograph','Digestion','Aconitum heterophyllum · Tinospora cordifolia · Cyperus rotundus · Zingiber officinale',
    'Source indication: indigestion.',71,'74–76',
    [I('Ativisha','Aconitum heterophyllum root','Traditional component; correct species identification is critical. Other aconite species can be highly toxic.'),
     I('Guduchi','Tinospora cordifolia stem','Traditional component; the combined formula’s benefit cannot be inferred from a single constituent.'),
     I('Musta','Cyperus rotundus rhizome','Traditionally included for digestive complaints.'),
     I('Ginger','Zingiber officinale rhizome','Provides pungent aromatic constituents and a traditional digestive role.')],
    'Do not substitute aconite species or prepare an unidentified plant. Discuss the full formula and any medicines with a qualified clinician.',
    {reason:'Species confusion and a multi-herb medicinal formulation make this unsuitable for an unsupervised cookbook recipe.'});
  add('katuka','Katuka','Root and rhizome monograph','General health','Picrorhiza kurroa',
    'Source indication: jaundice.',79,'81–82',
    [I('Katuka','Roots and rhizomes','The source describes glycosides including kutkin-related constituents and traditional liver use. This is not proof of a hepatitis treatment.')],
    'Yellow skin or eyes require medical assessment; they can signal liver or bile-duct disease. The source notes laxative effects and stomach upset.',
    {reason:'Jaundice is a sign requiring diagnosis, not an indication for a self-treatment recipe.'});
  add('ajamoda','Ajamoda','Dried-fruit powder','Pain & movement','Apium leptophyllum',
    'Traditional use: joint pain.',85,'88–89',
    [I('Ajamoda','Dried fruits, often called seeds','The source describes essential and fixed oils. A traditional joint-pain role is not evidence that this modifies arthritis.')],
    'The source advises avoidance during pregnancy and caution in kidney disorders. Do not assume a product labelled celery seed is the same species. A hot, swollen joint with fever needs assessment.',
    {steps:powder('authenticated dried Apium leptophyllum fruits'),batch:'Single-ingredient powder; no dose supplied.'});
  add('lodhra','Lodhra','Bark monograph','Reproductive health','Symplocos racemosa',
    'Source indication: vaginal discharge.',91,'93–95',
    [I('Lodhra','Stem bark','The source lists alkaloids including loturine and describes an astringent role. This does not establish treatment of a vaginal infection.')],
    'Do not douche with this preparation. New, foul-smelling or painful discharge, pelvic pain or pregnancy-related symptoms should be assessed.',
    {reason:'The source includes vaginal application instructions. They are not reproduced; abnormal discharge needs diagnosis.'});
  add('dhattura','Dhattura','Toxic plant — safety reference','Skin','Datura metel',
    'Source indication: head lice. Not a recommended treatment.',97,'100–102',
    [I('Dhattura','Leaves and seeds — poisonous','Contains atropine, scopolamine and hyoscyamine. These potent anticholinergic compounds can cause serious poisoning, not just a local effect.')],
    'Do not prepare, ingest or apply Datura for lice. Suspected exposure or symptoms of poisoning require immediate poison-centre or emergency advice.',
    {reason:'The source itself identifies this as poisonous. All preparation, proportion and application instructions are withheld. Use recognized lice treatments and combing guidance.',extraLink:'lice'});
  add('ashvagandha','Ashvagandha','Root powder','General health','Withania somnifera',
    'Traditional use: malaise and weakness.',105,'108–109',
    [I('Ashvagandha / ashwagandha','Dried, mature roots','Contains withanolides and alkaloids. Products differ in composition; a homemade powder cannot be equated with a studied standardized extract.')],
    'Avoid during pregnancy and breastfeeding. Rare liver injury has been reported. Ask a clinician before use with thyroid or autoimmune disorders, before surgery, or with sedatives, thyroid, diabetes, blood-pressure or immune-suppressing medicines.',
    {steps:powder('authenticated dried, mature Withania somnifera roots'),batch:'Single-ingredient powder; no dose supplied.',extraLink:'ashwagandha',
     evidence:'NCCIH reports some evidence for certain preparations in stress or insomnia, not a general cure for weakness. This cannot be transferred automatically to homemade root powder. Current NCCIH pregnancy and breastfeeding cautions take precedence over the older manual’s broad safety statements.'});
  add('shatpushpa','Shatpushpa','Dill-fruit powder','Reproductive health','Anethum sowa',
    'Traditional use: painful menstruation.',111,'113–115',
    [I('Shatpushpa / dill','Dried, ripe fruits','Aromatic oils contribute the characteristic scent. The source describes a traditional antispasmodic role, not confirmed relief for every cause of menstrual pain.')],
    'Not pregnancy self-care. The source advises stopping if bleeding increases or dizziness occurs. Severe or new pelvic pain, heavy bleeding or possible pregnancy needs assessment.',
    {steps:powder('authenticated dried, ripe Anethum sowa fruits'),batch:'Single-ingredient powder; no dose supplied.'});
  add('palasha','Palasha','Seed monograph','Digestion','Butea monosperma',
    'Source indication: intestinal parasites.',117,'120–121',
    [I('Palasha','Seeds','The source lists palasonin and oils and describes a traditional anthelmintic role. The type of parasite and treatment must be established clinically.')],
    'The source advises avoidance in pregnancy and when trying to conceive. Higher amounts may cause vomiting and abdominal colic. Do not use as a universal deworming treatment.',
    {reason:'Suspected parasites require diagnosis and an appropriate medicine. No self-dosing protocol is provided.'});
  add('surana','Surana','Corm monograph','Digestion','Amorphophallus campanulatus',
    'Source indication: haemorrhoids / piles.',125,'127–128',
    [I('Surana','Corm','The source lists phytosterols, triterpenes and sugars. A food-related plant is not necessarily safe when raw or used as concentrated powder.')],
    'Raw material can irritate. Do not ingest raw corm powder. The source cautions against use in pregnancy and nursing. Rectal bleeding should not automatically be attributed to piles.',
    {reason:'Processing and irritation risks require expert review; no home-powder recipe is provided.'});
  add('gandhaka','Gandhaka','Sulphur ointment monograph','Skin','Purified sulphur · sesame oil · beeswax',
    'Source indication: scabies.',129,'132–133',
    [I('Purified sulphur','Mineral ingredient, not a herb','The intended active scabicide in the historical ointment. Purity, concentration and correct treatment matter.'),
     I('Sesame oil','Carrier','Provides the oily base that distributes the active material.'),
     I('Beeswax','Thickener','Gives the ointment its consistency; it is not the scabies-killing ingredient.')],
    'Scabies requires an effective treatment plan, including management of close contacts. Do not compound from unpurified sulphur or apply an unreviewed mixture to damaged skin.',
    {reason:'Purification and medicinal compounding require quality control. The historical formula is described by ingredient function only, not as a kitchen recipe.'});
  add('kapikacchu','Kapikacchu','Seed monograph','Reproductive health','Mucuna pruriens',
    'Source indication: sexual dysfunction.',135,'137–138',
    [I('Kapikacchu','Seeds','Contains L-DOPA, a pharmacologically active dopamine precursor. This is a reason for caution, not evidence of a safe general-purpose sexual tonic.')],
    'Variable L-DOPA content and medicine interactions require clinical review. Do not substitute seed powder for prescribed Parkinson’s treatment or use it as an unmonitored libido medicine.',
    {reason:'A drug-active constituent makes unsupervised dosing inappropriate. Preparation and serving instructions are withheld.',
     keywords:['sexual dysfunction','sexual disfucntion','sexual disfunction','erectile dysfunction','impotence','low libido','libido','sexual health','fertility','male fertility']});
  add('haridra-sprain','Haridra','Turmeric ingredient preparation','Pain & movement','Curcuma longa',
    'Traditional use: sprain. Preparation shown for the ingredient only.',141,'143–145',
    [I('Turmeric / Haridra','Dried rhizome','Curcuminoids, including curcumin, give the yellow colour. Biological activity does not establish that a kitchen powder treats a sprain.')],
    'Do not apply to broken skin or combine with unspecified lime. Stop if irritation occurs. A possible fracture, major swelling or inability to bear weight needs assessment. Review medicinal use with a clinician if taking blood thinners or with bile-duct disease.',
    {steps:powder('authenticated dried Curcuma longa rhizome'),batch:'Ingredient powder only; no medicinal dose or skin-application schedule.',
     editorial:'The source’s lime-containing paste is not reproduced: the type and safe preparation of lime are not sufficiently clear for DIY use.',extraLink:'turmeric'});
  add('lavanga','Lavanga','Clove-oil monograph','Dental','Syzygium aromaticum',
    'Source indication: toothache.',147,'149',
    [I('Clove oil','Oil from dried flower buds','Eugenol helps explain a local numbing effect. Symptom relief does not treat tooth decay or an abscess.')],
    'Undiluted oil may burn or irritate tissue; swallowing it can be harmful. Toothache needs dental assessment. Facial swelling, fever or difficulty swallowing require urgent care.',
    {reason:'The source concerns a concentrated oil, not a simple culinary infusion. No direct-application or dosing recipe is provided.'});
  add('gokshura','Gokshura','Fruit and plant monograph','Urinary health','Tribulus terrestris',
    'Source indication: urinary disorders.',151,'153–155',
    [I('Gokshura','Fruit or whole plant as described in the source','The source lists sterols and sapogenins. A traditional diuretic role does not establish treatment of infection, stones or obstruction.')],
    'Inability to pass urine requires urgent care. Blood in urine, fever with flank pain or symptoms during pregnancy need assessment. Do not assume broad historical safety statements are established.',
    {reason:'Different urinary problems need different treatments. This is a reference, not a recipe for self-treating infection or obstruction.'});
  add('ela','Ela','Cardamom-seed powder','Digestion','Elettaria cardamomum',
    'Traditional use: nausea and vomiting.',157,'159–161',
    [I('Cardamom / Ela','10 g seeds removed from dried pods','Volatile oils contribute aroma and flavour. This explains its aromatic role, not proof that it stops vomiting.')],
    'The source advises caution with gallstones. Repeated vomiting, dehydration, blood in vomit, severe pain or inability to keep fluids down requires assessment.',
    {steps:['Remove seeds from authenticated dried cardamom pods and weigh 10 g. This is a preparation batch, not a dose.','Grind the clean, dry seeds into a powder.','Use a metal sieve rather than absorbent cloth; the source notes this helps avoid loss of aromatic oil.','Keep in a clean, dry, airtight labelled container away from heat and light.'],
     batch:'10 g seed batch · not a serving size'});
  add('haridra-wound','Haridra','Wound-use safety reference','Skin','Curcuma longa',
    'Source indication: wounds. Do not apply nonsterile powder.',163,'165–167',
    [I('Turmeric / Haridra','Rhizome powder','Curcuminoids are characteristic constituents, but the presence of these compounds does not sterilize a powder or a wound.')],
    'Do not put kitchen turmeric or homemade herbal paste into an open wound. For minor cuts, use clean water and a clean dressing. Deep wounds, uncontrolled bleeding or infection need care.',
    {reason:'Nonsterile powder, washing and paste instructions from the historical source are omitted. A wound recipe must not delay proper cleaning or medical treatment.',extraLink:'wounds'});
  const conditions = {
    amalaki:'Acidity & gastritis', trikatu:'Common cold', daruharidra:'Conjunctivitis', haritaki:'Constipation',
    pippali:'Cough', kutaja:'Diarrhoea', lashuna:'Earache', shirisha:'Eczema', triphala:'Eye discharge',
    kiratatikta:'Fever', karanja:'Fungal skin disease', pippalimoola:'Headache', chaturbhadra:'Indigestion',
    katuka:'Jaundice', ajamoda:'Joint pain', lodhra:'Vaginal discharge', dhattura:'Head lice',
    ashvagandha:'Malaise & weakness', shatpushpa:'Painful menstruation', palasha:'Intestinal parasites',
    surana:'Haemorrhoids / piles', gandhaka:'Scabies', kapikacchu:'Sexual dysfunction',
    'haridra-sprain':'Sprain', lavanga:'Toothache', gokshura:'Urinary disorders', ela:'Nausea & vomiting',
    'haridra-wound':'Wounds'
  };
  const concerns = {
    'Acidity & gastritis':'Digestion', 'Common cold':'Cough & cold', 'Conjunctivitis':'Eyes & ears',
    'Constipation':'Digestion', 'Cough':'Cough & cold', 'Diarrhoea':'Digestion', 'Earache':'Eyes & ears',
    'Eczema':'Skin', 'Eye discharge':'Eyes & ears', 'Fever':'Fever', 'Fungal skin disease':'Skin',
    'Headache':'Pain', 'Indigestion':'Digestion', 'Jaundice':'Liver & yellowing', 'Joint pain':'Pain',
    'Vaginal discharge':'Reproductive health', 'Head lice':'Skin', 'Malaise & weakness':'General health',
    'Painful menstruation':'Reproductive health', 'Intestinal parasites':'Parasites', 'Haemorrhoids / piles':'Digestion',
    'Scabies':'Skin', 'Sexual dysfunction':'Reproductive health', 'Sprain':'Pain', 'Toothache':'Dental',
    'Urinary disorders':'Urinary health', 'Nausea & vomiting':'Digestion', 'Wounds':'Skin'
  };
  entries.forEach(e => { e.condition = conditions[e.id]; e.concern = concerns[e.condition]; });
  const extraPrep = {
    kutaja: powder('authenticated dried Holarrhena antidysenterica stem bark'),
    kiratatikta: powder('authenticated dried Swertia chirata whole plant'),
    katuka: powder('authenticated dried Picrorhiza kurroa roots and rhizomes'),
    palasha: powder('authenticated dried Butea monosperma seeds'),
    gokshura: powder('authenticated dried Tribulus terrestris plant material')
  };
  for (const [id, steps] of Object.entries(extraPrep)) {
    const e = entries.find(item => item.id === id);
    e.steps = steps;
    e.batch = 'Preparation notes only · no medicinal dose or administration schedule.';
    e.type = 'guide';
    e.reason = undefined;
  }
  const sourceIndex = [
    [1,'Blue Vervain','Mild cough','Respiratory',93],[2,'Holy Basil','Sore throat','Respiratory',93],[3,'Turmeric','Tummy ache','Digestion',93],
    [4,'Fennel','Hyperactivity','General health',94],[5,'Ginger','Focus & attention','General health',94],[6,'Catnip','Teething pain','Dental',94],
    [7,'Hawthorn','Focus & attention','General health',94],[8,'Peppermint','Sleep quality','General health',95],[9,'Garlic','Focus & attention','General health',95],
    [10,'Mullein','Focus & attention','General health',95],[11,'Turmeric','Fever','General health',96],[12,'Gotu Kola','Focus & attention','General health',96],
    [13,'Hawthorn','Sleep quality','General health',96],[14,"St. John's Wort",'Motion sickness','Digestion',97],[15,'Catnip','Immune health','General health',97],
    [16,'Red Clover','Mild colds','Respiratory',97],[17,"St. John's Wort",'Fever','General health',97],[18,'Meadowsweet','Digestion','Digestion',98],
    [19,'Marshmallow Root','Digestion','Digestion',98],[20,'Hibiscus','Immune health','General health',98],[21,'Cinnamon','Mild cough','Respiratory',99],
    [22,'Milk Thistle','Motion sickness','Digestion',99],[23,'Marshmallow Root','Teething pain','Dental',99],[24,'Lavender','Fever','General health',100],
    [25,'Calendula','Mild colds','Respiratory',100],[26,'Skullcap','Motion sickness','Digestion',100],[27,'Chamomile','Tummy ache','Digestion',100],
    [28,'Goldenseal','Tummy ache','Digestion',101],[29,'Licorice Root','Growing pains','Pain & movement',101],[30,'Cinnamon','Sore throat','Respiratory',101],
    [31,'Calendula','Hyperactivity','General health',102],[32,'Holy Basil','Growing pains','Pain & movement',102]
  ];
  for (const [number, herb, condition, category, page] of sourceIndex) {
    const concern = category === 'Respiratory' ? 'Cough & cold' : category === 'Dental' ? 'Dental' : category === 'Digestion' ? 'Digestion' : category === 'Pain & movement' ? 'Pain' : 'General health';
    entries.push({
      id:`source-${number}`, name:herb, form:'3,000 Remedies source-index entry', category, concern, condition,
      botanical:'Botanical identity not verified in the supplied collection', use:`Source claim: ${herb} for ${condition.toLowerCase()} in children.`,
      page, detailPages:String(page), catalog:true, type:'reference',
      ingredients:[I(herb,'Common name as printed in the source','The source names the herb, but this app has not verified species, plant part, preparation quality or a standardized product.')],
      safety:'This is an index claim, not a validated child treatment. No child dose is published. Do not use it to delay assessment or replace professional care; children can be harmed by herb–medicine interactions and misidentification.',
      reason:'The supplied collection repeats a generic child-preparation and dosing pattern without an adequate age- or weight-specific framework. This index preserves the ailment wording for search, but does not publish its administration instructions.',
      evidence:'This entry is transcribed as a source claim from the table of contents of the supplied 3,000-remedy PDF. It has not been clinically validated by Healthopedia.',
      sourceLabel:'3,000 Remedies · source index'
    });
  }
  const sourceHerbs = ['Angelica Root','Ashwagandha','Blue Vervain','Burdock Root','Calendula','Catnip','Chamomile','Cinnamon','Clove','Dandelion Root','Echinacea','Elderberry','Fennel','Garlic','Ginger','Goldenseal','Gotu Kola','Hawthorn','Hibiscus','Holy Basil','Lavender','Lemon Balm','Licorice Root','Marshmallow Root','Meadowsweet','Milk Thistle','Mullein','Nettle','Oregano','Peppermint','Red Clover','Rosemary','Sage','Skullcap','Slippery Elm',"St. John's Wort",'Thyme','Turmeric','Valerian','Yarrow'];
  const sourceConditions = ['bedtime anxiety','digestion','fever naturally','focus and attention','growing pains','hyperactivity','immune health','itchy skin','mild colds','mild cough','motion sickness','sleep quality','sore throat','teething pain','tummy aches'];
  const sourceConditionLabels = {
    'bedtime anxiety':'Bedtime anxiety', digestion:'Digestion', 'fever naturally':'Fever', 'focus and attention':'Focus & attention',
    'growing pains':'Growing pains', hyperactivity:'Hyperactivity', 'immune health':'Immune health', 'itchy skin':'Itchy skin',
    'mild colds':'Mild colds', 'mild cough':'Mild cough', 'motion sickness':'Motion sickness', 'sleep quality':'Sleep quality',
    'sore throat':'Sore throat', 'teething pain':'Teething pain', 'tummy aches':'Tummy ache'
  };
  const sourceConcern = condition => {
    if (condition.includes('cough') || condition.includes('cold') || condition.includes('throat')) return 'Cough & cold';
    if (condition.includes('teething')) return 'Dental';
    if (condition.includes('digestion') || condition.includes('tummy') || condition.includes('motion')) return 'Digestion';
    if (condition.includes('pain')) return 'Pain';
    if (condition.includes('itchy')) return 'Skin';
    if (condition.includes('fever')) return 'Fever';
    return 'General health';
  };
  const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  for (const condition of sourceConditions) {
    for (const herb of sourceHerbs) {
      const label = sourceConditionLabels[condition];
      entries.push({
        id:`matrix-${slug(herb)}-${slug(condition)}`, name:herb, form:'3,000 Remedies indexed source claim', category:sourceConcern(condition), concern:sourceConcern(condition), condition:label,
        botanical:'Botanical identity not verified in the supplied collection', use:`Source index claim: ${herb} is listed for ${condition} in children.`, page:93, detailPages:'93-1002', catalog:true, type:'reference',
        ingredients:[I(herb,'Common name as printed in the source','The complete table of contents names the herb, but species, plant part, preparation quality and product standardization have not been verified.')],
        safety:'This is an index claim, not a validated child treatment. No child dose is published. Do not use it to delay assessment or replace professional care; children can be harmed by herb-medicine interactions and misidentification.',
        reason:'The full table of contents was reviewed and this herb/ailment combination appears in the 3,000-entry index. The source uses repeated child-oriented instructions, but Healthopedia does not publish those doses or convert an index claim into a prescription.',
        evidence:'This ailment label is derived from the complete table of contents of the supplied 3,000-remedy PDF. Repetition in an index is not clinical evidence, and this entry has not been clinically validated by Healthopedia.',
        sourceLabel:'3,000 Remedies · source index', sourceClaim:`Full TOC coverage: ${herb} / ${label}; source entries are distributed across PDF pages 93-1002.`
      });
    }
  }
  entries.push({
    id:'matrix-chamomile-irritability-sleep', name:'Chamomile', form:'3,000 Remedies indexed source claim', category:'General health', concern:'General health', condition:'Irritability & sleep',
    botanical:'Botanical identity not verified in the supplied collection', use:'Source index claim: Chamomile for irritability and help with sleep in children.', page:1002, detailPages:'1002', catalog:true, type:'reference',
    ingredients:[I('Chamomile','Common name as printed in the source','The source names the herb but does not establish species, dose, preparation quality or clinical effectiveness.')],
    safety:'This is an index claim, not a validated child treatment. No child dose is published. Do not use it to delay assessment or replace professional care.',
    reason:'This final index entry is preserved as a source claim only. No recipe or pediatric administration instruction is published.',
    evidence:'The complete source index ends with this Chamomile listing on PDF page 1002. It has not been clinically validated by Healthopedia.',
    sourceLabel:'3,000 Remedies · source index', sourceClaim:'Full TOC entry 3000: Chamomile / irritability and help with sleep in children.'
  });
  return Object.freeze({links,entries,reviewDate:'15 September 2026'});
})();
