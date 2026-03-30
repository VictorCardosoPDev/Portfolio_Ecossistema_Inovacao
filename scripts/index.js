const sections = document.querySelectorAll("section");
        const navLinks = document.querySelectorAll(".nav-links a");

        window.addEventListener("scroll", () => {
            let current = "";
            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute("id");
                }
            });

            navLinks.forEach((a) => {
                a.classList.remove("active");
                if (a.getAttribute("href").includes(current)) {
                    a.classList.add("active");
                }
            });
        });

const textElement = document.getElementById("changing-text");
const words = ["Tecnologia", "Saúde", "Meio Ambiente"]; 

let currentIndex = 0;

function updateText() {
    
    textElement.style.opacity = 0;
    textElement.style.transform = "translateY(5px)";

    setTimeout(() => {
        // Troca apenas a palavra inicial
        currentIndex = (currentIndex + 1) % words.length;
        textElement.textContent = words[currentIndex];

        // Efeito de entrada
        textElement.style.opacity = 1;
        textElement.style.transform = "translateY(0)";
    }, 500);
}

setInterval(updateText, 3000);

// 2. Lógica dos Modais
function openModal(id) {
    document.getElementById(id).style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
    document.body.style.overflow = "auto";
}

window.onclick = function(event) {
    if (event.target.className === "modal") {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}