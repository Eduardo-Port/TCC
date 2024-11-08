const form = document.getElementById('formLogin')

form.addEventListener('submit', function(event) {
  event.preventDefault()

  const formdata = new FormData(form)
  const data = {}

  formdata.forEach((value, key) => {
    data[key] = value
  })

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('RESPOSTA')
    window.location.href = '../Index.html'
  })
  .catch(error => {
    console.error('erro: ', error)
    alert('Ocorreu um erro ao enviar os dados')
  })
})