document.addEventListener("DOMContentLoaded", () => {
    let form = document.getElementById("form");
    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let telefone = document.getElementById("telefone");
    let password = document.getElementById("password");
    let passwordConfirmation = document.getElementById("password-confirmation");
    let suggestPasswordButton = document.getElementById("suggest-password");

    // Alternar visibilidade da senha
    function togglePasswordVisibility(inputId, toggleId) {
        let passwordInput = document.getElementById(inputId);
        let toggleButton = document.getElementById(toggleId);

        toggleButton.addEventListener("click", () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordInput.type = "password";
                toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    }

    // Aplicar ao campo de senha e confirmação
    togglePasswordVisibility("password", "toggle-password");
    togglePasswordVisibility("password-confirmation", "toggle-password-confirmation");

    // Formatar telefone automaticamente
    telefone.addEventListener("input", function () {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        if (value.length > 2) value = value.replace(/^(\d{2})(\d+)/, '($1) $2');
        if (value.length > 9) value = value.replace(/(\d{5})(\d+)/, '$1-$2');
        this.value = value;
    });

    // Validação ao enviar o formulário
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        checkForm();
    });

    // Validações ao perder o foco
    email.addEventListener("blur", checkInputEmail);
    username.addEventListener("blur", checkInputUsername);
    telefone.addEventListener("blur", checkInputTelefone);
    password.addEventListener("blur", checkInputPassword);
    passwordConfirmation.addEventListener("blur", checkInputPasswordConfirmation);

    function checkInputUsername() {
        validateField(username, username.value.trim() === "", "Por favor, insira um nome de usuário!");
    }

    function checkInputEmail() {
        let emailValue = email.value.trim();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailValue === "") {
            errorInput(email, "O e-mail é obrigatório.");
        } else if (!emailRegex.test(emailValue)) {
            errorInput(email, "Insira um e-mail válido.");
        } else {
            clearError(email);
        }
    }

    function checkInputTelefone() {
        let telefoneValue = telefone.value.replace(/\D/g, '');
        if (telefoneValue === "") {
            errorInput(telefone, "O telefone é obrigatório.");
        } else if (telefoneValue.length < 11) {
            errorInput(telefone, "O telefone deve ter 11 dígitos.");
        } else {
            clearError(telefone);
        }
    }

    function checkInputPassword() {
        if (password.value.trim() === "") {
            errorInput(password, "A senha é obrigatória.");
        } else if (password.value.length < 8) {
            errorInput(password, "A senha deve ter pelo menos 8 caracteres.");
        } else {
            clearError(password);
        }
    }

    function checkInputPasswordConfirmation() {
        if (passwordConfirmation.value.trim() === "") {
            errorInput(passwordConfirmation, "A confirmação da senha é obrigatória.");
        } else if (passwordConfirmation.value !== password.value) {
            errorInput(passwordConfirmation, "As senhas não coincidem.");
        } else {
            clearError(passwordConfirmation);
        }
    }

    function checkForm() {
        checkInputUsername();
        checkInputEmail();
        checkInputTelefone();
        checkInputPassword();
        checkInputPasswordConfirmation();

        let isValid = [...form.querySelectorAll(".error")].length === 0;

        if (isValid) {
            alert("✅ CADASTRO REALIZADO COM SUCESSO!");
            form.reset();
        }
    }

    function errorInput(input, message) {
        let formItem = input.parentElement;
        let errorText = formItem.querySelector(".error");

        if (!errorText) {
            errorText = document.createElement("span");
            errorText.classList.add("error");
            formItem.appendChild(errorText);
        }

        errorText.innerText = message;
        errorText.style.display = "block";
      input.classList.add("error-input")
    }

    function clearError(input) {
        let formItem = input.parentElement;
        let errorText = formItem.querySelector(".error");
        if (errorText) {
            errorText.innerText = "";
            errorText.style.display = "none";
        }
       input.classList.remove("error-input");
    }

    function validateField(input, condition, errorMessage) {
        if (condition) {
            errorInput(input, errorMessage);
        } else {
            clearError(input);
        }
    }

    function generatePassword() {
        let length = 12;
        let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }
        return password;
    }

    suggestPasswordButton.addEventListener("click", (event) => {
        event.preventDefault();
        let suggestedPassword = generatePassword();
        password.value = suggestedPassword;
        passwordConfirmation.value = suggestedPassword;
    });
});
