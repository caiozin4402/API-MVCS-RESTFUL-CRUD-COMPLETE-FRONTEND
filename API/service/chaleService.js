/*
    Responsável por chamar o DAO e pelas validações das regras de negócios
    As camadas http não devem saber que fazem parte de um sistema web, ou seja, não se ligar com a pasta http
*/
const Chale = require("../Modelo/chale.js");
const chaleDAO = require("../DAO/chaleDAO.js");
const ErrorResponse = require("../utils/errorresponse.js");

module.exports = class ChaleService {
    #chaleDAO;

    constructor(chaleDAOdependency) {
        console.log("⬆️   Chale Service.Constructor()");
        this.#chaleDAO = chaleDAOdependency;
    }

    // ✅ VALIDAÇÃO DE ID - MÉTODO AUXILIAR
    #validarId(id, entidade = "Chalé") {
        if (id === undefined || id === null || id === '') {
            throw new ErrorResponse(400, `ID do ${entidade} é obrigatório`);
        }

        const idNumerico = Number(id);
        if (isNaN(idNumerico) || !Number.isInteger(idNumerico)) {
            throw new ErrorResponse(400, `ID do ${entidade} deve ser um número inteiro`);
        }

        if (idNumerico <= 0) {
            throw new ErrorResponse(400, `ID do ${entidade} deve ser maior que 0`);
        }

        return idNumerico;
    }

    createChale = async (chaleJson) => {
        console.log("  Chale Service.createChale()");

        // ✅ Validar dados obrigatórios
        if (!chaleJson.nome || !chaleJson.capacidade) {
            throw new ErrorResponse(400, "Nome e capacidade são obrigatórios");
        }

        const objChaleModel = new Chale();
        objChaleModel.nome = chaleJson.nome;
        objChaleModel.capacidade = chaleJson.capacidade;

        // ✅ REGRA DE NEGÓCIO - Verificar se já existe chalé com o mesmo nome
        const chalesComMesmoNome = await this.#chaleDAO.findbyfield('nome', chaleJson.nome);
        if (chalesComMesmoNome && chalesComMesmoNome.length > 0) {
            throw new ErrorResponse(
                400,
                "Já existe um chalé cadastrado com este nome."
            );
        }

        return this.#chaleDAO.create(objChaleModel);
    }

    findAll = async () => {
        console.log("  Chale Service.findall()");
        return this.#chaleDAO.findall();
    }

    findbyId = async (idChale) => {
        console.log("  Chale Service.findbyId()");
        
        // ✅ VALIDAR ID ANTES DE USAR
        const id = this.#validarId(idChale, "Chalé");
        
        const chale = await this.#chaleDAO.findbyid(id);
        
        if (!chale || chale.length === 0) {
            throw new ErrorResponse(404, `Chalé com id ${id} não encontrado`);
        }
        
        return chale;
    }

    updateChale = async(id, nome, capacidade) => {
        console.log("  Chale Service.updateChale()");

        // ✅ VALIDAR ID ANTES DE USAR
        const idValidado = this.#validarId(id, "Chalé");

        // ✅ Validar dados obrigatórios
        if (!nome || !capacidade) {
            throw new ErrorResponse(400, "Nome e capacidade são obrigatórios");
        }

        // ✅ Verificar se o chalé existe
        const chaleExistente = await this.#chaleDAO.findbyid(idValidado);
        if (!chaleExistente || chaleExistente.length === 0) {
            throw new ErrorResponse(404, `Chalé com id ${idValidado} não encontrado`);
        }

        // ✅ Verificar se nome já está em uso por outro chalé
        const chalesComMesmoNome = await this.#chaleDAO.findbyfield('nome', nome);
        if (chalesComMesmoNome && chalesComMesmoNome.length > 0) {
            const nomeEmUso = chalesComMesmoNome.find(ch => ch.idChale != idValidado);
            if (nomeEmUso) {
                throw new ErrorResponse(400, "Este nome já está sendo usado por outro chalé");
            }
        }

        const objChaleModel = new Chale();
        objChaleModel.idChale = idValidado;
        objChaleModel.nome = nome;
        objChaleModel.capacidade = capacidade;

        return this.#chaleDAO.update(objChaleModel);
    }

    deleteChale = async(idChale) => {
        console.log("  Chale Service.deleteChale()");
        
        // ✅ VALIDAR ID ANTES DE USAR
        const id = this.#validarId(idChale, "Chalé");
        
        // ✅ Verificar se o chalé existe
        const chaleExistente = await this.#chaleDAO.findbyid(id);
        if (!chaleExistente || chaleExistente.length === 0) {
            throw new ErrorResponse(404, `Chalé com id ${id} não encontrado`);
        }

        const objChaleModel = new Chale();
        objChaleModel.idChale = id;

        return this.#chaleDAO.delete(objChaleModel);
    }
}