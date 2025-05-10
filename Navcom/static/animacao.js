// Array de frases para alternar
const frases = [
    "Navegando em soluções digitais, ancorando sua inovação!",
    "Sua agenda, do jeito que você precisa.",
    "Gerencie seus contatos com facilidade.",
    "A melhor plataforma para suas conexões.",
    "Encontre tudo que você precisa em um só lugar."
];

// Função para alternar as frases
let i = 0;
const fraseElemento = document.getElementById('dynamic-text');

function trocarFrase() {
    fraseElemento.style.opacity = 0; // Começa com a frase invisível para o efeito de transição

    setTimeout(() => {
        fraseElemento.textContent = frases[i]; // Troca a frase
        fraseElemento.style.opacity = 1; // Torna a frase visível com a transição suave
    }, 500); // Tempo para a frase desaparecer antes de trocar (500ms)

    i = (i + 1) % frases.length; // Isso garante que o índice nunca ultrapasse o tamanho do array
}

// Trocar frase a cada 3 segundos
setInterval(trocarFrase, 3000);

// Inicializar a primeira frase
trocarFrase();
