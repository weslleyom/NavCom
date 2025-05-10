
from flask import Flask, redirect, request, render_template, jsonify
from mysql import connector
from datetime import datetime
app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/lista")
def lista():
    return render_template("lista.html")


@app.route("/contato", methods=["GET", "POST"])
def contato():
    if request.method == "POST":
        nome = request.form.get("nome")
        phone = request.form.get("phone")
        email = request.form.get("email")
        
        dados = (
             nome, phone, email
        )

        conect = connector.connect(
            host="localhost",
            database="navcom",
            user="root",
            password="375928"
        )

        cursor = conect.cursor()
        query = """
            INSERT INTO contato(nome, phone, email) 
            VALUES (%s, %s, %s)
        """
        
        cursor.execute(query, dados)
        conect.commit()
        
        new_id = cursor.lastrowid
        cursor.close()
        conect.close()
        print(dados)
        
        return jsonify({
        "id": new_id,
        "name": nome,
        "phone": phone,
        "email": email,
        "date": "hoje"  # ou use datetime.now().strftime(...)
    }), 201
    
    
def get_db_connection():
    return connector.connect(
        host="localhost",
        database="navcom",
        user="root",
        password="375928"
    )

@app.route("/contato/<int:id>", methods=["DELETE"])
def delete_contato(id):
    """Rota RESTful para excluir um contato via DELETE."""
    con = get_db_connection()
    cursor = con.cursor()
    cursor.execute("DELETE FROM contato WHERE id = %s", (id,))
    con.commit()
    cursor.close()
    con.close()
    return ('', 204)

@app.route("/contato/<int:id>", methods=["PUT"])
def edit_contato(id):
    """Rota para editar um contato existente via PUT."""
    # Recebe os dados do formulário (pode ser JSON ou form data)
    data = request.get_json()  
    nome = data.get("nome")
    phone = data.get("phone")
    email = data.get("email")
    
    # Verifica se os dados foram enviados corretamente
    if not nome or not phone:
        return jsonify({"error": "Nome e telefone são obrigatórios!"}), 400

    dados = (nome, phone, email, id)
    
    # Conecta ao banco de dados
    con = get_db_connection()
    cursor = con.cursor()
    
    # Atualiza os dados do contato
    query = """
        UPDATE contato
        SET nome = %s, phone = %s, email = %s
        WHERE id = %s
    """
    cursor.execute(query, dados)
    con.commit()
    
    # Verifica se a atualização foi bem-sucedida
    if cursor.rowcount == 0:
        return jsonify({"error": "Contato não encontrado!"}), 404
    
    cursor.close()
    con.close()
    
    
    return jsonify({
    "id": id,
    "name": nome,
    "phone": phone,
    "email": email,
    "date": datetime.now().strftime("%Y-%m-%d")  # Formato: AAAA-MM-DD HH:MM:SS  
}), 200



if __name__ == "__main__":
    app.run(debug=True)
