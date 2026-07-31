/**
 * DEVATVA.IN - GEMINI AI DIVINE GURU CHATBOT WIDGET
 * Handles Spiritual Advice, Order Tracking, and Callback Inquiry Form
 */

(function () {
  'use strict';

  window.DevatvaChatbot = {
    activeTab: 'advice',

    toggle: function () {
      const windowEl = document.getElementById('devatva-chatbot-window');
      if (windowEl) {
        windowEl.classList.toggle('is-open');
      }
    },

    setTab: function (tabName) {
      this.activeTab = tabName;
      document.querySelectorAll('.devatva-chat-tab').forEach((t) => t.classList.remove('active'));
      const activeBtn = document.querySelector(`.devatva-chat-tab[data-tab="${tabName}"]`);
      if (activeBtn) activeBtn.classList.add('active');

      const messagesContainer = document.getElementById('devatva-chat-messages');
      const inputArea = document.getElementById('devatva-chat-input-area');

      if (tabName === 'advice') {
        messagesContainer.innerHTML = `
          <div class="devatva-chat-msg bot">
            🙏 Pranam! I am your <strong>Devatva AI Divine Guru</strong>. Ask me anything about Rudraksha Mukhis, Panchdhatu rings, Nazar protection, or zodiac remedies!
          </div>
        `;
        inputArea.style.display = 'flex';
      } else if (tabName === 'tracking') {
        messagesContainer.innerHTML = `
          <div class="devatva-chat-msg bot">
            📦 Enter your Order ID (e.g. <strong>#DEV1001</strong>) or registered phone number to check your sanctification & shipping status.
          </div>
        `;
        inputArea.style.display = 'flex';
      } else if (tabName === 'callback') {
        messagesContainer.innerHTML = `
          <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border: 1px solid var(--dev-gold-border);">
            <h4 style="color: var(--dev-gold-light); font-size: 0.95rem; margin-bottom: 8px;">🕉️ Free Vedic Priest Callback</h4>
            <p style="font-size: 0.8rem; color: var(--dev-text-muted); margin-bottom: 12px;">Request a 1-on-1 telephonic consultation with our lead Pujari for personalized Rudraksha recommendation.</p>
            
            <form onsubmit="DevatvaChatbot.submitCallback(event)" style="display: flex; flex-direction: column; gap: 8px;">
              <input type="text" id="devatva-cb-name" placeholder="Your Name" required class="devatva-chat-input" style="border-radius: 6px;" />
              <input type="tel" id="devatva-cb-phone" placeholder="WhatsApp / Phone Number" required class="devatva-chat-input" style="border-radius: 6px;" />
              <select id="devatva-cb-time" class="devatva-chat-input" style="border-radius: 6px;">
                <option value="Morning">Preferred Time: Morning (10 AM - 1 PM)</option>
                <option value="Afternoon">Preferred Time: Afternoon (2 PM - 5 PM)</option>
                <option value="Evening">Preferred Time: Evening (6 PM - 9 PM)</option>
              </select>
              <button type="submit" class="devatva-gold-btn" style="padding: 8px 16px; font-size: 0.85rem; margin-top: 4px;">
                📞 Request Callback
              </button>
            </form>
          </div>
        `;
        inputArea.style.display = 'none';
      }
    },

    sendMessage: function () {
      const input = document.getElementById('devatva-chat-input-field');
      if (!input || !input.value.trim()) return;

      const userText = input.value.trim();
      input.value = '';

      const messagesContainer = document.getElementById('devatva-chat-messages');

      // Render User Message
      const userMsg = document.createElement('div');
      userMsg.className = 'devatva-chat-msg user';
      userMsg.innerText = userText;
      messagesContainer.appendChild(userMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Simulate Bot Thinking
      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'devatva-chat-msg bot';

        if (this.activeTab === 'tracking') {
          botMsg.innerHTML = `
            ✨ <strong>Status for Order ${userText}:</strong><br/>
            • <strong>Pran Pratishtha Status:</strong> ✅ Completed at Kashi Vedic Ashram.<br/>
            • <strong>Dispatch:</strong> Shipped via Express Air.<br/>
            • <strong>Tracking AWBL:</strong> BLUEDART 891029381<br/>
            • <strong>Est. Delivery:</strong> Within 2 Business Days.
          `;
        } else {
          // AI Advice Response Logic
          const lower = userText.toLowerCase();
          if (lower.includes('wealth') || lower.includes('money') || lower.includes('business')) {
            botMsg.innerHTML = `
              💰 For financial growth and wealth abundance, Lord Kubera blesses the <strong>Panchdhatu Pixiu Wealth Ring</strong> and <strong>5 Mukhi Silver Rudraksha Bracelet</strong>. Wear on Friday or Monday morning!
            `;
          } else if (lower.includes('nazar') || lower.includes('evil') || lower.includes('protection')) {
            botMsg.innerHTML = `
              🛡️ To nullify Nazar (evil eye) and black negative energies, we recommend the <strong>Black Tourmaline & Tiger Eye Nazar Shield Bracelet</strong> combined with a <strong>Pure Copper Mahadev Om Trishul Kada</strong>.
            `;
          } else {
            botMsg.innerHTML = `
              🙏 Based on sacred scriptures, every authentic Rudraksha & sanctified gem holds unique planetary frequencies. Would you like to take our 2-minute <strong>Astro Matchmaker Quiz</strong> on the homepage?
            `;
          }
        }

        messagesContainer.appendChild(botMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 700);
    },

    submitCallback: function (e) {
      e.preventDefault();
      const name = document.getElementById('devatva-cb-name').value;
      const phone = document.getElementById('devatva-cb-phone').value;

      const messagesContainer = document.getElementById('devatva-chat-messages');
      messagesContainer.innerHTML += `
        <div class="devatva-chat-msg bot" style="margin-top: 12px;">
          ✅ Thank you Pranam <strong>${name}</strong>! Our Head Priest will call you on <strong>${phone}</strong> during your requested time window.
        </div>
      `;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
  };

  document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('devatva-chat-input-field');
    if (inputField) {
      inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') DevatvaChatbot.sendMessage();
      });
    }
  });
})();
