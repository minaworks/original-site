const nav = document.querySelector('#global-nav');
const menuButton = document.querySelector('.menu-button');
const siteHeader = document.querySelector('.site-header');

const mainVideo = document.querySelector('#mainvideo');
if (mainVideo) {
  const setPlaybackSpeed = () => {
    mainVideo.defaultPlaybackRate = 0.5;
    mainVideo.playbackRate = 0.5;
  };

  setPlaybackSpeed();
  mainVideo.addEventListener('loadedmetadata', setPlaybackSpeed, { once: true });
}

const featuredLip = document.querySelector('.featured-lip img');
const featuredLipCaption = document.querySelector('.featured-lip figcaption');
const lipColorOptions = document.querySelectorAll('.lips .lip-color-option');

if (featuredLip && lipColorOptions.length) {
  const initialSrc = featuredLip.getAttribute('src');
  let lipSwapTimer;
  let lipRevealTimer;

  const revealFeaturedLip = () => {
    window.clearTimeout(lipRevealTimer);
    featuredLip.classList.remove('is-revealing');
    void featuredLip.offsetWidth;
    featuredLip.classList.add('is-revealing');

    lipRevealTimer = window.setTimeout(() => {
      featuredLip.classList.remove('is-revealing');
    }, 1000);
  };

  const swapFeaturedLip = (src, alt, label, revealWhenUnchanged = true) => {
    window.clearTimeout(lipSwapTimer);

    if (featuredLip.getAttribute('src') === src) {
      featuredLip.alt = alt;
      if (featuredLipCaption) featuredLipCaption.textContent = label;
      featuredLip.classList.remove('is-changing');
      if (revealWhenUnchanged) revealFeaturedLip();
      return;
    }

    featuredLip.classList.add('is-changing');

    lipSwapTimer = window.setTimeout(() => {
      featuredLip.src = src;
      featuredLip.alt = alt;
      if (featuredLipCaption) featuredLipCaption.textContent = label;
      featuredLip.classList.remove('is-changing');
      revealFeaturedLip();
    }, 200);
  };

  const selectLip = option => {
    swapFeaturedLip(
      option.dataset.featuredSrc,
      option.dataset.featuredAlt,
      option.dataset.label
    );

    lipColorOptions.forEach(item => {
      item.setAttribute('aria-pressed', String(item === option));
    });
  };

  lipColorOptions.forEach(option => {
    const preloadImage = new Image();
    preloadImage.src = option.dataset.featuredSrc;

    option.setAttribute(
      'aria-pressed',
      String(option.dataset.featuredSrc === initialSrc)
    );

    option.addEventListener('click', () => selectLip(option));
    option.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectLip(option);
      }
    });
  });
}

const featuredEyeshadow = document.querySelector('.featured-eyeshadow img');
const eyeColorOptions = document.querySelectorAll('.eyeshadows .eye-color-option');

if (featuredEyeshadow && eyeColorOptions.length) {
  const initialSrc = featuredEyeshadow.getAttribute('src');
  let eyeshadowSwapTimer;
  let eyeshadowRevealTimer;

  const revealFeaturedEyeshadow = () => {
    window.clearTimeout(eyeshadowRevealTimer);
    featuredEyeshadow.classList.remove('is-revealing');
    void featuredEyeshadow.offsetWidth;
    featuredEyeshadow.classList.add('is-revealing');

    eyeshadowRevealTimer = window.setTimeout(() => {
      featuredEyeshadow.classList.remove('is-revealing');
    }, 1000);
  };

  const swapFeaturedEyeshadow = (src, alt, revealWhenUnchanged = true) => {
    window.clearTimeout(eyeshadowSwapTimer);

    if (featuredEyeshadow.getAttribute('src') === src) {
      featuredEyeshadow.alt = alt;
      featuredEyeshadow.classList.remove('is-changing');
      if (revealWhenUnchanged) revealFeaturedEyeshadow();
      return;
    }

    featuredEyeshadow.classList.add('is-changing');

    eyeshadowSwapTimer = window.setTimeout(() => {
      featuredEyeshadow.src = src;
      featuredEyeshadow.alt = alt;
      featuredEyeshadow.classList.remove('is-changing');
      revealFeaturedEyeshadow();
    }, 200);
  };

  const selectEyeshadow = option => {
    swapFeaturedEyeshadow(
      option.dataset.featuredSrc,
      option.dataset.featuredAlt
    );

    eyeColorOptions.forEach(item => {
      item.setAttribute('aria-pressed', String(item === option));
    });
  };

  eyeColorOptions.forEach(option => {
    const preloadImage = new Image();
    preloadImage.src = option.dataset.featuredSrc;

    option.setAttribute(
      'aria-pressed',
      String(option.dataset.featuredSrc === initialSrc)
    );

    option.addEventListener('click', () => selectEyeshadow(option));
    option.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectEyeshadow(option);
      }
    });
  });
}

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  siteHeader.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  siteHeader.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'メニューを開く');
}));

const serviceArticles = document.querySelectorAll('#menu .service-grid article');

serviceArticles.forEach(article => {
  const link = article.querySelector('.round-link');

  if (!link) return;

  article.addEventListener('click', event => {
    if (event.target.closest('a, button, input, select, textarea')) return;
    window.location.href = link.href;
  });

  article.addEventListener('pointerleave', () => {
    article.classList.remove('is-hover-reset');
  });
});

window.addEventListener('pageshow', event => {
  const navigation = performance.getEntriesByType('navigation')[0];
  const returnedWithBack = event.persisted || navigation?.type === 'back_forward';

  if (!returnedWithBack) return;

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  window.requestAnimationFrame(() => {
    serviceArticles.forEach(article => {
      article.classList.toggle('is-hover-reset', article.matches(':hover'));
    });
  });
});

const productsSection = document.querySelector('.products-section');
if (productsSection) {
  const voiceLink = nav.querySelector('a[href="#voice"]');
  const voiceSection = document.querySelector('#voice');

  if (voiceLink && voiceSection) {
    voiceLink.addEventListener('click', event => {
      event.preventDefault();
      productsSection.classList.add('is-jump-preparing', 'is-expanded');

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          productsSection.classList.remove('is-jump-preparing');
          voiceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

          if (window.location.hash !== '#voice') {
            window.history.pushState(null, '', '#voice');
          }
        });
      });
    });
  }

  let productsTicking = false;

  const updateProductsLayout = () => {
    const rect = productsSection.getBoundingClientRect();
    const expandPoint = window.innerHeight * 0.35;
    const shouldExpand = rect.top <= expandPoint;

    productsSection.classList.toggle('is-expanded', shouldExpand);
    productsTicking = false;
  };

  const requestProductsLayoutUpdate = () => {
    if (productsTicking) return;
    productsTicking = true;
    window.requestAnimationFrame(updateProductsLayout);
  };

  updateProductsLayout();
  window.addEventListener('scroll', requestProductsLayoutUpdate, { passive: true });
  window.addEventListener('resize', requestProductsLayoutUpdate);
}

const dialog = document.querySelector('#booking-dialog');
document.querySelectorAll('.open-booking').forEach(button => button.addEventListener('click', () => dialog.showModal()));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
document.querySelector('#booking-form').addEventListener('submit', event => {
  event.preventDefault();
  event.currentTarget.hidden = true;
  dialog.classList.add('is-success');
  dialog.querySelector('.form-success').hidden = false;
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
