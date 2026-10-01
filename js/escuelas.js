document.addEventListener('DOMContentLoaded', function() {
            const schoolsData = [
                { id: 1, name: 'ET 20 DE 20 Carolina Muzzilli', desc: 'Primer secundaria con orientación TICs, sumado a Multimedia.  En esta escuela, tu hijo va a aprender desde diseño gráfico (multimedia), hasta ideación de páginas web con HTML, CSS y Java (TICs).', tag: 'TICs', img: 'images/et20.png', comuna: 'Comuna 9', modalidad: 'Mañana' }
                
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

                if (state.radioFilter) {
                    const { name, value } = state.radioFilter;
                    if (name === 'comuna') {
                        filteredData = filteredData.filter(s => s.comuna === value);
                    } else if (name === 'especialidad') {
                        filteredData = filteredData.filter(s => s.tag === value);
                    } else if (name === 'modalidad') {
                        filteredData = filteredData.filter(s => s.modalidad === value);
                    } else if (name === 'interes') {
                        const interesMap = {
                            'Tecnología y Sistemas': ['TICs', 'Electrónica', 'Multimedia'],
                            'Salud y Bienestar': ['Salud'],
                            'Arte, Diseño y Comunicación': ['Diseño', 'Comunicación', 'Multimedia'],
                            'Negocios y Economía': ['Administración'],
                            'Ciencias Sociales y Humanidades': ['Comunicación', 'Administración'],
                            'Ciencias Naturales y Exactas': ['Química', 'Salud'],
                            'Deportes y Educación Física': ['Deportes'],
                            'Industria y Producción': ['Mecánica', 'Electrónica']
                        };
                        const tags = interesMap[value] || [];
                        filteredData = filteredData.filter(s => tags.includes(s.tag));
                    }
                }

                if (state.sidebarEspecialidades.length > 0) {
                    filteredData = filteredData.filter(s => state.sidebarEspecialidades.includes(s.tag));
                }
                if (state.sidebarModalidades.length > 0) {
                    filteredData = filteredData.filter(s => state.sidebarModalidades.includes(s.modalidad));
                }

                const limit = showAllSchools ? filteredData.length : 6;
                const schoolsToRender = filteredData.slice(0, limit);

                cardsGrid.innerHTML = schoolsToRender.map(school => `
                    <div class="card">
                        <img src="${school.img}" alt="${school.name}" class="card-img">
                        <div class="card-content">
                            <h5>${school.name}</h5>
                            <p>${school.desc}</p>
                            <span class="card-tag">${school.tag}</span>
                        </div>
                    </div>
                `).join('');

                if (schoolsToRender.length === 0) {
                    cardsGrid.innerHTML = `<p class="no-results">No se encontraron escuelas con los filtros seleccionados.</p>`;
                }

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

