/*
    Responsável por chamar o DAO e pelas validações das regras de negócios
    As camadas http não devem saber que fazem parte de um sistema web, ou seja, não se ligar com a pasta http
*/
const Inquilino = require("../Modelo/inquilino.js");
const inquilinoDAO = require("../DAO/inquilinoDAO.js");
const ErrorResponse = require("../utils/errorresponse.js");

module.exports = class InquilinoService {
    #inquilinoDAO;

    constructor(inquilinoDAOdependency) {
        console.log("⬆️   Inquilino Service.Constructor()");
        this.#inquilinoDAO = inquilinoDAOdependency;
    }

    // ✅ MÉTODO AUXILIAR PARA VALIDAR ID
    #validarId = (id, entidade = "Registro") => {
        if (!id) {
            throw new ErrorResponse(400, `ID da ${entidade} é obrigatório`);
        }
        
        const idNumero = Number(id);
        if (isNaN(idNumero) || idNumero <= 0) {
            throw new ErrorResponse(400, `ID da ${entidade} deve ser um número válido`);
        }
        
        return idNumero;
    }

    createInquilino = async (inquilinoJson) => {
        console.log("  Inquilino Service.createInquilino()");

        // ✅ Validar dados obrigatórios
        if (!inquilinoJson.nome || !inquilinoJson.email || !inquilinoJson.telefone) {
            throw new ErrorResponse(400, "Nome, email e telefone são obrigatórios");
        }

        const objInquilinoModel = new Inquilino();
        objInquilinoModel.nome = inquilinoJson.nome;
        objInquilinoModel.telefone = inquilinoJson.telefone;
        objInquilinoModel.email = inquilinoJson.email;
        objInquilinoModel.requisicao = inquilinoJson.requisicao;
        objInquilinoModel.cpf = inquilinoJson.cpf;

        // ✅ REGRA DE NEGÓCIO - Verificar se já existe inquilino com o mesmo email
        const inquilinosComMesmoEmail = await this.#inquilinoDAO.findbyfield('email', inquilinoJson.email);
        if (inquilinosComMesmoEmail && inquilinosComMesmoEmail.length > 0) {
            throw new ErrorResponse(
                400,
                "Já existe um inquilino cadastrado com este email."
            );
        }

        // ✅ REGRA DE NEGÓCIO - Verificar se já existe inquilino com o mesmo CPF (se fornecido)
        if (inquilinoJson.cpf) {
            const inquilinosComMesmoCPF = await this.#inquilinoDAO.findbyfield('cpf', inquilinoJson.cpf);
            if (inquilinosComMesmoCPF && inquilinosComMesmoCPF.length > 0) {
                throw new ErrorResponse(
                    400,
                    "Já existe um inquilino cadastrado com este CPF."
                );
            }
        }

        return this.#inquilinoDAO.create(objInquilinoModel);
    }

    findAll = async () => {
        console.log("  Inquilino Service.findall()");
        return this.#inquilinoDAO.findall();
    }

    findbyId = async (idInquilino) => {
        console.log("  Inquilino Service.findbyId()");
        
        const id = this.#validarId(idInquilino, "Inquilino");
        
        const inquilino = await this.#inquilinoDAO.findbyid(id);
        
        if (!inquilino || inquilino.length === 0) {
            throw new ErrorResponse(404, `Inquilino com id ${id} não encontrado`);
        }
        
        // ✅ RETORNE O PRIMEIRO ELEMENTO (objeto), não o array
        return inquilino[0];
    }

    updateInquilino = async (id, nome, telefone, email, requisicao, cpf) => {
        console.log("  Inquilino Service.updateInquilino()");

        // ✅ VALIDAR ID ANTES DE USAR
        const idValidado = this.#validarId(id, "Inquilino");

        // ✅ Validar dados obrigatórios
        if (!nome || !email || !telefone) {
            throw new ErrorResponse(400, "Nome, email e telefone são obrigatórios");
        }

        // ✅ Verificar se o inquilino existe
        const inquilinoExistente = await this.#inquilinoDAO.findbyid(idValidado);
        if (!inquilinoExistente || inquilinoExistente.length === 0) {
            throw new ErrorResponse(404, `Inquilino com id ${idValidado} não encontrado`);
        }

        // ✅ Verificar se email já está em uso por outro inquilino
        const inquilinosComMesmoEmail = await this.#inquilinoDAO.findbyfield('email', email);
        if (inquilinosComMesmoEmail && inquilinosComMesmoEmail.length > 0) {
            const emailEmUso = inquilinosComMesmoEmail.find(inq => inq.idInquilino != idValidado);
            if (emailEmUso) {
                throw new ErrorResponse(400, "Este email já está sendo usado por outro inquilino");
            }
        }

        // ✅ Verificar CPF duplicado (se fornecido)
        if (cpf) {
            const inquilinosComMesmoCPF = await this.#inquilinoDAO.findbyfield('cpf', cpf); // ✅ CORREÇÃO: 'cpf' minúsculo
            if (inquilinosComMesmoCPF && inquilinosComMesmoCPF.length > 0) {
                const cpfEmUso = inquilinosComMesmoCPF.find(inq => inq.idInquilino != idValidado);
                if (cpfEmUso) {
                    throw new ErrorResponse(400, "Este CPF já está sendo usado por outro inquilino");
                }
            }
        }

        const objInquilinoModel = new Inquilino();
        objInquilinoModel.idInquilino = idValidado;
        objInquilinoModel.nome = nome;
        objInquilinoModel.telefone = telefone;
        objInquilinoModel.email = email;
        objInquilinoModel.requisicao = requisicao;
        objInquilinoModel.cpf = cpf;

        return this.#inquilinoDAO.update(objInquilinoModel);
    }

    deleteInquilino = async (idInquilino) => {
        console.log("  Inquilino Service.deleteInquilino()");
        
        // ✅ VALIDAR ID ANTES DE USAR
        const id = this.#validarId(idInquilino, "Inquilino");
        
        // ✅ Verificar se o inquilino existe
        const inquilinoExistente = await this.#inquilinoDAO.findbyid(id);
        if (!inquilinoExistente || inquilinoExistente.length === 0) {
            throw new ErrorResponse(404, `Inquilino com id ${id} não encontrado`);
        }

        const objInquilinoModel = new Inquilino();
        objInquilinoModel.idInquilino = id;

        return this.#inquilinoDAO.delete(objInquilinoModel);
    }
}