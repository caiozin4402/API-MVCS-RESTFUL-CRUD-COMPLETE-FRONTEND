const inquilino = require("../Modelo/inquilino");
const database = require("../DATABASE/mysqldatabase");
module.exports = class InquilinoDAO {
    #database;

    /**
     * 
     * @param {mysqlmysqldatabase} databaseInstance 
     * */

    constructor(databaseInstance) {//Injenção de dependência
        console.log("⬆️ InquilinoDAO.constructor()");
        this.#database = databaseInstance;

    }

    create = async (objInquilino) => {
        console.log("⬆️ InquilinoDAO.create()");
        const SQL = "INSERT INTO inquilino (nome,telefone,email,requisicao,CPF) VALUES (?,?,?,?,?)";
        const params = [objInquilino.nome, objInquilino.telefone, objInquilino.email, objInquilino.requisicao, objInquilino.cpf];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);//Executa no mysql
        if (!resultado) {
            throw new Error("Falha ao inserir\n");
        } return resultado.insertId;
    }

    delete = async (objInquilino) => {
        console.log("⬆️ InquilinoDAO.delete()");
        const SQL = "DELETE FROM inquilino where idInquilino = ?;";
        const params = [objInquilino.idInquilino];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);//Executa no mysql
        if (!resultado) {
            throw new Error("Falha ao deletar\n");
        } return resultado.affectedRows > 0;
    }

    update = async (objInquilino) => {
        console.log("⬆️ InquilinoDAO.update()");
        
        const SQL = "UPDATE inquilino SET nome = ?, telefone = ?,  email = ?, requisicao = ?, cpf = ? WHERE idInquilino = ?;";
        const params = [objInquilino.nome, objInquilino.telefone, objInquilino.email, objInquilino.requisicao, objInquilino.cpf, objInquilino.idInquilino];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);//Executa no mysql
        return resultado.affectedRows > 0;
    }

    findall = async () => {
        console.log("⬆️ InquilinoDAO.findall()");
        const SQL = "select * from inquilino;";
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL);//Executa no mysql
        //console.log(resultado);
        return resultado;
    }

    findbyid = async (idInquilino) => {
        console.log("⬆️ InquilinoDAO.findbyid()", idInquilino);
        const resultado = await this.findbyfield('idinquilino', idInquilino);
        return resultado || null;
    }

    findbyfield = async (field, value) => {
        console.log("⬆️ InquilinoDAO.findbyfield()");
        const allowedfields = ["idinquilino", "nome", "telefone", "email", "requisicao", "cpf"];
        if (!allowedfields.includes(field)) {
            throw new Error(`Campo inválido para busca ${field}`);
        }
        const SQL = `select * from inquilino where ${field} = ?;`;
        const params = [value];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);//Executa no mysql
        return resultado || [];
    }


} 