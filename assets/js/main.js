document.addEventListener('DOMContentLoaded', () => {
  const OWNER_EMAIL = 'akhileshgoswami@arivoai.in';

  const phones = document.querySelectorAll('.phone-wrap');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  phones.forEach((phone) => observer.observe(phone));

  function switchForm(type) {
    const waitlistForm = document.getElementById('waitlistForm');
    const demoForm = document.getElementById('demoForm');
    const tabWaitlist = document.getElementById('tabWaitlist');
    const tabDemo = document.getElementById('tabDemo');

    hideFeedback();

    if (type === 'demo') {
      waitlistForm.style.display = 'none';
      demoForm.classList.add('visible');
      tabWaitlist.classList.remove('active');
      tabDemo.classList.add('active');
      return;
    }

    waitlistForm.style.display = 'flex';
    demoForm.classList.remove('visible');
    tabWaitlist.classList.add('active');
    tabDemo.classList.remove('active');
  }

  function markInvalid(input) {
    input.style.borderColor = '#f87171';
    input.style.boxShadow = '0 0 0 3px rgba(248,113,113,0.15)';
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.boxShadow = '';
    }, 2000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function sendToInbox(data) {
    const response = await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        ...data,
        _to: OWNER_EMAIL,
        _captcha: 'false',
        _template: 'table',
      }),
    });

    if (!response.ok) throw new Error('Submission failed');
    return response.json();
  }

  function hideFeedback() {
    document.getElementById('successMsg').classList.remove('visible');
    document.getElementById('errorMsg').classList.remove('visible');
  }

  function showSuccess(title, body) {
    const successMsg = document.getElementById('successMsg');
    const errorMsg = document.getElementById('errorMsg');

    document.getElementById('successTitle').textContent = title;
    document.getElementById('successBody').textContent = body;
    errorMsg.classList.remove('visible');
    successMsg.classList.add('visible');
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showError() {
    const successMsg = document.getElementById('successMsg');
    const errorMsg = document.getElementById('errorMsg');

    successMsg.classList.remove('visible');
    errorMsg.classList.add('visible');
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideForms() {
    document.getElementById('waitlistForm').style.display = 'none';
    document.getElementById('demoForm').classList.remove('visible');
    document.querySelector('.form-tabs').style.display = 'none';
  }

  async function handleWaitlist(event) {
    event.preventDefault();

    const input = document.getElementById('emailInput');
    const btn = document.getElementById('waitlistBtn');
    const email = input.value.trim();

    if (!isValidEmail(email)) {
      markInvalid(input);
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Joining...';
    hideFeedback();

    try {
      await sendToInbox({
        'Waitlist Email': email,
        type: 'Waitlist Signup',
        _subject: 'New Arivo OS Waitlist Signup',
        _replyto: email,
      });

      hideForms();
      showSuccess("You're on the list!", "We'll reach out when Arivo OS launches.");
      input.value = '';
    } catch {
      showError();
    } finally {
      btn.disabled = false;
      btn.textContent = 'Join Waitlist →';
    }
  }

  async function handleDemo(event) {
    event.preventDefault();

    const nameInput = document.getElementById('demoName');
    const emailInput = document.getElementById('demoEmail');
    const companyInput = document.getElementById('demoCompany');
    const btn = document.getElementById('demoBtn');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const company = companyInput.value.trim();

    if (!name) {
      markInvalid(nameInput);
      return;
    }

    if (!isValidEmail(email)) {
      markInvalid(emailInput);
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending...';
    hideFeedback();

    try {
      await sendToInbox({
        Name: name,
        Email: email,
        Company: company || 'Not provided',
        type: 'Demo Request',
        _subject: 'New Arivo OS Demo Request',
        _replyto: email,
      });

      hideForms();
      showSuccess('Demo request received!', "We'll contact you shortly.");
      nameInput.value = '';
      emailInput.value = '';
      companyInput.value = '';
    } catch {
      showError();
    } finally {
      btn.disabled = false;
      btn.textContent = 'Request Demo →';
    }
  }

  document.getElementById('waitlistForm').addEventListener('submit', handleWaitlist);
  document.getElementById('demoForm').addEventListener('submit', handleDemo);

  document.querySelectorAll('a[href="#waitlist"]').forEach((link) => {
    if (link.textContent.toLowerCase().includes('demo')) {
      link.addEventListener('click', () => {
        setTimeout(() => switchForm('demo'), 100);
      });
    }
  });

  window.switchForm = switchForm;

  const productVideo = document.getElementById('productVideo');
  const videoSoundToggle = document.getElementById('videoSoundToggle');

  if (productVideo && videoSoundToggle) {
    productVideo.play().catch(() => {});

    videoSoundToggle.addEventListener('click', () => {
      const isMuted = productVideo.muted;
      productVideo.muted = !isMuted;
      videoSoundToggle.classList.toggle('is-unmuted', isMuted);
      videoSoundToggle.setAttribute('aria-pressed', String(isMuted));
      videoSoundToggle.setAttribute('aria-label', isMuted ? 'Turn sound off' : 'Turn sound on');
      videoSoundToggle.title = isMuted ? 'Turn sound off' : 'Turn sound on';

      if (isMuted) productVideo.play().catch(() => {});
    });
  }

  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 50
      ? 'rgba(5,12,26,0.95)'
      : 'rgba(5,12,26,0.7)';
  });

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    document.querySelectorAll('.orb').forEach((orb, index) => {
      orb.style.transform = `translateY(${y * (index === 0 ? 0.08 : 0.05)}px)`;
    });
  });
});
