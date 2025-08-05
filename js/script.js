import {
  updateUIText,
  getBotReply,
  getCurrentLang,
  setCurrentLang
} from "./lang-handler.js";

import { 
  questionsBtn, 
  promptsSection,
  chatboxMessages,
  input,
  langButtons
  
} from "./dom-elements.js";
import { setupThemeToggle } from './theme-toggler.js';
import { restoreChatHistory, saveChatHistory } from './chat-history.js';
import { addMessage, typeTextHTML, typeText } from './message-renderer.js';

import { initFileManager, getSelectedFiles, clearSelectedFiles, updatePreview,
  updateFileList } from './file-manager.js';

import { setupLanguageSwitcher } from './language-switcher.js';
import { setupChatController } from './chat-controller.js';

import { setupPromptButtons } from "./prompt-buttons.js";

document.addEventListener("DOMContentLoaded", () => {

  setupThemeToggle();
  restoreChatHistory();
  initFileManager();
  setupChatController();

  
  const { langSwitcher } = setupLanguageSwitcher();

  const footerBtn = document.querySelectorAll(".footer-btn-cont button");
  console.log(langSwitcher);
 


let firstMessage = true;





  document.querySelectorAll(".lang-option").forEach(button => {
    button.addEventListener("click", () => {
      let lang = button.getAttribute("data-lang");
      setCurrentLang(lang);
      localStorage.setItem("lang", lang);
    
      updateUIText();
    });
  });









  questionsBtn.addEventListener("click", () => {
    const footerPrompts = document.querySelector(".quick-prompts-footer");
    if (footerPrompts.style.display === "flex") {
      footerPrompts.classList.remove("fade-in");
      footerPrompts.classList.add("fade-out");
      setTimeout(() => {
        footerPrompts.style.display = "none";
      }, 300);
    } else {
      footerPrompts.style.display = "flex";
      footerPrompts.classList.remove("fade-out");
      footerPrompts.classList.add("fade-in");
    }
  });



const textarea = document.getElementById('chatbox-input');

textarea.addEventListener('input', function () {
  this.style.height = 'auto'; 
  this.style.height = Math.min(this.scrollHeight, 80) + 'px'; 
});





let chatState = "waitingUserQuestion"; 

const chatboxInput = document.getElementById("chatbox-input");
const sendBtn = document.querySelector(".chatbox-send-btn");




setupPromptButtons(langSwitcher, sendBtn, footerBtn);


const clearBtns = document.querySelectorAll('.chatbox-footer-btn.clear-btn');

clearBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    
    localStorage.removeItem('chatHistory');
    location.reload();
  });
});







});
