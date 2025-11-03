const ErrorResponse = require("../utils/errorresponse");


/**
 * Middleware para validação de requisições relacionadas à entidade Chalé.
 * 
 * Objetivo:
 * - Validar parâmetros específicos da API (query params, filtros, ordenação)
 * - Garantir formato correto dos dados antes de passar para o modelo
 * - Fornecer mensagens de erro amigáveis para o cliente da API
 */
module.exports = class ChaleMiddleware {
    // Constantes para parâmetros de ordenação
    static SORT_FIELDS = ['nome', 'capacidade'];
    static SORT_ORDERS = ['asc', 'desc'];

    /**
     * Valida o corpo da requisição (request.body) para operações de Chalé.
     * Foca apenas na estrutura da requisição, deixando validações de domínio para o modelo.
     */
    validateBody = (request, response, next) => {
        console.log("🔷 ChaleMiddleware.validateBody()");
        const body = request.body;

        // 👇 ADICIONE - Extrai o objeto Chale se existir
        const chaleData = body.Chale || body;
        
        const { nome, capacidade } = chaleData;  // 👈 Use chaleData aqui
        
        if (nome === undefined) {
            throw new ErrorResponse(400, "O campo 'nome' é obrigatório");
        }

        if (capacidade === undefined) {
            throw new ErrorResponse(400, "O campo 'capacidade' é obrigatório");
        }

        // 👇 ATUALIZE o request.body
        request.body = chaleData;
        
        next();
    }

    /**
     * Valida o parâmetro de rota 'idCargo' em requisições que necessitam de identificação do cargo.
     * 
     * Verifica:
     * - Se o parâmetro 'idCargo' foi passado na URL
     * 
     * @param {Request} request - Objeto de requisição do Express
     * @param {Response} response - Objeto de resposta do Express
     * @param {Function} next - Função next() para passar para o próximo middleware
     * 
     * Lança ErrorResponse com código HTTP 400 caso 'idCargo' não seja fornecido.
     */
    /**
     * Valida o parâmetro de ID na URL.
     * Apenas verifica se o ID está presente e é um número válido.
     */
    validateIdParam = (request, response, next) => {
        console.log("🔷 ChaleMiddleware.validateIdParam()");
        const { idChale } = request.params;

        if (!idChale) {
            throw new ErrorResponse(400, "O parâmetro 'idChale' é obrigatório");
        }

        // ✅ CORREÇÃO: Melhor validação numérica
        const id = Number(idChale);
        if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
            throw new ErrorResponse(400, "O parâmetro 'idChale' deve ser um número inteiro positivo");
        }

        // ✅ CORREÇÃO: Garantir que o ID seja numérico na request
        request.params.idChale = id;

        next();
    }

    /**
     * Valida parâmetros de consulta (query params).
     * Esta função lida apenas com aspectos específicos da API como:
     * - Parâmetros de ordenação
     * - Filtros de busca
     * - Relações entre parâmetros
     */
    validateQueryParams = (request, response, next) => {
        console.log("🔷 ChaleMiddleware.validateQueryParams()");
        const { ordenar_por, ordem } = request.query;

        // Validação de parâmetros de ordenação - específico da API
        if (ordenar_por !== undefined && !ChaleMiddleware.SORT_FIELDS.includes(ordenar_por)) {
            throw new ErrorResponse(
                400, 
                `Campo de ordenação inválido. Use: ${ChaleMiddleware.SORT_FIELDS.join(', ')}`
            );
        }

        if (ordem !== undefined && !ChaleMiddleware.SORT_ORDERS.includes(ordem.toLowerCase())) {
            throw new ErrorResponse(
                400, 
                `Direção de ordenação inválida. Use: ${ChaleMiddleware.SORT_ORDERS.join(', ')}`
            );
        }

        next();
    }
}