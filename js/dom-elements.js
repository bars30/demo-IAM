
const footerBtn = document.querySelectorAll(".footer-btn-cont button");
export  const langButtons = document.querySelectorAll('.lang-option');
 const langSwitcher = document.querySelector('.language-switcher');
let firstMessage = true;

  const promptButtons = document.querySelectorAll(".quick-prompts-btn");
  const promptsSection = document.querySelector(".quick-prompts");
  const chatboxMessages = document.querySelector(".chatbox-messages");
  const questionsBtn = document.querySelector(".chatbox-footer-btn-questions");
  const input = document.querySelector(".send-message");
const footerPromptButtons = document.querySelectorAll('.quick-prompts-footer .quick-prompts-btn');
const footerPrompts = document.querySelector(".quick-prompts-footer");
const textarea = document.getElementById('chatbox-input');
let chatState = "waitingUserQuestion"; 

const chatboxInput = document.getElementById("chatbox-input");
const sendBtn = document.querySelector(".chatbox-send-btn");
const clearBtns = document.querySelectorAll('.chatbox-footer-btn.clear-btn');
const fileInput = document.getElementById("file-upload");
const filePreviewContainer = document.getElementById("file-preview-container");

let selectedFiles = [];

let askedQuestions = "";
let messageLeft = false; 
const toggle = document.getElementById("modeToggle");
const root = document.documentElement;
const logoLight = document.getElementById("logo-light");
const logoDark = document.getElementById("logo-dark");

toggle.checked = true;
