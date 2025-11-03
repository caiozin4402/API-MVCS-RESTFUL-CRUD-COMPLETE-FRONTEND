const inquilinoService = require("../service/inquilinoService.js");

module.exports = class InquilinoControl {
    #inquilinoService;

    constructor(inquilinoServiceDependency) {
        console.log("⬆️   InquilinoControl.constructor()");
        this.#inquilinoService = inquilinoServiceDependency;
    }

    store = async (request, response, next) => {
        console.log("⬆️  InquilinoControl.store()");
        try {
            const inquilinojson = request.body.Inquilino || request.body;
            
            // ✅ VERIFIQUE SE ESTÁ USANDO O SERVICE
            const novoInquilino = await this.#inquilinoService.createInquilino(inquilinojson);
            
            return response.status(201).send({
                success: true,
                message: "Cadastrado com sucesso",
                data: {
                    Inquilinos: [{
                        idInquilino: novoInquilino.idInquilino || novoInquilino.insertId,
                        nome: inquilinojson.nome,
                        telefone: inquilinojson.telefone,
                        email: inquilinojson.email,
                        requisicao: inquilinojson.requisicao,
                        cpf: inquilinojson.cpf
                    }]
                }
            });
        } catch (error) {
            next(error);
        }
    }

    index = async (request, response, next) => {
        console.log("⬆️  InquilinoControl.index()");
        try {
            // ✅ VERIFIQUE SE ESTÁ USANDO O SERVICE
            const arrayInquilinos = await this.#inquilinoService.findAll();
            
            return response.status(200).send({
                success: true,
                message: "busca realizada com sucesso",
                data: {
                    Inquilinos: arrayInquilinos
                }
            })
        } catch (error) {
            next(error);
        }
    }

    show = async (request, response, next) => {
        console.log("⬆️  InquilinoControl.show()");
        try {
            const inquilinoId = request.params.idInquilino;
            
            // ✅ VERIFIQUE SE ESTÁ USANDO O SERVICE
            const inquilino = await this.#inquilinoService.findbyId(inquilinoId);
            
            return response.status(200).send({
                success: true,
                message: "busca realizada com sucesso",
                data: {
                    Inquilinos: inquilino
                }
            })
        } catch (error) {
            next(error);
        }
    }

    update = async (request, response, next) => {
        console.log("⬆️  InquilinoControl.update()");
        try {
            const inquilinoId = request.params.idInquilino;
            const inquilinoData = request.body.Inquilino || request.body;
            
            const inquilinoAtualizado = await this.#inquilinoService.updateInquilino(
                inquilinoId, 
                inquilinoData.nome, 
                inquilinoData.telefone, 
                inquilinoData.email, 
                inquilinoData.requisicao, 
                inquilinoData.cpf
            );
            
            return response.status(200).send({
                success: true,
                message: "Atualizado com sucesso",
                data: {
                    Inquilinos: inquilinoAtualizado  // ✅ Objeto direto
                }
            })
            
        } catch (error) {
            next(error);
        }
    }

    destroy = async (request, response, next) => {
        console.log("⬆️  InquilinoControl.destroy()");
        try {
            const inquilinoid = request.params.idInquilino;
            await this.#inquilinoService.deleteInquilino(inquilinoid);
            
            return response.status(200).send({
                success: true,
                message: "deletado com sucesso",
                data: null  // ✅ Nada a retornar após deletar
            })
            
        } catch (error) {
            next(error);
        }
    }
}