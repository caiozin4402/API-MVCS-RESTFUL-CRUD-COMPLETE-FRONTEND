const inquilino = require("../Modelo/chale");
const database = require("../DATABASE/mysqldatabase");
module.exports = class ChaleDAO {
    #database;

    /**
     * 
     * @param {mysqlmysqldatabase} databaseInstance 
     * */

    constructor(databaseInstance) {//Injenção de dependência
        console.log("⬆️ chaleDAO.constructor()");
        this.#database = databaseInstance;

    }

    create = async (objInquilino) => {
        console.log("⬆️ chaleDAO.create()");
        const SQL = "INSERT INTO chale (nome,capacidade) VALUES (?,?)";
        const params = [objInquilino.nome, objInquilino.capacidade];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);//Executa no mysql
        if (!resultado) {
            throw new Error("Falha ao inserir\n");
        } return resultado.insertId;
    }

    delete = async (objChale) => {
        console.log("⬆️ chaleDAO.delete()");
        const SQL = "DELETE FROM chale where idChale = ?;";
        const params = [objChale.idChale];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);//Executa no mysql
        if (!resultado) {
            throw new Error("Falha ao deletar\n");
        } return resultado.affectedRows > 0;
    }

    update = async (objchale) => {
        console.log("⬆️ chaleDAO.update()");
        
        const SQL = "UPDATE chale SET nome = ?, capacidade = ? WHERE idChale = ?;";
        const params = [objchale.nome, objchale.capacidade,objchale.idChale];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);//Executa no mysql
        return resultado.affectedRows > 0;
    }

    findall = async () => {
        console.log("⬆️ chale.findall()");
        const SQL = "select * from chale;";
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL);//Executa no mysql
        //console.log(resultado);
        return resultado;
    }

    findbyid = async (idChale) => {
        console.log("⬆️ chaleDAO.findbyid()", idChale);
        
        // ✅ CORREÇÃO: Garantir que é número e usar campo correto
        const id = Number(idChale);
        const resultado = await this.findbyfield('idChale', id); // ❗ Mudei de 'idchale' para 'idChale'
        
        console.log("📦 chaleDAO.findbyid - resultado:", resultado);
        
        return (resultado && resultado.length > 0) ? resultado[0] : null;
    }

    findbyfield = async (field, value) => {
        console.log("⬆️ chaleDAO.findbyfield()", field, value);
        
        // ✅ CORREÇÃO: Campos permitidos com case correto
        const allowedfields = ["idChale", "nome", "capacidade"]; // ❗ Mudei para idChale
        if (!allowedfields.includes(field)) {
            throw new Error(`Campo inválido para busca ${field}`);
        }
        
        const SQL = `SELECT * FROM chale WHERE ${field} = ?;`;
        const params = [value];
        
        console.log("📝 SQL:", SQL, "Params:", params);
        
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);
        
        console.log("📦 Resultado findbyfield:", resultado);
        
        return resultado || [];
    }


} 