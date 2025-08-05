// message-renderer.js
import { saveChatHistory } from './chat-history.js';

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
  }, delay);
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

/**
 * Ավելացնում է նոր հաղորդագրություն զրույցի UI-ում։
 * @param {string} text — հաղորդագրության տեքստը կամ HTML-ը
 * @param {string} sender — 'user' կամ 'bot'
 * @param {boolean} animated — եթե true, տեքստը կտիպավորվի (typewriter effect)
 * @param {function} callback — կանչվելու է տիպավորումն ավարտվելուց հետո
 * @param {boolean} file — եթե true, ցուցադրում է որպես ֆայլերի HTML
 * @returns {HTMLElement} ավելացված հաղորդագրության container-ը
 */
function addMessage(text, sender = "bot", animated = false, callback, file = false) {
  const chatboxMessages = document.querySelector(".chatbox-messages");
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

export {
  addMessage,
  typeText,
  typeTextHTML
};
