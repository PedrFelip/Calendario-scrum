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
        navLinks: true,
        selectable: true,
        editable: true,
        eventClick: function(info) {
            // Mostra o modal de visualização com os detalhes do evento
            const visualizarModal = new bootstrap.Modal(document.getElementById("visualizarModal"));
            visualizarModal.show();

            document.getElementById("visualizarTitulo").innerText = info.event.title;
            document.getElementById("visualizarInicio").innerText = info.event.start.toLocaleString();
            document.getElementById("visualizarFim").innerText = info.event.end ? info.event.end.toLocaleString() : 'N/A';
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
                // Preenche o formulário com os dados do evento para edição
                document.getElementById("cadastrarTitulo").value = info.event.title;
                document.getElementById("cadastrarInicio").value = info.event.start.toISOString().slice(0, 16);
                document.getElementById("cadastrarFim").value = info.event.end ? info.event.end.toISOString().slice(0, 16) : '';
                document.getElementById("cadastrarDescricao").value = info.event.extendedProps.description;
                document.getElementById("cadastrarCor").value = info.event.backgroundColor;

                // Salva o evento editado
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
                              info.event.setProp('backgroundColor', updatedEvent.color);
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

            document.getElementById("cadastrarInicio").value = info.startStr;
            document.getElementById("cadastrarFim").value = info.endStr;

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
                              backgroundColor: newEvent.color,
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
                            backgroundColor: event.color,
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

    calendar.render();
});
