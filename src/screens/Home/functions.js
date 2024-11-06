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
}

export function setBackground(info) {
    const body = document.querySelector("body");
    
    // Pega o mês da visualização atual (0-11)
    var mesVisualizacao = info.view.currentStart.getMonth();

    // Definindo o papel de parede para dezembro ou removendo o fundo
    switch (mesVisualizacao) {
        case 10:
            body.style.backgroundColor = "none";
            body.style.backgroundImage = "url(../../imagens/meses/novembro.jpg)";
        case 11: // Dezembro
            body.style.backgroundColor = "none";
            body.style.backgroundImage = "url(../../imagens/meses/dezembro.jpg)";
            break;
        default:
            body.style.backgroundImage = "none";
            body.style.backgroundColor = "black"; // Cor de fundo para outros meses
            break;
    }
}

export function OcultarCaixaCriarEvento(container){ // Função para fechar o container de criação de evento
    container.styte.opacity = 0;
    container.style.pointerEvents = "none";
}

