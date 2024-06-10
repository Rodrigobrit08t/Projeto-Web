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
	const card = event.target.closest('.card-song')

	const inputArtist = document.getElementById('artist-edit')
	inputArtist.value = card.querySelector('header h2 span').innerText.replace(':', '')

	const inputTitulo = document.getElementById('titulo-edit')
	inputTitulo.value = card.querySelector('header h1 span').innerText

	const inputLetra = document.getElementById('letra-edit')
	inputLetra.value = card.querySelector('main p').dataset.valor

	openModal('edit-form-modal')
}

const editCard = (event) =>{
	event.preventDefault()
	const formData = new FormData(event.target)
	const stock = Object.fromEntries(formData)

	const card = document.getElementById(song['e-artista'])
	card.setAttribute('artist', song.artista)

	updateCard({
		artist,
        title,
        lyrics
	})
	closeModal(null, 'edit-form-modal')
}


let comments = [];

function addComment() {
    const commentText = document.getElementById("comment-text").value;
    if (commentText.trim() !== "") {
        const comment = {
            id: generateId(),
            text: commentText
        };
        comments.push(comment);
        renderComments();
        document.getElementById("comment-text").value = "";
    }
}

function renderComments() {
    const commentsList = document.getElementById("comments-list");
    commentsList.innerHTML = "";
    comments.forEach(comment => {
        const commentElement = document.createElement("div");
        commentElement.innerHTML = `
            <p>${comment.text}</p>
            <button onclick="deleteComment(${comment.id})">Excluir</button>
            <button onclick="editComment(${comment.id})">Editar</button>
        `;
        commentsList.appendChild(commentElement);
    });
}

function deleteComment(commentId) {
    comments = comments.filter(comment => comment.id !== commentId);
    renderComments();
}

function generateId() {
    return Math.floor(Math.random() * Date.now());
}

window.onload = renderComments;

function editComment(commentId) {
    const newText = prompt("Editar comentário:", comments.find(comment => comment.id === commentId).text);
    if (newText !== null) {
        const index = comments.findIndex(comment => comment.id === commentId);
        comments[index].text = newText;
        renderComments();
    }
}



