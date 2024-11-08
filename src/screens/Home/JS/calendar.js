// Executa quando todo o arquivo HTMl for carregado
document.addEventListener('DOMContentLoaded', function() {

    // Recebendo o seletor CALENDAR do atributo id
    var calendarEl = document.getElementById('calendar');

    // Instanciando FullCalendar.Calendar dentro da variável calendar
    var calendar = new FullCalendar.Calendar(calendarEl, {

    headerToolbar: { // Cabeçalho do calendário
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },

    locale: 'pt-br', // Linguagem do calendário

    navLinks: true, // Permite clicar nos nomes dos dias da semana

    selectable: true, // Permite clicar e arrastar o mouse sobre um ou vários dias do calendário

    selectMirror: true, // Indica a área que foi selecionada, antes de realizar algo

    editable: true, // Permite arrastar e redimensionar eventos no calendário

    dayMaxEvents: true, // Determina o número de eventos que serão mostrados, ao tamanho da célula

    events: "",
    });

    calendar.render();
});
