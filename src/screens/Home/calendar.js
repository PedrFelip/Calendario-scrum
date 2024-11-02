
document.addEventListener('DOMContentLoaded', function() { // Inicialização do calendário
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // Define o modelo inicial do calendário
        height: 'clamp(500px, 98vh, 1000px)', // Define a altura minima como 500px, a maxima como 1000px e 98vh de referência
        width: '1000px',
        locale: 'pt-br', // Linguagem PT-BR definida

        dayCellDidMount: function(info) {
            // Cria um elemento <span> para exibir a mensagem de hover
            const hoverMessage = document.createElement("span");
            hoverMessage.textContent = "Clique para abrir as notas";
            hoverMessage.style.display = "none"; // Inicialmente oculto
            hoverMessage.classList.add("hover-message");
        
            // Adiciona o <span> dentro do elemento da célula
            info.el.appendChild(hoverMessage);
        
            // Adiciona os eventos de mouse para exibir/ocultar a mensagem
            info.el.addEventListener("mouseenter", function() {
                hoverMessage.style.display = "block"; // Exibe a mensagem ao passar o mouse
            });
        
            info.el.addEventListener("mouseleave", function() {
                hoverMessage.style.display = "none"; // Oculta a mensagem ao sair
            });
        },           

        headerToolbar: { // Configuração do header (a parte de cima do calendário)
            left: "title",
            center: "", // Em branco, pois não tem nada a ser mostrado
            right: "", // Em branco, pois não tem nada a ser mostrado
        },

        titleFormat: {
            month: "long" // Define apenas o mês no título
        },

        datesSet: function(info) {
            // Adiciona o ano no lado direito
            document.querySelector('.fc-toolbar .fc-toolbar-chunk:last-child').textContent = info.view.currentStart.getFullYear();
        }
    });
    
    calendar.render(); // Renderização do calendário
});
