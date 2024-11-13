const dropdowns = document.querySelectorAll('.dropdown')
dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select')
    const caret = dropdown.querySelector('.caret')
    const menu = dropdown.querySelector('.menu')
    const options = dropdown.querySelectorAll('.menu li')
    const selected = dropdown.querySelector('.selected')

    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked')
        caret.classList.toggle('caret-rotate')
        menu.classList.toggle('menu-open')
    })

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText
            select.classList.remove('select-clicked')
            caret.classList.remove('caret-rotate')
            menu.classList.remove('menu-open')

            options.forEach(option => {
                option.classList.remove('active')
            })

            option.classList.add('active')
        })
    })
})

const url = "http://localhost:3000/listar_produtos"

async function getAllProducts() {
    const response = await fetch(url)
    console.log("response: ", response)
    const data = await response.json()      
    console.log('data: ', data)

    data.map((produto) => {
        const boxProdutos = document.createElement("div")
        const imgProduct = document.createElement("img")
        const ofertaNome = document.createElement("div")
        const spanVendido = document.createElement("span")
        const pOferta = document.createElement("p")
        const nomeProduto = document.createElement("p")
        const priceVendido = document.createElement("div")
        const preco = document.createElement("h1")
        const pPromo = document.createElement("p")

        boxProdutos.appendChild(imgProduct)
        boxProdutos.classList.add("box-produtos")
        imgProduct.setAttribute("src", `/produto.html?id=${produto.id}`)
        imgProduct.setAttribute("alt", `Imagem do Produto: ${produto.nome}`)
        imgProduct.classList.add("imagem")
        boxProdutos.appendChild(ofertaNome)
        ofertaNome.classList.add("text-m-vendidos")
        boxProdutos.appendChild(priceVendido)
        priceVendido.classList.add("price-m-vendidos")

        ofertaNome.appendChild(spanVendido)
        spanVendido.classList.add("span-m-vendido")
        spanVendido.appendChild(pOferta)
        pOferta.classList.add("p-m-vendido")
        pOferta.innerText = "Oferta"
        ofertaNome.appendChild(nomeProduto)
        nomeProduto.classList.add("nome-vendido")
        nomeProduto.innerText = produto.nome

        priceVendido.appendChild(preco)
        preco.classList.add("price-h1-m-vendidos")
        preco.innerText = produto.preco
        priceVendido.appendChild(pPromo)
        pPromo.classList.add("promo-m-vendidos")
        const promo = produto.preco + 100
        const promoReal = promo / 10
        pPromo.innerText = `ou R$${promo} em 10x de R$${promoReal} sem juros`
    })
}

getAllProducts()