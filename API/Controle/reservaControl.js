const Reserva = require("../Modelo/reserva.js");
const ReservaService = require("../service/reservaService.js");

//A camada de controle conhece o http
//Manda os dados para o service

module.exports = class ReservaControl {
    #reservaService;

    /**
     * 
     * @param {ReservaService} ReservaServiceDependency 
     */
    constructor(ReservaServiceDependency) {
        console.log("⬆️   ReservaControl.constructor()");
        this.#reservaService = ReservaServiceDependency;
    }

    store = async (request, response, next) => {
    console.log("⬆️  ReservaControl.store()");
    try {
        const Reservajson = request.body.Reserva || request.body;   // ✅ CORREÇÃO
        const novoId = await this.#reservaService.createReserva(Reservajson);
        
        if (novoId) {
            return response.status(201).send({
                success: true,
                message: "Reserva cadastrada com sucesso",
                data: {
                    reservas: [{  // ✅ MANTÉM "reservas" minúsculo (consistente)
                        idReserva: novoId,
                        idInquilino: Reservajson.idInquilino,
                        idChale: Reservajson.idChale,
                        inicio: Reservajson.inicio || Reservajson.dataEntrada, // ✅ CORREÇÃO
                        fim: Reservajson.fim || Reservajson.dataSaida          // ✅ CORREÇÃO
                    }]
                }
            });
        }
    } catch (error) {
        next(error);
    }
}

index = async (request, response, next) => {
    console.log("⬆️  ReservaControl.index()");
    try {
        const arrayReserva = await this.#reservaService.findAll();
        return response.status(200).send({
            success: true,
            message: "Busca realizada com sucesso",
            data: {
                reservas: arrayReserva  // ✅ MANTÉM "reservas" minúsculo
            }
        })
    } catch (error) {
        next(error);
    }
}

    show = async (request, response, next) => {  //Get com id
        console.log("⬆️  ReservaControl.show()");
        try {
            const ReservaId = request.params.idReserva; 
            const reserva = await this.#reservaService.findbyId(ReservaId);
            
            if (!reserva) {
                return response.status(404).send({
                    success: false,
                    message: "Reserva não encontrada",
                    data: { reserva: null }
                });
            }

            return response.status(200).send({
                success: true,
                message: "Busca realizada com sucesso",
                data: {
                    reserva: reserva
                }
            })
        } catch (error) {
            next(error);
        }
    }

    update = async (request, response, next) => {
        console.log("⬆️  ReservaControl.update()");
        try {
            const ReservaId = request.params.idReserva;
            const Inquilinoid = request.body.idInquilino;
            const Chaleid = request.body.idChale;
            const inicio = request.body.inicio;
            const fim = request.body.fim;

            const atualizou = await this.#reservaService.updateReserva(ReservaId, Inquilinoid, Chaleid, inicio, fim);
            if (atualizou) {
                return response.status(200).send({
                    success: true,
                    message: "Atualizado com sucesso",
                    data: {
                        reserva: {
                            idReserva: ReservaId,
                            idInquilino: Inquilinoid,
                            idChale: Chaleid,
                            inicio: inicio,
                            fim: fim
                        }
                    }
                });
            } else {
                return response.status(404).send({
                    success: false,
                    message: "Reserva não encontrada",
                    data: {
                        reserva: {
                            idReserva: ReservaId,
                            idInquilino: Inquilinoid,
                            idChale: Chaleid,
                            inicio: inicio,
                            fim: fim
                        }
                    }
                });
            }
        } catch (error) {
            next(error);
        }
    }

    destroy = async (request, response, next) => {
        try {
            const Reservaid = request.params.idReserva;
            const excluiu = await this.#reservaService.deleteReserva(Reservaid);
            if (excluiu) {
                // Status 204 não deve ter corpo de resposta
                return response.status(204).send();
            } else {
                return response.status(404).send({
                    success: false,
                    message: "Reserva não encontrada",
                    data: {
                        reserva: {
                            idReserva: Reservaid
                        }
                    }
                });
            }
        } catch (error) {
            next(error);
        }
    }
}