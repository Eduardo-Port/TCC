function initializeDropdown() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const select = dropdown.querySelector('.select');
        const caret = dropdown.querySelector('.caret');
        const menu = dropdown.querySelector('.menu');
        const options = dropdown.querySelectorAll('.menu li');
        const selected = dropdown.querySelector('.selected');

        // Identifica qual página está sendo executada
        const isProdutosPage = document.querySelector(".produtos") !== null;
        const isGerenciarPage = document.querySelector("#wrap-flex") !== null;

        // Função que escolhe qual método chamar baseado na página
        function loadProducts(categoria) {
            if (isProdutosPage) {
                const section = document.querySelector(".produtos");
                section.innerHTML = '';
                getAllProducts(categoria);
            } else if (isGerenciarPage) {
                const pai = document.querySelector("#wrap-flex");
                pai.innerHTML = '';
                getManageProduct(categoria);
            }
        }

        // Verifica se há categoria na URL ao carregar a página
        const urlParams = new URLSearchParams(window.location.search);
        const categoriaUrl = urlParams.get('categoria');
        if (categoriaUrl) {
            selected.innerText = categoriaUrl;
            options.forEach(opt => {
                if (opt.innerText === categoriaUrl) {
                    opt.classList.add('active');
                }
            });
            loadProducts(categoriaUrl);
        }

        select.addEventListener('click', () => {
            select.classList.toggle('select-clicked');
            caret.classList.toggle('caret-rotate');
            menu.classList.toggle('menu-open');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                selected.innerText = option.innerText;
                select.classList.remove('select-clicked');
                caret.classList.remove('caret-rotate');
                menu.classList.remove('menu-open');

                options.forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');

                // Atualiza a URL e recarrega os produtos
                const newURL = new URL(window.location.href);
                newURL.searchParams.set('categoria', option.innerText);
                history.pushState({}, '', newURL);
                
                loadProducts(option.innerText);
            });
        });
    });
}

// Gerenciar Produtos
function initializeDropdownManage() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const select = dropdown.querySelector('.select');
        const caret = dropdown.querySelector('.caret');
        const menu = dropdown.querySelector('.menu');
        const options = dropdown.querySelectorAll('.menu li');
        const selected = dropdown.querySelector('.selected');

        // Verifica se há categoria na URL ao carregar a página
        const urlParams = new URLSearchParams(window.location.search);
        const categoriaUrl = urlParams.get('categoria');
        if (categoriaUrl) {
            selected.innerText = categoriaUrl;
            options.forEach(opt => {
                if (opt.innerText === categoriaUrl) {
                    opt.classList.add('active');
                }
            });
            // Limpa a seção e carrega os produtos filtrados
            section.innerHTML = '';
            getManageProduct(categoriaUrl);
        }

        select.addEventListener('click', () => {
            select.classList.toggle('select-clicked');
            caret.classList.toggle('caret-rotate');
            menu.classList.toggle('menu-open');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                selected.innerText = option.innerText;
                select.classList.remove('select-clicked');
                caret.classList.remove('caret-rotate');
                menu.classList.remove('menu-open');

                options.forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');

                // Atualiza a URL e recarrega os produtos
                const newURL = new URL(window.location.href);
                newURL.searchParams.set('categoria', option.innerText);
                history.pushState({}, '', newURL);
                
                // Limpa os produtos anteriores e carrega os novos
                section.innerHTML = '';
                getManageProduct(option.innerText);
            });
        });
    });
}