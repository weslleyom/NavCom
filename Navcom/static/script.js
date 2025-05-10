document.getElementById("form").addEventListener("submit", function(e) {
e.preventDefault();

let url ="http://127.0.0.1:3000/user";
let email = document.getElementById("email").value;
let senha = document.getElementById("password").value;

let body = {email, senha}

fetch(url, {
method: "POST",
headers: {"Content-Type": "application/json"},
body: JSON.stringify(body)
})
.then(response => response.json())
.then(data => {
    console.log("Resposta do servidor:", data);

    if(data.message === "Dados recebidos com sucesso!") {
        window.location.href = "./lista.html";
    } else {
        alert("Erro no envio dos dados: " + data.message);
    }
})
.catch(error => {
    console.error("Erro:", error);
});

});