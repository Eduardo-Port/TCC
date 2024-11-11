
const form = document.getElementById("form");
const username = document.getElementById("username")
const email = document.getElementById("email")
const password = document.getElementById("password")
const passwordConfirmation = document.getElementById("password-confirmation");


form.addEventListener("submit", (event) => {
    event.preventDefault();

    checkForm();
})

email.addEventListener("blur", () => {
    checkInputEmail();
})


username.addEventListener("blur", () => {
    checkInputUsername();
})

function checkInputUsername() {
    const usernameValue = username.value;

    if (usernameValue === "") {
        errorInput(username, "Preencha um username!")
    } else {
        const formItem = username.parentElement;
        formItem.className = "form-content"
    }

}

function checkInputEmail() {
    const emailValue = email.value;
    if (emailValue === "") {
        errorInput(email, "O email é obrigatório.")
    } else if(!emailValue.includes == '@'){
        errorInput(email, "O email deve ter @, siga o formato: usuario@dominio.com")
    } else {
        const formItem = email.parentElement;
        formItem.className = "form-content"
    }
}


function checkInputPassword() {
    const passwordValue = password.value;
    const temNum = /^(?=.*\d)/
    const tem8 = /^[A-Za-z\d@#$%^&*!]{8,}$/
    const temMaiscula = /^(?=.*[A-Z])/
    const temMinuscula = /^(?=.*[a-z])/
    if (passwordValue === "") {
        errorInput(password, "A senha é obrigatória.")
    } else if (passwordValue.length < 8) {
        errorInput(password, "A senha precisa ter no mínimo 8 caracteres.")
    } else if(!temNum.test(password)) {
        errorInput(password, "A senha deve conter pelo menos um número")
    } else if(!tem8.test(password)) {
        errorInput(password, "A senha deve conter pelo menos 8 digitos")
    } else if(!temMaiscula.test(password)) {
        errorInput(password, "A senha deve conter pelo menos um caractere maiúsculo")
    } else if(!temMinuscula.test(password)) {
        errorInput(password, "A senha deve conter pelo menos um caractere minúsculo")
    } else {
        const formItem = password.parentElement;
        formItem.className = "form-content"
    }
}


function checkInputPasswordConfirmation() {
    const passwordValue = password.value;
    const confirmationPasswordValue = passwordConfirmation.value;

    if (confirmationPasswordValue === "") {
        errorInput(passwordConfirmation, "A confirmação de senha é obrigatória.")
    } else if (confirmationPasswordValue !== passwordValue) {
        errorInput(passwordConfirmation, "As senhas não são iguais.")
    } else{
        const formItem = passwordConfirmation.parentElement;
        formItem.className = "form-content"
    }
}


function checkForm() {
    checkInputUsername();
    checkInputEmail();
    checkInputPassword();
    checkInputPasswordConfirmation();

    const formItems = form.querySelectorAll(".form-content")

    const isValid = [...formItems].every((item) => {
        return item.className === "form-content"
    });

    if (isValid) {
        alert("CADASTRADO COM SUCESSO!")
    }

}


function errorInput(input, message) {
    const formItem = input.parentElement;
    const textMessage = formItem.querySelector("a")

    textMessage.innerText = message;

    formItem.className = "form-content error"

}