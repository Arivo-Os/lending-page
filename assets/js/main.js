    // Scroll-based phone reveal
    const phones = document.querySelectorAll('.phone-wrap');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    phones.forEach(p => observer.observe(p));

    // All form submissions are sent to this inbox
    const OWNER_EMAIL = 'akhileshgoswami@arivoai.in';

    function switchForm(type) {
      const waitlistForm = document.getElementById('waitlistForm');
      const demoForm = document.getElementById('demoForm');
      const tabWaitlist = document.getElementById('tabWaitlist');
      const tabDemo = document.getElementById('tabDemo');
      const successMsg = document.getElementById('successMsg');
      const errorMsg = document.getElementById('errorMsg');

      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';

      if (type === 'demo') {
        waitlistForm.style.display = 'none';
        demoForm.classList.add('visible');
        tabWaitlist.classList.remove('active');
        tabDemo.classList.add('active');
      } else {
        waitlistForm.style.display = 'flex';
        demoForm.classList.remove('visible');
        tabWaitlist.classList.add('active');
        tabDemo.classList.remove('active');
      }
    }

    function markInvalid(input) {
      input.style.borderColor = '#f87171';
      input.style.boxShadow = '0 0 0 3px rgba(248,113,113,0.15)';
      setTimeout(() => { input.style.borderColor = ''; input.style.boxShadow = ''; }, 2000);
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async function sendToInbox(data) {
      const response = await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          _captcha: 'false',
          _template: 'table'
        })
      });

      if (!response.ok) throw new Error('Submission failed');
      return response.json();
    }

    function showSuccess(message) {
      const msg = document.getElementById('successMsg');
      const errorMsg = document.getElementById('errorMsg');
      errorMsg.style.display = 'none';
      msg.textContent = message;
      msg.style.display = 'block';
    }

    function showError() {
      const msg = document.getElementById('successMsg');
      const errorMsg = document.getElementById('errorMsg');
      msg.style.display = 'none';
      errorMsg.style.display = 'block';
    }

    async function handleWaitlist() {
      const input = document.getElementById('emailInput');
      const btn = document.getElementById('waitlistBtn');
      const email = input.value.trim();

      if (!isValidEmail(email)) {
        markInvalid(input);
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Joining...';

      try {
        await sendToInbox({
          email,
          type: 'Waitlist Signup',
          _subject: 'New Arivo OS Waitlist Signup'
        });

        showSuccess("🎉 You're on the list! We'll reach out when Arivo OS launches.");
        input.value = '';
        document.getElementById('waitlistForm').style.display = 'none';
        document.querySelector('.form-tabs').style.display = 'none';
      } catch {
        showError();
      } finally {
        btn.disabled = false;
        btn.textContent = 'Join Waitlist →';
      }
    }

    async function handleDemo() {
      const nameInput = document.getElementById('demoName');
      const emailInput = document.getElementById('demoEmail');
      const companyInput = document.getElementById('demoCompany');
      const btn = document.getElementById('demoBtn');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const company = companyInput.value.trim();

      if (!name) { markInvalid(nameInput); return; }
      if (!isValidEmail(email)) { markInvalid(emailInput); return; }

      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        await sendToInbox({
          name,
          email,
          company: company || 'Not provided',
          type: 'Demo Request',
          _subject: 'New Arivo OS Demo Request'
        });

        showSuccess('🎉 Demo request received! We\'ll contact you shortly.');
        nameInput.value = '';
        emailInput.value = '';
        companyInput.value = '';
        document.getElementById('demoForm').classList.remove('visible');
        document.querySelector('.form-tabs').style.display = 'none';
      } catch {
        showError();
      } finally {
        btn.disabled = false;
        btn.textContent = 'Request Demo →';
      }
    }

    // Open demo form when "Book a Demo" links are clicked
    document.querySelectorAll('a[href="#waitlist"]').forEach(link => {
      if (link.textContent.toLowerCase().includes('demo')) {
        link.addEventListener('click', () => {
          setTimeout(() => switchForm('demo'), 100);
        });
      }
    });

    // Smooth nav background on scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 50
        ? 'rgba(5,12,26,0.95)'
        : 'rgba(5,12,26,0.7)';
    });

    // Subtle parallax on hero
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      document.querySelector('.hero::before') && null;
      const orbs = document.querySelectorAll('.orb');
      orbs.forEach((o, i) => {
        o.style.transform = `translateY(${y * (i === 0 ? 0.08 : 0.05)}px)`;
      });
    });
