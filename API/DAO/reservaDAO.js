const reserva = require("../Modelo/reserva");
const database = require("../DATABASE/mysqldatabase");
module.exports = class ReservaDAO {
    #database;

    /**
     * 
     * @param {mysqlmysqldatabase} databaseInstance 
     * */

    constructor(databaseInstance) {     //Injenção de dependência
        console.log("⬆️ reservaDAO.constructor()");
        this.#database = databaseInstance;

    }

    create = async (objReserva) => {
        console.log("⬆️ reservaDAO.create()");
        const SQL = "INSERT INTO reserva (idInquilino,idChale,inicio,fim) VALUES (?,?,?,?)";
        const params = [objReserva.idInquilino, objReserva.idChale, objReserva.inicio, objReserva.fim];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);//Executa no mysql
        // Verifica resultado do insert
        if (!resultado || resultado.insertId == null) {
            throw new Error("Falha ao inserir\n");
        }
        return resultado.insertId;
    }

    delete = async (objReserva) => {
        console.log("⬆️ reservaDAO.delete()");
        if (!objReserva || !objReserva.idReserva) {
            throw new Error('idReserva é obrigatório para deletar');
        }
        const SQL = "DELETE FROM reserva where idReserva = ?;";
        const params = [objReserva.idReserva];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);//Executa no mysql
        return resultado.affectedRows > 0;
    }

    update = async (objReserva) => {
        console.log("⬆️ reservaDAO.update()");
        // validação mínima
        if (!objReserva || !objReserva.idReserva) {
            throw new Error('idReserva é obrigatório para atualizar');
        }

        // Atualiza os campos da reserva identificada por idReserva
        const SQL = "UPDATE reserva SET idInquilino = ?, idChale = ?, inicio = ?, fim = ? WHERE idReserva = ?;";
        const params = [objReserva.idInquilino, objReserva.idChale, objReserva.inicio, objReserva.fim, objReserva.idReserva];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);//Executa no mysql
        return resultado.affectedRows > 0;
    }

    findall = async () => {
        console.log("⬆️ reserva.findall()");
        const SQL = "select * from reserva;";
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL);//Executa no mysql
        //console.log(resultado);
        return resultado;
    }

    findbyid = async (idReserva) => {
        console.log("⬆️ reservaDAO.findbyid()", idReserva);
        const resultado = await this.findbyfield('idReserva', idReserva);
        return (resultado && resultado.length) ? resultado[0] : null;
    }

    findbyfield = async (field, value) => {
        console.log("⬆️ reservaDAO.findbyfield()");
        const allowedfields = ["idReserva", "idInquilino", "idChale","inicio","fim"];
        if (!allowedfields.includes(field)) {
            throw new Error(`Campo inválido para busca ${field}`);
        }
        const SQL = `select * from reserva where ${field} = ?;`;
        const params = [value];
        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);//Executa no mysql
        return resultado || [];
    }


} 