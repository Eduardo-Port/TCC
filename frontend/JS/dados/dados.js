async function getDadosClientes() {
    const token = localStorage.getItem('token'); // Recupera o token do localStorage

    const response = await fetch('http://localhost:3000/sua_rota_protegida', {
        method: 'GET', // ou 'POST', dependendo do tipo de requisição
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Adiciona o token como Bearer
        }
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos:', data);
    } else {
        console.error('Erro ao buscar dados:', response.status);
    }
}

console.log(localStorage.getItem('token'))
getDataCliente()