/**
 * Korea Wedding & Family Trip 2026 - Main Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    initTabs();
    initItineraryAccordion();
    initCountdown();
    initVehicleAllocator();
    initPhrases();
    initChecklist();
    initDayNotes();
    initPrint();
});

/* ==========================================================================
   Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

/* ==========================================================================
   Language Switcher (English / Spanish)
   ========================================================================== */
function initLanguage() {
    const langToggleBtn = document.getElementById('langToggleBtn');
    
    // Check saved language
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'es') {
        document.body.classList.add('lang-es');
        updateLangButtonText('es');
    } else {
        document.body.classList.remove('lang-es');
        updateLangButtonText('en');
    }
    
    langToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('lang-es');
        const isEs = document.body.classList.contains('lang-es');
        localStorage.setItem('lang', isEs ? 'es' : 'en');
        updateLangButtonText(isEs ? 'es' : 'en');
    });
}

function updateLangButtonText(lang) {
    const langToggleBtn = document.getElementById('langToggleBtn');
    if (lang === 'es') {
        langToggleBtn.innerHTML = '🇪🇸 ES / EN';
    } else {
        langToggleBtn.innerHTML = '🇬🇧 EN / ES';
    }
}

/* ==========================================================================
   Tab Navigation (Main Tabs & Destination Tabs)
   ========================================================================== */
function initTabs() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSectionId = tab.getAttribute('data-tab');
            
            navTabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            tab.classList.add('active');
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            const navPos = document.querySelector('.sticky-nav').offsetTop;
            if (window.scrollY > navPos) {
                window.scrollTo({ top: navPos, behavior: 'smooth' });
            }
        });
    });

    const destTabs = document.querySelectorAll('.dest-tab');
    const destContents = document.querySelectorAll('.dest-content');

    destTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const destId = tab.getAttribute('data-dest');
            
            destTabs.forEach(t => t.classList.remove('active'));
            destContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetContent = document.getElementById(`dest-${destId}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   Itinerary Accordion Expander
   ========================================================================== */
function initItineraryAccordion() {
    const dayCards = document.querySelectorAll('.timeline-day-card');
    const preExpandedDays = ['1', '2', '3', '4', '8']; // Expand key edited days and wedding

    dayCards.forEach(card => {
        const dayId = card.getAttribute('data-day');
        const header = card.querySelector('.day-header');
        
        if (preExpandedDays.includes(dayId)) {
            card.classList.add('expanded');
        }

        header.addEventListener('click', (e) => {
            // Avoid toggling when clicking notes buttons
            if (e.target.closest('.day-notes-section') || e.target.closest('.btn-notes-action')) {
                return;
            }
            card.classList.toggle('expanded');
        });
    });
}

/* ==========================================================================
   Countdown Timer (Targets Arrival: Sep 26, 2026 17:00 KST)
   ========================================================================== */
function initCountdown() {
    const targetDate = new Date(Date.UTC(2026, 8, 26, 8, 0, 0)).getTime(); // Sep 26 at 17:00 KST is 08:00 UTC

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');

    function updateTimer() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minsEl) minsEl.innerText = "00";
            if (secsEl) secsEl.innerText = "00";
            clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
        if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
        if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}

/* ==========================================================================
   Vehicle Allocator (Drag & Drop + Mobile Click Support)
   ========================================================================== */
const defaultRoster = [
    { id: 'ruben', name: 'Ruben', role: 'Groom', tag: 'Groom' },
    { id: 'leta', name: 'Leta', role: 'Bride', tag: 'Bride' },
    { id: 'dad', name: 'Ruben\'s Dad', role: 'Senior', tag: 'Parent' },
    { id: 'mom', name: 'Ruben\'s Mom', role: 'Senior', tag: 'Parent' },
    { id: 'sister1', name: 'Sister 1', role: 'Younger', tag: 'Sister' },
    { id: 'sister2', name: 'Sister 2', role: 'Younger', tag: 'Sister' },
    { id: 'boyfriend', name: 'Sister\'s BF', role: 'Younger', tag: 'Guest' },
    { id: 'wdad', name: 'Leta\'s Dad', role: 'Senior', tag: 'W-Parent' },
    { id: 'wmom', name: 'Leta\'s Mom', role: 'Senior', tag: 'W-Parent' },
    { id: 'wbrother', name: 'Leta\'s Brother', role: 'Younger', tag: 'W-Brother' }
];

const defaultAssignments = {
    car1: ['ruben', 'leta', 'sister1', 'sister2', 'boyfriend'],
    car2: ['dad', 'mom', 'wdad', 'wmom', 'wbrother'],
    roster: []
};

let currentAssignments = JSON.parse(JSON.stringify(defaultAssignments));

function initVehicleAllocator() {
    const rosterContainer = document.getElementById('roster');
    const car1Seats = document.getElementById('car1-seats');
    const car2Seats = document.getElementById('car2-seats');
    const resetBtn = document.getElementById('resetCarsBtn');

    const saved = localStorage.getItem('carAssignments');
    if (saved) {
        try {
            currentAssignments = JSON.parse(saved);
        } catch(e) {
            currentAssignments = JSON.parse(JSON.stringify(defaultAssignments));
        }
    }

    function renderAllocator() {
        rosterContainer.innerHTML = '';
        car1Seats.innerHTML = '';
        car2Seats.innerHTML = '';

        defaultRoster.forEach(person => {
            if (!currentAssignments.car1.includes(person.id) && !currentAssignments.car2.includes(person.id)) {
                rosterContainer.appendChild(createPersonNode(person, 'roster'));
            }
        });

        currentAssignments.car1.forEach(personId => {
            const person = defaultRoster.find(p => p.id === personId);
            if (person) {
                car1Seats.appendChild(createPersonNode(person, 'car1'));
            }
        });

        currentAssignments.car2.forEach(personId => {
            const person = defaultRoster.find(p => p.id === personId);
            if (person) {
                car2Seats.appendChild(createPersonNode(person, 'car2'));
            }
        });

        document.getElementById('car1-capacity').innerText = `${currentAssignments.car1.length} / 5 Seats`;
        document.getElementById('car2-capacity').innerText = `${currentAssignments.car2.length} / 5 Seats`;

        if (currentAssignments.car1.length > 5) {
            document.getElementById('car-1').style.borderColor = 'var(--primary-red)';
        } else {
            document.getElementById('car-1').style.borderColor = 'var(--border-color)';
        }

        if (currentAssignments.car2.length > 5) {
            document.getElementById('car-2').style.borderColor = 'var(--primary-red)';
        } else {
            document.getElementById('car-2').style.borderColor = 'var(--border-color)';
        }

        localStorage.setItem('carAssignments', JSON.stringify(currentAssignments));
    }

    function createPersonNode(person, currentContainer) {
        const node = document.createElement('div');
        node.className = 'person-card';
        node.id = `person-${person.id}`;
        node.draggable = true;
        node.innerHTML = `
            <span>${person.name}</span>
            <span class="person-tag">${person.tag}</span>
        `;

        node.addEventListener('dragstart', (e) => {
            node.classList.add('dragging');
            e.dataTransfer.setData('text/plain', person.id);
            e.dataTransfer.setData('source-container', currentContainer);
        });

        node.addEventListener('dragend', () => {
            node.classList.remove('dragging');
        });

        node.addEventListener('click', () => {
            movePersonNext(person.id, currentContainer);
        });

        return node;
    }

    function movePersonNext(personId, fromContainer) {
        if (fromContainer === 'roster') {
            currentAssignments.car1.push(personId);
        } else if (fromContainer === 'car1') {
            currentAssignments.car1 = currentAssignments.car1.filter(id => id !== personId);
            currentAssignments.car2.push(personId);
        } else if (fromContainer === 'car2') {
            currentAssignments.car2 = currentAssignments.car2.filter(id => id !== personId);
        }
        renderAllocator();
    }

    function movePersonTo(personId, toContainer) {
        currentAssignments.car1 = currentAssignments.car1.filter(id => id !== personId);
        currentAssignments.car2 = currentAssignments.car2.filter(id => id !== personId);

        if (toContainer === 'car1') {
            currentAssignments.car1.push(personId);
        } else if (toContainer === 'car2') {
            currentAssignments.car2.push(personId);
        }
        renderAllocator();
    }

    const dropZones = [
        { el: car1Seats, containerName: 'car1', parentCard: document.getElementById('car-1') },
        { el: car2Seats, containerName: 'car2', parentCard: document.getElementById('car-2') },
        { el: rosterContainer, containerName: 'roster', parentCard: rosterContainer.parentElement }
    ];

    dropZones.forEach(zone => {
        zone.parentCard.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.parentCard.classList.add('drag-over');
        });

        zone.parentCard.addEventListener('dragleave', () => {
            zone.parentCard.classList.remove('drag-over');
        });

        zone.parentCard.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.parentCard.classList.remove('drag-over');
            const personId = e.dataTransfer.getData('text/plain');
            if (personId) {
                movePersonTo(personId, zone.containerName);
            }
        });
    });

    resetBtn.addEventListener('click', () => {
        currentAssignments = JSON.parse(JSON.stringify(defaultAssignments));
        renderAllocator();
    });

    renderAllocator();
}

/* ==========================================================================
   Survival Korean Phrases
   ========================================================================== */
const survivalPhrases = [
    { kor: '안녕하세요', phonetic: 'Annyeong-haseyo', eng: 'Hello / Good afternoon', esp: 'Hola / Buenas tardes' },
    { kor: '감사합니다', phonetic: 'Kam-sa-ham-ni-da', eng: 'Thank you', esp: 'Gracias' },
    { kor: '네', phonetic: 'Ne', eng: 'Yes / Agree', esp: 'Sí / De acuerdo' },
    { kor: '아니요', phonetic: 'An-i-yo', eng: 'No', esp: 'No' },
    { kor: '저기요', phonetic: 'Jeo-gi-yo', eng: 'Excuse me! (To call a server)', esp: '¡Disculpe! (Para llamar a camareros)' },
    { kor: '화장실 어디예요?', phonetic: 'Hwa-jang-sil eo-di-ye-yo?', eng: 'Where is the restroom?', esp: '¿Dónde está el baño?' },
    { kor: '물 주세요', phonetic: 'Mul ju-se-yo', eng: 'Water, please', esp: 'Agua, por favor' },
    { kor: '계산서 주세요', phonetic: 'Kye-san-seo ju-se-yo', eng: 'The bill/check, please', esp: 'La cuenta, por favor' },
    { kor: '이거 얼마예요?', phonetic: 'I-geo eol-ma-ye-yo?', eng: 'How much is this?', esp: '¿Cuánto cuesta esto?' },
    { kor: '차 두 대예요', phonetic: 'Cha du dae-ye-yo', eng: 'We have two cars (tolls/parking)', esp: 'Son dos coches (peajes/parking)' },
    { kor: '저희 열 명이에요', phonetic: 'Jeo-hui yeol myeong-i-e-yo', eng: 'We are 10 people', esp: 'Somos 10 personas' },
    { kor: '도와주세요', phonetic: 'Do-wa-ju-se-yo', eng: 'Help, please', esp: 'Ayuda, por favor' },
    { kor: '영어 할 수 있으세요?', phonetic: 'Yeong-eo hal su is-seu-se-yo?', eng: 'Do you speak English?', esp: '¿Habla inglés?' },
    { kor: '맛있어요', phonetic: 'Ma-si-sseo-yo', eng: 'It is delicious!', esp: '¡Está delicioso!' },
    { kor: '맵지 않게 해주세요', phonetic: 'Maep-ji an-ge hae-ju-se-yo', eng: 'Please make it not spicy', esp: 'Por favor, no picante' },
    { kor: '저는 채식주의자예요', phonetic: 'Jeo-neun chae-sik-ju-ui-ja-ye-yo', eng: 'I am vegetarian', esp: 'Soy vegetariano/a' },
    { kor: '고기는 빼주세요', phonetic: 'Go-gi-neun pae ju-se-yo', eng: 'Please remove the meat', esp: 'Sin carne, por favor' }
];

function initPhrases() {
    const listContainer = document.getElementById('phrasesList');
    const searchInput = document.getElementById('phraseSearch');

    function renderPhrases(filterText = '') {
        listContainer.innerHTML = '';
        
        const filtered = survivalPhrases.filter(p => {
            const query = filterText.toLowerCase();
            return p.eng.toLowerCase().includes(query) || 
                   p.esp.toLowerCase().includes(query) ||
                   p.phonetic.toLowerCase().includes(query) ||
                   p.kor.includes(query);
        });

        if (filtered.length === 0) {
            listContainer.innerHTML = '<p style="padding: 1rem; color: var(--text-muted); font-size: 0.9rem;">No phrases match your search.</p>';
            return;
        }

        filtered.forEach(p => {
            const row = document.createElement('div');
            row.className = 'phrase-row';
            row.innerHTML = `
                <div class="phrase-row-top">
                    <span class="phrase-kor">${p.kor}</span>
                    <span class="phrase-phonetic">${p.phonetic}</span>
                </div>
                <div class="phrase-eng lang-en">${p.eng}</div>
                <div class="phrase-eng lang-es">${p.esp}</div>
            `;

            row.addEventListener('click', () => {
                navigator.clipboard.writeText(p.kor).then(() => {
                    row.classList.add('copied');
                    setTimeout(() => {
                        row.classList.remove('copied');
                    }, 2000);
                });
            });

            listContainer.appendChild(row);
        });
    }

    searchInput.addEventListener('input', (e) => {
        renderPhrases(e.target.value);
    });

    renderPhrases();
}

/* ==========================================================================
   Family Packing Checklist
   ========================================================================== */
const defaultChecklist = {
    essentials: [
        { en: 'Passports (check expiration dates!)', es: 'Pasaportes (¡comprobar fechas de caducidad!)', checked: false },
        { en: 'K-ETA or approved Visa printout', es: 'K-ETA o visado impreso aprobado', checked: false },
        { en: 'Flight ticket copies', es: 'Copias de billetes de avión', checked: false },
        { en: 'South Korean Won cash (₩100,000)', es: 'Won coreano en efectivo (₩100,000)', checked: false },
        { en: 'Credit cards registered for international use', es: 'Tarjetas de crédito registradas para uso internacional', checked: false },
        { en: 'Travel health insurance cards', es: 'Tarjetas de seguro médico de viaje', checked: false }
    ],
    wedding: [
        { en: 'Wedding Rings & Ceremony Vows', es: 'Alianzas de boda y votos ceremoniales', checked: false },
        { en: 'Wedding dress / Tuxedo / Suits', es: 'Vestido de novia / Esmóquines / Trajes', checked: false },
        { en: 'Formal footwear', es: 'Calzado formal', checked: false },
        { en: 'Gifts or wedding favors', es: 'Regalos o recuerdos de boda', checked: false },
        { en: 'Leta\'s parents\' formal attire accessories', es: 'Accesorios y ropa formal de los padres de Leta', checked: false }
    ],
    tech: [
        { en: 'Power adaptors (Korea uses Type C and F)', es: 'Adaptadores de corriente (Corea usa Tipo C y F)', checked: false },
        { en: 'Portable power bank / chargers', es: 'Cargador portátil / Power bank', checked: false },
        { en: 'Kakao T and Naver Map pre-configured', es: 'Kakao T y Naver Map configurados en el móvil', checked: false },
        { en: 'SIM Card / eSIM confirmation info', es: 'Información de confirmación de SIM / eSIM', checked: false }
    ]
};

let currentChecklist = JSON.parse(JSON.stringify(defaultChecklist));
let activeCategory = 'essentials';

function initChecklist() {
    const itemsContainer = document.getElementById('checklistItems');
    const tabs = document.querySelectorAll('.check-tab');
    const customInput = document.getElementById('customCheckItem');
    const addBtn = document.getElementById('addCheckItemBtn');

    const saved = localStorage.getItem('packingChecklist');
    if (saved) {
        try {
            currentChecklist = JSON.parse(saved);
        } catch(e) {
            currentChecklist = JSON.parse(JSON.stringify(defaultChecklist));
        }
    }

    function renderChecklist() {
        itemsContainer.innerHTML = '';
        const items = currentChecklist[activeCategory] || [];

        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = `check-item ${item.checked ? 'checked' : ''}`;
            
            // Check if item has language splits, otherwise it is custom
            const textEn = item.en || item.text;
            const textEs = item.es || item.text;

            div.innerHTML = `
                <input type="checkbox" id="check-${activeCategory}-${index}" ${item.checked ? 'checked' : ''}>
                <span class="lang-en">${textEn}</span>
                <span class="lang-es">${textEs}</span>
            `;

            div.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT') {
                    const checkbox = div.querySelector('input');
                    checkbox.checked = !checkbox.checked;
                }
                item.checked = !item.checked;
                div.classList.toggle('checked', item.checked);
                saveChecklist();
            });

            itemsContainer.appendChild(div);
        });
    }

    function saveChecklist() {
        localStorage.setItem('packingChecklist', JSON.stringify(currentChecklist));
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeCategory = tab.getAttribute('data-cat');
            renderChecklist();
        });
    });

    function handleAddItem() {
        const text = customInput.value.trim();
        if (text) {
            if (!currentChecklist[activeCategory]) {
                currentChecklist[activeCategory] = [];
            }
            // Custom item uses the same text for both languages
            currentChecklist[activeCategory].push({ text, checked: false });
            customInput.value = '';
            renderChecklist();
            saveChecklist();
        }
    }

    addBtn.addEventListener('click', handleAddItem);
    customInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAddItem();
        }
    });

    renderChecklist();
}

/* ==========================================================================
   User Comments / Notes System on Days
   ========================================================================== */
function initDayNotes() {
    const dayCards = document.querySelectorAll('.timeline-day-card');

    dayCards.forEach(card => {
        const dayId = card.getAttribute('data-day');
        const dayBody = card.querySelector('.day-body');
        if (!dayBody) return;

        // Create container for notes
        const notesSection = document.createElement('div');
        notesSection.className = 'day-notes-section';
        dayBody.appendChild(notesSection);

        function renderNotes() {
            const savedNote = localStorage.getItem(`day-notes-${dayId}`);
            
            if (savedNote && savedNote.trim()) {
                // Display notes box
                notesSection.innerHTML = `
                    <div class="day-notes-box">
                        <div class="day-notes-title">
                            <span class="lang-en">📌 Your Notes / Comments</span>
                            <span class="lang-es">📌 Tus notas / comentarios</span>
                        </div>
                        <div class="day-notes-content">${escapeHTML(savedNote)}</div>
                        <div class="day-notes-edit-actions">
                            <button class="btn-notes-action edit-note-btn">
                                <span class="lang-en">Edit</span><span class="lang-es">Editar</span>
                            </button>
                            <button class="btn-notes-action delete-note-btn">
                                <span class="lang-en">Delete</span><span class="lang-es">Eliminar</span>
                            </button>
                        </div>
                    </div>
                `;

                notesSection.querySelector('.edit-note-btn').addEventListener('click', () => {
                    renderForm(savedNote);
                });

                notesSection.querySelector('.delete-note-btn').addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this note?')) {
                        localStorage.removeItem(`day-notes-${dayId}`);
                        renderNotes();
                    }
                });

            } else {
                // Display add button
                notesSection.innerHTML = `
                    <button class="btn btn-outline btn-notes-add add-note-btn" style="padding: 0.4rem 1rem; font-size: 0.8rem; margin-top: 0.5rem;">
                        <span class="lang-en">📝 Add Comments / Notes</span>
                        <span class="lang-es">📝 Añadir comentarios / notas</span>
                    </button>
                `;

                notesSection.querySelector('.add-note-btn').addEventListener('click', () => {
                    renderForm('');
                });
            }
        }

        function renderForm(initialValue) {
            notesSection.innerHTML = `
                <div class="day-notes-form">
                    <textarea class="day-notes-textarea" placeholder="Add your custom comments, restaurant choices or reservations...">${escapeHTML(initialValue)}</textarea>
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <button class="btn btn-outline cancel-note-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                            <span class="lang-en">Cancel</span><span class="lang-es">Cancelar</span>
                        </button>
                        <button class="btn btn-primary save-note-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                            <span class="lang-en">Save</span><span class="lang-es">Guardar</span>
                        </button>
                    </div>
                </div>
            `;

            notesSection.querySelector('.cancel-note-btn').addEventListener('click', () => {
                renderNotes();
            });

            notesSection.querySelector('.save-note-btn').addEventListener('click', () => {
                const value = notesSection.querySelector('.day-notes-textarea').value;
                localStorage.setItem(`day-notes-${dayId}`, value);
                renderNotes();
            });
        }

        renderNotes();
    });
}

function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* ==========================================================================
   Print Event Handler
   ========================================================================== */
function initPrint() {
    const printBtn = document.getElementById('printItineraryBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}
