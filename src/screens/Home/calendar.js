import { setupDayCell, OcultarCaixaCriarEvento, setBackground } from './functions.js';

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const CriadorEventos = document.getElementById("container-events");

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        maxHeight: "100%",
        locale: 'pt-br',
        fixedWeekCount: false,

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


        showNonCurrentDates: false,
    });

    calendar.render();

    // Função que fecha o Criador de Eventos
    document.getElementById("FecharCriarEvento").addEventListener('click', () => {
        OcultarCaixaCriarEvento("container-events"); // Função para ocultar o container-events
    })
});

$("#calendar").FullCalendar({ // $() é usado para selecionar elemento do DOM mais fácil (JQuery)
    selectable: true,
    select: function(start, end){
        
        // Pegando o formulário
        $("#eventForm").show();

        $("#startEvent").val(start.format("DD-MM-YYYYTHH:MM"));
        $("#endEvent").val(end.format("DD-MM-YYYYTHH:MM"));

        window.saveEvent = function(){
            var title = $("#titleEvent").val();
            var start = $("#startEvent").val();
            var end = $("#endEvent").val();

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
