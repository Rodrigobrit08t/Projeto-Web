//https://lyricsovh.docs.apiary.io/#reference/0/lyrics-of-a-song/search <- API

const song = {artist:"", title:"", lyrics:""}

function addSong({artist, title, lyrics}){
    const main = document.querySelector('body > main')

    main.innerHTML += `
        <div class="card-song" id="${artist}" onmouseenter="cardEnter(event)" onmouseleave="cardLeave(event)">
			<header>
				<h2>${Artist}</h2>
				<h1>${Name}</h1>
			</header>
			<main>
				<p>${Lyrics}</p>
			</main>
			<footer>
			
			</footer>
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
	song.map(stock => addSong(stock))
}