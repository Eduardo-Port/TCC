async function getDadosCliente() {
    //recebe variaveis pra manipular com DOM dps
    const logradouro = document.getElementById('log')
    const numero = document.getElementById('num')
    const complemento = document.getElementById('compl')
    const bairro = document.getElementById('bairro')
    const cep = document.getElementById('cep')
    const nome = document.getElementById('name')
    const cpf = document.getElementById('cpf')
    const email = document.getElementById('email')

    //recebe o token do usuario
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:3000/minha_conta', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos:', data);

        //preenche os dados do usuário usando DOM
        logradouro.innerText += ` ${data.logradouro}`
        numero.innerText += ` ${data.numero}` 
        if(data.complemento){
            complemento.innerText += ` ${data.complemento}` 
        }
        else {
            complemento.innerText += " Não possui"
        }
        
        bairro.innerText += ` ${data.bairro}` 
        cep.innerText += ` ${data.cep}` 
        nome.innerText += ` ${data.nome}` + ` ${data.sobrenome}` 
        const cpfFormated = data.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        cpf.innerText += ` ${cpfFormated}`
        email.innerText += ` ${data.email}`

    } else {
        console.error('Erro ao buscar dados:', response.status);
    }

}

console.log(localStorage.getItem('token'))

getDadosCliente();

function customConfirm(message) {
    return new Promise((resolve) => {
        const confirmBox = document.getElementById('custom-confirm');
        const confirmMessage = document.getElementById('confirm-message');
        const confirmYes = document.getElementById('confirm-yes');
        const confirmNo = document.getElementById('confirm-no');

        confirmMessage.textContent = message;
        confirmBox.classList.remove('hidden');

        const closeModal = (result) => {
            confirmBox.classList.add('hidden');
            resolve(result);
        };

        confirmYes.onclick = () => closeModal(true);
        confirmNo.onclick = () => closeModal(false);
    });
}

// Excluir conta
const excluirButton = document.getElementById("excluir");
const urlDel = "http://localhost:3000/deletar_conta";

excluirButton.addEventListener('click', async (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();

    // Exibe o modal de confirmação
    const userConfirmed = await customConfirm('Você tem certeza que deseja excluir sua conta?');
    if (!userConfirmed) {
        console.log('Usuário cancelou!');
        return; // Cancela o restante da função
    }

    console.log('Usuário confirmou!');

    try {
        // Faz a requisição DELETE apenas se confirmado
        const response = await fetch(urlDel, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            console.log('Conta excluída com sucesso!');
            location.href = "./Login.html"
        } else {
            console.error('Erro ao excluir conta:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao excluir conta:', error.message);
    }
});

