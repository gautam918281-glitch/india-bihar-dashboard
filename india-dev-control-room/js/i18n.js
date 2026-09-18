const I18N = {
  en: {
    title: 'India Citizen Dashboard',
    subtitle: 'Prices · Jobs · Education · Health — simple view',
    india: 'India',
    national: 'All-India figures',
    choose_place: 'Choose place',
    pick_state: '— Select your state —',
    smart_title: 'Development chain',
    smart_sub: 'From education to better life — each step is linked. Tap to open the figure.',
    analysis_title: 'Analysis view',
    analysis_sub: 'Trends & comparison — charts update when you change place',
    tap_card: 'Tap card → chart & meaning',
    card_chart: 'Trend for this indicator',

    popular: 'Popular states',
    all_states: 'All states',
    last_update: 'Last update (demo):',
    key_for_you: 'What matters for citizens',
    topics: '6 essential topics',
    compare_title: 'India vs selected state',
    why_this: 'Why these 6 numbers?',
    why_text: 'Every family feels prices, jobs, schooling, health, power and hardship. This page shows only those — for India or your state.',
    how_read: 'How to read',
    how_read_text: 'Tap any card for meaning in simple words + official source link. DEMO label means sample, not live government release.',
    sources: 'Official sources (when live)',
    api_note: 'State data differs. After APIs connect, each state shows only what official series publish.',
    footer: 'Citizen information (Demo). Not an official government website.',
    charts_title: 'Trends & comparison (charts)',
    chart_hint: 'Charts change when you switch India / state. Real series after API.',
    chart_compare: 'India vs state — comparison',
    view_details: 'Know more →',
    previous: 'Previous',
    period: 'Period',
    source: 'Source',
    what_means: 'What does this mean?',
    why_care: 'Why should you care?',
    official_source: 'Official source',
    unavailable: 'Latest official data unavailable',
    demo_notice: 'DEMO DATA — NOT LIVE',
    showing: 'Showing:',
    india_val: 'India',
    state_val: 'Your state'
  },
  hi: {
    title: 'भारत नागरिक डैशबोर्ड',
    subtitle: 'महँगाई · रोज़गार · शिक्षा · स्वास्थ्य — सरल दृष्टि',
    india: 'भारत',
    national: 'पूरे देश के आँकड़े',
    choose_place: 'जगह चुनें',
    pick_state: '— अपना राज्य चुनें —',
    smart_title: 'विकास की कड़ी',
    smart_sub: 'शिक्षा से बेहतर जीवन तक — हर चरण जुड़ा है। दबाकर आँकड़ा खोलें।',
    analysis_title: 'विश्लेषण दृश्य',
    analysis_sub: 'रुझान व तुलना — जगह बदलते ही चार्ट अपडेट',
    tap_card: 'कार्ड दबाएँ → चार्ट व मतलब',
    card_chart: 'इस आँकड़े का रुझान',

    popular: 'प्रमुख राज्य',
    all_states: 'सभी राज्य',
    last_update: 'अंतिम अपडेट (डेमो):',
    key_for_you: 'नागरिकों के लिए ज़रूरी आँकड़े',
    topics: '6 ज़रूरी विषय',
    compare_title: 'भारत बनाम चुना हुआ राज्य',
    why_this: 'ये 6 आँकड़े क्यों?',
    why_text: 'हर परिवार महँगाई, नौकरी, स्कूल, सेहत, बिजली और कठिनाई महसूस करता है। यहाँ सिर्फ वही — भारत या आपके राज्य के लिए।',
    how_read: 'कैसे पढ़ें',
    how_read_text: 'किसी भी कार्ड पर टैप करें — सरल मतलब + आधिकारिक स्रोत। DEMO का मतलब सैंपल है, लाइव सरकारी आँकड़ा नहीं।',
    sources: 'आधिकारिक स्रोत (लाइव होने पर)',
    api_note: 'हर राज्य का डेटा अलग होता है। API के बाद जहाँ आधिकारिक श्रृंखला होगी वहीं दिखेगी।',
    footer: 'नागरिक सूचना (डेमो)। यह सरकारी आधिकारिक वेबसाइट नहीं है।',
    charts_title: 'रुझान और तुलना (चार्ट)',
    chart_hint: 'जगह बदलते ही चार्ट डेटा के हिसाब से बदलेगा। API के बाद असली श्रृंखला।',
    chart_compare: 'भारत vs राज्य — तुलना',
    view_details: 'और जानें →',
    previous: 'पिछला',
    period: 'अवधि',
    source: 'स्रोत',
    what_means: 'इसका क्या मतलब है?',
    why_care: 'आपको क्यों जानना चाहिए?',
    official_source: 'आधिकारिक स्रोत',
    unavailable: 'नवीनतम आधिकारिक डेटा उपलब्ध नहीं',
    demo_notice: 'डेमो डेटा — लाइव नहीं',
    showing: 'दिखा रहा है:',
    india_val: 'भारत',
    state_val: 'आपका राज्य'
  }
};
let currentLang = 'hi';
function t(k){ return (I18N[currentLang]&&I18N[currentLang][k])||I18N.en[k]||k; }
function setLang(lang){
  currentLang = lang;
  document.documentElement.lang = lang==='hi'?'hi':'en';
  ['lang-en','lang-hi'].forEach(id=>{
    const b=document.getElementById(id); if(!b)return;
    const on = (id==='lang-en'&&lang==='en')||(id==='lang-hi'&&lang==='hi');
    b.classList.toggle('bg-navy-800',on); b.classList.toggle('text-white',on);
  });
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n'); if(I18N[lang][k]) el.textContent=I18N[lang][k];
  });
  fillStateSelect();
  if(typeof renderAll==='function') renderAll();
  localStorage.setItem('idcr-lang',lang);
}
