const teste = document.getElementById("fileInput")
teste.addEventListener("change", (event) => {
    const previewContainer = document.getElementById("previewContainer");
    previewContainer.innerHTML = ""; // Limpa a área para garantir que ela não duplica imagens ao inserir várias de uma vez

    Array.from(event.target.files).forEach((file) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.width = "100px";
            img.style.height = "100px";
            img.style.objectFit = "cover";
            previewContainer.appendChild(img);
        };
        
        reader.readAsDataURL(file);
    });
});
