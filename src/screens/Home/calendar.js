

document.addEventListener('DOMContentLoaded', function() { // Inicialização do calendário
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // Definindo o modelo inicial do calendário
        height: '100vh', // Definindo para o calendário tomar 100% da viewport
        locale: 'pt-br',
        
        headerToolbar: { // Configuração do header (a parte de cima do calendário)
            left: "title",
            center: "", // Em branco, pois não tem nada
            right: "title"
        },

        titleFormat: {
            month: "long"
        },

        datesSet: function(info) {
            // Adiciona o ano no lado direito
            document.querySelector('.fc-toolbar .fc-toolbar-chunk:last-child').textContent = info.view.currentStart.getFullYear();
        }
    });
    
    calendar.render();
});

let title = document.getElementById("fc-dom-1");

title.innerText = ""

