# 📒 Agenda de Contatos - Navcom

Uma aplicação web de **agenda de contatos** feita com **Python (Flask)** no backend e **HTML, CSS e JavaScript** no frontend.

📂 Ideal para aprender sobre CRUD, APIs REST e integração com banco de dados MySQL.

---

## 🔧 Tecnologias utilizadas

- Frontend: HTML, CSS, JavaScript
- Backend: Python 3.12+ com Flask
- Banco de dados: MySQL (gerenciado pelo MySQL Workbench)
- JavaScript (DOM, eventos, busca e ordenação)
- Outros: Font Awesome, Google Fonts (Poppins)

---

## 🚀 Funcionalidades

- ✅ Adicionar novos contatos
- 🔍 Buscar por nome
- 🔄 Ordenar contatos (A-Z / Z-A)
- ✏️ Editar contatos
- 🗑️ Excluir com confirmação
- 📋 Visualizar detalhes do contato

---

## 🖥️ Como executar localmente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/navcom-sql.git
   cd navcom-sql
⚙️ Instalação
Clone este repositório:

bash
Copiar
Editar
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
Crie e ative um ambiente virtual:

bash
Copiar
Editar
py -3.12 -m venv .venv
.venv\Scripts\activate
Instale as dependências:

bash
Copiar
Editar
pip install -r requirements.txt
Configure o banco de dados MySQL:

Crie um banco de dados chamado navcom.

Execute o script SQL de criação das tabelas (fornecido no repositório).

Inicie o servidor Flask:

bash
Copiar
Editar
python app.py
Acesse no navegador:

arduino
Copiar
Editar
http://localhost:5000
📂 Estrutura de Pastas
bash
Copiar
Editar
/static
    └── lista.js / lista.css
/templates
    └── lista.html
app.py
README.md
requirements.txt
🧠 Observações
A aplicação usa o MySQL Workbench para gerenciamento do banco de dados.

Verifique se o serviço MySQL está ativo antes de rodar o Flask.

