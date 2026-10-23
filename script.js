const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
let stars = [];
let nebulae = [];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initElements();
}

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.2;
        this.alpha = Math.random() * 0.8 + 0.2;
        this.speed = Math.random() * 0.05 + 0.01;
        const colors = ['#ffffff', '#fefae0', '#d4a373', '#8c6d58', '#f8f9fa'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    }

    update() {
        this.alpha += Math.sin(Date.now() * this.twinkleSpeed) * 0.01;
        if (this.alpha <= 0.1) this.alpha = 0.2;
        if (this.alpha >= 1) this.alpha = 0.9;
    }

    draw() {
        const offsetX = (mouse.x - width / 2) * this.speed * 0.02;
        const offsetY = (mouse.y - height / 2) * this.speed * 0.02;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + offsetX, this.y + offsetY, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class NebulaGlow {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 300 + 150;
        const colors = [
            'rgba(58, 35, 27, 0.18)',
            'rgba(140, 109, 88, 0.12)',
            'rgba(212, 163, 115, 0.08)',
            'rgba(35, 21, 16, 0.25)'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speed = Math.random() * 0.02 + 0.005;
    }

    draw() {
        const offsetX = (mouse.x - width / 2) * this.speed * 0.05;
        const offsetY = (mouse.y - height / 2) * this.speed * 0.05;

        const gradient = ctx.createRadialGradient(
            this.x + offsetX, this.y + offsetY, 0,
            this.x + offsetX, this.y + offsetY, this.radius
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x + offsetX, this.y + offsetY, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initElements() {
    stars = [];
    nebulae = [];
    const starCount = Math.floor((width * height) / 3000);
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }
    for (let i = 0; i < 6; i++) {
        nebulae.push(new NebulaGlow());
    }
}

function animateGalaxy() {
    ctx.clearRect(0, 0, width, height);

    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    nebulae.forEach(n => n.draw());
    stars.forEach(s => {
        s.update();
        s.draw();
    });

    requestAnimationFrame(animateGalaxy);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
});

/* =========================================================
   2. MOBILE MENU TOGGLE
========================================================= */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

/* =========================================================
   3. PROJECT CATEGORY FILTERING
========================================================= */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
            b.classList.remove('active', 'bg-amberGlow', 'text-espresso');
            b.classList.add('glass-card', 'text-softWhite');
        });
        btn.classList.add('active', 'bg-amberGlow', 'text-espresso');
        btn.classList.remove('glass-card', 'text-softWhite');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

/* =========================================================
   4. STATISTICS COUNTER ANIMATION ON SCROLL
========================================================= */
const counters = document.querySelectorAll('.counter');
let animated = false;

function checkCounters() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const aboutSection = document.getElementById('about');

    if (aboutSection && scrollPosition > aboutSection.offsetTop + 100 && !animated) {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const speed = target / 30;

            const updateCount = () => {
                count += speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 40);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
        animated = true;
    }
}

window.addEventListener('scroll', checkCounters);

/* =========================================================
   5. MODAL VIEWER FOR PROJECTS
========================================================= */
const modal = document.getElementById('project-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');

function openModal(title, desc, imgSrc) {
    modalTitle.innerText = title;
    modalDesc.innerText = desc;
    modalImg.src = imgSrc;
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

/* =========================================================
   6. CONTACT FORM SUBMISSION MOCK
========================================================= */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.classList.remove('hidden');
    contactForm.reset();
    setTimeout(() => {
        formStatus.classList.add('hidden');
    }, 5000);
});


window.onload = function () {
    resizeCanvas();
    animateGalaxy();
};
