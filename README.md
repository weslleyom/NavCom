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
---
## 🐍 Crie e ative um ambiente virtual
  ```bash
   py -3.12 -m venv .venv
   .venv\Scripts\activate
```
## 📦 Instale as dependências
   ```bash
   pip install -r requirements.txt
```
## 🛠️ Configure o banco de dados MySQL
Abra o MySQL Workbench.
Crie um banco de dados com o nome navcom:
```bash
CREATE DATABASE agenda;
```
Execute o script SQL de criação da tabela (fornecido no repositório, se aplicável).

## 🚀 Inicie o servidor Flask
```bash

python app.py
```

## 🌐 Acesse no navegador
arduino
```bash
http://localhost:5000
```

## 📁 Estrutura do Projeto
cpp

├── static/
│   ├── lista.js
│   └── lista.css
├── templates/
│   └── lista.html
├── app.py
├── requirements.txt
└── README.md

## 🧠 Observações Importantes
✅ A aplicação utiliza MySQL Workbench para gerenciamento do banco de dados.

🔌 Certifique-se de que o serviço MySQL esteja ativo antes de iniciar o Flask.

🌙 O design foi feito com um tema escuro moderno e responsivo.
