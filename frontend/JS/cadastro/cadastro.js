const form = document.getElementById('formCadastro');

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(form)
  const data = {}
  formData.forEach((value, key) => {
    data[key] = value
  })

  fetch('http://localhost:3000/registrar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
        // Se a resposta for bem-sucedida, redireciona para a próxima página
        location.href = './Login.html';  // Substitua pelo caminho desejado
    })
    .catch(error => console.error('Erro:', error));
})

