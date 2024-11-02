// Função para configurar o comportamento das células do calendário
export function setupDayCell(info, blocoDeNotas) {
    const hoverMessage = document.createElement("span");
    hoverMessage.textContent = "Clique para abrir as notas";
    hoverMessage.style.display = "none";
    hoverMessage.classList.add("hover-message");
    info.el.appendChild(hoverMessage);

    info.el.addEventListener("mouseenter", () => {
        hoverMessage.style.display = "block";
    });

    info.el.addEventListener("click", () => {
        blocoDeNotas.style.display = "flex";
        const formattedDate = info.date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
        });
        document.querySelector("#title-notes").innerHTML = `Bloco de notas ${formattedDate}`;
    });

    info.el.addEventListener("mouseleave", () => {
        hoverMessage.style.display = "none";
    });
}

// Função para adicionar o ano no título do calendário
export function setCalendarYear(info) {
    document.querySelector('.fc-toolbar .fc-toolbar-chunk:last-child').textContent = info.view.currentStart.getFullYear();
}
