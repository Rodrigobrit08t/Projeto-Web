const song = [{artist:"", title:"", lyrics:""}]

function addCard({artist, title, lyrics}){
    const main = document.querySelector('body > main')

    main.innerHTML += `
        <div class="card-song" id="${artist}" onmouseenter="cardEnter(event)" onmouseleave="cardLeave(event)">
			<header>
				<h2><span>Artista: </span>${artist}</h2>
				<h1><span>Título: </span>${title}</h1>
			</header>
			<main>
				<h3><span>Letra:</span><br></h3>
				<p>${lyrics}</p>
			</main>
			<div class="card-menu">
				<span onclick="openModal('edit-form-modal')">Editar</span>
				<span onclick="removeCard(event)">Excluir</span>
			</div>
		</div>
    `
	const allEdit = main.querySelectorAll('.card-song .card-menu span:first-child')
	allEdit.forEach(edit => {
		edit.addEventListener('click', openEditModal)
	})
}

function updateCard({artist, title, lyrics}){

    const card = document.querySelector(`#${artist}`)
    
	card.innerHTML = `
			<header>
				<h2><span>Artista: </span>${artist}</h2>
				<h1><span>Título: </span>${title}</h1>
			</header>
			<main>
				<h3><span>Letra:</span><br></h3>
				<p>${lyrics}</p>
			</main>
			<div class="card-menu">
				<span onclick="openModal('edit-form-modal')">Editar</span>
				<span onclick="removeCard(event)">Excluir</span>
			</div>
		</div>
    `

	const edit = card.querySelector('.card-song .card-menu span:first-child')
	edit.addEventListener('click', openEditModal)
}

const openModal = (idModal) => {
	const modal = document.getElementById(idModal)
	modal.style.display = 'flex'
}

const closeModal = (event, id) => {
	if(id){
		const modal = document.getElementById(id)
		modal.style.display = 'none'
		return
	}

	if(event?.target?.className === "modal"){
		const modal = document.getElementById(event.target.id)
		modal.style.display = 'none'
		return
	}
}


function loadCards(){
	song.map(stock => addCard(stock))
}

const createCard = (event) =>{
	event.preventDefault()
	const formData = new FormData(event.target)
	const stock = Object.fromEntries(formData)

	addCard(stock)
	event.target.reset()
	closeModal(null, 'add-form-modal')
}

const cardDataArray = [];

const fetchLyrics = async (artist, title) => {
    try {
        const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar a letra da música');
        }
        const data = await response.json();
        return data.lyrics || 'Letra não encontrada';
    } catch (error) {
        console.error('Erro:', error);
        return 'Erro ao buscar a letra da música';
    }
};

const createApiCard = async (event) =>{
	event.preventDefault();
    const { artist, title } = event.target.elements;
    const artistValue = artist.value;
    const titleValue = title.value;

    const lyrics = await fetchLyrics(artistValue, titleValue);
	
	cardDataArray.push({
        artist: artistValue,
        title: titleValue,
        lyrics: lyrics
    });

	const cardHTML = `
        <div class="card-song" id="${artistValue}">
            <header>
                <h2><span>Artista: </span>${artistValue}</h2>
                <h1><span>Título: </span>${titleValue}</h1>
            </header>
            <main>
                <h3><span>Letra:</span><br></h3>
                <p>${lyrics}</p>
            </main>
            <div class="card-menu">
                <span>Editar</span>
                <span onclick="removeCard(event)">Excluir</span>
            </div>
        </div>
    `;

	document.body.querySelector('main').innerHTML += cardHTML;

	artist.value = '';
    title.value = '';
	
	event.target.reset()
	closeModal(null, 'add-api-modal')
}

const renderCards = () => {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; 

    cardDataArray.forEach(cardData => {
        const cardHTML = `
            <div class="card">
                <h3>${cardData.title}</h3>
                <p><strong>Artista:</strong> ${cardData.artist}</p>
                <p><strong>Letra:</strong> ${cardData.lyrics}</p>
            </div>
        `;
        cardContainer.innerHTML += cardHTML; // Adiciona o HTML do card ao container
    });
};


const cardEnter = (event) => {
	const cardMenu = event.target.querySelector('.card-menu')
	cardMenu.style.display = 'flex'
}

const cardLeave = (event) => {
	const cardMenu = event.target.querySelector('.card-menu')
	cardMenu.style.display = 'none'
}

const removeCard = (event) => {
	event.target.closest('.card-song').remove()
}


const openEditModal = (event) => {
	const card = event.target.closest('.card-song');
    if (!card) return; 

    const editModal = document.getElementById('edit-form-modal');
    if (!editModal.style.display || editModal.style.display === 'none') {
        openModal('edit-form-modal');
    }

    const inputTitle = document.getElementById('e-title');
    inputTitle.value = card.querySelector('header h1 span').innerText.replace(':', '');

    const inputArtist = document.getElementById('e-artist');
    const inputOldArtist = document.getElementById('e-old-artist');
    inputArtist.value = card.querySelector('header h2').innerText.replace(':', '');
    inputOldArtist.value = inputArtist.value;

    const inputLyrics = document.getElementById('e-lyrics');
    inputLyrics.value = card.querySelector('main p').innerText;
}

const editCard = (event) =>{
	
}



