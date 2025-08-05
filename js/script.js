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








  const promptButtons = document.querySelectorAll(".quick-prompts-btn");








  promptButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedPrompt = btn.textContent;

      promptButtons.forEach(b => b.disabled = true);
      footerBtn[0].disabled = true;
    footerBtn[1].disabled = true;
      promptsSection.classList.add("fade-out");


      setTimeout(() => {
        promptsSection.style.display = "none";
        chatboxMessages.style.display = "flex";
        input.classList.add("shrink");
        setTimeout(() => {
          questionsBtn.classList.add("visible");
        }, 200);
      

        const userMsg = document.createElement("div");
        userMsg.className = "message user-message";
        const userP = document.createElement("p");
        userP.textContent = selectedPrompt;
        userMsg.appendChild(userP);
        chatboxMessages.appendChild(userMsg);
        saveChatHistory();

  
  if (firstMessage && !!localStorage.getItem('chatHistory')) {
    setTimeout(() => {
          chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
        }, 50); 

        
    
  } 
  else {
    setTimeout(() => {
          chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
        }, 50); 
  }

        const botMsg = document.createElement("div");
        botMsg.className = "message bot-message";
        const botP = document.createElement("p");
        botMsg.appendChild(botP);
        chatboxMessages.appendChild(botMsg);
        saveChatHistory();



        if (firstMessage) {
          firstMessage = false;
          botMsg.classList.add("new-bot-message");
        } else {
          const element = document.querySelector('.new-bot-message');
          if (element) {
            element.classList.remove("new-bot-message");
          }
          botMsg.classList.add("new-bot-message");
        }

      saveChatHistory();

questionsBtn.disabled = true;
langButtons.forEach(b => b.disabled = true);
langSwitcher.classList.add('disabled');
sendBtn.disabled = true;
footerBtn[0].disabled = true;
    footerBtn[1].disabled = true;

typeTextHTML(botP, getBotReply(selectedPrompt), 20, () => {
  questionsBtn.disabled = false;
  langButtons.forEach(b => b.disabled = !true);
  langSwitcher.classList.remove('disabled');
sendBtn.disabled = !true;
footerBtn[0].disabled = !true;
    footerBtn[1].disabled = !true;
  saveChatHistory();
});
      }, 400);
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


const footerPromptButtons = document.querySelectorAll('.quick-prompts-footer .quick-prompts-btn');
const footerPrompts = document.querySelector(".quick-prompts-footer");

footerPromptButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    footerPrompts.classList.remove("fade-in");
    footerPrompts.classList.add("fade-out");
    setTimeout(() => {
      footerPrompts.style.display = "none";
    }, 300);
  });
});

const textarea = document.getElementById('chatbox-input');

textarea.addEventListener('input', function () {
  this.style.height = 'auto'; 
  this.style.height = Math.min(this.scrollHeight, 80) + 'px'; 
});





let chatState = "waitingUserQuestion"; 

const chatboxInput = document.getElementById("chatbox-input");
const sendBtn = document.querySelector(".chatbox-send-btn");







const clearBtns = document.querySelectorAll('.chatbox-footer-btn.clear-btn');

clearBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    
    localStorage.removeItem('chatHistory');
    location.reload();
  });
});







});
