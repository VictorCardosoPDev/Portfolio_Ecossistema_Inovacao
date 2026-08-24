const SUPABASE_URL = "https://rakngaethbhtvmhipksa.supabase.co";
const SUPABASE_KEY = "sb_publishable__souUrqxLn0NJJVhhdQ1AQ_nP3uUGD1";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


document
    .getElementById("login-form")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const errorElement =
            document.getElementById("login-error");


        errorElement.textContent = "";


        const { error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (error) {

            errorElement.textContent =
                "E-mail ou senha incorretos.";

            return;

        }


        window.location.href = "../pages/home.html";

    });

