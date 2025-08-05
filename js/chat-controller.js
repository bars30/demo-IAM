import { addMessage } from './message-renderer.js';
import { getCurrentLang } from './lang-handler.js';
import { getSelectedFiles, clearSelectedFiles, updatePreview, updateFileList } from './file-manager.js';
import { chatboxMessages, chatboxInput, questionsBtn, langButtons, langSwitcher, sendBtn, promptsSection, footerBtn } from './dom-elements.js';

export function setupChatController() {
  let chatState = "waitingUserQuestion";
  let askedQuestions = "";
  let messageLeft = false;

  sendBtn.addEventListener("click", () => {
setTimeout(() => {
    const userInput = chatboxInput.value.trim();
  if (!userInput && getSelectedFiles().length === 0) return;

  promptsSection.classList.add("fade-out");
  promptsSection.classList.add("fade-out-display-none");
  questionsBtn.classList.add("visible");

  if (userInput) {
    addMessage(userInput, "user");
  }


  if (getSelectedFiles().length > 0) {
    let filesHTML = "";

    getSelectedFiles().forEach((file) => {
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
    clearSelectedFiles();       
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

}
