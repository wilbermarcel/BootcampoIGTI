let tabUsers = null;
let tabStatistic = null;
let labelUsers = '';
let labelStatistic = '';
let inputSearch = null;
let json = null;
let buttonSearch = null;
let numberFormat = null;

window.addEventListener('load', start);

async function start() {
    labelUsers = document.querySelector('#labelUsers');
    labelStatistic = document.querySelector('#labelStatistic');
    inputSearch = document.querySelector('#inputSearch');
    tabUsers = document.querySelector('#tabUsers');
    tabStatistic = document.querySelector('#tabStatistic');
    buttonSearch = document.querySelector('#buttonSearch');
    labelUsers.textContent = 'Nenhum usuário filtrado';
    labelStatistic.textContent = 'Nada a ser exibido';
    inputSearch.disabled = true;
    buttonSearch.disabled = true;
    numberFormat = Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
    loading();
    json = await loadJson();
    json = json.results.map((user) => {
        return {
            name: `${user.name.first} ${user.name.last}`,
            gender: user.gender[0].toUpperCase(),
            age: user.dob.age,
            picture: user.picture.thumbnail,
        };
    });
    inputSearch.addEventListener('keyup', search);
    buttonSearch.addEventListener('click', search);
}

function loading() {
    let loading = document.querySelector('#loading');
    let contador = 0;
    let interval = setInterval(() => {
        loading.innerHTML = `<h4> Carregando${'.'.repeat(++contador)} </h4>`;
        if (contador > 3) {
            clearInterval(interval);
            loading.innerHTML = '';
            inputSearch.disabled = false;
            buttonSearch.disabled = false;
        }
    }, 1000);
}

async function loadJson() {
    return await (
        await fetch(
            'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
        )
    ).json();
}

function sumAgeGender(gender, array) {
    let ret = 0;
    array.forEach((element) => {
        if (element.gender === gender) ret++;
    });
    return ret;
}

function search(event) {
    function reset() {
        tabUsers.innerHTML = '';
        tabStatistic.innerHTML = '';
        labelUsers.textContent = 'Nenhum usuário filtrado';
        labelStatistic.textContent = 'Nada a ser exibido';
    }
    if (event.key === 'Enter' || event.type === 'click') {
        let stringSearch = inputSearch.value.toLowerCase();
        if (stringSearch !== '') {
            const arrayUsers = json
                .filter(
                    (user) => user.name.toLowerCase().indexOf(stringSearch) > -1
                )
                .sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            if (arrayUsers.length > 0) {
                labelUsers.textContent = `
                ${arrayUsers.length} usuário(s) encontrado(s)`;
                let tabUsersHTML = '<ul>';
                arrayUsers.forEach((element) => {
                    tabUsersHTML += `
                <li> 
                <img src='${element.picture}' alt='${element.name}' /> ${element.name}, ${element.age} anos </li>
                `;
                });
                tabUsersHTML += '</ul>';
                tabUsers.innerHTML = tabUsersHTML;

                labelStatistic.textContent = 'Estatísticas';
                let sumAges = arrayUsers.reduce((a, b) => {
                    return a + b.age;
                }, 0);
                let tabStatisticHTML = `
                <ul>
                    <li>Sexo Masculino: <strong>${sumAgeGender(
                        'M',
                        arrayUsers
                    )}</strong> </li>
                    <li>Sexo Feminino: <strong>${sumAgeGender(
                        'F',
                        arrayUsers
                    )}</strong> </li>
                    <li>Soma das idades: <strong>${sumAges}</strong> </li>
                    <li>Médias das idades: <strong> ${numberFormat.format(
                        sumAges / arrayUsers.length
                    )}</strong> </li>
                </ul>
                `;
                tabStatistic.innerHTML = tabStatisticHTML;
            } else reset();
        } else reset();
    }
}
