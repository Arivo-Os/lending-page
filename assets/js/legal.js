document.addEventListener('DOMContentLoaded', () => {
  const toc = document.getElementById('legalToc');
  if (!toc) return;

  const links = [...toc.querySelectorAll('a')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const tocObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
  );

  sections.forEach((section) => tocObs.observe(section));

  const legalHeader = document.querySelector('.legal-header.reveal');
  if (legalHeader) {
    requestAnimationFrame(() => legalHeader.classList.add('is-visible'));
  }

  const legalLayout = document.querySelector('.legal-layout');
  if (legalLayout) {
    legalLayout.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
      el.classList.add('is-visible');
    });
  }
});
