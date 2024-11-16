const form = document.getElementById('formCadastro')
const username = document.getElementById("username")
const sobrenome = document.getElementById('surname')
const input = document.getElementById("cpf")
const cep = document.getElementById("cep")
const logradouro = document.getElementById("logradouro")
const bairro = document.getElementById("bairro")
const cidade = document.getElementById("cidade")
const numero = document.getElementById('numero-end')
const complemento = document.getElementById('complemento')
console.log(localStorage.getItem('token'))

input.addEventListener('input', (event) => {
    event.preventDefault()
    let cpf = input.value

    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '')

    // Adiciona os pontos e o hífen na posição correta
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

    input.value = cpf
});

cep.addEventListener('keypress', (event) => {
    let cepLength = cep.value.length
    const key = event.key
    // Impede a digitação de qualquer tecla não numérica
    if (!/^\d$/.test(key) && key !== "Backspace") {
        event.preventDefault()
    }

    // Gerar o - do CEP automaticamente
    if (cepLength === 5) {
        cep.value += '-'
    }
})

cep.addEventListener('focusout', async (event) => {
    let cepValue = cep.value

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`, {
            method: 'GET',
        });
    
        // Verifica se a resposta é bem-sucedida
        if (!response.ok) {
            errorInput(cep, message); // Função personalizada que você está usando
            const errorMessage = await response.text(); // Pega o texto bruto do erro
            throw new Error(`Erro na API: ${errorMessage}`);
        }
    
        const responseCep = await response.json();
    
        // Preenche os valores dos campos do formulário
        logradouro.value = responseCep.logradouro || '';
        bairro.value = responseCep.bairro || '';
        cidade.value = responseCep.localidade || '';
    
    } catch (error) {
        // Trata erros de rede ou falhas no fetch
        console.error("Erro ao buscar o CEP:", error);
    
        // Alerta personalizado se o erro for relacionado ao CEP
        if (error.message.includes('erro')) {
            window.alert('Erro ao buscar o CEP. Por favor, tente novamente.');
        }
    }
    
});

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(form);
    const data = {}
    formData.forEach((value, key) => {
        data[key] = value
    });

    if (data["cpf"]) {
        data["cpf"] = data["cpf"].replace(/[.-]/g, "")
    }

    if (data["cep"]) {
        data["cep"] = data["cep"].replace(/[-]/g, "")
    }

    const isFormValid = checkForm()

    if (!isFormValid) {
        return
    }
    console.log('passou do valido')
    fetch('http://localhost:3000/atualizar_dados', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                console.log(data)
                location.href = './Login.html'
            } else {
                //Reseta o formulário em caso de erro
                alert('error')
                form.reset()
            }
        })
        .catch(error => {
            console.error('Erro:', error)
            form.reset()
        })
})

function checkForm() {
    let isFormValid = true

    if (!validaCPF(input)) {
        isFormValid = false
    }
    return isFormValid
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
        errorInput(cp, 'O CPF precisa ter 11 caracteres')
        return false
    }

    const proximoDigitoVerificador = (cpfIncompleto) => {
        let somatoria = 0

        for (let i = 0; i < cpfIncompleto.length; i++) { // Correção na condição do loop
            let digitoAtual = cpfIncompleto.charAt(i)
            let constante = (cpfIncompleto.length + 1 - i)
            somatoria += Number(digitoAtual) * constante
        }

        const resto = somatoria % 11
        return resto < 2 ? "0" : (11 - resto).toString()
    };

    let primeiroDigitoVerificador = proximoDigitoVerificador(cpf.substring(0, 9))
    let segundoDigitoVerificador = proximoDigitoVerificador(cpf.substring(0, 9) + primeiroDigitoVerificador)

    let cpfCorreto = cpf.substring(0, 9) + primeiroDigitoVerificador + segundoDigitoVerificador

    if (cpf !== cpfCorreto) {
        errorInput(cpf, "CPF Inválido")
        return false
    }
    cpf.className = "form-content"
    return true
}
