document.addEventListener('DOMContentLoaded', function() {
            const schoolsData = [
    {
        id: 1,
        name: 'ET 1 Otto Krause',
        desc: 'Formación técnica en seis especialidades: Computación (programación, redes, hardware), Construcciones (diseño y cálculo de obras), Electrónica (circuitos y sistemas), Eléctrica (instalaciones y potencia), Mecánica (motores y mecanizado) y Química (laboratorio y procesos).',
        tags: ['Computación', 'Construcciones', 'Electrónica', 'Eléctrica', 'Mecánica', 'Química'],
        img: 'images/et1.png',
        comuna: 'Comuna 1',
        modalidad: 'Mañana y Tarde'
    },
    {
        id: 2,
        name: 'ET 20 Carolina Muzzilli',
        desc: 'Orientación en TICs (redes, programación, desarrollo web) y Producción Multimedial (diseño gráfico, video, animación, audio). Los estudiantes aprenden a crear contenido digital y a gestionar infraestructuras tecnológicas.',
        tags: ['TICs', 'Multimedia'],
        img: 'images/et20.png',
        comuna: 'Comuna 9',
        modalidad: 'Mañana y Tarde'
    },
    {
        id: 3,
        name: 'ET 12 Libertador Gral. José de San Martín',
        desc: 'Tres especialidades: Electricidad (instalaciones y distribución de energía), Electrónica (circuitos y comunicaciones) y Computación (programación, hardware y redes).',
        tags: ['Electricidad', 'Electrónica', 'Computación'],
        img: 'images/et12.png',
        comuna: 'Comuna 1',
        modalidad: 'Mañana y Tarde'
    },
    {
        id: 4,
        name: 'ET 19 Alejandro Volta',
        desc: 'Especialización en Electrónica con fuerte base en informática: circuitos, microcontroladores, sistemas digitales y reparación de equipos. Los egresados obtienen el título de Técnico en Electrónica.',
        tags: ['Electrónica'],
        img: 'images/et19.png',
        comuna: 'Comuna 1',
        modalidad: 'Mañana, Tarde y Noche'
    },
    {
        id: 5,
        name: 'ET 8 Paula Albarracín de Sarmiento',
        desc: 'Especialidad en Química: análisis de laboratorio, procesos químicos industriales, control de calidad y manejo de sustancias. La escuela también cuenta con un bachillerato orientado en Ciencias Sociales.',
        tags: ['Química'],
        img: 'images/et8.png',
        comuna: 'Comuna 9',
        modalidad: 'Mañana y Tarde'
    },
    {
        id: 6,
        name: 'ET 3 María Sánchez de Thompson',
        desc: 'Tres orientaciones: Computación (programación y redes), Geografía Matemática (análisis territorial y datos) y Óptica (salud visual, elaboración y adaptación de lentes).',
        tags: ['Computación', 'Geografía Matemática', 'Óptica'],
        img: 'images/et3.png',
        comuna: 'Comuna 14',
        modalidad: 'Mañana y Tarde'
    },
    {
        id: 7,
        name: 'ET 15 Maipú',
        desc: 'Diseño y Producción Gráfica (impresión, packaging, editorial) y Diseño y Comunicación Publicitaria (marketing, producción audiovisual, fotografía).',
        tags: ['Diseño Gráfico', 'Publicidad'],
        img: 'images/et15.png',
        comuna: 'Comuna 4',
        modalidad: 'Mañana y Tarde'
    },
    {
        id: 8,
        name: 'ET 23 Casal Calviño',
        desc: 'Formación en Mecánica: motores, sistemas de transmisión, mantenimiento industrial y electromovilidad. Los estudiantes participan en competencias de innovación y vehículos eléctricos.',
        tags: ['Mecánica'],
        img: 'images/et23.png',
        comuna: 'Comuna 9',
        modalidad: 'Mañana y Tarde'
    }
];

            const sidebarMap = {
                'tics': 'TICs', 'multimedia': 'Multimedia', 'electronica': 'Electrónica',
                'mecanica': 'Mecánica', 'salud': 'Salud', 'administracion': 'Administración',
                'quimica': 'Química', 'diseno': 'Diseño', 'comunicacion': 'Comunicación',
                'deportes': 'Deportes', 'mañana': 'Mañana', 'noche': 'Noche', 'entreturno': 'EntreTurno'
            };

            let state = {
                radioFilter: null,
                sidebarEspecialidades: [],
                sidebarModalidades: []
            };
            let showAllSchools = false;

            const filterButtons = document.querySelectorAll('.btn-filter, .btn-filter-main');
            const dropdownPanels = document.querySelectorAll('.dropdown-panel');
            const resultsSection = document.getElementById('resultsSection');
            const infoBoxTitle = document.getElementById('infoBoxTitle');
            const infoBoxText = document.getElementById('infoBoxText');
            const cardsGrid = document.getElementById('cardsGrid');
            const btnVerMas = document.getElementById('btnVerMas');
            
            const sidebar = document.getElementById('sidebar');
            const sidebarOverlay = document.getElementById('sidebarOverlay');
            const btnFiltrarTodo = document.getElementById('btnFiltrarTodo');
            const btnCloseSidebar = document.getElementById('btnCloseSidebar');
            const sidebarChecks = document.querySelectorAll('.sidebar-check');

            function openSidebar() {
                sidebar.classList.add('open');
                sidebarOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closeSidebar() {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            btnFiltrarTodo.addEventListener('click', openSidebar);
            btnCloseSidebar.addEventListener('click', closeSidebar);
            sidebarOverlay.addEventListener('click', closeSidebar);

            sidebarChecks.forEach(cb => {
                cb.addEventListener('change', function() {
                    const val = this.value;
                    const isEsp = ['tics', 'multimedia', 'electronica', 'mecanica', 'salud', 'administracion', 'quimica', 'diseno', 'comunicacion', 'deportes'].includes(val);
                    
                    if (isEsp) {
                        if (this.checked) state.sidebarEspecialidades.push(sidebarMap[val]);
                        else state.sidebarEspecialidades = state.sidebarEspecialidades.filter(v => v !== sidebarMap[val]);
                    } else {
                        if (this.checked) state.sidebarModalidades.push(sidebarMap[val]);
                        else state.sidebarModalidades = state.sidebarModalidades.filter(v => v !== sidebarMap[val]);
                    }
                    
                    showAllSchools = false;
                    renderSchools();
                });
            });

            filterButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const targetId = this.getAttribute('data-target');
                    const targetPanel = document.getElementById(targetId);

                    dropdownPanels.forEach(panel => {
                        if (panel !== targetPanel) panel.classList.remove('active');
                    });

                    filterButtons.forEach(b => b.classList.remove('active'));

                    if (targetPanel.classList.contains('active')) {
                        targetPanel.classList.remove('active');
                        this.classList.remove('active');
                    } else {
                        targetPanel.classList.add('active');
                        this.classList.add('active');
                    }
                });
            });

            const radioInputs = document.querySelectorAll('input[type="radio"]');

            radioInputs.forEach(radio => {
                radio.addEventListener('change', function() {
                    state.radioFilter = { name: this.name, value: this.value };
                    showAllSchools = false;

                    if (this.name === 'especialidad') {
                        infoBoxTitle.textContent = `¿Qué es ${this.value}?`;
                        const textos = {
                            'TICs': 'Tecnologías de la Información y la Comunicación. Aprenderás sobre redes, programación y sistemas digitales.',
                            'Multimedia': 'Diseño y producción de contenido digital, animación, video y audio para distintos medios.',
                            'Electrónica': 'Estudio de circuitos, sistemas embebidos y automatización de procesos electrónicos.',
                            'Mecánica': 'Diseño, fabricación y mantenimiento de sistemas mecánicos, motores y estructuras.',
                            'Salud': 'Formación orientada a la promoción de la salud, primeros auxilios y ciencias médicas básicas.',
                            'Administración': 'Gestión de organizaciones, recursos humanos, finanzas y estrategias comerciales.',
                            'Química': 'Estudio de la materia, sus propiedades y transformaciones, con fuerte base experimental.',
                            'Diseño': 'Comunicación visual, diseño gráfico, industrial y de interiores para resolver necesidades estéticas y funcionales.',
                            'Comunicación': 'Periodismo, locución, producción de medios y estrategias de comunicación social.',
                            'Deportes': 'Educación física, entrenamiento deportivo y promoción de hábitos saludables.'
                        };
                        infoBoxText.textContent = textos[this.value] || 'Descubre todo lo que esta especialidad tiene para ofrecerte.';
                    } else if (this.name === 'comuna') {
                        infoBoxTitle.textContent = `Escuelas en la ${this.value}`;
                        infoBoxText.textContent = `Explorá las instituciones educativas disponibles en la ${this.value} de la Ciudad de Buenos Aires.`;
                    } else if (this.name === 'modalidad') {
                        infoBoxTitle.textContent = `Modalidad ${this.value}`;
                        infoBoxText.textContent = `Este tipo de formación ofrece un enfoque específico para preparar a los estudiantes en su futuro académico y profesional.`;
                    } else if (this.name === 'interes') {
                        infoBoxTitle.textContent = `Interés en ${this.value}`;
                        infoBoxText.textContent = `Escuelas con orientaciones afines a tus intereses en ${this.value}.`;
                    }

                    renderSchools();
                    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });

            function renderSchools() {
                let filteredData = schoolsData;

                // 1. Filtro por radio (interés, comuna, especialidad, modalidad)
                if (state.radioFilter) {
                    const { name, value } = state.radioFilter;

                    if (name === 'comuna') {
                        filteredData = filteredData.filter(s => s.comuna === value);
                    } else if (name === 'especialidad') {
                        // Ahora la especialidad se compara contra el array de tags
                        filteredData = filteredData.filter(s => s.tags.includes(value));
                    } else if (name === 'modalidad') {
                        // La modalidad sigue siendo un string (ej. "Mañana y Tarde")
                        filteredData = filteredData.filter(s => s.modalidad.includes(value));
                    } else if (name === 'interes') {
                        const interesMap = {
                            'Tecnología y Sistemas': ['TICs', 'Electrónica', 'Multimedia', 'Computación'],
                            'Salud y Bienestar': ['Salud', 'Química', 'Óptica'],
                            'Arte, Diseño y Comunicación': ['Diseño Gráfico', 'Publicidad', 'Multimedia', 'Diseño'],
                            'Negocios y Economía': ['Administración'],
                            'Ciencias Sociales y Humanidades': ['Comunicación', 'Administración'],
                            'Ciencias Naturales y Exactas': ['Química', 'Salud', 'Geografía Matemática'],
                            'Deportes y Educación Física': ['Deportes'],
                            'Industria y Producción': ['Mecánica', 'Electrónica', 'Eléctrica', 'Construcciones']
                        };
                        const tagsInteres = interesMap[value] || [];
                        filteredData = filteredData.filter(s => s.tags.some(tag => tagsInteres.includes(tag)));
                    }
                }

                // 2. Filtros del sidebar (especialidades y modalidades)
                if (state.sidebarEspecialidades.length > 0) {
                    filteredData = filteredData.filter(s =>
                        s.tags.some(tag => state.sidebarEspecialidades.includes(tag))
                    );
                }
                if (state.sidebarModalidades.length > 0) {
                    filteredData = filteredData.filter(s =>
                        state.sidebarModalidades.some(mod => s.modalidad.includes(mod))
                    );
                }

                // 3. Límite de tarjetas
                const limit = showAllSchools ? filteredData.length : 6;
                const schoolsToRender = filteredData.slice(0, limit);

                // 4. Renderizado de tarjetas (mostrando todos los tags)
                cardsGrid.innerHTML = schoolsToRender.map(school => `
                    <div class="card">
                        <img src="${school.img}" alt="${school.name}" class="card-img">
                        <div class="card-content">
                            <h5>${school.name}</h5>
                            <p>${school.desc}</p>
                            <div class="card-tags">
                                ${school.tags.map(tag => `<span class="card-tag">${tag}</span>`).join(' ')}
                            </div>
                        </div>
                    </div>
                `).join('');

                if (schoolsToRender.length === 0) {
                    cardsGrid.innerHTML = `<p class="no-results">No se encontraron escuelas con los filtros seleccionados.</p>`;
                }

                // 5. Botón "Ver más"
                if (filteredData.length > 6) {
                    btnVerMas.style.display = 'inline-flex';
                    btnVerMas.innerHTML = showAllSchools ? 'Ver menos <i class="fas fa-arrow-up"></i>' : 'Ver más escuelas <i class="fas fa-arrow-down"></i>';
                } else {
                    btnVerMas.style.display = 'none';
                }

                resultsSection.classList.add('visible');
            }

            btnVerMas.addEventListener('click', function() {
                showAllSchools = !showAllSchools;
                renderSchools();
            });

            renderSchools();
        });

