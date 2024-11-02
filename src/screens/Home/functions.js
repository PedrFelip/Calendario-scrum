// Função para adicionar o ano no título do calendário
export function setCalendarYear(info) {
    document.querySelector('.fc-toolbar .fc-toolbar-chunk:last-child').textContent = info.view.currentStart.getFullYear();
}

// Função Principal para configurar o comportamento das células do calendário
export function setupDayCell(info, blocoDeNotas) {
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

    info.el.addEventListener("click", () => { // Função que abre o bloco de notas
        blocoDeNotas.style.display = "flex"; 
        const formattedDate = info.date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
        });
        document.querySelector("#title-notes").innerHTML = `Bloco de notas ${formattedDate}`;
    });
}

export function BotaoSair(containerID){
    const containerPai = document.getElementById(containerID);

    if(containerPai){
        containerPai.style.display = "none";
    } else {
        console.error("O botão não foi encontrado");
    }
}