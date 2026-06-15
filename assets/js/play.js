document.addEventListener('DOMContentLoaded', () => {
  const RATE_DIFF = 0.065 - 0.03;
  const MOVE_RATIO = 0.36;

  let playScore = Number(sessionStorage.getItem('arivoPlayScore') || 0);
  let engineStep = -1;
  let currentScenario = 'invest';
  let idleCash = 125000;

  const $ = (id) => document.getElementById(id);

  const SCENARIOS = {
    invest: {
      spark: '⚡',
      badge: "This week's action",
      title: (s) => `Move ${formatINR(s.move)} to liquid fund`,
      sub: 'Your savings earn 3%. This earns 6.5% with same liquidity.',
      impact1: (s) => `+₹${Math.round(s.monthlyGain)}`,
      impactLbl1: 'per month',
      impact2: (s) => formatINRShort(s.yearlyGain),
      impactLbl2: 'per year',
      dualImpact: true,
      cta: 'Take action',
      success: (s) => `+₹${Math.round(s.monthlyGain)}/month unlocked`,
      reasons: (s) => [
        { icon: '💰', text: `${formatINR(s.idleCash, true)} idle` },
        { icon: '📅', text: 'No bills due' },
        { icon: '✓', text: 'Buffer safe' },
      ],
      float1: (s) => ({ label: 'Idle cash found', value: formatINR(s.idleCash), icon: 'dot' }),
      float2: (s) => ({ label: 'Extra yield', value: `+₹${Math.round(s.monthlyGain)}/mo`, icon: '↗' }),
      compare: (s) => ({
        icon1: '📉', lbl1: 'Leaving on table', loss: `${formatINR(s.yearlyGain)}<span>/yr</span>`,
        icon2: '⚡', lbl2: "Arivo's move", move: `Move ${formatINR(s.move)}`,
        icon3: '🎉', lbl3: 'You gain', gain: `+₹${Math.round(s.monthlyGain)}<span>/mo</span>`,
        simulate: 'Run this decision',
      }),
      hasSlider: true,
    },
    creditcard: {
      spark: '💳',
      badge: 'Due in 3 days',
      title: () => 'Pay HDFC card ₹18,500 now',
      sub: 'Avoid ₹462 interest + late fee. You have enough in savings.',
      impact1: () => '₹462',
      impactLbl1: 'interest saved',
      impact2: () => '₹0',
      impactLbl2: 'late fees',
      dualImpact: true,
      cta: 'Pay now',
      success: () => 'Card cleared · credit score safe',
      reasons: () => [
        { icon: '📅', text: 'Due Jun 18' },
        { icon: '💳', text: 'Min ₹750' },
        { icon: '✓', text: 'Buffer OK' },
      ],
      float1: () => ({ label: 'Amount due', value: '₹18,500', icon: 'dot' }),
      float2: () => ({ label: 'Days left', value: '3 days', icon: '⏱' }),
      compare: () => ({
        icon1: '⚠️', lbl1: 'If you miss it', loss: '₹462<span>+ fees</span>',
        icon2: '💳', lbl2: 'Arivo says', move: 'Pay full ₹18,500',
        icon3: '✓', lbl3: 'You save', gain: '₹462<span>interest</span>',
        simulate: 'Pay credit card',
      }),
      panel: { label: 'HDFC Credit Card', urgency: 'Due in 3 days', amount: '₹18,500', desc: 'Full payment recommended — minimum due costs more long-term.' },
    },
    emi: {
      spark: '🏠',
      badge: 'Due tomorrow',
      title: () => 'Schedule home loan EMI ₹8,750',
      sub: 'Auto-debit from HDFC savings — never miss a payment again.',
      impact1: () => '0',
      impactLbl1: 'late risk',
      impact2: () => '12',
      impactLbl2: 'month streak',
      dualImpact: true,
      cta: 'Set auto-pay',
      success: () => 'EMI scheduled · Jun 10',
      reasons: () => [
        { icon: '🏠', text: 'Home loan' },
        { icon: '📅', text: 'Due tomorrow' },
        { icon: '✓', text: 'Funds ready' },
      ],
      float1: () => ({ label: 'EMI amount', value: '₹8,750', icon: 'dot' }),
      float2: () => ({ label: 'Due date', value: 'Tomorrow', icon: '⏱' }),
      compare: () => ({
        icon1: '⚠️', lbl1: 'If you miss it', loss: '₹750<span>late fee</span>',
        icon2: '🏠', lbl2: 'Arivo says', move: 'Auto-pay ₹8,750',
        icon3: '🔥', lbl3: 'Streak', gain: '12<span>months</span>',
        simulate: 'Schedule EMI',
      }),
      panel: { label: 'Home Loan EMI', urgency: 'Due tomorrow', amount: '₹8,750', desc: 'One tap to schedule auto-debit from your linked account.' },
    },
    bill: {
      spark: '📋',
      badge: 'Overdue · 2 days',
      title: () => 'Pay electricity bill ₹2,340',
      sub: 'BBPS one-tap. Reconnect risk if delayed further.',
      impact1: () => '₹2,340',
      impactLbl1: 'outstanding',
      impact2: () => '2',
      impactLbl2: 'days overdue',
      dualImpact: true,
      cta: 'Pay via BBPS',
      success: () => 'Bill paid · BESCOM cleared',
      reasons: () => [
        { icon: '⚡', text: 'Electricity' },
        { icon: '🔴', text: '2 days late' },
        { icon: '📱', text: 'BBPS ready' },
      ],
      float1: () => ({ label: 'Outstanding', value: '₹2,340', icon: 'dot' }),
      float2: () => ({ label: 'Status', value: 'Overdue', icon: '!' }),
      compare: () => ({
        icon1: '⚠️', lbl1: 'If ignored', loss: 'Reconnect<span>risk</span>',
        icon2: '📋', lbl2: 'Arivo says', move: 'Pay ₹2,340 now',
        icon3: '✓', lbl3: 'Result', gain: 'Cleared<span>today</span>',
        simulate: 'Pay bill',
      }),
      panel: { label: 'BESCOM Electricity', urgency: 'Overdue', amount: '₹2,340', desc: 'Pay through BBPS in one tap — no biller app needed.' },
    },
    autopay: {
      spark: '⚡',
      badge: 'Smart schedule',
      title: () => 'Auto-pay 3 bills on payday',
      sub: 'Rent, insurance & SIP — scheduled for 1st of month when salary hits.',
      impact1: () => '3',
      impactLbl1: 'bills covered',
      impact2: () => '0',
      impactLbl2: 'missed ever',
      dualImpact: true,
      cta: 'Enable auto-pay',
      success: () => '3 bills on autopilot',
      reasons: () => [
        { icon: '🏠', text: 'Rent ₹15K' },
        { icon: '🏥', text: 'Insurance' },
        { icon: '📈', text: 'SIP ₹5K' },
      ],
      float1: () => ({ label: 'Bills linked', value: '3 active', icon: 'dot' }),
      float2: () => ({ label: 'Next run', value: 'Jul 1', icon: '↗' }),
      compare: () => ({
        icon1: '😰', lbl1: 'Manual tracking', loss: 'Stress<span>every month</span>',
        icon2: '⚡', lbl2: 'Arivo says', move: 'Auto-pay on payday',
        icon3: '🎯', lbl3: 'Result', gain: '0<span>missed</span>',
        simulate: 'Set up auto-pay',
      }),
      panel: { label: 'Auto-pay bundle', urgency: 'Smart schedule', amount: '3 bills', desc: 'Rent, insurance & SIP — all fire on the 1st when your salary lands.' },
    },
    alert: {
      spark: '🔔',
      badge: '3 alerts today',
      title: () => 'Review your due dates',
      sub: 'Credit card in 3 days · EMI tomorrow · Insurance in 7 days.',
      impact1: () => '3',
      impactLbl1: 'upcoming',
      impact2: () => '0',
      impactLbl2: 'overdue',
      dualImpact: true,
      cta: 'View all alerts',
      success: () => 'All caught up for today',
      reasons: () => [
        { icon: '💳', text: 'Card · 3d' },
        { icon: '🏠', text: 'EMI · 1d' },
        { icon: '🏥', text: 'Insurance · 7d' },
      ],
      float1: () => ({ label: 'Due this week', value: '3 items', icon: 'dot' }),
      float2: () => ({ label: 'Next alert', value: 'EMI tomorrow', icon: '🔔' }),
      compare: () => ({
        icon1: '😵', lbl1: 'Without Arivo', loss: 'Miss<span>dates</span>',
        icon2: '🔔', lbl2: 'Arivo says', move: '3 alerts queued',
        icon3: '✓', lbl3: 'Peace of', gain: 'Mind<span>daily</span>',
        simulate: 'Clear alerts',
      }),
      panel: { label: 'Due date alerts', urgency: '3 today', amount: '3 alerts', desc: 'Credit card, EMI, and insurance — all in one notification feed.' },
    },
  };

  function formatINR(n, compact = false) {
    if (compact && n >= 100000) {
      const lakhs = n / 100000;
      return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2)}L`;
    }
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
  }

  function formatINRShort(n) {
    if (n >= 1000) return `+₹${(n / 1000).toFixed(1)}K`;
    return `+₹${Math.round(n)}`;
  }

  function calcInvestState(cash = idleCash) {
    const move = Math.max(5000, Math.round((cash * MOVE_RATIO) / 5000) * 5000);
    const yearlyGain = move * RATE_DIFF;
    const monthlyGain = yearlyGain / 12;
    return { idleCash: cash, move, yearlyGain, monthlyGain };
  }

  function getState() {
    if (currentScenario === 'invest') return calcInvestState(idleCash);
    return { idleCash };
  }

  function bumpScore(points = 1) {
    if (points <= 0) return;
    playScore += points;
    sessionStorage.setItem('arivoPlayScore', String(playScore));
    const pill = $('playScorePill');
    const text = $('playScoreText');
    if (pill && text) {
      pill.hidden = false;
      text.textContent = `${playScore} explored`;
      pill.classList.remove('bump');
      void pill.offsetWidth;
      pill.classList.add('bump');
    }
  }

  function applyScenario(id, animate = false) {
    currentScenario = id;
    const sc = SCENARIOS[id];
    const state = getState();

    document.querySelectorAll('.scenario-chip').forEach((chip) => {
      const active = chip.dataset.scenario === id;
      chip.classList.toggle('active', active);
      chip.setAttribute('aria-selected', String(active));
    });

    const spark = document.querySelector('.app-decision-spark');
    if (spark) spark.textContent = sc.spark;

    const set = (elId, text) => {
      const el = $(elId);
      if (!el) return;
      if (animate) {
        el.classList.add('tick');
        setTimeout(() => el.classList.remove('tick'), 300);
      }
      el.textContent = text;
    };

    set('appBadgeText', sc.badge);
    set('appDecisionTitle', sc.title(state));
    set('appDecisionSub', sc.sub);
    set('appImpactMonth', sc.impact1(state));
    set('appImpactLbl1', sc.impactLbl1);
    set('appImpactYear', sc.impact2(state));
    set('appImpactLbl2', sc.impactLbl2);
    set('appTakeAction', sc.cta);

    const divider = $('appImpactDivider');
    const wrap2 = $('appImpact2Wrap');
    if (divider) divider.hidden = !sc.dualImpact;
    if (wrap2) wrap2.hidden = !sc.dualImpact;

    const reasons = sc.reasons(state);
    ['appReason1', 'appReason2', 'appReason3'].forEach((rid, i) => {
      const el = $(rid);
      const row = el?.closest('.app-reason');
      if (el && reasons[i]) {
        el.textContent = reasons[i].text;
        if (row) row.querySelector('.app-reason-icon').textContent = reasons[i].icon;
      }
    });

    const f1 = sc.float1(state);
    const f2 = sc.float2(state);
    set('floatPrimaryLabel', f1.label);
    set('floatPrimaryVal', f1.value);
    set('floatSecondaryLabel', f2.label);
    set('floatSecondaryVal', f2.value);
    const pIcon = $('floatPrimaryIcon');
    const sIcon = $('floatSecondaryIcon');
    if (pIcon) {
      pIcon.textContent = f1.icon === 'dot' ? '●' : f1.icon;
      pIcon.className = f1.icon === 'dot' ? 'product-float-dot' : 'product-float-icon';
    }
    if (sIcon) sIcon.textContent = f2.icon;

    const cmp = sc.compare(state);
    if ($('playCompareIcon1')) $('playCompareIcon1').textContent = cmp.icon1;
    if ($('playCompareIcon2')) $('playCompareIcon2').textContent = cmp.icon2;
    if ($('playCompareIcon3')) $('playCompareIcon3').textContent = cmp.icon3;
    set('playCompareLbl1', cmp.lbl1);
    set('playCompareLbl2', cmp.lbl2);
    set('playCompareLbl3', cmp.lbl3);
    if ($('playLoss')) $('playLoss').innerHTML = cmp.loss;
    if ($('playMoveLabel')) $('playMoveLabel').textContent = cmp.move;
    if ($('playGain')) $('playGain').innerHTML = cmp.gain;
    set('playSimulateText', cmp.simulate);

    const investPanel = $('playPanelInvest');
    const defaultPanel = $('playPanelDefault');
    if (investPanel) investPanel.hidden = !sc.hasSlider;
    if (defaultPanel) defaultPanel.hidden = !!sc.hasSlider;

    if (sc.panel) {
      set('playPanelLabel', sc.panel.label);
      set('playPanelUrgency', sc.panel.urgency);
      set('playPanelAmount', sc.panel.amount);
      set('playPanelDesc', sc.panel.desc);
    }

    if (sc.hasSlider) updateInvestSlider(idleCash, animate);

    window.__arivoPlayState = { scenario: id, success: sc.success(state), ...state };
    resetAppDecision();
  }

  function updateInvestSlider(cash, animate) {
    idleCash = cash;
    const state = calcInvestState(cash);
    const slider = $('idleCashSlider');
    const min = Number(slider?.min || 25000);
    const max = Number(slider?.max || 500000);
    const pct = ((cash - min) / (max - min)) * 100;

    const amount = $('playAmount');
    if (amount) {
      if (animate) amount.classList.add('tick');
      amount.textContent = formatINR(cash);
      if (animate) setTimeout(() => amount.classList.remove('tick'), 300);
    }

    const fill = $('playTrackFill');
    if (fill) fill.style.width = `${pct}%`;

    if (currentScenario === 'invest') {
      applyScenario('invest', animate);
    }
  }

  function sparkBurst(x, y) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = $('sparkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#00d4aa', '#3b82f6', '#a855f7', '#fbbf24', '#fff'];
    const particles = Array.from({ length: 36 }, () => ({
      x, y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10 - 2,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
    }));
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life -= 0.028;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      frame += 1;
      if (alive && frame < 80) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    draw();
  }

  window.arivoSpark = sparkBurst;

  function showAppSuccess() {
    const hero = document.querySelector('.app-decision-hero');
    const success = $('appSuccess');
    const state = window.__arivoPlayState;
    if (!hero || !success || !state) return;

    const msg = typeof state.success === 'string' ? state.success : SCENARIOS[state.scenario]?.success(getState());
    $('appSuccessSub').textContent = typeof msg === 'function' ? msg(getState()) : (msg || 'Done!');

    hero.hidden = true;
    success.hidden = false;
    success.classList.add('pop');

    $('productDevice')?.classList.add('device-celebrate');
    const rect = $('appTakeAction')?.getBoundingClientRect();
    if (rect) sparkBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

    bumpScore(2);
    setTimeout(() => $('productDevice')?.classList.remove('device-celebrate'), 600);
  }

  function resetAppDecision() {
    const hero = document.querySelector('.app-decision-hero');
    const success = $('appSuccess');
    if (hero) hero.hidden = false;
    if (success) {
      success.hidden = true;
      success.classList.remove('pop');
    }
  }

  const engineMessages = [
    'Banks, cards & bills linked',
    'EMIs, dues & idle cash mapped',
    'Best action for each moment',
    'Alerts sent · payments ready',
  ];

  function setEngineStep(step) {
    const flow = $('engineFlow');
    if (!flow) return;

    flow.querySelectorAll('.engine-step').forEach((el, i) => {
      el.classList.toggle('is-lit', i <= step);
      el.classList.toggle('is-active', i === step);
    });
    flow.querySelectorAll('.engine-connector').forEach((el, i) => {
      el.classList.toggle('is-lit', i < step);
    });

    const toast = $('engineToast');
    if (toast) {
      toast.hidden = false;
      toast.textContent = engineMessages[step] || '';
      toast.classList.add('show');
    }

    if (step === 3) {
      bumpScore(1);
      $('engineHint').textContent = 'Engine complete — try all 6 decision types below ✨';
      setTimeout(() => $('play')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 800);
    }
  }

  function initEngine() {
    const flow = $('engineFlow');
    const steps = document.querySelectorAll('.engine-flow-interactive .engine-step');

    steps.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = Number(btn.dataset.step);

        if (engineStep === 3 && target === 0) {
          engineStep = -1;
          $('engineHint').textContent = 'Tap each step to run the engine →';
          $('engineToast').hidden = true;
          flow?.querySelectorAll('.engine-step, .engine-connector').forEach((el) => {
            el.classList.remove('is-lit', 'is-active');
          });
          return;
        }

        if (target !== engineStep + 1) {
          if (target <= engineStep) {
            engineStep = target - 1;
            setEngineStep(target);
            return;
          }
          $('engineHint').textContent = 'Go in order — tap the next step →';
          btn.classList.add('shake');
          setTimeout(() => btn.classList.remove('shake'), 400);
          return;
        }

        engineStep = target;
        setEngineStep(engineStep);
        btn.classList.add('tap');
        setTimeout(() => btn.classList.remove('tap'), 200);
        if (engineStep < 3) $('engineHint').textContent = `Step ${engineStep + 2} of 4 — keep going →`;
      });
    });

    $('engineHint')?.addEventListener('click', () => {
      if (engineStep >= 3) return;
      engineStep += 1;
      setEngineStep(engineStep);
      if (engineStep < 3) $('engineHint').textContent = `Step ${engineStep + 2} of 4 — keep going →`;
    });
  }

  function initScenarios() {
    document.querySelectorAll('.scenario-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        applyScenario(chip.dataset.scenario, true);
        bumpScore(1);
        $('product')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }

  function initSlider() {
    const slider = $('idleCashSlider');
    if (!slider) return;
    slider.addEventListener('input', () => {
      idleCash = Number(slider.value);
      updateInvestSlider(idleCash, true);
    });
  }

  function initButtons() {
    $('appTakeAction')?.addEventListener('click', showAppSuccess);
    $('appResetAction')?.addEventListener('click', resetAppDecision);

    $('playSimulateBtn')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      btn.classList.add('pressed');
      setTimeout(() => btn.classList.remove('pressed'), 200);
      const rect = btn.getBoundingClientRect();
      sparkBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      $('product')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      $('productDevice')?.classList.add('view-decision');
      $('productDevice')?.classList.remove('view-demo');
      document.querySelectorAll('.product-tab').forEach((t) => {
        const active = t.dataset.view === 'decision';
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });
      setTimeout(showAppSuccess, 500);
      bumpScore(1);
    });

    [$('floatPrimary'), $('floatSecondary')].forEach((el) => {
      if (!el) return;
      const bounce = () => {
        el.classList.add('bounce');
        setTimeout(() => el.classList.remove('bounce'), 400);
      };
      el.addEventListener('click', bounce);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bounce(); }
      });
    });
  }

  if (playScore > 0) {
    const pill = $('playScorePill');
    const text = $('playScoreText');
    if (pill && text) {
      pill.hidden = false;
      text.textContent = `${playScore} explored`;
    }
  }

  initEngine();
  initScenarios();
  initSlider();
  initButtons();
  applyScenario('invest');

  window.addEventListener('resize', () => {
    const canvas = $('sparkCanvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });
});
