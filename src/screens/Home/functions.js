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
        document.querySelector('.criar-evento').classList.add('ativo');  // Exibe a caixa de criação
        document.querySelector('.overlay').classList.add('ativo');  // Exibe a sobreposição
        document.body.classList.add('body-blur');  // Bloqueia a interação com o conteúdo por trás
    });
}
export function OcultarCaixaCriarEvento(container){
    container.styte.opacity = 0;
    container.style.pointerEvents = "none";
}

