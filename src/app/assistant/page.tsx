"use client";

import { useState } from "react";
import { ArrowLeft, Bot, Send, Sprout, CloudSun, Bug, Droplets, Wallet, MessageCircle } from "lucide-react";
import Link from "next/link";

type Language = "Marathi" | "Hindi" | "English";
type Message = { role: "assistant" | "user"; text: string };

const copy = {
  English: {
    title: "Farm Help", subtitle: "Ask farming questions in your language",
    intro: "Namaste! I can help with general crop care, watering, pests, weather precautions and farm expenses. Tell me your crop and what you are noticing.",
    placeholder: "Ask about your crop…", send: "Ask", back: "Back to dashboard",
    quickTitle: "Try asking", disclaimer: "Prototype guidance only. This version uses prepared guidance, not a connected AI model. Advice depends on your location, crop stage and local conditions. For serious crop disease, confirm with your local agricultural officer or KVK.",
    prompts: ["How should I water my crop?", "What should I do about pests?", "How can I reduce farming costs?", "What should I check before using fertilizer?"],
    water: "Watering depends on the crop, soil, crop stage and recent rain. Check soil moisture near the root zone before irrigating, avoid waterlogging, and prefer cooler morning or evening hours. Tell me your crop, soil type and when it last rained for more relevant general guidance.",
    pest: "First identify the pest and the affected part of the plant. Check a few plants across the field, remove badly affected plant parts only where appropriate, and avoid spraying an unknown chemical. Take clear photos and ask your local Krishi Sahayak or KVK before choosing a pesticide. Follow the product label and protective equipment instructions.",
    cost: "Start by recording every input, labour, irrigation, transport and machinery cost against the correct crop. Compare planned budget with actual spending each week, avoid duplicate purchases, and compare supplier prices and quality. Do not reduce essential crop care without checking likely yield impact.",
    fertilizer: "Before applying fertilizer, identify the crop and growth stage and check the soil-test recommendation if available. Use the recommended dose and method; more fertilizer does not always mean more yield. Do not mix products unless the label or a qualified agricultural adviser confirms it is safe.",
    weather: "Check the local forecast before irrigation, spraying or harvesting. Avoid spraying in strong wind or just before rain, and take precautions for heat or heavy rainfall. This assistant does not have your village's live weather unless you check the Weather section.",
    disease: "Look at which leaves, stems or fruits are affected, how quickly symptoms spread, and whether the pattern is in patches. Take clear photos of the whole plant and the affected area. Do not apply a pesticide based on a guess; confirm the diagnosis with your local agricultural officer or KVK.",
    market: "Record the market name, date, crop variety/grade and quoted price. Compare more than one buyer if possible, and include transport, commission and handling costs before deciding. This demo does not provide verified live mandi prices.",
    general: "I can offer general guidance on watering, fertilizer safety, pests, crop symptoms, weather precautions and tracking farm costs. Please mention your crop, village/district, crop stage and what you observed. For location-specific or high-risk decisions, confirm with your local agricultural officer or KVK.",
    noQuestion: "Please type a question or choose one of the suggested topics.",
    promptCrop: "For more useful guidance, tell me the crop, your village or district, the crop stage and what you have observed.",
    newChat: "Clear conversation"
  },
  Marathi: {
    title: "शेती मदतनीस", subtitle: "तुमच्या भाषेत शेतीविषयक प्रश्न विचारा",
    intro: "नमस्कार! पीक काळजी, पाणी, कीड, हवामानातील खबरदारी आणि शेतीखर्च याबाबत सामान्य मार्गदर्शन करू शकतो. तुमचे पीक आणि त्यात काय दिसत आहे ते सांगा.",
    placeholder: "तुमच्या पिकाबद्दल विचारा…", send: "विचारा", back: "डॅशबोर्डवर परत जा",
    quickTitle: "असे प्रश्न विचारा", disclaimer: "ही प्राथमिक नमुना मार्गदर्शन सुविधा आहे. या आवृत्तीत तयार केलेले मार्गदर्शन आहे; प्रत्यक्ष AI मॉडेल जोडलेले नाही. योग्य सल्ला स्थान, पीक अवस्था आणि स्थानिक परिस्थितीवर अवलंबून असतो. गंभीर रोग किंवा किडीसाठी स्थानिक कृषी अधिकारी किंवा कृषी विज्ञान केंद्राशी संपर्क साधा.",
    prompts: ["पिकाला पाणी कधी द्यावे?", "किड दिसल्यास काय करावे?", "शेतीचा खर्च कसा कमी करावा?", "खत वापरण्यापूर्वी काय तपासावे?"],
    water: "पाणी देणे हे पीक, माती, पिकाची अवस्था आणि अलीकडील पावसावर अवलंबून असते. पाणी देण्यापूर्वी मुळांजवळील मातीतील ओलावा तपासा. शेतात पाणी साचू देऊ नका आणि शक्यतो सकाळी किंवा संध्याकाळी पाणी द्या. अधिक योग्य सामान्य मार्गदर्शनासाठी पीक, मातीचा प्रकार आणि शेवटचा पाऊस कधी झाला ते सांगा.",
    pest: "सर्वप्रथम किड ओळखण्याचा आणि झाडाचा कोणता भाग बाधित आहे हे पाहण्याचा प्रयत्न करा. शेतातील वेगवेगळ्या भागांतील काही झाडे तपासा. किड ओळखल्याशिवाय कोणतेही रसायन फवारू नका. स्पष्ट फोटो घेऊन स्थानिक कृषी सहाय्यक किंवा कृषी विज्ञान केंद्राचा सल्ला घ्या. औषधाच्या लेबलवरील सूचना आणि सुरक्षा साधने पाळा.",
    cost: "बियाणे, खते, मजुरी, सिंचन, वाहतूक आणि यंत्रसामग्रीचा प्रत्येक खर्च योग्य पिकाच्या नोंदीत लिहा. दर आठवड्याला नियोजित बजेट आणि प्रत्यक्ष खर्चाची तुलना करा. अनावश्यक दुबार खरेदी टाळा आणि पुरवठादारांचे दर व गुणवत्ता तपासा. उत्पादनावर परिणाम होऊ शकतो असा आवश्यक खर्च कमी करण्यापूर्वी तज्ज्ञांचा सल्ला घ्या.",
    fertilizer: "खत देण्यापूर्वी पीक, वाढीची अवस्था आणि उपलब्ध असल्यास माती परीक्षणाची शिफारस तपासा. शिफारस केलेले प्रमाण आणि पद्धत पाळा; जास्त खत म्हणजे नेहमी जास्त उत्पादन असे नाही. लेबल किंवा पात्र कृषी तज्ज्ञांनी सुरक्षित सांगितल्याशिवाय वेगवेगळी उत्पादने मिसळू नका.",
    weather: "सिंचन, फवारणी किंवा कापणीपूर्वी स्थानिक हवामान अंदाज तपासा. जोरदार वाऱ्यात किंवा पावसाच्या अगोदर फवारणी टाळा. उष्णता किंवा मुसळधार पावसासाठी योग्य खबरदारी घ्या. तुमच्या गावाचा थेट हवामान अंदाज पाहण्यासाठी या अॅपमधील हवामान विभाग तपासा.",
    disease: "कोणती पाने, खोड किंवा फळे बाधित आहेत, लक्षणे किती वेगाने पसरतात आणि ती ठरावीक भागात दिसतात का हे पाहा. पूर्ण झाडाचे आणि बाधित भागाचे स्पष्ट फोटो घ्या. अंदाजाने कीटकनाशक वापरू नका; स्थानिक कृषी अधिकारी किंवा कृषी विज्ञान केंद्राकडून निदानाची खात्री करा.",
    market: "बाजाराचे नाव, तारीख, पिकाची जात/प्रत आणि मिळालेला भाव नोंदवा. शक्य असल्यास एकापेक्षा जास्त खरेदीदारांचे भाव तपासा. निर्णय घेण्यापूर्वी वाहतूक, कमिशन आणि हाताळणीचा खर्चही मोजा. या नमुना आवृत्तीत अधिकृत थेट बाजारभाव उपलब्ध नाहीत.",
    general: "पाणी व्यवस्थापन, खत सुरक्षितता, कीड, पिकांची लक्षणे, हवामानातील खबरदारी आणि शेतीखर्च नोंदवण्याबाबत सामान्य मार्गदर्शन देऊ शकतो. तुमचे पीक, गाव किंवा जिल्हा, पिकाची अवस्था आणि दिसणारी लक्षणे सांगा. स्थानिक किंवा जोखमीच्या निर्णयांसाठी कृषी अधिकारी किंवा कृषी विज्ञान केंद्राचा सल्ला घ्या.",
    noQuestion: "कृपया प्रश्न लिहा किंवा खालील विषयांपैकी एक निवडा.",
    promptCrop: "अधिक उपयुक्त मार्गदर्शनासाठी पीक, गाव किंवा जिल्हा, पिकाची अवस्था आणि दिसणारी लक्षणे सांगा.",
    newChat: "संभाषण पुसून टाका"
  },
  Hindi: {
    title: "खेती सहायक", subtitle: "अपनी भाषा में खेती से जुड़े सवाल पूछें",
    intro: "नमस्ते! मैं फसल की देखभाल, सिंचाई, कीट, मौसम की सावधानियों और खेती के खर्च पर सामान्य जानकारी दे सकता हूँ। अपनी फसल और उसमें दिख रही समस्या बताइए।",
    placeholder: "अपनी फसल के बारे में पूछें…", send: "पूछें", back: "डैशबोर्ड पर लौटें",
    quickTitle: "ऐसे सवाल पूछें", disclaimer: "यह शुरुआती नमूना मार्गदर्शन है। इस संस्करण में पहले से तैयार सुझाव हैं; कोई वास्तविक AI मॉडल जुड़ा नहीं है। सही सलाह स्थान, फसल की अवस्था और स्थानीय परिस्थितियों पर निर्भर करती है। गंभीर रोग या कीट के लिए स्थानीय कृषि अधिकारी या कृषि विज्ञान केंद्र से सलाह लें।",
    prompts: ["फसल में पानी कब देना चाहिए?", "कीट दिखें तो क्या करें?", "खेती का खर्च कैसे घटाएँ?", "खाद डालने से पहले क्या जाँचें?"],
    water: "सिंचाई फसल, मिट्टी, फसल की अवस्था और हाल की बारिश पर निर्भर करती है। पानी देने से पहले जड़ों के पास मिट्टी की नमी जाँचें, खेत में पानी जमा न होने दें और संभव हो तो सुबह या शाम सिंचाई करें। बेहतर सामान्य जानकारी के लिए फसल, मिट्टी का प्रकार और आखिरी बारिश कब हुई, यह बताएँ।",
    pest: "पहले कीट की पहचान करने और पौधे का कौन-सा हिस्सा प्रभावित है, यह देखने की कोशिश करें। खेत के अलग-अलग हिस्सों में कुछ पौधों की जाँच करें। कीट की पहचान किए बिना कोई रसायन न छिड़कें। साफ तस्वीरें लेकर स्थानीय कृषि सहायक या कृषि विज्ञान केंद्र से सलाह लें। उत्पाद के लेबल और सुरक्षा निर्देशों का पालन करें।",
    cost: "बीज, खाद, मजदूरी, सिंचाई, परिवहन और मशीनरी का हर खर्च सही फसल के रिकॉर्ड में लिखें। हर सप्ताह बजट और वास्तविक खर्च की तुलना करें, अनावश्यक दोहरी खरीद से बचें और विक्रेताओं के दाम व गुणवत्ता की तुलना करें। फसल पर असर पड़ने की संभावना हो तो जरूरी देखभाल का खर्च बिना सलाह के कम न करें।",
    fertilizer: "खाद डालने से पहले फसल, उसकी बढ़वार की अवस्था और उपलब्ध होने पर मिट्टी परीक्षण की सिफारिश जाँचें। सुझाई गई मात्रा और तरीका अपनाएँ; ज्यादा खाद हमेशा ज्यादा उपज नहीं देती। लेबल या योग्य कृषि विशेषज्ञ की पुष्टि के बिना उत्पादों को न मिलाएँ।",
    weather: "सिंचाई, छिड़काव या कटाई से पहले स्थानीय मौसम का पूर्वानुमान देखें। तेज हवा में या बारिश से ठीक पहले छिड़काव न करें। गर्मी या भारी बारिश के लिए सावधानी बरतें। अपने गाँव का मौसम देखने के लिए ऐप का मौसम अनुभाग खोलें।",
    disease: "देखें कि कौन-सी पत्तियाँ, तने या फल प्रभावित हैं, लक्षण कितनी तेजी से फैल रहे हैं और क्या वे खेत के कुछ हिस्सों में ही हैं। पूरे पौधे और प्रभावित हिस्से की साफ तस्वीरें लें। अंदाज़े से कीटनाशक न डालें; स्थानीय कृषि अधिकारी या कृषि विज्ञान केंद्र से रोग की पुष्टि करें।",
    market: "मंडी का नाम, तारीख, फसल की किस्म/ग्रेड और बताया गया भाव लिखें। संभव हो तो एक से अधिक खरीदारों के भाव की तुलना करें। फैसला लेने से पहले परिवहन, कमीशन और संभालने का खर्च भी जोड़ें। इस नमूना संस्करण में सत्यापित लाइव मंडी भाव उपलब्ध नहीं हैं।",
    general: "मैं सिंचाई, खाद की सुरक्षा, कीट, फसल के लक्षण, मौसम की सावधानियों और खेती के खर्च पर सामान्य जानकारी दे सकता हूँ। फसल, गाँव या जिला, फसल की अवस्था और आपने क्या देखा है, यह बताएँ। स्थानीय या जोखिम वाले फैसलों के लिए कृषि अधिकारी या कृषि विज्ञान केंद्र से पुष्टि करें।",
    noQuestion: "कृपया सवाल लिखें या नीचे दिए विषयों में से एक चुनें।",
    promptCrop: "अधिक उपयोगी जानकारी के लिए फसल, गाँव या जिला, फसल की अवस्था और दिख रहे लक्षण बताएँ।",
    newChat: "बातचीत साफ करें"
  }
} as const;

function makeAnswer(question: string, lang: Language): string {
  const q = question.toLocaleLowerCase();
  const c = copy[lang];
  if (/water|irrigat|पाणी|सिंचन|पानी|सिंचाई|पाऊस|बारिश/.test(q)) return c.water;
  if (/pest|insect|कीड|किड|कीट|अळी|अल्ली|bug/.test(q)) return c.pest;
  if (/cost|expense|budget|खर्च|बजेट|लागत|पैसे|पैसा/.test(q)) return c.cost;
  if (/fertili[sz]er|खत|खते|खताचा|युरिया|urea|डीएपी|dap/.test(q)) return c.fertilizer;
  if (/weather|rain|मौसम|हवामान|पाऊस|बारिश|तापमान/.test(q)) return c.weather;
  if (/disease|leaf|yellow|spot|रोग|पान|पिवळे|पिवळी|डाग|बीमारी|पीला|पत्ती|धब्बे/.test(q)) return c.disease;
  if (/market|price|mandi|भाव|बाजार|मंडी|किंमत|दर/.test(q)) return c.market;
  return c.general + "\n\n" + c.promptCrop;
}

export default function FarmingAssistantPage() {
  const [lang, setLang] = useState<Language>("Marathi");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: copy.Marathi.intro }]);
  const [busy, setBusy] = useState(false);

  function ask(text = question) {
    const q = text.trim();
    if (!q) return;
    setBusy(true);
    setMessages((old) => [...old, { role: "user", text: q }]);
    setQuestion("");
    window.setTimeout(() => {
      setMessages((old) => [...old, { role: "assistant", text: makeAnswer(q, lang) }]);
      setBusy(false);
    }, 350);
  }

  function changeLanguage(next: Language) {
    setLang(next);
    setMessages((old) => old.length === 1 ? [{ role: "assistant", text: copy[next].intro }] : old);
  }

  const c = copy[lang];
  const quickIcons = [Droplets, Bug, Wallet, Sprout];

  return (
    <main className="min-h-screen bg-[#f6f8f2] text-[#20331d]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5eadf] bg-white px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#315b28] text-white"><Bot size={22}/></div>
          <div><h1 className="display text-xl font-extrabold">{c.title}</h1><p className="muted text-sm">{c.subtitle}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <select className="input !w-auto" value={lang} onChange={(e) => changeLanguage(e.target.value as Language)} aria-label="Language">
            <option value="Marathi">मराठी</option><option value="Hindi">हिन्दी</option><option value="English">English</option>
          </select>
          <Link className="btn2" href="/">{c.back}</Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 p-4 md:grid-cols-[minmax(0,1fr)_280px] md:p-8">
        <section className="card flex min-h-[68vh] flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#e5eadf] p-4"><MessageCircle size={18}/><div><b>{c.title}</b><div className="muted text-xs">{c.subtitle}</div></div></div>
          <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
            {messages.map((m, i) => <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}><div className={"max-w-[90%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 " + (m.role === "user" ? "bg-[#315b28] text-white" : "bg-[#edf5e7] text-[#20331d]")}>{m.text}</div></div>)}
            {busy && <div className="muted text-sm">{lang === "Marathi" ? "उत्तर तयार होत आहे…" : lang === "Hindi" ? "जवाब तैयार हो रहा है…" : "Preparing a response…"}</div>}
          </div>
          <form className="flex gap-2 border-t border-[#e5eadf] p-3 md:p-4" onSubmit={(e) => { e.preventDefault(); ask(); }}>
            <input className="input" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={c.placeholder} aria-label={c.placeholder}/>
            <button className="btn flex shrink-0 items-center gap-2" type="submit" disabled={!question.trim() || busy}><Send size={16}/><span className="hidden sm:inline">{c.send}</span></button>
          </form>
        </section>

        <aside className="space-y-4">
          <section className="card p-4"><h2 className="display font-extrabold">{c.quickTitle}</h2><div className="mt-3 space-y-2">{c.prompts.map((p, i) => { const Icon = quickIcons[i]; return <button key={p} className="btn2 flex w-full items-center gap-2 text-left text-sm" onClick={() => ask(p)}><Icon size={16}/><span>{p}</span></button>; })}</div><button className="muted mt-3 text-xs underline" onClick={() => setMessages([{ role: "assistant", text: c.intro }])}>{c.newChat}</button></section>
          <section className="rounded-2xl border border-[#eadfbd] bg-[#fff7e8] p-4 text-sm leading-6 text-[#765c28]"><div className="mb-2 flex items-center gap-2 font-bold"><CloudSun size={17}/>{lang === "Marathi" ? "महत्त्वाची सूचना" : lang === "Hindi" ? "ज़रूरी सूचना" : "Important note"}</div>{c.disclaimer}</section>
        </aside>
      </div>
    </main>
  );
}
