const ChaleService = require("../service/chaleService.js");

//A camada de controle conhece o http
//Manda os dados para o service

module.exports = class ChaleControl {
    #chaleService;

    /**
     * 
     * @param {ChaleService} ChaleServiceDependency 
     */
    constructor(ChaleServiceDependency) {
        console.log("⬆️   ChaleControl.constructor()");
        this.#chaleService = ChaleServiceDependency;
    }

    store = async (request, response, next) => {    // POST
        console.log("⬆️  ChaleControl.store()");
        try {
            const novoId = await this.#chaleService.createChale(request.body);
            if (novoId) {
                return response.status(201).send({
                    success: true,
                    message: "Cadastrado com sucesso",
                    data: {
                        Chales: [{
                            idChale: novoId,
                            nomeChale: request.body.nome,
                            capacidade: request.body.capacidade,
                        }]
                    }
                });
            }

        } catch (error) {
            next(error);
        }
    }

    index = async (request, response, next) => {    //GET sem o id
        console.log("⬆️  ChaleControl.index()");
        try {
            const arrayChales = await this.#chaleService.findAll();
            return response.status(200).send({
                success: true,
                message: "busca realizada com sucesso",
                data: {
                    Chales: arrayChales
                }
            })
        }
        catch (error) {
            next(error);
        }

    }

    show = async (request, response, next) => {  //Get com id
        console.log("⬆️  ChaleControl.show()");
        try {
            const ChaleId = request.params.idChale; 
            const Chale = await this.#chaleService.findbyId(ChaleId);
            return response.status(200).send({
                success: true,
                message: "busca realizada com sucesso",
                data: {
                    Chales: Chale
                }
            })
        } catch (error) {
            next(error);
        }
    }

    update = async (request, response, next) => {
        console.log("⬆️  ChaleControl.update()");
        try {
            const ChaleId = request.params.idChale;
            const Chalenome = request.body.nome;
            const Chalecapacidade = request.body.capacidade;

            const atualizou = await this.#chaleService.updateChale(ChaleId, Chalenome, Chalecapacidade);
            if (atualizou) {
                return response.status(200).send({
                    success: true,
                    message: "Atualizado com sucesso",
                    data: {
                        Chales: [{
                            idChales: ChaleId,
                            Chalenome: Chalenome,
                            Chalecapacidade: Chalecapacidade,
                        }]
                    }
                })
            } else {
                return response.status(404).send({
                    success: false,
                    message: "falha ao atualizar",
                    data: {
                        Chales: [{
                            idChales: ChaleId,
                            Chalenome: Chalenome,
                            Chalecapacidade: Chalecapacidade,
                        }]
                    }
                })
            }
        } catch (error) {
            next(error);
        }
    }

    destroy = async (request, response, next) => {
        try {
            const Chaleid = request.params.idChale;
            const excluiu = await this.#chaleService.deleteChale(Chaleid);
            if (excluiu == true) {
                return response.status(204).send({
                    success: true,
                    message: "deletado com sucesso",
                    data: {
                        Chales: [{
                            idChales: Chaleid

                        }]
                    }
                })
            } else {
                return response.status(404).send({
                    success: false,
                    message: "falha ao deletar",
                    data: {
                        Chales: [{
                            idChales: Chaleid
                        }]
                    }
                })
            }
        } catch (error) {
            next(error);
        }
    }
}