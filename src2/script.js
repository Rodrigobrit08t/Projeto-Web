let tasks = [];

// Função para carregar as tarefas
function loadTasks() {
    // Aqui você pode implementar a lógica para carregar as tarefas da localStorage ou de uma API
    // Por enquanto, vamos criar algumas tarefas de exemplo
    tasks = [
        { id: 1, title: "Fazer compras", description: "Comprar itens essenciais para casa", completed: false },
        { id: 2, title: "Estudar JavaScript", description: "Praticar programação em JavaScript", completed: true },
        { id: 3, title: "Ir à academia", description: "Fazer exercícios físicos", completed: false }
    ];

    // Após carregar as tarefas, renderiza a lista na página
    renderTasks(tasks);
}

// Função para renderizar as tarefas na página
function renderTasks(tasks) {
    // Obtém o elemento UL onde as tarefas serão renderizadas
    const taskList = document.getElementById('taskList');

    // Limpa a lista de tarefas antes de renderizar novamente
    taskList.innerHTML = '';

    // Para cada tarefa no array de tarefas, cria um elemento LI e adiciona à lista
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.title}</span>
            <button class="editBtn" onclick="openEditModal(${task.id})">Editar</button>
            <button class="deleteBtn" onclick="deleteTask(${task.id})">Excluir</button>
        `;
        taskList.appendChild(taskItem);
    });
}

// Carrega as tarefas ao carregar a página
window.addEventListener('load', loadTasks);

// Função para adicionar uma nova tarefa
function addTask(title, description) {
    // Cria um objeto representando a nova tarefa
    const newTask = {
        id: Date.now(), // Usamos o timestamp como ID para garantir a unicidade
        title: title,
        description: description,
        completed: false // Inicialmente, a tarefa não está concluída
    };

    // Adiciona a nova tarefa ao array de tarefas
    tasks.push(newTask);

    // Renderiza novamente a lista de tarefas
    renderTasks(tasks);

    // Fecha o modal
    closeModal();
}

// Função para editar uma tarefa existente
function editTask(taskId, newTitle, newDescription) {
    // Procura a tarefa pelo ID
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    // Verifica se a tarefa foi encontrada
    if (taskIndex !== -1) {
        // Atualiza o título e a descrição da tarefa
        tasks[taskIndex].title = newTitle;
        tasks[taskIndex].description = newDescription;

        // Renderiza novamente a lista de tarefas
        renderTasks(tasks);

        // Fecha o modal
        closeModal();
    }
}

// Função para excluir uma tarefa
function deleteTask(taskId) {
    // Filtra as tarefas para remover aquela com o ID fornecido
    tasks = tasks.filter(task => task.id !== taskId);

    // Renderiza novamente a lista de tarefas
    renderTasks(tasks);

    // Fecha o modal
    closeModal();
}

// Função para alternar o status de uma tarefa entre concluída e não concluída
function toggleTaskStatus(taskId) {
    // Encontra a tarefa pelo ID
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    // Verifica se a tarefa foi encontrada
    if (taskIndex !== -1) {
        // Inverte o status da tarefa (true -> false ou false -> true)
        tasks[taskIndex].completed = !tasks[taskIndex].completed;

        // Renderiza novamente a lista de tarefas
        renderTasks(tasks);
    }
}

// Evento para exibir o modal de adição de tarefa
document.getElementById('addTaskBtn').addEventListener('click', function() {
    // Exibe o modal
    openAddModal();
});

// Evento para fechar o modal
document.getElementsByClassName('close')[0].addEventListener('click', function() {
    // Fecha o modal
    closeModal();
});

// Evento para enviar o formulário de adição de tarefa
document.getElementById('taskForm').addEventListener('submit', function(event) {
    // Evita o comportamento padrão do formulário (recarregar a página)
    event.preventDefault();
    // Obtém os valores do formulário
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    // Chama a função addTask com os valores
    addTask(title, description);
});

// Carrega as tarefas ao carregar a página
window.addEventListener('load', function() {
    // Chama a função loadTasks
    loadTasks();
});
