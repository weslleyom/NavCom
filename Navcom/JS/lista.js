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

    // =============================================
    // VARIÁVEIS DE ESTADO
    // =============================================
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    let isEditing = false;
    let currentContactId = null;

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

    // =============================================
    // FUNÇÕES PRINCIPAIS
    // =============================================

    function renderContacts() {
        if (contacts.length === 0) {
            contactList.innerHTML = '<p class="empty-message">Nenhum contato cadastrado ainda.</p>';
            return;
        }
        
        contactList.innerHTML = contacts.map(contact => `
            <div class="contact-item" data-id="${contact.id}" onclick="showContactDetails(${contact.id})">
                <div class="contact-info">
                    <h3>${contact.name}</h3>
                    <small>Adicionado em: ${contact.date}</small>
                </div>
                <div class="contact-actions">
                    <button class="edit-btn" onclick="event.stopPropagation(); editContact(${contact.id})">✏️</button>
                    <button class="delete-btn" onclick="event.stopPropagation(); deleteContact(${contact.id})">X</button>
                </div>
            </div>
        `).join('');
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
            email,
            date: new Date().toLocaleDateString()
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
        closeModal();
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