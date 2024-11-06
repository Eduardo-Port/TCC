const email = document.getElementById('email')
const password = document.getElementById('password')
const button = document.getElementsByClassName('bota-entrar')

button.addEventListener('click', async () => {
  const formData = {
    nome: nomeInput.value,
    email: emailInput.value
  }
  try {
    // Faz a requisição POST usando fetch
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData) // Converte os dados para JSON
    });

    // Verifica se a resposta foi bem-sucedida
    if (response.ok) {
      const data = await response.json();
      console.log('Resposta do servidor:', data);
      alert('Dados enviados com sucesso!');
    } else {
      console.error('Erro ao enviar dados:', response.statusText);
      alert('Erro ao enviar os dados.');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro ao enviar os dados.');
  }
})