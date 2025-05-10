document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // SELEÇÃO DE ELEMENTOS DO DOM
    // =============================================


    const contactList = document.getElementById('contact-list');
    const addContactBtn = document.getElementById('add-contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const detailModal = document.getElementById('contact-detail-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const contactForm = document.getElementById('contact-form');
    const modalTitle = document.getElementById('modal-title');
    const searchInput = document.getElementById('search-contact');

    // =============================================
    // VARIÁVEIS DE ESTADO
    // =============================================
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    let isEditing = false;
    let currentContactId = null;
    let filteredContacts = [...contacts];

    // =============================================
    // INICIALIZAÇÃO
    // =============================================

    renderContacts();

    // =============================================
    // EVENT LISTENERS
    // =============================================
    addContactBtn.addEventListener('click', openAddModal);
    closeModalBtn.addEventListener('click', closeModal);
    contactForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);

    // Restante dos listeners...

    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) closeAllModals();
    });
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) closeAllModals();
    });

    // =============================================
    // FUNÇÕES PRINCIPAIS
    // =============================================
    function handleSearch(e) {
        const term = e.target.value.toLowerCase();
        filteredContacts = contacts.filter(contact =>
            contact.name.toLowerCase().includes(term) ||
            contact.phone.includes(term) ||
            (contact.email && contact.email.toLowerCase().includes(term)))

        renderContacts();
    }
    function renderContacts() {
        if (filteredContacts.length === 0) {
            contactList.innerHTML = '<p class="empty-message">Nenhum contato encontrado</p>';
            return;
        }

        contactList.innerHTML = filteredContacts.map(contact => 
            `<div class="contact-item" data-id="${contact.id}">
                <div class="contact-info">
                    <h3>${contact.name}</h3>
                    <small>${contact.phone} • ${contact.date}</small>
                </div>
                <div class="contact-actions">
                <button class="edit-btn" data-action="edit" data-id="${contact.id}">
                <i class="fas fa-pen"></i>
                </button>
                <button class="delete-btn" data-action="delete" data-id="${contact.id}">
                <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>`).join('');
    }
    // Adicione este event listener no seu código
    contactList.addEventListener('click', (e) => {
        // Verifica se o clique foi em um botão de ação
        const actionBtn = e.target.closest('[data-action]');
        if (actionBtn) {
            e.stopPropagation();
            const action = actionBtn.dataset.action;
            const id = Number(actionBtn.dataset.id);

            if (action === 'edit') {
                openEditModal(id);
            } else if (action === 'delete') {
                deleteContact(id);
            }
            return;
        }

        // Verifica se o clique foi no item do contato (para mostrar detalhes)
        const contactItem = e.target.closest('.contact-item');
        if (contactItem) {
            const id = Number(contactItem.dataset.id);
            showContactDetails(id);
        }
    });

    function closeAllModals() {
        contactModal.style.display = 'none';
        detailModal.style.display = 'none';
        document.getElementById('confirm-delete-modal').style.display = 'none';
    }



    function openAddModal() {
        isEditing = false;
        currentContactId = null;
        modalTitle.textContent = 'Adicionar Contato';
        contactForm.reset();
        contactModal.style.display = 'flex';
    }

    function openEditModal(id) {
        const contact = contacts.find(c => c.id === id);
        if (!contact) return;

        isEditing = true;
        currentContactId = id;
        modalTitle.textContent = 'Editar Contato';
        document.getElementById('contact-id').value = id;
        document.getElementById('contact-name').value = contact.name;
        document.getElementById('contact-phone').value = contact.phone;
        document.getElementById('contact-email').value = contact.email;
        contactModal.style.display = 'flex';
    }

    function closeModal() {
        contactModal.style.display = 'none';
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
    
        const name = document.getElementById('contact-name').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const email = document.getElementById('contact-email').value.trim();
    
        if (!name || !phone) {
            alert('Nome e telefone são obrigatórios!');
            return;
        }
    
        if (isEditing) {
            try {
                const resp = await fetch(`/contato/${currentContactId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome: name, phone, email })
                });
        
                if (!resp.ok) {
                    const errorData = await resp.json();
                    throw new Error(errorData.message || 'Erro ao editar contato');
                }
        
                const updatedContact = await resp.json(); // Obtenha os dados atualizados do servidor
                const index = contacts.findIndex(c => c.id === currentContactId);
                if (index !== -1) {
                    contacts[index] = updatedContact; // Atualize o contato na lista
                }
        
                saveContacts(); // Salve os contatos atualizados no localStorage
        
            } catch (err) {
                alert(`Erro ao editar contato: ${err.message}`);
                console.error(err);
            }
        }
        
        
         else {
            // Criação: envia um POST para o backend
            try {
                const resp = await fetch('/contato', {
                    method: 'POST',
                    body: new URLSearchParams({ nome: name, phone, email })
                });
    
                const newContact = await resp.json();
                contacts.push(newContact);
    
            } catch (err) {
                alert("Erro ao criar contato.");
                console.error(err);
            }
        }
    
        filteredContacts = [...contacts];
        saveContacts();
        renderContacts();
        closeModal();
    }

    //_______________________________________________________

    
    let contactToDeleteId = null;

    function deleteContact(id) {
        contactToDeleteId = id;
        document.getElementById('confirm-delete-modal').style.display = 'flex';
    }

    document.getElementById('cancel-delete-btn').addEventListener('click', () => {
        contactToDeleteId = null;
        document.getElementById('confirm-delete-modal').style.display = 'none';
    });

    document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
        if (contactToDeleteId !== null) {
            try {
                const resp = await fetch(`/contato/${contactToDeleteId}`, {
                    method: 'DELETE'
                });
                if (!resp.ok) {
                    throw new Error(`Erro ao deletar: ${resp.status}`);
                }
                // Se tudo deu certo, atualiza as arrays e o DOM
                contacts = contacts.filter(c => c.id !== contactToDeleteId);
                filteredContacts = filteredContacts.filter(c => c.id !== contactToDeleteId);
                saveContacts();      // localStorage só pra manter a sincronização local
                renderContacts();
            } catch (err) {
                console.error(err);
                alert('Não foi possível excluir o contato. Tente novamente.');
            }
        }
        contactToDeleteId = null;
        document.getElementById('confirm-delete-modal').style.display = 'none';
    });
    

    function formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    }

    function saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    // =============================================
    // FUNÇÕES GLOBAIS
    // =============================================

    window.editContact = openEditModal;


    // Função global para exibir os detalhes de um contato
    window.showContactDetails = (id) => {
        const contact = contacts.find(c => c.id === id); // Encontra o contato pelo id
        if (!contact) return; // Se o contato não for encontrado, sai da função

        // Preenche os campos do modal de detalhes com os dados do contato
        document.getElementById('detail-name').textContent = contact.name;
        document.getElementById('detail-phone').textContent = `Telefone: ${formatPhone(contact.phone)}`;
        document.getElementById('detail-email').textContent = contact.email ? `E-mail: ${contact.email}` : 'E-mail: Não informado';
        document.getElementById('detail-date').textContent = `Adicionado em: ${contact.date}`;

        detailModal.style.display = 'flex'; // Exibe o modal de detalhes
    };

    // Função para fechar o modal de detalhes
    window.closeDetailModal = () => {
        detailModal.style.display = 'none'; // Oculta o modal de detalhes
    };

    // Função para fechar o modal ao clicar fora dele
    window.onclick = (e) => {
        if (e.target === contactModal) { // Se o clique for no fundo do modal de adicionar/editar
            closeModal(); // Fecha o modal
        }
        if (e.target === detailModal) { // Se o clique for no fundo do modal de detalhes
            closeDetailModal(); // Fecha o modal de detalhes
        }
    };
    // Ordenar por nome (A-Z)
document.getElementById('sort-button').addEventListener('click', () => {
    contacts.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
    filteredContacts = [...contacts];
    saveContacts();
    renderContacts();
});

// Botão de configurações (caso você tenha implementado esse menu)
let isAscending = true; // Começa com ordenação de A-Z

// Adiciona um evento de clique ao botão de ordenação (ícone A-Z ou Z-A)
document.getElementById('sort-button').addEventListener('click', () => {
    
    // Inverte a ordem de ordenação (se estiver crescente, vira decrescente e vice-versa)
    isAscending = !isAscending;

    // Ordena os contatos com base no nome, considerando a ordem definida (A-Z ou Z-A)
    contacts.sort((a, b) => {
        return isAscending
            ? a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }) // Ordem crescente (A-Z)
            : b.name.localeCompare(a.name, 'pt-BR', { sensitivity: 'base' }); // Ordem decrescente (Z-A)
    });
    // Atualiza a lista de contatos filtrados (cópia dos contatos ordenados)

    filteredContacts = [...contacts];
    // Salva os contatos ordenados no armazenamento local (caso esteja implementado no saveContacts)
    saveContacts();

    // Re-renderiza a lista de contatos na tela com a nova ordem
    renderContacts();

    // Atualiza o ícone e o título do botão de ordenação com base na nova ordem
    const sortBtn = document.getElementById('sort-button');
    const sortIcon = sortBtn.querySelector('i');

    if (isAscending) {
        sortBtn.title = "Ordenar por nome (A-Z)"; // Dica de ferramenta 
        sortIcon.className = "fas fa-sort-alpha-down"; // Ícone de ordenação A-Z
    } else {
        sortBtn.title = "Ordenar por nome (Z-A)";
        sortIcon.className = "fas fa-sort-alpha-up"; // Ícone de ordenação Z-A
    }
});
document.getElementById('profile-button').addEventListener('click', () => {
    window.location.href = 'perfilusuario.html';
});
});
