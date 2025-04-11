let form = document.getElementById("form");
let username = document.getElementById("username");
let email = document.getElementById("email");
let telefone = document.getElementById("telefone");
let password = document.getElementById("password");
let passwordConfirmation = document.getElementById("password-confirmation");

// Função para alternar a visibilidade da senha
function togglePasswordVisibility(inputId, toggleId) {
  let passwordInput = document.getElementById(inputId);
  let toggleButton = document.getElementById(toggleId);

  toggleButton.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>'; // Ícone para esconder
    } else {
      passwordInput.type = "password";
      toggleButton.innerHTML = '<i class="fas fa-eye"></i>'; // Ícone para mostrar
    }
  });
}

// Aplicar a função para os campos de senha e confirmação de senha
togglePasswordVisibility("password", "toggle-password");
togglePasswordVisibility("password-confirmation", "toggle-password-confirmation");

telefone.addEventListener("input", function (event) {
  let value = this.value.replace(/\D/g, '');
  if (value.length > 11) {
    value = value.substring(0, 11);
  }
  if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d+)/, '$1 $2');
  }
  this.value = value;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  checkForm();
});

email.addEventListener("blur", () => {
  checkInputEmail();
});

username.addEventListener("blur", () => {
  checkInputUsername();
});

telefone.addEventListener("blur", () => {
  checkInputTelefone();
});

function checkInputUsername() {
  let usernameValue = username.value;
  if (usernameValue === "") {
    errorInput(username, "Por favor, insira um nome de usuário!");
  } else {
    let formItem = username.parentElement;
    formItem.className = "form-content";
  }
}

function checkInputEmail() {
  let emailValue = email.value;
  if (emailValue === "") {
    errorInput(email, "O e-mail é obrigatório.");
  } else {
    var formItem = email.parentElement;
    formItem.className = "form-content";
  }
}

function checkInputTelefone() {
  let telefoneValue = telefone.value.replace(/\D/g, '');
  if (telefoneValue === "") {
    errorInput(telefone, "O telefone é obrigatório.");
  } else if (telefoneValue.length < 11) {
    errorInput(telefone, "O telefone deve ter pelo menos 11 dígitos.");
  } else {
    let formItem = telefone.parentElement;
    formItem.className = "form-content";
  }
}

function checkInputPassword() {
  let passwordValue = password.value;
  if (passwordValue === "") {
    errorInput(password, "A senha é obrigatória.");
  } else if (passwordValue.length < 8) {
    errorInput(password, "A senha deve ter pelo menos 8 caracteres.");
  } else {
    let formItem = password.parentElement;
    formItem.className = "form-content";
  }
}

function checkInputPasswordConfirmation() {
  let passwordValue = password.value;
  let confirmationPasswordValue = passwordConfirmation.value;
  if (confirmationPasswordValue === "") {
    errorInput(passwordConfirmation, "A confirmação da senha é obrigatória.");
  } else if (confirmationPasswordValue !== passwordValue) {
    errorInput(passwordConfirmation, "As senhas não coincidem.");
  } else {
    let formItem = passwordConfirmation.parentElement;
    formItem.className = "form-content";
  }
}

function checkForm() {
  checkInputUsername();
  checkInputEmail();
  checkInputTelefone();
  checkInputPassword();
  checkInputPasswordConfirmation();

  let formItems = form.querySelectorAll(".form-content");

  let isValid = [...formItems].every((item) => {
    return item.className === "form-content";
  });

  if (isValid) {
    alert("CADASTRO REALIZADO COM SUCESSO!");
  }
}

function errorInput(input, message) {
  let formItem = input.parentElement;
  let textMessage = formItem.querySelector("a");
  textMessage.innerText = message;
  formItem.className = "form-content error";
}

function generatePassword() {
  let length = 8;
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

let suggestPasswordButton = document.getElementById("suggest-password");
let passwordInput = document.getElementById("password");
let passwordConfirmationInput = document.getElementById("password-confirmation");

suggestPasswordButton.addEventListener("click", (event) => {
  event.preventDefault();
  let suggestedPassword = generatePassword();
  passwordInput.value = suggestedPassword;
  passwordConfirmationInput.value = suggestedPassword;
});