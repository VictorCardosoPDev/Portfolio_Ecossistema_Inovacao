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

document.addEventListener("DOMContentLoaded", () => {

    renderEventos();

});

// =========================================================================
// EVENTOS
// =========================================================================

function renderEventos() {

    
    const container = document.getElementById("event-list");

    if (!container) return;

    container.innerHTML = "";

    eventos.forEach(evento => {

        
        const card = document.createElement("div");

        card.className = "event-card";

        card.innerHTML = `
        
            <div class="event-image">

                <img src="${evento.capa}" alt="${evento.titulo}">

                <span class="event-category">
                    ${evento.categoria}
                </span>

                <div class="event-date">

                    <span class="event-day">${evento.dia}</span>

                    <span class="event-month">${evento.mes}</span>

                    <span class="event-year">${evento.ano}</span>

                </div>

            </div>

            <div class="event-content">

                <h3 class="event-title">
                    ${evento.titulo}
                </h3>

                <p class="event-description">
                    ${evento.descricao}
                </p>

                <div class="event-footer">

                    <div class="event-location">

                        <i class="fas fa-map-marker-alt"></i>

                        ${evento.local}

                    </div>

                    <div class="event-button">

                        Ver detalhes

                        <i class="fas fa-arrow-right"></i>

                    </div>

                </div>

            </div>

        `;

        card.addEventListener("click", () => {

            abrirModal(evento);

            // depois chamaremos:
            // abrirModal(evento);

        });

        container.appendChild(card);

    });

}

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

const STORAGE_KEY = "ecossistema_posts";

const form = document.getElementById("post-form");
const lista = document.getElementById("admin-post-list");
const total = document.getElementById("total-posts");


/* =========================================================
   CARREGAR POSTS
========================================================= */

function carregarPosts() {

    return JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];

}


/* =========================================================
   SALVAR POSTS
========================================================= */

function salvarPosts(posts) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(posts)
    );

}


/* =========================================================
   CONVERTER IMAGEM
========================================================= */

function converterImagem(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {

            resolve(reader.result);

        };

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}


/* =========================================================
   ADICIONAR POST
========================================================= */

form.addEventListener("submit", async function (event) {

    event.preventDefault();


    const tipo =
        document.getElementById("tipo").value;

    const titulo =
        document.getElementById("titulo").value;

    const data =
        document.getElementById("data").value;

    const local =
        document.getElementById("local").value;

    const categoria =
        document.getElementById("categoria").value;

    const descricao =
        document.getElementById("descricao").value;

    const arquivo =
        document.getElementById("capa").files[0];


    if (!arquivo) {

        alert("Selecione uma imagem.");

        return;

    }


    const imagem =
        await converterImagem(arquivo);


    const posts = carregarPosts();


    const novoPost = {

        id: Date.now(),

        tipo,

        titulo,

        data,

        local,

        categoria,

        descricao,

        capa: imagem

    };


    posts.push(novoPost);


    salvarPosts(posts);


    form.reset();


    renderizarPosts();


    alert("Publicação adicionada com sucesso!");

});


/* =========================================================
   RENDERIZAR
========================================================= */

function renderizarPosts() {

    const posts = carregarPosts();


    lista.innerHTML = "";


    total.textContent = posts.length;


    if (posts.length === 0) {

        lista.innerHTML = `
            <p style="color:#777;">
                Nenhuma publicação cadastrada.
            </p>
        `;

        return;

    }


    posts.forEach(post => {

        const item =
            document.createElement("div");


        item.className = "admin-post";


        item.innerHTML = `

            <div class="admin-post-info">

                <h3>
                    ${post.titulo}
                </h3>

                <span>
                    ${post.tipo} • ${post.categoria}
                </span>

            </div>

            <button
                class="delete-post"
                onclick="excluirPost(${post.id})"
            >

                <i class="fas fa-trash"></i>

            </button>

        `;


        lista.appendChild(item);

    });

}


/* =========================================================
   EXCLUIR
========================================================= */

function excluirPost(id) {

    if (!confirm("Deseja excluir esta publicação?")) {

        return;

    }


    let posts = carregarPosts();


    posts = posts.filter(post => post.id !== id);


    salvarPosts(posts);


    renderizarPosts();

}


/* =========================================================
   INICIAR
========================================================= */

renderizarPosts();