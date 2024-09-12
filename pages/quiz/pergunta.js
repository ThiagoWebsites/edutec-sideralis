let quiz = {}
let pontos = 0
let contador = 1
let resposta = ""
let idInputResposta = ""
let respostaCorretaId = ""
let pergunta = 0

function selectOption(selectedButton) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));

    selectedButton.classList.add('selected');
}

function mostrarPopup() {
    document.getElementById('popup').style.display = 'flex';
}

function tirarPopup() {
    document.getElementById('popup').style.display = 'none';
}

function redirecionar() {
    window.location.href = "../quiz.html";
}

async function buscarPerguntas() {
    const urlDados = "./pergunta.json"

    await fetch(urlDados).then(resposta => resposta.json()).then(dados => quiz = dados)
}

function montarPergunta() {
    const main = document.querySelector(".bloco")
    main.innerHTML = `
        <div class="header">
            <button class="sair" onclick="mostrarPopup()">SAIR</button>
            <span>Pergunta ${contador}/10</span>
        </div>
        <div class="question">
            <p>${quiz.perguntas[contador-1].pergunta}</p>
            <div class="options">
                <button class="option" onclick="selectOption(this)">${quiz.perguntas[contador-1].opcoes[0]}</button>
                <button class="option" onclick="selectOption(this)">${quiz.perguntas[contador-1].opcoes[1]}</button>
                <button class="option" onclick="selectOption(this)">${quiz.perguntas[contador-1].opcoes[2]}</button>
                <button class="option" onclick="selectOption(this)">${quiz.perguntas[contador-1].opcoes[3]}</button>
            </div>
        </div>
        <button class="verify-button">Verificar</button>
    `}

function guardarResposta(evento) {
    resposta = evento.target.value
    idInputResposta = evento.target.id

    const botaoEnviar = document.querySelector(".verify-button")
    botaoEnviar.addEventListener("click", validarResposta)
}

function validarResposta() {
    const botaoEnviar = document.querySelector(".verify-button")
    botaoEnviar.innerText = "Próxima"
    botaoEnviar.removeEventListener("click", validarResposta)

    if (pergunta === 10) {
        botaoEnviar.innerText = "Finalizar"
        botaoEnviar.addEventListener("click", finalizar)
    } else {
        botaoEnviar.addEventListener("click", proximaPergunta)
    }
    
    if (resposta === urlDados.perguntas[pergunta-1].respostaCorresta) {
        document.querySelector(`label[for='${idInputResposta}']`).setAttribute("id", "correta")
        pontos = pontos + 1
    } else {
        document.querySelector(`label[for='${idInputResposta}']`).setAttribute("id", "errada")
        document.querySelector(`label[for='${respostaCorretaId}']`).setAttribute("id", "correta")
    }
    
    pergunta = pergunta + 1
}
    
function finalizar() {
    localStorage.setItem("pontos", pontos)
    
    window.location.href = "./resultado.html"
}
    
function proximaPergunta() {
    montarPergunta()
    adicionarEventoInputs()
}
    
function adicionarEventoInputs() {
    const inputsResposta = document.querySelectorAll(".options button")
    inputsResposta.forEach(input => {
        input.addEventListener("click", guardarResposta)
    
        if (input.value === quiz.perguntas[pergunta-1].respostaCorresta){
            respostaCorretaId = input.id
        }
    })
}
    

async function iniciar() {
    await buscarPerguntas()
    montarPergunta()
    adicionarEventoInputs()
}

iniciar()