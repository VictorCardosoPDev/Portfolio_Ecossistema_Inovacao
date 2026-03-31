(function () {
    // Variáveis de referência no DOM
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Texto dinâmico da seção hero
    const textElement = document.getElementById('changing-text');
    const words = ['Tecnologia', 'Saúde', 'Meio Ambiente'];
    let currentIndex = 0;
    let textIntervalId = null;

    /**
     * Atualiza o link ativo do menu de navegação em função da seção visível.
     * Chamado no evento de scroll (scroll spy)
     */

    function setActiveNav() {
        let currentSectionId = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 150) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${currentSectionId}`);
        });
    }

    /**
     * Inicializa o scroll spy para atualizar estado de menu conforme rolagem.
     */
    function initScrollSpy() {
        setActiveNav();
        window.addEventListener('scroll', setActiveNav);
    }

    /**
     * Alterna o texto do banner hero com transição suave (fade + movimento vertical).
     */
    function updateHeroText() {
        if (!textElement) return;

        textElement.style.opacity = '0';
        textElement.style.transform = 'translateY(5px)';

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % words.length;
            textElement.textContent = words[currentIndex];
            textElement.style.opacity = '1';
            textElement.style.transform = 'translateY(0)';
        }, 500);
    }

    /**
     * Inicia o ciclo de troca de palavras no texto hero e adiciona comportamentos de pausa no hover.
     */
    function initHeroRotation() {
        if (!textElement) return;

        textIntervalId = setInterval(updateHeroText, 3000);

        // pausa a animação ao focar no texto (opcional)
        textElement.addEventListener('mouseover', () => clearInterval(textIntervalId));
        textElement.addEventListener('mouseout', () => {
            textIntervalId = setInterval(updateHeroText, 3000);
        });
    }

    /**
     * Abre modal pelo id e bloqueia rolagem do corpo.
     * @param {string} id - ID do elemento modal.
     */
    function openModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    /**
     * Fecha modal pelo id e restaura rolagem do corpo.
     * @param {string} id - ID do elemento modal.
     */
    function closeModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function closeModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function initModals() {
        document.querySelectorAll('.project-card').forEach((card) => {
            card.addEventListener('click', () => {
                const targetId = card.dataset.modal;
                if (targetId) openModal(targetId);
            });
        });

        document.querySelectorAll('.close').forEach((btn) => {
            btn.addEventListener('click', (event) => {
                const modal = event.currentTarget.closest('.modal');
                if (!modal) return;
                closeModal(modal.id);
            });
        });

        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                closeModal(event.target.id);
            }
        });
    }

    function init() {
        initScrollSpy();
        initHeroRotation();
        initModals();
    }

    document.addEventListener('DOMContentLoaded', init);

    // Expor funções globais para compatibilidade com atributos onclick existentes
    window.openModal = openModal;
    window.closeModal = closeModal;
})();
function filterProjects(categoryId) {
    // 1. Seleciona todos os botões e grupos de projetos
    const buttons = document.querySelectorAll('.filter-btn');
    const groups = document.querySelectorAll('.project-group');

    // 2. Remove a classe 'active' de todos (limpa o estado anterior)
    buttons.forEach(btn => btn.classList.remove('active'));
    groups.forEach(group => group.classList.remove('active'));

    // 3. Adiciona a classe 'active' no botão que foi clicado
    // Usamos window.event para garantir compatibilidade se o 'event' não for passado
    const clickedButton = window.event.currentTarget;
    clickedButton.classList.add('active');

    // 4. Mostra o grupo correspondente ao ID passado
    const targetGroup = document.getElementById(categoryId);
    if (targetGroup) {
        targetGroup.classList.add('active');
    }
}