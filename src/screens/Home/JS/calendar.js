// Executa quando todo o arquivo HTMl for carregado
document.addEventListener('DOMContentLoaded', function() {

    // Recebendo o seletor CALENDAR do atributo id
    var calendarEl = document.getElementById('calendar');

    // Instanciando FullCalendar.Calendar dentro da variável calendar
    var calendar = new FullCalendar.Calendar(calendarEl, {

        themeSystem: 'bootstrap5', // Incluindo o bootstrap5 ao calendário

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

        fixedWeekCount: false, // True => Mostra 6 semanas estaticamente / False => Varia entre 4 a 6 semanas (Depende da quantidade de semanas do mês)

        showNonCurrentDate: true, // Mostra ou não os dias que não pertencem ao mês de visualização

        events: [
            {
                color: "#FFD700",
                title: "Evento Teste",
                start: "2024-11-12",
                end: "2024-11-15",
                description: "Descrição teste para um evento teste"
            }
        ],

        eventClick: function(info){ // Evento que dispara quando o usuário clica em algum evento
            // Instanciando o modelo na variável a seguir
            const visualizarModal = new bootstrap.Modal(document.getElementById("visualizarModal"));

            visualizarModal.show(); // Mostrando o Modal

            // Enviando informações para o Modal
            document.getElementById("visualizarTitulo").innerText = info.event.title;
            document.getElementById("visualizarInicio").innerText = info.event.start.toLocaleString();
            document.getElementById("visualizarFim").innerText = info.event.end.toLocaleString();
            document.getElementById("visualizarDescricao").innerText = info.event.description;
        },

        select: function(info){
            const cadastrarModal = new bootstrap.Modal(document.getElementById("cadastrarModal"));

            document.getElementById("cadastrarInicio").value = converterData(info.start);
            document.getElementById("cadastrarFim").value = converterData(info.start);

            cadastrarModal.show();
        }

    });

    calendar.render();

    function converterData(data){
        
        const dataObj = new Date(data);

        const ano = dataObj.getFullYear();

        const mes = String(dataObj.getMonth() + 1).padStart(2, "0");

        const dia = String(dataObj.getDay()).padStart(2, "0");

        const hora = String(dataObj.getHours()).padStart(2, "0");

        const minuto = String(dataObj.getMinutes()).padStart(2, "0");

        return `${ano}-${mes}-${dia} ${hora}:${minuto}`
    };

    const formEvento = document.getElementById("formCadEvento");
    
    if (formEvento) {
        formEvento.addEventListener("submit", async (e) => {
            e.preventDefault(); // Bloquear a atualização da página
    
            // Receber os dados do formulário e convertê-los para JSON
            const dadosForm = new FormData(formEvento);
            const dadosJSON = Object.fromEntries(dadosForm.entries()); // Converte para objeto JSON
    
            try {
                // Fazer a requisição POST para a API
                const response = await fetch(api.fetchData(), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dadosJSON)
                });
    
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.statusText}`);
                }
    
                // Obter o JSON da resposta
                const data = await response.json();
                console.log(data);
    
            } catch (error) {
                console.error('Erro ao enviar o formulário:', error);
            }
        });
    };
});
