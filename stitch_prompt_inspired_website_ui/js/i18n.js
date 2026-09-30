/**
 * Internationalization (i18n) Engine for Civic Waste Portal
 * Bilingual support: English (en) and Hindi (hi)
 */

const TRANSLATIONS = {
  en: {
    gov_title: "Government of India",
    sbm_mission: "Swachh Bharat Mission (Urban)",
    helpline_label: "Toll Free Helpline: 1969",
    portal_title: "पवित्र वसुथा",
    portal_sub: "Integrated Waste Management System",
    nav_home: "Home",
    nav_report: "Report Waste",
    nav_pickup: "Pickup Request",
    nav_track: "Track Complaint",
    nav_rewards: "Green Karma Rewards",
    nav_guide: "Awareness Guide",
    nav_admin: "Admin Portal",
    nav_login: "Login",
    btn_login: "Citizen Login / Register",
    live_badge: "LIVE PORTAL",
    live_strip_text: "Swachh Survekshan 2025: Ward-level Real-time Waste Tracking & Citizen AI Grievance Redressal Active",
    ulb_link: "Integrated with 4,372 Urban Local Bodies (ULBs)",
    hero_badge: "National Cleanliness Initiative • National Waste Action Plan",
    hero_title: "Building a Cleaner India: The Integrated Waste Management Platform",
    hero_desc: "A centralized digital ecosystem to report waste issues, schedule automated pickups, track complaints in real-time, and optimize municipal waste logistics across every urban ward.",
    hero_btn_report: "Report Waste Issue",
    hero_btn_schedule: "Schedule Pickup",
    trust_mohua: "MoHUA Verified Citizen Framework",
    trust_sla: "Avg SLA Resolution: 4.2 Hours",
    tab_report: "Quick Report",
    tab_track: "Track Status",
    report_box_title: "1-Click Waste Reporting",
    report_box_sub: "Capture or upload photo; our geo-spatial AI auto-tags your municipal ward.",
    drag_drop_text: "Click to take photo or drop image",
    drag_drop_sub: "Geo-location & timestamp will be pinned",
    waste_category_label: "Waste Category",
    location_label: "Detecting GPS: Sector 14, Urban Ward 28",
    btn_submit_report: "Submit Geo-Tagged Report",
    bin_green: "Green Bin (Wet Waste)",
    bin_blue: "Blue Bin (Dry Waste)",
    bin_red: "Red Bin (Domestic Hazardous)",
    search_prompt: "Quick Bin Finder: Search waste items...",
    search_placeholder: "Search waste item (e.g. Pizza Box, Used Tea Leaves, Battery)..."
  },
  hi: {
    gov_title: "भारत सरकार",
    sbm_mission: "स्वच्छ भारत मिशन (शहरी)",
    helpline_label: "टोल फ्री हेल्पलाइन: 1969",
    portal_title: "पवित्र वसुथा",
    portal_sub: "एकीकृत अपशिष्ट प्रबंधन प्रणाली",
    nav_home: "होम",
    nav_report: "कचरा रिपोर्ट करें",
    nav_pickup: "पिकअप अनुरोध",
    nav_track: "शिकायत स्थिति",
    nav_rewards: "ग्रीन कर्मा रिवॉर्ड्स",
    nav_guide: "जागरूकता गाइड",
    nav_admin: "कमांड कंसोल",
    nav_login: "लॉगिन",
    btn_login: "नागरिक लॉगिन / पंजीकरण",
    live_badge: "लाइव पोर्टल",
    live_strip_text: "स्वच्छ सर्वेक्षण 2025: वार्ड-स्तरीय रीयल-टाइम अपशिष्ट ट्रैकिंग और एआई शिकायत निवारण सक्रिय",
    ulb_link: "4,372 शहरी स्थानीय निकायों (ULBs) से एकीकृत",
    hero_badge: "राष्ट्रीय स्वच्छता पहल • राष्ट्रीय अपशिष्ट कार्य योजना",
    hero_title: "स्वच्छ भारत का निर्माण: एकीकृत अपशिष्ट प्रबंधन डिजिटल मंच",
    hero_desc: "कचरे की समस्या रिपोर्ट करने, स्वचालित पिकअप शेड्यूल करने, शिकायतों को रीयल-टाइम ट्रैक करने और प्रत्येक शहरी वार्ड में अपशिष्ट रसद को अनुकूलित करने के लिए एक डिजिटल प्लेटफॉर्म।",
    hero_btn_report: "कचरा समस्या रिपोर्ट करें",
    hero_btn_schedule: "डोरस्टेप पिकअप बुक करें",
    trust_mohua: "आवासन एवं शहरी कार्य मंत्रालय द्वारा सत्यापित",
    trust_sla: "औसत समाधान समय: 4.2 घंटे",
    tab_report: "त्वरित रिपोर्ट",
    tab_track: "स्थिति ट्रैक करें",
    report_box_title: "1-क्लिक कचरा रिपोर्टिंग",
    report_box_sub: "फोटो खींचें या अपलोड करें; हमारा भू-स्थानिक AI स्वतः आपके वार्ड को टैग करेगा।",
    drag_drop_text: "फोटो खींचने या अपलोड करने के लिए क्लिक करें",
    drag_drop_sub: "जीपीएस स्थान और समय स्वतः दर्ज किया जाएगा",
    waste_category_label: "कचरे की श्रेणी",
    location_label: "जीपीएस स्थान: सेक्टर 14, शहरी वार्ड 28",
    btn_submit_report: "जियो-टैग रिपोर्ट सबमिट करें",
    bin_green: "हरा बिन (गीला जैविक कचरा)",
    bin_blue: "नीला बिन (सूखा पुनर्चक्रण कचरा)",
    bin_red: "लाल बिन (घरेलू हानिकारक कचरा)",
    search_prompt: "त्वरित बिन खोजक: कचरे की वस्तु खोजें...",
    search_placeholder: "कचरे की वस्तु खोजें (जैसे पिज्जा बॉक्स, चाय पत्ती, बैटरी)..."
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('swachh_portal_lang') || 'en';
  }

  setLang(lang) {
    if (lang !== 'en' && lang !== 'hi') lang = 'en';
    this.currentLang = lang;
    localStorage.setItem('swachh_portal_lang', lang);
    document.documentElement.lang = lang;
    this.applyTranslations();
  }

  t(key) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && TRANSLATIONS[this.currentLang] && TRANSLATIONS[this.currentLang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = TRANSLATIONS[this.currentLang][key];
        } else {
          el.textContent = TRANSLATIONS[this.currentLang][key];
        }
      }
    });

    // Update active state on language pills
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang-btn');
      if (btnLang === this.currentLang) {
        btn.classList.add('bg-primary', 'text-on-primary');
        btn.classList.remove('text-secondary-fixed-dim', 'hover:bg-surface-container-high');
      } else {
        btn.classList.remove('bg-primary', 'text-on-primary');
        btn.classList.add('text-secondary-fixed-dim', 'hover:bg-surface-container-high');
      }
    });
  }
}

window.i18n = new I18nManager();
