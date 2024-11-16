const url = "http://localhost:3000/listar_produtos"
let pai = document.querySelector(".produtos")

//function pro produtos mais vendidos
async function getLimitedProducts() {
    const response = await fetch(url);
    console.log("response: ", response);
    const data = await response.json();
    console.log('data: ', data);

    // Limitar a exibição a 4 produtos
    const maxProdutos = 4;
    for (let i = 0; i < Math.min(data.length, maxProdutos); i++) {
        const produto = data[i];

        const boxProdutos = document.createElement("div");
        const linkImg = document.createElement("a");
        const imgProduct = document.createElement("img");
        const ofertaNome = document.createElement("div");
        const spanVendido = document.createElement("span");
        const pOferta = document.createElement("p");
        const nomeProduto = document.createElement("p");
        const priceVendido = document.createElement("div");
        const preco = document.createElement("h1");
        const pPromo = document.createElement("p");

        boxProdutos.appendChild(linkImg);
        linkImg.appendChild(imgProduct);
        boxProdutos.classList.add("box-produtos");
        console.log('imagem: ', produto.imagem);
        imgProduct.setAttribute("src", `../backend/upload/${produto.imagem}`);
        imgProduct.setAttribute("alt", `Imagem do Produto: ${produto.nome}`);
        linkImg.setAttribute("href", `/frontend/Produto.html?pd=${produto.id}`);
        imgProduct.classList.add("imagem");
        imgProduct.setAttribute("width", "323px");
        imgProduct.setAttribute("heigth", "303px");
        boxProdutos.appendChild(ofertaNome);
        ofertaNome.classList.add("text-m-vendidos");
        boxProdutos.appendChild(priceVendido);
        priceVendido.classList.add("price-m-vendidos");

        ofertaNome.appendChild(spanVendido);
        spanVendido.classList.add("span-m-vendido");
        spanVendido.appendChild(pOferta);
        pOferta.classList.add("p-m-vendido");
        pOferta.innerText = "Oferta";
        ofertaNome.appendChild(nomeProduto);
        nomeProduto.classList.add("nome-vendido");
        nomeProduto.innerText = produto.nome;

        priceVendido.appendChild(preco);
        preco.classList.add("price-h1-m-vendidos");
        let precoFormatado = produto.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
        preco.innerText = precoFormatado;
        priceVendido.appendChild(pPromo);
        pPromo.classList.add("promo-m-vendidos");
        const promo = produto.preco + 100;
        const promoFormated = promo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
        const promoReal = promo / 10;
        const promoRealFormated = promoReal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
        pPromo.innerText = `ou ${promoFormated} em 10x de ${promoRealFormated} sem juros`;

        pai.appendChild(boxProdutos);
    }
}
getLimitedProducts()
