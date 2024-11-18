const token = localStorage.getItem('token');
const userOptions = document.getElementById('user-options');
const userIcon = document.getElementById('user-icon');
const userName = document.getElementById('user-name');
const dropdownContainer = document.querySelector('.drop-perfil');

let isDropdownOpen = false;

function renderUserDropDown() {
    if (token) {
        fetch('http://localhost:3000/minha_conta', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.nome) {
                userName.textContent = `Olá, ${data.nome}`;
                userName.style.display = 'inline'; 
                userIcon.style.display = 'none';  
                userName.className ='drop-perfil'
                userOptions.innerHTML = `
                    <li class="my-account"><a href="./Dados.html">Minha Conta</a></li>
                    <li class="my-account"><a href="./Login.html">Sair</a></li>
                `;
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados do usuário:', error);
        });
    } else {
        userIcon.style.display = 'inline';  
        userName.style.display = 'none';    

        userOptions.innerHTML = `
            <li><a href="http://127.0.0.1:5500/frontend/Login.html">Login</a></li>
            <li><a href="http://127.0.0.1:5500/frontend/Cadastrar.html">Cadastrar</a></li>
        `;
    }
}

function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
    userOptions.style.display = isDropdownOpen ? 'block' : 'none';
}

function closeDropdownIfClickedOutside(event) {
    if (!dropdownContainer.contains(event.target)) {
        isDropdownOpen = false;
        userOptions.style.display = 'none';
    }
}

userIcon.addEventListener('click', toggleDropdown);
userName.addEventListener('click', toggleDropdown);

document.addEventListener('click', closeDropdownIfClickedOutside);

renderUserDropDown();
