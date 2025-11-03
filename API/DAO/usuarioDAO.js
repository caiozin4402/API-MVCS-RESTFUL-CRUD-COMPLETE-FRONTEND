const database = require("../DATABASE/mysqldatabase");

module.exports = class UsuariosDAO {
    #database;

    constructor(databaseInstance) {
        console.log("⬆️ UsuariosDAO.constructor()");
        this.#database = databaseInstance;
    }

    // Buscar usuário por email
    findByEmail = async (email) => {
        console.log("⬆️ UsuariosDAO.findByEmail()", email);
        try {
            const SQL = "SELECT * FROM usuarios WHERE email = ?";
            const params = [email];
            const pool = await this.#database.getPool(); // ✅ CORREÇÃO AQUI
            const [resultado] = await pool.execute(SQL, params);
            return resultado[0] || null;
        } catch (error) {
            console.error("❌ Erro em findByEmail:", error);
            throw error;
        }
    }

    // Buscar usuário por ID
    findById = async (id) => {
        console.log("⬆️ UsuariosDAO.findById()", id);
        try {
            const SQL = "SELECT * FROM usuarios WHERE idUsuario = ?";
            const params = [id];
            const pool = await this.#database.getPool(); // ✅ CORREÇÃO AQUI
            const [resultado] = await pool.execute(SQL, params);
            return resultado[0] || null;
        } catch (error) {
            console.error("❌ Erro em findById:", error);
            throw error;
        }
    }

    // Criar novo usuário
    create = async (usuarioData) => {
        console.log("⬆️ UsuariosDAO.create()");
        try {
            const SQL = "INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)";
            const params = [
                usuarioData.nome, 
                usuarioData.email, 
                usuarioData.senha, 
                usuarioData.role || 'funcionario'  // ✅ Usando 'role' e valor padrão correto
            ];
            const pool = await this.#database.getPool();
            const [resultado] = await pool.execute(SQL, params);
            return resultado.insertId;
        } catch (error) {
            console.error("❌ Erro em create:", error);
            throw error;
        }
    }
    // Listar todos os usuários (apenas para admin)
    findAll = async () => {
        console.log("⬆️ UsuariosDAO.findAll()");
        try {
            const SQL = "SELECT idUsuario, nome, email, tipo, dataCriacao FROM usuarios";
            const pool = await this.#database.getPool(); // ✅ CORREÇÃO AQUI
            const [resultado] = await pool.execute(SQL);
            return resultado;
        } catch (error) {
            console.error("❌ Erro em findAll:", error);
            throw error;
        }
    }
}