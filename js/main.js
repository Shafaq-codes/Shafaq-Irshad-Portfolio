/**
 * Shafaq Irshad — Portfolio Scripts
 * High-performance, lightweight, zero-lag kinetic intro & scroll interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
  initPreloader();
  initCopyEmail();
  initContactForm();
  initCapsuleScrollInteraction();
  initActiveNavHighlight();
});

/* --------------------------------------------------------------------------
   1. Kinetic Preloader Flash Sequence (PLAN -> BUILD -> SHIP -> SCALE)
   -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const wordEl = document.getElementById('preloaderWord');
  const bgFlash = document.getElementById('preloaderBgFlash');
  const barFill = document.getElementById('preloaderBarFill');
  const skipBtn = document.getElementById('preloaderSkip');
  
  if (!preloader || !wordEl) return;

  // Background visual themes matching the keywords
  const frames = [
    {
      word: 'PLAN',
      bg: 'radial-gradient(circle at center, #1a237e 0%, #000 85%), linear-gradient(rgba(0,242,254,0.1) 2px, transparent 2px)'
    },
    {
      word: 'BUILD',
      bg: 'radial-gradient(circle at center, #2e1065 0%, #000 85%), linear-gradient(90deg, rgba(121,40,202,0.15) 1px, transparent 1px)'
    },
    {
      word: 'SHIP',
      bg: 'radial-gradient(circle at center, #064e3b 0%, #000 85%), radial-gradient(circle, rgba(16,185,129,0.2) 10%, transparent 60%)'
    },
    {
      word: 'SCALE',
      bg: 'radial-gradient(circle at center, #831843 0%, #000 85%), linear-gradient(45deg, rgba(255,51,68,0.2) 25%, transparent 25%)'
    }
  ];

  let currentIndex = 0;
  let isSkipped = false;
  const frameDuration = 480; // ms per word

  function showFrame(index) {
    if (isSkipped) return;
    
    if (index >= frames.length) {
      endPreloader();
      return;
    }

    const frame = frames[index];
    wordEl.className = 'preloader-word exit';
    
    setTimeout(() => {
      if (isSkipped) return;
      wordEl.textContent = frame.word;
      wordEl.className = 'preloader-word active';
      bgFlash.style.background = frame.bg;
      
      const progressPercent = ((index + 1) / frames.length) * 100;
      if (barFill) barFill.style.width = `${progressPercent}%`;

      setTimeout(() => {
        showFrame(index + 1);
      }, frameDuration);
    }, 80);
  }

  function endPreloader() {
    if (isSkipped) return;
    isSkipped = true;
    preloader.classList.add('hidden');
    document.body.classList.remove('preloader-active');
    
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 700);
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', endPreloader);
  }

  // Start sequence
  showFrame(0);
}

/* --------------------------------------------------------------------------
   2. Eye Capsule & Scroll Reveal Interaction
   -------------------------------------------------------------------------- */
function initCapsuleScrollInteraction() {
  const capsule = document.getElementById('heroEyeCapsule');
  const revealSection = document.getElementById('about');
  const scrollIndicator = document.getElementById('scrollIndicator');

  if (capsule && revealSection) {
    capsule.addEventListener('click', () => {
      revealSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (scrollIndicator && revealSection) {
    scrollIndicator.addEventListener('click', () => {
      revealSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Subtle interactive parallax for capsule eye movement tracking cursor on hero
  const heroSection = document.querySelector('.hero-section');
  const eyeImg = capsule ? capsule.querySelector('img') : null;

  if (heroSection && eyeImg) {
    let ticking = false;
    
    heroSection.addEventListener('mousemove', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = heroSection.getBoundingClientRect();
          const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
          const yPercent = (e.clientY - rect.top) / rect.height - 0.5;

          // Subtle natural eye shift
          const shiftX = xPercent * 10;
          const shiftY = yPercent * 6;

          eyeImg.style.transform = `translate(calc(-49.5% + ${shiftX}px), calc(-37.5% + ${shiftY}px)) scale(1.02)`;
          ticking = false;
        });
        ticking = true;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      eyeImg.style.transform = 'translate(-49.5%, -37.5%) scale(1)';
    });
  }
}



/* --------------------------------------------------------------------------
   4. Copy Email to Clipboard
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBox = document.getElementById('copyEmailBox');
  const emailVal = 'shafaqueries@gmail.com';

  if (!copyBox) return;

  async function handleCopy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailVal);
      } else {
        // Fallback for non-https or restricted environments
        const textArea = document.createElement('textarea');
        textArea.value = emailVal;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      const btnText = copyBox.querySelector('.copy-email-btn');
      if (btnText) {
        const originalHtml = btnText.innerHTML;
        btnText.innerHTML = '<i class="fa-solid fa-check"></i> COPIED!';
        btnText.style.color = 'var(--accent-emerald)';
        
        setTimeout(() => {
          btnText.innerHTML = originalHtml;
          btnText.style.color = '';
        }, 2000);
      }
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  }

  copyBox.addEventListener('click', handleCopy);
  copyBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCopy();
    }
  });
}

/* --------------------------------------------------------------------------
   5. Direct Message Form Submission via mailto:
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  const statusMsg = document.getElementById('formStatusMsg');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (!form || !statusMsg || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('senderName');
    const msgInput = document.getElementById('senderMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const message = msgInput ? msgInput.value.trim() : '';

    if (!name || !message) {
      statusMsg.className = 'form-status-msg error';
      statusMsg.textContent = 'Please fill out both your name and message.';
      return;
    }

    const recipient = 'shafaqueries@gmail.com';
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Hi Shafaq,\n\n${message}\n\n— Best regards,\n${name}`);

    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

    statusMsg.className = 'form-status-msg success';
    statusMsg.textContent = '✓ Opening your email client to send message...';

    // Trigger mail client
    window.location.href = mailtoUrl;

    setTimeout(() => {
      form.reset();
      setTimeout(() => {
        statusMsg.textContent = '';
      }, 4000);
    }, 1000);
  });
}

/* --------------------------------------------------------------------------
   6. Active Nav Link on Scroll & Click
   -------------------------------------------------------------------------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  // Immediate active update on click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}


