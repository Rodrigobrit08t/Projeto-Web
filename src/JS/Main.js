//https://lyricsovh.docs.apiary.io/#reference/0/lyrics-of-a-song/search <- API

const song = {artist:"", title:"", lyrics:""}

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
				<span>Editar</span>
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
				<span>Editar</span>
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

	const inputTitle = document.getElementById('e-title')
	inputTitle.value = card.querySelector('header h1 span').innerText.replace(':', '')

	const inputArtist = document.getElementById('e-artist')
	const inputOldArtist = document.getElementById('e-old-artist')
	inputArtist.value = card.querySelector('header h2').innerText.replace(':', '')
	inputOldArtist.value = card.querySelector('header h2').innerText.replace(':', '')

	const inputLyrics = document.getElementById('e-lyrics')
	inputLyrics.value = card.querySelector('main p').innerText

	openModal('edit-form-modal')
}

const editCard = (event) =>{
	event.preventDefault()
	const formData = new FormData(event.target)
	const stock = Object.fromEntries(formData)

	const card = document.getElementById(stock['old-artist'])
	card.setAttribute('id', stock.codigo)

	updateCard({
		...stock
	})
	closeModal(null, 'edit-form-modal')
}

