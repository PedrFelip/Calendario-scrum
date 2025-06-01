const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const userId = localStorage.getItem('user_id');

    if (!userId) {
        console.error('ID do usuário não encontrado. Redirecionando para login...');
        window.location.href = '../Login/telaLogin.html';
        return;
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: 'bootstrap5',
        headerToolbar: {
            left: 'today',
            center: 'prev,title,next',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        locale: 'pt-br',
        height: "100vh",
        navLinks: true,
        selectable: true,
        editable: true,
        dayMaxEvents: true,
        fixedWeekCount: false,

        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false,
            omitZeroMinute: false
        },

        nowIndicator: true,

        eventClick: function(info) {
            const visualizarModal = new bootstrap.Modal(document.getElementById("visualizarModal"));
            visualizarModal.show();

            document.getElementById("visualizarTitulo").innerText = info.event.title;
            document.getElementById("visualizarInicio").innerText = formatDatetimeDisplay(info.event.start);
            document.getElementById("visualizarFim").innerText = info.event.end ? formatDatetimeDisplay(info.event.end) : 'N/A';
            document.getElementById("visualizarDescricao").innerText = info.event.extendedProps.description;

            document.getElementById("btnDeleteEvento").onclick = function() {
                ipcRenderer.send('delete-event', { id: info.event.id, user_id: userId });
                ipcRenderer.once('delete-event-response', (event, data) => {
                    if (data.success) {
                        info.event.remove();
                        visualizarModal.hide();
                    } else {
                        alert('Erro ao excluir evento.');
                    }
                });
            };

            document.getElementById("btnEditEvento").onclick = function() {
                const cadastrarModal = new bootstrap.Modal(document.getElementById("cadastrarModal"));
                cadastrarModal.show();
                visualizarModal.hide();

                document.getElementById("cadastrarTitulo").value = info.event.title;
                document.getElementById("cadastrarInicio").value = converterData(info.event.start);
                document.getElementById("cadastrarFim").value = info.event.end ? converterData(info.event.end) : '';
                document.getElementById("cadastrarDescricao").value = info.event.extendedProps.description;
                document.getElementById("cadastrarCor").value = info.event.color;

                document.getElementById("cadastrarModalLabel").innerText = "Editar Evento";
                document.getElementById("btnCadEvento").style.display = "none";
                document.getElementById("btnSaveEditEvento").style.display = "inline-block";

                document.getElementById("btnSaveEditEvento").onclick = null;

                document.getElementById("btnSaveEditEvento").onclick = function() {
                    const updatedEvent = {
                        id: info.event.id,
                        title: document.getElementById("cadastrarTitulo").value,
                        start_date: document.getElementById("cadastrarInicio").value,
                        end_date: document.getElementById("cadastrarFim").value,
                        description: document.getElementById("cadastrarDescricao").value,
                        color: document.getElementById("cadastrarCor").value,
                        user_id: userId
                    };

                    ipcRenderer.send('edit-event', updatedEvent);
                    ipcRenderer.once('edit-event-response', (event, data) => {
                        if(data.success) {
                            info.event.setProp('title', updatedEvent.title);
                            info.event.setStart(updatedEvent.start_date);
                            info.event.setEnd(updatedEvent.end_date);
                            info.event.setExtendedProp('description', updatedEvent.description);
                            info.event.setProp('color', updatedEvent.color);
                            cadastrarModal.hide();
                            document.getElementById("formCadEvento").reset();
                        } else {
                            alert('Erro ao atualizar evento.');
                        }
                    });
                };
            };
        },
        select: function(info) {
            const cadastrarModal = new bootstrap.Modal(document.getElementById("cadastrarModal"));
            cadastrarModal.show();

            document.getElementById("formCadEvento").reset();

            document.getElementById("cadastrarModalLabel").innerText = "Cadastrar Evento";
            document.getElementById("btnCadEvento").style.display = "inline-block";
            document.getElementById("btnSaveEditEvento").style.display = "none";

            document.getElementById("cadastrarInicio").value = converterData(info.start);
            document.getElementById("cadastrarFim").value = converterData(info.end || info.start);
        },
        events: function(fetchInfo, successCallback, failureCallback) {
            ipcRenderer.send('get-events', userId);
            ipcRenderer.once('get-events-response', (event, data) => {
                if (data.success) {
                    successCallback(data.events.map(event => ({
                        id: event.id,
                        title: event.title,
                        start: event.start_date,
                        end: event.end_date,
                        color: event.color,
                        description: event.description
                    })));
                } else {
                    failureCallback();
                }
            });
        }
    });

    document.getElementById("btnCadEvento").addEventListener('click', function() {
        const newEvent = {
            title: document.getElementById("cadastrarTitulo").value,
            start_date: document.getElementById("cadastrarInicio").value,
            end_date: document.getElementById("cadastrarFim").value,
            description: document.getElementById("cadastrarDescricao").value,
            color: document.getElementById("cadastrarCor").value,
            user_id: userId
        };

        ipcRenderer.send('create-event', newEvent);
        ipcRenderer.once('create-event-response', (event, data) => {
            if (data.success) {
                calendar.addEvent({
                    id: data.id,
                    title: newEvent.title,
                    start: newEvent.start_date,
                    end: newEvent.end_date,
                    color: newEvent.color,
                    description: newEvent.description
                });
                const cadastrarModal = bootstrap.Modal.getInstance(document.getElementById("cadastrarModal"));
                cadastrarModal.hide();
                document.getElementById("formCadEvento").reset();
            } else {
                alert('Erro ao criar evento: ' + data.message);
                document.getElementById("formCadEvento").reset();
            }
        });
    });

    const cadastrarModalElement = document.getElementById('cadastrarModal');
    cadastrarModalElement.addEventListener('hidden.bs.modal', function () {
        document.getElementById("formCadEvento").reset();
    });

    function converterData(data) {
        const dataObj = new Date(data);
        const ano = dataObj.getFullYear();
        const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
        const dia = String(dataObj.getDate()).padStart(2, "0");
        const hora = String(dataObj.getHours()).padStart(2, "0");
        const minuto = String(dataObj.getMinutes()).padStart(2, "0");
        return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
    }

    function formatDatetimeDisplay(data) {
        const dataObj = new Date(data);
        return dataObj.toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
            hour12: false
        });
    }

    calendar.render();
});
