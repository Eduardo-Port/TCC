const btn = document.getElementById('button-alter')
//recupera a senha
btn.addEventListener('click', (event) => {
    event.preventDefault()
    const newPassword = document.getElementById('pass').value
    const confirmPassword = document.getElementById('last').value
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('tk')

    const data = { token, newPassword, confirmPassword }

    fetch('http://localhost:3000/nova_senha', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                alert('SENHA ALTERADA')
                return response.json()
            } else {
                response.text().then(text => alert(text))
            }
        })
        .then(data => {
            console.log(data)
            location.href = './Login.html'
        })
        .catch(error => {
            console.log(error.message)
        })
})