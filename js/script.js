import {
  updateUIText,
  getBotReply,
  getCurrentLang,
  setCurrentLang
} from "./lang-handler.js";

// import { langButtons } from "./dom-elements.js";



document.addEventListener("DOMContentLoaded", () => {

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
  const promptsSection = document.querySelector(".quick-prompts");
  const chatboxMessages = document.querySelector(".chatbox-messages");
  const questionsBtn = document.querySelector(".chatbox-footer-btn-questions");
  const input = document.querySelector(".send-message");




function restoreChatHistory() {
  const savedHistory = localStorage.getItem("chatHistory");
  if (!savedHistory) return;

  let chatData = JSON.parse(savedHistory);

  if (
    chatData.length >= 2 &&
    chatData[chatData.length - 1].sender === "bot" &&
    chatData[chatData.length - 1].text.replace(/<[^>]*>/g, '').trim() === ""
  ) {
    chatData.splice(chatData.length - 2, 2);
  }

  chatData.forEach((msg) => {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${msg.sender}-message`;
    msgDiv.innerHTML = msg.text;
    chatboxMessages.appendChild(msgDiv);
  });

  if (chatData.length > 0) {
    promptsSection.style.display = "none";
    chatboxMessages.style.display = "flex";
    input.classList.add("shrink");
    questionsBtn.classList.add("visible");

chatboxMessages.style.scrollBehavior = "auto";
chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
chatboxMessages.style.scrollBehavior = ""; 

  }
}


  restoreChatHistory();
function typeText(container, text, delay = 15, callback) {
  let i = 0;
  container.textContent = '';
  const interval = setInterval(() => {
    container.textContent += text.charAt(i);
    i++;


    if (i >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 7);
}

function typeTextHTML(container, html, delay = 20, callback) {
  container.innerHTML = ''; 

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const nodes = Array.from(tempDiv.childNodes);

  let currentIndex = 0;

  function typeNextNode() {
    if (currentIndex >= nodes.length) {
      if (callback) callback();
      return;
    }

    const node = nodes[currentIndex];
    
    if (node.nodeType === Node.TEXT_NODE) {
      
      const span = document.createElement("span");
      container.appendChild(span);


      typeText(span, node.textContent, delay, () => {
        currentIndex++;
        typeNextNode();
        if (!span.textContent.trim()) {
    span.remove();
  }
      });

    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false); 
      container.appendChild(clone);

      let childHTML = node.innerHTML;

      const temp = document.createElement("div");
      temp.innerHTML = childHTML;

      temp.querySelectorAll("span").forEach((el) => {
        if (!el.textContent.trim()) {
          el.remove();
        }
      });

      childHTML = temp.innerHTML;

      typeTextHTML(clone, childHTML, delay, () => {
        currentIndex++;
        typeNextNode();
      });

    } else {
      currentIndex++;
      typeNextNode();
    }
  }

  typeNextNode();
}



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

function addMessage(text, sender = "bot", animated = false, callback, file = false) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}-message`;

  if (file) {
    msgDiv.innerHTML = text;
    chatboxMessages.appendChild(msgDiv);

    saveChatHistory();
    return msgDiv; 
  }

  const p = document.createElement("p");
  msgDiv.appendChild(p);
  chatboxMessages.appendChild(msgDiv);

  const isSimpleText = !/<[^>]+>/.test(text);

  if (animated && !isSimpleText) {
    typeTextHTML(p, text, 20, () => {
      if (callback) callback();
    });
  } else {
    p.innerHTML = text;
    if (callback) callback();
  }

  saveChatHistory();
  return msgDiv;
}


function saveChatHistory() {
  const messages = document.querySelectorAll(".chatbox-messages .message");
  const chatData = [];

  messages.forEach((msg) => {
    chatData.push({
      sender: msg.classList.contains("user-message") ? "user" : "bot",
      text: msg.innerHTML
    });
  });

  localStorage.setItem("chatHistory", JSON.stringify(chatData));
}



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
    if (currentLang == "en") {
      fullResponse = `
      <p>Thank you for your message!</p>
      <p>To assist you better, please share your <b>full name</b> and <b>email address</b>.</p>
      <p>Unfortunately, I can't answer this question directly, but one of our consultants will reach out to you shortly.</p>
    `;
    } else if (currentLang == "de") {
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
      if (currentLang == "en") {
        fullResponse = `<p>We've already received your info. Our consultant will contact you soon.</p>`;
      } else if (currentLang == "de") {
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




const toggle = document.getElementById("modeToggle");
const root = document.documentElement;
const logoLight = document.getElementById("logo-light");
const logoDark = document.getElementById("logo-dark");

toggle.checked = true;

root.style.setProperty('--bg-page', '#19212E');
root.style.setProperty('--bg-chatbox', '#333942');
root.style.setProperty('--bg-language-switch', '#2D343E');
root.style.setProperty('--prompt-bg', '#2E343F');
root.style.setProperty('--prompt-text', '#F1F2F2');
root.style.setProperty('--border-color', '#3A414B');
root.style.setProperty('--text-subtitle', '#B0B8C1');
root.style.setProperty('--text-placeholder', '#A0AAB4');
root.style.setProperty('--text-dark', '#ffffff');
root.style.setProperty('--header-footer', '#333942');
root.style.setProperty('--button-shadow', '#6c788d');

logoLight.style.display = "none";
logoDark.style.display = "inline";

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    root.style.setProperty('--bg-page', '#19212E');
    root.style.setProperty('--bg-chatbox', '#333942');
    root.style.setProperty('--bg-language-switch', '#2D343E');
    root.style.setProperty('--prompt-bg', '#2E343F');
    root.style.setProperty('--prompt-text', '#F1F2F2');
    root.style.setProperty('--border-color', '#3A414B');
    root.style.setProperty('--text-subtitle', '#B0B8C1');
    root.style.setProperty('--text-placeholder', '#A0AAB4');
    root.style.setProperty('--text-dark', '#ffffff');
    root.style.setProperty('--header-footer', '#333942');
    root.style.setProperty('--button-shadow', '#6c788d');
    logoLight.style.display = "none";
    logoDark.style.display = "inline";
  } else {
    root.style.setProperty('--bg-page', '#F2F7FD');
    root.style.setProperty('--bg-chatbox', '#ffffffff');
    root.style.setProperty('--bg-language-switch', '#F9F9F9');
    root.style.setProperty('--prompt-bg', '#FDFEFF');
    root.style.setProperty('--prompt-text', '#4A5362');
    root.style.setProperty('--border-color', '#F0F3F7');
    root.style.setProperty('--text-subtitle', '#536073');
    root.style.setProperty('--text-placeholder', '#6F7E93');
    root.style.setProperty('--text-dark', '#1a1a1a');
    root.style.setProperty('--header-footer', '#ffffff');
    root.style.setProperty('--button-shadow', '#c4cfe3');
    logoLight.style.display = "inline";
    logoDark.style.display = "none";
  }
});



});
