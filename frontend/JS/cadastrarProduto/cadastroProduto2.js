const uploadButton = document.getElementById('button');
const fileInput = document.getElementsByClassName('picture__input')[0];
const fileInput1 = document.getElementById('input1');
const fileInput2 = document.getElementById('input2');
const fileInput3 = document.getElementById('input3');

uploadButton.addEventListener('click', async (e) => {
    const urlParams = new URLSearchParams(window.location.search)
    const productId = urlParams.get("qd")
    const url = `http://localhost:3000/cadastra_produto/${productId}/upload`
    // Previne o comportamento padrão (se for necessário)
    e.preventDefault();

    // Cria um FormData para enviar os arquivos
    const formData = new FormData();

    // Verifica se cada input contém um arquivo e adiciona ao FormData
    if (fileInput.files[0]) formData.append('file', fileInput.files[0]);
    if (fileInput1.files[0]) formData.append('file', fileInput1.files[0]);
    if (fileInput2.files[0]) formData.append('file', fileInput2.files[0]);
    if (fileInput3.files[0]) formData.append('file', fileInput3.files[0]);


    try {
        // Envia a requisição POST com os arquivos
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        const data = await response.json();
        console.log('Resposta do servidor:', data);
        if(response.ok) {
            location.href = './Gerenciar_Produtos.html'
        }
    } catch (error) {
        console.error('Erro ao enviar os arquivos:', error);
    }
});