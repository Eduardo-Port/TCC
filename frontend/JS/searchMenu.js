const urlApi = "http://localhost:3000/listar_produtos";
/* Troquei para urlApi pois tava dando erro de duplicação (?) */
const searchInput = document.getElementById("searchInput");
const resultContainer = document.querySelector(".buscar-produto");

async function getAllProducts() {
  try {
    const response = await fetch(urlApi);
    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }
    const data = await response.json();
    console.log("Produtos carregados:", data);
    return data;
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    return [];
  }
}

async function searchInputKeyUp() {
  const query = searchInput.value.toLowerCase().trim();
  const allProducts = await getAllProducts();

  if (!Array.isArray(allProducts)) {
    console.error('Dados recebidos não são um array:', allProducts);
    return;
  }
  
  const filteredProducts = allProducts.filter((product) =>
    product.nome.toLowerCase().includes(query)
  );

  updateSearchResults(filteredProducts, query);
}

function updateSearchResults(products, query) {
  resultContainer.innerHTML = "";

  // Verifica se a busca está vazia ou se não há produtos filtrados
  if (query === "" || products.length === 0) {
    resultContainer.classList.remove("active");
    return;
  }

  resultContainer.classList.add("active");

  products.forEach((product) => {
    const productElement = document.createElement("li");
    productElement.innerHTML = `  
        <ul class ="list-search">
            <a href="produto.html?pd=${product.id}" id="link-search">
              <div id=wrap-search>
                <li class="imagem-search"><img src="../backend/upload/${product.imagem}" width="65" height="65"></li>
                <li><p id = "nome-search">${product.nome}</p></li>
              </div>
            </a>
        </ul>
      `;
    resultContainer.appendChild(productElement);
  });
}

window.addEventListener('click', (e) => {
  // Pega os elementos que queremos verificar
  const searchBox = document.querySelector('.browser-container');
  const searchResults = document.querySelector('.buscar-produto');
  
  // Verifica se o clique foi fora tanto da caixa de busca quanto dos resultados
  if (!searchBox.contains(e.target) && !searchResults.contains(e.target)) {
      resultContainer.classList.remove('active');
  }
});

searchInput.addEventListener("keyup", _.debounce(searchInputKeyUp, 400));
