const form = document.getElementById('meuFormulario');


fetch('http://localhost:3000/registrar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome: 'João', idade: 25 })
  })
    .then(response => response.json())
    .then(data => console.log('Resposta:', data))
    .catch(error => console.error('Erro:', error));