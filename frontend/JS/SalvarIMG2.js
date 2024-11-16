// Função para criar os previews para os arquivos selecionados em qualquer input
function handleImagePreview(inputElement, previewContainer) {
    // Ouve o evento de mudança no input de arquivos
    inputElement.addEventListener('change', function(event) {
        const files = event.target.files;  // Obtém os arquivos selecionados
        previewContainer.innerHTML = '';   // Limpa os previews anteriores

        // Itera sobre os arquivos e gera os previews
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            // Quando a imagem for carregada, cria o preview
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('preview');
                previewContainer.appendChild(img);
            };

            // Lê o arquivo como uma URL de dados (data URL)
            reader.readAsDataURL(file);
        }
    });
}

// Inicializa o preview para os diferentes inputs
document.addEventListener('DOMContentLoaded', function() {
    // Para o input1
    const input1 = document.getElementById('input1');
    const preview1 = document.getElementById('preview1');
    handleImagePreview(input1, preview1);

    // Para o input2
    const input2 = document.getElementById('input2');
    const preview2 = document.getElementById('preview2');
    handleImagePreview(input2, preview2);

    // Para o input3
    const input3 = document.getElementById('input3');
    const preview3 = document.getElementById('preview3');
    handleImagePreview(input3, preview3);
    
    // Para o input3
    const input4 = document.getElementById('input4');
    const preview4 = document.getElementById('preview4');
    handleImagePreview(input4, preview4);
});
