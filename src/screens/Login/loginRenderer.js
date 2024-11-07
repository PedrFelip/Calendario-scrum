const { ipcRenderer } = require('electron');

document.getElementById('form-login').addEventListener('submit', (event) => {
  event.preventDefault(); // Evita o comportamento padrão de envio do formulário

  const username = document.getElementById('login-username');
  const password = document.getElementById('login-password');
  const inputs = [username, password];

  // Bloqueia os campos temporariamente
  inputs.forEach(input => input.disabled = true);

  // Enviar tentativa de login
  ipcRenderer.send('login-attempt', {
    username: username.value,
    password: password.value
  });

  // Receber a resposta do processo principal
  ipcRenderer.once('login-response', (event, response) => {
    inputs.forEach(input => input.disabled = false); // Reativa os campos

    const messageBox = document.getElementById('message-box');
    if (response.success) {
      messageBox.textContent = 'Login realizado com sucesso!';
      messageBox.className = 'success-message';
      setTimeout(() => {
        window.location.href = '../Home/telaHome.html'; // Redireciona em caso de sucesso
      }, 1000);
    } else {
      messageBox.textContent = `Erro: ${response.message}`;
      messageBox.className = 'error-message';
    }
  });
});
