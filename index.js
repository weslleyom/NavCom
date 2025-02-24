let palavra = prompt("Digite a palavra:");
let reverce = "";
for(let i = palavra.length - 1; i >= 0; i--){
    reverce += palavra[i];
    console.log(i)
}
if(palavra == reverce){
    alert(`A palavra ${palavra} é um palindromo\n${reverce}`)
}else{
    alert(`A palavra ${palavra} não é um palindromo\n${reverce}`)
}