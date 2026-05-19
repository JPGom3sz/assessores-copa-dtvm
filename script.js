document.addEventListener('DOMContentLoaded', () => {

    // ── 0. Estado global ────────────────────────────────────────────
   let viewMode = 'Quinzena'; // 'quinzena' | 'geral'
    let quinzenaIdx   = 0;          // índice da quinzena selecionada na tabela

    
    const QUINZENA_DOS_CARDS = 0; // índice da quinzena que alimenta os flip cards (0 = 1ª Quinzena, 1 = 2ª Quinzena, etc)

    // ── 1. Combina dados de assessor (base) com dados de quinzena ───
    function mergeAssessor(dadoQuinzena) {
        const base = ASSESSORES.find(a => a.nome === dadoQuinzena.nome) || {};
        return { ...base, ...dadoQuinzena };
    }

    // ── 2. Calcula o acumulado geral (soma de todas as quinzenas) ───
    function calcularGeral() {
        const mapa = {};

        QUINZENAS.forEach(q => {
            q.data.forEach(d => {
                if (!mapa[d.nome]) {
                    mapa[d.nome] = {
                        nome:       d.nome,
                        captacaoV:  0,
                        receitaV:   0,
                        pontos:     0,
                        retencaoV:  0,
                        _retCount:  0,
                    };
                }
                mapa[d.nome].captacaoV += d.captacaoV || 0;
                mapa[d.nome].receitaV  += d.receitaV  || 0;
                mapa[d.nome].pontos    += d.pontos     || 0;
                mapa[d.nome].retencaoV += d.retencaoV  || 0;
                mapa[d.nome]._retCount += 1;
            });
        });

        // Formata valores acumulados
        return ASSESSORES.map(base => {
            const acc = mapa[base.nome] || { captacaoV: 0, receitaV: 0, pontos: 0, retencaoV: 0, _retCount: 0 };
            const retMedia = acc._retCount > 0 ? Math.round(acc.retencaoV / acc._retCount) : 0;

            let resultado = {
                ...base,
                retencaoV: retMedia,
                retencao:  retMedia + '%',
                captacaoV: acc.captacaoV,
                captacao:  formatarMoeda(acc.captacaoV),
                receitaV:  acc.receitaV,
                receita:   formatarMoeda(acc.receitaV),
                pontos:    acc.pontos,
            };

            // Aplica GERAL_OVERRIDE se existir para este assessor
            const override = GERAL_OVERRIDE[base.nome];
            if (override) {
                Object.assign(resultado, override);
                // Recalcula retencao texto se retencaoV foi sobrescrito sem retencao
                if (override.retencaoV !== undefined && override.retencao === undefined) {
                    resultado.retencao = override.retencaoV + '%';
                }
                // Recalcula captacao texto se captacaoV foi sobrescrito
                if (override.captacaoV !== undefined && override.captacao === undefined) {
                    resultado.captacao = formatarMoeda(override.captacaoV);
                }
                // Recalcula receita texto se receitaV foi sobrescrito
                if (override.receitaV !== undefined && override.receita === undefined) {
                    resultado.receita = formatarMoeda(override.receitaV);
                }
            }

            return resultado;
        });
    }

    function formatarMoeda(valor) {
        if (valor === 0) return 'R$ 0';
        return 'R$ ' + valor.toLocaleString('pt-BR');
    }

    // ── 3. Retorna o dataset ativo ──────────────────────────────────
    function getDadosAtivos() {
        if (viewMode === 'geral') {
            return calcularGeral();
        }
        const quinzena = QUINZENAS[quinzenaIdx];
        return quinzena.data.map(mergeAssessor);
    }

    // ── 4. Animação de contagem de números ──────────────────────────
    const scoreObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
            if (isNaN(target)) return;
            const duration  = 1200;
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


    // ── 5. Renderiza tabela ─────────────────────────────────────────
    function buildLeaderboard() {
        const tbody = document.getElementById('leaderboard-body');
        if (!tbody) return;

        const dados  = getDadosAtivos();
        const sorted = [...dados].sort((a, b) => b.pontos - a.pontos);

        const medalConfig = [
            { cls: 'gold',   label: 'Líder da rodada',  svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 15l3.09-1.96L12 9l-3.09 4.04L12 15z"/><path d="M8.5 17.5l-2-3 5.5-3.5 5.5 3.5-2 3H8.5z"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="1.5"/></svg>` },
            { cls: 'silver', label: 'Vice-líder',        svg: '' },
            { cls: 'bronze', label: 'Top 3',             svg: '' },
        ];

        tbody.innerHTML = sorted.map((a, i) => {
            const pos      = i + 1;
            const medal    = medalConfig[i];
            const isTop    = pos <= 3;
            const posCell  = isTop
                ? `<div class="medal ${medal.cls}">${medal.svg}<span>${pos}</span></div>`
                : `<span class="pos-num">${pos}</span>`;
            const subtitle = isTop ? `<span>${medal.label}</span>` : '';
            const rowClass = isTop ? `row-top top-${pos}` : 'row-normal';
            const fotoHtml = a.foto ? `<img src="${a.foto}" alt="${a.nome}">` : '';

            return `
            <tr class="${rowClass}" data-pos="${pos}">
                <td class="col-pos">${posCell}</td>
                <td class="col-name">
                    <div class="assessor-cell">
                        <div class="avatar" style="--av-color:${a.avColor}">
                            ${fotoHtml}
                        </div>
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
                <td><span class="currency">R$</span> ${a.captacao.replace('R$ ', '')}</td>
                <td><span class="currency">R$</span> ${a.receita.replace('R$ ', '')}</td>
                <td class="col-score"><span class="score-num">${a.pontos.toLocaleString('pt-BR')}</span></td>
            </tr>`;
        }).join('');

        document.querySelectorAll('#leaderboard-body .score-num').forEach(el => scoreObserver.observe(el));
    }

    // ── 6. Atualiza a barra de info do topo da tabela ───────────────
    function atualizarTopBar() {
        const roundNum   = document.querySelector('.round-num');
        const roundLabel = document.querySelector('.round-label');
        const liveBadge  = document.querySelector('.live-badge');

        if (viewMode === 'geral') {
            if (roundLabel) roundLabel.textContent = 'Acumulado';
            if (roundNum)   roundNum.textContent   = 'Classificação Geral';
            if (liveBadge) {
                liveBadge.style.color      = '#a78bfa';
                liveBadge.style.background = 'rgba(167,139,250,0.1)';
                liveBadge.style.border     = '1px solid rgba(167,139,250,0.25)';
                liveBadge.innerHTML        = `<span class="live-dot" style="background:#a78bfa"></span>Acumulado`;
            }

        } else {
            const quinzena = QUINZENAS[quinzenaIdx];
            if (roundLabel) roundLabel.textContent = 'Rodada atual';
            if (roundNum)   roundNum.textContent   = quinzena.label;
            
            if (liveBadge) {
                // Puxa o status lá do dados.js (se esquecer de colocar, usa 'Ao Vivo' por padrão)
                const statusTexto = quinzena.status || 'Ao Vivo';
                
                if (statusTexto.toLowerCase() === 'ao vivo') {
                    // Estilo Verde Piscante para AO VIVO
                    liveBadge.style.color      = '#4ade80';
                    liveBadge.style.background = 'rgba(74,222,128,0.1)';
                    liveBadge.style.border     = '1px solid rgba(74,222,128,0.25)';
                    liveBadge.innerHTML        = `<span class="live-dot" style="background:#4ade80;animation:blink 1.2s ease-in-out infinite"></span>${statusTexto}`;

                } else if (statusTexto.toLowerCase() === 'em breve') {
                    // Estilo Cinza sem piscar para ENCERRADA / EM BREVE
                    liveBadge.style.color      = '#94a3b8'; // Cinza
                    liveBadge.style.background = 'rgba(148, 163, 184, 0.1)';
                    liveBadge.style.border     = '1px solid rgba(148, 163, 184, 0.25)';
                    liveBadge.innerHTML        = `<span class="live-dot" style="background:#94a3b8"></span>${statusTexto}`;

                } else {
                     // Estilo Cinza sem piscar para ENCERRADA / EM BREVE
                    liveBadge.style.color      = '#f50606'; // Cinza
                    liveBadge.style.background = 'rgba(148, 163, 184, 0.1)';
                    liveBadge.style.border     = '1px solid rgba(148, 163, 184, 0.25)';
                    liveBadge.innerHTML        = `<span class="live-dot" style="background:#f50606"></span>${statusTexto}`;
                }
                
            }
        }
    }

    // ── 7. Constrói a barra de filtros ──────────────────────────────
    function buildFilterBar() {
        const wrapper = document.querySelector('.table-wrapper');
        if (!wrapper) return;

        // Remove barra existente para evitar duplicatas
        const existing = document.getElementById('filter-bar');
        if (existing) existing.remove();

        const bar = document.createElement('div');
        bar.id = 'filter-bar';
        bar.className = 'filter-bar';

        // Grupo de abas principais
        const tabs = document.createElement('div');
        tabs.className = 'filter-tabs';

        const tabQuinzena = document.createElement('button');
        tabQuinzena.className = 'filter-tab' + (viewMode === 'quinzena' ? ' active' : '');
        tabQuinzena.dataset.view = 'quinzena';
        tabQuinzena.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            Quinzena`;

        const tabGeral = document.createElement('button');
        tabGeral.className = 'filter-tab' + (viewMode === 'geral' ? ' active' : '');
        tabGeral.dataset.view = 'geral';
        tabGeral.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
            </svg>
            Geral`;

        tabs.appendChild(tabQuinzena);
        tabs.appendChild(tabGeral);
        bar.appendChild(tabs);

        // Seletor de quinzena (só visível na aba Quinzena)
        if (viewMode === 'quinzena' && QUINZENAS.length > 1) {
            const selectorWrap = document.createElement('div');
            selectorWrap.className = 'quinzena-selector';

            QUINZENAS.forEach((q, idx) => {
                const btn = document.createElement('button');
                btn.className = 'qz-btn' + (idx === quinzenaIdx ? ' active' : '');
                btn.textContent = q.label;
                btn.dataset.idx = idx;
                btn.addEventListener('click', () => {
                    quinzenaIdx = idx;
                    document.querySelectorAll('.qz-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    atualizarTopBar();
                    buildLeaderboard();
                });
                selectorWrap.appendChild(btn);
            });

            bar.appendChild(selectorWrap);
        }

        // Eventos das abas principais
        [tabQuinzena, tabGeral].forEach(tab => {
            tab.addEventListener('click', () => {
                viewMode = tab.dataset.view;
                buildFilterBar();   // reconstrói a barra (atualiza seletor)
                atualizarTopBar();
                buildLeaderboard();
            });
        });

        // Insere antes do table-top-bar
        const topBar = wrapper.querySelector('.table-top-bar');
        wrapper.insertBefore(bar, topBar);
    }


    // ── 8. Flip Cards ───────────────────────────────────────────────
    function buildCards() {
        const grid = document.querySelector('.cards-grid');
        if (!grid) return;

        // Puxa os dados especificamente da quinzena que você definiu lá em cima
        const quinzenaSelecionada = QUINZENAS[QUINZENA_DOS_CARDS];
        const dados = quinzenaSelecionada.data.map(mergeAssessor);

        // Ordena os assessores pelos pontos dessa quinzena
        const sorted = [...dados].sort((a, b) => b.pontos - a.pontos);

        grid.innerHTML = sorted.map((a, i) => {
            let badgeHtml = '';
            if (i === 0) badgeHtml = `<div class="flip-badge leader">Líder da Rodada</div>`;
            else if (i === 1) badgeHtml = `<div class="flip-badge silver">Vice-Líder</div>`;
            else if (i === 2) badgeHtml = `<div class="flip-badge bronze">Top 3</div>`;

            const fotoHtml = a.foto ? `<img src="${a.foto}" alt="${a.nome}">` : '';

            return `
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-front">
                        <div class="card-img-slot">${fotoHtml}</div>
                    </div>
                    <div class="flip-back">
                        <div class="flip-back-content">
                            <div class="flip-avatar" style="--av-color:${a.avColor}">
                                ${fotoHtml}
                            </div>
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

        // Recria os eventos de clique para virar o card no celular
        document.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('click', () => {
                if (window.matchMedia('(pointer: coarse)').matches)
                    card.classList.toggle('flipped');
            });
        });

        // Aplica a animação de contagem nos números
        document.querySelectorAll('.flip-back-content .score-num').forEach(el => scoreObserver.observe(el));
    }


    // ── 9. Efeitos Visuais (scroll, fade-in, partículas, menu) ──────

    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const el = document.querySelector('#inicio-logo');
            if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 94;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const el = document.querySelector('#final-logo');
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

    // ── Inicia ──────────────────────────────────────────────────────
    buildFilterBar();
    atualizarTopBar();
    buildLeaderboard();
    buildCards();
});
