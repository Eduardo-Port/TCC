const url = `http://localhost:3000/listar_produtos`
const section = document.querySelector('#wrap-flex')

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

async function getManageProduct() {
    const response = await fetch(url)
    console.log('response: ', response)
    const data = await response.json()
    console.log('data: ', data)
    //vai passar em cada produto pra criar os elementos na pagina
    data.map((produto) => {
        const wrap = document.createElement("div");
        wrap.className = "flex";
        wrap.dataset.idProduto = produto.id; // Associar o ID do produto ao elemento pai

        const linkImg = document.createElement("a");
        linkImg.setAttribute("href", `/frontend/Produto.html?pd=${produto.id}`);
        wrap.appendChild(linkImg);

        const imgProduct = document.createElement("img");
        imgProduct.setAttribute("src", `../backend/upload/${produto.imagem}`);
        imgProduct.className = "image-manage-product";

        
        const divColumn = document.createElement('div');
        divColumn.className = "column";
        
        const divName = document.createElement('div');
        divName.className = "nome";
        const pName = document.createElement("p");
        pName.innerText = `${produto.nome}`;
        divName.appendChild(pName);
        
        const divPrice = document.createElement("div");
        divPrice.className = "preco";
        const pPrice = document.createElement("p");
        
        const priceFormated = produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        pPrice.innerText = `${priceFormated}`;
        
        
        divPrice.appendChild(pPrice);
        
        const divLixeira = document.createElement("div");
        divLixeira.className = "lixeira-icon";
        const btnLixeira = document.createElement("button");
        btnLixeira.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#004AAD" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
        </svg>`;
        divLixeira.appendChild(btnLixeira);
        
        // Adiciona evento ao botão
        btnLixeira.addEventListener("click", async () => {
            const id = produto.id; // Pegue o ID do produto
            const categoria = produto.categoria
            const userConfirmed = await customConfirm('Você tem certeza que deseja excluir este produto?');
            if (!userConfirmed) {
                console.log('Usuário cancelou!');
                return; // Cancela o restante da função
            }
            const data = {
                id,
                categoria
            }
            
            try {
                // Chama a API para desativar o produto
                const response = await fetch(`http://localhost:3000/inativar_produto`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    wrap.remove();
                    console.log(`Produto ${id} removido com sucesso.`);
                } else {
                    console.error(`Erro ao remover o produto ${id}.`);
                }
            } catch (error) {
                console.error("Erro ao chamar a API de desativação:", error);
            }
        });
        
        // Monta o wrap
        wrap.appendChild(imgProduct);
        linkImg.appendChild(imgProduct);
        wrap.appendChild(divColumn);
        wrap.appendChild(divLixeira);
        
        divColumn.appendChild(divName);
        divColumn.appendChild(divPrice);
        
        section.appendChild(wrap);
    });
    
}

getManageProduct()

