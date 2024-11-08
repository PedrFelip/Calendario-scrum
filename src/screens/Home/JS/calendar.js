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

    initialDate: '2023-01-12', // Data para inicializar

    navLinks: true, // Permite clicar nos nomes dos dias da semana

    selectable: true, // Permite clicar e arrastar o mouse sobre um ou vários dias do calendário

    selectMirror: true, // Indica a área que foi selecionada, antes de realizar algo

    editable: true, // Permite arrastar e redimensionar eventos no calendário

    dayMaxEvents: true, // Determina o número de eventos que serão mostrados, ao tamanho da célula
    events: [
        {
        title: 'All Day Event',
        start: '2023-01-01'
        },
        {
        title: 'Long Event',
        start: '2023-01-07',
        end: '2023-01-10'
        },
        {
        groupId: 999,
        title: 'Repeating Event',
        start: '2023-01-09T16:00:00'
        },
        {
        groupId: 999,
        title: 'Repeating Event',
        start: '2023-01-16T16:00:00'
        },
        {
        title: 'Conference',
        start: '2023-01-11',
        end: '2023-01-13'
        },
        {
        title: 'Meeting',
        start: '2023-01-12T10:30:00',
        end: '2023-01-12T12:30:00'
        },
        {
        title: 'Lunch',
        start: '2023-01-12T12:00:00'
        },
        {
        title: 'Meeting',
        start: '2023-01-12T14:30:00'
        },
        {
        title: 'Happy Hour',
        start: '2023-01-12T17:30:00'
        },
        {
        title: 'Dinner',
        start: '2023-01-12T20:00:00'
        },
        {
        title: 'Birthday Party',
        start: '2023-01-13T07:00:00'
        },
        {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2023-01-28'
        }
    ]
    });

    calendar.render();
});
