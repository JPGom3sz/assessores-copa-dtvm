// ╔══════════════════════════════════════════════════════════════════╗
// ║  DADOS DA RODADA — edite aqui e salve. A tabela se reordena     ║
// ║  automaticamente do 1º ao último pelo campo `pontos`.           ║
// ╚══════════════════════════════════════════════════════════════════╝
const ASSESSORES = [
    {
        nome:      'Luis Siscato',
        retencao:  '0%',
        retencaoV: 0,
        captacao:  'R$ 0M',
        receita:   'R$ 0K',
        pontos:    0,
        avColor:   '#00d2ff',
    },
    {
        nome:      'Erick Rodrigo',
        retencao:  '0%',
        retencaoV: 0,
        captacao:  'R$ 0M',
        receita:   'R$ 0K',
        pontos:    0,
        avColor:   '#b8b8b8',
    },
    {
        nome:      'Pedro Aleixo',
        retencao:  '0%',
        retencaoV: 0,
        captacao:  'R$ 0M',
        receita:   'R$ 0K',
        pontos:    0,
        avColor:   '#cd7f32',
    },
    {
        nome:      'Rafael Barbosa',
        retencao:  '0%',
        retencaoV: 0,
        captacao:  'R$ 0M',
        receita:   'R$ 0K',
        pontos:    0,
        avColor:   '#5577aa',
    },
];
// ══════════════════════════════════════════════════════════════════


document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Renderiza tabela ordenada por pontos ───────────────────────────────
    function buildLeaderboard() {
        const tbody = document.getElementById('leaderboard-body');
        if (!tbody) return;

        // ordena decrescente por pontos
        const sorted = [...ASSESSORES].sort((a, b) => b.pontos - a.pontos);

        const medalConfig = [
            { cls: 'gold',   label: 'Líder da rodada',  svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 15l3.09-1.96L12 9l-3.09 4.04L12 15z"/><path d="M8.5 17.5l-2-3 5.5-3.5 5.5 3.5-2 3H8.5z"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="1.5"/></svg>` },
            { cls: 'silver', label: 'Vice-líder',        svg: '' },
            { cls: 'bronze', label: 'Top 3',             svg: '' },
        ];

        tbody.innerHTML = sorted.map((a, i) => {
            const pos   = i + 1;
            const medal = medalConfig[i]; // undefined for pos ≥ 4
            const isTop = pos <= 3;

            const posCell = isTop
                ? `<div class="medal ${medal.cls}">${medal.svg}<span>${pos}</span></div>`
                : `<span class="pos-num">${pos}</span>`;

            const subtitle = isTop ? `<span>${medal.label}</span>` : '';

            const rowClass = isTop
                ? `row-top top-${pos}`
                : 'row-normal';

            return `
            <tr class="${rowClass}" data-pos="${pos}">
                <td class="col-pos">${posCell}</td>
                <td class="col-name">
                    <div class="assessor-cell">
                        <div class="avatar" style="--av-color:${a.avColor}"></div>
                        <div class="assessor-meta">
                            <strong>${a.nome}</strong>
                            ${subtitle}
                        </div>
                    </div>
                </td>
                <td>
                    <div class="stat-cell">
                        <div class="stat-bar" style="--bar-w:${a.retencaoV}%"></div>
                        <span>${a.retencao}</span>
                    </div>
                </td>
                <td><span class="currency">R$</span> ${a.captacao.replace('R$ ','')}</td>
                <td><span class="currency">R$</span> ${a.receita.replace('R$ ','')}</td>
                <td class="col-score"><span class="score-num">${a.pontos.toLocaleString('pt-BR')}</span></td>
            </tr>`;
        }).join('');

        // re-observa os score-nums recém-criados para animação de contagem
        document.querySelectorAll('.score-num').forEach(el => scoreObserver.observe(el));
    }


    // ── 2. Header scroll effect ───────────────────────────────────────────────
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });


    // ── 3. Smooth Scroll ──────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const el = document.querySelector(anchor.getAttribute('href'));
            if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 94;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    // ── 4. Fade-in on scroll ──────────────────────────────────────────────────
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-in').forEach(el => io.observe(el));


    // ── 5. Score counter animation ────────────────────────────────────────────
    const scoreObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
            if (isNaN(target)) return;
            const duration = 1200;
            const startTime = performance.now();
            const tick = (now) => {
                const p    = Math.min((now - startTime) / duration, 1);
                const ease = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(ease * target).toLocaleString('pt-BR');
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });


    // ── 6. Flip cards (mobile tap) ────────────────────────────────────────────
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', () => {
            if (window.matchMedia('(pointer: coarse)').matches)
                card.classList.toggle('flipped');
        });
    });


    // ── 7. Mobile nav toggle ──────────────────────────────────────────────────
    const menuBtn = document.getElementById('menu-toggle');
    const nav     = document.querySelector('nav');
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            const open = nav.style.display === 'flex';
            Object.assign(nav.style, {
                display:        open ? 'none' : 'flex',
                flexDirection:  'column',
                position:       'absolute',
                top:            '90px',
                left:           '0',
                right:          '0',
                background:     'rgba(3,13,30,0.97)',
                backdropFilter: 'blur(18px)',
                padding:        '16px 24px',
                borderBottom:   '1px solid rgba(0,210,255,0.15)',
                gap:            '4px',
            });
            if (!open) nav.querySelectorAll('a').forEach(a => a.style.padding = '12px 16px');
        });
    }


    // ── 8. Particle canvas ────────────────────────────────────────────────────
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];

        const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        class Particle {
            constructor() { this.reset(true); }
            reset(init) {
                this.x     = Math.random() * W;
                this.y     = init ? Math.random() * H : H + 4;
                this.vy    = -(0.25 + Math.random() * 0.4);
                this.vx    = (Math.random() - 0.5) * 0.15;
                this.r     = 0.8 + Math.random() * 1.4;
                this.alpha = 0.15 + Math.random() * 0.55;
                this.color = Math.random() > 0.7 ? '0,210,255' : '255,255,255';
            }
            update() { this.x += this.vx; this.y += this.vy; if (this.y < -4) this.reset(false); }
            draw()   { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fillStyle = `rgba(${this.color},${this.alpha})`; ctx.fill(); }
        }

        for (let i = 0; i < 55; i++) particles.push(new Particle());
        const loop = () => { ctx.clearRect(0,0,W,H); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(loop); };
        loop();
    }


    // ── Inicia ────────────────────────────────────────────────────────────────
    buildLeaderboard();
});
