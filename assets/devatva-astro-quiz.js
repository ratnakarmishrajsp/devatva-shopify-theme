/**
 * DEVATVA.IN - ASTRO & GEM MATCHMAKER QUIZ LOGIC (LIGHT THEME)
 * Interactive step-by-step quiz to recommend Vedic items based on Intention, Rashi, and Metal choices.
 */

(function () {
  'use strict';

  const QUIZ_STATE = {
    step: 1,
    intention: '',
    rashi: '',
    metal: '',
  };

  const MOCK_RECOMMENDATIONS = {
    wealth: [
      {
        title: 'Panchdhatu Pixiu Wealth & Abundance Ring',
        price: '₹1,499',
        handle: 'panchdhatu-pixiu-ring',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
        planet: 'Jupiter & Venus',
        reason: 'Activates Kubera Yantra energy and draws financial flow.',
        variantId: '4000101',
      },
      {
        title: '5 Mukhi Silver Capped Siddha Rudraksha Bracelet',
        price: '₹2,199',
        handle: '5-mukhi-silver-rudraksha-bracelet',
        image: 'https://images.unsplash.com/photo-1611591475285-a36adaf961e0?auto=format&fit=crop&w=600&q=80',
        planet: 'Jupiter / Guru',
        reason: 'Brings immense mental peace, clarity, and luck in business.',
        variantId: '4000102',
      },
    ],
    protection: [
      {
        title: 'Black Tourmaline & Tiger Eye Nazar Raksha Bracelet',
        price: '₹1,299',
        handle: 'black-tourmaline-nazar-raksha',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        planet: 'Saturn / Rahu-Ketu',
        reason: 'Formidable aura shield against evil eye, envy, and negativity.',
        variantId: '4000103',
      },
      {
        title: 'Pure Copper Mahadev Om Trishul Kada',
        price: '₹999',
        handle: 'pure-copper-mahadev-trishul-kada',
        image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
        planet: 'Mars / Sun',
        reason: 'Balances body bio-electricity and shields from toxic vibes.',
        variantId: '4000104',
      },
    ],
    wisdom: [
      {
        title: 'Sphatik Quartz 108 Jaap Mala (Lab Certified)',
        price: '₹1,799',
        handle: 'sphatik-quartz-108-jaap-mala',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
        planet: 'Moon / Venus',
        reason: 'Cools the mind, enhances memory retention and spiritual focus.',
        variantId: '4000105',
      },
    ],
    health: [
      {
        title: '7 Chakra Healing Gemstone Bracelet',
        price: '₹1,399',
        handle: '7-chakra-healing-bracelet',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        planet: '7 Planetary Alignment',
        reason: 'Harmonizes all 7 energy chakras for vitality and peace.',
        variantId: '4000106',
      },
    ],
  };

  window.DevatvaAstroQuiz = {
    selectOption: function (key, value) {
      QUIZ_STATE[key] = value;
      QUIZ_STATE.step++;
      this.render();
    },

    reset: function () {
      QUIZ_STATE.step = 1;
      QUIZ_STATE.intention = '';
      QUIZ_STATE.rashi = '';
      QUIZ_STATE.metal = '';
      this.render();
    },

    render: function () {
      const container = document.getElementById('devatva-quiz-body');
      const progress = document.getElementById('devatva-quiz-progress');
      if (!container) return;

      if (progress) {
        const percent = Math.min(100, Math.round((QUIZ_STATE.step / 3) * 100));
        progress.style.width = `${percent}%`;
      }

      if (QUIZ_STATE.step === 1) {
        container.innerHTML = `
          <div class="devatva-quiz-step">
            <h3 style="color: #1c1917; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">Step 1 of 3: What is your primary spiritual intention?</h3>
            <p style="color: #57534e; font-size: 0.92rem; margin-bottom: 22px;">Choose the primary blessing or energy field you wish to activate in your life.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">
              <button onclick="DevatvaAstroQuiz.selectOption('intention', 'wealth')" class="devatva-outline-btn" style="padding: 18px; flex-direction: column; gap: 8px;">
                <span style="font-size: 2rem;">💰</span>
                <span>Wealth & Abundance</span>
              </button>
              <button onclick="DevatvaAstroQuiz.selectOption('intention', 'protection')" class="devatva-outline-btn" style="padding: 18px; flex-direction: column; gap: 8px;">
                <span style="font-size: 2rem;">🛡️</span>
                <span>Nazar & Protection</span>
              </button>
              <button onclick="DevatvaAstroQuiz.selectOption('intention', 'wisdom')" class="devatva-outline-btn" style="padding: 18px; flex-direction: column; gap: 8px;">
                <span style="font-size: 2rem;">📿</span>
                <span>Wisdom & Peace</span>
              </button>
              <button onclick="DevatvaAstroQuiz.selectOption('intention', 'health')" class="devatva-outline-btn" style="padding: 18px; flex-direction: column; gap: 8px;">
                <span style="font-size: 2rem;">🌿</span>
                <span>Health & Vitality</span>
              </button>
            </div>
          </div>
        `;
      } else if (QUIZ_STATE.step === 2) {
        const rashis = [
          'Aries (Mesh)', 'Taurus (Vrishabha)', 'Gemini (Mithun)', 'Cancer (Kark)',
          'Leo (Simha)', 'Virgo (Kanya)', 'Libra (Tula)', 'Scorpio (Vrishchik)',
          'Sagittarius (Dhanu)', 'Capricorn (Makar)', 'Aquarius (Kumbh)', 'Pisces (Meen)'
        ];

        container.innerHTML = `
          <div class="devatva-quiz-step">
            <h3 style="color: #1c1917; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">Step 2 of 3: What is your Zodiac Sign (Rashi)?</h3>
            <p style="color: #57534e; font-size: 0.92rem; margin-bottom: 22px;">We match planetary ruling deities to ensure maximum planetary resonance.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; max-height: 300px; overflow-y: auto; padding-right: 4px;">
              ${rashis.map(r => `
                <button onclick="DevatvaAstroQuiz.selectOption('rashi', '${r}')" class="devatva-outline-btn" style="padding: 12px; font-size: 0.88rem;">
                  ${r}
                </button>
              `).join('')}
            </div>
          </div>
        `;
      } else if (QUIZ_STATE.step === 3) {
        container.innerHTML = `
          <div class="devatva-quiz-step">
            <h3 style="color: #1c1917; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">Step 3 of 3: Preferred Sacred Jewelry Style?</h3>
            <p style="color: #57534e; font-size: 0.92rem; margin-bottom: 22px;">Select how you wish to wear your sanctified energy item.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">
              <button onclick="DevatvaAstroQuiz.selectOption('metal', 'silver')" class="devatva-outline-btn" style="padding: 18px; flex-direction: column;">
                <span>✨ Silver Capped Beads</span>
              </button>
              <button onclick="DevatvaAstroQuiz.selectOption('metal', 'panchdhatu')" class="devatva-outline-btn" style="padding: 18px; flex-direction: column;">
                <span>🔱 Panchdhatu Metal Ring/Kada</span>
              </button>
              <button onclick="DevatvaAstroQuiz.selectOption('metal', 'copper')" class="devatva-outline-btn" style="padding: 18px; flex-direction: column;">
                <span>⚡ Pure Copper Mahadev Kada</span>
              </button>
              <button onclick="DevatvaAstroQuiz.selectOption('metal', 'gemstone')" class="devatva-outline-btn" style="padding: 18px; flex-direction: column;">
                <span>🔮 Crystal Gemstone Bracelet</span>
              </button>
            </div>
          </div>
        `;
      } else {
        // Render Recommendation Output (Light Card Style)
        const key = QUIZ_STATE.intention || 'wealth';
        const recs = MOCK_RECOMMENDATIONS[key] || MOCK_RECOMMENDATIONS.wealth;

        container.innerHTML = `
          <div class="devatva-quiz-step" style="text-align: center;">
            <div style="font-size: 2.4rem; margin-bottom: 8px;">✨🕉️✨</div>
            <h3 class="devatva-heading" style="font-size: 1.45rem; color: #1c1917; margin-bottom: 6px;">
              Your Personalized Sacred Match
            </h3>
            <p style="color: #57534e; font-size: 0.9rem; margin-bottom: 26px;">
              Based on your Rashi (<strong>${QUIZ_STATE.rashi}</strong>) & intention for <strong style="color: var(--dev-gold-dark);">${QUIZ_STATE.intention.toUpperCase()}</strong>:
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; text-align: left;">
              ${recs.map(item => `
                <div style="background: #fdfbf7; border: 1.5px solid var(--dev-gold-border); border-radius: 14px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.04);">
                  <div>
                    <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 10px; margin-bottom: 12px;" />
                    <div class="devatva-badge" style="margin-bottom: 8px;">Planet: ${item.planet}</div>
                    <h4 style="color: #1c1917; font-size: 1.05rem; font-weight: 700; margin-bottom: 6px;">${item.title}</h4>
                    <p style="font-size: 0.85rem; color: #57534e; line-height: 1.45; margin-bottom: 14px;">${item.reason}</p>
                  </div>
                  <div>
                    <div style="font-weight: 800; font-size: 1.25rem; color: var(--dev-gold-dark); margin-bottom: 14px;">${item.price}</div>
                    <button onclick="Devatva.addToCart('${item.variantId}', 1)" class="devatva-gold-btn" style="width: 100%;">
                      🛒 Claim Energized Item
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>

            <button onclick="DevatvaAstroQuiz.reset()" style="margin-top: 26px; background: none; border: none; color: var(--dev-gold-dark); font-weight: 600; text-decoration: underline; cursor: pointer;">
              🔄 Restart Astro Matchmaker
            </button>
          </div>
        `;
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    DevatvaAstroQuiz.render();
  });
})();
