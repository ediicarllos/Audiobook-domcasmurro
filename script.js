const nomeCapitulo = document.getElementById("capitulo");
const audio = document.getElementById("audio-capitulo");
const botaoPlayPause = document.getElementById("play-pause");
const botaoProximoCapitulo = document.getElementById("proximo");
const botaoCapituloAnterior = document.getElementById("anterior");
const capa = document.getElementById("capa");

const barraProgresso = document.getElementById("barra-progresso");
const tempoAtualDisplay = document.getElementById("tempo-atual");
const tempoRestanteDisplay = document.getElementById("tempo-restante");

const quantidadeCapitulos = 10;
let taTocando = false;
let capitulo = 1;
let rotacao = 0;
let giroInterval;

// Play/Pause
function tocarFaixa() {
  audio.play();
  taTocando = true;
  botaoPlayPause.classList.add("tocando");
  iniciarRotacao();
}

function pausarFaixa() {
  audio.pause();
  taTocando = false;
  botaoPlayPause.classList.remove("tocando");
  pararRotacao();
}

function tocarOuPausarFaixa() {
  taTocando ? pausarFaixa() : tocarFaixa();
}

// Rotação da capa
function iniciarRotacao() {
  pararRotacao();
  giroInterval = setInterval(() => {
    rotacao += 0.8;
    capa.style.transform = `rotate(${rotacao}deg)`;
  }, 20);
}

function pararRotacao() {
  clearInterval(giroInterval);
}

// Capítulos mantendo estado do play
function mudarCapitulo(novoCapitulo) {
  capitulo = novoCapitulo;
  audio.src = `audios/${capitulo}.mp3`;
  nomeCapitulo.innerText = `Capítulo ${capitulo}`;

  if (taTocando) {
    tocarFaixa(); // continua tocando se estava tocando
  }
}

// Anterior e Próximo
function capituloAnterior() {
  let novo = capitulo === 1 ? quantidadeCapitulos : capitulo - 1;
  mudarCapitulo(novo);
}

function proximoCapitulo() {
  let novo = capitulo === quantidadeCapitulos ? 1 : capitulo + 1;
  mudarCapitulo(novo);
}

// Barra de progresso e tempos
audio.addEventListener("timeupdate", () => {
  barraProgresso.max = Math.floor(audio.duration);
  barraProgresso.value = Math.floor(audio.currentTime);

  tempoAtualDisplay.innerText = formatarTempo(audio.currentTime);
  tempoRestanteDisplay.innerText = "-" + formatarTempo(audio.duration - audio.currentTime);

  // Cor barra
  const porcentagem = (audio.currentTime / audio.duration) * 100;
  barraProgresso.style.background = `linear-gradient(to right, #1a2a5f 0%, #293b77ff ${porcentagem}%, #0d1a3f ${porcentagem}%, #0d1a3f 100%)`;
});

// Formatar tempo mm:ss
function formatarTempo(segundos) {
  if (isNaN(segundos)) return "0:00";
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = Math.floor(segundos % 60);
  return `${minutos}:${segundosRestantes.toString().padStart(2, "0")}`;
}

// Arrastar barra
barraProgresso.addEventListener("input", () => {
  audio.currentTime = barraProgresso.value;
});

// Eventos
botaoPlayPause.addEventListener("click", tocarOuPausarFaixa);
botaoCapituloAnterior.addEventListener("click", capituloAnterior);
botaoProximoCapitulo.addEventListener("click", proximoCapitulo);

audio.addEventListener("ended", proximoCapitulo);
