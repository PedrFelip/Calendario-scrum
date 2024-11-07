// Função Principal para configurar o comportamento das células do calendário
export function setupDayCell(info, CriadorEventos) {
    const overlay = document.querySelector(".overlay");

    info.el.addEventListener("click", () => { // Função que abre o criador de eventos
        CriadorEventos.classList.add("ativo"); // Adiciona a classe "ativo" ao container
        overlay.classList.add("ativo"); // Adiciona a classe "ativo" ao overlay
    });

    document.querySelector("#BotaoFecharEvento").addEventListener('click', ()=> { // Função que fecha o criador de eventos
        CriadorEventos.classList.remove("ativo"); // Remove a classe "ativo" do container
        overlay.classList.remove("ativo"); // Remove a classe "ativo" do overlay
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