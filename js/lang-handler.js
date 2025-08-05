import { botEnReplies } from "../lang/bot-replies.en.js";
import { botDeReplies } from "../lang/bot-replies.de.js";
import { uiTexts as enTexts } from "../lang/ui-texts.en.js";
import { uiTexts as deTexts } from "../lang/ui-texts.de.js";

let currentLang = localStorage.getItem("lang") || "en";
function setCurrentLang(lang) {
  currentLang = lang;
}

function getCurrentLang() {
  return currentLang;
}

const promptTranslations = {
  "Why Companies Choose Us": "Warum Unternehmen uns wählen",
  "Services for Clients": "Dienstleistungen für Kunden",
  "Hiring Process": "Einstellungsprozess",
  "Technological Expertise & Roles": "Technologisches Fachwissen",
  "IAM Talent Network": "IAM Talent-Netzwerk",
  "Story & Purpose": "Geschichte & Zweck",
  "Team": "Team",
  "For IAM Professionals": "Für IAM-Profis",
  "Contact": "Kontakt",
  "Career Consultation": "Karriereberatung",
  "Send Us Your CV": "Senden Sie uns Ihren Lebenslauf"
};

const reversePromptTranslations = Object.fromEntries(
  Object.entries(promptTranslations).map(([en, de]) => [de, en])
);


function updateUIText() {
  const texts = currentLang === "de" ? deTexts : enTexts;

  document.title = texts.siteTitle;
  document.querySelector(".logo-header-title").textContent = texts.siteTitle;
  document.querySelector(".logo-header-subtitle").textContent = texts.siteSubtitle;
  document.querySelector(".quick-prompts-header").innerHTML = texts.greetingHeader;
  document.querySelector(".quick-prompts-subtitle").textContent = texts.greetingSub;
  document.querySelector("#chatbox-input").placeholder = texts.placeholder;

  document.querySelectorAll(".clear-btn").forEach(btn => {
    btn.textContent = texts.buttons.clear;
  });

  document.querySelector(".chatbox-footer-btn-questions").textContent = texts.buttons.questions;
  document.querySelector("footer p").textContent = texts.footer.copyright;

  const footerBtns = document.querySelectorAll(".footer-btn-cont button");
  if (footerBtns.length >= 2) {
    footerBtns[0].textContent = texts.footer.imprint;
    footerBtns[1].textContent = texts.footer.privacy;
  }

  const menuButtons = document.querySelectorAll(".quick-prompts-btn");
  menuButtons.forEach((btn) => {
    const currentText = btn.textContent.trim();

    const prompt = 
      currentLang === "de" 
        ? Object.keys(promptTranslations).find(key => promptTranslations[key] === currentText) || currentText
        : reversePromptTranslations[currentText] || currentText;

    btn.dataset.prompt = prompt;

    if (currentLang === "de" && promptTranslations[prompt]) {
      btn.textContent = promptTranslations[prompt];
    }

    if (currentLang === "en") {
      btn.textContent = prompt;
    }
  });
}

function getBotReply(prompt) {
  if (currentLang === "de") {
    return botDeReplies[prompt] || "<p>Antwort nicht gefunden.</p>";
  } else {
    return botEnReplies[prompt] || "<p>Reply not found.</p>";
  }
}

export {
  updateUIText,
  getBotReply,
  getCurrentLang,
  setCurrentLang,
  promptTranslations,
  reversePromptTranslations
};
