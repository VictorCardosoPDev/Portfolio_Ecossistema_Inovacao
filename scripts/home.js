const supabaseUrl = "https://rakngaethbhtvmhipksa.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJha25nYWV0aGJodHZtaGlwa3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MDM4MTUsImV4cCI6MjEwMzE3OTgxNX0.x26J86jqWWJTEoV_83n0vqfjaLWBDt_dbgekB0IFh7U";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

document.addEventListener("DOMContentLoaded", () => {
    renderizarPosts();
});
async function carregarPosts() {

    const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .order("data", {
            ascending: false
        });

    if (error) {

        console.error("Erro ao carregar publicações:", error);

        return [];

    }

    return data || [];
}

async function renderizarPosts() {

    const container = document.getElementById("event-list");

    if (!container) {
        console.error("Elemento #event-list não encontrado.");
        return;
    }

    const posts = await carregarPosts();

    // Remove somente os cards antigos
    container
        .querySelectorAll(".event-card")
        .forEach(card => card.remove());


    if (posts.length === 0) {

        console.log("Nenhuma publicação encontrada.");

        return;
    }


    posts.forEach(post => {

        const card = document.createElement("article");

        card.className = "event-card";


        const data = new Date(
            post.data + "T00:00:00"
        );


        card.innerHTML = `

            <div class="event-image">

                <img
                    src="${post.capa}"
                    alt="${post.titulo}"
                >

            </div>


            <div class="event-content">

                <span class="event-category">
                    ${post.categoria}
                </span>


                <h3>
                    ${post.titulo}
                </h3>


                <p>
                    ${post.descricao}
                </p>


                <div class="event-info">

                    <span>
                        <i class="fas fa-calendar"></i>

                        ${data.toLocaleDateString("pt-BR")}

                    </span>


                    ${
                        post.local
                            ? `
                                <span>
                                    <i class="fas fa-map-marker-alt"></i>
                                    ${post.local}
                                </span>
                            `
                            : ""
                    }

                </div>


                ${
                    post.link
                        ? `
                            <a
                                href="${post.link}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ver detalhes
                                <i class="fas fa-arrow-right"></i>
                            </a>
                        `
                        : ""
                }

            </div>

        `;


        container.appendChild(card);

    });

}

(function () {
    // Variáveis de referência no DOM
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Texto dinâmico da seção hero
    const textElement = document.getElementById('changing-text');
    const words = ['Tecnologia', 'Saúde', 'Meio Ambiente'];
    let currentIndex = 0;
    let textIntervalId = null;
    let galeriaAtual = [];
    let imagemAtual = 0;
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

    function initModals() {
        document.querySelectorAll('.project-card[data-modal]').forEach((card) => {
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

    function filterProjects(categoryId, activeButton = null) {
        const buttons = document.querySelectorAll('.filter-btn');
        const groups = document.querySelectorAll('.project-group');

        buttons.forEach((btn) => btn.classList.remove('active'));
        groups.forEach((group) => group.classList.remove('active'));

        if (activeButton) {
            activeButton.classList.add('active');
        } else {
            const fallbackButton = document.querySelector(`.filter-btn[data-filter="${categoryId}"]`);
            if (fallbackButton) fallbackButton.classList.add('active');
        }

        const targetGroup = document.getElementById(categoryId);
        if (targetGroup) {
            targetGroup.classList.add('active');
        }
    }

    function initProjectFilters() {
        document.querySelectorAll('.filter-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const filterId = button.dataset.filter;
                if (filterId) filterProjects(filterId, button);
            });
        });
    }

    function init() {
        initScrollSpy();
        initHeroRotation();
        initModals();
        initProjectFilters();
    }

    document.addEventListener('DOMContentLoaded', init);

    // Expor funções globais para compatibilidade com atributos onclick existentes
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.filterProjects = filterProjects;
})();
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.2
});

reveals.forEach(el => observer.observe(el));

/* ==========================================================================
   BOTÃO VOLTAR AO TOPO
   ========================================================================== */

const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {

    if (window.scrollY > 400) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }

});

backToTopButton.addEventListener('click', () => {

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

});

// =========================================================================
// Modal EVENTOS
// =========================================================================

function abrirModal(evento){

    document.getElementById("modal-cover").src = evento.capa;

    document.getElementById("modal-category").textContent = evento.categoria;

    document.getElementById("modal-title").textContent = evento.titulo;

    document.getElementById("modal-date").textContent =
        `${evento.dia}/${evento.mes}/${evento.ano}`;

    document.getElementById("modal-location").textContent =
        evento.local;

    document.getElementById("modal-description").textContent =
        evento.descricao;

    document
        .getElementById("event-modal")
        .classList.add("active");
    const gallery = document.getElementById("gallery");

gallery.innerHTML = "";

evento.galeria.forEach((imagem, indice) => {

    const img = document.createElement("img");

    img.src = imagem;

    img.alt = evento.titulo;

    img.addEventListener("click", () => {

        abrirLightbox(evento.galeria, indice);

    });

    gallery.appendChild(img);

});
}

function fecharModal(){

    document
        .getElementById("event-modal")
        .classList.remove("active");

}

document
    .getElementById("close-modal")
    .addEventListener("click", fecharModal);

document
    .getElementById("event-modal")
    .addEventListener("click", function(e){

        if(e.target === this){

            fecharModal();

        }

    });

    function abrirLightbox(src) {

    document.getElementById("lightbox-img").src = src;
    document.getElementById("lightbox").classList.add("active");

}

function fecharLightbox() {

    document.getElementById("lightbox").classList.remove("active");

}

document.getElementById("close-lightbox").addEventListener("click", fecharLightbox);

document.getElementById("lightbox").addEventListener("click", function(e){

    if(e.target === this){

        fecharLightbox();

    }

});

function abrirLightbox(galeria, indice){

    galeriaAtual = galeria;

    imagemAtual = indice;

    atualizarLightbox();

    document
        .getElementById("lightbox")
        .classList.add("active");

}

function atualizarLightbox(){

    document.getElementById("lightbox-img").src =
        galeriaAtual[imagemAtual];

    document.getElementById("lightbox-counter").textContent =
        `${imagemAtual + 1} / ${galeriaAtual.length}`;

}

function proximaImagem(){

    imagemAtual++;

    if(imagemAtual >= galeriaAtual.length){

        imagemAtual = 0;

    }

    atualizarLightbox();

}

function imagemAnterior(){

    imagemAtual--;

    if(imagemAtual < 0){

        imagemAtual = galeriaAtual.length - 1;

    }

    atualizarLightbox();

}
function fecharLightbox(){

    document
        .getElementById("lightbox")
        .classList.remove("active");

}
document
.getElementById("next-image")
.addEventListener("click", proximaImagem);

document
.getElementById("prev-image")
.addEventListener("click", imagemAnterior);

document
.getElementById("close-lightbox")
.addEventListener("click", fecharLightbox);

document
.getElementById("lightbox")
.addEventListener("click", function(e){

    if(e.target === this){

        fecharLightbox();

    }

});

document.addEventListener("keydown", function(e){

    const aberto =
        document.getElementById("lightbox")
        .classList.contains("active");

    if(!aberto) return;

    if(e.key === "ArrowRight"){

        proximaImagem();

    }

    if(e.key === "ArrowLeft"){

        imagemAnterior();

    }

    if(e.key === "Escape"){

        fecharLightbox();

    }

});
