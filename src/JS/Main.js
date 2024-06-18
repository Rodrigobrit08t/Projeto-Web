const song = [{id:"", artist:"", title:"", lyrics:""}]


function addCard({id, artist, title, lyrics}){
    const main = document.querySelector('body > main')
    id = Date.now()

    main.innerHTML += `
        <div class="card-song" id="${id}" onmouseenter="cardEnter(event)" onmouseleave="cardLeave(event)">
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

function updateCard({id, artist, title, lyrics}){
    
    const card = document.querySelector(`#${id}`)
    
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

const loadCards = () => {
    cardDataArray.forEach(cardData => {
        const cardHTML = `
            <div class="card-song" id="${cardData.id}">
                <header>
                    <h2><span>Artista: </span>${cardData.artist}</h2>
                    <h1><span>Título: </span>${cardData.title}</h1>
                </header>
                <main>
                    <h3><span>Letra:</span><br></h3>
                    <p>${cardData.lyrics}</p>
                </main>
                <div class="card-menu">
                    <span onclick="openModal('edit-form-modal')">Editar</span>
                    <span onclick="removeCard(event)">Excluir</span>
                </div>
            </div>
        `;

        const main = document.querySelector('main');
        main.innerHTML += cardHTML;
    });
};

window.onload = loadCards;

/*
function loadCards(){
	song.map(stock => addCard(stock))
}
*/

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


const createApiCard = async (event) => {
    event.preventDefault();
    const { artist, title } = event.target.elements;
    const artistValue = artist.value.trim();
    const titleValue = title.value.trim();

    if (!artistValue || !titleValue) {
        alert('Por favor, preencha o artista e o título da música.');
        return;
    }

    try {
        const lyrics = await fetchLyrics(artistValue, titleValue);
        const id = Date.now();

        cardDataArray.push({
            id: id,
            artist: artistValue,
            title: titleValue,
            lyrics: lyrics
        });

        const cardHTML = `
            <div class="card-song" id="${id}">
                <header>
                    <h2><span>Artista: </span>${artistValue}</h2>
                    <h1><span>Título: </span>${titleValue}</h1>
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
        `;

        const main = document.querySelector('main');
        main.innerHTML += cardHTML;

        event.target.reset();
        closeModal(null, 'add-api-modal');
    } catch (error) {
        console.error('Erro ao criar card:', error);
        alert('Ocorreu um erro ao buscar a letra da música. Por favor, tente novamente.');
    }
};

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
        cardContainer.innerHTML += cardHTML; 
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

    const editForm = document.getElementById('edit-form-modal');
    editForm.dataset.cardId = card.id;

    const inputArtist = document.getElementById('artist-edit');
    inputArtist.value = card.querySelector('header h2 span').innerText.replace('Artista: ', '');

    const inputTitulo = document.getElementById('title-edit');
    inputTitulo.value = card.querySelector('header h1 span').innerText.replace('Título: ', '');

    const inputLetra = document.getElementById('lyrics-edit');
    inputLetra.value = card.querySelector('main p').innerText;

    openModal('edit-form-modal');
};



const editCard = (event) =>{
	event.preventDefault()
	const formData = new FormData(event.target)
	const updateCard = Object.fromEntries(formData)


	const cardID = updateCard['id']
    const card = document.getElementById(cardID)

	if (card) {
        const header = card.querySelector('header');
        header.innerHTML = `
            <h2><span>Artista: </span>${updatedCard.artist}</h2>
            <h1><span>Título: </span>${updatedCard.title}</h1>
        `;

        const main = card.querySelector('main');
        main.innerHTML = `
            <h3><span>Letra:</span><br></h3>
            <p>${updatedCard.lyrics}</p>
        `;
    } else {
        console.error(`Card with ID ${cardId} not found.`);
    }

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



