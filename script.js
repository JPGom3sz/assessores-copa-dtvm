document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Animação de contagem de números ──────────────────────────────
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


    // ── 2. Renderiza tabela ordenada por pontos ─────────────────────────
    function buildLeaderboard() {
        const tbody = document.getElementById('leaderboard-body');
        if (!tbody) return;

        // "ASSESSORES" agora vem direto do arquivo dados.js
        const sorted = [...ASSESSORES].sort((a, b) => b.pontos - a.pontos);
        const medalConfig = [
            { cls: 'gold',   label: 'Líder da rodada',  svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 15l3.09-1.96L12 9l-3.09 4.04L12 15z"/><path d="M8.5 17.5l-2-3 5.5-3.5 5.5 3.5-2 3H8.5z"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="1.5"/></svg>` },
            { cls: 'silver', label: 'Vice-líder',        svg: '' },
            { cls: 'bronze', label: 'Top 3',             svg: '' },
        ];

        tbody.innerHTML = sorted.map((a, i) => {
            const pos   = i + 1;
            const medal = medalConfig[i];
            const isTop = pos <= 3;
            const posCell = isTop ? `<div class="medal ${medal.cls}">${medal.svg}<span>${pos}</span></div>` : `<span class="pos-num">${pos}</span>`;
            const subtitle = isTop ? `<span>${medal.label}</span>` : '';
            const rowClass = isTop ? `row-top top-${pos}` : 'row-normal';

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

        document.querySelectorAll('#leaderboard-body .score-num').forEach(el => scoreObserver.observe(el));
    }


    // ── 3. Renderiza os Flip Cards Dinamicamente ────────────────────────
    function buildCards() {
        const grid = document.querySelector('.cards-grid');
        if (!grid) return;

        const sorted = [...ASSESSORES].sort((a, b) => b.pontos - a.pontos);

        grid.innerHTML = sorted.map((a, i) => {
            let badgeHtml = '';
            if (i === 0) badgeHtml = `<div class="flip-badge leader">Líder da Rodada</div>`;
            else if (i === 1) badgeHtml = `<div class="flip-badge silver">Vice-Líder</div>`;
            else if (i === 2) badgeHtml = `<div class="flip-badge bronze">Top 3</div>`;

            return `
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-front">
                        <div class="card-img-slot"></div>
                        <div class="card-front-label">${a.nome}</div>
                    </div>
                    <div class="flip-back">
                        <div class="flip-back-content">
                            <div class="flip-avatar" style="--av-color:${a.avColor}"></div>
                            <h4>${a.nome}</h4>
                            <p class="flip-role">Assessor</p>
                            <ul class="flip-stats">
                                <li><span>Retenção</span><strong>${a.retencao}</strong></li>
                                <li><span>Captação</span><strong>${a.captacao}</strong></li>
                                <li><span>Receita</span><strong>${a.receita}</strong></li>
                                <li><span>Pontos</span><strong class="pts score-num">${a.pontos.toLocaleString('pt-BR')}</strong></li>
                            </ul>
                            ${badgeHtml}
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');

        document.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('click', () => {
                if (window.matchMedia('(pointer: coarse)').matches)
                    card.classList.toggle('flipped');
            });
        });

        document.querySelectorAll('.flip-back-content .score-num').forEach(el => scoreObserver.observe(el));
    }


    // ── 4. Efeitos Visuais (Scroll, Fade-in, Partículas, Menu) ──────────
    
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

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

    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

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

    // ── Inicia a renderização ───────────────────────────────────────────
    buildLeaderboard();
    buildCards();
});