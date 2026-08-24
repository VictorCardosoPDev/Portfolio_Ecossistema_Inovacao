/* =========================================================
   SUPABASE
========================================================= */

const supabaseUrl = "https://rakngaethbhtvmhipksa.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJha25nYWV0aGJodHZtaGlwa3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MDM4MTUsImV4cCI6MjEwMzE3OTgxNX0.x26J86jqWWJTEoV_83n0vqfjaLWBDt_dbgekB0IFh7U";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);


/* =========================================================
   ELEMENTOS
========================================================= */

const form = document.getElementById("post-form");
const lista = document.getElementById("admin-post-list");
const total = document.getElementById("total-posts");


/* =========================================================
   VERIFICAR LOGIN
========================================================= */

async function verificarUsuario() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {

        window.location.href = "../index.html";

        return null;

    }

    return session;
}


/* =========================================================
   CARREGAR POSTS DO SUPABASE
========================================================= */

async function carregarPosts() {

    const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(
            "Erro ao carregar posts:",
            error
        );

        alert("Erro ao carregar as publicações.");

        return [];

    }


    return data || [];
}


/* =========================================================
   ADICIONAR POST
========================================================= */

form.addEventListener("submit", async function (event) {

    event.preventDefault();


    const session = await verificarUsuario();

    if (!session) return;


    /* -----------------------------------------------------
       DADOS DO FORMULÁRIO
    ----------------------------------------------------- */

    const tipo =
        document.getElementById("tipo").value;

    const titulo =
        document.getElementById("titulo").value.trim();

    const data =
        document.getElementById("data").value;

    const local =
        document.getElementById("local").value.trim();

    const categoria =
        document.getElementById("categoria").value.trim();

    const descricao =
        document.getElementById("descricao").value.trim();

    const link =
        document.getElementById("link").value.trim();

    const arquivo =
        document.getElementById("capa").files[0];


    if (!arquivo) {

        alert("Selecione uma imagem.");

        return;

    }


    try {

        /* -------------------------------------------------
           NOME DO ARQUIVO
        ------------------------------------------------- */

        const nomeArquivo =
            `${session.user.id}/${Date.now()}-${arquivo.name
                .replace(/\s+/g, "-")
                .toLowerCase()}`;


        /* -------------------------------------------------
           ENVIAR IMAGEM PARA O STORAGE
        ------------------------------------------------- */

        const { error: uploadError } =
            await supabaseClient
                .storage
                .from("imagens")
                .upload(
                    nomeArquivo,
                    arquivo
                );


        if (uploadError) {

            console.error(
                "Erro no upload:",
                uploadError
            );

            alert(
                "Erro ao enviar a imagem: " +
                uploadError.message
            );

            return;

        }


        /* -------------------------------------------------
           PEGAR URL PÚBLICA
        ------------------------------------------------- */

        const {
            data: publicUrlData
        } = supabaseClient
            .storage
            .from("imagens")
            .getPublicUrl(nomeArquivo);


        const capa =
            publicUrlData.publicUrl;


        /* -------------------------------------------------
           SALVAR DADOS NA TABELA POSTS
        ------------------------------------------------- */

        const { error: insertError } =
            await supabaseClient
                .from("posts")
                .insert({

                    tipo: tipo,

                    titulo: titulo,

                    data: data,

                    local: local,

                    categoria: categoria,

                    descricao: descricao,

                    link: link,

                    capa: capa

                });


        if (insertError) {

            console.error(
                "Erro ao salvar post:",
                insertError
            );

            alert(
                "Erro ao salvar publicação: " +
                insertError.message
            );

            return;

        }


        /* -------------------------------------------------
           FINALIZAR
        ------------------------------------------------- */

        form.reset();

        await renderizarPosts();

        alert(
            "Publicação adicionada com sucesso!"
        );

    }
    catch (error) {

        console.error(
            "Erro inesperado:",
            error
        );

        alert(
            "Ocorreu um erro inesperado."
        );

    }

});


/* =========================================================
   RENDERIZAR POSTS
========================================================= */

async function renderizarPosts() {

    const posts = await carregarPosts();


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
                data-id="${post.id}"
            >

                <i class="fas fa-trash"></i>

            </button>

        `;


        const botaoExcluir =
            item.querySelector(".delete-post");


        botaoExcluir.addEventListener(
            "click",
            function () {

                excluirPost(post.id);

            }
        );


        lista.appendChild(item);

    });

}


/* =========================================================
   EXCLUIR POST
========================================================= */

async function excluirPost(id) {

    const confirmar =
        confirm(
            "Deseja excluir esta publicação?"
        );


    if (!confirmar) return;


    const { error } =
        await supabaseClient
            .from("posts")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(
            "Erro ao excluir:",
            error
        );

        alert(
            "Erro ao excluir publicação: " +
            error.message
        );

        return;

    }


    await renderizarPosts();

}


/* =========================================================
   INICIAR DASHBOARD
========================================================= */

async function iniciarDashboard() {

    const session =
        await verificarUsuario();


    if (!session) return;


    await renderizarPosts();

}


iniciarDashboard();