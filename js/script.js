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
import { setupLangButtonListeners } from "./lang-button-listeners.js";
import { setupQuickPromptsToggle } from "./quick-prompts-toggle.js";

document.addEventListener("DOMContentLoaded", () => {

  setupThemeToggle();
  restoreChatHistory();
  initFileManager();
  setupChatController();
setupLangButtonListeners();
  
  const { langSwitcher } = setupLanguageSwitcher();

  const footerBtn = document.querySelectorAll(".footer-btn-cont button");
  console.log(langSwitcher);
 
  let firstMessage = true;

setupQuickPromptsToggle(questionsBtn);

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
