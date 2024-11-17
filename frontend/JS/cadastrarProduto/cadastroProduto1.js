const form = document.getElementById('formProdutos')
const preco = document.getElementById('preco_produto')
const url = "http://localhost:3000/cadastra_produto"

preco.addEventListener('input', () => {
    let valor = preco.value;

    // Remove tudo que não for número ou vírgula
    valor = valor.replace(/[^0-9,]/g, '');

    // Divide a parte antes e depois da vírgula (se existir)
    let [parteInteira, parteDecimal] = valor.split(',');

    // Adiciona os pontos de separação de milhar na parte inteira
    parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Reconstrói o valor formatado
    if (parteDecimal !== undefined) {
        valor = `${parteInteira},${parteDecimal.slice(0, 2)}`; // Limita a 2 casas decimais
    } else {
        valor = parteInteira; // Apenas a parte inteira
    }

    preco.value = valor;
})

function formatarValor(valor) {
    // Remove os pontos de milhar
    let valorSemPontos = valor.replace(/\./g, '');
    // Substitui a vírgula por ponto para formato de número
    let valorConvertido = valorSemPontos.replace(',', '.');
    return valorConvertido;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const data = {}
    formData.forEach((value, key) => {
        data[key] = value
    })
    
    if(data["preco"]) {
        data['preco'] = formatarValor(data['preco'])
        console.log('Valor Format', data['preco'])
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    })
    
    if(response.ok) {
        alert('Produto cadastrado com sucesso!! Clique em Ok para cadastrar as imagens deste produto.')
        const data = await response.json()
        console.log('Dados do produto:', data.produto.idProduto);
        //localStorage.setItem('productID', )
        location.href = `./Cadastrar_Produto2.html?qd=${data.produto.idProduto}`
    } else {
        alert('Produo não foi cadastrado')
    }
})  