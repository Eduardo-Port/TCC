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
        <ul>
          <li><img src="../backend/upload/${product.imagem}" width="65" height="65"></li>
          <li><p>${product.nome}</p></li>
        </ul>
      `;
    resultContainer.appendChild(productElement);
  });
}

searchInput.addEventListener("keyup", _.debounce(searchInputKeyUp, 400));
