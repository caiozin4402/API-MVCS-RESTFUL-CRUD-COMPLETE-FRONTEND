const ErrorResponse = require("../utils/errorresponse");
const Reserva = require("../Modelo/reserva");

/**
 * Middleware para validação de requisições relacionadas à entidade Reserva.
 * 
 * Objetivo:
 * - Validar a estrutura das requisições HTTP
 * - Verificar presença de campos obrigatórios
 * - Validar parâmetros de consulta específicos da API
 * - Fornecer feedback claro para o cliente da API
 */
module.exports = class ReservaMiddleware {
    // Constantes para validação da API
    static SORT_FIELDS = ['idInquilino', 'idChale', 'inicio', 'fim'];
    static SORT_ORDERS = ['asc', 'desc'];

    /**
     * Valida o corpo da requisição para operações com Reserva.
     * Foca apenas na estrutura da requisição, deixando validações
     * de domínio para o modelo.
     */
validateBody = (request, response, next) => {
    console.log("🔷 ReservaMiddleware.validateBody()");
    const body = request.body;

    // 👇 ADICIONE - Extrai o objeto Reserva se existir
    const reservaData = body.Reserva || body;
    
    const camposObrigatorios = ["idInquilino", "idChale", "inicio", "fim"];

    for (const campo of camposObrigatorios) {
        if (reservaData[campo] === undefined) {  // 👈 Use reservaData aqui
            throw new ErrorResponse(400, `O campo '${campo}' é obrigatório`);
        }
    }

    // 👇 ATUALIZE o request.body
    request.body = reservaData;
    
    next();
}

    /**
     * Valida o corpo da requisição para login de um funcionário.
     * 
     * Verifica:
     * - Se o objeto 'funcionario' existe
     * - Campos obrigatórios: email, senha
     * - Formato básico de email
     * 
     * @param {Request} request - Objeto de requisição do Express
     * @param {Response} response - Objeto de resposta do Express
     * @param {Function} next - Função next() para passar para o próximo middleware
     * 
     * Lança ErrorResponse com código HTTP 400 em caso de validação falha.
     */
    /**
     * Valida o parâmetro de ID na URL.
     * Apenas verifica se o ID está presente e é um número válido.
     */
    validateIdParam = (request, response, next) => {
        console.log("🔷 ReservaMiddleware.validateIdParam()");
        const { idReserva } = request.params;

        if (!idReserva) {
            throw new ErrorResponse(400, "O parâmetro 'idReserva' é obrigatório");
        }

        const id = Number(idReserva);
        if (isNaN(id)) {
            throw new ErrorResponse(400, "O parâmetro 'idReserva' deve ser um número");
        }

        next();
    }

    /**
     * Valida o parâmetro de rota 'idFuncionario' em requisições que necessitam de identificação do funcionário.
     * 
     * Verifica:
     * - Se o parâmetro 'idFuncionario' foi passado na URL
     * 
     * @param {Request} request - Objeto de requisição do Express
     * @param {Response} response - Objeto de resposta do Express
     * @param {Function} next - Função next() para passar para o próximo middleware
     * 
     * Lança ErrorResponse com código HTTP 400 caso 'idFuncionario' não seja fornecido.
     */
    /**
     * Valida parâmetros de consulta (query params).
     * Lida apenas com aspectos específicos da API.
     */
    validateQueryParams = (request, response, next) => {
        console.log("🔷 ReservaMiddleware.validateQueryParams()");
        const { ordenar_por, ordem, busca } = request.query;

        // Validação de parâmetros de ordenação
        if (ordenar_por !== undefined && !ReservaMiddleware.SORT_FIELDS.includes(ordenar_por)) {
            throw new ErrorResponse(
                400, 
                `Campo de ordenação inválido. Use: ${ReservaMiddleware.SORT_FIELDS.join(', ')}`
            );
        }

        if (ordem !== undefined && !ReservaMiddleware.SORT_ORDERS.includes(ordem.toLowerCase())) {
            throw new ErrorResponse(
                400, 
                `Direção de ordenação inválida. Use: ${ReservaMiddleware.SORT_ORDERS.join(', ')}`
            );
        }

        // Validação básica do termo de busca
        if (busca !== undefined && busca.trim().length < 2) {
            throw new ErrorResponse(400, "O termo de busca deve ter pelo menos 2 caracteres");
        }

        next();
    }
}
