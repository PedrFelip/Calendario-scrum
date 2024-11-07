// Função Principal para configurar o comportamento das células do calendário
export function setupDayCell(info, CriadorEventos) {
    const hoverMessage = document.createElement("span");
    hoverMessage.textContent = "Clique para abrir as notas";
    hoverMessage.style.display = "none";
    hoverMessage.classList.add("hover-message");
    info.el.appendChild(hoverMessage);

    info.el.addEventListener("mouseenter", () => { // Função para mostrar o placeholder (Clique para abrir o bloco de notas)
        hoverMessage.style.display = "block";
    });

    info.el.addEventListener("mouseleave", () => { // Função para ocultar o placeholder
        hoverMessage.style.display = "none";
    });

    info.el.addEventListener("click", () => { // Função que abre o criador de eventos
        CriadorEventos.classList.add("ativo");
        document.querySelector(".overlay").classList.add("ativo");
    });

    document.querySelector("#BotaoFecharEvento").addEventListener('click', ()=> {
        CriadorEventos.classList.remove("ativo");
        document.querySelector(".overlay").classList.remove("ativo");
    })
}

export function setBackground(info) {
    const fundo = document.querySelector(".background-container");
    
    // Pega o mês da visualização atual (1-12)
    var mesVisualizacao = info.view.currentStart.getMonth() + 1;

    // Definindo o papel de parede para dezembro ou removendo o fundo
    switch (mesVisualizacao) {
        case 1: // Janeiro
            fundo.style.backgroundImage = "url(../../imagens/meses/janeiro.jpg";
            break;
        case 6: // Junho
            fundo.style.backgroundImage = "url(../../imagens/meses/junho.webp)";
            break;
        case 10: // Outubro
            fundo.style.backgroundImage = "url(../../imagens/meses/outubro.jpg)";
            break;
        case 11: // Novembro
            fundo.style.backgroundImage = "url(../../imagens/meses/novembro.jpg)";
            break;
        case 12: // Dezembro
            fundo.style.backgroundImage = "url(../../imagens/meses/dezembro.jpg)";
            break;
        default:
            fundo.style.backgroundImage = "linear-gradient(black, 45deg)";
            break;
    }
}

export function OcultarCaixaCriarEvento(container){ // Função para fechar o container de criação de evento
    container.classList.remove("ativo");
    document.querySelector(".overlay").classList.remove("ativo");
}

