const { ipcRenderer } = require('electron');

document.getElementById('form-cadastro').addEventListener('submit', (event) => {
  event.preventDefault(); // Impede o envio padrão do formulário

  const username = document.getElementById('nomeUsuario').value;
  const password = document.getElementById('password').value;

  const inputs = document.querySelectorAll('input');

  // Desabilitar os campos temporariamente durante o envio
  inputs.forEach(input => input.disabled = true);

  // Enviar dados para o processo principal para cadastro
  ipcRenderer.send('signup-attempt', { username, password });

  // Garantir que os campos serão reativados após resposta
  ipcRenderer.once('signup-response', (event, response) => {
    inputs.forEach(input => input.disabled = false); // Reativar campos

    const messageBox = document.getElementById('message-box');
    if (response.success) {
      alert('Cadastro realizado com sucesso! Redirecionando para a home...');
      window.location.href = '../Home/telaHome.html';
    } else {
      messageBox.textContent = `Erro: ${response.message}`;
      messageBox.className = 'error-message';
    }
  });
});
