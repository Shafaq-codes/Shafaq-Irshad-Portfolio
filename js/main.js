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
  initHorizontalScroll();
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
  const directEmailLink = document.getElementById('directEmailLink');
  const emailVal = 'shafaqueries@gmail.com';

  async function handleCopy(targetBtn, defaultHtml) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailVal);
      } else {
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

      if (targetBtn) {
        targetBtn.innerHTML = '<i class="fa-solid fa-check"></i> COPIED!';
        targetBtn.style.color = 'var(--accent-emerald)';
        
        setTimeout(() => {
          targetBtn.innerHTML = defaultHtml;
          targetBtn.style.color = '';
        }, 2000);
      }
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  }

  if (copyBox) {
    const btnText = copyBox.querySelector('.copy-email-btn');
    const defaultHtml = btnText ? btnText.innerHTML : '<i class="fa-regular fa-copy"></i> COPY';
    copyBox.addEventListener('click', () => handleCopy(btnText, defaultHtml));
    copyBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCopy(btnText, defaultHtml);
      }
    });
  }

  if (directEmailLink) {
    directEmailLink.addEventListener('click', () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(emailVal);
        }
      } catch (e) {}
    });
  }
}

/* --------------------------------------------------------------------------
   5. Direct Message Form Submission (Direct Instant Email Delivery)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  const statusMsg = document.getElementById('formStatusMsg');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (!form || !statusMsg || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const msgInput = document.getElementById('senderMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = msgInput ? msgInput.value.trim() : '';

    if (!name || !message) {
      statusMsg.className = 'form-status-msg error';
      statusMsg.textContent = 'Please enter your name and message.';
      return;
    }

    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
    statusMsg.className = 'form-status-msg';
    statusMsg.textContent = '';

    try {
      const response = await fetch('https://formsubmit.co/ajax/shafaqueries@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email || 'visitor@portfolio.com',
          message: message,
          _subject: `New Portfolio Message from ${name}`,
          _captcha: 'false',
          _template: 'table'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true)) {
        statusMsg.className = 'form-status-msg success';
        statusMsg.textContent = `✓ Thank you ${name}! Your message has been delivered directly to Shafaq's email.`;
        form.reset();
        setTimeout(() => {
          statusMsg.textContent = '';
        }, 7000);
      } else if (data.message && data.message.includes('Activation')) {
        statusMsg.className = 'form-status-msg success';
        statusMsg.textContent = `✓ Sent! Please check shafaqueries@gmail.com to click the 1-time "Activate Form" button.`;
        form.reset();
      } else {
        throw new Error(data.message || 'Submission error');
      }
    } catch (err) {
      statusMsg.className = 'form-status-msg error';
      statusMsg.innerHTML = `Could not send message. You can also email directly at <a href="mailto:shafaqueries@gmail.com?subject=Project Inquiry&body=${encodeURIComponent(message)}" style="color:var(--accent-cyan);text-decoration:underline;">shafaqueries@gmail.com</a>`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  });

  // Send message on Enter key (Shift+Enter for newline)
  const msgInput = document.getElementById('senderMessage');
  if (msgInput) {
    msgInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (typeof form.requestSubmit === 'function') {
          form.requestSubmit();
        } else {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    });
  }
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

/* --------------------------------------------------------------------------
   7. Pinned Horizontal Scroll Showcase (GSAP-like pure physics scroll)
   -------------------------------------------------------------------------- */
function initHorizontalScroll() {
  const section = document.querySelector('.horizontal-works-section');
  const track = document.getElementById('horizontalTrack');
  const progressBar = document.getElementById('horizontalProgressBar');

  if (!section || !track) return;

  let isTicking = false;

  function onScroll() {
    if (window.innerWidth <= 900) {
      track.style.transform = 'none';
      return;
    }

    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const totalScrollDistance = rect.height - window.innerHeight;

    if (totalScrollDistance <= 0) return;

    // Progress goes from 0 (at entry) to 1 (at exit)
    let progress = -sectionTop / totalScrollDistance;
    progress = Math.max(0, Math.min(1, progress));

    // Calculate maximum distance to scroll so the last card aligns nicely
    const trackWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const maxTranslate = trackWidth - viewportWidth + (viewportWidth * 0.1);

    const currentTranslate = progress * maxTranslate;

    track.style.transform = `translateX(-${currentTranslate}px)`;

    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }
  }

  function handleScroll() {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        onScroll();
        isTicking = false;
      });
      isTicking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  
  // Initial compute
  onScroll();
}



