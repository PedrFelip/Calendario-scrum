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
    });

}

export function DataHeaderEvents(dataSelecionada) {
    const TitleHeaderEvents = document.querySelector("#titleHeaderEvents");

    TitleHeaderEvents.innerHTML = `Eventos do dia: ${dataSelecionada}`
}