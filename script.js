
// Fairy lights removed

// ===== FLOATING PETALS =====
const petals = ['🌸', '🌺', '🌹', '💮', '🌷'];
function spawnPetal() {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = petals[Math.floor(Math.random() * petals.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.fontSize = (12 + Math.random() * 14) + 'px';
    p.style.animationDuration = (4 + Math.random() * 5) + 's';
    p.style.animationDelay = '0s';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 9000);
}
setInterval(spawnPetal, 600);
for (let i = 0; i < 8; i++)setTimeout(spawnPetal, i * 300);

// ===== CLICK HANDLER =====
let clicks = 0;
const messages = [
    { icon: '🥰', title: 'Something Cute for You!', text: 'You are the most adorable person I know. Your smile lights up every room you walk into! Never stop being amazing Anjali! 💕' },
    { icon: '🎞️', title: 'Beautiful Memories!', text: 'Every moment spent with you becomes a memory I will always treasure. Thank you for being part of my story — now scroll down to see our beautiful moments! 🌸' },
    { icon: '🎁', title: 'Your Special Surprise!', text: 'This entire page was made just for YOU! Happy Birthday Anjali! May 27 is going to be the most magical day. You deserve all the love in the world! 🎊✨💖' }
];
function handleClick() {
    if (clicks === 0) {
        ['bgMusic', 'hbdMusic'].forEach(id => {
            const audio = document.getElementById(id);
            if (audio) {
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }).catch(e => console.log('Audio unlock skipped', e));
            }
        });
    }
    
    if (clicks >= 3) return;
    spawnConfetti();
    clicks++;
    document.getElementById('clickMsg').textContent = 'Click ' + clicks + ' of 3 done! ' + (clicks < 3 ? 'Keep going! 💕' : '🎉 You unlocked everything!');
    const m = messages[clicks - 1];
    showModal(m.icon, m.title, m.text);

    if (clicks === 1) {
        document.getElementById('startBtn').textContent = 'Click Again! 💕';
        document.getElementById('step2').classList.add('active');
    } else if (clicks === 2) {
        document.getElementById('startBtn').textContent = 'One More! 🎁';
        document.getElementById('step3').classList.add('active');
    } else {
        document.getElementById('startBtn').textContent = '🎉 Surprise Unlocked!';
        document.getElementById('startBtn').style.opacity = '0.7';
        document.getElementById('startBtn').style.pointerEvents = 'none';

        const hiddenContent = document.getElementById('hiddenContent');
        hiddenContent.style.display = 'block';

        const now = new Date();
        const target = new Date(now.getFullYear(), 4, 27, 0, 0, 0);
        const diff = target - now;
        if (diff <= 0 && diff > -86400000) {
            hbdTriggered = true;
            triggerHappyBirthday();
        } else {
            playMusicWithFade('bgMusic');
        }

        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
            document.getElementById('letter').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

// ===== CONFETTI =====
function spawnConfetti() {
    const colors = ['#ff6b9d', '#c9184a', '#9b59b6', '#f0a500', '#ff69b4', '#ffd700'];
    for (let i = 0; i < 60; i++) {
        const c = document.createElement('div');
        c.className = 'confetti-piece';
        c.style.cssText = `left:${30 + Math.random() * 40}vw;top:${window.scrollY + 100}px;width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;background:${colors[Math.floor(Math.random() * colors.length)]};--dx:${(Math.random() - 0.5) * 200}px;animation-duration:${1.5 + Math.random() * 2}s;animation-delay:${Math.random() * 0.3}s;transform:rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 4000);
    }
}

// ===== MODAL =====
function showModal(icon, title, text) {
    document.getElementById('modalIcon').textContent = icon;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalText').textContent = text;
    document.getElementById('modalBg').classList.add('show');
}
function closeModal() { document.getElementById('modalBg').classList.remove('show') }

// ===== MUSIC CONTROLS =====
let playing = false;
let currentMusic = 'bgMusic';
let hbdTriggered = false;

function playMusicWithFade(audioId) {
    const audio = document.getElementById(audioId);
    if (!audio) return;
    audio.volume = 0;
    audio.play().then(() => {
        let vol = 0;
        const fadeInt = setInterval(() => {
            if (vol < 0.55) {
                vol += 0.05;
                audio.volume = vol;
            } else {
                clearInterval(fadeInt);
            }
        }, 200);
        playing = true;
        document.getElementById('playBtn').textContent = '⏸';
    }).catch(e => console.log('Audio play failed', e));
}

function stopMusicWithFade(audioId) {
    const audio = document.getElementById(audioId);
    if (!audio) return;
    let vol = audio.volume;
    const fadeInt = setInterval(() => {
        if (vol > 0.05) {
            vol -= 0.05;
            audio.volume = vol;
        } else {
            clearInterval(fadeInt);
            audio.pause();
            audio.currentTime = 0;
        }
    }, 200);
}

function triggerHappyBirthday() {
    stopMusicWithFade('bgMusic');
    setTimeout(() => {
        currentMusic = 'hbdMusic';
        playMusicWithFade('hbdMusic');
    }, 1000);

    const confInt = setInterval(spawnConfetti, 1500);

    const hbdText = document.createElement('div');
    hbdText.className = 'hbd-overlay';
    hbdText.id = 'hbdOverlay';
    hbdText.innerHTML = `
        <h1>Happy Birthday Anjali! 💖</h1>
        <p>Wishing you the most magical day ever!</p>
        <button class="hbd-close" onclick="document.getElementById('hbdOverlay').remove(); clearInterval(${confInt});">Thank You! 🥰</button>
      `;
    document.body.appendChild(hbdText);
    document.body.classList.add('bday-glow');
}

// ===== COUNTDOWN =====
function updateCountdown() {
    const now = new Date();
    const target = new Date(now.getFullYear(), 4, 27, 0, 0, 0);
    if (now > target && (now - target) > 86400000) target.setFullYear(target.getFullYear() + 1);

    const diff = target - now;
    if (diff <= 0 && diff > -86400000) {
        document.getElementById('cd-days').textContent = '00';
        document.getElementById('cd-hours').textContent = '00';
        document.getElementById('cd-mins').textContent = '00';
        document.getElementById('cd-secs').textContent = '00';

        if (!hbdTriggered && clicks >= 3) {
            hbdTriggered = true;
            triggerHappyBirthday();
        }
        return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const fmt = n => String(n).padStart(2, '0');
    document.getElementById('cd-days').textContent = fmt(d);
    document.getElementById('cd-hours').textContent = fmt(h);
    document.getElementById('cd-mins').textContent = fmt(m);
    document.getElementById('cd-secs').textContent = fmt(s);
}
setInterval(updateCountdown, 1000); updateCountdown();

// ===== GALLERY FILTER =====
function filterTab(btn, cat) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.photo-card').forEach(c => {
        if (cat === 'all' || c.dataset.cat === cat) {
            c.style.display = '';
            setTimeout(() => { c.style.opacity = '1'; c.style.transform = '' }, 10);
        } else {
            c.style.opacity = '0';
            setTimeout(() => c.style.display = 'none', 250);
        }
    });
}

// ===== MUSIC PLAYER =====
function togglePlay() {
    const audio = document.getElementById(currentMusic);
    if (!audio) return;
    playing = !playing;
    if (playing) {
        audio.play();
        document.getElementById('playBtn').textContent = '⏸';
    } else {
        audio.pause();
        document.getElementById('playBtn').textContent = '▶';
    }
}
function setVol(v) {
    const pct = v + '%';
    document.querySelector('input[type=range]').style.background = `linear-gradient(90deg,#c9184a ${pct},#ffd6e7 ${pct})`;
    const audio = document.getElementById(currentMusic);
    if (audio) audio.volume = v / 100;
}

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed') });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
