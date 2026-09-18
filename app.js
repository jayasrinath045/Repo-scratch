/**
 * Shata Events - Main Application Script
 * Handles Interactive AI Consultant Chatbot, Mobile Menu Drawer,
 * LocalStorage Lead Synchronization, and Interactive UI Elements.
 */

// Initialize LocalStorage with default leads if empty
function initializeLeads() {
  const existing = localStorage.getItem('shata_leads');
  if (!existing) {
    const defaultLeads = [
      {
        id: 'lead-1',
        clientName: 'Rahul Sharma',
        clientPhone: '+91 98765 43210',
        eventType: 'Wedding Reception',
        city: 'Hyderabad',
        eventDate: '2026-11-15',
        guestCount: 350,
        servicesSelected: ['Catering (Premium Buffet)', 'Photography (Premium Candid)', 'Decor (Premium Designer)'],
        totalEstimate: 350000,
        time: '08:35 AM',
        status: 'new'
      },
      {
        id: 'lead-2',
        clientName: 'Sneha Reddy',
        clientPhone: '+91 91234 56789',
        eventType: '1st Birthday Party',
        city: 'Bengaluru',
        eventDate: '2026-09-28',
        guestCount: 80,
        servicesSelected: ['Catering (Standard Buffet)', 'Decor (Standard Balloons/Flowers)'],
        totalEstimate: 85000,
        time: '09:35 AM',
        status: 'new'
      }
    ];
    localStorage.setItem('shata_leads', JSON.stringify(defaultLeads));
  }
}

// Mobile Menu Toggle
function setupMobileMenu() {
  const menuBtn = document.querySelector('[aria-label="Toggle navigation menu"]');
  if (!menuBtn) return;

  // Create mobile drawer if not present
  let drawer = document.getElementById('mobile-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'mobile-drawer';
    drawer.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex flex-col justify-end sm:justify-start';
    drawer.innerHTML = `
      <div class="bg-white w-full max-w-md mx-auto rounded-t-3xl sm:rounded-b-3xl sm:rounded-t-none p-6 shadow-2xl border border-zinc-200 space-y-5 animate-slide-up">
        <div class="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div class="flex items-center">
            <img src="./logo.png" alt="Shata Logo" class="h-9 w-auto object-contain"/>
          </div>
          <button id="close-mobile-drawer" class="h-9 w-9 flex items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </button>
        </div>
        <nav class="flex flex-col gap-2 text-sm font-semibold">
          <a href="index.html" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-500/10 hover:text-[#FF6B2C] text-[#1E1105] transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#FF6B2C]"><path d="M8 2v3"></path><path d="M16 2v3"></path><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18"></path></svg>
            Book Events (Home)
          </a>
          <a href="dashboard.html" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-500/10 hover:text-[#FF6B2C] text-[#1E1105] transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#FF6B2C]"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg>
            Vendor Dashboard
          </a>
        </nav>
        <div class="pt-2">
          <a href="estimator.html" class="flex items-center justify-center h-12 w-full rounded-xl bg-[#FF6B2C] hover:bg-[#E05316] text-white font-bold shadow-md shadow-orange-500/20 text-sm">
            Plan Your Event Now
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    document.getElementById('close-mobile-drawer').addEventListener('click', () => {
      drawer.classList.add('hidden');
    });

    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        drawer.classList.add('hidden');
      }
    });
  }

  menuBtn.addEventListener('click', () => {
    drawer.classList.remove('hidden');
  });
}

// AI Consultant Chatbot Widget
function setupAIChatbot() {
  const chatToggleBtn = document.querySelector('[aria-label="Toggle AI Consultant Chatbot"]');
  if (!chatToggleBtn) return;

  // Create chat modal
  let chatBox = document.getElementById('ai-chat-widget');
  if (!chatBox) {
    chatBox = document.createElement('div');
    chatBox.id = 'ai-chat-widget';
    chatBox.className = 'fixed bottom-24 right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden hidden transition-all duration-300';
    chatBox.innerHTML = `
      <div class="p-4 bg-gradient-to-r from-[#FF6B2C] via-[#E05316] to-[#C8922A] text-white flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white font-bold">
            ✨
          </div>
          <div>
            <h3 class="font-bold text-sm tracking-tight">Shata AI Event Advisor</h3>
            <span class="text-[10px] text-white/80 flex items-center gap-1">
              <span class="h-2 w-2 rounded-full bg-emerald-400"></span> Online • Instant Answers
            </span>
          </div>
        </div>
        <button id="close-ai-chat" class="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div id="ai-chat-messages" class="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF9F6] text-xs">
        <div class="flex items-start gap-2 max-w-[85%]">
          <div class="h-7 w-7 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#FF6B2C] flex items-center justify-center shrink-0 font-bold text-[10px]">
            AI
          </div>
          <div class="p-3 bg-white border border-zinc-200 rounded-2xl rounded-tl-none text-zinc-700 shadow-sm leading-relaxed">
            Namaste! 🙏 I'm your Shata AI Event Specialist. How can I help with your upcoming celebration today?
          </div>
        </div>
      </div>

      <div class="p-2.5 bg-white border-t border-zinc-100 flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
        <button class="ai-quick-btn shrink-0 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-orange-500/10 hover:text-[#FF6B2C] text-zinc-600 transition-colors">
          💰 Average Wedding Cost
        </button>
        <button class="ai-quick-btn shrink-0 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-orange-500/10 hover:text-[#FF6B2C] text-zinc-600 transition-colors">
          📸 Best Photographers
        </button>
        <button class="ai-quick-btn shrink-0 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-orange-500/10 hover:text-[#FF6B2C] text-zinc-600 transition-colors">
          🤝 Partner Onboarding
        </button>
      </div>

      <form id="ai-chat-form" class="p-3 bg-white border-t border-zinc-200 flex gap-2 items-center">
        <input id="ai-chat-input" type="text" placeholder="Ask about budget, caterers, dates..." class="flex-1 h-10 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-[#1E1105] focus:outline-none focus:border-[#FF6B2C] font-medium" />
        <button type="submit" class="h-10 w-10 rounded-xl bg-[#FF6B2C] hover:bg-[#E05316] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20 transition-all cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
        </button>
      </form>
    `;
    document.body.appendChild(chatBox);

    document.getElementById('close-ai-chat').addEventListener('click', () => {
      chatBox.classList.add('hidden');
    });

    const messagesContainer = document.getElementById('ai-chat-messages');
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-chat-input');

    function appendMessage(sender, text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = sender === 'user' ? 'flex items-end justify-end' : 'flex items-start gap-2 max-w-[85%]';
      if (sender === 'user') {
        msgDiv.innerHTML = `
          <div class="p-3 bg-[#FF6B2C] text-white rounded-2xl rounded-tr-none text-xs shadow-sm max-w-[80%] leading-relaxed">
            ${text}
          </div>
        `;
      } else {
        msgDiv.innerHTML = `
          <div class="h-7 w-7 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#FF6B2C] flex items-center justify-center shrink-0 font-bold text-[10px]">
            AI
          </div>
          <div class="p-3 bg-white border border-zinc-200 rounded-2xl rounded-tl-none text-zinc-700 shadow-sm leading-relaxed">
            ${text}
          </div>
        `;
      }
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function generateAIResponse(query) {
      const q = query.toLowerCase();
      if (q.includes('cost') || q.includes('budget') || q.includes('price') || q.includes('average')) {
        return "In cities like Hyderabad and Bengaluru, a premium wedding reception for 150-300 guests typically ranges between ₹2,50,000 to ₹6,50,000 including multi-cuisine catering, candid photography, and designer stage decor. Try our interactive <a href='estimator.html' class='text-[#FF6B2C] font-bold underline'>Cost Estimator</a> for an exact quote!";
      } else if (q.includes('photo') || q.includes('camera') || q.includes('video')) {
        return "We have audited photography masters such as <strong>Pixels by Arjun</strong> (Hyderabad, 5.0★) and <strong>Vogue Wedding Films</strong> (Delhi, 4.9★) specializing in candid captures and cinematic drone highlight reels. Check out our <a href='services.html?category=Photography' class='text-[#FF6B2C] font-bold underline'>Photography Directory</a>!";
      } else if (q.includes('cater') || q.includes('food') || q.includes('plate') || q.includes('menu')) {
        return "Catering plates start from ₹450 for standard buffets to ₹1,400 for luxury live counters featuring authentic Hyderabadi Biryani, live Chaat stations, and artisan mocktail bars. All kitchens are physically hygiene-audited.";
      } else if (q.includes('partner') || q.includes('vendor') || q.includes('join') || q.includes('commission')) {
        return "Shata operates on a <strong>0% Commission Model</strong>! You receive qualified booking leads directly and keep 100% of your client payments. You can apply on our <a href='partner.html' class='text-[#FF6B2C] font-bold underline'>Partner Hub</a> or test the <a href='dashboard.html' class='text-[#FF6B2C] font-bold underline'>Vendor Dashboard Simulator</a>.";
      } else {
        return "Thank you for reaching out! With Shata, you get 100% verified event professionals across Hyderabad, Bengaluru, Vizag, and 76+ cities with zero hidden markups and dedicated on-site event coordination.";
      }
    }

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      appendMessage('user', text);
      chatInput.value = '';

      // Typing indicator simulation
      setTimeout(() => {
        const reply = generateAIResponse(text);
        appendMessage('ai', reply);
      }, 500);
    });

    document.querySelectorAll('.ai-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.innerText.trim();
        chatInput.value = text;
        chatForm.dispatchEvent(new Event('submit'));
      });
    });
  }

  chatToggleBtn.addEventListener('click', () => {
    chatBox.classList.toggle('hidden');
  });
}

// Ensure active nav link styling
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('header nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === 'scratch.html' && href === 'index.html') || (currentPath === '' && href === 'index.html')) {
      link.className = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-orange-500/10 text-[#FF6B2C] border border-orange-500/10 shadow-inner";
    } else {
      link.className = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all text-zinc-600 hover:text-[#1E1105] hover:bg-zinc-100/60";
    }
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeLeads();
  setupMobileMenu();
  setupAIChatbot();
  highlightActiveNav();
});
