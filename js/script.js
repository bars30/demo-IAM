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
  input
  
} from "./dom-elements.js";
import { setupThemeToggle } from './theme-toggler.js';
import { restoreChatHistory, saveChatHistory } from './chat-history.js';
import { addMessage, typeTextHTML, typeText } from './message-renderer.js';

document.addEventListener("DOMContentLoaded", () => {

  setupThemeToggle();
   restoreChatHistory();
  

  const footerBtn = document.querySelectorAll(".footer-btn-cont button");
  const langButtons = document.querySelectorAll('.lang-option');
  const langSwitcher = document.querySelector('.language-switcher');
  console.log(langSwitcher);
 

  langButtons.forEach(button => {
    button.addEventListener('click', () => {
      langButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const selectedLang = button.dataset.lang;
    });
  });

let firstMessage = true;

if (localStorage.getItem("lang")) {
  const l =localStorage.getItem("lang");
  langButtons.forEach(btn => btn.classList.remove('active'));
  langButtons.forEach(button => {
  

      if (button.dataset.lang == l) {
        button.classList.add('active');
      } 
  setTimeout(() => {
    updateUIText();
  }, 100);
});

}




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


const fileInput = document.getElementById("file-upload");
const filePreviewContainer = document.getElementById("file-preview-container");

let selectedFiles = [];

fileInput.addEventListener("change", () => {
  const newFile = fileInput.files[0]; 
  if (!newFile) return;

  if (selectedFiles.some(f => f.name === newFile.name)) {
    fileInput.value = ""; 
    return;
  }

  selectedFiles.push(newFile);

  updatePreview();
  updateFileList();
  fileInput.value = ""; 
});

function updatePreview() {
  filePreviewContainer.innerHTML = "";

  selectedFiles.forEach((file, index) => {
    const fileBlock = document.createElement("div");
    fileBlock.className = "file-preview";
    fileBlock.innerHTML = `
      <div class="file-header">
        <img src="./img/file.svg" alt="">
        <span class="file-name">${file.name}</span>
      </div>
      <button class="remove-file">  <img src="./img/close.svg" alt=""></button>
    `;
    filePreviewContainer.appendChild(fileBlock);

    fileBlock.querySelector(".remove-file").addEventListener("click", () => {
      selectedFiles.splice(index, 1);
      updatePreview();
      updateFileList();
    });
  });
}

function updateFileList() {
  const dt = new DataTransfer();
  selectedFiles.forEach(f => dt.items.add(f));
  fileInput.files = dt.files;
}



let askedQuestions = "";
let messageLeft = false; 

sendBtn.addEventListener("click", () => {
setTimeout(() => {
    const userInput = chatboxInput.value.trim();
  if (!userInput && selectedFiles.length === 0) return;

  promptsSection.classList.add("fade-out");
  promptsSection.classList.add("fade-out-display-none");
  questionsBtn.classList.add("visible");

  if (userInput) {
    addMessage(userInput, "user");
  }


  if (selectedFiles.length > 0) {
    let filesHTML = "";

    selectedFiles.forEach((file) => {
      filesHTML += `
        <div class="file-preview">
          <div class="file-header">
            <img src="./img/file.svg" alt="">
            <span class="file-name">${file.name}</span>
          </div>
        </div>
      `;
    });

    addMessage(filesHTML, "user",  false, null, true);
    selectedFiles = [];          
    updatePreview();              
    updateFileList();             
  }

  chatboxInput.value = "";
  chatboxInput.style.height = "auto";

  

  if (chatState === "waitingUserQuestion") {
    askedQuestions = userInput;
    let fullResponse = ``;
    if (getCurrentLang() == "en") {
      fullResponse = `
      <p>Thank you for your message!</p>
      <p>To assist you better, please share your <b>full name</b> and <b>email address</b>.</p>
      <p>Unfortunately, I can't answer this question directly, but one of our consultants will reach out to you shortly.</p>
    `;
    } else if (getCurrentLang() == "de") {
    fullResponse = `
    <p>Vielen Dank für Ihre Nachricht!</p>
    <p>Um Ihnen besser helfen zu können, teilen Sie uns bitte Ihren <b>vollständigen Namen</b> und Ihre <b>E-Mail-Adresse</b> mit.</p>
    <p>Leider kann ich diese Frage nicht direkt beantworten, aber einer unserer Berater wird sich in Kürze mit Ihnen in Verbindung setzen.</p>
  `;
    }
    const newBotEl = addMessage(fullResponse, "bot", true, () => {
  chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
});

const element = document.querySelector('.new-bot-message');
          if (element) {
            element.classList.remove("new-bot-message");
          }

newBotEl.classList.add("new-bot-message");
chatboxMessages.scrollTop = chatboxMessages.scrollHeight;



chatState = "done";
    


  } else if (chatState === "done") {
    let fullResponse = ``;
      if (getCurrentLang() == "en") {
        fullResponse = `<p>We've already received your info. Our consultant will contact you soon.</p>`;
      } else if (getCurrentLang() == "de") {
        fullResponse = `<p>Wir haben Ihre Angaben bereits erhalten. Einer unserer Berater wird sich in Kürze mit Ihnen in Verbindung setzen.</p>`;
      }

if (!messageLeft) {
  const now = new Date();
  const sentTime = now.toLocaleString();
  
  emailjs.send('service_1ol3sjl', 'template_1nmov9t', {
    name: "Website Visitor",
    message: userInput,       
    asked_questions: askedQuestions, 
    title: "Chat Message",
    sent_time: sentTime
  })
  .then(() => {
    console.info("📨 Message successfully sent to smithmoonft@gmail.com");
  })
  .catch((error) => {
    console.error("❌ Email send error:", error);
  });
}
messageLeft = true;


const newBotEl = addMessage(fullResponse, "bot", true, () => {
  chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
});


    const element = document.querySelector('.new-bot-message');
          if (element) {
            element.classList.remove("new-bot-message");
          }

newBotEl.classList.add("new-bot-message");
chatboxMessages.scrollTop = chatboxMessages.scrollHeight;


chatState = "done";

  }
}, 200)
});





});
