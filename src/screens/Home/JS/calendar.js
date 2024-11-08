import { setupDayCell, setBackground, DataHeaderEvents } from './functions.js';
import { eventos } from '../../../constants/data.js';
// Link da documentação: https://fullcalendar.io/docs

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const CriadorEventos = document.getElementById("container-events");
    var dataSelecionada;

    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // Define a forma de visualização inicial
        maxHeight: "100%", // Define a altura máxima
        locale: 'pt-br', // Define a linguagem do calendário 
        dayHeaderFormat: { weekday: 'long' }, // Configura o formato do dia da semana no header do calendário
        fixedWeekCount: false, // Determina o número de semanas do mês (True = 6) (False = Depende da quantidade de semanas do mês)

        dayCellDidMount: function(info) {
            setupDayCell(info, CriadorEventos);
        },

        datesSet: function(info){ // Função para mudar o background conforme os meses vão passar
            setBackground(info); 
        },

        dateClick: function(info){
            var dia = String(info.date.getDate()).padStart(2, "0");
            var mes = String(info.date.getMonth() + 1).padStart(2, "0");
            
            dataSelecionada = `${dia}/${mes}`;

            DataHeaderEvents(dataSelecionada)
        },

        HeaderToolbar: { // Modelagem do header
            left: "title", // Título com mês e ano
            center: "", // Vazio
            right: "prev,next", // Botões para navegações entre meses
        },

        showNonCurrentDates: true, // Mostrar dias de outros meses

        events: eventos // Variável Eventos no arquivo data.js da pasta constants
    });

    calendar.render(); // Renderizar calendário
});

// Ainda irei mexer aqui
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
