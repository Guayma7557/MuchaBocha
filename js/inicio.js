(function () {
        'use strict';

        /* =====================================================================
           1. DATOS
           ===================================================================== */
        const especialidades = [
            { nombre: 'Informática',                desc: 'Desarrollo de software, bases de datos y sistemas.',                  size: 360 },
            { nombre: 'TICs',                       desc: 'Redes, telecomunicaciones y seguridad digital.',                      size: 340 },
            { nombre: 'Industria de los alimentos', desc: 'Producción, control de calidad y alimentos funcionales.',             size: 380 },
            { nombre: 'Robótica',                   desc: 'Diseño, programación y control de robots autónomos.',                 size: 350 },
            { nombre: 'Energías renovables',        desc: 'Energía solar, eólica y sustentabilidad.',                            size: 370 },
            { nombre: 'Diseño digital',             desc: 'Diseño gráfico, UX/UI y animación digital.',                          size: 340 },
            { nombre: 'Marketing',                  desc: 'Estrategias de marca, redes y publicidad.',                           size: 330 },
            { nombre: 'Idiomas',                    desc: 'Inglés, portugués y lenguas extranjeras.',                            size: 350 },
            { nombre: 'Ciencias ambientales',       desc: 'Ecología, gestión de recursos y conservación.',                       size: 380 },
            { nombre: 'Ciencias naturales',         desc: 'Biología, química y laboratorio.',                                    size: 350 },
            { nombre: 'Artes plásticas',            desc: 'Arte, pintura y expresión visual.',                                   size: 340 },
            { nombre: 'Deportes',                   desc: 'Actividad física, entrenamiento y salud.',                            size: 350 },
            { nombre: 'Negocios',                   desc: 'Administración, finanzas y economía.',                                size: 370 },
            { nombre: 'Electrónica',                desc: 'Electrónica, circuitos y microcontroladores.',                        size: 350 },
            { nombre: 'Mecánica',                   desc: 'Mecánica, motores y fabricación.',                                    size: 340 },
            { nombre: 'Derecho',                    desc: 'Derecho, legislación y justicia.',                                    size: 360 },
            { nombre: 'Psicología',                 desc: 'Psicología, terapia y bienestar.',                                    size: 340 },
            { nombre: 'Comunicación',               desc: 'Periodismo, redacción y medios.',                                     size: 350 },
            { nombre: 'Emprendedurismo',            desc: 'Innovación, emprendimiento y startups.',                              size: 380 }
        ];

        const CANVAS_W = 3100;
        const CANVAS_H = 2400;
        const MARGIN   = 200;
        const MIN_DIST = 430;
        const MAX_ATTEMPTS = 400;

        function generarPosicionesAleatorias(cantidad) {
            const posiciones = [];
            let minDistActual = MIN_DIST;

            for (let i = 0; i < cantidad; i++) {
                let intentos = 0;
                let colocada = false;

                while (!colocada && intentos < MAX_ATTEMPTS) {
                    const x = MARGIN + Math.random() * (CANVAS_W - 2 * MARGIN);
                    const y = MARGIN + Math.random() * (CANVAS_H - 2 * MARGIN);

                    let valida = true;
                    for (let j = 0; j < posiciones.length; j++) {
                        const dx = x - posiciones[j].x;
                        const dy = y - posiciones[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < minDistActual) { valida = false; break; }
                    }

                    if (valida) {
                        posiciones.push({ x: x, y: y });
                        colocada = true;
                    }
                    intentos++;
                }

                if (!colocada) {
                    minDistActual *= 0.95;
                    i--;
                }
            }

            return posiciones;
        }

        const posiciones = generarPosicionesAleatorias(especialidades.length);

        const paletaClases = [
            'paleta-1', 'paleta-2', 'paleta-3', 'paleta-4',
            'paleta-5', 'paleta-6', 'paleta-7', 'paleta-8'
        ];

        /* =====================================================================
           2. GENERACIÓN DINÁMICA DE ESFERAS
           ===================================================================== */
        const canvas   = document.getElementById('constelacionCanvas');
        const viewport = document.getElementById('constelacionViewport');
        const dragHint = document.getElementById('dragHint');

        especialidades.forEach(function (esp, i) {
            const esfera = document.createElement('div');
            esfera.className = 'esfera ' + paletaClases[i % paletaClases.length];
            esfera.textContent = esp.nombre;
            esfera.dataset.desc = esp.desc;
            esfera.dataset.index = i;

            const size = esp.size;
            esfera.style.width  = size + 'px';
            esfera.style.height = size + 'px';
            esfera.style.fontSize = Math.max(1.0, size / 175) + 'rem';
            esfera.style.padding  = (size * 0.10) + 'px';

            esfera.style.left = posiciones[i].x + 'px';
            esfera.style.top  = posiciones[i].y + 'px';

            esfera.style.animation =
                'floaty ' + (3 + (i % 4) * 0.6) + 's ease-in-out ' + (i * 0.15) + 's infinite';

            canvas.appendChild(esfera);
        });

        /* =====================================================================
           3. DRAG TO PAN
           ===================================================================== */
        let isDragging = false;
        let moved      = false;
        let wasDragged = false;
        let startX = 0, startY = 0;
        let panX   = 0, panY   = 0;
        let vw = 0, vh = 0;

        function updateViewportSize() {
            vw = viewport.clientWidth;
            vh = viewport.clientHeight;
        }
        updateViewportSize();

        function applyPan() {
            const minX = Math.min(0, vw - CANVAS_W);
            const maxX = 0;
            const minY = Math.min(0, vh - CANVAS_H);
            const maxY = 0;

            if (panX < minX) panX = minX;
            if (panX > maxX) panX = maxX;
            if (panY < minY) panY = minY;
            if (panY > maxY) panY = maxY;

            canvas.style.transform =
                'translate3d(' + panX + 'px, ' + panY + 'px, 0)';
        }

        function centerMap() {
            updateViewportSize();
            panX = (vw - CANVAS_W) / 2;
            panY = (vh - CANVAS_H) / 2;
            applyPan();
        }

        function onPointerDown(e) {
            if (e.button !== undefined && e.button !== 0) return;
            if (e.target.closest && e.target.closest('.btn-ver-mas')) return;

            isDragging = true;
            moved      = false;
            startX = e.clientX - panX;
            startY = e.clientY - panY;
            viewport.classList.add('dragging');
            if (dragHint) dragHint.classList.add('hidden');
        }

        function onPointerMove(e) {
            if (!isDragging) return;
            const newPanX = e.clientX - startX;
            const newPanY = e.clientY - startY;

            if (!moved) {
                const dx = Math.abs(newPanX - panX);
                const dy = Math.abs(newPanY - panY);
                if (dx > 4 || dy > 4) moved = true;
            }
            panX = newPanX;
            panY = newPanY;
            applyPan();
        }

        function onPointerUp() {
            if (!isDragging) return;
            if (moved) {
                wasDragged = true;
                setTimeout(function () { wasDragged = false; }, 0);
            }
            isDragging = false;
            viewport.classList.remove('dragging');
        }

        viewport.addEventListener('pointerdown', onPointerDown, { passive: true });
        window.addEventListener('pointermove',   onPointerMove,  { passive: true });
        window.addEventListener('pointerup',     onPointerUp,    { passive: true });
        window.addEventListener('pointercancel', onPointerUp,    { passive: true });

        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                updateViewportSize();
                applyPan();
            }, 100);
        });

        requestAnimationFrame(function () {
            requestAnimationFrame(centerMap);
        });

        /* =====================================================================
           4. INTERACCIÓN DE ESFERAS + DESELECCIÓN POR CLICK FUERA
           ===================================================================== */
        const esferas = document.querySelectorAll('.esfera');
        const descBox = document.getElementById('descripcionEspecialidad');

        function deselectAll() {
            esferas.forEach(function (c) {
                c.classList.remove('active', 'dimmed');
            });
            descBox.innerHTML =
                '<span class="placeholder">Hacé clic en una especialidad para conocer más</span>';
        }

        function hasActive() {
            for (let i = 0; i < esferas.length; i++) {
                if (esferas[i].classList.contains('active')) return true;
            }
            return false;
        }

        esferas.forEach(function (esfera) {
            esfera.addEventListener('click', function (e) {
                if (wasDragged) { e.stopPropagation(); return; }
                e.stopPropagation();

                const isActive = this.classList.contains('active');

                if (isActive) {
                    deselectAll();
                    return;
                }

                esferas.forEach(function (c) {
                    c.classList.remove('active', 'dimmed');
                });
                this.classList.add('active');
                esferas.forEach(function (c) {
                    if (c !== esfera) c.classList.add('dimmed');
                });

                const nombre = this.textContent.trim();
                const desc   = this.dataset.desc || 'Especialidad en auge.';
                descBox.innerHTML = '<strong>' + nombre + ':</strong> ' + desc;
            });
        });

        viewport.addEventListener('click', function (e) {
            if (wasDragged) return;
            if (e.target.closest && e.target.closest('.esfera')) return;
            if (!hasActive()) return;
            deselectAll();
        });

        document.addEventListener('click', function (e) {
            if (!hasActive()) return;
            if (e.target.closest && e.target.closest('.esfera')) return;
            if (e.target.closest && e.target.closest('.btn-ver-mas')) return;
            if (e.target.closest && e.target.closest('.quick-nav')) return;
            if (e.target.closest && e.target.closest('.descripcion-especialidad')) return;
            deselectAll();
        });

        /* =====================================================================
           5. DESCRIPCIÓN FLOTANTE — control por scroll
           - Aparece antes de llegar a la sección (200px antes).
           - Se oculta ANTES al scrollear dentro de la sección (a los ~55% de vh).
           ===================================================================== */
        const seccionEspecialidades = document.getElementById('especialidades');

        function updateDescVisibility() {
            if (!seccionEspecialidades) return;
            const rect = seccionEspecialidades.getBoundingClientRect();
            const vhNow = window.innerHeight;

            /* Mostrar cuando la sección asoma (con margen inferior de 200px) */
            const entering = rect.top < vhNow + 200;

            /* Ocultar cuando ya scrolleamos bastante dentro de la sección */
            const deepInside = rect.top < -vhNow * 0.55;

            /* Ocultar también si la sección ya salió por completo */
            const fullyOut = rect.bottom < 0;

            if (entering && !deepInside && !fullyOut) {
                descBox.classList.add('visible');
            } else {
                descBox.classList.remove('visible');
            }
        }

        let ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    updateDescVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        window.addEventListener('resize', updateDescVisibility);
        /* Comprobar al inicio también */
        updateDescVisibility();

        /* =====================================================================
           6. QUICK NAV — visible SOLO cuando el hero está a la vista
           ===================================================================== */
        const quickNav = document.getElementById('quickNav');
        const heroSection = document.getElementById('hero');

        if ('IntersectionObserver' in window && heroSection && quickNav) {
            const heroObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        quickNav.classList.add('visible');
                    } else {
                        quickNav.classList.remove('visible');
                    }
                });
            }, {
                threshold: 0.3
            });
            heroObserver.observe(heroSection);
        } else if (quickNav) {
            quickNav.classList.add('visible');
        }

        /* =====================================================================
           7. BOTÓN "Y MUCHO MÁS"
           ===================================================================== */
        const btnVerMas = document.getElementById('btnVerMas');
        if (btnVerMas) {
            btnVerMas.addEventListener('click', function (e) {
                e.stopPropagation();
                document.getElementById('testimonios')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        /* =====================================================================
           8. QUICK NAV — scroll suave a secciones
           ===================================================================== */
        document.querySelectorAll('.quick-nav-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const targetSelector = this.dataset.target;
                const target = document.querySelector(targetSelector);
                if (!target) return;

                const headerEl = document.querySelector('header');
                const headerH  = headerEl ? headerEl.offsetHeight : 0;
                const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;

                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });

        /* =====================================================================
           9. TESTIMONIOS
           ===================================================================== */
        const testimoniosData = [
            {
                texto: 'Sumar nuestra escuela a MuchaBocha nos permitió llegar a familias que buscaban exactamente nuestro perfil técnico. La visibilidad fue inmediata.',
                autor: 'Escuela Técnica N° 12',
                tipo: 'D.E. N° 6 · Villa Lugano',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ET12&backgroundColor=f2a65a&textColor=2b2438'
            },
            {
                texto: 'La plataforma nos ayudó a mostrar nuestras orientaciones en Industria de los Alimentos a un público que no nos conocía. Hoy tenemos lista de espera.',
                autor: 'E.E.S.T. N° 8 Paula Albarracín',
                tipo: 'D.E. N° 17 · Villa Devoto',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EE8&backgroundColor=686698&textColor=ffffff'
            },
            {
                texto: 'Recibimos consultas de chicos que ya sabían qué especialidad querían seguir. Eso nos ahorra muchísimo trabajo de orientación previa.',
                autor: 'Colegio San Martín',
                tipo: 'Privado · Belgrano',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CSM&backgroundColor=9b99cb&textColor=ffffff'
            },
            {
                texto: 'La ficha de nuestra escuela quedó clarísima: especialidades, modalidad, ubicación. Las familias llegan a las jornadas ya informadas.',
                autor: 'Escuela Normal Superior N° 4',
                tipo: 'D.E. N° 2 · Recoleta',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ENS4&backgroundColor=2b2438&textColor=f2a65a'
            },
            {
                texto: 'Como escuela con orientación en TICs, necesitábamos mostrar lo que hacemos. MuchaBocha nos dio ese espacio con un diseño moderno y claro.',
                autor: 'E.E.S.T. N° 3 María Sánchez de Thompson',
                tipo: 'D.E. N° 4 · Barracas',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EE3&backgroundColor=4a3f5c&textColor=ffffff'
            },
            {
                texto: 'El comparador de especialidades nos posicionó muy bien frente a otras escuelas de la zona. Los chicos llegan sabiendo qué esperar.',
                autor: 'Instituto Nuestra Señora del Pilar',
                tipo: 'Privado · Núñez',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=INSP&backgroundColor=c9a05a&textColor=2b2438'
            },
            {
                texto: 'Trabajar con MuchaBocha fue simple y rápido. En pocos días teníamos nuestra ficha publicada y empezamos a recibir consultas.',
                autor: 'Escuela de Comercio N° 6',
                tipo: 'D.E. N° 10 · Flores',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EC6&backgroundColor=8a7ab3&textColor=ffffff'
            },
            {
                texto: 'Nuestra orientación en Energías Renovables generó mucho interés a través de la plataforma. Es una vidriera excelente para proyectos innovadores.',
                autor: 'E.E.S.T. N° 15 Maipú',
                tipo: 'D.E. N° 18 · Palermo',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EE15&backgroundColor=5a7a9a&textColor=ffffff'
            },
            {
                texto: 'MuchaBocha entiende lo que las familias necesitan: información clara, comparación honesta y acceso directo a cada institución.',
                autor: 'Colegio La Salle',
                tipo: 'Privado · Colegiales',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CLS&backgroundColor=f2a65a&textColor=2b2438'
            }
        ];

        const track = document.getElementById('testimoniosTrack');

        function renderEstrellas(calificacion) {
            let html = '<div class="testimonio-estrellas" aria-label="' + calificacion + ' de 5 estrellas">';
            for (let s = 1; s <= 5; s++) {
                if (s <= calificacion) {
                    html += '<i class="fas fa-star"></i>';
                } else {
                    html += '<i class="fas fa-star empty"></i>';
                }
            }
            html += '</div>';
            return html;
        }

        testimoniosData.forEach(function (t) {
            const calificacion = Math.random() < 0.6 ? 5 : 4;

            const item = document.createElement('div');
            item.className = 'testimonio-item';
            item.innerHTML =
                renderEstrellas(calificacion) +
                '<div class="testimonio-avatar"><img src="' + t.avatar + '" alt="Logo de ' + t.autor + '" /></div>' +
                '<p class="testimonio-texto">“' + t.texto + '”</p>' +
                '<span class="testimonio-autor">' + t.autor +
                    '<span class="escuela-tipo">' + t.tipo + '</span>' +
                '</span>';

            track.appendChild(item);
        });

        /* =====================================================================
           10. CARRUSEL DE TESTIMONIOS
           ===================================================================== */
        (function () {
            const leftBtn  = document.getElementById('testimoniosLeft');
            const rightBtn = document.getElementById('testimoniosRight');
            let idx = 0;

            function visibleCount() {
                const w = window.innerWidth;
                if (w < 600) return 1;
                if (w < 1000) return 2;
                if (w < 1400) return 3;
                return 4;
            }
            function itemWidth() {
                const first = track.querySelector('.testimonio-item');
                if (!first) return 380;
                const style = window.getComputedStyle(first);
                const gap = parseFloat(getComputedStyle(track).gap) || 32;
                const basis = parseFloat(style.flexBasis) || 380;
                return basis + gap;
            }
            function maxIndex() {
                return Math.max(0, track.children.length - visibleCount());
            }
            function update() {
                const max = maxIndex();
                if (idx > max) idx = max;
                if (idx < 0)    idx = 0;
                track.style.transform = 'translateX(-' + (idx * itemWidth()) + 'px)';
                leftBtn.style.opacity  = idx <= 0    ? '0.4' : '1';
                rightBtn.style.opacity = idx >= max  ? '0.4' : '1';
                leftBtn.style.pointerEvents  = idx <= 0   ? 'none' : 'auto';
                rightBtn.style.pointerEvents = idx >= max ? 'none' : 'auto';
            }

            leftBtn.addEventListener('click', function () {
                if (idx > 0) { idx--; update(); }
            });
            rightBtn.addEventListener('click', function () {
                if (idx < maxIndex()) { idx++; update(); }
            });

            let rt;
            window.addEventListener('resize', function () {
                clearTimeout(rt);
                rt = setTimeout(function () {
                    if (idx > maxIndex()) idx = maxIndex();
                    update();
                }, 120);
            });

            setTimeout(update, 60);
        })();

    })();

