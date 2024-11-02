import { setupDayCell, setCalendarYear } from './functions.js';

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const blocoDeNotas = document.getElementById("container-notes");

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 'clamp(500px, 98vh, 1000px)',
        locale: 'pt-br',

        dayCellDidMount: function(info) {
            setupDayCell(info, blocoDeNotas);
        },

        headerToolbar: {
            left: "title",
            center: "",
            right: "",
        },

        titleFormat: {
            month: "long"
        },

        datesSet: function(info) {
            setCalendarYear(info);
        }
    });

    calendar.render();
});
