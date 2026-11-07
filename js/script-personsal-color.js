document.querySelectorAll('.data-booking').forEach(
    button => button.addEventListener(
        'click', () => document.querySelector('#booking').showModal()
    ));
const dialog = document.querySelector('#booking');
dialog?.querySelector('.close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', e => {
    if (e.target === dialog) dialog.close()
});
const bookingForm = dialog?.querySelector('#booking-form');
bookingForm?.addEventListener('submit', event => {
    event.preventDefault();
    event.currentTarget.hidden = true;
    dialog.classList.add('is-success');
    dialog.querySelector('.form-success').hidden = false;
});

const siteHeader = document.querySelector('.site-header');
const menuButton = siteHeader?.querySelector('.menu-button');
const pageNav = siteHeader?.querySelector('#page-nav');

const closePageMenu = () => {
    if (!menuButton || !pageNav) return;
    pageNav.classList.remove('open');
    siteHeader.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'メニューを開く');
};

if (menuButton && pageNav) {
    menuButton.addEventListener('click', () => {
        const open = pageNav.classList.toggle('open');
        siteHeader.classList.toggle('menu-open', open);
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    });

    pageNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closePageMenu);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) closePageMenu();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
            closePageMenu();
            menuButton.focus();
        }
    });
}

// personal-color.html / makeup-color.html / total-styling.html
// index.html の global-nav と同じ下線アニメーション
document.querySelectorAll('.site-header nav a').forEach(link => {
    const showUnderline = () => link.classList.add('is-underline-visible');
    const hideUnderline = () => link.classList.remove('is-underline-visible');

    link.addEventListener('mouseenter', showUnderline);
    link.addEventListener('mouseleave', hideUnderline);
    link.addEventListener('focus', showUnderline);
    link.addEventListener('blur', hideUnderline);
});

// 共通の横展開アニメーション
// personal-color.html: #about / #approach
// makeup-color.html: .receive / .lesson
// total-styling.html: .consultation
// original-product.html: .product-detail
const expandingSections = document.querySelectorAll(
    '#about, #approach, .receive, .lesson, .total-styling-page .consultation, .product-detail'
);

if (expandingSections.length) {
    let expansionTicking = false;

    const updateExpandingSections = () => {
        const expandPoint = window.innerHeight * 0.35;

        expandingSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const shouldExpand = rect.top <= expandPoint && rect.bottom > 0;
            section.classList.toggle('is-expanded', shouldExpand);
        });

        expansionTicking = false;
    };

    const requestExpansionUpdate = () => {
        if (expansionTicking) return;
        expansionTicking = true;
        window.requestAnimationFrame(updateExpandingSections);
    };

    updateExpandingSections();
    window.addEventListener('scroll', requestExpansionUpdate, {
        passive: true
    });
    window.addEventListener('resize', requestExpansionUpdate);
}
// 共通スクロール表示アニメーション
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: .12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

// personal-color.html / makeup-color.html: FAQの開閉アニメーション
document.querySelectorAll('.faq details').forEach(details => {
    const summary = details.querySelector('summary');
    const answers = [...details.children].filter(element => element !== summary);
    let detailsAnimation;
    let answerAnimations = [];
    let targetOpen = details.open;

    if (!summary) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const getBorderHeight = () => {
        const styles = getComputedStyle(details);
        return parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
    };
    const getClosedHeight = () => {
        const styles = getComputedStyle(details);
        return summary.getBoundingClientRect().height
            + parseFloat(styles.paddingTop)
            + parseFloat(styles.paddingBottom)
            + getBorderHeight();
    };
    const stopAnimations = () => {
        detailsAnimation?.cancel();
        answerAnimations.forEach(animation => animation.cancel());
        answerAnimations = [];
    };
    const finishAnimation = open => {
        targetOpen = open;
        details.open = open;
        detailsAnimation?.cancel();
        answerAnimations.forEach(animation => animation.cancel());
        details.style.height = '';
        details.style.overflow = '';
        detailsAnimation = undefined;
        answerAnimations = [];
    };
    const animateDetails = open => {
        if (reducedMotion.matches) {
            stopAnimations();
            finishAnimation(open);
            return;
        }

        const startHeight = details.getBoundingClientRect().height;
        if (open) details.open = true;
        const endHeight = open
            ? details.scrollHeight + getBorderHeight()
            : getClosedHeight();

        stopAnimations();
        details.style.overflow = 'hidden';
        detailsAnimation = details.animate(
            { height: [`${startHeight}px`, `${endHeight}px`] },
            { duration: 800, easing: 'ease', fill: 'both' }
        );
        answerAnimations = answers.map(answer => answer.animate(
            open
                ? [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'translateY(0)' }]
                : [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-8px)' }],
            { duration: 800, easing: 'ease', fill: 'both' }
        ));
        detailsAnimation.onfinish = () => finishAnimation(open);
    };

    summary.addEventListener('click', event => {
        event.preventDefault();
        targetOpen = !targetOpen;
        animateDetails(targetOpen);
    });
});

// original-product.html: #looks
const seasons = {
    spring: { lip: 'img/lip1-Photoroom.png', eye: 'img/eyeshadow1-Photoroom.png', lipName: 'CORAL PINK', eyeName: 'GARDEN DAYBREAK', lipCopy: '華やかさをまとう透明感のある血色カラー', eyeCopy: 'やさしい血色感と透明感で生き生きとした目元に', finish: 'みずみずしいツヤのリップに、軽やかなグリーンニュアンスを合わせて' },
    summer: { lip: 'img/lip2-Photoroom.png', eye: 'img/eyeshadow2-Photoroom.png', lipName: 'MOUVE BEIGE', eyeName: 'LILAC MIST', lipCopy: '上品で洗練された大人のニュアンスカラー', eyeCopy: '青みのあるモーヴが澄んだ透明感を引き出します', finish: 'やわらかなモーヴリップと、涼やかなラベンダーで上品に' },
    autumn: { lip: 'img/lip3-Photoroom.png', eye: 'img/eyeshadow3-Photoroom.png', lipName: 'TERRACOTTA BROWN', eyeName: 'FOREST DUSK', lipCopy: '大人の余裕を感じる洗練された温もりのあるカラー', eyeCopy: '深みのあるアースカラーで落ち着いた華やかさを', finish: '温かなブラウンレッドと、森を思わせる深い色を重ねて' },
    winter: { lip: 'img/lip4-Photoroom.png', eye: 'img/eyeshadow4-Photoroom.png', lipName: 'DEEP BORDEAUX', eyeName: 'VELVET MIDNIGHT', lipCopy: '凛とした存在感を放つエレガントなカラー', eyeCopy: '澄んだコントラストが凛とした眼差しをつくります', finish: '深いボルドーとクリアな寒色で、ドラマティックな印象に' }
};
document.querySelectorAll('.shade-option').forEach(button => {
    button.addEventListener('click', () => {
        const data = seasons[button.dataset.season];

        document.querySelectorAll('.shade-option').forEach(item => {
            item.classList.toggle('is-active', item === button);
            item.setAttribute('aria-selected', String(item === button));
        });

        [['selected-lip', 'src', data.lip], ['selected-eye', 'src', data.eye]].forEach(
            ([id, key, value]) => document.getElementById(id)?.setAttribute(key, value));
        [['lip-name', data.lipName], ['eye-name', data.eyeName], ['lip-copy', data.lipCopy], ['eye-copy', data.eyeCopy], ['finish-copy', data.finish]].forEach(
            ([id, value]) => {
                const element = document.getElementById(id);
                if (element) element.textContent = value;
            });

        document.querySelectorAll('.selected-product').forEach(product => {
            product.classList.remove('is-switching');
            void product.offsetWidth;
            product.classList.add('is-switching');
        });
    });
});
const seasonLabels = [['spring', 'Spring', '可憐で、晴れやかな印象に'], ['summer', 'Summer', 'やさしく、透明感のある印象に'], ['autumn', 'Autumn', '深みのある、洗練された印象に'], ['winter', 'Winter', '凛として、印象的な美しさに']];
const seasonal = document.querySelector('.season-grid');
if (seasonal) seasonal.innerHTML = seasonLabels.map(([key, en, copy]) => `<article><div><img src="${seasons[key].lip}" alt="${en}リップ"><img src="${seasons[key].eye}" alt="${en}アイシャドウ"></div><h3>${en}</h3><p>${copy}</p></article>`).join('');

// Show the home link after the page has been scrolled.
(() => {
    const link = document.querySelector('.to-home');

    if (!link) return;

    let ticking = false;

    const updateVisibility = () => {
        const threshold = Math.min(500, window.innerHeight * .6);
        const visible = window.scrollY > threshold;

        link.classList.toggle('is-visible', visible);
        link.setAttribute('aria-hidden', String(!visible));
        link.tabIndex = visible ? 0 : -1;
        ticking = false;
    };

    const requestVisibilityUpdate = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener('scroll', requestVisibilityUpdate, { passive: true });
    window.addEventListener('resize', requestVisibilityUpdate);
    window.addEventListener('pageshow', updateVisibility);
})();
