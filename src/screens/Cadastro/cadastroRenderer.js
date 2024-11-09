const { ipcRenderer } = require('electron');

document.getElementById('form-cadastro').addEventListener('submit', (event) => {
  event.preventDefault(); // Impede o comportamento padrão do formulário

  const username = document.getElementById('nomeUsuario');
  const password = document.getElementById('password');
  const inputs = [username, password];

  // Bloqueia os campos temporariamente
  inputs.forEach(input => input.disabled = true);

  // Envia os dados para o processo principal
  ipcRenderer.send('signup-attempt', {
    username: username.value,
    password: password.value
  });

  // Resposta do processo principal
  ipcRenderer.once('signup-response', (event, response) => {
    inputs.forEach(input => input.disabled = false); // Reativa os campos

    const messageBox = document.getElementById('message-box');
    if (response.success) {
      messageBox.textContent = 'Cadastro realizado com sucesso!';
      messageBox.className = 'success-message';
      setTimeout(() => {
        window.location.href = '../Login/telaLogin.html'; // Redireciona para tela de login
      }, 1000);
    } else {
      messageBox.textContent = `Erro: ${response.message}`;
      messageBox.className = 'error-message';
    }
  });

  // Limpa os campos de input após erro ou sucesso
  ipcRenderer.once('signup-response', () => {
    username.value = '';
    password.value = '';
  });
});
