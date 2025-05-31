"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const languageOptions = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "gu", name: "ગુજરાતી (Gujarati)" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", name: "മലയാളം (Malayalam)" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "or", name: "ଓଡ଼ିଆ (Odia)" },
  { code: "as", name: "অসমীয়া (Assamese)" },
  { code: "ur", name: "اردو (Urdu)" },
  { code: "ks", name: "کٲشُر (Kashmiri)" },
  { code: "sd", name: "سنڌي (Sindhi)" },
  { code: "kok", name: "कोंकणी (Konkani)" },
  { code: "mai", name: "मैथिली (Maithili)" },
  { code: "mni", name: "মৈতৈলোন্ (Manipuri)" },
  { code: "doi", name: "डोगरी (Dogri)" },
  { code: "brx", name: "बड़ो (Bodo)" },
  { code: "sat", name: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)" },
  { code: "ne", name: "नेपाली (Nepali)" },
];

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  languages: { code: string; label: string }[];
  t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    your_portfolios: "Your Portfolios",
    total_value: "Total Value",
    created_on: "Created on",
    add_portfolio: "Add Portfolio",
    retirement_fund: "Retirement Fund",
    tech_stocks: "Tech Stocks",
    real_estate: "Real Estate",
    description: "Description",
    long_term_investments: "Long-term investments for retirement",
    high_growth_technology: "High growth technology investments",
    property_investments: "Property investments and REITs",
  },
  hi: {
    welcome: "स्वागत है",
    add: "जोड़ें",
    edit: "संपादित करें",
    delete: "हटाएं",
    your_portfolios: "आपकी पोर्टफोलियो",
    total_value: "कुल मूल्य",
    created_on: "निर्मित",
    add_portfolio: "पोर्टफोलियो जोड़ें",
    retirement_fund: "रिटायरमेंट फंड",
    tech_stocks: "टेक स्टॉक्स",
    real_estate: "रियल एस्टेट",
    description: "विवरण",
    long_term_investments: "रिटायरमेंट के लिए दीर्घकालिक निवेश",
    high_growth_technology: "तेज़ विकास वाली तकनीकी निवेश",
    property_investments: "संपत्ति निवेश और REITs",
  },
  mr: {
    welcome: "स्वागत आहे",
    add: "जोडा",
    edit: "संपादित करा",
    delete: "हटवा",
    your_portfolios: "तुमचे पोर्टफोलिओ",
    total_value: "एकूण मूल्य",
    created_on: "निर्मित",
    add_portfolio: "पोर्टफोलिओ जोडा",
    retirement_fund: "निवृत्ती निधी",
    tech_stocks: "टेक स्टॉक्स",
    real_estate: "रिअल इस्टेट",
    description: "वर्णन",
    long_term_investments: "निवृत्तीसाठी दीर्घकालीन गुंतवणूक",
    high_growth_technology: "उच्च वाढीचे तंत्रज्ञान गुंतवणूक",
    property_investments: "मालमत्ता गुंतवणूक आणि REITs",
  },
  bn: {
    welcome: "স্বাগতম",
    add: "যোগ করুন",
    edit: "সম্পাদনা",
    delete: "মুছুন",
  },
  te: {
    welcome: "స్వాగతం",
    add: "చేర్చు",
    edit: "సవరించు",
    delete: "తొలగించు",
  },
  mr: {
    welcome: "स्वागत आहे",
    add: "जोडा",
    edit: "संपादित करा",
    delete: "हटवा",
  },
  ta: { welcome: "வரவேற்கிறோம்", add: "சேர்", edit: "திருத்து", delete: "அழி" },
  ur: {
    welcome: "خوش آمدید",
    add: "شامل کریں",
    edit: "ترمیم کریں",
    delete: "حذف کریں",
  },
  gu: {
    welcome: "સ્વાગત છે",
    add: "ઉમેરો",
    edit: "સંપાદિત કરો",
    delete: "કાઢી નાખો",
  },
  kn: { welcome: "ಸ್ವಾಗತ", add: "ಸೇರಿಸಿ", edit: "ತಿದ್ದು", delete: "ಅಳಿಸಿ" },
  ml: {
    welcome: "സ്വാഗതം",
    add: "ചേർക്കുക",
    edit: "തിരുത്തുക",
    delete: "നീക്കം ചെയ്യുക",
  },
  or: {
    welcome: "ସ୍ୱାଗତ",
    add: "ଯୋଡନ୍ତୁ",
    edit: "ସମ୍ପାଦନ କରନ୍ତୁ",
    delete: "ଅପସାରଣ କରନ୍ତୁ",
  },
  pa: { welcome: "ਸੁਆਗਤ ਹੈ", add: "ਸ਼ਾਮਲ ਕਰੋ", edit: "ਸੋਧੋ", delete: "ਹटਾਓ" },
  as: {
    welcome: "স্বাগতম",
    add: "যোগ কৰক",
    edit: "সম্পাদনা কৰক",
    delete: "আঁতৰাওক",
  },
  mai: {
    welcome: "स्वागत अछि",
    add: "जोड़ू",
    edit: "संपादित करू",
    delete: "हटाऊ",
  },
  sat: { welcome: "ᱵᱟᱝᱜᱟᱱ", add: "ᱥᱮᱫᱽᱨᱮᱭ", edit: "ᱵᱟᱝᱜᱟᱱ", delete: "ᱦᱟᱹᱞᱤᱭ" },
  ks: {
    welcome: "خوش آمدید",
    add: "شامل کریں",
    edit: "ترمیم کریں",
    delete: "حذف کریں",
  },
  ne: {
    welcome: "स्वागत छ",
    add: "थप्नुहोस्",
    edit: "सम्पादन गर्नुहोस्",
    delete: "हटाउनुहोस्",
  },
  kok: { welcome: "स्वागत", add: "जोडा", edit: "संपादित करा", delete: "काढा" },
  sd: {
    welcome: "ڀليڪار",
    add: "شامل ڪريو",
    edit: "ترميم ڪريو",
    delete: "هٽايو",
  },
  doi: { welcome: "स्वागत", add: "जोड़ो", edit: "संपादित करो", delete: "हटाओ" },
  mni: {
    welcome: "ꯑꯃꯣꯅꯤꯡ ꯍꯥꯏ",
    add: "ꯃꯥꯏ ꯍꯥꯏꯕ",
    edit: "ꯃꯥꯏ ꯍꯥꯏꯕ",
    delete: "ꯃꯥꯏ ꯍꯥꯏꯕ",
  },
  brx: { welcome: "बड़ो", add: "जोड़ो", edit: "संपादित करो", delete: "हटाओ" },
  es: {
    welcome: "Bienvenido",
    add: "Agregar",
    edit: "Editar",
    delete: "Eliminar",
  },
  fr: {
    welcome: "Bienvenue",
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
  },
  de: {
    welcome: "Willkommen",
    add: "Hinzufügen",
    edit: "Bearbeiten",
    delete: "Löschen",
  },
  zh: { welcome: "欢迎", add: "添加", edit: "编辑", delete: "删除" },
};

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState(languageOptions[0]);

  const setLanguageState = (lang: string) => {
    setLanguage(
      languageOptions.find((l) => l.code === lang) || languageOptions[0]
    );
  };

  const t = (key: string) => translations[language.code]?.[key] || key;

  return (
    <LanguageContext.Provider
      value={{
        language: language.code,
        setLanguage,
        languages: languageOptions,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
