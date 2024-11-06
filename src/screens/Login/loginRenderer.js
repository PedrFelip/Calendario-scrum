const { ipcRenderer } = require('electron');

document.getElementById('form-login').addEventListener('submit', (event) => {
  event.preventDefault(); // Impede o comportamento padrão de envio do formulário

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  // Enviar dados para o processo principal para login
  ipcRenderer.send('login-attempt', { username, password });
});

// Receber a resposta do processo principal
ipcRenderer.on('login-response', (event, response) => {
  if (response.success) {
    alert('Login realizado com sucesso! Redirecionando para a home...');
    window.location.href = '../Home/telaHome.html'; // Redireciona para a tela home
  } else {
    alert(`Erro no login: ${response.message}`);
  }
});
