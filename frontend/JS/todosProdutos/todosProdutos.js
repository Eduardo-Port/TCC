
async function getAllProducts(categoria = null) {
    const mensagemExistente = document.querySelector(".sem-produto");
    if (mensagemExistente) {
        mensagemExistente.remove();
    }
    
    let urlRequest = 'http://localhost:3000/listar_produtos';
    if (categoria) {
        urlRequest = `http://localhost:3000/listar_produtos?categoria=${categoria}`;
    }

    const response = await fetch(urlRequest, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });

    const data = await response.json();
    const section = document.querySelector(".produtos");
    const main = document.querySelector("main");
    if (!Array.isArray(data) || data.length === 0) {
        const p = document.createElement("p");
        p.innerText = "Nenhum produto encontrado. Aqui estão todos os produtos registrados!!";
        p.classList.add("sem-produto");
        main.insertBefore(p, section);
        const allProductsResponse = await fetch('http://localhost:3000/listar_produtos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        const allProducts = await allProductsResponse.json();

        // Renderiza todos os produtos
        allProducts.map((produto) => {
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

            section.appendChild(boxProdutos);
        });
        return;
    }
        
    data.map((produto) => {
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
        let precoFormatado = produto.preco.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        preco.innerText = precoFormatado;
        priceVendido.appendChild(pPromo);
        pPromo.classList.add("promo-m-vendidos");
        const promo = produto.preco + 100;
        const promoFormated = promo.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        const promoReal = promo / 10;
        const promoRealFormated = promoReal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
        pPromo.innerText = `ou ${promoFormated} em 10x de ${promoRealFormated} sem juros`;

        section.appendChild(boxProdutos);
    });
}

initializeDropdown()