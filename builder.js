/* =========================================================
   STATE
   ========================================================= */
const state = {
  view: 'cv',               // cv | letter
  activeSection: 'personal',
  activeLetterSection: 'recipient',
  country: 'us',           // us | ca | fr
  style: { us:'classic', ca:'classic', fr:'classic' },
  letterStyle: 'classic',  // classic | modern | minimal — cover letter template
  letterTone: 'professional', // professional | enthusiastic | concise — starter draft tone
  theme: 'teal',
  photo: null,
  photoRaw: null,
  photoAdjust: { scale: 1, rotate: 0, x: 0, y: 0, grayscale: false },
  skillBankCategory: 'Marketing & Communications',
  personal: {
    firstName:'Code', lastName:'Nomad', jobTitle:'Marketing Manager',
    email:'codenomad213@gmail.com', phone:'+1 514 555 0134',
    phoneCountry:'us', phoneNumber:'514 555 0134',
    city:'Ghazala, Algeria', linkedin:'linkedin.com/in/sarahaddad', website:'',
    dob:'', dobISO:'', nationality:'Algerian', permis:'', maritalStatus:''
  },
  summary:'Proven results in digital marketing with 6 years of experience growing B2C brands. Strong skills in content strategy, team management, and data analysis.',
  experience:[
    {title:'Marketing Manager', company:'Nordik Studio', location:'Montreal, QC', start:'2022', end:'Present', current:true,
     bullets:['Led a team of 5 to grow organic traffic by 64% year over year','Managed a $400K annual budget across paid and organic channels','Launched 3 product campaigns that generated $1.2M in new revenue']},
    {title:'Marketing Coordinator', company:'Bleu Agency', location:'Montreal, QC', start:'2019', end:'2022', current:false,
     bullets:['Coordinated content calendars across 4 client accounts','Built reporting dashboards adopted company-wide']}
  ],
  education:[
    {degree:'B.A. in Business Administration, Marketing', school:'HEC Montréal', location:'Montreal, QC', start:'2015', end:'2019', details:''}
  ],
  skills:['Google Analytics','SEO/SEM','Content Strategy','Adobe Creative Suite','Team Leadership','Budget Management'],
  languages:[{name:'French', level:'Native'}, {name:'English', level:'Fluent'}],
  certifications:['Google Analytics Certified (2023)'],
  interests:['Photography','Trail running','Volunteering'],
  coverLetter: { companyName:'', hiringManager:'', date:'', opening:'', body:'', closing:'' }
};

const THEMES = {
  teal:{main:'#2E5959', soft:'#EAF1EF'},
  gold:{main:'#8A5A22', soft:'#F5EEE1'},
  wine:{main:'#7A2E33', soft:'#F5E7E7'},
  navy:{main:'#233A5E', soft:'#E8EDF5'},
  forest:{main:'#2F5233', soft:'#E9F0E7'},
  slate:{main:'#3B3F44', soft:'#EAEBEC'},
  coral:{main:'#B0503C', soft:'#F6E9E3'},
  plum:{main:'#5B3A5C', soft:'#EFE6EF'},
};

const COUNTRY_META = {
  us:{label:'American', flag:'🇺🇸', styles:{classic:'Traditional CV', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  ca:{label:'Canadian', flag:'🇨🇦', styles:{classic:'Traditional CV', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  uk:{label:'British', flag:'🇬🇧', styles:{classic:'Traditional CV', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  au:{label:'Australian', flag:'🇦🇺', styles:{classic:'Traditional CV', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  fr:{label:'French', flag:'🇫🇷', styles:{classic:'Traditional CV', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  de:{label:'German', flag:'🇩🇪', styles:{classic:'Traditional CV', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  es:{label:'Spanish', flag:'🇪🇸', styles:{classic:'Traditional CV', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  nl:{label:'Dutch', flag:'🇳🇱', styles:{classic:'Traditional CV', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  ar:{label:'Arabic', flag:'🇸🇦', styles:{classic:'Traditional CV', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  br:{label:'Brazilian', flag:'🇧🇷', styles:{classic:'Traditional CV', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  jp:{label:'Japanese', flag:'🇯🇵', styles:{classic:'Traditional CV (Rirekisho)', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  se:{label:'Nordic (Swedish)', flag:'🇸🇪', styles:{classic:'Traditional CV', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  it:{label:'Italian (Europass)', flag:'🇮🇹', styles:{classic:'Traditional CV (Europass)', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  in:{label:'Indian', flag:'🇮🇳', styles:{classic:'Traditional CV', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
  cn:{label:'Chinese', flag:'🇨🇳', styles:{classic:'Traditional CV', modern:'Modern CV', minimal:'Minimalist', creative:'Creative', compact:'Compact Two-Col'}},
};

/* ---------- Country tab bar: pinned tabs + "More" dropdown ---------- */
const PINNED_COUNTRIES = ['us','uk','fr','ar'];

// Search aliases per country: English country name + local-language name(s),
// so the "More" dropdown search matches either.
const COUNTRY_SEARCH_ALIASES = {
  us:'usa united states america',
  ca:'canada',
  uk:'united kingdom britain england',
  au:'australia',
  fr:'france français francais',
  de:'germany deutschland deutsch',
  es:'spain españa espanol español',
  nl:'netherlands holland nederlands',
  ar:'arabic عربي عربية',
  br:'brazil brasil português portugues',
  jp:'japan 日本 日本語 nihon',
  se:'sweden nordic svenska',
  it:'italy italia italiano europass',
  in:'india bharat',
  cn:'china 中文 中国 zhongwen',
};

let countryMoreOpen = false;
let countryMoreQuery = '';

/* ---------- Phone dial-code picker ---------- */
// Converts an ISO-3166 alpha-2 code into its flag emoji via regional
// indicator symbols (e.g. 'ca' -> 🇨🇦), so we don't have to hand-list flags.
function isoToFlag(iso2){
  return iso2.toUpperCase().replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

// [iso2, country name, dial code] — sorted alphabetically by name for search.
const DIAL_CODES = [
  ['af','Afghanistan','+93'],['al','Albania','+355'],['dz','Algeria','+213'],['ad','Andorra','+376'],
  ['ao','Angola','+244'],['ar','Argentina','+54'],['am','Armenia','+374'],['au','Australia','+61'],
  ['at','Austria','+43'],['az','Azerbaijan','+994'],['bs','Bahamas','+1'],['bh','Bahrain','+973'],
  ['bd','Bangladesh','+880'],['by','Belarus','+375'],['be','Belgium','+32'],['bz','Belize','+501'],
  ['bj','Benin','+229'],['bt','Bhutan','+975'],['bo','Bolivia','+591'],['ba','Bosnia and Herzegovina','+387'],
  ['bw','Botswana','+267'],['br','Brazil','+55'],['bn','Brunei','+673'],['bg','Bulgaria','+359'],
  ['bf','Burkina Faso','+226'],['bi','Burundi','+257'],['kh','Cambodia','+855'],['cm','Cameroon','+237'],
  ['ca','Canada','+1'],['cv','Cape Verde','+238'],['cf','Central African Republic','+236'],['td','Chad','+235'],
  ['cl','Chile','+56'],['cn','China','+86'],['co','Colombia','+57'],['km','Comoros','+269'],
  ['cd','Congo (DRC)','+243'],['cg','Congo (Republic)','+242'],['cr','Costa Rica','+506'],['hr','Croatia','+385'],
  ['cu','Cuba','+53'],['cy','Cyprus','+357'],['cz','Czech Republic','+420'],['dk','Denmark','+45'],
  ['dj','Djibouti','+253'],['do','Dominican Republic','+1'],['ec','Ecuador','+593'],['eg','Egypt','+20'],
  ['sv','El Salvador','+503'],['gq','Equatorial Guinea','+240'],['er','Eritrea','+291'],['ee','Estonia','+372'],
  ['sz','Eswatini','+268'],['et','Ethiopia','+251'],['fj','Fiji','+679'],['fi','Finland','+358'],
  ['fr','France','+33'],['ga','Gabon','+241'],['gm','Gambia','+220'],['ge','Georgia','+995'],
  ['de','Germany','+49'],['gh','Ghana','+233'],['gr','Greece','+30'],['gt','Guatemala','+502'],
  ['gn','Guinea','+224'],['gw','Guinea-Bissau','+245'],['gy','Guyana','+592'],['ht','Haiti','+509'],
  ['hn','Honduras','+504'],['hk','Hong Kong','+852'],['hu','Hungary','+36'],['is','Iceland','+354'],
  ['in','India','+91'],['id','Indonesia','+62'],['ir','Iran','+98'],['iq','Iraq','+964'],
  ['ie','Ireland','+353'],['il','Israel','+972'],['it','Italy','+39'],['ci','Ivory Coast','+225'],
  ['jm','Jamaica','+1'],['jp','Japan','+81'],['jo','Jordan','+962'],['kz','Kazakhstan','+7'],
  ['ke','Kenya','+254'],['kw','Kuwait','+965'],['kg','Kyrgyzstan','+996'],['la','Laos','+856'],
  ['lv','Latvia','+371'],['lb','Lebanon','+961'],['ls','Lesotho','+266'],['lr','Liberia','+231'],
  ['ly','Libya','+218'],['li','Liechtenstein','+423'],['lt','Lithuania','+370'],['lu','Luxembourg','+352'],
  ['mg','Madagascar','+261'],['mw','Malawi','+265'],['my','Malaysia','+60'],['mv','Maldives','+960'],
  ['ml','Mali','+223'],['mt','Malta','+356'],['mr','Mauritania','+222'],['mu','Mauritius','+230'],
  ['mx','Mexico','+52'],['md','Moldova','+373'],['mc','Monaco','+377'],['mn','Mongolia','+976'],
  ['me','Montenegro','+382'],['ma','Morocco','+212'],['mz','Mozambique','+258'],['mm','Myanmar','+95'],
  ['na','Namibia','+264'],['np','Nepal','+977'],['nl','Netherlands','+31'],['nz','New Zealand','+64'],
  ['ni','Nicaragua','+505'],['ne','Niger','+227'],['ng','Nigeria','+234'],['mk','North Macedonia','+389'],
  ['no','Norway','+47'],['om','Oman','+968'],['pk','Pakistan','+92'],['ps','Palestine','+970'],
  ['pa','Panama','+507'],['pg','Papua New Guinea','+675'],['py','Paraguay','+595'],['pe','Peru','+51'],
  ['ph','Philippines','+63'],['pl','Poland','+48'],['pt','Portugal','+351'],['qa','Qatar','+974'],
  ['ro','Romania','+40'],['ru','Russia','+7'],['rw','Rwanda','+250'],['sa','Saudi Arabia','+966'],
  ['sn','Senegal','+221'],['rs','Serbia','+381'],['sl','Sierra Leone','+232'],['sg','Singapore','+65'],
  ['sk','Slovakia','+421'],['si','Slovenia','+386'],['so','Somalia','+252'],['za','South Africa','+27'],
  ['kr','South Korea','+82'],['ss','South Sudan','+211'],['es','Spain','+34'],['lk','Sri Lanka','+94'],
  ['sd','Sudan','+249'],['se','Sweden','+46'],['ch','Switzerland','+41'],['sy','Syria','+963'],
  ['tw','Taiwan','+886'],['tj','Tajikistan','+992'],['tz','Tanzania','+255'],['th','Thailand','+66'],
  ['tg','Togo','+228'],['tt','Trinidad and Tobago','+1'],['tn','Tunisia','+216'],['tr','Turkey','+90'],
  ['tm','Turkmenistan','+993'],['ug','Uganda','+256'],['ua','Ukraine','+380'],['ae','United Arab Emirates','+971'],
  ['gb','United Kingdom','+44'],['us','United States','+1'],['uy','Uruguay','+598'],['uz','Uzbekistan','+998'],
  ['ve','Venezuela','+58'],['vn','Vietnam','+84'],['ye','Yemen','+967'],['zm','Zambia','+260'],
  ['zw','Zimbabwe','+263']
].map(([iso2,name,dial])=>({iso2,name,dial}));

let phoneCodeOpen = false;
let phoneCodeQuery = '';

// Recomposes state.personal.phone (the value every CV/letter template
// reads) from the selected dial code + the typed national number.
function updatePhoneComposite(){
  const meta = DIAL_CODES.find(c=>c.iso2===state.personal.phoneCountry);
  const code = meta ? meta.dial : '';
  state.personal.phone = [code, state.personal.phoneNumber].filter(Boolean).join(' ').trim();
}

/* ---------- Date of birth calendar picker ---------- */
let dobPickerOpen = false;
let dobViewYear = null;
let dobViewMonth = null; // 0-11
let dobPendingISO = null; // staged selection while the picker is open, applied on OK
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function parseDobISO(iso){
  if(!iso) return null;
  const parts = iso.split('-').map(Number);
  const y=parts[0], m=parts[1], d=parts[2];
  if(!y||!m||!d) return null;
  return new Date(y, m-1, d);
}

/* ---------- International CV guide text, per country ---------- */
const GUIDES = {
  us:'1 page, reverse-chronological order. No photo, no date of birth, no marital status. Focus on quantified achievements and keywords for ATS screening.',
  ca:'1–2 pages, similar to the US style. No photo. Federal or Quebec-based roles may expect a bilingual (English/French) version.',
  uk:'Usually 2 pages. No photo, no date of birth. Open with a short personal profile statement; references are typically listed as "available on request".',
  au:'2–3 pages is common. No photo or personal details like age/marital status. Add a short "key skills" summary near the top.',
  fr:'1 page is standard. A photo and sometimes date of birth are still common, though optional. Favor a sober, precise format ("CV à la française").',
  de:'Tabellarischer Lebenslauf: chronological, table-style. A photo and date of birth are commonly included; the CV is often signed and dated at the end.',
  es:'1–2 pages. A photo and sometimes date of birth / nationality are common. Chronological order is preferred by most recruiters.',
  nl:'1–2 pages, factual and concise. A photo is optional and increasingly less common in modern Dutch CVs.',
  ar:'Right-to-left layout, 1–2 pages. A photo, date of birth, nationality, and marital status are commonly included across the Middle East and North Africa. Many employers accept an Arabic CV alongside an English one.',
  br:'1–2 pages. A photo is common (though optional). Written in Portuguese for local roles; chronological order is standard.',
  jp:'Follows the standardized rirekisho (履歴書) format: a fixed table layout with photo, date of birth, and education/work history listed by year and month, plus a "reason for applying" field. A separate shokumu-keirekisho (職務経歴書) adds narrative detail for professional/mid-career roles.',
  se:'1–2 pages, plain and factual. Photos are increasingly uncommon. A short personal letter (personligt brev) is usually expected alongside the CV.',
  it:'The EU-standard Europass format is widely used and recognized across Italy and much of Europe. A photo is common though optional, in a compact 1–2 page layout.',
  in:'Typically 2 pages, written in English. A photo and personal details (date of birth, nationality, marital status) are commonly included; keep contact details prominent at the top.',
  cn:'1–2 pages, chronological. A photo, date of birth, and marital status are commonly included, following the standard 简历/履历表 convention.',
};

/* ---------- Skill suggestion bank, grouped by field ---------- */
const SKILL_BANK = {
  'Marketing & Communications': ['SEO/SEM','Content Strategy','Social Media Marketing','Google Analytics','Email Marketing','Brand Management','Copywriting','Market Research','Adobe Creative Suite','Campaign Management'],
  'Sales & Business': ['Negotiation','CRM (Salesforce)','Account Management','Lead Generation','Client Relations','Business Development','Sales Forecasting','Contract Negotiation'],
  'Technology & IT': ['JavaScript','Python','SQL','Cloud Computing (AWS/Azure)','Agile/Scrum','Git','API Development','Data Analysis','Cybersecurity Basics','DevOps'],
  'Design & Creative': ['UI/UX Design','Figma','Adobe Photoshop','Adobe Illustrator','Typography','Prototyping','Wireframing','Branding'],
  'Finance & Accounting': ['Financial Reporting','Advanced Excel','Budgeting & Forecasting','Bookkeeping','SAP','QuickBooks','Financial Analysis','Tax Preparation'],
  'Management & Leadership': ['Team Leadership','Project Management','Strategic Planning','Budget Management','Performance Coaching','Change Management','Cross-functional Collaboration'],
  'Customer Service': ['Customer Support','Conflict Resolution','Zendesk','Client Retention','Complaint Handling','Live Chat Support'],
  'Healthcare': ['Patient Care','Electronic Health Records (EHR)','HIPAA Compliance','Clinical Documentation','Medical Terminology'],
  'Education & Training': ['Curriculum Development','Classroom Management','Instructional Design','Public Speaking','Mentoring'],
};

/* ---------- Starter-draft tone options for the cover letter generator ---------- */
const LETTER_TONES = { professional:'Professional', enthusiastic:'Enthusiastic', concise:'Concise' };

/* ---------- Cover letter salutation / sign-off conventions, per country ---------- */
const LETTER_LOCALE = {
  us:{salutation:n=>`Dear ${n||'Hiring Manager'},`, closing:'Sincerely,'},
  ca:{salutation:n=>`Dear ${n||'Hiring Manager'},`, closing:'Sincerely,'},
  uk:{salutation:n=>`Dear ${n||'Hiring Manager'},`, closing:'Yours sincerely,'},
  au:{salutation:n=>`Dear ${n||'Hiring Manager'},`, closing:'Kind regards,'},
  fr:{salutation:n=>n?`Madame, Monsieur ${n},`:'Madame, Monsieur,', closing:'Cordialement,'},
  de:{salutation:n=>n?`Sehr geehrte(r) Frau/Herr ${n},`:'Sehr geehrte Damen und Herren,', closing:'Mit freundlichen Grüßen,'},
  es:{salutation:n=>n?`Estimado/a ${n}:`:'Estimado/a señor/a:', closing:'Atentamente,'},
  nl:{salutation:n=>n?`Geachte heer/mevrouw ${n},`:'Geachte heer/mevrouw,', closing:'Met vriendelijke groet,'},
  ar:{salutation:n=>n?`السيد(ة) ${n} المحترم(ة)،`:'السادة المحترمين،', closing:'وتفضلوا بقبول فائق الاحترام والتقدير،'},
  br:{salutation:n=>n?`Prezado(a) ${n},`:'Prezado(a) Recrutador(a),', closing:'Atenciosamente,'},
  jp:{salutation:n=>'拝啓', closing:'敬具'},
  se:{salutation:n=>n?`Bästa ${n},`:'Hej,', closing:'Med vänliga hälsningar,'},
  it:{salutation:n=>n?`Gentile ${n},`:'Gentile Selezionatore,', closing:'Cordiali saluti,'},
  in:{salutation:n=>`Dear ${n||'Hiring Manager'},`, closing:'Regards,'},
  cn:{salutation:n=>n?`尊敬的${n}：`:'尊敬的招聘经理：', closing:'此致\n敬礼'},
};

/* =========================================================
   FORM RENDERING
   ========================================================= */
function el(tag, attrs={}, children=[]){
  const e = document.createElement(tag);
  for(const k in attrs){
    if(k==='html'){ e.innerHTML = attrs[k]; }
    else if(k.startsWith('on')){ e.addEventListener(k.slice(2), attrs[k]); }
    else e.setAttribute(k, attrs[k]);
  }
  (Array.isArray(children)?children:[children]).forEach(c=>{ if(c) e.appendChild(typeof c==='string'?document.createTextNode(c):c); });
  return e;
}

function field(labelText, value, onInput, type='text', placeholder=''){
  const wrap = el('div',{class:'field'});
  wrap.appendChild(el('label',{},labelText));
  const input = type==='textarea' ? el('textarea',{placeholder}) : el('input',{type, placeholder});
  input.value = value || '';
  input.addEventListener('input', e=> onInput(e.target.value));
  wrap.appendChild(input);
  return wrap;
}

const CV_SECTIONS = [
  {key:'personal', icon:'👤', label:'Personal'},
  {key:'summary', icon:'📝', label:'Summary'},
  {key:'experience', icon:'💼', label:'Experience'},
  {key:'education', icon:'🎓', label:'Education'},
  {key:'skills', icon:'🛠️', label:'Skills'},
  {key:'languages', icon:'🌐', label:'Languages'},
  {key:'certifications', icon:'📜', label:'Certs'},
  {key:'interests', icon:'🎯', label:'Interests'},
  {key:'design', icon:'🎨', label:'Design'},
];
const LETTER_SECTIONS = [
  {key:'recipient', icon:'🏢', label:'Recipient'},
  {key:'content', icon:'✍️', label:'Content'},
  {key:'design', icon:'🎨', label:'Design'},
];

function buildSectionRail(){
  const rail = document.getElementById('sectionRail');
  rail.innerHTML = '';
  const sections = state.view === 'letter' ? LETTER_SECTIONS : CV_SECTIONS;
  const activeKey = state.view === 'letter' ? state.activeLetterSection : state.activeSection;
  sections.forEach(s=>{
    const btn = el('button',{
      class: activeKey===s.key ? 'active' : '',
      title: s.label,
      onclick:()=>{
        if(state.view==='letter') state.activeLetterSection = s.key;
        else state.activeSection = s.key;
        render();
      }
    });
    btn.appendChild(el('span',{}, s.icon));
    btn.appendChild(el('span',{class:'rail-label'}, s.label));
    rail.appendChild(btn);
  });
}

/* ---------- Phone field: dial-code picker + national number ---------- */
function buildPhoneField(){
  const wrap = el('div',{class:'field'});
  wrap.appendChild(el('label',{}, 'Phone'));
  const row = el('div',{class:'phone-row'});

  const current = DIAL_CODES.find(c=>c.iso2===state.personal.phoneCountry) || DIAL_CODES.find(c=>c.iso2==='us');
  const codeBtn = el('button',{
    type:'button', class:'phone-code-btn',
    'aria-expanded': phoneCodeOpen ? 'true' : 'false',
    onclick:(e)=>{ e.stopPropagation(); phoneCodeOpen = !phoneCodeOpen; phoneCodeQuery=''; render(); }
  }, [`${isoToFlag(current.iso2)} ${current.dial}`]);
  row.appendChild(codeBtn);

  const numInput = el('input',{type:'tel', placeholder:'514 555 0134'});
  numInput.value = state.personal.phoneNumber || '';
  numInput.addEventListener('input', e=>{
    state.personal.phoneNumber = e.target.value;
    updatePhoneComposite();
    refreshPreviewLive();
  });
  row.appendChild(numInput);
  wrap.appendChild(row);

  if(phoneCodeOpen){
    const panel = el('div',{id:'phoneCodePortal', class:'country-more-panel', onclick:(e)=>e.stopPropagation()});
    const searchInput = el('input',{type:'text', placeholder:'Search country…', class:'country-more-search-input'});
    searchInput.value = phoneCodeQuery;
    panel.appendChild(searchInput);
    const list = el('div',{class:'country-more-list'});
    panel.appendChild(list);
    searchInput.addEventListener('input', e=>{ phoneCodeQuery = e.target.value; renderPhoneCodeList(list); });
    renderPhoneCodeList(list);
    document.body.appendChild(panel);
    positionCountryMorePanel(codeBtn, panel);
    setTimeout(()=>{ searchInput.focus(); }, 0);
  }

  return wrap;
}

function renderPhoneCodeList(listEl){
  listEl.innerHTML = '';
  const q = phoneCodeQuery.trim().toLowerCase();
  const filtered = DIAL_CODES.filter(c=>{
    if(!q) return true;
    return (c.name+' '+c.dial+' '+c.iso2).toLowerCase().includes(q);
  });
  if(filtered.length===0){
    listEl.appendChild(el('div',{class:'country-more-empty'}, 'No matches'));
    return;
  }
  filtered.forEach(c=>{
    const item = el('button',{
      class:'country-more-item' + (state.personal.phoneCountry===c.iso2?' active':''),
      onclick:()=>{ state.personal.phoneCountry=c.iso2; phoneCodeOpen=false; updatePhoneComposite(); render(); }
    }, [`${isoToFlag(c.iso2)}  ${c.name}  ·  ${c.dial}`]);
    listEl.appendChild(item);
  });
}

/* ---------- Date of birth field: calendar picker ---------- */
function buildDobField(){
  const wrap = el('div',{class:'field'});
  wrap.appendChild(el('label',{}, 'Date of birth'));

  const btn = el('button',{
    type:'button', class:'dob-picker-btn' + (state.personal.dob ? '' : ' placeholder'),
    onclick:(e)=>{
      e.stopPropagation();
      if(!dobPickerOpen){
        const base = parseDobISO(state.personal.dobISO) || new Date(new Date().getFullYear()-25, 0, 1);
        dobViewYear = base.getFullYear();
        dobViewMonth = base.getMonth();
        dobPendingISO = state.personal.dobISO || null;
      }
      dobPickerOpen = !dobPickerOpen;
      render();
    }
  }, [state.personal.dob || 'Select date…']);
  wrap.appendChild(btn);

  if(dobPickerOpen){
    const panel = el('div',{id:'dobPickerPortal', class:'dob-picker-panel', onclick:(e)=>e.stopPropagation()});
    panel.appendChild(buildDobPickerHeader());
    panel.appendChild(buildDobPickerGrid());

    const footer = el('div',{class:'dob-picker-footer'});
    footer.appendChild(el('button',{type:'button', class:'dob-picker-clear', onclick:()=>{
      state.personal.dob=''; state.personal.dobISO=''; dobPendingISO=null; dobPickerOpen=false; refreshPreviewLive(); render();
    }}, 'Clear date'));
    footer.appendChild(el('button',{type:'button', class:'dob-picker-ok', onclick:()=>{
      if(dobPendingISO){
        const d = parseDobISO(dobPendingISO);
        state.personal.dobISO = dobPendingISO;
        state.personal.dob = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
      }
      dobPickerOpen = false;
      refreshPreviewLive();
      render();
    }}, 'OK'));
    panel.appendChild(footer);

    document.body.appendChild(panel);
    positionCountryMorePanel(btn, panel);
  }

  return wrap;
}

function buildDobPickerHeader(){
  const header = el('div',{class:'dob-picker-header'});
  header.appendChild(el('button',{type:'button', class:'dob-nav-btn', onclick:()=>{
    dobViewMonth--; if(dobViewMonth<0){ dobViewMonth=11; dobViewYear--; } render();
  }}, '‹'));

  const monthSelect = el('select',{class:'dob-select'});
  MONTH_NAMES.forEach((m,i)=>{
    const opt = el('option',{value:i}, m);
    if(i===dobViewMonth) opt.setAttribute('selected','selected');
    monthSelect.appendChild(opt);
  });
  monthSelect.addEventListener('change', e=>{ dobViewMonth = +e.target.value; render(); });
  header.appendChild(monthSelect);

  const yearSelect = el('select',{class:'dob-select'});
  const nowYear = new Date().getFullYear();
  for(let y=nowYear; y>=nowYear-100; y--){
    const opt = el('option',{value:y}, String(y));
    if(y===dobViewYear) opt.setAttribute('selected','selected');
    yearSelect.appendChild(opt);
  }
  yearSelect.addEventListener('change', e=>{ dobViewYear = +e.target.value; render(); });
  header.appendChild(yearSelect);

  header.appendChild(el('button',{type:'button', class:'dob-nav-btn', onclick:()=>{
    dobViewMonth++; if(dobViewMonth>11){ dobViewMonth=0; dobViewYear++; } render();
  }}, '›'));

  return header;
}

function buildDobPickerGrid(){
  const grid = el('div',{class:'dob-picker-grid'});
  ['Mo','Tu','We','Th','Fr','Sa','Su'].forEach(d=>{
    grid.appendChild(el('div',{class:'dob-dow'}, d));
  });

  const firstOfMonth = new Date(dobViewYear, dobViewMonth, 1);
  let startOffset = firstOfMonth.getDay() - 1; // JS: 0=Sun..6=Sat -> Monday-first offset
  if(startOffset < 0) startOffset = 6;
  const daysInMonth = new Date(dobViewYear, dobViewMonth+1, 0).getDate();

  const selected = parseDobISO(dobPendingISO);
  const today = new Date();

  for(let i=0;i<startOffset;i++){
    grid.appendChild(el('div',{class:'dob-day empty'}));
  }
  for(let d=1; d<=daysInMonth; d++){
    const isSelected = !!selected && selected.getFullYear()===dobViewYear && selected.getMonth()===dobViewMonth && selected.getDate()===d;
    const isFuture = new Date(dobViewYear,dobViewMonth,d) > today;
    const dayAttrs = {
      type:'button',
      class:'dob-day' + (isSelected?' selected':'') + (isFuture?' disabled':'')
    };
    if(!isFuture){
      dayAttrs.onclick = ()=>{
        dobPendingISO = `${dobViewYear}-${String(dobViewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        render();
      };
    }
    const dayBtn = el('button', dayAttrs, String(d));
    if(isFuture) dayBtn.setAttribute('disabled','disabled');
    grid.appendChild(dayBtn);
  }
  return grid;
}

function sectionCard(titleHtml){
  const card = el('div',{class:'section-card'});
  card.appendChild(el('div',{class:'panel-title'}, titleHtml));
  return card;
}

function buildFormPanel(){
  const panel = document.getElementById('formPanel');
  panel.innerHTML = '';

  if(state.view === 'letter'){
    const guideBox = el('div',{class:'guide-box'});
    guideBox.appendChild(el('div',{class:'guide-title'}, '✉️ Cover letter tips'));
    guideBox.appendChild(el('div',{}, 'Keep it to one page: one paragraph on why this role/company, one on your strongest relevant achievement, one closing with a call to action. The salutation and sign-off are always in English.'));
    panel.appendChild(guideBox);

    switch(state.activeLetterSection){
      case 'recipient': panel.appendChild(buildLetterRecipientSection()); break;
      case 'content': panel.appendChild(buildLetterContentSection()); break;
      case 'design': panel.appendChild(buildLetterDesignSection()); break;
    }
    return;
  }

  const guideBox = el('div',{class:'guide-box'});
  guideBox.appendChild(el('div',{class:'guide-title'}, COUNTRY_META[state.country].flag+' '+COUNTRY_META[state.country].label+' CV guide'));
  guideBox.appendChild(el('div',{}, GUIDES[state.country]));
  panel.appendChild(guideBox);

  switch(state.activeSection){
    case 'personal': panel.appendChild(buildPersonalSection()); break;
    case 'summary': panel.appendChild(buildSummarySection()); break;
    case 'experience': panel.appendChild(buildExperienceSection()); break;
    case 'education': panel.appendChild(buildEducationSection()); break;
    case 'skills': panel.appendChild(buildSkillsSection()); break;
    case 'languages': panel.appendChild(buildLanguagesSection()); break;
    case 'certifications': panel.appendChild(buildCertificationsSection()); break;
    case 'interests': panel.appendChild(buildInterestsSection()); break;
    case 'design': panel.appendChild(buildThemeSection()); break;
  }
}

function buildPersonalSection(){
  const usesPhoto = state.country === 'fr' || state.country === 'de' || state.country === 'es' || state.country === 'ar' || state.country === 'br' || state.country === 'jp' || state.country === 'it' || state.country === 'in' || state.country === 'cn';
  const card = sectionCard('👤 Personal Details');

  if(usesPhoto){
    const row = el('div',{class:'photo-row'});
    const prev = el('div',{class:'photo-preview'}, state.photo? el('img',{src:state.photo}) : 'No photo');
    prev.id='photoPreview';
    const lbl = el('label',{class:'file-btn'}, ['Choose photo', el('input',{type:'file', accept:'image/*', onchange:(e)=>{
      const f = e.target.files[0]; if(!f) return;
      const reader = new FileReader();
      reader.onload = ()=>{
        state.photoRaw = reader.result;
        state.photoAdjust = { scale:1, rotate:0, x:0, y:0, grayscale:false };
        bakePhoto();
        render();
      };
      reader.readAsDataURL(f);
    }})]);
    row.appendChild(prev); row.appendChild(lbl);
    card.appendChild(row);

    if(state.photoRaw){
      const adj = el('div',{class:'photo-adjust'});

      const btnRow = el('div',{class:'btn-row'});
      btnRow.appendChild(el('button',{class:'file-btn', type:'button', onclick:()=>{
        state.photoAdjust.rotate = (state.photoAdjust.rotate - 90 + 360) % 360; bakePhoto();
      }}, '⟲ Rotate left'));
      btnRow.appendChild(el('button',{class:'file-btn', type:'button', onclick:()=>{
        state.photoAdjust.rotate = (state.photoAdjust.rotate + 90) % 360; bakePhoto();
      }}, '⟳ Rotate right'));
      btnRow.appendChild(el('button',{class:'file-btn', type:'button', onclick:()=>{
        state.photoAdjust = { scale:1, rotate:0, x:0, y:0, grayscale:state.photoAdjust.grayscale }; bakePhoto(); render();
      }}, 'Reset'));
      adj.appendChild(btnRow);

      const zoomWrap = el('div',{class:'field'});
      zoomWrap.appendChild(el('label',{}, 'Zoom'));
      const zoomInput = el('input',{type:'range', min:'1', max:'2.5', step:'0.05'});
      zoomInput.value = state.photoAdjust.scale;
      zoomInput.addEventListener('input', e=>{ state.photoAdjust.scale = +e.target.value; bakePhoto(); });
      zoomWrap.appendChild(zoomInput);
      adj.appendChild(zoomWrap);

      const posRow = el('div',{class:'row2'});
      const xWrap = el('div',{class:'field'});
      xWrap.appendChild(el('label',{}, 'Move horizontally'));
      const xInput = el('input',{type:'range', min:'-80', max:'80', step:'2'});
      xInput.value = state.photoAdjust.x;
      xInput.addEventListener('input', e=>{ state.photoAdjust.x = +e.target.value; bakePhoto(); });
      xWrap.appendChild(xInput);
      const yWrap = el('div',{class:'field'});
      yWrap.appendChild(el('label',{}, 'Move vertically'));
      const yInput = el('input',{type:'range', min:'-80', max:'80', step:'2'});
      yInput.value = state.photoAdjust.y;
      yInput.addEventListener('input', e=>{ state.photoAdjust.y = +e.target.value; bakePhoto(); });
      yWrap.appendChild(yInput);
      posRow.appendChild(xWrap); posRow.appendChild(yWrap);
      adj.appendChild(posRow);

      const bwWrap = el('label',{class:'photo-check'});
      const bwCheck = el('input',{type:'checkbox'});
      bwCheck.checked = !!state.photoAdjust.grayscale;
      bwCheck.addEventListener('change', e=>{ state.photoAdjust.grayscale = e.target.checked; bakePhoto(); });
      bwWrap.appendChild(bwCheck);
      bwWrap.appendChild(document.createTextNode('Black & white photo'));
      adj.appendChild(bwWrap);

      card.appendChild(adj);
    }
  }

  const r1 = el('div',{class:'row2'});
  r1.appendChild(field('First name', state.personal.firstName, v=>{state.personal.firstName=v; refreshPreviewLive();}));
  r1.appendChild(field('Last name', state.personal.lastName, v=>{state.personal.lastName=v; refreshPreviewLive();}));
  card.appendChild(r1);

  card.appendChild(field('Job title', state.personal.jobTitle, v=>{state.personal.jobTitle=v; refreshPreviewLive();}));

  const r2 = el('div',{class:'row2'});
  r2.appendChild(field('Email', state.personal.email, v=>{state.personal.email=v; refreshPreviewLive();}));
  r2.appendChild(buildPhoneField());
  card.appendChild(r2);

  const r3 = el('div',{class:'row2'});
  r3.appendChild(field('City / Region', state.personal.city, v=>{state.personal.city=v; refreshPreviewLive();}));
  r3.appendChild(field('LinkedIn (optional)', state.personal.linkedin, v=>{state.personal.linkedin=v; refreshPreviewLive();}));
  card.appendChild(r3);

  if(usesPhoto){
    const r4 = el('div',{class:'row3'});
    r4.appendChild(buildDobField());
    r4.appendChild(field('Nationality', state.personal.nationality, v=>{state.personal.nationality=v; refreshPreviewLive();}, 'text', 'e.g. Moroccan'));
    r4.appendChild(field('Driving licence', state.personal.permis, v=>{state.personal.permis=v; refreshPreviewLive();}, 'text', 'e.g. Category B'));
    card.appendChild(r4);
    const r5 = el('div',{class:'row2'});
    r5.appendChild(field('Marital status (optional)', state.personal.maritalStatus, v=>{state.personal.maritalStatus=v; refreshPreviewLive();}, 'text', 'e.g. Single'));
    card.appendChild(r5);
  }

  return card;
}

function buildSummarySection(){
  const card = sectionCard('📝 Professional Summary');
  card.appendChild(field('Short summary (3-4 lines)', state.summary, v=>{state.summary=v; refreshPreviewLive();}, 'textarea'));
  return card;
}

function buildExperienceSection(){
  const card = sectionCard('💼 Work Experience');
  state.experience.forEach((job, idx)=>{
    const entry = el('div',{class:'entry'});
    entry.appendChild(el('button',{class:'entry-remove', onclick:()=>{ state.experience.splice(idx,1); render(); }}, '✕'));
    entry.appendChild(field('Job title', job.title, v=>{job.title=v; refreshPreviewLive();}));
    const r = el('div',{class:'row2'});
    r.appendChild(field('Company', job.company, v=>{job.company=v; refreshPreviewLive();}));
    r.appendChild(field('Location', job.location, v=>{job.location=v; refreshPreviewLive();}));
    entry.appendChild(r);
    const r2 = el('div',{class:'row2'});
    r2.appendChild(field('From (year)', job.start, v=>{job.start=v; refreshPreviewLive();}));
    r2.appendChild(field('To (year or Present)', job.end, v=>{job.end=v; refreshPreviewLive();}));
    entry.appendChild(r2);
    const bl = el('div',{class:'bullets-list'});
    bl.appendChild(el('label',{},'Achievements (one per line)'));
    const ta = el('textarea',{});
    ta.value = job.bullets.join('\n');
    ta.style.minHeight='90px';
    ta.addEventListener('input', e=>{ job.bullets = e.target.value.split('\n').filter(x=>x.trim().length); refreshPreviewLive(); });
    bl.appendChild(ta);
    entry.appendChild(bl);
    card.appendChild(entry);
  });
  card.appendChild(el('button',{class:'add-btn', onclick:()=>{
    state.experience.push({title:'', company:'', location:'', start:'', end:'', current:false, bullets:['']});
    render();
  }}, '+ Add experience'));
  return card;
}

function buildEducationSection(){
  const card = sectionCard('🎓 Education');
  state.education.forEach((ed, idx)=>{
    const entry = el('div',{class:'entry'});
    entry.appendChild(el('button',{class:'entry-remove', onclick:()=>{ state.education.splice(idx,1); render(); }}, '✕'));
    entry.appendChild(field('Degree / Field of study', ed.degree, v=>{ed.degree=v; refreshPreviewLive();}));
    const r = el('div',{class:'row2'});
    r.appendChild(field('Institution', ed.school, v=>{ed.school=v; refreshPreviewLive();}));
    r.appendChild(field('Location', ed.location, v=>{ed.location=v; refreshPreviewLive();}));
    entry.appendChild(r);
    const r2 = el('div',{class:'row2'});
    r2.appendChild(field('From (year)', ed.start, v=>{ed.start=v; refreshPreviewLive();}));
    r2.appendChild(field('To (year)', ed.end, v=>{ed.end=v; refreshPreviewLive();}));
    entry.appendChild(r2);
    card.appendChild(entry);
  });
  card.appendChild(el('button',{class:'add-btn', onclick:()=>{
    state.education.push({degree:'', school:'', location:'', start:'', end:'', details:''});
    render();
  }}, '+ Add education'));
  return card;
}

function buildSkillsSection(){
  const card = sectionCard('🛠️ Skills');
  const skillsTa = el('textarea',{});
  skillsTa.value = state.skills.join(', ');
  skillsTa.addEventListener('input', e=>{ state.skills = e.target.value.split(',').map(s=>s.trim()).filter(Boolean); refreshPreviewLive(); });
  card.appendChild(el('label',{}, 'Comma-separated'));
  card.appendChild(skillsTa);

  const bankWrap = el('div',{class:'skill-bank'});
  bankWrap.appendChild(el('label',{}, 'Suggested skills by field — click to add'));
  const catSelect = el('select',{});
  Object.keys(SKILL_BANK).forEach(cat=>{
    catSelect.appendChild(el('option',{value:cat}, cat));
  });
  catSelect.value = state.skillBankCategory;
  catSelect.addEventListener('change', e=>{ state.skillBankCategory = e.target.value; render(); });
  bankWrap.appendChild(catSelect);

  const chipsWrap = el('div',{class:'chip-suggest-wrap'});
  SKILL_BANK[state.skillBankCategory].forEach(sk=>{
    const already = state.skills.includes(sk);
    const chip = el('button',{
      type:'button',
      class:'chip-suggest'+(already?' added':''),
      onclick:()=>{
        if(state.skills.includes(sk)) state.skills = state.skills.filter(x=>x!==sk);
        else state.skills.push(sk);
        render();
      }
    }, (already?'✓ ':'+ ')+sk);
    chipsWrap.appendChild(chip);
  });
  bankWrap.appendChild(chipsWrap);
  card.appendChild(bankWrap);
  return card;
}

function buildLanguagesSection(){
  const card = sectionCard('🌐 Languages');
  state.languages.forEach((lg, idx)=>{
    const r = el('div',{class:'row2', style:'align-items:end; margin-bottom:8px;'});
    r.appendChild(field('Language', lg.name, v=>{lg.name=v; refreshPreviewLive();}));
    r.appendChild(field('Level', lg.level, v=>{lg.level=v; refreshPreviewLive();}));
    const wrap = el('div',{style:'display:flex; gap:6px; align-items:center;'});
    wrap.appendChild(r);
    wrap.appendChild(el('button',{class:'entry-remove', style:'position:static;', onclick:()=>{ state.languages.splice(idx,1); render(); }}, '✕'));
    card.appendChild(wrap);
  });
  card.appendChild(el('button',{class:'add-btn', onclick:()=>{ state.languages.push({name:'', level:''}); render(); }}, '+ Add language'));
  return card;
}

function buildCertificationsSection(){
  const card = sectionCard('📜 Certifications (optional)');
  const certTa = el('textarea',{});
  certTa.value = state.certifications.join('\n');
  certTa.addEventListener('input', e=>{ state.certifications = e.target.value.split('\n').filter(Boolean); refreshPreviewLive(); });
  card.appendChild(el('label',{}, 'One per line'));
  card.appendChild(certTa);
  return card;
}

function buildInterestsSection(){
  const card = sectionCard('🎯 Interests (optional)');
  const intTa = el('textarea',{});
  intTa.value = state.interests.join(', ');
  intTa.addEventListener('input', e=>{ state.interests = e.target.value.split(',').map(s=>s.trim()).filter(Boolean); refreshPreviewLive(); });
  card.appendChild(el('label',{}, 'Comma-separated'));
  card.appendChild(intTa);
  return card;
}

function buildThemeSection(){
  const card = sectionCard('🎨 Template Color');
  const sw = el('div',{class:'theme-swatches'});
  Object.keys(THEMES).forEach(key=>{
    const s = el('button',{class:'swatch'+(state.theme===key?' active':''), style:`background:${THEMES[key].main}`, onclick:()=>{ state.theme=key; render(); }});
    sw.appendChild(s);
  });
  card.appendChild(sw);
  return card;
}

/* =========================================================
   COVER LETTER FORM SECTIONS
   ========================================================= */
function buildLetterRecipientSection(){
  const card = sectionCard('🏢 Recipient & Date');
  const r1 = el('div',{class:'row2'});
  r1.appendChild(field('Company name', state.coverLetter.companyName, v=>{state.coverLetter.companyName=v; refreshPreviewLive();}));
  r1.appendChild(field('Hiring manager (optional)', state.coverLetter.hiringManager, v=>{state.coverLetter.hiringManager=v; refreshPreviewLive();}));
  card.appendChild(r1);
  card.appendChild(field('Date', state.coverLetter.date, v=>{state.coverLetter.date=v; refreshPreviewLive();}, 'text', 'e.g. September 2, 2026'));
  card.appendChild(el('button',{class:'file-btn', type:'button', onclick:()=>{
    state.coverLetter.date = new Date().toLocaleDateString(undefined,{year:'numeric', month:'long', day:'numeric'});
    render();
  }}, "Use today's date"));
  return card;
}

function buildLetterContentSection(){
  const card = sectionCard('✍️ Letter content');

  const toneRow = el('div',{class:'tone-tabs'});
  Object.keys(LETTER_TONES).forEach(key=>{
    const btn = el('button',{type:'button', class: state.letterTone===key?'active':'', onclick:()=>{ state.letterTone=key; render(); }}, LETTER_TONES[key]);
    toneRow.appendChild(btn);
  });
  card.appendChild(toneRow);

  card.appendChild(el('button',{class:'add-btn', type:'button', style:'margin-bottom:12px;', onclick:generateLetterDraft}, '✨ Insert starter draft'));
  card.appendChild(field('Opening paragraph', state.coverLetter.opening, v=>{state.coverLetter.opening=v; refreshPreviewLive();}, 'textarea'));
  card.appendChild(field('Body paragraph', state.coverLetter.body, v=>{state.coverLetter.body=v; refreshPreviewLive();}, 'textarea'));
  card.appendChild(field('Closing paragraph', state.coverLetter.closing, v=>{state.coverLetter.closing=v; refreshPreviewLive();}, 'textarea'));
  return card;
}

function buildLetterDesignSection(){
  const card = sectionCard('🎨 Letter Color');
  const sw = el('div',{class:'theme-swatches'});
  Object.keys(THEMES).forEach(key=>{
    const s = el('button',{class:'swatch'+(state.theme===key?' active':''), style:`background:${THEMES[key].main}`, onclick:()=>{ state.theme=key; render(); }});
    sw.appendChild(s);
  });
  card.appendChild(sw);
  return card;
}

// Fills opening/body/closing with a templated starter draft built from
// the CV data already entered (job title, top achievement, summary, skills).
// The wording varies by state.letterTone (professional | enthusiastic | concise).
function generateLetterDraft(){
  const p = state.personal;
  const company = state.coverLetter.companyName || 'your company';
  const role = p.jobTitle || 'this position';
  const topJob = state.experience[0];
  const topJobTitle = (topJob && topJob.title) || role;
  const topAchievement = topJob && topJob.bullets[0] ? topJob.bullets[0] : '';
  const achievementLower = topAchievement ? topAchievement.charAt(0).toLowerCase()+topAchievement.slice(1) : '';
  const topSkills = state.skills.slice(0,3).join(', ') || 'my field';
  const tone = state.letterTone || 'professional';

  if(tone === 'enthusiastic'){
    state.coverLetter.opening = `I was excited to see the ${role} opening at ${company} — it's exactly the kind of opportunity I've been hoping to find. My background in ${topJobTitle} has given me a real passion for this kind of work, and I'd love to bring that energy to your team.`;
    const achievementSentence = topAchievement ? `One highlight: ${achievementLower}.` : '';
    state.coverLetter.body = state.summary
      ? `${state.summary} ${achievementSentence}`.trim()
      : `I bring strong skills in ${topSkills}, and I'm always eager to take on new challenges. ${achievementSentence}`.trim();
    state.coverLetter.closing = `I'd love the chance to talk more about how I could contribute to ${company} — thank you so much for considering my application!`;
  } else if(tone === 'concise'){
    state.coverLetter.opening = `I'm applying for the ${role} position at ${company}. Background: ${topJobTitle}, with a track record of measurable results.`;
    state.coverLetter.body = topAchievement
      ? `Recent highlight: ${achievementLower}. Core strengths: ${topSkills}.`
      : `Core strengths: ${topSkills}.`;
    state.coverLetter.closing = `Happy to discuss further. Thank you for your consideration.`;
  } else {
    state.coverLetter.opening = `I am writing to express my interest in the ${role} position at ${company}. With a background in ${topJobTitle} and a track record of delivering measurable results, I believe I would be a strong addition to your team.`;
    const achievementSentence = topAchievement ? `For example, ${achievementLower}.` : '';
    state.coverLetter.body = state.summary
      ? `${state.summary} ${achievementSentence}`.trim()
      : `I bring strong skills in ${topSkills}, and a proven ability to deliver results. ${achievementSentence}`.trim();
    state.coverLetter.closing = `I would welcome the opportunity to discuss how my experience aligns with ${company}'s goals. Thank you for your time and consideration.`;
  }

  render();
}

/* =========================================================
   TOP CONTROLS
   ========================================================= */
function buildTopControls(){
  document.getElementById('brandTitle').textContent = state.view === 'letter' ? 'PioneerCV — Cover Letter' : 'PioneerCV';

  const vt = document.getElementById('viewTabs');
  vt.innerHTML = '';
  [['cv','📄 CV'], ['letter','✉️ Cover Letter']].forEach(([key,label])=>{
    const btn = el('button',{class: state.view===key?'active':'', onclick:()=>{ state.view=key; render(); }}, label);
    vt.appendChild(btn);
  });

  buildCountryTabs();

  const st = document.getElementById('styleTabs');
  st.innerHTML = '';
  if(state.view === 'letter'){
    Object.keys(COVER_LETTER_STYLES).forEach(key=>{
      const btn = el('button',{class: state.letterStyle===key?'active':'', onclick:()=>{ state.letterStyle=key; render(); }},
        [COVER_LETTER_STYLES[key]]);
      st.appendChild(btn);
    });
    document.getElementById('templateLabel').textContent =
      COUNTRY_META[state.country].label + ' — Cover Letter — ' + COVER_LETTER_STYLES[state.letterStyle];
    return;
  }

  const styles = COUNTRY_META[state.country].styles;
  Object.keys(styles).forEach(key=>{
    const btn = el('button',{class: state.style[state.country]===key?'active':'', onclick:()=>{ state.style[state.country]=key; render(); }},
      [styles[key]]);
    st.appendChild(btn);
  });

  document.getElementById('templateLabel').textContent =
    COUNTRY_META[state.country].label + ' — ' + styles[state.style[state.country]];
}

function buildCountryTabs(){
  const ct = document.getElementById('countryTabs');
  ct.innerHTML = '';

  // Any previous dropdown panel lives in document.body (portal, see below) —
  // always clear it before rebuilding so re-renders don't leave stale copies.
  const stalePanel = document.getElementById('countryMorePortal');
  if(stalePanel) stalePanel.remove();

  PINNED_COUNTRIES.forEach(key=>{
    const meta = COUNTRY_META[key];
    const btn = el('button',{class: state.country===key?'active':'', onclick:()=>{ state.country=key; countryMoreOpen=false; render(); }},
      [meta.flag+' '+meta.label]);
    ct.appendChild(btn);
  });

  const restKeys = Object.keys(COUNTRY_META).filter(k=>!PINNED_COUNTRIES.includes(k));
  const isRestActive = restKeys.includes(state.country);

  const moreWrap = el('div',{class:'country-more-wrap'});
  const moreBtn = el('button',{
    class:'country-more-btn' + (isRestActive ? ' active' : ''),
    'aria-expanded': countryMoreOpen ? 'true' : 'false',
    onclick:(e)=>{ e.stopPropagation(); countryMoreOpen = !countryMoreOpen; countryMoreQuery=''; render(); }
  }, isRestActive ? [COUNTRY_META[state.country].flag+' '+COUNTRY_META[state.country].label+' ▾'] : ['More ▾']);
  moreWrap.appendChild(moreBtn);
  ct.appendChild(moreWrap);

  if(countryMoreOpen){
    // Rendered into document.body (not inside .country-tabs) so it's never
    // clipped by the tab bar's horizontal scroll on narrow screens.
    const panel = el('div',{id:'countryMorePortal', class:'country-more-panel', onclick:(e)=>e.stopPropagation()});

    const searchInput = el('input',{type:'text', placeholder:'Search country…', class:'country-more-search-input'});
    searchInput.value = countryMoreQuery;
    panel.appendChild(searchInput);

    const list = el('div',{class:'country-more-list'});
    panel.appendChild(list);

    searchInput.addEventListener('input', e=>{
      countryMoreQuery = e.target.value;
      renderCountryMoreList(list, restKeys);
    });

    renderCountryMoreList(list, restKeys);
    document.body.appendChild(panel);
    positionCountryMorePanel(moreBtn, panel);
    setTimeout(()=>{ searchInput.focus(); }, 0);
  }
}

function positionCountryMorePanel(anchorBtn, panel){
  const rect = anchorBtn.getBoundingClientRect();
  const panelWidth = panel.offsetWidth || 250;
  const margin = 8;
  let left = rect.left;
  // Keep the panel within the viewport horizontally (RTL-agnostic: clamp both edges).
  left = Math.min(left, window.innerWidth - panelWidth - margin);
  left = Math.max(left, margin);
  panel.style.position = 'fixed';
  panel.style.top = (rect.bottom + margin) + 'px';
  panel.style.left = left + 'px';
}

function renderCountryMoreList(listEl, restKeys){
  listEl.innerHTML = '';
  const q = countryMoreQuery.trim().toLowerCase();
  const filtered = restKeys.filter(key=>{
    if(!q) return true;
    const meta = COUNTRY_META[key];
    const hay = (meta.label + ' ' + (COUNTRY_SEARCH_ALIASES[key]||'')).toLowerCase();
    return hay.includes(q);
  });
  if(filtered.length===0){
    listEl.appendChild(el('div',{class:'country-more-empty'}, 'No matches'));
    return;
  }
  filtered.forEach(key=>{
    const meta = COUNTRY_META[key];
    const item = el('button',{
      class:'country-more-item' + (state.country===key?' active':''),
      onclick:()=>{ state.country=key; countryMoreOpen=false; render(); }
    }, [meta.flag+' '+meta.label]);
    listEl.appendChild(item);
  });
}

let zoom = 0.7;
function setZoom(delta){
  zoom = Math.min(1, Math.max(0.28, +(zoom+delta).toFixed(2)));
  document.getElementById('paperWrap').style.transform = `scale(${zoom})`;
  document.getElementById('zoomLabel').textContent = Math.round(zoom*100)+'%';
}

// Fits the A4 preview to the available width of the preview panel —
// keeps the CV fully visible without horizontal scrolling on phones,
// tablets, notebooks, and very large (TV) screens alike.
const PAPER_WIDTH_PX = 794; // 210mm at 96dpi
function fitZoomToViewport(){
  const panel = document.getElementById('previewPanel') || document.querySelector('.preview-panel');
  if(!panel) return;
  const available = panel.clientWidth - 40; // side padding allowance
  if(available <= 0) return;
  const fitZoom = Math.min(1, Math.max(0.28, +(available / PAPER_WIDTH_PX).toFixed(2)));
  zoom = fitZoom;
  document.getElementById('paperWrap').style.transform = `scale(${zoom})`;
  document.getElementById('zoomLabel').textContent = Math.round(zoom*100)+'%';
}

let resizeTimer;
window.addEventListener('resize', ()=>{
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(fitZoomToViewport, 150);
});

/* =========================================================
   PHOTO ENHANCEMENT (rotate / zoom / reposition / B&W)
   Bakes state.photoRaw + state.photoAdjust into a square
   state.photo data URL used by all CV renderers.
   ========================================================= */
function bakePhoto(onDone){
  if(!state.photoRaw){ state.photo = null; if(onDone) onDone(); else refreshPreviewLive(); return; }
  const img = new Image();
  img.onload = ()=>{
    const size = 400;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.filter = state.photoAdjust.grayscale ? 'grayscale(100%)' : 'none';
    ctx.save();
    ctx.translate(size/2, size/2);
    ctx.rotate(state.photoAdjust.rotate * Math.PI/180);
    const baseScale = Math.max(size/img.width, size/img.height);
    const s = baseScale * state.photoAdjust.scale;
    const w = img.width*s, h = img.height*s;
    ctx.drawImage(img, -w/2 + state.photoAdjust.x, -h/2 + state.photoAdjust.y, w, h);
    ctx.restore();
    state.photo = canvas.toDataURL('image/jpeg', 0.92);
    if(onDone) onDone(); else refreshPreviewLive();
  };
  img.src = state.photoRaw;
}

// Lightweight refresh used on every keystroke and while dragging sliders:
// updates the photo preview + CV preview only, without rebuilding the
// whole form panel. Rebuilding the form panel on every keystroke would
// destroy and recreate the focused <input>/<textarea>, which is what was
// closing the on-screen keyboard after every typed or deleted character.
function refreshPreviewLive(){
  const prev = document.getElementById('photoPreview');
  if(prev){
    prev.innerHTML='';
    if(state.photo) prev.appendChild(el('img',{src:state.photo}));
    else prev.textContent='No photo';
  }
  const theme = THEMES[state.theme];
  const paperEl = document.getElementById('paper');
  if(paperEl){
    paperEl.innerHTML = state.view === 'letter'
      ? renderCoverLetter(theme)
      : RENDERERS[state.country][state.style[state.country]](theme);
    paperEl.setAttribute('dir', 'ltr'); // CV text is always English regardless of country
  }
}

/* =========================================================
   TEMPLATE RENDERERS
   ========================================================= */
function fullName(){ return `${state.personal.firstName} ${state.personal.lastName}`.trim(); }
function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function contactLine(items, sep){
  return items.filter(([icon,val])=>val).map(([icon,val])=>`${icon} ${esc(val)}`).join(sep);
}

function renderUS_classic(theme){
  const p = state.personal;
  return `
  <div style="font-family:'Source Serif 4', Georgia, serif; padding:38px 46px; color:#1c1c1c;">
    <div style="text-align:center; margin-bottom:14px;">
      <div style="font-family:'Fraunces',serif; font-size:26px; font-weight:600; letter-spacing:.5px;">${esc(fullName()).toUpperCase()}</div>
      <div style="font-size:13px; color:#444; margin-top:2px;">${esc(p.jobTitle)}</div>
      <div style="font-size:11px; color:#555; margin-top:6px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '  |  ')}
      </div>
    </div>
    <hr style="border:none; border-top:1.5px solid ${theme.main}; margin:14px 0 16px;">

    ${state.summary?`<div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">SUMMARY</div>
      <div style="font-size:12.5px; line-height:1.55; color:#2a2a2a;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">PROFESSIONAL EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:11px;">
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="font-weight:700;">${esc(job.title)}${job.company? ' · '+esc(job.company):''}</span>
            <span style="font-size:11.5px; color:#555;">${esc(job.start)} – ${esc(job.end)}</span>
          </div>
          <div style="font-size:11.5px; color:#666; font-style:italic; margin-bottom:4px;">${esc(job.location)}</div>
          <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.55; color:#2a2a2a;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
          <span><b>${esc(ed.degree)}</b> — ${esc(ed.school)}, ${esc(ed.location)}</span>
          <span style="color:#555; font-size:11.5px;">${esc(ed.start)} – ${esc(ed.end)}</span>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:34px;">
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">SKILLS</div>
        <div style="font-size:12px; line-height:1.6; color:#2a2a2a;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.6; color:#2a2a2a;">${state.languages.map(l=>`${esc(l.name)} (${esc(l.level)})`).join(' · ')}</div>
      </div>
    </div>
    ${state.certifications.length?`<div style="margin-top:14px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">CERTIFICATIONS</div>
      <div style="font-size:12px; line-height:1.6;">${state.certifications.map(esc).join(' · ')}</div>
    </div>`:''}
  </div>`;
}

function renderUS_modern(theme){
  const p = state.personal;
  return `
  <div style="font-family:'Inter', sans-serif; display:flex; min-height:297mm;">
    <div style="width:34%; background:${theme.main}; color:#fff; padding:36px 26px;">
      <div style="font-size:22px; font-weight:700; line-height:1.25; font-family:'Fraunces',serif;">${esc(fullName())}</div>
      <div style="font-size:12.5px; opacity:.85; margin-top:4px; margin-bottom:22px;">${esc(p.jobTitle)}</div>

      <div style="font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">CONTACT</div>
      <div style="font-size:11.5px; line-height:1.9; margin-bottom:22px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '<br>')}
      </div>

      <div style="font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">SKILLS</div>
      <div style="font-size:11.5px; line-height:2;">
        ${state.skills.map(s=>`<div>• ${esc(s)}</div>`).join('')}
      </div>

      <div style="font-size:11px; letter-spacing:1px; opacity:.7; margin:22px 0 8px;">LANGUAGES</div>
      <div style="font-size:11.5px; line-height:1.9;">
        ${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}
      </div>
    </div>
    <div style="flex:1; padding:36px 30px; color:#1c1c1c;">
      ${state.summary?`<div style="margin-bottom:18px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">SUMMARY</div>
        <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
      </div>`:''}

      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:10px;">EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:14px; border-inline-start:2px solid ${theme.soft}; padding-inline-start:12px;">
          <div style="font-weight:700; font-size:13px;">${esc(job.title)}</div>
          <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.company)} · ${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
          <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.55;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}

      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="font-size:12.5px; margin-bottom:6px;">
          <b>${esc(ed.degree)}</b><br><span style="color:#555;">${esc(ed.school)}, ${esc(ed.location)} · ${esc(ed.start)}–${esc(ed.end)}</span>
        </div>`).join('')}

      ${state.certifications.length?`<div style="margin-top:14px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">CERTIFICATIONS</div>
        <div style="font-size:12px; line-height:1.6;">${state.certifications.map(esc).join(' · ')}</div>
      </div>`:''}
    </div>
  </div>`;
}

function renderCA_classic(theme){
  // Similar convention to US (no photo) with bilingual section hints
  const p = state.personal;
  return `
  <div style="font-family:'Inter', sans-serif; padding:40px 46px; color:#1c1c1c;">
    <div style="border-bottom:3px solid ${theme.main}; padding-bottom:14px; margin-bottom:18px;">
      <div style="font-size:25px; font-weight:700; font-family:'Fraunces',serif;">${esc(fullName())}</div>
      <div style="font-size:13px; color:${theme.main}; font-weight:600; margin-top:2px;">${esc(p.jobTitle)}</div>
      <div style="font-size:11.5px; color:#555; margin-top:6px;">${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '   •   ')}</div>
    </div>

    ${state.summary?`<div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFILE / PROFIL</div>
      <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">WORK EXPERIENCE / EXPÉRIENCE PROFESSIONNELLE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700;">
            <span>${esc(job.title)} — ${esc(job.company)}</span>
            <span style="font-size:11.5px; color:#555; font-weight:400;">${esc(job.start)} – ${esc(job.end)}</span>
          </div>
          <div style="font-size:11.5px; color:#666; margin-bottom:4px;">${esc(job.location)}</div>
          <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.55;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">EDUCATION / FORMATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
          <span><b>${esc(ed.degree)}</b> — ${esc(ed.school)}, ${esc(ed.location)}</span>
          <span style="color:#555; font-size:11.5px;">${esc(ed.start)}–${esc(ed.end)}</span>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:34px;">
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:6px;">SKILLS / COMPÉTENCES</div>
        <div style="font-size:12px; line-height:1.6;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:6px;">LANGUAGES / LANGUES</div>
        <div style="font-size:12px; line-height:1.6;">${state.languages.map(l=>`${esc(l.name)} (${esc(l.level)})`).join(' · ')}</div>
      </div>
    </div>
  </div>`;
}

function renderCA_modern(theme){
  const p = state.personal;
  return `
  <div style="font-family:'Inter', sans-serif; padding:0;">
    <div style="background:${theme.soft}; padding:32px 46px; border-bottom:4px solid ${theme.main};">
      <div style="font-size:26px; font-weight:700; font-family:'Fraunces',serif; color:${theme.main};">${esc(fullName())}</div>
      <div style="font-size:13px; color:#333; margin-top:2px;">${esc(p.jobTitle)}</div>
      <div style="font-size:11.5px; color:#555; margin-top:8px;">${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '   •   ')}</div>
    </div>
    <div style="padding:26px 46px;">
      ${state.summary?`<div style="margin-bottom:16px;">
        <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFILE</div>
        <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
      </div>`:''}
      <div style="display:grid; grid-template-columns:2.1fr 1fr; gap:28px;">
        <div>
          <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">EXPERIENCE</div>
          ${state.experience.map(job=>`
            <div style="margin-bottom:12px;">
              <div style="font-size:13px; font-weight:700;">${esc(job.title)}</div>
              <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.company)} · ${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
              <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.55;">
                ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
              </ul>
            </div>`).join('')}
          <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION</div>
          ${state.education.map(ed=>`
            <div style="font-size:12.5px; margin-bottom:6px;"><b>${esc(ed.degree)}</b> — ${esc(ed.school)}, ${esc(ed.location)} (${esc(ed.start)}–${esc(ed.end)})</div>`).join('')}
        </div>
        <div>
          <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">SKILLS</div>
          <div style="font-size:12px; line-height:1.8; margin-bottom:16px;">${state.skills.map(s=>`<div>${esc(s)}</div>`).join('')}</div>
          <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">LANGUAGES</div>
          <div style="font-size:12px; line-height:1.8;">${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}</div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderFR_classic(theme){
  const p = state.personal;
  const civil = [
    p.dob?`Born ${esc(p.dob)}`:'',
    p.nationality?`Nationality ${esc(p.nationality)}`:'',
    p.permis?esc(p.permis):''
  ].filter(Boolean).join(' · ');
  return `
  <div style="font-family:'Source Serif 4', Georgia, serif; padding:40px 46px; color:#1c1c1c;">
    <div style="display:flex; gap:22px; align-items:center; border-bottom:2px solid ${theme.main}; padding-bottom:16px; margin-bottom:18px;">
      <div style="width:78px; height:78px; border-radius:50%; overflow:hidden; background:${theme.soft}; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; color:#888;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
      <div>
        <div style="font-size:24px; font-weight:600; font-family:'Fraunces',serif;">${esc(fullName())}</div>
        <div style="font-size:13px; color:${theme.main}; margin-top:2px;">${esc(p.jobTitle)}</div>
        <div style="font-size:11px; color:#555; margin-top:6px;">${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city]], ' · ')}</div>
        ${civil?`<div style="font-size:10.5px; color:#777; margin-top:3px;">${civil}</div>`:''}
      </div>
    </div>

    ${state.summary?`<div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">PROFILE</div>
      <div style="font-size:12.5px; line-height:1.6;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">PROFESSIONAL EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600;">
            <span>${esc(job.title)}, ${esc(job.company)}</span>
            <span style="font-size:11.5px; color:#555; font-weight:400;">${esc(job.start)} – ${esc(job.end)}</span>
          </div>
          <div style="font-size:11.5px; color:#666; font-style:italic; margin-bottom:4px;">${esc(job.location)}</div>
          <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.6;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
          <span><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)}</span>
          <span style="color:#555; font-size:11.5px;">${esc(ed.start)}–${esc(ed.end)}</span>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:30px; margin-bottom:14px;">
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">SKILLS</div>
        <div style="font-size:12px; line-height:1.6;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.6;">${state.languages.map(l=>`${esc(l.name)} : ${esc(l.level)}`).join(' · ')}</div>
      </div>
    </div>
    ${state.interests.length?`<div>
      <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">INTERESTS</div>
      <div style="font-size:12px; line-height:1.6;">${state.interests.map(esc).join(' · ')}</div>
    </div>`:''}
  </div>`;
}

function renderFR_modern(theme){
  const p = state.personal;
  const civil = [
    p.dob?`Born ${esc(p.dob)}`:'',
    p.nationality?`${esc(p.nationality)}`:'',
    p.permis?esc(p.permis):''
  ].filter(Boolean);
  return `
  <div style="font-family:'Inter', sans-serif; display:flex; min-height:297mm;">
    <div style="width:32%; background:${theme.main}; color:#fff; padding:34px 24px; text-align:center;">
      <div style="width:96px; height:96px; border-radius:50%; overflow:hidden; margin:0 auto 14px; background:rgba(255,255,255,.15); display:flex; align-items:center; justify-content:center; font-size:11px;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
      <div style="font-size:19px; font-weight:700; font-family:'Fraunces',serif;">${esc(fullName())}</div>
      <div style="font-size:12px; opacity:.85; margin-top:4px; margin-bottom:20px;">${esc(p.jobTitle)}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">CONTACT</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city]], '<br>')}
      </div>
      ${civil.length?`<div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">PERSONAL DETAILS</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">${civil.join('<br>')}</div>`:''}

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">SKILLS</div>
      <div style="text-align:start; font-size:11px; line-height:2;">${state.skills.map(s=>`<div>• ${esc(s)}</div>`).join('')}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin:20px 0 8px;">LANGUAGES</div>
      <div style="text-align:start; font-size:11px; line-height:1.9;">${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}</div>
    </div>
    <div style="flex:1; padding:34px 30px; color:#1c1c1c;">
      ${state.summary?`<div style="margin-bottom:16px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFILE</div>
        <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
      </div>`:''}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:10px;">PROFESSIONAL EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:14px; border-inline-start:2px solid ${theme.soft}; padding-inline-start:12px;">
          <div style="font-weight:700; font-size:13px;">${esc(job.title)}, ${esc(job.company)}</div>
          <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
          <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.55;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="font-size:12.5px; margin-bottom:6px;"><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)} (${esc(ed.start)}–${esc(ed.end)})</div>`).join('')}
      ${state.interests.length?`<div style="margin-top:14px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">INTERESTS</div>
        <div style="font-size:12px; line-height:1.6;">${state.interests.map(esc).join(' · ')}</div>
      </div>`:''}
    </div>
  </div>`;
}

function renderUK_classic(theme){
  const p = state.personal;
  return `
  <div style="font-family:'Source Serif 4', Georgia, serif; padding:38px 46px; color:#1c1c1c;">
    <div style="margin-bottom:14px;">
      <div style="font-family:'Fraunces',serif; font-size:26px; font-weight:600;">${esc(fullName())}</div>
      <div style="font-size:13px; color:#444; margin-top:2px;">${esc(p.jobTitle)}</div>
      <div style="font-size:11px; color:#555; margin-top:6px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '  |  ')}
      </div>
    </div>
    <hr style="border:none; border-top:1.5px solid ${theme.main}; margin:14px 0 16px;">

    ${state.summary?`<div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">PERSONAL STATEMENT</div>
      <div style="font-size:12.5px; line-height:1.55; color:#2a2a2a;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">EMPLOYMENT HISTORY</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:11px;">
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="font-weight:700;">${esc(job.title)}${job.company? ', '+esc(job.company):''}</span>
            <span style="font-size:11.5px; color:#555;">${esc(job.start)} – ${esc(job.end)}</span>
          </div>
          <div style="font-size:11.5px; color:#666; font-style:italic; margin-bottom:4px;">${esc(job.location)}</div>
          <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.55; color:#2a2a2a;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
          <span><b>${esc(ed.degree)}</b> — ${esc(ed.school)}, ${esc(ed.location)}</span>
          <span style="color:#555; font-size:11.5px;">${esc(ed.start)} – ${esc(ed.end)}</span>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:34px; margin-bottom:16px;">
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">KEY SKILLS</div>
        <div style="font-size:12px; line-height:1.6; color:#2a2a2a;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.6; color:#2a2a2a;">${state.languages.map(l=>`${esc(l.name)} (${esc(l.level)})`).join(' · ')}</div>
      </div>
    </div>
    ${state.certifications.length?`<div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">ADDITIONAL INFORMATION</div>
      <div style="font-size:12px; line-height:1.6;">${state.certifications.map(esc).join(' · ')}</div>
    </div>`:''}
    <div style="font-size:11.5px; color:#777; border-top:1px solid #e6e2d5; padding-top:10px;">References available upon request.</div>
  </div>`;
}

function renderUK_modern(theme){
  const p = state.personal;
  return `
  <div style="font-family:'Inter', sans-serif; display:flex; min-height:297mm;">
    <div style="width:34%; background:${theme.main}; color:#fff; padding:36px 26px;">
      <div style="font-size:22px; font-weight:700; line-height:1.25; font-family:'Fraunces',serif;">${esc(fullName())}</div>
      <div style="font-size:12.5px; opacity:.85; margin-top:4px; margin-bottom:22px;">${esc(p.jobTitle)}</div>

      <div style="font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">CONTACT</div>
      <div style="font-size:11.5px; line-height:1.9; margin-bottom:22px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '<br>')}
      </div>

      <div style="font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">KEY SKILLS</div>
      <div style="font-size:11.5px; line-height:2;">
        ${state.skills.map(s=>`<div>• ${esc(s)}</div>`).join('')}
      </div>

      <div style="font-size:11px; letter-spacing:1px; opacity:.7; margin:22px 0 8px;">LANGUAGES</div>
      <div style="font-size:11.5px; line-height:1.9;">
        ${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}
      </div>
    </div>
    <div style="flex:1; padding:36px 30px; color:#1c1c1c;">
      ${state.summary?`<div style="margin-bottom:18px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PERSONAL STATEMENT</div>
        <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
      </div>`:''}

      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:10px;">EMPLOYMENT HISTORY</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:14px; border-inline-start:2px solid ${theme.soft}; padding-inline-start:12px;">
          <div style="font-weight:700; font-size:13px;">${esc(job.title)}</div>
          <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.company)} · ${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
          <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.55;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}

      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="font-size:12.5px; margin-bottom:6px;">
          <b>${esc(ed.degree)}</b><br><span style="color:#555;">${esc(ed.school)}, ${esc(ed.location)} · ${esc(ed.start)}–${esc(ed.end)}</span>
        </div>`).join('')}

      <div style="font-size:11.5px; color:#777; border-top:1px solid #e6e2d5; margin-top:14px; padding-top:10px;">References available upon request.</div>
    </div>
  </div>`;
}

function renderDE_classic(theme){
  const p = state.personal;
  const civilRows = [
    ['Date of birth', p.dob],
    ['Nationality', p.nationality],
    ['Marital status', p.maritalStatus],
    ['Driving licence', p.permis],
  ].filter(r=>r[1]);
  return `
  <div style="font-family:'Source Serif 4', Georgia, serif; padding:38px 46px; color:#1c1c1c;">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid ${theme.main}; padding-bottom:16px; margin-bottom:18px;">
      <div>
        <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">CURRICULUM VITAE</div>
        <div style="font-size:24px; font-weight:600; font-family:'Fraunces',serif;">${esc(fullName())}</div>
        <div style="font-size:13px; color:#444; margin-top:2px;">${esc(p.jobTitle)}</div>
      </div>
      <div style="width:76px; height:76px; border-radius:4px; overflow:hidden; background:${theme.soft}; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; color:#888;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
    </div>

    <div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">PERSONAL DETAILS</div>
      <table style="font-size:12px; width:100%; border-collapse:collapse;">
        <tr><td style="width:150px; color:#666; padding:2px 0;">📧 Email</td><td>${esc(p.email)}</td></tr>
        <tr><td style="color:#666; padding:2px 0;">📞 Phone</td><td>${esc(p.phone)}</td></tr>
        <tr><td style="color:#666; padding:2px 0;">📍 Address</td><td>${esc(p.city)}</td></tr>
        ${civilRows.map(([k,v])=>`<tr><td style="color:#666; padding:2px 0;">${k}</td><td>${esc(v)}</td></tr>`).join('')}
      </table>
    </div>

    ${state.summary?`<div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">PROFILE</div>
      <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">PROFESSIONAL EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="display:flex; gap:16px; margin-bottom:12px;">
          <div style="width:110px; flex-shrink:0; font-size:11.5px; color:#555;">${esc(job.start)} – ${esc(job.end)}</div>
          <div>
            <div style="font-size:13px; font-weight:700;">${esc(job.title)}, ${esc(job.company)}</div>
            <div style="font-size:11.5px; color:#666; font-style:italic; margin-bottom:4px;">${esc(job.location)}</div>
            <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.55;">
              ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
            </ul>
          </div>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; gap:16px; margin-bottom:8px;">
          <div style="width:110px; flex-shrink:0; font-size:11.5px; color:#555;">${esc(ed.start)} – ${esc(ed.end)}</div>
          <div style="font-size:12.5px;"><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)}</div>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:34px;">
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">SKILLS</div>
        <div style="font-size:12px; line-height:1.6;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.6;">${state.languages.map(l=>`${esc(l.name)}: ${esc(l.level)}`).join(' · ')}</div>
      </div>
    </div>
  </div>`;
}

function renderDE_modern(theme){
  const p = state.personal;
  const civilRows = [
    ['Date of birth', p.dob],
    ['Nationality', p.nationality],
    ['Marital status', p.maritalStatus],
    ['Driving licence', p.permis],
  ].filter(r=>r[1]);
  return `
  <div style="font-family:'Inter', sans-serif; display:flex; min-height:297mm;">
    <div style="width:32%; background:${theme.main}; color:#fff; padding:34px 24px; text-align:center;">
      <div style="width:96px; height:96px; border-radius:4px; overflow:hidden; margin:0 auto 14px; background:rgba(255,255,255,.15); display:flex; align-items:center; justify-content:center; font-size:11px;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
      <div style="font-size:19px; font-weight:700; font-family:'Fraunces',serif;">${esc(fullName())}</div>
      <div style="font-size:12px; opacity:.85; margin-top:4px; margin-bottom:20px;">${esc(p.jobTitle)}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">CONTACT</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city]], '<br>')}
      </div>
      ${civilRows.length?`<div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">PERSONAL DETAILS</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">${civilRows.map(([k,v])=>`${k}: ${esc(v)}`).join('<br>')}</div>`:''}

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">SKILLS</div>
      <div style="text-align:start; font-size:11px; line-height:2;">${state.skills.map(s=>`<div>• ${esc(s)}</div>`).join('')}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin:20px 0 8px;">LANGUAGES</div>
      <div style="text-align:start; font-size:11px; line-height:1.9;">${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}</div>
    </div>
    <div style="flex:1; padding:34px 30px; color:#1c1c1c;">
      ${state.summary?`<div style="margin-bottom:16px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFILE</div>
        <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
      </div>`:''}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:10px;">PROFESSIONAL EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:14px; border-inline-start:2px solid ${theme.soft}; padding-inline-start:12px;">
          <div style="font-weight:700; font-size:13px;">${esc(job.title)}, ${esc(job.company)}</div>
          <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
          <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.55;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="font-size:12.5px; margin-bottom:6px;"><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)} (${esc(ed.start)}–${esc(ed.end)})</div>`).join('')}
    </div>
  </div>`;
}

function renderAU_classic(theme){
  const p = state.personal;
  return `
  <div style="font-family:'Source Serif 4', Georgia, serif; padding:38px 46px; color:#1c1c1c;">
    <div style="margin-bottom:14px;">
      <div style="font-family:'Fraunces',serif; font-size:26px; font-weight:600;">${esc(fullName())}</div>
      <div style="font-size:13px; color:#444; margin-top:2px;">${esc(p.jobTitle)}</div>
      <div style="font-size:11px; color:#555; margin-top:6px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '  |  ')}
      </div>
    </div>
    <hr style="border:none; border-top:1.5px solid ${theme.main}; margin:14px 0 16px;">

    ${state.summary?`<div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">CAREER SUMMARY</div>
      <div style="font-size:12.5px; line-height:1.55; color:#2a2a2a;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">EMPLOYMENT HISTORY</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:11px;">
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="font-weight:700;">${esc(job.title)}${job.company? ', '+esc(job.company):''}</span>
            <span style="font-size:11.5px; color:#555;">${esc(job.start)} – ${esc(job.end)}</span>
          </div>
          <div style="font-size:11.5px; color:#666; font-style:italic; margin-bottom:4px;">${esc(job.location)}</div>
          <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.55; color:#2a2a2a;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
          <span><b>${esc(ed.degree)}</b> — ${esc(ed.school)}, ${esc(ed.location)}</span>
          <span style="color:#555; font-size:11.5px;">${esc(ed.start)} – ${esc(ed.end)}</span>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:34px; margin-bottom:16px;">
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">KEY SKILLS</div>
        <div style="font-size:12px; line-height:1.6; color:#2a2a2a;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.6; color:#2a2a2a;">${state.languages.map(l=>`${esc(l.name)} (${esc(l.level)})`).join(' · ')}</div>
      </div>
    </div>
    <div style="font-size:11.5px; color:#777; border-top:1px solid #e6e2d5; padding-top:10px;">Referees available on request.</div>
  </div>`;
}

function renderAU_modern(theme){
  const p = state.personal;
  return `
  <div style="font-family:'Inter', sans-serif; display:flex; min-height:297mm;">
    <div style="width:34%; background:${theme.main}; color:#fff; padding:36px 26px;">
      <div style="font-size:22px; font-weight:700; line-height:1.25; font-family:'Fraunces',serif;">${esc(fullName())}</div>
      <div style="font-size:12.5px; opacity:.85; margin-top:4px; margin-bottom:22px;">${esc(p.jobTitle)}</div>

      <div style="font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">CONTACT</div>
      <div style="font-size:11.5px; line-height:1.9; margin-bottom:22px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '<br>')}
      </div>

      <div style="font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">KEY SKILLS</div>
      <div style="font-size:11.5px; line-height:2;">
        ${state.skills.map(s=>`<div>• ${esc(s)}</div>`).join('')}
      </div>

      <div style="font-size:11px; letter-spacing:1px; opacity:.7; margin:22px 0 8px;">LANGUAGES</div>
      <div style="font-size:11.5px; line-height:1.9;">
        ${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}
      </div>
    </div>
    <div style="flex:1; padding:36px 30px; color:#1c1c1c;">
      ${state.summary?`<div style="margin-bottom:18px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">CAREER SUMMARY</div>
        <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
      </div>`:''}

      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:10px;">EMPLOYMENT HISTORY</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:14px; border-inline-start:2px solid ${theme.soft}; padding-inline-start:12px;">
          <div style="font-weight:700; font-size:13px;">${esc(job.title)}</div>
          <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.company)} · ${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
          <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.55;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}

      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="font-size:12.5px; margin-bottom:6px;">
          <b>${esc(ed.degree)}</b><br><span style="color:#555;">${esc(ed.school)}, ${esc(ed.location)} · ${esc(ed.start)}–${esc(ed.end)}</span>
        </div>`).join('')}

      <div style="font-size:11.5px; color:#777; border-top:1px solid #e6e2d5; margin-top:14px; padding-top:10px;">Referees available on request.</div>
    </div>
  </div>`;
}

function renderES_classic(theme){
  const p = state.personal;
  const datos = [
    p.dob?`Date of birth: ${esc(p.dob)}`:'',
    p.nationality?`Nationality: ${esc(p.nationality)}`:'',
    p.permis?`Driving licence: ${esc(p.permis)}`:''
  ].filter(Boolean).join(' · ');
  return `
  <div style="font-family:'Source Serif 4', Georgia, serif; padding:40px 46px; color:#1c1c1c;">
    <div style="display:flex; gap:22px; align-items:center; border-bottom:2px solid ${theme.main}; padding-bottom:16px; margin-bottom:18px;">
      <div style="width:78px; height:78px; border-radius:50%; overflow:hidden; background:${theme.soft}; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; color:#888;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
      <div>
        <div style="font-size:24px; font-weight:600; font-family:'Fraunces',serif;">${esc(fullName())}</div>
        <div style="font-size:13px; color:${theme.main}; margin-top:2px;">${esc(p.jobTitle)}</div>
        <div style="font-size:11px; color:#555; margin-top:6px;">${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city]], ' · ')}</div>
        ${datos?`<div style="font-size:10.5px; color:#777; margin-top:3px;">${datos}</div>`:''}
      </div>
    </div>

    ${state.summary?`<div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">PROFESSIONAL PROFILE</div>
      <div style="font-size:12.5px; line-height:1.6;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">WORK EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600;">
            <span>${esc(job.title)}, ${esc(job.company)}</span>
            <span style="font-size:11.5px; color:#555; font-weight:400;">${esc(job.start)} – ${esc(job.end)}</span>
          </div>
          <div style="font-size:11.5px; color:#666; font-style:italic; margin-bottom:4px;">${esc(job.location)}</div>
          <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.6;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
          <span><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)}</span>
          <span style="color:#555; font-size:11.5px;">${esc(ed.start)}–${esc(ed.end)}</span>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:30px; margin-bottom:14px;">
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">SKILLS</div>
        <div style="font-size:12px; line-height:1.6;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.6;">${state.languages.map(l=>`${esc(l.name)}: ${esc(l.level)}`).join(' · ')}</div>
      </div>
    </div>
    ${state.interests.length?`<div>
      <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">INTERESTS</div>
      <div style="font-size:12px; line-height:1.6;">${state.interests.map(esc).join(' · ')}</div>
    </div>`:''}
  </div>`;
}

function renderES_modern(theme){
  const p = state.personal;
  const datos = [
    p.dob?esc(p.dob):'', p.nationality?esc(p.nationality):'', p.permis?esc(p.permis):''
  ].filter(Boolean);
  return `
  <div style="font-family:'Inter', sans-serif; display:flex; min-height:297mm;">
    <div style="width:32%; background:${theme.main}; color:#fff; padding:34px 24px; text-align:center;">
      <div style="width:96px; height:96px; border-radius:50%; overflow:hidden; margin:0 auto 14px; background:rgba(255,255,255,.15); display:flex; align-items:center; justify-content:center; font-size:11px;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
      <div style="font-size:19px; font-weight:700; font-family:'Fraunces',serif;">${esc(fullName())}</div>
      <div style="font-size:12px; opacity:.85; margin-top:4px; margin-bottom:20px;">${esc(p.jobTitle)}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">CONTACT</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city]], '<br>')}
      </div>
      ${datos.length?`<div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">PERSONAL DETAILS</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">${datos.join('<br>')}</div>`:''}

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">SKILLS</div>
      <div style="text-align:start; font-size:11px; line-height:2;">${state.skills.map(s=>`<div>• ${esc(s)}</div>`).join('')}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin:20px 0 8px;">LANGUAGES</div>
      <div style="text-align:start; font-size:11px; line-height:1.9;">${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}</div>
    </div>
    <div style="flex:1; padding:34px 30px; color:#1c1c1c;">
      ${state.summary?`<div style="margin-bottom:16px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFESSIONAL PROFILE</div>
        <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
      </div>`:''}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:10px;">WORK EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:14px; border-inline-start:2px solid ${theme.soft}; padding-inline-start:12px;">
          <div style="font-weight:700; font-size:13px;">${esc(job.title)}, ${esc(job.company)}</div>
          <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
          <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.55;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="font-size:12.5px; margin-bottom:6px;"><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)} (${esc(ed.start)}–${esc(ed.end)})</div>`).join('')}
      ${state.interests.length?`<div style="margin-top:14px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">INTERESTS</div>
        <div style="font-size:12px; line-height:1.6;">${state.interests.map(esc).join(' · ')}</div>
      </div>`:''}
    </div>
  </div>`;
}

function renderNL_classic(theme){
  const p = state.personal;
  return `
  <div style="font-family:'Inter', sans-serif; padding:40px 46px; color:#1c1c1c;">
    <div style="border-bottom:3px solid ${theme.main}; padding-bottom:14px; margin-bottom:18px;">
      <div style="font-size:25px; font-weight:700; font-family:'Fraunces',serif;">${esc(fullName())}</div>
      <div style="font-size:13px; color:${theme.main}; font-weight:600; margin-top:2px;">${esc(p.jobTitle)}</div>
      <div style="font-size:11.5px; color:#555; margin-top:6px;">${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '   •   ')}</div>
    </div>

    ${state.summary?`<div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFILE</div>
      <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">WORK EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700;">
            <span>${esc(job.title)} — ${esc(job.company)}</span>
            <span style="font-size:11.5px; color:#555; font-weight:400;">${esc(job.start)} – ${esc(job.end)}</span>
          </div>
          <div style="font-size:11.5px; color:#666; margin-bottom:4px;">${esc(job.location)}</div>
          <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.55;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
          <span><b>${esc(ed.degree)}</b> — ${esc(ed.school)}, ${esc(ed.location)}</span>
          <span style="color:#555; font-size:11.5px;">${esc(ed.start)}–${esc(ed.end)}</span>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:34px;">
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:6px;">SKILLS</div>
        <div style="font-size:12px; line-height:1.6;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:6px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.6;">${state.languages.map(l=>`${esc(l.name)} (${esc(l.level)})`).join(' · ')}</div>
      </div>
    </div>
  </div>`;
}

function renderNL_modern(theme){
  const p = state.personal;
  return `
  <div style="font-family:'Inter', sans-serif; padding:0;">
    <div style="background:${theme.soft}; padding:32px 46px; border-bottom:4px solid ${theme.main};">
      <div style="font-size:26px; font-weight:700; font-family:'Fraunces',serif; color:${theme.main};">${esc(fullName())}</div>
      <div style="font-size:13px; color:#333; margin-top:2px;">${esc(p.jobTitle)}</div>
      <div style="font-size:11.5px; color:#555; margin-top:8px;">${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '   •   ')}</div>
    </div>
    <div style="padding:26px 46px;">
      ${state.summary?`<div style="margin-bottom:16px;">
        <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFILE</div>
        <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
      </div>`:''}
      <div style="display:grid; grid-template-columns:2.1fr 1fr; gap:28px;">
        <div>
          <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">WORK EXPERIENCE</div>
          ${state.experience.map(job=>`
            <div style="margin-bottom:12px;">
              <div style="font-size:13px; font-weight:700;">${esc(job.title)}</div>
              <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.company)} · ${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
              <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.55;">
                ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
              </ul>
            </div>`).join('')}
          <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION</div>
          ${state.education.map(ed=>`
            <div style="font-size:12.5px; margin-bottom:6px;"><b>${esc(ed.degree)}</b> — ${esc(ed.school)}, ${esc(ed.location)} (${esc(ed.start)}–${esc(ed.end)})</div>`).join('')}
        </div>
        <div>
          <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">SKILLS</div>
          <div style="font-size:12px; line-height:1.8; margin-bottom:16px;">${state.skills.map(s=>`<div>${esc(s)}</div>`).join('')}</div>
          <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">LANGUAGES</div>
          <div style="font-size:12px; line-height:1.8;">${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}</div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------- Arabic (RTL) — classic table style, similar convention to DE/FR/ES ---------- */
function renderAR_classic(theme){
  const p = state.personal;
  const civilRows = [
    ['Date of birth', p.dob],
    ['Nationality', p.nationality],
    ['Marital status', p.maritalStatus],
    ['Driving licence', p.permis],
  ].filter(r=>r[1]);
  return `
  <div dir="ltr" style="font-family:'Cairo','Tajawal', sans-serif; padding:38px 46px; color:#1c1c1c;">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid ${theme.main}; padding-bottom:16px; margin-bottom:18px;">
      <div>
        <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">CURRICULUM VITAE</div>
        <div style="font-size:24px; font-weight:700; font-family:'Cairo',sans-serif;">${esc(fullName())}</div>
        <div style="font-size:13px; color:#444; margin-top:2px;">${esc(p.jobTitle)}</div>
      </div>
      <div style="width:76px; height:76px; border-radius:4px; overflow:hidden; background:${theme.soft}; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; color:#888;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
    </div>

    <div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">PERSONAL DETAILS</div>
      <table style="font-size:12px; width:100%; border-collapse:collapse;">
        <tr><td style="width:150px; color:#666; padding:2px 0;">📧 Email</td><td>${esc(p.email)}</td></tr>
        <tr><td style="color:#666; padding:2px 0;">📞 Phone</td><td>${esc(p.phone)}</td></tr>
        <tr><td style="color:#666; padding:2px 0;">📍 City</td><td>${esc(p.city)}</td></tr>
        ${civilRows.map(([k,v])=>`<tr><td style="color:#666; padding:2px 0;">${k}</td><td>${esc(v)}</td></tr>`).join('')}
      </table>
    </div>

    ${state.summary?`<div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">PROFESSIONAL SUMMARY</div>
      <div style="font-size:12.5px; line-height:1.7;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">WORK EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="display:flex; gap:16px; margin-bottom:12px;">
          <div style="width:110px; flex-shrink:0; font-size:11.5px; color:#555;">${esc(job.start)} – ${esc(job.end)}</div>
          <div>
            <div style="font-size:13px; font-weight:700;">${esc(job.title)}, ${esc(job.company)}</div>
            <div style="font-size:11.5px; color:#666; font-style:italic; margin-bottom:4px;">${esc(job.location)}</div>
            <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.7;">
              ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
            </ul>
          </div>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; gap:16px; margin-bottom:8px;">
          <div style="width:110px; flex-shrink:0; font-size:11.5px; color:#555;">${esc(ed.start)} – ${esc(ed.end)}</div>
          <div style="font-size:12.5px;"><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)}</div>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:34px;">
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">SKILLS</div>
        <div style="font-size:12px; line-height:1.7;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.7;">${state.languages.map(l=>`${esc(l.name)}: ${esc(l.level)}`).join(' · ')}</div>
      </div>
    </div>
    ${state.certifications.length?`<div style="margin-top:14px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">CERTIFICATIONS</div>
      <div style="font-size:12px; line-height:1.7;">${state.certifications.map(esc).join(' · ')}</div>
    </div>`:''}
    ${state.interests.length?`<div style="margin-top:14px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">INTERESTS</div>
      <div style="font-size:12px; line-height:1.7;">${state.interests.map(esc).join(' · ')}</div>
    </div>`:''}
  </div>`;
}

/* ---------- Arabic (RTL) — modern sidebar style ---------- */
function renderAR_modern(theme){
  const p = state.personal;
  const civil = [
    p.dob?`Date of birth: ${esc(p.dob)}`:'',
    p.nationality?`Nationality: ${esc(p.nationality)}`:'',
    p.maritalStatus?`Marital status: ${esc(p.maritalStatus)}`:'',
    p.permis?`Driving licence: ${esc(p.permis)}`:''
  ].filter(Boolean);
  return `
  <div dir="ltr" style="font-family:'Cairo','Tajawal', sans-serif; display:flex; min-height:297mm;">
    <div style="width:32%; background:${theme.main}; color:#fff; padding:34px 24px; text-align:center;">
      <div style="width:96px; height:96px; border-radius:50%; overflow:hidden; margin:0 auto 14px; background:rgba(255,255,255,.15); display:flex; align-items:center; justify-content:center; font-size:11px;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
      <div style="font-size:19px; font-weight:700;">${esc(fullName())}</div>
      <div style="font-size:12px; opacity:.85; margin-top:4px; margin-bottom:20px;">${esc(p.jobTitle)}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:.5px; opacity:.7; margin-bottom:8px;">CONTACT</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city]], '<br>')}
      </div>
      ${civil.length?`<div style="text-align:start; font-size:11px; letter-spacing:.5px; opacity:.7; margin-bottom:8px;">PERSONAL DETAILS</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">${civil.join('<br>')}</div>`:''}

      <div style="text-align:start; font-size:11px; letter-spacing:.5px; opacity:.7; margin-bottom:8px;">SKILLS</div>
      <div style="text-align:start; font-size:11px; line-height:2;">${state.skills.map(s=>`<div>• ${esc(s)}</div>`).join('')}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:.5px; opacity:.7; margin:20px 0 8px;">LANGUAGES</div>
      <div style="text-align:start; font-size:11px; line-height:1.9;">${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}</div>
    </div>
    <div style="flex:1; padding:34px 30px; color:#1c1c1c;">
      ${state.summary?`<div style="margin-bottom:16px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFESSIONAL SUMMARY</div>
        <div style="font-size:12.5px; line-height:1.65;">${esc(state.summary)}</div>
      </div>`:''}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:10px;">WORK EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:14px; border-inline-start:2px solid ${theme.soft}; padding-inline-start:12px;">
          <div style="font-weight:700; font-size:13px;">${esc(job.title)}, ${esc(job.company)}</div>
          <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
          <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.6;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="font-size:12.5px; margin-bottom:6px;"><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)} (${esc(ed.start)}–${esc(ed.end)})</div>`).join('')}
      ${state.interests.length?`<div style="margin-top:14px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">INTERESTS</div>
        <div style="font-size:12px; line-height:1.7;">${state.interests.map(esc).join(' · ')}</div>
      </div>`:''}
    </div>
  </div>`;
}

/* ---------- Brazilian / Portuguese ---------- */
function renderBR_classic(theme){
  const p = state.personal;
  const dados = [
    p.dob?`Date of birth: ${esc(p.dob)}`:'',
    p.nationality?`Nationality: ${esc(p.nationality)}`:'',
    p.permis?`Driving licence: ${esc(p.permis)}`:''
  ].filter(Boolean).join(' · ');
  return `
  <div style="font-family:'Source Serif 4', Georgia, serif; padding:40px 46px; color:#1c1c1c;">
    <div style="display:flex; gap:22px; align-items:center; border-bottom:2px solid ${theme.main}; padding-bottom:16px; margin-bottom:18px;">
      <div style="width:78px; height:78px; border-radius:50%; overflow:hidden; background:${theme.soft}; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; color:#888;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
      <div>
        <div style="font-size:24px; font-weight:600; font-family:'Fraunces',serif;">${esc(fullName())}</div>
        <div style="font-size:13px; color:${theme.main}; margin-top:2px;">${esc(p.jobTitle)}</div>
        <div style="font-size:11px; color:#555; margin-top:6px;">${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city]], ' · ')}</div>
        ${dados?`<div style="font-size:10.5px; color:#777; margin-top:3px;">${dados}</div>`:''}
      </div>
    </div>

    ${state.summary?`<div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">PROFESSIONAL SUMMARY</div>
      <div style="font-size:12.5px; line-height:1.6;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">PROFESSIONAL EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600;">
            <span>${esc(job.title)}, ${esc(job.company)}</span>
            <span style="font-size:11.5px; color:#555; font-weight:400;">${esc(job.start)} – ${esc(job.end)}</span>
          </div>
          <div style="font-size:11.5px; color:#666; font-style:italic; margin-bottom:4px;">${esc(job.location)}</div>
          <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.6;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:16px;">
      <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
          <span><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)}</span>
          <span style="color:#555; font-size:11.5px;">${esc(ed.start)}–${esc(ed.end)}</span>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:30px; margin-bottom:14px;">
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">SKILLS</div>
        <div style="font-size:12px; line-height:1.6;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.6;">${state.languages.map(l=>`${esc(l.name)}: ${esc(l.level)}`).join(' · ')}</div>
      </div>
    </div>
    ${state.interests.length?`<div>
      <div style="font-size:12.5px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">INTERESTS</div>
      <div style="font-size:12px; line-height:1.6;">${state.interests.map(esc).join(' · ')}</div>
    </div>`:''}
  </div>`;
}

function renderBR_modern(theme){
  const p = state.personal;
  const dados = [
    p.dob?esc(p.dob):'', p.nationality?esc(p.nationality):'', p.permis?esc(p.permis):''
  ].filter(Boolean);
  return `
  <div style="font-family:'Inter', sans-serif; display:flex; min-height:297mm;">
    <div style="width:32%; background:${theme.main}; color:#fff; padding:34px 24px; text-align:center;">
      <div style="width:96px; height:96px; border-radius:50%; overflow:hidden; margin:0 auto 14px; background:rgba(255,255,255,.15); display:flex; align-items:center; justify-content:center; font-size:11px;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
      <div style="font-size:19px; font-weight:700; font-family:'Fraunces',serif;">${esc(fullName())}</div>
      <div style="font-size:12px; opacity:.85; margin-top:4px; margin-bottom:20px;">${esc(p.jobTitle)}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">CONTACT</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city]], '<br>')}
      </div>
      ${dados.length?`<div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">PERSONAL DETAILS</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">${dados.join('<br>')}</div>`:''}

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">SKILLS</div>
      <div style="text-align:start; font-size:11px; line-height:2;">${state.skills.map(s=>`<div>• ${esc(s)}</div>`).join('')}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin:20px 0 8px;">LANGUAGES</div>
      <div style="text-align:start; font-size:11px; line-height:1.9;">${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}</div>
    </div>
    <div style="flex:1; padding:34px 30px; color:#1c1c1c;">
      ${state.summary?`<div style="margin-bottom:16px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFESSIONAL SUMMARY</div>
        <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
      </div>`:''}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:10px;">PROFESSIONAL EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:14px; border-inline-start:2px solid ${theme.soft}; padding-inline-start:12px;">
          <div style="font-weight:700; font-size:13px;">${esc(job.title)}, ${esc(job.company)}</div>
          <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
          <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.55;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="font-size:12.5px; margin-bottom:6px;"><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)} (${esc(ed.start)}–${esc(ed.end)})</div>`).join('')}
      ${state.interests.length?`<div style="margin-top:14px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">INTERESTS</div>
        <div style="font-size:12px; line-height:1.6;">${state.interests.map(esc).join(' · ')}</div>
      </div>`:''}
    </div>
  </div>`;
}

/* ---------- Nordic / Swedish — plain, no photo ---------- */
function renderSE_classic(theme){
  const p = state.personal;
  return `
  <div style="font-family:'Source Serif 4', Georgia, serif; padding:38px 46px; color:#1c1c1c;">
    <div style="margin-bottom:14px;">
      <div style="font-family:'Fraunces',serif; font-size:26px; font-weight:600;">${esc(fullName())}</div>
      <div style="font-size:13px; color:#444; margin-top:2px;">${esc(p.jobTitle)}</div>
      <div style="font-size:11px; color:#555; margin-top:6px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '  |  ')}
      </div>
    </div>
    <hr style="border:none; border-top:1.5px solid ${theme.main}; margin:14px 0 16px;">

    ${state.summary?`<div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">PROFILE</div>
      <div style="font-size:12.5px; line-height:1.55; color:#2a2a2a;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">WORK EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:11px;">
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="font-weight:700;">${esc(job.title)}${job.company? ' · '+esc(job.company):''}</span>
            <span style="font-size:11.5px; color:#555;">${esc(job.start)} – ${esc(job.end)}</span>
          </div>
          <div style="font-size:11.5px; color:#666; font-style:italic; margin-bottom:4px;">${esc(job.location)}</div>
          <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.55; color:#2a2a2a;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
          <span><b>${esc(ed.degree)}</b> — ${esc(ed.school)}, ${esc(ed.location)}</span>
          <span style="color:#555; font-size:11.5px;">${esc(ed.start)} – ${esc(ed.end)}</span>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:34px;">
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">SKILLS</div>
        <div style="font-size:12px; line-height:1.6; color:#2a2a2a;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.6; color:#2a2a2a;">${state.languages.map(l=>`${esc(l.name)} (${esc(l.level)})`).join(' · ')}</div>
      </div>
    </div>
    ${state.interests.length?`<div style="margin-top:14px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">INTERESTS</div>
      <div style="font-size:12px; line-height:1.6;">${state.interests.map(esc).join(' · ')}</div>
    </div>`:''}
  </div>`;
}

function renderSE_modern(theme){
  const p = state.personal;
  return `
  <div style="font-family:'Inter', sans-serif; padding:0;">
    <div style="background:${theme.soft}; padding:32px 46px; border-bottom:4px solid ${theme.main};">
      <div style="font-size:26px; font-weight:700; font-family:'Fraunces',serif; color:${theme.main};">${esc(fullName())}</div>
      <div style="font-size:13px; color:#333; margin-top:2px;">${esc(p.jobTitle)}</div>
      <div style="font-size:11.5px; color:#555; margin-top:8px;">${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '   •   ')}</div>
    </div>
    <div style="padding:26px 46px;">
      ${state.summary?`<div style="margin-bottom:16px;">
        <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFILE</div>
        <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
      </div>`:''}
      <div style="display:grid; grid-template-columns:2.1fr 1fr; gap:28px;">
        <div>
          <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">WORK EXPERIENCE</div>
          ${state.experience.map(job=>`
            <div style="margin-bottom:12px;">
              <div style="font-size:13px; font-weight:700;">${esc(job.title)}</div>
              <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.company)} · ${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
              <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.55;">
                ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
              </ul>
            </div>`).join('')}
          <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION</div>
          ${state.education.map(ed=>`
            <div style="font-size:12.5px; margin-bottom:6px;"><b>${esc(ed.degree)}</b> — ${esc(ed.school)}, ${esc(ed.location)} (${esc(ed.start)}–${esc(ed.end)})</div>`).join('')}
        </div>
        <div>
          <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">SKILLS</div>
          <div style="font-size:12px; line-height:1.8; margin-bottom:16px;">${state.skills.map(s=>`<div>${esc(s)}</div>`).join('')}</div>
          <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">LANGUAGES</div>
          <div style="font-size:12px; line-height:1.8;">${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}</div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------- Italian — Europass-inspired ---------- */
function renderIT_classic(theme){
  const p = state.personal;
  const infoRows = [
    ['Email', p.email],
    ['Phone', p.phone],
    ['Address', p.city],
    ['Date of birth', p.dob],
    ['Nationality', p.nationality],
  ].filter(r=>r[1]);
  return `
  <div style="font-family:'Inter', sans-serif; padding:0; color:#1c1c1c;">
    <div style="background:${theme.main}; color:#fff; padding:26px 46px;">
      <div style="font-size:11px; letter-spacing:1.5px; opacity:.85; margin-bottom:4px;">CURRICULUM VITAE EUROPASS</div>
      <div style="font-size:24px; font-weight:700; font-family:'Fraunces',serif;">${esc(fullName())}</div>
      <div style="font-size:13px; opacity:.9; margin-top:2px;">${esc(p.jobTitle)}</div>
    </div>
    <div style="padding:30px 46px;">
      <div style="display:flex; gap:22px; margin-bottom:20px;">
        ${state.photo?`<img src="${state.photo}" style="width:84px; height:84px; border-radius:6px; object-fit:cover; flex-shrink:0;">`:''}
        <div style="flex:1;">
          <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">PERSONAL INFORMATION</div>
          <table style="font-size:12px; width:100%; border-collapse:collapse;">
            ${infoRows.map(([k,v])=>`<tr><td style="width:140px; color:#666; padding:2px 0;">${k}</td><td>${esc(v)}</td></tr>`).join('')}
          </table>
        </div>
      </div>

      ${state.summary?`<div style="margin-bottom:18px;">
        <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">PROFESSIONAL PROFILE</div>
        <div style="font-size:12.5px; line-height:1.6;">${esc(state.summary)}</div>
      </div>`:''}

      <div style="margin-bottom:18px;">
        <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">WORK EXPERIENCE</div>
        ${state.experience.map(job=>`
          <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700;">
              <span>${esc(job.title)}, ${esc(job.company)}</span>
              <span style="font-size:11.5px; color:#555; font-weight:400;">${esc(job.start)} – ${esc(job.end)}</span>
            </div>
            <div style="font-size:11.5px; color:#666; font-style:italic; margin-bottom:4px;">${esc(job.location)}</div>
            <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.55;">
              ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
            </ul>
          </div>`).join('')}
      </div>

      <div style="margin-bottom:18px;">
        <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">EDUCATION AND TRAINING</div>
        ${state.education.map(ed=>`
          <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
            <span><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)}</span>
            <span style="color:#555; font-size:11.5px;">${esc(ed.start)}–${esc(ed.end)}</span>
          </div>`).join('')}
      </div>

      <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">PERSONAL SKILLS</div>
      <div style="display:flex; gap:30px;">
        <div style="flex:1;">
          <div style="font-size:11px; font-weight:700; color:#666; margin-bottom:4px;">Professional skills</div>
          <div style="font-size:12px; line-height:1.6;">${state.skills.map(esc).join(' · ')}</div>
        </div>
        <div style="flex:1;">
          <div style="font-size:11px; font-weight:700; color:#666; margin-bottom:4px;">Language skills</div>
          <div style="font-size:12px; line-height:1.6;">${state.languages.map(l=>`${esc(l.name)}: ${esc(l.level)}`).join(' · ')}</div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderIT_modern(theme){
  const p = state.personal;
  return `
  <div style="font-family:'Inter', sans-serif; display:flex; min-height:297mm;">
    <div style="width:32%; background:${theme.main}; color:#fff; padding:34px 24px; text-align:center;">
      <div style="width:96px; height:96px; border-radius:50%; overflow:hidden; margin:0 auto 14px; background:rgba(255,255,255,.15); display:flex; align-items:center; justify-content:center; font-size:11px;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
      <div style="font-size:19px; font-weight:700; font-family:'Fraunces',serif;">${esc(fullName())}</div>
      <div style="font-size:12px; opacity:.85; margin-top:4px; margin-bottom:20px;">${esc(p.jobTitle)}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">CONTACT</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city]], '<br>')}
      </div>
      ${p.dob||p.nationality?`<div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">PERSONAL DETAILS</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">${[p.dob,p.nationality].filter(Boolean).map(esc).join('<br>')}</div>`:''}

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">SKILLS</div>
      <div style="text-align:start; font-size:11px; line-height:2;">${state.skills.map(s=>`<div>• ${esc(s)}</div>`).join('')}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:1px; opacity:.7; margin:20px 0 8px;">LANGUAGES</div>
      <div style="text-align:start; font-size:11px; line-height:1.9;">${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}</div>
    </div>
    <div style="flex:1; padding:34px 30px; color:#1c1c1c;">
      ${state.summary?`<div style="margin-bottom:16px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFESSIONAL PROFILE</div>
        <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
      </div>`:''}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:10px;">WORK EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:14px; border-inline-start:2px solid ${theme.soft}; padding-inline-start:12px;">
          <div style="font-weight:700; font-size:13px;">${esc(job.title)}, ${esc(job.company)}</div>
          <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
          <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.55;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION AND TRAINING</div>
      ${state.education.map(ed=>`
        <div style="font-size:12.5px; margin-bottom:6px;"><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)} (${esc(ed.start)}–${esc(ed.end)})</div>`).join('')}
    </div>
  </div>`;
}

/* ---------- Indian — English, with photo + personal details ---------- */
function renderIN_classic(theme){
  const p = state.personal;
  const civilRows = [
    ['Date of Birth', p.dob],
    ['Nationality', p.nationality],
    ['Marital Status', p.maritalStatus],
  ].filter(r=>r[1]);
  return `
  <div style="font-family:'Source Serif 4', Georgia, serif; padding:38px 46px; color:#1c1c1c;">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid ${theme.main}; padding-bottom:16px; margin-bottom:18px;">
      <div>
        <div style="font-size:26px; font-weight:600; font-family:'Fraunces',serif;">${esc(fullName())}</div>
        <div style="font-size:13px; color:#444; margin-top:2px;">${esc(p.jobTitle)}</div>
      </div>
      <div style="width:76px; height:76px; border-radius:4px; overflow:hidden; background:${theme.soft}; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; color:#888;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
    </div>

    <div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">PERSONAL DETAILS</div>
      <table style="font-size:12px; width:100%; border-collapse:collapse;">
        <tr><td style="width:150px; color:#666; padding:2px 0;">📧 Email</td><td>${esc(p.email)}</td></tr>
        <tr><td style="color:#666; padding:2px 0;">📞 Phone</td><td>${esc(p.phone)}</td></tr>
        <tr><td style="color:#666; padding:2px 0;">📍 Address</td><td>${esc(p.city)}</td></tr>
        ${civilRows.map(([k,v])=>`<tr><td style="color:#666; padding:2px 0;">${k}</td><td>${esc(v)}</td></tr>`).join('')}
      </table>
    </div>

    ${state.summary?`<div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">PROFESSIONAL SUMMARY</div>
      <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">WORK EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:11px;">
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="font-weight:700;">${esc(job.title)}${job.company? ', '+esc(job.company):''}</span>
            <span style="font-size:11.5px; color:#555;">${esc(job.start)} – ${esc(job.end)}</span>
          </div>
          <div style="font-size:11.5px; color:#666; font-style:italic; margin-bottom:4px;">${esc(job.location)}</div>
          <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.55;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
          <span><b>${esc(ed.degree)}</b> — ${esc(ed.school)}, ${esc(ed.location)}</span>
          <span style="color:#555; font-size:11.5px;">${esc(ed.start)} – ${esc(ed.end)}</span>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:34px;">
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">SKILLS</div>
        <div style="font-size:12px; line-height:1.6;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.6;">${state.languages.map(l=>`${esc(l.name)} (${esc(l.level)})`).join(' · ')}</div>
      </div>
    </div>
  </div>`;
}

function renderIN_modern(theme){
  const p = state.personal;
  const civil = [
    p.dob?`Date of Birth: ${esc(p.dob)}`:'',
    p.nationality?`Nationality: ${esc(p.nationality)}`:'',
    p.maritalStatus?`Marital Status: ${esc(p.maritalStatus)}`:''
  ].filter(Boolean);
  return `
  <div style="font-family:'Inter', sans-serif; display:flex; min-height:297mm;">
    <div style="width:34%; background:${theme.main}; color:#fff; padding:36px 26px;">
      <div style="width:88px; height:88px; border-radius:50%; overflow:hidden; margin-bottom:14px; background:rgba(255,255,255,.15); display:flex; align-items:center; justify-content:center; font-size:11px;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
      <div style="font-size:22px; font-weight:700; line-height:1.25; font-family:'Fraunces',serif;">${esc(fullName())}</div>
      <div style="font-size:12.5px; opacity:.85; margin-top:4px; margin-bottom:22px;">${esc(p.jobTitle)}</div>

      <div style="font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">CONTACT</div>
      <div style="font-size:11.5px; line-height:1.9; margin-bottom:22px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '<br>')}
      </div>
      ${civil.length?`<div style="font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">PERSONAL DETAILS</div>
      <div style="font-size:11.5px; line-height:1.9; margin-bottom:22px;">${civil.join('<br>')}</div>`:''}

      <div style="font-size:11px; letter-spacing:1px; opacity:.7; margin-bottom:8px;">SKILLS</div>
      <div style="font-size:11.5px; line-height:2;">
        ${state.skills.map(s=>`<div>• ${esc(s)}</div>`).join('')}
      </div>

      <div style="font-size:11px; letter-spacing:1px; opacity:.7; margin:22px 0 8px;">LANGUAGES</div>
      <div style="font-size:11.5px; line-height:1.9;">
        ${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}
      </div>
    </div>
    <div style="flex:1; padding:36px 30px; color:#1c1c1c;">
      ${state.summary?`<div style="margin-bottom:18px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFESSIONAL SUMMARY</div>
        <div style="font-size:12.5px; line-height:1.55;">${esc(state.summary)}</div>
      </div>`:''}

      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:10px;">WORK EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:14px; border-inline-start:2px solid ${theme.soft}; padding-inline-start:12px;">
          <div style="font-weight:700; font-size:13px;">${esc(job.title)}</div>
          <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.company)} · ${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
          <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.55;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}

      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="font-size:12.5px; margin-bottom:6px;">
          <b>${esc(ed.degree)}</b><br><span style="color:#555;">${esc(ed.school)}, ${esc(ed.location)} · ${esc(ed.start)}–${esc(ed.end)}</span>
        </div>`).join('')}
    </div>
  </div>`;
}

/* ---------- Chinese ---------- */
function renderCN_classic(theme){
  const p = state.personal;
  const civilRows = [
    ['Date of birth', p.dob],
    ['Nationality', p.nationality],
    ['Marital status', p.maritalStatus],
  ].filter(r=>r[1]);
  return `
  <div style="font-family:'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif; padding:38px 46px; color:#1c1c1c;">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid ${theme.main}; padding-bottom:16px; margin-bottom:18px;">
      <div>
        <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">CURRICULUM VITAE</div>
        <div style="font-size:24px; font-weight:700;">${esc(fullName())}</div>
        <div style="font-size:13px; color:#444; margin-top:2px;">${esc(p.jobTitle)}</div>
      </div>
      <div style="width:76px; height:76px; border-radius:4px; overflow:hidden; background:${theme.soft}; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:10px; color:#888;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
    </div>

    <div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">PERSONAL DETAILS</div>
      <table style="font-size:12px; width:100%; border-collapse:collapse;">
        <tr><td style="width:110px; color:#666; padding:2px 0;">📧 Email</td><td>${esc(p.email)}</td></tr>
        <tr><td style="color:#666; padding:2px 0;">📞 Phone</td><td>${esc(p.phone)}</td></tr>
        <tr><td style="color:#666; padding:2px 0;">📍 City</td><td>${esc(p.city)}</td></tr>
        ${civilRows.map(([k,v])=>`<tr><td style="color:#666; padding:2px 0;">${k}</td><td>${esc(v)}</td></tr>`).join('')}
      </table>
    </div>

    ${state.summary?`<div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">PROFESSIONAL SUMMARY</div>
      <div style="font-size:12.5px; line-height:1.7;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">WORK EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="display:flex; gap:16px; margin-bottom:12px;">
          <div style="width:110px; flex-shrink:0; font-size:11.5px; color:#555;">${esc(job.start)} – ${esc(job.end)}</div>
          <div>
            <div style="font-size:13px; font-weight:700;">${esc(job.title)}, ${esc(job.company)}</div>
            <div style="font-size:11.5px; color:#666; margin-bottom:4px;">${esc(job.location)}</div>
            <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.7;">
              ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
            </ul>
          </div>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:18px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; gap:16px; margin-bottom:8px;">
          <div style="width:110px; flex-shrink:0; font-size:11.5px; color:#555;">${esc(ed.start)} – ${esc(ed.end)}</div>
          <div style="font-size:12.5px;"><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)}</div>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:34px;">
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">SKILLS</div>
        <div style="font-size:12px; line-height:1.7;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.7;">${state.languages.map(l=>`${esc(l.name)}: ${esc(l.level)}`).join(' · ')}</div>
      </div>
    </div>
    ${state.certifications.length?`<div style="margin-top:14px;">
      <div style="font-size:12px; font-weight:700; letter-spacing:.5px; color:${theme.main}; margin-bottom:6px;">CERTIFICATIONS</div>
      <div style="font-size:12px; line-height:1.7;">${state.certifications.map(esc).join(' · ')}</div>
    </div>`:''}
  </div>`;
}

function renderCN_modern(theme){
  const p = state.personal;
  const civil = [
    p.dob?`Date of birth: ${esc(p.dob)}`:'',
    p.nationality?`Nationality: ${esc(p.nationality)}`:'',
    p.maritalStatus?`Marital status: ${esc(p.maritalStatus)}`:''
  ].filter(Boolean);
  return `
  <div style="font-family:'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif; display:flex; min-height:297mm;">
    <div style="width:32%; background:${theme.main}; color:#fff; padding:34px 24px; text-align:center;">
      <div style="width:96px; height:96px; border-radius:50%; overflow:hidden; margin:0 auto 14px; background:rgba(255,255,255,.15); display:flex; align-items:center; justify-content:center; font-size:11px;">
        ${state.photo?`<img src="${state.photo}" style="width:100%; height:100%; object-fit:cover;">`:'Photo'}
      </div>
      <div style="font-size:19px; font-weight:700;">${esc(fullName())}</div>
      <div style="font-size:12px; opacity:.85; margin-top:4px; margin-bottom:20px;">${esc(p.jobTitle)}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:.5px; opacity:.7; margin-bottom:8px;">CONTACT</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">
        ${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city]], '<br>')}
      </div>
      ${civil.length?`<div style="text-align:start; font-size:11px; letter-spacing:.5px; opacity:.7; margin-bottom:8px;">PERSONAL DETAILS</div>
      <div style="text-align:start; font-size:11px; line-height:1.9; margin-bottom:20px;">${civil.join('<br>')}</div>`:''}

      <div style="text-align:start; font-size:11px; letter-spacing:.5px; opacity:.7; margin-bottom:8px;">SKILLS</div>
      <div style="text-align:start; font-size:11px; line-height:2;">${state.skills.map(s=>`<div>• ${esc(s)}</div>`).join('')}</div>

      <div style="text-align:start; font-size:11px; letter-spacing:.5px; opacity:.7; margin:20px 0 8px;">LANGUAGES</div>
      <div style="text-align:start; font-size:11px; line-height:1.9;">${state.languages.map(l=>`<div>${esc(l.name)} — ${esc(l.level)}</div>`).join('')}</div>
    </div>
    <div style="flex:1; padding:34px 30px; color:#1c1c1c;">
      ${state.summary?`<div style="margin-bottom:16px;">
        <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFESSIONAL SUMMARY</div>
        <div style="font-size:12.5px; line-height:1.65;">${esc(state.summary)}</div>
      </div>`:''}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:10px;">WORK EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:14px; border-inline-start:2px solid ${theme.soft}; padding-inline-start:12px;">
          <div style="font-weight:700; font-size:13px;">${esc(job.title)}, ${esc(job.company)}</div>
          <div style="font-size:11.5px; color:#555; margin-bottom:4px;">${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
          <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.6;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin:16px 0 8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="font-size:12.5px; margin-bottom:6px;"><b>${esc(ed.degree)}</b>, ${esc(ed.school)} — ${esc(ed.location)} (${esc(ed.start)}–${esc(ed.end)})</div>`).join('')}
    </div>
  </div>`;
}

/* ---------- Japanese — 履歴書 (rirekisho) fixed-table format ---------- */
function renderJP_classic(theme){
  const p = state.personal;
  const historyRows = [];
  state.education.forEach(ed=>{
    historyRows.push([esc(ed.start), '', `${esc(ed.school)}, ${esc(ed.degree)} — Enrolled`]);
    historyRows.push([esc(ed.end), '', `${esc(ed.school)}, ${esc(ed.degree)} — Graduated`]);
  });
  state.experience.forEach(job=>{
    historyRows.push([esc(job.start), '', `${esc(job.company)} — Joined`]);
    if(!job.current) historyRows.push([esc(job.end), '', `${esc(job.company)} — Left`]);
  });
  return `
  <div style="font-family:'Noto Sans JP','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif; padding:30px 40px; color:#1c1c1c; font-size:11.5px;">
    <div style="text-align:center; font-size:18px; font-weight:700; letter-spacing:4px; margin-bottom:14px;">CURRICULUM VITAE</div>

    <table style="width:100%; border-collapse:collapse; border:1.5px solid #333; margin-bottom:14px;">
      <tr>
        <td style="border:1px solid #999; padding:8px 10px; vertical-align:top;">
          <div style="font-size:10px; color:#666; margin-bottom:4px;">Name</div>
          <div style="font-size:17px; font-weight:700;">${esc(fullName())}</div>
        </td>
        <td rowspan="4" style="border:1px solid #999; width:90px; text-align:center; vertical-align:middle; font-size:9px; color:#999;">
          ${state.photo?`<img src="${state.photo}" style="width:70px; height:90px; object-fit:cover;">`:'Photo<br>(3×4cm)'}
        </td>
      </tr>
      <tr>
        <td style="border:1px solid #999; padding:6px 10px;">
          <div style="font-size:10px; color:#666;">Date of Birth</div>
          <div>${esc(p.dob)||'—'}</div>
        </td>
      </tr>
      <tr>
        <td style="border:1px solid #999; padding:6px 10px;">
          <div style="font-size:10px; color:#666;">Address</div>
          <div>${esc(p.city)}</div>
        </td>
      </tr>
      <tr>
        <td style="border:1px solid #999; padding:6px 10px;">
          <div style="font-size:10px; color:#666;">Phone / Email</div>
          <div>${esc(p.phone)} / ${esc(p.email)}</div>
        </td>
      </tr>
    </table>

    <table style="width:100%; border-collapse:collapse; border:1.5px solid #333; margin-bottom:14px;">
      <tr style="background:${theme.soft};">
        <td style="border:1px solid #999; padding:5px 8px; width:70px; text-align:center; font-weight:700; color:${theme.main}; font-size:10px;">Year</td>
        <td style="border:1px solid #999; padding:5px 8px; width:55px; text-align:center; font-weight:700; color:${theme.main}; font-size:10px;">Month</td>
        <td style="border:1px solid #999; padding:5px 8px; font-weight:700; color:${theme.main};">Education / Work History</td>
      </tr>
      ${historyRows.map(([y,m,ev])=>`
        <tr><td style="border:1px solid #999; padding:5px 8px; text-align:center;">${y}</td><td style="border:1px solid #999; padding:5px 8px;"></td><td style="border:1px solid #999; padding:5px 8px;">${ev}</td></tr>`).join('')}
      <tr><td style="border:1px solid #999; padding:5px 8px;"></td><td style="border:1px solid #999; padding:5px 8px;"></td><td style="border:1px solid #999; padding:5px 8px; text-align:right; color:#999;">End</td></tr>
    </table>

    ${state.certifications.length?`<table style="width:100%; border-collapse:collapse; border:1.5px solid #333; margin-bottom:14px;">
      <tr style="background:${theme.soft};"><td style="border:1px solid #999; padding:5px 8px; font-weight:700; color:${theme.main};">Licenses / Qualifications</td></tr>
      <tr><td style="border:1px solid #999; padding:8px;">${state.certifications.map(esc).join(' / ')}</td></tr>
    </table>`:''}

    <table style="width:100%; border-collapse:collapse; border:1.5px solid #333; margin-bottom:14px;">
      <tr style="background:${theme.soft};"><td style="border:1px solid #999; padding:5px 8px; font-weight:700; color:${theme.main};">Motivation / Self-PR</td></tr>
      <tr><td style="border:1px solid #999; padding:10px; line-height:1.7;">${esc(state.summary)||'&nbsp;'}</td></tr>
    </table>

    <table style="width:100%; border-collapse:collapse; border:1.5px solid #333;">
      <tr style="background:${theme.soft};"><td style="border:1px solid #999; padding:5px 8px; font-weight:700; color:${theme.main};">Additional Notes</td></tr>
      <tr><td style="border:1px solid #999; padding:10px; line-height:1.7;">${[...state.skills, ...state.languages.map(l=>`${l.name} (${l.level})`)].map(esc).join(' / ')||'None'}</td></tr>
    </table>
  </div>`;
}

function renderJP_modern(theme){
  const p = state.personal;
  return `
  <div style="font-family:'Noto Sans JP','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif; padding:38px 46px; color:#1c1c1c;">
    <div style="border-bottom:3px solid ${theme.main}; padding-bottom:14px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-size:11px; letter-spacing:2px; color:${theme.main}; margin-bottom:4px;">CURRICULUM VITAE</div>
        <div style="font-size:24px; font-weight:700;">${esc(fullName())}</div>
        <div style="font-size:12.5px; color:#555; margin-top:2px;">${esc(p.jobTitle)}</div>
        <div style="font-size:11px; color:#666; margin-top:6px;">${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city]], '  |  ')}</div>
      </div>
      ${state.photo?`<img src="${state.photo}" style="width:76px; height:96px; object-fit:cover; border:1px solid #ccc;">`:''}
    </div>

    ${state.summary?`<div style="margin-bottom:18px;">
      <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:6px;">PROFESSIONAL SUMMARY</div>
      <div style="font-size:12.5px; line-height:1.7;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:18px;">
      <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">WORK EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700;">
            <span>${esc(job.title)}, ${esc(job.company)}</span>
            <span style="font-size:11.5px; color:#555; font-weight:400;">${esc(job.start)} – ${esc(job.end)}</span>
          </div>
          <div style="font-size:11.5px; color:#666; margin-bottom:4px;">${esc(job.location)}</div>
          <ul style="margin:0; padding-inline-start:18px; font-size:12px; line-height:1.7;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:18px;">
      <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:8px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px;">
          <span><b>${esc(ed.degree)}</b>, ${esc(ed.school)}</span>
          <span style="color:#555; font-size:11.5px;">${esc(ed.start)}–${esc(ed.end)}</span>
        </div>`).join('')}
    </div>

    ${state.certifications.length?`<div style="margin-bottom:18px;">
      <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:6px;">CERTIFICATIONS</div>
      <div style="font-size:12px; line-height:1.7;">${state.certifications.map(esc).join(' / ')}</div>
    </div>`:''}

    <div style="display:flex; gap:34px;">
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:6px;">SKILLS</div>
        <div style="font-size:12px; line-height:1.7;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700; color:${theme.main}; margin-bottom:6px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.7;">${state.languages.map(l=>`${esc(l.name)}: ${esc(l.level)}`).join(' · ')}</div>
      </div>
    </div>
  </div>`;
}

const COVER_LETTER_STYLES = { classic:'Classic', modern:'Modern', minimal:'Minimalist' };

function renderCoverLetter(theme){
  const fn = COVER_LETTER_RENDERERS[state.letterStyle] || COVER_LETTER_RENDERERS.classic;
  return fn(theme);
}

/* ---------- Cover letter — Classic: formal serif letterhead ---------- */
function renderCoverLetterClassic(theme){
  const p = state.personal;
  const cl = state.coverLetter;
  const locale = LETTER_LOCALE.us; // salutation/sign-off always in English, regardless of the selected country
  return `
  <div style="font-family:'Source Serif 4', Georgia, serif; padding:52px 58px; color:#1c1c1c; min-height:297mm;">
    <div style="margin-bottom:10px;">
      <div style="font-family:'Fraunces',serif; font-size:21px; font-weight:600;">${esc(fullName())}</div>
      <div style="font-size:11.5px; color:#555; margin-top:4px;">${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city]], '  |  ')}</div>
    </div>
    <div style="border-top:3px solid ${theme.main}; margin:16px 0 26px;"></div>

    ${cl.date? `<div style="font-size:11.5px; color:#555; margin-bottom:22px;">${esc(cl.date)}</div>`:''}
    ${cl.companyName? `<div style="font-size:12.5px; line-height:1.6; margin-bottom:22px;">${cl.hiringManager?esc(cl.hiringManager)+'<br>':''}${esc(cl.companyName)}</div>`:''}

    <div style="font-size:12.5px; font-weight:600; margin-bottom:16px;">${esc(locale.salutation(cl.hiringManager))}</div>

    <div style="font-size:12.5px; line-height:1.75; margin-bottom:14px;">${esc(cl.opening) || '<span style="color:#999;">Write your opening paragraph, or click "Insert starter draft" on the left.</span>'}</div>
    ${cl.body?`<div style="font-size:12.5px; line-height:1.75; margin-bottom:14px;">${esc(cl.body)}</div>`:''}
    ${cl.closing?`<div style="font-size:12.5px; line-height:1.75; margin-bottom:30px;">${esc(cl.closing)}</div>`:''}

    <div style="font-size:12.5px;">${esc(locale.closing)}</div>
    <div style="font-size:13px; font-weight:600; margin-top:36px; font-family:'Fraunces',serif;">${esc(fullName())}</div>
  </div>`;
}

/* ---------- Cover letter — Modern: colored header band, sans-serif body ---------- */
function renderCoverLetterModern(theme){
  const p = state.personal;
  const cl = state.coverLetter;
  const locale = LETTER_LOCALE.us; // salutation/sign-off always in English, regardless of the selected country
  return `
  <div style="font-family:'Inter', sans-serif; min-height:297mm; color:#1c1c1c;">
    <div style="background:${theme.main}; color:#fff; padding:40px 58px;">
      <div style="font-family:'Fraunces',serif; font-size:24px; font-weight:600;">${esc(fullName())}</div>
      ${p.jobTitle?`<div style="font-size:12px; opacity:.85; margin-top:4px;">${esc(p.jobTitle)}</div>`:''}
      <div style="font-size:11.5px; opacity:.9; margin-top:14px;">${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city]], '&nbsp;&nbsp;|&nbsp;&nbsp;')}</div>
    </div>
    <div style="padding:36px 58px;">
      ${cl.date? `<div style="font-size:11.5px; color:#777; margin-bottom:20px;">${esc(cl.date)}</div>`:''}
      ${cl.companyName? `<div style="font-size:12.5px; line-height:1.6; margin-bottom:20px;">${cl.hiringManager?esc(cl.hiringManager)+'<br>':''}${esc(cl.companyName)}</div>`:''}

      <div style="font-size:13px; font-weight:700; color:${theme.main}; margin-bottom:14px;">${esc(locale.salutation(cl.hiringManager))}</div>

      <div style="font-size:12.5px; line-height:1.75; margin-bottom:14px;">${esc(cl.opening) || '<span style="color:#999;">Write your opening paragraph, or click "Insert starter draft" on the left.</span>'}</div>
      ${cl.body?`<div style="font-size:12.5px; line-height:1.75; margin-bottom:14px;">${esc(cl.body)}</div>`:''}
      ${cl.closing?`<div style="font-size:12.5px; line-height:1.75; margin-bottom:28px;">${esc(cl.closing)}</div>`:''}

      <div style="font-size:12.5px;">${esc(locale.closing)}</div>
      <div style="font-size:13px; font-weight:700; margin-top:34px; color:${theme.main};">${esc(fullName())}</div>
    </div>
  </div>`;
}

/* ---------- Cover letter — Minimalist: quiet, generous whitespace ---------- */
function renderCoverLetterMinimal(theme){
  const p = state.personal;
  const cl = state.coverLetter;
  const locale = LETTER_LOCALE.us; // salutation/sign-off always in English, regardless of the selected country
  return `
  <div style="font-family:'Inter', sans-serif; padding:64px 68px; color:#2a2a2a; min-height:297mm;">
    <div style="font-family:'Fraunces',serif; font-size:23px; font-weight:500;">${esc(fullName())}</div>
    <div style="font-size:11px; color:#777; margin:8px 0 26px; letter-spacing:.2px;">
      ${contactLine([['',p.email],['',p.phone],['',p.city]], '&nbsp;&nbsp;·&nbsp;&nbsp;')}
    </div>
    <div style="width:36px; border-top:2px solid ${theme.main}; margin-bottom:28px;"></div>

    ${cl.date? `<div style="font-size:11px; color:#999; margin-bottom:22px;">${esc(cl.date)}</div>`:''}
    ${cl.companyName? `<div style="font-size:12px; color:#555; line-height:1.6; margin-bottom:22px;">${cl.hiringManager?esc(cl.hiringManager)+'<br>':''}${esc(cl.companyName)}</div>`:''}

    <div style="font-size:12px; font-weight:600; margin-bottom:16px;">${esc(locale.salutation(cl.hiringManager))}</div>

    <div style="font-size:12.5px; line-height:1.8; margin-bottom:16px; color:#333;">${esc(cl.opening) || '<span style="color:#999;">Write your opening paragraph, or click "Insert starter draft" on the left.</span>'}</div>
    ${cl.body?`<div style="font-size:12.5px; line-height:1.8; margin-bottom:16px; color:#333;">${esc(cl.body)}</div>`:''}
    ${cl.closing?`<div style="font-size:12.5px; line-height:1.8; margin-bottom:30px; color:#333;">${esc(cl.closing)}</div>`:''}

    <div style="font-size:12px; color:#555;">${esc(locale.closing)}</div>
    <div style="font-size:13px; font-weight:500; margin-top:36px; font-family:'Fraunces',serif;">${esc(fullName())}</div>
  </div>`;
}

const COVER_LETTER_RENDERERS = {
  classic: renderCoverLetterClassic,
  modern: renderCoverLetterModern,
  minimal: renderCoverLetterMinimal,
};

/* =========================================================
   MINIMALIST — clean, airy, single column, works for every country
   ========================================================= */
function renderMinimalist(theme){
  const p = state.personal;
  const usesPhoto = state.country === 'fr' || state.country === 'de' || state.country === 'es' || state.country === 'ar' || state.country === 'br' || state.country === 'jp' || state.country === 'it' || state.country === 'in' || state.country === 'cn';
  return `
  <div style="font-family:'Inter', sans-serif; padding:64px 68px; color:#2a2a2a; min-height:297mm;">
    <div style="display:flex; align-items:center; gap:20px; margin-bottom:8px;">
      ${usesPhoto && state.photo ? `<img src="${state.photo}" style="width:56px; height:56px; border-radius:50%; object-fit:cover;">` : ''}
      <div>
        <div style="font-family:'Fraunces',serif; font-size:25px; font-weight:500; letter-spacing:.3px;">${esc(fullName())}</div>
        <div style="font-size:12.5px; color:${theme.main}; margin-top:2px;">${esc(p.jobTitle)}</div>
      </div>
    </div>
    <div style="font-size:11px; color:#777; margin:14px 0 30px; letter-spacing:.2px;">
      ${contactLine([['',p.email],['',p.phone],['',p.city],['',p.linkedin]], '&nbsp;&nbsp;·&nbsp;&nbsp;')}
    </div>

    ${state.summary?`<div style="margin-bottom:26px;">
      <div style="font-size:10.5px; font-weight:600; letter-spacing:2px; color:#999; margin-bottom:8px;">SUMMARY</div>
      <div style="font-size:12.5px; line-height:1.7;">${esc(state.summary)}</div>
    </div>`:''}

    <div style="margin-bottom:26px;">
      <div style="font-size:10.5px; font-weight:600; letter-spacing:2px; color:#999; margin-bottom:10px;">EXPERIENCE</div>
      ${state.experience.map(job=>`
        <div style="margin-bottom:18px;">
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="font-weight:600;">${esc(job.title)} <span style="font-weight:400; color:#777;">— ${esc(job.company)}</span></span>
            <span style="font-size:11px; color:#999;">${esc(job.start)} – ${esc(job.end)}</span>
          </div>
          <div style="font-size:11px; color:#999; margin-bottom:6px;">${esc(job.location)}</div>
          <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.7; color:#333;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>

    <div style="margin-bottom:26px;">
      <div style="font-size:10.5px; font-weight:600; letter-spacing:2px; color:#999; margin-bottom:10px;">EDUCATION</div>
      ${state.education.map(ed=>`
        <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:6px;">
          <span>${esc(ed.degree)} <span style="color:#777;">— ${esc(ed.school)}</span></span>
          <span style="color:#999; font-size:11px;">${esc(ed.start)} – ${esc(ed.end)}</span>
        </div>`).join('')}
    </div>

    <div style="display:flex; gap:40px; margin-bottom:${state.certifications.length?'20':'0'}px;">
      <div style="flex:1;">
        <div style="font-size:10.5px; font-weight:600; letter-spacing:2px; color:#999; margin-bottom:8px;">SKILLS</div>
        <div style="font-size:12px; line-height:1.8;">${state.skills.map(esc).join(' · ')}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:10.5px; font-weight:600; letter-spacing:2px; color:#999; margin-bottom:8px;">LANGUAGES</div>
        <div style="font-size:12px; line-height:1.8;">${state.languages.map(l=>`${esc(l.name)} (${esc(l.level)})`).join(' · ')}</div>
      </div>
    </div>
    ${state.certifications.length?`<div>
      <div style="font-size:10.5px; font-weight:600; letter-spacing:2px; color:#999; margin-bottom:8px;">CERTIFICATIONS</div>
      <div style="font-size:12px; line-height:1.8;">${state.certifications.map(esc).join(' · ')}</div>
    </div>`:''}
  </div>`;
}

/* =========================================================
   CREATIVE — bold colored header band, for design/marketing roles
   ========================================================= */
function renderCreative(theme){
  const p = state.personal;
  const usesPhoto = state.country === 'fr' || state.country === 'de' || state.country === 'es' || state.country === 'ar' || state.country === 'br' || state.country === 'jp' || state.country === 'it' || state.country === 'in' || state.country === 'cn';
  return `
  <div style="font-family:'Inter', sans-serif; color:#2a2a2a; min-height:297mm;">
    <div style="background:${theme.main}; color:#fff; padding:38px 46px; display:flex; align-items:center; justify-content:space-between; gap:20px;">
      <div>
        <div style="font-family:'Fraunces',serif; font-size:27px; font-weight:600;">${esc(fullName())}</div>
        <div style="font-size:13px; opacity:.9; margin-top:3px;">${esc(p.jobTitle)}</div>
        <div style="font-size:11px; opacity:.85; margin-top:10px;">${contactLine([['📧',p.email],['📞',p.phone],['📍',p.city],['🔗',p.linkedin]], '&nbsp;&nbsp;·&nbsp;&nbsp;')}</div>
      </div>
      ${usesPhoto && state.photo ? `<img src="${state.photo}" style="width:76px; height:76px; border-radius:50%; object-fit:cover; border:3px solid rgba(255,255,255,.6); flex-shrink:0;">` : ''}
    </div>

    <div style="padding:32px 46px;">
      ${state.summary?`<div style="margin-bottom:22px;">
        <span style="display:inline-block; background:${theme.soft}; color:${theme.main}; font-size:11px; font-weight:700; letter-spacing:.8px; padding:4px 12px; border-radius:12px; margin-bottom:10px;">SUMMARY</span>
        <div style="font-size:12.5px; line-height:1.65;">${esc(state.summary)}</div>
      </div>`:''}

      <span style="display:inline-block; background:${theme.soft}; color:${theme.main}; font-size:11px; font-weight:700; letter-spacing:.8px; padding:4px 12px; border-radius:12px; margin-bottom:10px;">EXPERIENCE</span>
      ${state.experience.map(job=>`
        <div style="margin-bottom:16px; padding-inline-start:14px; border-inline-start:3px solid ${theme.soft};">
          <div style="font-weight:700; font-size:13px;">${esc(job.title)}</div>
          <div style="font-size:11.5px; color:#666; margin-bottom:5px;">${esc(job.company)} · ${esc(job.location)} · ${esc(job.start)}–${esc(job.end)}</div>
          <ul style="margin:0; padding-inline-start:16px; font-size:12px; line-height:1.6;">
            ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
          </ul>
        </div>`).join('')}

      <div style="margin-top:20px;">
        <span style="display:inline-block; background:${theme.soft}; color:${theme.main}; font-size:11px; font-weight:700; letter-spacing:.8px; padding:4px 12px; border-radius:12px; margin-bottom:10px;">EDUCATION</span>
        ${state.education.map(ed=>`
          <div style="font-size:12.5px; margin-bottom:8px;">
            <b>${esc(ed.degree)}</b> — ${esc(ed.school)}, ${esc(ed.location)} <span style="color:#999; font-size:11px;">(${esc(ed.start)}–${esc(ed.end)})</span>
          </div>`).join('')}
      </div>

      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:18px;">
        ${state.skills.map(s=>`<span style="background:${theme.soft}; color:${theme.main}; font-size:11.5px; font-weight:600; padding:5px 12px; border-radius:14px;">${esc(s)}</span>`).join('')}
      </div>

      ${state.languages.length?`<div style="margin-top:16px; font-size:12px; color:#555;"><b style="color:${theme.main};">Languages:</b> ${state.languages.map(l=>`${esc(l.name)} (${esc(l.level)})`).join(' · ')}</div>`:''}
      ${state.certifications.length?`<div style="margin-top:8px; font-size:12px; color:#555;"><b style="color:${theme.main};">Certifications:</b> ${state.certifications.map(esc).join(' · ')}</div>`:''}
    </div>
  </div>`;
}

/* =========================================================
   COMPACT TWO-COLUMN — dense grid layout for a long work history
   ========================================================= */
function renderCompact(theme){
  const p = state.personal;
  const usesPhoto = state.country === 'fr' || state.country === 'de' || state.country === 'es' || state.country === 'ar' || state.country === 'br' || state.country === 'jp' || state.country === 'it' || state.country === 'in' || state.country === 'cn';
  return `
  <div style="font-family:'Inter', sans-serif; padding:34px 40px; color:#242424; min-height:297mm;">
    <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid ${theme.main}; padding-bottom:10px; margin-bottom:16px;">
      <div>
        <div style="font-family:'Fraunces',serif; font-size:21px; font-weight:600;">${esc(fullName())} <span style="font-weight:400; font-size:13px; color:${theme.main};">— ${esc(p.jobTitle)}</span></div>
        <div style="font-size:10.5px; color:#777; margin-top:3px;">${contactLine([['',p.email],['',p.phone],['',p.city],['',p.linkedin]], '&nbsp;&nbsp;·&nbsp;&nbsp;')}</div>
      </div>
      ${usesPhoto && state.photo ? `<img src="${state.photo}" style="width:48px; height:48px; border-radius:6px; object-fit:cover; flex-shrink:0;">` : ''}
    </div>

    <div style="display:grid; grid-template-columns:62% 1fr; gap:26px;">
      <div>
        ${state.summary?`<div style="margin-bottom:14px;">
          <div style="font-size:10.5px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:5px;">SUMMARY</div>
          <div style="font-size:11px; line-height:1.5;">${esc(state.summary)}</div>
        </div>`:''}
        <div style="font-size:10.5px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">EXPERIENCE</div>
        ${state.experience.map(job=>`
          <div style="margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; font-size:11.5px;">
              <span style="font-weight:700;">${esc(job.title)}</span>
              <span style="font-size:10px; color:#888;">${esc(job.start)}–${esc(job.end)}</span>
            </div>
            <div style="font-size:10.5px; color:#777; margin-bottom:3px;">${esc(job.company)} · ${esc(job.location)}</div>
            <ul style="margin:0; padding-inline-start:14px; font-size:10.5px; line-height:1.45;">
              ${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}
            </ul>
          </div>`).join('')}
      </div>

      <div>
        <div style="font-size:10.5px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin-bottom:6px;">EDUCATION</div>
        ${state.education.map(ed=>`
          <div style="font-size:10.5px; line-height:1.4; margin-bottom:8px;">
            <b>${esc(ed.degree)}</b><br><span style="color:#777;">${esc(ed.school)}</span><br><span style="color:#999; font-size:9.5px;">${esc(ed.start)}–${esc(ed.end)}</span>
          </div>`).join('')}

        <div style="font-size:10.5px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin:14px 0 6px;">SKILLS</div>
        <div style="font-size:10.5px; line-height:1.6;">${state.skills.map(esc).join(', ')}</div>

        ${state.languages.length?`<div style="font-size:10.5px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin:14px 0 6px;">LANGUAGES</div>
        <div style="font-size:10.5px; line-height:1.6;">${state.languages.map(l=>`${esc(l.name)} (${esc(l.level)})`).join(', ')}</div>`:''}

        ${state.certifications.length?`<div style="font-size:10.5px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin:14px 0 6px;">CERTIFICATIONS</div>
        <div style="font-size:10.5px; line-height:1.6;">${state.certifications.map(esc).join(', ')}</div>`:''}

        ${state.interests.length?`<div style="font-size:10.5px; font-weight:700; letter-spacing:1px; color:${theme.main}; margin:14px 0 6px;">INTERESTS</div>
        <div style="font-size:10.5px; line-height:1.6;">${state.interests.map(esc).join(', ')}</div>`:''}
      </div>
    </div>
  </div>`;
}

const RENDERERS = {
  us: { classic: renderUS_classic, modern: renderUS_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  ca: { classic: renderCA_classic, modern: renderCA_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  uk: { classic: renderUK_classic, modern: renderUK_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  au: { classic: renderAU_classic, modern: renderAU_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  fr: { classic: renderFR_classic, modern: renderFR_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  de: { classic: renderDE_classic, modern: renderDE_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  es: { classic: renderES_classic, modern: renderES_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  nl: { classic: renderNL_classic, modern: renderNL_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  ar: { classic: renderAR_classic, modern: renderAR_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  br: { classic: renderBR_classic, modern: renderBR_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  jp: { classic: renderJP_classic, modern: renderJP_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  se: { classic: renderSE_classic, modern: renderSE_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  it: { classic: renderIT_classic, modern: renderIT_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  in: { classic: renderIN_classic, modern: renderIN_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
  cn: { classic: renderCN_classic, modern: renderCN_modern, minimal: renderMinimalist, creative: renderCreative, compact: renderCompact },
};

/* =========================================================
   MAIN RENDER
   ========================================================= */
function render(){
  // These two pickers are only rebuilt while the Personal section is active;
  // clear any leftover portal so switching sections/tabs never strands one.
  ['phoneCodePortal','dobPickerPortal'].forEach(id=>{
    const stale = document.getElementById(id);
    if(stale) stale.remove();
  });
  buildTopControls();
  buildSectionRail();
  buildFormPanel();
  const theme = THEMES[state.theme];
  const html = state.view === 'letter'
    ? renderCoverLetter(theme)
    : RENDERERS[state.country][state.style[state.country]](theme);
  document.getElementById('paper').innerHTML = html;
  document.getElementById('paper').setAttribute('dir', 'ltr'); // CV text is always English regardless of country
}

/* =========================================================
   WORD (.docx) EXPORT — builds a real native Word document
   from the CV/letter data (not a re-tagged HTML hack).
   ========================================================= */
function saveBlob(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}

function hexColor(hex){ return (hex||'#000000').replace('#',''); }

function docxHeading(text, color){
  const { Paragraph, TextRun } = docx;
  return new Paragraph({
    spacing:{ before:220, after:80 },
    border:{ bottom:{ color, space:1, style: docx.BorderStyle.SINGLE, size:4 } },
    children:[ new TextRun({ text: text.toUpperCase(), bold:true, size:20, color }) ]
  });
}

function docxDateLine(leftRuns, dateText){
  const { Paragraph, TextRun, TabStopType, TabStopPosition } = docx;
  return new Paragraph({
    tabStops:[{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    spacing:{ after:20 },
    children:[ ...leftRuns, new TextRun({ text:'\t'+(dateText||''), size:19, color:'666666' }) ]
  });
}

function buildWordPlain(){
  const { Document, Paragraph, TextRun, AlignmentType } = docx;
  const p = state.personal;
  const theme = THEMES[state.theme];
  const accent = hexColor(theme.main);
  const children = [];

  children.push(new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing:{ after:20 },
    children:[ new TextRun({ text: fullName().toUpperCase() || 'YOUR NAME', bold:true, size:40, color: accent }) ]
  }));
  if(p.jobTitle){
    children.push(new Paragraph({
      spacing:{ after:60 },
      children:[ new TextRun({ text:p.jobTitle, italics:true, size:22, color:'555555' }) ]
    }));
  }
  const contactParts = [p.email, p.phone, p.city, p.linkedin].filter(Boolean);
  if(contactParts.length){
    children.push(new Paragraph({
      spacing:{ after:200 },
      children:[ new TextRun({ text: contactParts.join('   ·   '), size:19, color:'555555' }) ]
    }));
  }

  if(state.summary){
    children.push(docxHeading('Summary', accent));
    children.push(new Paragraph({ spacing:{ after:160 }, children:[ new TextRun({ text: state.summary, size:21 }) ] }));
  }

  if(state.experience.length){
    children.push(docxHeading('Experience', accent));
    state.experience.forEach(job=>{
      children.push(docxDateLine(
        [ new TextRun({ text: job.title||'', bold:true, size:21 }),
          new TextRun({ text: job.company? '  —  '+job.company : '', size:21 }) ],
        [job.start, job.end].filter(Boolean).join(' – ')
      ));
      if(job.location){
        children.push(new Paragraph({ spacing:{ after:40 }, children:[ new TextRun({ text:job.location, italics:true, size:19, color:'777777' }) ] }));
      }
      job.bullets.filter(Boolean).forEach(b=>{
        children.push(new Paragraph({ bullet:{ level:0 }, spacing:{ after:40 }, children:[ new TextRun({ text:b, size:20 }) ] }));
      });
      children.push(new Paragraph({ spacing:{ after:120 }, children:[] }));
    });
  }

  if(state.education.length){
    children.push(docxHeading('Education', accent));
    state.education.forEach(ed=>{
      children.push(docxDateLine(
        [ new TextRun({ text: ed.degree||'', bold:true, size:21 }),
          new TextRun({ text: ed.school? '  —  '+ed.school : '', size:21 }) ],
        [ed.start, ed.end].filter(Boolean).join(' – ')
      ));
      if(ed.location){
        children.push(new Paragraph({ spacing:{ after:120 }, children:[ new TextRun({ text:ed.location, italics:true, size:19, color:'777777' }) ] }));
      }
    });
  }

  if(state.skills.length){
    children.push(docxHeading('Skills', accent));
    children.push(new Paragraph({ spacing:{ after:160 }, children:[ new TextRun({ text: state.skills.join(' · '), size:20 }) ] }));
  }

  if(state.languages.length){
    children.push(docxHeading('Languages', accent));
    children.push(new Paragraph({ spacing:{ after:160 }, children:[ new TextRun({ text: state.languages.map(l=>`${l.name} (${l.level})`).join(' · '), size:20 }) ] }));
  }

  if(state.certifications.length){
    children.push(docxHeading('Certifications', accent));
    children.push(new Paragraph({ spacing:{ after:160 }, children:[ new TextRun({ text: state.certifications.join(' · '), size:20 }) ] }));
  }

  if(state.interests.length){
    children.push(docxHeading('Interests', accent));
    children.push(new Paragraph({ children:[ new TextRun({ text: state.interests.join(' · '), size:20 }) ] }));
  }

  return new Document({ sections:[{ properties:{}, children }] });
}

// Picks the Word layout that best matches the currently selected
// template style, instead of always using the plain single-column one.
function buildWordCV(){
  const style = state.style[state.country];
  if(style === 'modern') return buildWordSidebar();
  if(style === 'creative') return buildWordCreative();
  if(style === 'compact') return buildWordCompact();
  return buildWordPlain(); // classic (ATS) and minimalist stay plain — that's already their look
}

function dataURLToUint8Array(dataUrl){
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function docxPhotoRun(size){
  if(!state.photo) return null;
  try{
    const { ImageRun } = docx;
    return new ImageRun({
      data: dataURLToUint8Array(state.photo),
      type: 'jpg',
      transformation:{ width:size, height:size }
    });
  }catch(e){ console.warn('Photo could not be embedded in the Word file:', e); return null; }
}

/* ---------- MODERN SIDEBAR — colored left column, like the on-screen template ---------- */
function buildWordSidebar(){
  const { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, VerticalAlign, ShadingType } = docx;
  const p = state.personal;
  const theme = THEMES[state.theme];
  const accent = hexColor(theme.main);
  const usesPhoto = state.country === 'fr' || state.country === 'de' || state.country === 'es' || state.country === 'ar' || state.country === 'br' || state.country === 'jp' || state.country === 'it' || state.country === 'in' || state.country === 'cn';
  const noBorder = { style: BorderStyle.NONE, size:0, color:'FFFFFF' };
  const cellBorders = { top:noBorder, bottom:noBorder, left:noBorder, right:noBorder };

  const left = [];
  const photoRun = usesPhoto ? docxPhotoRun(70) : null;
  if(photoRun){ left.push(new Paragraph({ alignment: docx.AlignmentType.CENTER, spacing:{ after:160 }, children:[ photoRun ] })); }
  left.push(new Paragraph({ spacing:{ after:20 }, children:[ new TextRun({ text: fullName() || 'Your Name', bold:true, size:28, color:'FFFFFF' }) ] }));
  if(p.jobTitle) left.push(new Paragraph({ spacing:{ after:220 }, children:[ new TextRun({ text:p.jobTitle, size:19, color:'F4F1E6' }) ] }));

  left.push(new Paragraph({ spacing:{ after:80 }, children:[ new TextRun({ text:'CONTACT', bold:true, size:16, color:'F4F1E6' }) ] }));
  [p.email, p.phone, p.city, p.linkedin].filter(Boolean).forEach(v=>{
    left.push(new Paragraph({ spacing:{ after:60 }, children:[ new TextRun({ text:v, size:18, color:'FFFFFF' }) ] }));
  });

  if(state.skills.length){
    left.push(new Paragraph({ spacing:{ before:180, after:80 }, children:[ new TextRun({ text:'SKILLS', bold:true, size:16, color:'F4F1E6' }) ] }));
    state.skills.forEach(s=> left.push(new Paragraph({ spacing:{ after:40 }, children:[ new TextRun({ text:'• '+s, size:18, color:'FFFFFF' }) ] })));
  }
  if(state.languages.length){
    left.push(new Paragraph({ spacing:{ before:180, after:80 }, children:[ new TextRun({ text:'LANGUAGES', bold:true, size:16, color:'F4F1E6' }) ] }));
    state.languages.forEach(l=> left.push(new Paragraph({ spacing:{ after:40 }, children:[ new TextRun({ text:`${l.name} — ${l.level}`, size:18, color:'FFFFFF' }) ] })));
  }

  const right = [];
  if(state.summary){
    right.push(docxHeading('Summary', accent));
    right.push(new Paragraph({ spacing:{ after:160 }, children:[ new TextRun({ text: state.summary, size:20 }) ] }));
  }
  if(state.experience.length){
    right.push(docxHeading('Experience', accent));
    state.experience.forEach(job=>{
      right.push(docxDateLine(
        [ new TextRun({ text: job.title||'', bold:true, size:20 }) ],
        [job.start, job.end].filter(Boolean).join(' – ')
      ));
      const sub = [job.company, job.location].filter(Boolean).join(' · ');
      if(sub) right.push(new Paragraph({ spacing:{ after:40 }, children:[ new TextRun({ text:sub, italics:true, size:18, color:'777777' }) ] }));
      job.bullets.filter(Boolean).forEach(b=>{
        right.push(new Paragraph({ bullet:{ level:0 }, spacing:{ after:40 }, children:[ new TextRun({ text:b, size:19 }) ] }));
      });
      right.push(new Paragraph({ spacing:{ after:100 }, children:[] }));
    });
  }
  if(state.education.length){
    right.push(docxHeading('Education', accent));
    state.education.forEach(ed=>{
      right.push(new Paragraph({ spacing:{ after:100 }, children:[
        new TextRun({ text: ed.degree||'', bold:true, size:19 }),
        new TextRun({ text: ed.school? '  —  '+ed.school : '', size:19 })
      ] }));
    });
  }
  if(state.certifications.length){
    right.push(docxHeading('Certifications', accent));
    right.push(new Paragraph({ children:[ new TextRun({ text: state.certifications.join(' · '), size:19 }) ] }));
  }

  const table = new Table({
    width:{ size:100, type: WidthType.PERCENTAGE },
    borders:{ top:noBorder, bottom:noBorder, left:noBorder, right:noBorder, insideHorizontal:noBorder, insideVertical:noBorder },
    rows:[ new TableRow({ children:[
      new TableCell({
        width:{ size:34, type: WidthType.PERCENTAGE }, borders:cellBorders, verticalAlign: VerticalAlign.TOP,
        shading:{ type: ShadingType.CLEAR, fill: accent, color:'auto' },
        margins:{ top:200, bottom:200, left:200, right:200 },
        children: left
      }),
      new TableCell({
        width:{ size:66, type: WidthType.PERCENTAGE }, borders:cellBorders, verticalAlign: VerticalAlign.TOP,
        margins:{ top:200, bottom:200, left:260, right:120 },
        children: right
      })
    ]}) ]
  });

  return new Document({ sections:[{ properties:{}, children:[ table ] }] });
}

/* ---------- CREATIVE — colored header band + soft pill section labels ---------- */
function buildWordCreative(){
  const { Document, Paragraph, TextRun, ShadingType, AlignmentType } = docx;
  const p = state.personal;
  const theme = THEMES[state.theme];
  const accent = hexColor(theme.main);
  const soft = hexColor(theme.soft);
  const usesPhoto = state.country === 'fr' || state.country === 'de' || state.country === 'es' || state.country === 'ar' || state.country === 'br' || state.country === 'jp' || state.country === 'it' || state.country === 'in' || state.country === 'cn';
  const band = { type: ShadingType.CLEAR, fill: accent, color:'auto' };
  const children = [];

  const photoRun = usesPhoto ? docxPhotoRun(64) : null;
  if(photoRun){
    children.push(new Paragraph({ alignment: AlignmentType.RIGHT, shading:band, spacing:{ after:0 }, children:[ photoRun ] }));
  }
  children.push(new Paragraph({ shading:band, spacing:{ before: photoRun?0:160, after:20 }, children:[ new TextRun({ text: fullName() || 'Your Name', bold:true, size:34, color:'FFFFFF' }) ] }));
  if(p.jobTitle) children.push(new Paragraph({ shading:band, spacing:{ after:40 }, children:[ new TextRun({ text:p.jobTitle, size:20, color:'F4F1E6' }) ] }));
  const contactParts = [p.email, p.phone, p.city, p.linkedin].filter(Boolean);
  if(contactParts.length){
    children.push(new Paragraph({ shading:band, spacing:{ after:160 }, children:[ new TextRun({ text: contactParts.join('   ·   '), size:18, color:'F4F1E6' }) ] }));
  } else {
    children.push(new Paragraph({ shading:band, spacing:{ after:160 }, children:[ new TextRun({ text:' ', color:'FFFFFF' }) ] }));
  }

  function pillHeading(text){
    return new Paragraph({
      shading:{ type: ShadingType.CLEAR, fill: soft, color:'auto' },
      spacing:{ before:220, after:100 },
      children:[ new TextRun({ text:'  '+text.toUpperCase()+'  ', bold:true, size:17, color: accent }) ]
    });
  }

  if(state.summary){
    children.push(pillHeading('Summary'));
    children.push(new Paragraph({ spacing:{ after:160 }, children:[ new TextRun({ text: state.summary, size:20 }) ] }));
  }

  children.push(pillHeading('Experience'));
  state.experience.forEach(job=>{
    children.push(docxDateLine(
      [ new TextRun({ text: job.title||'', bold:true, size:20 }) ],
      [job.start, job.end].filter(Boolean).join(' – ')
    ));
    const sub = [job.company, job.location].filter(Boolean).join(' · ');
    if(sub) children.push(new Paragraph({ spacing:{ after:40 }, children:[ new TextRun({ text:sub, italics:true, size:18, color:'777777' }) ] }));
    job.bullets.filter(Boolean).forEach(b=>{
      children.push(new Paragraph({ bullet:{ level:0 }, spacing:{ after:40 }, children:[ new TextRun({ text:b, size:19 }) ] }));
    });
    children.push(new Paragraph({ spacing:{ after:100 }, children:[] }));
  });

  if(state.education.length){
    children.push(pillHeading('Education'));
    state.education.forEach(ed=>{
      children.push(new Paragraph({ spacing:{ after:100 }, children:[
        new TextRun({ text: ed.degree||'', bold:true, size:19 }),
        new TextRun({ text: ed.school? '  —  '+ed.school : '', size:19 })
      ] }));
    });
  }
  if(state.skills.length){
    children.push(pillHeading('Skills'));
    children.push(new Paragraph({ spacing:{ after:160 }, children:[ new TextRun({ text: state.skills.join(' · '), size:19 }) ] }));
  }
  if(state.languages.length){
    children.push(pillHeading('Languages'));
    children.push(new Paragraph({ spacing:{ after:160 }, children:[ new TextRun({ text: state.languages.map(l=>`${l.name} (${l.level})`).join(' · '), size:19 }) ] }));
  }
  if(state.certifications.length){
    children.push(pillHeading('Certifications'));
    children.push(new Paragraph({ children:[ new TextRun({ text: state.certifications.join(' · '), size:19 }) ] }));
  }

  return new Document({ sections:[{ properties:{}, children }] });
}

/* ---------- COMPACT TWO-COLUMN — dense grid, matches the on-screen template ---------- */
function buildWordCompact(){
  const { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, VerticalAlign, AlignmentType } = docx;
  const p = state.personal;
  const theme = THEMES[state.theme];
  const accent = hexColor(theme.main);
  const usesPhoto = state.country === 'fr' || state.country === 'de' || state.country === 'es' || state.country === 'ar' || state.country === 'br' || state.country === 'jp' || state.country === 'it' || state.country === 'in' || state.country === 'cn';
  const noBorder = { style: BorderStyle.NONE, size:0, color:'FFFFFF' };
  const cellBorders = { top:noBorder, bottom:noBorder, left:noBorder, right:noBorder };

  const children = [];
  const photoRun = usesPhoto ? docxPhotoRun(46) : null;
  children.push(new Paragraph({
    alignment: AlignmentType.LEFT, spacing:{ after:60 },
    border:{ bottom:{ color: accent, space:4, style: BorderStyle.SINGLE, size:8 } },
    children:[
      new TextRun({ text: (fullName()||'Your Name')+'  —  ', bold:true, size:24 }),
      new TextRun({ text: p.jobTitle||'', size:18, color: accent })
    ]
  }));
  const contactParts = [p.email, p.phone, p.city, p.linkedin].filter(Boolean);
  if(contactParts.length){
    children.push(new Paragraph({ spacing:{ after:160 }, children:[ new TextRun({ text: contactParts.join('   ·   '), size:16, color:'777777' }) ] }));
  }
  if(photoRun){ children.push(new Paragraph({ alignment: AlignmentType.RIGHT, spacing:{ after:100 }, children:[ photoRun ] })); }

  const left = [];
  if(state.summary){
    left.push(docxHeading('Summary', accent));
    left.push(new Paragraph({ spacing:{ after:120 }, children:[ new TextRun({ text: state.summary, size:18 }) ] }));
  }
  left.push(docxHeading('Experience', accent));
  state.experience.forEach(job=>{
    left.push(docxDateLine(
      [ new TextRun({ text: job.title||'', bold:true, size:18 }) ],
      [job.start, job.end].filter(Boolean).join('–')
    ));
    const sub = [job.company, job.location].filter(Boolean).join(' · ');
    if(sub) left.push(new Paragraph({ spacing:{ after:30 }, children:[ new TextRun({ text:sub, italics:true, size:16, color:'777777' }) ] }));
    job.bullets.filter(Boolean).forEach(b=>{
      left.push(new Paragraph({ bullet:{ level:0 }, spacing:{ after:20 }, children:[ new TextRun({ text:b, size:17 }) ] }));
    });
    left.push(new Paragraph({ spacing:{ after:80 }, children:[] }));
  });

  const right = [];
  if(state.education.length){
    right.push(docxHeading('Education', accent));
    state.education.forEach(ed=>{
      right.push(new Paragraph({ spacing:{ after:80 }, children:[
        new TextRun({ text: ed.degree||'', bold:true, size:17 }),
        new TextRun({ text: ed.school? '  —  '+ed.school : '', size:17 })
      ] }));
    });
  }
  if(state.skills.length){
    right.push(docxHeading('Skills', accent));
    right.push(new Paragraph({ spacing:{ after:120 }, children:[ new TextRun({ text: state.skills.join(', '), size:17 }) ] }));
  }
  if(state.languages.length){
    right.push(docxHeading('Languages', accent));
    right.push(new Paragraph({ spacing:{ after:120 }, children:[ new TextRun({ text: state.languages.map(l=>`${l.name} (${l.level})`).join(', '), size:17 }) ] }));
  }
  if(state.certifications.length){
    right.push(docxHeading('Certifications', accent));
    right.push(new Paragraph({ spacing:{ after:120 }, children:[ new TextRun({ text: state.certifications.join(', '), size:17 }) ] }));
  }
  if(state.interests.length){
    right.push(docxHeading('Interests', accent));
    right.push(new Paragraph({ children:[ new TextRun({ text: state.interests.join(', '), size:17 }) ] }));
  }

  const table = new Table({
    width:{ size:100, type: WidthType.PERCENTAGE },
    borders:{ top:noBorder, bottom:noBorder, left:noBorder, right:noBorder, insideHorizontal:noBorder, insideVertical:noBorder },
    rows:[ new TableRow({ children:[
      new TableCell({ width:{ size:60, type: WidthType.PERCENTAGE }, borders:cellBorders, verticalAlign: VerticalAlign.TOP, margins:{ top:0, bottom:0, left:0, right:200 }, children:left }),
      new TableCell({ width:{ size:40, type: WidthType.PERCENTAGE }, borders:cellBorders, verticalAlign: VerticalAlign.TOP, margins:{ top:0, bottom:0, left:200, right:0 }, children:right })
    ]}) ]
  });
  children.push(table);

  return new Document({ sections:[{ properties:{}, children }] });
}

function buildWordLetter(){
  if(state.letterStyle === 'modern') return buildWordLetterModern();
  if(state.letterStyle === 'minimal') return buildWordLetterMinimal();
  return buildWordLetterClassic();
}

/* ---------- Cover letter Word export — Classic ---------- */
function buildWordLetterClassic(){
  const { Document, Paragraph, TextRun } = docx;
  const p = state.personal;
  const cl = state.coverLetter;
  const locale = LETTER_LOCALE.us; // salutation/sign-off always in English, regardless of the selected country
  const children = [];

  children.push(new Paragraph({ spacing:{ after:20 }, children:[ new TextRun({ text: fullName().toUpperCase() || 'YOUR NAME', bold:true, size:32 }) ] }));
  const contactParts = [p.email, p.phone, p.city].filter(Boolean);
  if(contactParts.length){
    children.push(new Paragraph({ spacing:{ after:240 }, children:[ new TextRun({ text: contactParts.join('   ·   '), size:19, color:'555555' }) ] }));
  }
  if(cl.date){
    children.push(new Paragraph({ spacing:{ after:200 }, children:[ new TextRun({ text: cl.date, size:20 }) ] }));
  }
  if(cl.companyName){
    [cl.hiringManager, cl.companyName].filter(Boolean).forEach(l=>{
      children.push(new Paragraph({ spacing:{ after:40 }, children:[ new TextRun({ text:l, size:20 }) ] }));
    });
    children.push(new Paragraph({ spacing:{ after:200 }, children:[] }));
  }
  children.push(new Paragraph({ spacing:{ after:200 }, children:[ new TextRun({ text: locale.salutation(cl.hiringManager), bold:true, size:21 }) ] }));

  [cl.opening, cl.body, cl.closing].filter(Boolean).forEach(para=>{
    children.push(new Paragraph({ spacing:{ after:200 }, children:[ new TextRun({ text: para, size:21 }) ] }));
  });

  children.push(new Paragraph({ spacing:{ after:400 }, children:[ new TextRun({ text: locale.closing, size:21 }) ] }));
  children.push(new Paragraph({ children:[ new TextRun({ text: fullName(), bold:true, size:21 }) ] }));

  return new Document({ sections:[{ properties:{}, children }] });
}

/* ---------- Cover letter Word export — Modern (colored header band) ---------- */
function buildWordLetterModern(){
  const { Document, Paragraph, TextRun, ShadingType } = docx;
  const p = state.personal;
  const cl = state.coverLetter;
  const locale = LETTER_LOCALE.us; // salutation/sign-off always in English, regardless of the selected country
  const theme = THEMES[state.theme];
  const band = { type: ShadingType.CLEAR, fill: hexColor(theme.main), color:'auto' };
  const children = [];

  children.push(new Paragraph({ shading:band, spacing:{ before:160, after:20 }, children:[ new TextRun({ text: fullName() || 'Your Name', bold:true, size:32, color:'FFFFFF' }) ] }));
  if(p.jobTitle) children.push(new Paragraph({ shading:band, spacing:{ after:40 }, children:[ new TextRun({ text:p.jobTitle, size:19, color:'F4F1E6' }) ] }));
  const contactParts = [p.email, p.phone, p.city].filter(Boolean);
  children.push(new Paragraph({ shading:band, spacing:{ after:160 }, children:[ new TextRun({ text: contactParts.length? contactParts.join('   ·   ') : ' ', size:18, color:'F4F1E6' }) ] }));
  children.push(new Paragraph({ spacing:{ after:200 }, children:[] }));

  if(cl.date){
    children.push(new Paragraph({ spacing:{ after:200 }, children:[ new TextRun({ text: cl.date, size:20, color:'555555' }) ] }));
  }
  if(cl.companyName){
    [cl.hiringManager, cl.companyName].filter(Boolean).forEach(l=>{
      children.push(new Paragraph({ spacing:{ after:40 }, children:[ new TextRun({ text:l, size:20 }) ] }));
    });
    children.push(new Paragraph({ spacing:{ after:200 }, children:[] }));
  }
  children.push(new Paragraph({ spacing:{ after:200 }, children:[ new TextRun({ text: locale.salutation(cl.hiringManager), bold:true, size:21, color: hexColor(theme.main) }) ] }));

  [cl.opening, cl.body, cl.closing].filter(Boolean).forEach(para=>{
    children.push(new Paragraph({ spacing:{ after:200 }, children:[ new TextRun({ text: para, size:21 }) ] }));
  });

  children.push(new Paragraph({ spacing:{ after:400 }, children:[ new TextRun({ text: locale.closing, size:21 }) ] }));
  children.push(new Paragraph({ children:[ new TextRun({ text: fullName(), bold:true, size:21, color: hexColor(theme.main) }) ] }));

  return new Document({ sections:[{ properties:{}, children }] });
}

/* ---------- Cover letter Word export — Minimalist (quiet, understated) ---------- */
function buildWordLetterMinimal(){
  const { Document, Paragraph, TextRun, BorderStyle } = docx;
  const p = state.personal;
  const cl = state.coverLetter;
  const locale = LETTER_LOCALE.us; // salutation/sign-off always in English, regardless of the selected country
  const theme = THEMES[state.theme];
  const children = [];

  children.push(new Paragraph({ spacing:{ after:20 }, children:[ new TextRun({ text: fullName() || 'Your Name', size:30 }) ] }));
  const contactParts = [p.email, p.phone, p.city].filter(Boolean);
  if(contactParts.length){
    children.push(new Paragraph({ spacing:{ after:120 }, children:[ new TextRun({ text: contactParts.join('   ·   '), size:18, color:'777777' }) ] }));
  }
  children.push(new Paragraph({
    spacing:{ after:280 },
    border:{ bottom:{ color: hexColor(theme.main), space:1, style: BorderStyle.SINGLE, size:10 } },
    children:[ new TextRun({ text:' ' }) ]
  }));

  if(cl.date){
    children.push(new Paragraph({ spacing:{ after:200 }, children:[ new TextRun({ text: cl.date, size:19, color:'999999' }) ] }));
  }
  if(cl.companyName){
    [cl.hiringManager, cl.companyName].filter(Boolean).forEach(l=>{
      children.push(new Paragraph({ spacing:{ after:40 }, children:[ new TextRun({ text:l, size:19, color:'555555' }) ] }));
    });
    children.push(new Paragraph({ spacing:{ after:200 }, children:[] }));
  }
  children.push(new Paragraph({ spacing:{ after:200 }, children:[ new TextRun({ text: locale.salutation(cl.hiringManager), bold:true, size:20 }) ] }));

  [cl.opening, cl.body, cl.closing].filter(Boolean).forEach(para=>{
    children.push(new Paragraph({ spacing:{ after:220 }, children:[ new TextRun({ text: para, size:20 }) ] }));
  });

  children.push(new Paragraph({ spacing:{ after:400 }, children:[ new TextRun({ text: locale.closing, size:20, color:'555555' }) ] }));
  children.push(new Paragraph({ children:[ new TextRun({ text: fullName(), size:20 }) ] }));

  return new Document({ sections:[{ properties:{}, children }] });
}

function downloadWord(){
  if(typeof docx === 'undefined'){
    alert('The Word export library failed to load. Check your internet connection and try again.');
    return;
  }
  const { Packer } = docx;
  const isLetter = state.view === 'letter';
  const doc = isLetter ? buildWordLetter() : buildWordCV();
  const name = (fullName() || (isLetter ? 'Cover_Letter' : 'CV')).replace(/\s+/g,'_');
  const filename = isLetter ? `${name}_Cover_Letter.docx` : `${name}_CV.docx`;
  Packer.toBlob(doc).then(blob=>{
    saveBlob(blob, filename);
  }).catch(err=>{
    console.error(err);
    alert('Something went wrong generating the Word file.');
  });
}

document.addEventListener('click', ()=>{
  let changed = false;
  if(countryMoreOpen){ countryMoreOpen = false; changed = true; }
  if(phoneCodeOpen){ phoneCodeOpen = false; changed = true; }
  if(dobPickerOpen){ dobPickerOpen = false; changed = true; }
  if(changed) render();
});

render();
fitZoomToViewport();
