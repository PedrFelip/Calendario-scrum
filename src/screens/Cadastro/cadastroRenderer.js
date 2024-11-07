const { ipcRenderer } = require('electron');

document.getElementById('form-cadastro').addEventListener('submit', (event) => {
  event.preventDefault(); // Impede o comportamento padrão do formulário

  const username = document.getElementById('nomeUsuario');
  const password = document.getElementById('password');
  const inputs = [username, password];

  // Bloqueia os campos temporariamente
  inputs.forEach(input => input.disabled = true);

  ipcRenderer.send('signup-attempt', {
    username: username.value,
    password: password.value
  });

  ipcRenderer.once('signup-response', (event, response) => {
    inputs.forEach(input => input.disabled = false); // Reativa os campos

    const messageBox = document.getElementById('message-box');
    if (response.success) {
      messageBox.textContent = 'Cadastro realizado com sucesso!';
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
