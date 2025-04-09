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
        
        contactList.innerHTML = filteredContacts.map(contact => `
            <div class="contact-item" data-id="${contact.id}">
                <div class="contact-info">
                    <h3>${contact.name}</h3>
                    <small>${contact.phone} • ${contact.date}</small>
                </div>
                <div class="contact-actions">
                    <button class="edit-btn" data-action="edit" data-id="${contact.id}">✏️</button>
                    <button class="delete-btn" data-action="delete" data-id="${contact.id}">🗑️</button>
                </div>
            </div>
        `).join('');
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

    function handleFormSubmit(e) {
        e.preventDefault();
        
        const id = isEditing ? currentContactId : Date.now();
        const name = document.getElementById('contact-name').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const email = document.getElementById('contact-email').value.trim();

        if (!name || !phone) {
            alert('Nome e telefone são obrigatórios!');
            return;
        }

        const contactData = {
            id,
            name,
            phone,
            email: email || null,
            date: isEditing 
                ? contacts.find(c => c.id === id).date 
                : new Date().toLocaleDateString()
        };

        if (isEditing) {
            const index = contacts.findIndex(c => c.id === currentContactId);
            if (index !== -1) {
                contacts[index] = contactData;
            }
        } else {
            contacts.push(contactData);
        }

        saveContacts();
        renderContacts();
        filteredContacts = [...contacts];
        closeModal();
    }
    function deleteContact(id) {
        if (confirm('Tem certeza que deseja excluir este contato?')) {
            contacts = contacts.filter(c => c.id !== id);
            filteredContacts = filteredContacts.filter(c => c.id !== id);
            saveContacts();
            renderContacts();
        }
    }
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
    
    window.deleteContact = (id) => {
        if (confirm('Tem certeza que deseja excluir este contato?')) {
            contacts = contacts.filter(contact => contact.id !== id);
            saveContacts();
            renderContacts();
        }
    };

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
});

