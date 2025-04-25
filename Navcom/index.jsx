import { useEffect, useState, useRef } from 'react'
import './style.css'
import api from '../../services/api'


function Home() {
  const [users, setUsers] = useState([]) 

const inputName = useRef()
const inputPhone = useRef()
const inputEmail = useRef()


  async function getUsers() {
    const userFromApi = await api.get('/contato')
    setUsers(userFromApi.data)
    
  }

  async function createUsers(e) {
    e.preventDefault();
  
    await api.post('/contato', {
      name: inputName.current.value,
      numero: inputPhone.current.value, 
      email: inputEmail.current.value
    });
    
    getUsers(); // Atualiza a lista na tela
  }
  

  async function deleteUsers(id) {
    const userFromApi = await api.delete(`/contato/${id}`)
  
    getUsers()
    
  }
  


useEffect(() => {
    getUsers()
    
  }, [])

  
  return (
    <div>
      <header className="header">
        <h1>Agenda de Contatos</h1>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="search-container">
            <input type="text" id="search-contact" placeholder="Buscar contatos..." />
            <button id="sort-button" title="Ordenar por nome (A-Z)">
              <i className="fas fa-sort-alpha-down"></i>
            </button>
          </div>

          <div id="contact-list" className="contact-list"></div>

          <button className="add-button" id="add-contact-btn">
            <span className="button-icon">+</span>
            Adicionar Contato
          </button>
        </div>
      </main>

      <div id="contact-modal" className="modal">
        <div className="modal-content">
          <span className="close-btn">&times;</span>
          <h2 id="modal-title">Adicionar Contato</h2>

          <form id="contact-form">
            <input type="hidden" id="contact-id" />
            <div className="form-group">
              <label htmlFor="contact-name">Nome:</label>
              <input type="text" id="contact-name" required ref={inputName} />
            </div>

            <div className="form-group">
              <label htmlFor="contact-phone">Telefone:</label>
              <input type="tel" id="contact-phone" required ref={inputPhone} />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email">E-mail (opcional):</label>
              <input type="email" id="contact-email" ref={inputEmail }/>
            </div>

            <button type="submit" className="submit-btn" onClick={createUsers}>Salvar</button>
          </form>
        </div>
      </div>

      {users.map((user) => (
        <div key={user.id} id={`contact-detail-modal-${user.id}`} className="modal">
          <div className="modal-content">
            <span className="close-btn">&times;</span>
            <h2>Detalhes do Contato</h2>
            <div className="contact-details">
              <h3>{user.name}</h3>
              <p>{user.phone}</p>
              <p>{user.email}</p>
              <small>Data</small>
            </div>
          </div>
        </div>
      ))}

      <div id="confirm-delete-modal" className="custom-modal">
        <div className="modal-content">
          <h1>&lt;!&gt;</h1>
          <h2>Confirmar exclusão</h2>
          <hr className="modal-divider" />
          <p>Tem certeza que deseja excluir este contato?</p>
          <div className="modal-buttons">
            <button id="cancel-delete-btn" className="btn cancel">Cancelar</button>
            <button id="confirm-delete-btn" className="btn confirm" >Excluir</button>
          </div>
        </div>
      </div>

      <button id="settings-toggle" title="Configurações">
        <i className="fas fa-cog"></i>
      </button>

      <button id="profile-button" title="Perfil">
        <i className="fas fa-user-circle"></i>
      </button>

      <h1 className="logo">&lt;Nav&gt;com</h1>
    </div>
    



  )
}

export default Home
