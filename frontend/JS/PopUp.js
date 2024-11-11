document.querySelector("#show-login").addEventListener("click", function(){
    document.querySelector(".popup").classList.add("active");
    document.querySelector('.tudo').style.display = "block"
});

function closePopUp() {
    document.querySelector(".popup").classList.remove("active");
    document.querySelector('body').style.background = "white";
    document.querySelector('.tudo').style.display = "none"
}
document.querySelector(".popup .close-btn").addEventListener("click", function(){
    closePopUp()
});

document.querySelector('.popup button').addEventListener('click', function(e) {
    e.preventDefault()
    const email = document.getElementById('email-recovery').value;
    const data = {email}
    console.log('E-mail inserido:', email);

    fetch('http://localhost:3000/esqueceu_senha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok) {
            alert("Acesse seu e-mail e entre no link enviado")
            return response.json()
        } else {
            alert("e-mail não registrado")
            throw new Error('Falha ao enviar email para recuperação')
        }
    })
    .then(data => {
        console.log("email pra recuperar: " + data)
    })
    .catch(error => {
        console.error('erro: ', error)
        alert('deu pau')
    })
    closePopUp()
  });
  