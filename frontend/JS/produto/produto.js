const input = document.getElementById('quantidade')
const produtoVenda = document.querySelector(".produto-venda")
const pagamentoProduto = document.querySelector(".pag-produto")
//função q cria elementos dinamicamente com DOM e faz as interações do frontend
async function getProduct() {
    //pega o id da url
    const urlParams = new URLSearchParams(window.location.search)
    const productId = urlParams.get("pd")
    //passa o id pra url da api
    const url = `http://localhost:3000/exibe_produto/${productId}`
    //chama a api
    const response = await fetch(url)
    console.log(response)
    const data = await response.json()
    //teste de dados da api
    console.log(data)
    console.log(data.produto.nome)
    console.log(data.images[0])

    //começo do DOM - cria nome do produto
    const nameProduct = document.createElement("h1")
    nameProduct.className = "nome-produto"
    nameProduct.innerText = `${data.produto.nome}`
    produtoVenda.appendChild(nameProduct)

    //Cria a img princiapl do produto
    const mainImg = document.createElement("img")
    mainImg.className = "image-produto"
    mainImg.src = `${data.images[0]}`
    mainImg.setAttribute("alt", "Imagem principal do produto")
    produtoVenda.appendChild(mainImg)

    //Cria toda a div que armazena as imagens pequenas do produto
    //nesse arquivo eu fiz diferente do todosProdutos, resolvi criar o elemento, passar suas props e dps dar o appendChild, fiz na ordem do html prévio
    //ficou mt ruim e dei o appendChild só no final
    const wrapOtherImages = document.createElement("div")
    wrapOtherImages.className = "wrap-other-images"

    const smallImage1 = document.createElement("div")
    smallImage1.className = "other-images"

    const smallImg1 = document.createElement("img")
    smallImg1.className = "other-images-real"
    smallImg1.src = `${data.images[0]}`
    smallImg1.alt = "Outras fotos do produto"

    const smallImage2 = document.createElement("div")
    smallImage2.className = "other-images"

    const smallImg2 = document.createElement("img")
    smallImg2.className = "other-images-real"
    smallImg2.src = `${data.images[1]}`
    smallImg2.alt = "Outras fotos do produto"

    const smallImage3 = document.createElement("div")
    smallImage3.className = "other-images"

    const smallImg3 = document.createElement("img")
    smallImg3.className = "other-images-real"
    smallImg2.src = `${data.images[2]}`
    smallImg2.alt = "Outras fotos do produto"

    const smallImage4 = document.createElement("div")
    smallImage4.className = "other-images"

    const smallImg4 = document.createElement("img")
    smallImg4.className = "other-images-real"
    smallImg4.src = `${data.images[3]}`
    smallImg4.alt = "Outras fotos do produto"


    wrapOtherImages.appendChild(smallImage1)
    wrapOtherImages.appendChild(smallImage2)
    wrapOtherImages.appendChild(smallImage3)
    wrapOtherImages.appendChild(smallImage4)
    smallImage1.appendChild(smallImg1)
    smallImage2.appendChild(smallImg2)
    smallImage3.appendChild(smallImg3)
    smallImage4.appendChild(smallImg4)
    produtoVenda.appendChild(wrapOtherImages)

    //Criar dom da parte que mostra preço etc
    const precoParcela = document.createElement('div')
    precoParcela.className = "preco-parcela"

    //criar o elemento do preço do produto
    const preco = document.createElement("h1")
    preco.className = 'preco-produto'
    //formatação de preço pro modelo BR R$ 150,00
    let priceFormated = data.produto.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    //gerando uma parcela (nome ta promo pq percebi q tava errado mt tarde) padrão e formatando
    const promo = data.produto.preco + 100
    const promoFormated = promo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    const promoReal = promo / 10
    const promoRealFormated = promoReal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    preco.innerText = priceFormated
    //criando elemento pra exibir a parcela
    const parcelaProduto = document.createElement('p')
    parcelaProduto.className = "parcela-produto"
    parcelaProduto.innerText = `ou ${promoFormated} em 10x de ${promoRealFormated}`

    precoParcela.appendChild(preco)
    precoParcela.appendChild(parcelaProduto)
    pagamentoProduto.appendChild(precoParcela)

    //fala q o meu elemento precoParcela, filho do pagamentoProduto tem q ser inserido antes de outro filho o button-buy
    pagamentoProduto.insertBefore(precoParcela, pagamentoProduto.querySelector('.button-buy'));

    //info dos produtos
    const infoProduto = document.getElementsByClassName("title-info-product")[0]
    infoProduto.innerText = `${data.produto.nome}`
    const text = document.getElementsByClassName("all-text")[0]
    text.innerText = `${data.produto.ficha}`
    //pegando elementos pra fzr  as trocas de img
    const smallImg = document.querySelectorAll(".other-images-real")
    const bigImg = document.getElementsByClassName("image-produto")[0]
    //func para selecionar a imagem clicada e adicionar a borda
    function selectImage(index) {
        bigImg.src = smallImg[index].src

        // remove a classe de todas as outras imagens e adiciona na clicada
        smallImg.forEach((img, i) => {
            img.className = i === index ? "other-images-select" : "other-images-real"
        });
    }

    // adiciona o evento de clique em cada img
    smallImg.forEach((img, index) => {
        img.onclick = () => selectImage(index)
    });

    // remove a borda qnd clica fora das img
    document.addEventListener("click", (e) => {
        if (!Array.from(smallImg).includes(e.target)) {
            smallImg.forEach(img => img.className = "other-images-real")
        }
    });

    //usuario n pode usar +-.,
    input.addEventListener("keydown", function (event) {
        if (event.key === "-" || event.key === "," || event.key === "+" || event.key === ".") {
            event.preventDefault()
        }
    })
    //usuario n pode digitar mais de 2 digitos
    input.addEventListener('input', (e) => {
        if (input.value.length > 2) {
            input.value = input.value.slice(0, 2) // Limita a entrada a 2 dígitos
        }
    })
}
getProduct()

