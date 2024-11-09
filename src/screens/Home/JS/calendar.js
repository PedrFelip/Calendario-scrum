document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
        alert("Você precisa estar logado para acessar o calendário.");
        return;
    }

    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: 'bootstrap5',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        locale: 'pt-br',
        navLinks: true,
        selectable: true,
        selectMirror: true,
        editable: true,
        dayMaxEvents: true,

        events: async function(fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch(`http://localhost:3000/api/events/${userId}`);
                const data = await response.json();

                if (data.success) {
                    successCallback(data.events.map(event => ({
                        id: event.id,
                        title: event.title,
                        start: event.start_date,
                        end: event.end_date,
                        description: event.description,
                        color: "#FFD700"
                    })));
                } else {
                    failureCallback();
                }
            } catch (error) {
                console.error('Erro ao carregar eventos:', error);
                failureCallback(error);
            }
        },

        eventClick: function(info) {
            const visualizarModal = new bootstrap.Modal(document.getElementById("visualizarModal"));
            visualizarModal.show();
            document.getElementById("visualizarTitulo").innerText = info.event.title;
            document.getElementById("visualizarInicio").innerText = info.event.start.toLocaleString();
            document.getElementById("visualizarFim").innerText = info.event.end ? info.event.end.toLocaleString() : info.event.start.toLocaleString();
            document.getElementById("visualizarDescricao").innerText = info.event.extendedProps.description;

            document.getElementById('deleteEventButton').onclick = async () => {
                if (confirm('Deseja realmente excluir este evento?')) {
                    try {
                        const response = await fetch(`http://localhost:3000/api/events/${info.event.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ user_id: userId })
                        });

                        if (!response.ok) {
                            throw new Error('Erro ao excluir evento.');
                        }

                        info.event.remove();
                        visualizarModal.hide();

                    } catch (error) {
                        console.error('Erro ao excluir evento:', error);
                        alert('Erro ao excluir evento: ' + error.message);
                    }
                }
            };
        },

        select: function(info) {
            const cadastrarModal = new bootstrap.Modal(document.getElementById("cadastrarModal"));
            document.getElementById("cadastrarInicio").value = converterData(info.start);
            document.getElementById("cadastrarFim").value = converterData(info.end || info.start);
            cadastrarModal.show();
        }
    });

    calendar.render();

    function converterData(data) {
        const dataObj = new Date(data);
        const ano = dataObj.getFullYear();
        const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
        const dia = String(dataObj.getDate()).padStart(2, "0");
        const hora = String(dataObj.getHours()).padStart(2, "0");
        const minuto = String(dataObj.getMinutes()).padStart(2, "0");
        return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
    }

    const formEvento = document.getElementById("formCadEvento");

    if (formEvento) {
        formEvento.addEventListener("submit", async (e) => {
            e.preventDefault();

            const dadosForm = new FormData(formEvento);
            const dadosJSON = Object.fromEntries(dadosForm.entries());
            dadosJSON.user_id = userId;

            try {
                const response = await fetch("http://localhost:3000/api/events", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dadosJSON)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erro ao criar evento.');
                }

                const data = await response.json();
                calendar.addEvent({
                    id: data.id,
                    title: dadosJSON.title,
                    start: dadosJSON.start_date,
                    end: dadosJSON.end_date,
                    description: dadosJSON.description
                });

                bootstrap.Modal.getInstance(document.getElementById("cadastrarModal")).hide();
                formEvento.reset();

            } catch (error) {
                console.error('Erro ao cadastrar evento:', error);
                alert('Erro ao cadastrar evento: ' + error.message);
            }
        });
    }
});
