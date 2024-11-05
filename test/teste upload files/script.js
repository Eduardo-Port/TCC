fetch('http://localhost:3000/produto/1/imagens')
  .then(response => response.json())
  .then(data => {
    data.images.forEach(imageUrl => {
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      document.body.appendChild(imgElement);
    });
  });
