const form = document.getElementById('formCadastro');
const username = document.getElementById("username")
const email = document.getElementById("email")
const password = document.getElementById("password")
const passwordConfirmation = document.getElementById("password-confirmation");
const input = document.getElementById("cpf")
const cep = document.getElementById("cep")
const logradouro = document.getElementById("logradouro")
const bairro = document.getElementById("bairro")
const cidade = document.getElementById("cidade")

input.addEventListener('input', (event) => {
  event.preventDefault()
  let cpf = input.value;

  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  // Adiciona os pontos e o hífen na posição correta
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  input.value = cpf;
});

cep.addEventListener('keypress', (event) => {
  let cepLength = cep.value.length
  const key = event.key;
  if (!/^\d$/.test(key) && key !== "Backspace") {
    event.preventDefault(); // Impede a digitação de qualquer tecla não numérica
  }

  // Permitir apenas teclas de números e backspace (para apagar)
  if(cepLength === 5) {
    cep.value += '-'
  }
})

cep.addEventListener('focusout', async (event) => {
  let cepValue = cep.value

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
    if (!response.ok) {
        throw await response.json()
    }

    const responseCep = await response.json()

    logradouro.value = responseCep.logradouro
    bairro.value = responseCep.bairro
    cidade.value = responseCep.localidade

} catch (error) {
    if (error?.error_cep) {
        window.alert = ('error.error_cep')
        setTimeout(() => {
            window.alert = ''
        }, 5000)
    }
    console.log(error);
}
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  
  if (data["cpf"]) {
    data["cpf"] = data["cpf"].replace(/[.-]/g, "");
  }
  
  if (data["cep"]) {
    data["cep"] = data["cep"].replace(/[-]/g, "");
  }

  const isFormValid = checkForm();
  
  if (!isFormValid) {
    return; 
  }
  console.log('passou do valido')
  fetch('http://localhost:3000/registrar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data) {
        location.href = './Login.html';
      } else {
        alert('error');
        form.reset(); // Reseta o formulário em caso de erro
      }
    })
    .catch(error => {
      console.error('Erro:', error);
      form.reset(); // Reseta o formulário em caso de erro
    });
});

function checkInputPassword() {
  const passwordValue = password.value;
  const temNum = /^(?=.*\d)/
  if (passwordValue === "") {
    errorInput(password, "A senha é obrigatória.")
    return false
  } else if (passwordValue.length < 8) {
    errorInput(password, "A senha precisa ter no mínimo 8 caracteres.")
    return false
  } else if (temNum.test(password)) {
    errorInput(password, "A senha deve conter pelo menos um número")
    return false
  } else {
    passwordConfirmation.className = "form-content"
    password.className = "form-content"
    return true
  }
}

function checkInputPasswordConfirmation() {
  const passwordValue = password.value;
  const confirmationPasswordValue = passwordConfirmation.value;

  if (confirmationPasswordValue === "") {
    errorInput(passwordConfirmation, "A confirmação de senha é obrigatória.")
    return false
  } else if (confirmationPasswordValue !== passwordValue) {
    errorInput(passwordConfirmation, "As senhas não são iguais.")
    return false
  } else {
    password.className = "form-content"
    passwordConfirmation.className = "form-content"
    return true
  }
}

function checkForm() {
  let isFormValid = true;

  if (!checkInputPassword()) {
    isFormValid = false;
  }
  if (!checkInputPasswordConfirmation()) {
    isFormValid = false;
  }
  if (!validaCPF(input)) {
    isFormValid = false;
  }
  return isFormValid;
}

function errorInput(input, message) {
  input.className = "form-content-erro"
  input.value = ""
  alert(message);
}

function validaCPF(cp) {
  let cpf = cp.value
  cpf = cpf.replace(/[.-]/g, "")
  if (cpf.length !== 11) {
    errorInput(cp, 'O CPF precisa ter 11 caracteres');
    return false;
  }

  const proximoDigitoVerificador = (cpfIncompleto) => {
    let somatoria = 0;

    for (let i = 0; i < cpfIncompleto.length; i++) { // Correção na condição do loop
      let digitoAtual = cpfIncompleto.charAt(i);
      let constante = (cpfIncompleto.length + 1 - i);
      somatoria += Number(digitoAtual) * constante;
    }

    const resto = somatoria % 11;
    return resto < 2 ? "0" : (11 - resto).toString();
  };

  let primeiroDigitoVerificador = proximoDigitoVerificador(cpf.substring(0, 9));
  let segundoDigitoVerificador = proximoDigitoVerificador(cpf.substring(0, 9) + primeiroDigitoVerificador);

  let cpfCorreto = cpf.substring(0, 9) + primeiroDigitoVerificador + segundoDigitoVerificador;

  if (cpf !== cpfCorreto) {
    errorInput(cpf, "CPF Inválido");
    return false;
  }
  cpf.className = "form-content"
  return true;
}
