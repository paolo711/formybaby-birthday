document.documentElement.classList.add('js-ready');

function getContainer() {
    let container = document.getElementById('heart-container');
    if (!container && document.body) {
        container = document.createElement('div');
        container.id = 'heart-container';
        document.body.prepend(container);
    }
    return container;
}

function createFallingElement() {
    const container = getContainer();
    if (!container) return;

    const items = [
        { symbol: '\u2764', className: 'heart' },
        { symbol: '\uD83C\uDF38', className: 'flower' },
        { symbol: '\u273F', className: 'flower' },
        { symbol: '\u2740', className: 'flower' }
    ];

    const chosen = items[Math.floor(Math.random() * items.length)];
    const element = document.createElement('div');
    element.classList.add(chosen.className);
    element.textContent = chosen.symbol;

    const size = Math.random() * 1.2 + 0.8;
    const duration = Math.random() * 3 + 4;

    element.style.left = Math.random() * 100 + 'vw';
    element.style.fontSize = size + 'rem';
    element.style.animationDuration = duration + 's';

    container.appendChild(element);

    setTimeout(() => {
        element.remove();
    }, duration * 1000);
}

function startFallingEffect() {
    for (let i = 0; i < 14; i++) {
        setTimeout(createFallingElement, i * 180);
    }
    setInterval(createFallingElement, 180);
}

let isManualNavigation = false;
let manualNavTimeout;

function setActiveLink(id) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
        }
    });
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('href').replace('#', '');
            isManualNavigation = true;
            setActiveLink(targetId);

            clearTimeout(manualNavTimeout);
            manualNavTimeout = setTimeout(() => {
                isManualNavigation = false;
            }, 800);
        });
    });

    window.addEventListener('scroll', () => {
        if (isManualNavigation) return;

        const sections = document.querySelectorAll('section');
        if (!sections.length) return;

        const reachedBottom = window.innerHeight + Math.ceil(window.scrollY) >= document.documentElement.scrollHeight - 10;

        if (reachedBottom) {
            const lastSection = sections[sections.length - 1];
            setActiveLink(lastSection.getAttribute('id'));
            return;
        }

        let current = sections[0].getAttribute('id');

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 220;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        setActiveLink(current);
    });
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    function revealInView() {
        const triggerBottom = window.innerHeight - 40;
        revealElements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < triggerBottom) {
                el.classList.add('visible');
            }
        });
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        revealElements.forEach((el) => observer.observe(el));
    }

    window.addEventListener('scroll', revealInView, { passive: true });
    revealInView();
}

function initLightbox() {
    const overlay = document.getElementById('lightbox-overlay');
    const content = document.getElementById('lightbox-content');
    const closeBtn = document.getElementById('lightbox-close');
    if (!overlay || !content || !closeBtn) return;

    function openLightbox(element) {
        content.innerHTML = '';
        content.appendChild(element);
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeLightbox() {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    const photoCards = document.querySelectorAll('.hero-photo-card, .photo-card');
    photoCards.forEach((card) => {
        card.addEventListener('click', () => {
            const modalCard = document.createElement('div');
            modalCard.className = 'modal-photo-card';

            const tape = document.createElement('div');
            tape.className = 'washi-tape';

            const frame = document.createElement('div');
            frame.className = 'modal-photo-frame';

            const sourceImg = card.querySelector('img');
            const sourceBox = card.querySelector('.slide-photo, .photo-placeholder');

            if (sourceImg) {
                const clonedImg = document.createElement('img');
                clonedImg.src = sourceImg.src;
                clonedImg.alt = sourceImg.alt || '';
                frame.appendChild(clonedImg);
            } else if (sourceBox) {
                frame.textContent = sourceBox.textContent.trim();
            }

            const caption = document.createElement('span');
            caption.className = 'modal-photo-caption';
            const sourceCaption = card.querySelector('.slide-caption, span');
            if (sourceCaption) {
                caption.textContent = sourceCaption.textContent.trim();
            }

            modalCard.appendChild(tape);
            modalCard.appendChild(frame);
            modalCard.appendChild(caption);

            openLightbox(modalCard);
        });
    });

    const noteCards = document.querySelectorAll('.note-card');
    noteCards.forEach((card) => {
        card.addEventListener('click', () => {
            const modalNote = document.createElement('div');
            modalNote.className = 'modal-note-card';

            const quote = document.createElement('span');
            quote.className = 'note-quote';
            quote.innerHTML = '“';

            const message = document.createElement('p');
            message.className = 'note-message';
            const sourceMessage = card.querySelector('.note-message');
            if (sourceMessage) {
                message.textContent = sourceMessage.textContent.trim();
            }

            const footer = document.createElement('div');
            footer.className = 'note-footer';

            const sender = document.createElement('span');
            sender.className = 'note-sender';
            const sourceSender = card.querySelector('.note-sender');
            if (sourceSender) {
                sender.textContent = sourceSender.textContent.trim();
            }

            footer.appendChild(sender);
            modalNote.appendChild(quote);
            modalNote.appendChild(message);
            modalNote.appendChild(footer);

            openLightbox(modalNote);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && overlay.classList.contains('active')) {
            closeLightbox();
        }
    });
}

function initMusicPlayer() {
    const bgAudio = document.getElementById('bg-music');
    const birthdayAudio = document.getElementById('birthday-music');
    const greetingsSection = document.getElementById('greetings');
    const player = document.getElementById('music-player');
    const playerTitle = document.getElementById('player-title');
    const toggleBtn = document.getElementById('music-toggle');
    const muteBtn = document.getElementById('music-mute');
    const progress = document.getElementById('player-progress');
    if (!bgAudio || !player || !toggleBtn || !muteBtn || !progress) return;

    bgAudio.volume = 0.45;
    if (birthdayAudio) {
        birthdayAudio.volume = 0.55;
    }

    let activeAudio = bgAudio;
    let hasInteracted = false;
    let isSeeking = false;
    let isInGreetings = false;
    let wasBgPlayingBeforeGreetings = false;
    let birthdayPlayedThisVisit = false;

    function updatePlayingState(isPlaying) {
        player.classList.toggle('playing', isPlaying);
    }

    function setTrackUI(track, titleText) {
        activeAudio = track;
        if (playerTitle) {
            playerTitle.textContent = titleText;
        }
        progress.value = track.duration ? (track.currentTime / track.duration) * 100 : 0;
    }

    function playBgMusic() {
        setTrackUI(bgAudio, 'our song');
        const playPromise = bgAudio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    hasInteracted = true;
                    updatePlayingState(true);
                })
                .catch(() => {
                    updatePlayingState(false);
                });
        }
    }

    function playBirthdaySong() {
        if (!birthdayAudio) return;
        birthdayAudio.currentTime = 0;
        birthdayAudio.muted = bgAudio.muted;
        setTrackUI(birthdayAudio, 'birthday song');
        const playPromise = birthdayAudio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    hasInteracted = true;
                    birthdayPlayedThisVisit = true;
                    updatePlayingState(true);
                })
                .catch(() => {
                    updatePlayingState(false);
                });
        }
    }

    function handleEnterGreetings() {
        if (isInGreetings) return;
        isInGreetings = true;
        birthdayPlayedThisVisit = false;
        wasBgPlayingBeforeGreetings = !bgAudio.paused;

        if (!bgAudio.paused) {
            bgAudio.pause();
        }

        playBirthdaySong();
    }

    function handleLeaveGreetings() {
        if (!isInGreetings) return;
        isInGreetings = false;
        birthdayPlayedThisVisit = false;

        if (birthdayAudio) {
            birthdayAudio.pause();
            birthdayAudio.currentTime = 0;
        }

        setTrackUI(bgAudio, 'our song');

        if (wasBgPlayingBeforeGreetings) {
            playBgMusic();
        } else {
            updatePlayingState(!bgAudio.paused);
        }
    }

    if (birthdayAudio) {
        birthdayAudio.addEventListener('ended', () => {
            birthdayAudio.currentTime = 0;
            setTrackUI(bgAudio, 'our song');
            if (wasBgPlayingBeforeGreetings) {
                playBgMusic();
            } else {
                updatePlayingState(false);
            }
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('href');
            if (target === '#greetings') {
                handleEnterGreetings();
            } else {
                handleLeaveGreetings();
            }
        });
    });

    if (greetingsSection && 'IntersectionObserver' in window) {
        const greetingsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (isManualNavigation) return;
                if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
                    handleEnterGreetings();
                } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
                    handleLeaveGreetings();
                }
            });
        }, {
            threshold: [0, 0.2, 0.35, 0.6]
        });

        greetingsObserver.observe(greetingsSection);
    }

    toggleBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        hasInteracted = true;
        if (activeAudio.paused) {
            const promise = activeAudio.play();
            if (promise !== undefined) {
                promise.then(() => {
                    if (activeAudio === birthdayAudio) {
                        birthdayPlayedThisVisit = true;
                    }
                    updatePlayingState(true);
                }).catch(() => {
                    updatePlayingState(false);
                });
            }
        } else {
            activeAudio.pause();
            if (activeAudio === bgAudio) {
                wasBgPlayingBeforeGreetings = false;
            }
            updatePlayingState(false);
        }
    });

    muteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        hasInteracted = true;
        const nextMuted = !bgAudio.muted;
        bgAudio.muted = nextMuted;
        if (birthdayAudio) {
            birthdayAudio.muted = nextMuted;
        }
        player.classList.toggle('muted', nextMuted);
    });

    [bgAudio, birthdayAudio].forEach((track) => {
        if (!track) return;
        track.addEventListener('timeupdate', () => {
            if (track !== activeAudio || isSeeking || !track.duration) return;
            progress.value = (track.currentTime / track.duration) * 100;
        });
    });

    progress.addEventListener('pointerdown', () => {
        isSeeking = true;
    });

    progress.addEventListener('input', (event) => {
        event.stopPropagation();
        if (activeAudio.duration) {
            activeAudio.currentTime = (Number(progress.value) / 100) * activeAudio.duration;
        }
    });

    progress.addEventListener('pointerup', () => {
        isSeeking = false;
    });

    progress.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    function autoStartOnFirstInteraction() {
        if (isInGreetings && !birthdayPlayedThisVisit) {
            playBirthdaySong();
            return;
        }
        if (hasInteracted) return;
        playBgMusic();
    }

    document.addEventListener('click', autoStartOnFirstInteraction, { passive: true });
    document.addEventListener('touchstart', autoStartOnFirstInteraction, { passive: true });
}

function initPixelCake() {
    const cakeBtn = document.getElementById('pixel-cake-btn');
    const cakeHint = document.getElementById('cake-hint');
    const stage = document.querySelector('.pixel-stage');
    if (!cakeBtn || !cakeHint || !stage) return;

    const sparkColors = ['#f06292', '#ffd166', '#ff9ebb', '#e09ba6', '#ffffff'];

    function spawnPixelBurst() {
        for (let i = 0; i < 12; i++) {
            const spark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            spark.setAttribute('viewBox', '0 0 5 5');
            spark.setAttribute('shape-rendering', 'crispEdges');
            spark.classList.add('pixel-spark-burst');

            const color = sparkColors[i % sparkColors.length];
            spark.innerHTML = `<rect x="2" y="0" width="1" height="5" fill="${color}"/><rect x="0" y="2" width="5" height="1" fill="${color}"/>`;

            const angle = (Math.PI * 2 * i) / 12;
            const distance = 65 + Math.random() * 45;
            spark.style.setProperty('--dx', Math.round(Math.cos(angle) * distance) + 'px');
            spark.style.setProperty('--dy', Math.round(Math.sin(angle) * distance - 20) + 'px');

            stage.appendChild(spark);
            setTimeout(() => spark.remove(), 900);
        }
    }

    cakeBtn.addEventListener('click', () => {
        const isBlownOut = cakeBtn.classList.toggle('blown-out');
        if (isBlownOut) {
            cakeHint.innerHTML = 'make a wish! ★ (tap again to relight)';
            spawnPixelBurst();
        } else {
            cakeHint.innerHTML = 'tap the cake to blow out the candles ♡';
        }
    });
}

function getScreenFlowerLayer() {
    let layer = document.getElementById('screen-flower-layer');
    if (!layer && document.body) {
        layer = document.createElement('div');
        layer.id = 'screen-flower-layer';
        document.body.appendChild(layer);
    }
    return layer;
}

function createLushSpreadItem(theme, size, isSinglePetal) {
    if (isSinglePetal) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none">
            <path d="M16 3 C24 8 26 20 16 29 C6 20 8 8 16 3 Z" fill="${theme.petal}" stroke="${theme.center}" stroke-width="0.6"/>
            <path d="M16 7 C19 12 19 20 16 26" stroke="#fff9fb" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
        </svg>`;
    }

    return `<svg width="${size}" height="${size}" viewBox="0 0 44 44" fill="none">
        <g>
            <ellipse cx="22" cy="8" rx="6" ry="9" fill="${theme.petal}"/>
            <ellipse cx="22" cy="8" rx="6" ry="9" transform="rotate(45 22 22)" fill="${theme.petal}"/>
            <ellipse cx="22" cy="8" rx="6" ry="9" transform="rotate(90 22 22)" fill="${theme.petal}"/>
            <ellipse cx="22" cy="8" rx="6" ry="9" transform="rotate(135 22 22)" fill="${theme.petal}"/>
            <ellipse cx="22" cy="8" rx="6" ry="9" transform="rotate(180 22 22)" fill="${theme.petal}"/>
            <ellipse cx="22" cy="8" rx="6" ry="9" transform="rotate(225 22 22)" fill="${theme.petal}"/>
            <ellipse cx="22" cy="8" rx="6" ry="9" transform="rotate(270 22 22)" fill="${theme.petal}"/>
            <ellipse cx="22" cy="8" rx="6" ry="9" transform="rotate(315 22 22)" fill="${theme.petal}"/>
        </g>
        <g>
            <ellipse cx="22" cy="13" rx="4.5" ry="6.5" transform="rotate(22.5 22 22)" fill="#fff5f8" opacity="0.85"/>
            <ellipse cx="22" cy="13" rx="4.5" ry="6.5" transform="rotate(82.5 22 22)" fill="#fff5f8" opacity="0.85"/>
            <ellipse cx="22" cy="13" rx="4.5" ry="6.5" transform="rotate(142.5 22 22)" fill="#fff5f8" opacity="0.85"/>
            <ellipse cx="22" cy="13" rx="4.5" ry="6.5" transform="rotate(202.5 22 22)" fill="#fff5f8" opacity="0.85"/>
            <ellipse cx="22" cy="13" rx="4.5" ry="6.5" transform="rotate(262.5 22 22)" fill="#fff5f8" opacity="0.85"/>
            <ellipse cx="22" cy="13" rx="4.5" ry="6.5" transform="rotate(322.5 22 22)" fill="#fff5f8" opacity="0.85"/>
        </g>
        <circle cx="22" cy="22" r="4.8" fill="${theme.center}"/>
        <circle cx="22" cy="22" r="2" fill="#fff9fb"/>
    </svg>`;
}

function initBouquet() {
    const bouquetCard = document.getElementById('bouquet-card');
    const bouquetBtn = document.getElementById('bouquet-btn');
    const bouquetHint = document.getElementById('bouquet-hint');
    if (!bouquetCard || !bouquetBtn) return;

    const flowerThemes = [
        { petal: '#ffc4d6', center: '#d96b88' },
        { petal: '#f7b2c4', center: '#c95675' },
        { petal: '#ffe0ea', center: '#e57a96' },
        { petal: '#f48fb1', center: '#fff5f8' },
        { petal: '#ffa8c2', center: '#de6f8d' }
    ];

    function spreadFlowersAcrossScreen() {
        const layer = getScreenFlowerLayer();
        if (!layer) return;

        const rect = bouquetBtn.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height * 0.42;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        for (let i = 0; i < 90; i++) {
            const flowerEl = document.createElement('div');
            flowerEl.className = 'screen-flower-item';

            const theme = flowerThemes[i % flowerThemes.length];
            const isSinglePetal = i % 2 === 0;
            const size = isSinglePetal
                ? Math.round(20 + Math.random() * 18)
                : Math.round(30 + Math.random() * 26);

            flowerEl.innerHTML = createLushSpreadItem(theme, size, isSinglePetal);

            const startX = originX + (Math.random() * 160 - 80) - size / 2;
            const startY = originY + (Math.random() * 120 - 60) - size / 2;
            const endX = Math.random() * (vw - size);
            const endY = Math.random() * (vh - size);
            const rotation = Math.round(Math.random() * 720 - 360) + 'deg';
            const scale = (0.85 + Math.random() * 0.7).toFixed(2);
            const duration = (2.4 + Math.random() * 1.6).toFixed(2) + 's';
            const delay = (Math.random() * 0.45).toFixed(2) + 's';

            flowerEl.style.setProperty('--sx', Math.round(startX) + 'px');
            flowerEl.style.setProperty('--sy', Math.round(startY) + 'px');
            flowerEl.style.setProperty('--ex', Math.round(endX) + 'px');
            flowerEl.style.setProperty('--ey', Math.round(endY) + 'px');
            flowerEl.style.setProperty('--rot', rotation);
            flowerEl.style.setProperty('--sc', scale);
            flowerEl.style.setProperty('--dur', duration);
            flowerEl.style.animationDelay = delay;

            layer.appendChild(flowerEl);

            const totalMs = (parseFloat(duration) + parseFloat(delay)) * 1000 + 120;
            setTimeout(() => flowerEl.remove(), totalMs);
        }
    }

    bouquetBtn.addEventListener('click', () => {
        const isOpen = bouquetCard.classList.toggle('unwrapped');

        if (isOpen) {
            if (bouquetHint) {
                bouquetHint.innerHTML = 'blooming for you ♡ (tap again to wrap back)';
            }
            spreadFlowersAcrossScreen();
        } else if (bouquetHint) {
            bouquetHint.innerHTML = 'tap the bouquet to unwrap & shower petals ♡';
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        startFallingEffect();
        initNavigation();
        initScrollReveal();
        initLightbox();
        initMusicPlayer();
        initPixelCake();
        initBouquet();
    });
} else {
    startFallingEffect();
    initNavigation();
    initScrollReveal();
    initLightbox();
    initMusicPlayer();
    initPixelCake();
    initBouquet();
}