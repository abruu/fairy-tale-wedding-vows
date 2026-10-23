/**
 * Every UI string on the site, in English and Hindi. Couple-specific
 * details (names, date, venue…) live in src/config/dates.ts instead.
 * Keys are referenced from components as <T k="section.key" /> or t("section.key").
 */
export const translations = {
  en: {
    "a11y.skip": "Skip to content",
    "a11y.backToTop": "Back to top",
    "a11y.openMenu": "Open menu",
    "a11y.closeMenu": "Close menu",
    "a11y.language": "Choose language",
    "a11y.home": "Back to the top of the page",

    "intro.eyebrow": "The engagement of",
    "intro.open": "Tap to open",
    "intro.saveTheDate": "Save the date",

    "nav.story": "Invitation",
    "nav.couple": "Bride & Groom",
    "nav.engagement": "Engagement",
    "nav.rsvp": "Wishes",

    "hero.eyebrow": "We're getting engaged",
    "hero.engagement": "The Engagement is at",
    "hero.countdownLabel": "Until the Engagement",
    "hero.countdownDone": "The big moment has arrived",
    "hero.engagedTitle": "We're Engaged!",
    "hero.engagedSubtitle": "Thank you for celebrating with us",
    "hero.scroll": "Scroll",

    "countdown.days": "Days",
    "countdown.hours": "Hours",
    "countdown.minutes": "Minutes",
    "countdown.seconds": "Seconds",

    "story.eyebrow": "Welcome",
    "story.title": "You're Invited",
    "story.body":
      "We are delighted to share the beginning of our journey together. As our two families come together to celebrate our engagement, we would be honoured by your presence and blessings.",

    "couple.eyebrow": "The Bride & Groom",
    "couple.title": "Two families, one celebration",
    "couple.bride": "Bride",
    "couple.groom": "Groom",
    "couple.parents": "Parents",

    "engagement.eyebrow": "The Engagement",
    "engagement.venue": "Venue",
    "engagement.note": "Your presence and blessings will make our day complete.",
    "engagement.map": "Google Maps",
    "engagement.appleMap": "Apple Maps",
    "engagement.addToCalendar": "Add to Calendar",

    "rsvp.eyebrow": "Wishes",
    "rsvp.title": "Send your wishes",
    "rsvp.name": "Your name",
    "rsvp.message": "Your wishes for the couple",
    "rsvp.submit": "Send wishes",
    "rsvp.sending": "Sending…",
    "rsvp.success": "Thank you for your lovely wishes! They mean the world to us, and we can't wait to celebrate with you.",
    "rsvp.error": "Sorry, that didn't go through. Please try again in a moment.",
    "rsvp.notConfigured": "Online wishes aren't open yet. Please check back soon.",
    "rsvp.nameRequired": "Please enter your name",
    "rsvp.messageRequired": "Please write a few words for us",
    "rsvp.sendAnother": "Send another message",

    "footer.thanks": "Thank you for being part of our journey",

    "music.play": "Play background music",
    "music.pause": "Pause background music",
    "music.unavailable": "Music unavailable",
  },
  hi: {
    "a11y.skip": "मुख्य सामग्री पर जाएँ",
    "a11y.backToTop": "ऊपर जाएँ",
    "a11y.openMenu": "मेनू खोलें",
    "a11y.closeMenu": "मेनू बंद करें",
    "a11y.language": "भाषा चुनें",
    "a11y.home": "पृष्ठ के शीर्ष पर जाएँ",

    "intro.eyebrow": "सगाई समारोह",
    "intro.open": "खोलने के लिए टैप करें",
    "intro.saveTheDate": "तारीख़ याद रखें",

    "nav.story": "आमंत्रण",
    "nav.couple": "वर-वधू",
    "nav.engagement": "सगाई",
    "nav.rsvp": "शुभकामनाएँ",

    "hero.eyebrow": "हमारी सगाई हो रही है",
    "hero.engagement": "सगाई का समय",
    "hero.countdownLabel": "सगाई में शेष",
    "hero.countdownDone": "वह ख़ास पल आ गया है",
    "hero.engagedTitle": "हमारी सगाई हो गई!",
    "hero.engagedSubtitle": "हमारी ख़ुशियों में शामिल होने के लिए धन्यवाद",
    "hero.scroll": "नीचे जाएँ",

    "countdown.days": "दिन",
    "countdown.hours": "घंटे",
    "countdown.minutes": "मिनट",
    "countdown.seconds": "सेकंड",

    "story.eyebrow": "स्वागत",
    "story.title": "सादर आमंत्रण",
    "story.body":
      "अपने नए सफ़र की शुरुआत आपके साथ साझा करते हुए हमें अत्यंत ख़ुशी हो रही है। हमारी सगाई के इस शुभ अवसर पर दोनों परिवार आपकी उपस्थिति और आशीर्वाद की कामना करते हैं।",

    "couple.eyebrow": "वर-वधू",
    "couple.title": "दो परिवार, एक उत्सव",
    "couple.bride": "वधू",
    "couple.groom": "वर",
    "couple.parents": "माता-पिता",

    "engagement.eyebrow": "सगाई समारोह",
    "engagement.venue": "स्थान",
    "engagement.note": "आपकी उपस्थिति और आशीर्वाद से हमारा यह दिन पूर्ण होगा।",
    "engagement.map": "Google Maps",
    "engagement.appleMap": "Apple Maps",
    "engagement.addToCalendar": "कैलेंडर में जोड़ें",

    "rsvp.eyebrow": "शुभकामनाएँ",
    "rsvp.title": "अपनी शुभकामनाएँ भेजें",
    "rsvp.name": "आपका नाम",
    "rsvp.message": "नव-युगल के लिए आपकी शुभकामनाएँ",
    "rsvp.submit": "शुभकामनाएँ भेजें",
    "rsvp.sending": "भेजा जा रहा है…",
    "rsvp.success": "आपकी प्यारी शुभकामनाओं के लिए धन्यवाद! ये हमारे लिए बहुत अनमोल हैं, और हम आपके साथ जश्न मनाने के लिए उत्सुक हैं।",
    "rsvp.error": "क्षमा करें, संदेश नहीं जा सका। कृपया थोड़ी देर बाद फिर प्रयास करें।",
    "rsvp.notConfigured": "ऑनलाइन शुभकामनाएँ अभी शुरू नहीं हुई हैं। कृपया कुछ समय बाद देखें।",
    "rsvp.nameRequired": "कृपया अपना नाम लिखें",
    "rsvp.messageRequired": "कृपया हमारे लिए कुछ शब्द लिखें",
    "rsvp.sendAnother": "एक और संदेश भेजें",

    "footer.thanks": "हमारे सफ़र का हिस्सा बनने के लिए धन्यवाद",

    "music.play": "पृष्ठभूमि संगीत चलाएँ",
    "music.pause": "पृष्ठभूमि संगीत रोकें",
    "music.unavailable": "संगीत उपलब्ध नहीं है",
  },
} as const;

export type Lang = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)["en"];

// Compile-time guard: Hindi must define every English key.
const _hiComplete: Record<TranslationKey, string> = translations.hi;
void _hiComplete;
