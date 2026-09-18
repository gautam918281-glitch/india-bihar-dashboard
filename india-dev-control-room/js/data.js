/** Official government data (as of Sep 2026) — sources clearly marked. Structure ready for live API. */
const DEMO = false;

const STATES = [
  { id:'br', en:'Bihar', hi:'बिहार', popular:true }
];

function blank(id, en, hi, unit, src, url) {
  return {
    id, name:{en,hi}, value:'—', previous:'—', change:null, unit,
    period:'Official series when connected', lastUpdated:'Not yet filled',
    source:src, sourceUrl:url, frequency:'Varies', status:'demo',
    definition: en + ' — official definition from source agency.',
    citizenWhy: 'Yeh soochak aam nagrik ki zindagi se juda hai.'
  };
}

function stateTemplate() {
  return {
    inflation: blank('inflation','Inflation (Price Rise)','महँगाई','%','MoSPI CPI','https://cpi.mospi.gov.in/'),
    unemployment: blank('unemployment','Unemployment','बेरोजगारी','%','MoSPI PLFS','https://www.mospi.gov.in/'),
    literacy: blank('literacy','Literacy','साक्षरता','%','PLFS / Census','https://www.mospi.gov.in/'),
    lifeExpectancy: blank('lifeExpectancy','Life Expectancy','औसत आयु','years','SRS','https://censusindia.gov.in/'),
    electricity: blank('electricity','Electricity Access','बिजली पहुँच','%','Ministry of Power','https://powermin.gov.in/'),
    poverty: blank('poverty','Multidimensional Poverty','बहुआयामी गरीबी','%','NITI Aayog','https://www.niti.gov.in/')
  };
}

const INDICATORS = {
  india: {
    inflation: {
      id:'inflation', name:{en:'Inflation (Price Rise)',hi:'महँगाई'},
      value:'4.82', previous:'4.45', change:'+0.37', unit:'%',
      period:'August 2026 (Provisional)', lastUpdated:'14 Sep 2026',
      source:'MoSPI — CPI (Base 2024=100)', sourceUrl:'https://cpi.mospi.gov.in/', frequency:'Monthly', status:'live',
      definition:'Cheezon ke daam kitni tez badh rahe hain, ye batata hai.',
      citizenWhy:'Mahangaai seedha ghar ke kharche ko chhuuti hai — sabzi, daal, petrol, school fees.'
    },
    unemployment: {
      id:'unemployment', name:{en:'Unemployment',hi:'बेरोजगारी'},
      value:'5.0', previous:'5.1', change:'-0.1', unit:'%',
      period:'August 2026 (PLFS monthly)', lastUpdated:'15 Sep 2026',
      source:'MoSPI — PLFS', sourceUrl:'https://www.mospi.gov.in/', frequency:'Monthly', status:'live',
      definition:'Kaam dhoondhne walon mein se kitne logon ko kaam nahi mila (15+ years).',
      citizenWhy:'Rozgar parivar ki kamai, izzat aur bhavishya se juda hai.'
    },
    literacy: {
      id:'literacy', name:{en:'Literacy',hi:'साक्षरता'},
      value:'80.9', previous:'77.7', change:'+3.2', unit:'%',
      period:'PLFS 2023-24 (age 7+)', lastUpdated:'2025',
      source:'MoSPI — PLFS', sourceUrl:'https://www.mospi.gov.in/', frequency:'Annual', status:'live',
      definition:'Kitne log (7 saal aur upar) padh aur likh sakte hain.',
      citizenWhy:'Padhai se behtar naukri, sehat samajhna aur adhikar jaanna aasaan hota hai.'
    },
    lifeExpectancy: {
      id:'lifeExpectancy', name:{en:'Life Expectancy',hi:'औसत आयु / स्वास्थ्य'},
      value:'70.3', previous:'69.9', change:'+0.4', unit:'years',
      period:'SRS 2019-23', lastUpdated:'2025-26',
      source:'SRS — Registrar General of India', sourceUrl:'https://censusindia.gov.in/', frequency:'Annual', status:'live',
      definition:'Janm ke samay ek bacche ke jeene ki ummeed (saalon mein).',
      citizenWhy:'Desh ki sehat, poshan aur aspatalon ka ek bada sanket.'
    },
    electricity: {
      id:'electricity', name:{en:'Electricity Access',hi:'बिजली पहुँच'},
      value:'99.5', previous:'96.0', change:'+3.5', unit:'%',
      period:'Recent official estimate', lastUpdated:'2024-25',
      source:'Ministry of Power', sourceUrl:'https://powermin.gov.in/', frequency:'Periodic', status:'live',
      definition:'Kitne gharo mein bijli ka connection hai.',
      citizenWhy:'Bijli ke bina padhai, dawa, paani pump aur digital seva mushkil.'
    },
    poverty: {
      id:'poverty', name:{en:'Multidimensional Poverty',hi:'बहुआयामी गरीबी'},
      value:'14.96', previous:'24.85', change:'-9.89', unit:'%',
      period:'NFHS-5 (2019-21)', lastUpdated:'2023 (NITI report)',
      source:'NITI Aayog MPI', sourceUrl:'https://www.niti.gov.in/', frequency:'Periodic', status:'live',
      definition:'Shiksha, sehat aur buniyadi suvidhaon se vanchit logon ka hissa.',
      citizenWhy:'Sirf income nahi — ghar, school, dawa, bijli sab milakar dekhte hain.'
    }
  }
};

STATES.forEach(s => { INDICATORS[s.id] = stateTemplate(); });

// Bihar — official numbers filled
INDICATORS.br = {
  inflation: blank('inflation','Inflation (Price Rise)','महँगाई','%','MoSPI CPI','https://cpi.mospi.gov.in/'),
  unemployment: {
    id:'unemployment', name:{en:'Unemployment',hi:'बेरोजगारी'},
    value:'3.0', previous:'3.9', change:'-0.9', unit:'%',
    period:'PLFS 2023-24 (usual status)', lastUpdated:'2025',
    source:'MoSPI — PLFS', sourceUrl:'https://www.mospi.gov.in/', frequency:'Annual', status:'live',
    definition:'Kaam dhoondhne walon mein se kitne logon ko kaam nahi mila.',
    citizenWhy:'Rozgar parivar ki kamai, izzat aur bhavishya se juda hai.'
  },
  literacy: {
    id:'literacy', name:{en:'Literacy',hi:'साक्षरता'},
    value:'74.3', previous:'61.8', change:'+12.5', unit:'%',
    period:'PLFS 2023-24 (age 7+)', lastUpdated:'2025',
    source:'MoSPI — PLFS', sourceUrl:'https://www.mospi.gov.in/', frequency:'Annual', status:'live',
    definition:'Kitne log (7 saal aur upar) padh aur likh sakte hain.',
    citizenWhy:'Shiksha har parivar ke bacchon ke bhavishya se judi hai.'
  },
  lifeExpectancy: {
    id:'lifeExpectancy', name:{en:'Life Expectancy',hi:'औसत आयु'},
    value:'69.3', previous:'69.0', change:'+0.3', unit:'years',
    period:'SRS 2019-23', lastUpdated:'2025-26',
    source:'SRS — RGI', sourceUrl:'https://censusindia.gov.in/', frequency:'Annual', status:'live',
    definition:'Janm ke samay ek bacche ke jeene ki ummeed.',
    citizenWhy:'Rajya ki sehat aur aspatalon ka sanket.'
  },
  electricity: blank('electricity','Electricity Access','बिजली पहुँच','%','Ministry of Power','https://powermin.gov.in/'),
  poverty: {
    id:'poverty', name:{en:'Multidimensional Poverty',hi:'बहुआयामी गरीबी'},
    value:'33.76', previous:'51.89', change:'-18.13', unit:'%',
    period:'NFHS-5 (2019-21)', lastUpdated:'2023 (NITI)',
    source:'NITI Aayog MPI', sourceUrl:'https://www.niti.gov.in/', frequency:'Periodic', status:'live',
    definition:'Shiksha, sehat aur buniyadi suvidhaon se vanchit logon ka hissa.',
    citizenWhy:'Sirf income nahi — ghar, school, dawa, bijli sab milakar dekhte hain.'
  }
};

// Major states literacy (PLFS 2023-24 where available, else Census 2011 for trend)
const LIT = {
  br:['74.3','61.8','+12.5']
};
Object.keys(LIT).forEach(id => {
  if (!INDICATORS[id]) return;
  const [v,p,c] = LIT[id];
  INDICATORS[id].literacy = {
    id:'literacy', name:{en:'Literacy',hi:'साक्षरता'},
    value:v, previous:p, change:c==='—'?null:c, unit:'%',
    period:'PLFS 2023-24 (age 7+) / Census trend', lastUpdated:'2025',
    source:'MoSPI PLFS / Census', sourceUrl:'https://www.mospi.gov.in/',
    frequency:'Annual', status:'live',
    definition:'Kitne log padh aur likh sakte hain.',
    citizenWhy:'Shiksha har parivar ke bacchon ke bhavishya se judi hai.'
  };
});

const CITIZEN_TOPICS = [
  { id:'inflation', en:'Prices', hi:'महँगाई', icon:'🛒' },
  { id:'unemployment', en:'Jobs', hi:'रोज़गार', icon:'👷' },
  { id:'literacy', en:'Education', hi:'शिक्षा', icon:'📚' },
  { id:'lifeExpectancy', en:'Health', hi:'स्वास्थ्य', icon:'🏥' },
  { id:'electricity', en:'Electricity', hi:'बिजली', icon:'⚡' },
  { id:'poverty', en:'Poverty', hi:'गरीबी', icon:'🏠' }
];

/** Chart series — based on official published figures */
const CHART_SERIES = {
  india: {
    inflation: { labels: ['Jan 26','Mar 26','May 26','Jun 26','Jul 26','Aug 26'], values: [2.74, 3.40, 3.93, 4.38, 4.45, 4.82], unit: '%' },
    unemployment: { labels: ['2021','2022','2023','2024','2025','Aug 26'], values: [4.2, 4.1, 3.5, 3.2, 5.1, 5.0], unit: '%' },
    literacy: { labels: ['2001','2011','2017-18','2023-24'], values: [64.8, 74.0, 77.7, 80.9], unit: '%' },
    poverty: { labels: ['2015-16','2019-21'], values: [24.85, 14.96], unit: '%' }
  },
  br: {
    literacy: { labels: ['2001','2011','2023-24'], values: [47.0, 61.8, 74.3], unit: '%' },
    poverty: { labels: ['2015-16','2019-21'], values: [51.89, 33.76], unit: '%' },
    unemployment: { labels: ['2021-22','2022-23','2023-24'], values: [6.0, 3.9, 3.0], unit: '%' }
  }
};

function getChartSeries(loc, key) {
  const block = CHART_SERIES[loc] || {};
  if (block[key]) return block[key];
  return { labels: ['—'], values: [null], unit: '' };
}
