// Função para criar os previews para os arquivos selecionados em qualquer input
function handleImagePreview(inputElement, previewContainer) {
    inputElement.addEventListener('change', function(event) {
        const files = event.target.files;  // Obtém os arquivos selecionados
        previewContainer.innerHTML = '';   // Limpa os previews anteriores

        // Itera sobre os arquivos e gera os previews
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('preview');

                // Verifica se já existe a imagem, se não, adiciona
                const existingImages = previewContainer.getElementsByTagName('img');
                let imageExists = false;
                for (let j = 0; j < existingImages.length; j++) {
                    if (existingImages[j].src === e.target.result) {
                        imageExists = true;
                        break;
                    }
                }

                if (!imageExists) {
                    previewContainer.appendChild(img);
                }
            };

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
    
});
