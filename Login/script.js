class SocialMediaLogin {
    constructor() {
        this.loginButton = document.getElementById("loginButton");
        this.loading = document.getElementById("loading");
        this.usernameInput = document.getElementById("username");
        this.passwordInput = document.getElementById("password");
        this.toast = document.getElementById("simpleToast");

        this.loginButton.addEventListener("click", this.handleLogin.bind(this));
    }

    handleLogin() {
        this.loginButton.style.display = "none";
        this.loading.style.display = "flex";

        const username = this.usernameInput.value;
        const password = this.passwordInput.value;

        fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, expiresInMins: 60 })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            this.showToast("Logged in Successfully", "success");
            localStorage.setItem("users", JSON.stringify(data));
            setTimeout(() => { window.location.href = "../index.html" }, 1000);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            this.showToast("❌ Please Enter Correct Credential", "error");
            this.loginButton.style.display = "block";
            this.loading.style.display = "none";
        });
    }

    showToast(message, mode) {
        this.toast.textContent = message;
        this.toast.className = "show";

        if (mode === "error") {
            this.toast.classList.add("bg-red-500");
        } else if (mode === "success") {
            this.toast.classList.add("bg-green-500");
        }

        setTimeout(() => {
            this.toast.classList.remove("show", "bg-red-500", "bg-green-500");
        }, 3000);
    }
}

const login = new SocialMediaLogin();
