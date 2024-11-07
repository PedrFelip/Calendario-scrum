import { setupDayCell, setBackground } from './functions.js';
import { eventos } from '../../constants/data.js';
// Link da documentação: https://fullcalendar.io/docs

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const CriadorEventos = document.getElementById("container-events");

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // Define a forma de visualização inicial
        maxHeight: "100%", // Define a altura máxima
        locale: 'pt-br', // Define a linguagem do calendário 
        dayHeaderFormat: { weekday: 'long' }, // Configura o formato do dia da semana no header do calendário
        fixedWeekCount: false, // Determina o número de semanas do mês (True = 6) (False = Depende da quantidade de semanas do mês)

        dayCellDidMount: function(info) {
            setupDayCell(info, CriadorEventos);
        },

        datesSet: function(info){
            setBackground(info);
        },

        headerToolbar: {
            left: "title",
            center: "",
            right: "prev,next",
        },

        showNonCurrentDates: true,

        events: eventos
    });

    calendar.render();
});

$("#calendar").FullCalendar({ // $() é usado para selecionar elemento do DOM mais fácil (JQuery)
    selectable: true,
    select: function(start, end){
        
        // Pegando o formulário
        $("#eventForm").show();

        $("#startEventDate").val(start.format("DD-MM-YYYY"));
        $("#endEventDate").val(end.format("DD-MM-YYYY"));

        window.saveEvent = function(){
            var title = $("#titleEvent").val();
            var start = $("#startEventDate").val();
            var end = $("#endEventDate").val();

            if(title, start, end){
                $("#calendar").FullCalendar('renderEvent', {
                    title: title,
                    start: start,
                    end: end
                });

                $("#eventForm").hide();
            }
        }
    }
})
