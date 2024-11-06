const { ipcRenderer } = require('electron');

document.getElementById('form-cadastro').addEventListener('submit', (event) => {
  event.preventDefault(); // Impede o comportamento padrão de envio do formulário

  const username = document.getElementById('nomeUsuario').value;
  const password = document.getElementById('password').value;

  // Enviar dados para o processo principal para cadastro
  ipcRenderer.send('signup-attempt', { username, password });
});

// Receber a resposta do processo principal
ipcRenderer.on('signup-response', (event, response) => {
  if (response.success) {
    alert('Cadastro realizado com sucesso! Redirecionando para a home...');
    window.location.href = '../Home/telaHome.html'; // Redireciona para a tela home
  } else {
    alert(`Erro no cadastro: ${response.message}`);
  }
});
