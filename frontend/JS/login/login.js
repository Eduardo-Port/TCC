const form = document.getElementById('formLogin')

//autentica usuario 
form.addEventListener('submit', function (event) {
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
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Falha no login')
      }
    })
    .then(data => {
      console.log(data)
      location.href = './Index.html'
    })
    .catch(error => {
      console.error('erro: ', error)
      alert('Ocorreu um erro ao enviar os dados')
    })
})

