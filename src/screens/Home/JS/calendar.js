document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const userId = localStorage.getItem('user_id'); // Obtém o user_id do localStorage

    if (!userId) {
        console.error('ID do usuário não encontrado. Redirecionando para login...');
        window.location.href = '../Login/telaLogin.html';
        return;
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: 'bootstrap5',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
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

        eventClick: function(info) {
            const visualizarModal = new bootstrap.Modal(document.getElementById("visualizarModal"));
            visualizarModal.show();

            document.getElementById("visualizarTitulo").innerText = info.event.title;
            document.getElementById("visualizarInicio").innerText = formatDatetimeDisplay(info.event.start);
            document.getElementById("visualizarFim").innerText = info.event.end ? formatDatetimeDisplay(info.event.end) : 'N/A';
            document.getElementById("visualizarDescricao").innerText = info.event.extendedProps.description;

            document.getElementById("btnDeleteEvento").onclick = function() {
                fetch(`http://localhost:3000/api/events/${info.event.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_id: userId })
                }).then(response => response.json())
                  .then(data => {
                      if (data.success) {
                          info.event.remove();
                          visualizarModal.hide();
                      } else {
                          alert('Erro ao excluir evento.');
                      }
                  }).catch(err => console.error(err));
            };

            document.getElementById("btnEditEvento").onclick = function() {
                document.getElementById("cadastrarTitulo").value = info.event.title;
                document.getElementById("cadastrarInicio").value = converterData(info.event.start);
                document.getElementById("cadastrarFim").value = info.event.end ? converterData(info.event.end) : '';
                document.getElementById("cadastrarDescricao").value = info.event.extendedProps.description;
                document.getElementById("cadastrarCor").value = info.event.color;

                document.getElementById("btnSaveEditEvento").onclick = function() {
                    const updatedEvent = {
                        title: document.getElementById("cadastrarTitulo").value,
                        start_date: document.getElementById("cadastrarInicio").value,
                        end_date: document.getElementById("cadastrarFim").value,
                        description: document.getElementById("cadastrarDescricao").value,
                        color: document.getElementById("cadastrarCor").value,
                        user_id: userId
                    };

                    fetch(`http://localhost:3000/api/events/${info.event.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedEvent)
                    }).then(response => response.json())
                      .then(data => {
                          if (data.success) {
                              info.event.setProp('title', updatedEvent.title);
                              info.event.setDates(updatedEvent.start_date, updatedEvent.end_date);
                              info.event.setExtendedProp('description', updatedEvent.description);
                              info.event.setProp('color', updatedEvent.color);
                              visualizarModal.hide();
                          } else {
                              alert('Erro ao atualizar evento.');
                          }
                      }).catch(err => console.error(err));
                };
            };
        },
        select: function(info) {
            const cadastrarModal = new bootstrap.Modal(document.getElementById("cadastrarModal"));
            cadastrarModal.show();

            document.getElementById("cadastrarInicio").value = converterData(info.start);
            document.getElementById("cadastrarFim").value = converterData(info.end || info.start);

            document.getElementById("btnCadEvento").onclick = function() {
                const newEvent = {
                    title: document.getElementById("cadastrarTitulo").value,
                    start_date: document.getElementById("cadastrarInicio").value,
                    end_date: document.getElementById("cadastrarFim").value,
                    description: document.getElementById("cadastrarDescricao").value,
                    color: document.getElementById("cadastrarCor").value,
                    user_id: userId
                };

                fetch('http://localhost:3000/api/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newEvent)
                }).then(response => response.json())
                  .then(data => {
                      if (data.success) {
                          calendar.addEvent({
                              id: data.id,
                              title: newEvent.title,
                              start: newEvent.start_date,
                              end: newEvent.end_date,
                              color: newEvent.color,
                              description: newEvent.description
                          });
                          cadastrarModal.hide();
                      } else {
                          alert('Erro ao criar evento.');
                      }
                  }).catch(err => console.error(err));
            };
        },
        events: function(fetchInfo, successCallback, failureCallback) {
            fetch(`http://localhost:3000/api/events/${userId}`)
                .then(response => response.json())
                .then(data => {
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
                }).catch(err => {
                    console.error('Erro ao carregar eventos:', err);
                    failureCallback();
                });
        }
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
    calendar.render();

});
