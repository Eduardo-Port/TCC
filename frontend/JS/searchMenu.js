const url = "http://localhost:3000/listar_produtos"
const searchInput = document.getElementById("searchInput")

function searchInKeyUp() {

}

function productsFilterInsert(searched) {
    return productsFilterInsert(searched)
}
searchInput.addEventListener('keyup', _.debounce(searchInKeyUp, 400))

async function getAllProductsInput() {
    const response = await fetch(url)
    
}
getAllProductsInput()