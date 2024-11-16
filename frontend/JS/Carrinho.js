const carrinhoLateral = document.getElementById("carrinho-lateral")
const carrinhoReal = document.querySelector('.carrinho-toggler')


carrinhoReal.addEventListener('click', () => {
    carrinhoLateral.className = "carrinho-legal show"
});

console.log(localStorage.getItem('token'))


window.addEventListener('click', (e) => {
    if (e.target.id !== 'carrinho-lateral' && e.target.className !== 'carrinho-toggler') {
        carrinhoLateral.classList.remove('show')
    }
});