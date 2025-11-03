const MeuTokenJWT = require("../http/meuTokenJWT"); 

module.exports = class JwtMiddleware {

    validateToken = (request, response, next) => {
        console.log("🔷 JwtMiddleware.validateToken()");
        const authorization = request.headers.authorization;    //verifica se o token existe

        // ✅ VERIFICAÇÃO MAIS ROBUSTA
        if (!authorization) {
            return response.status(401).json({
                success: false,
                error: { message: "Token não fornecido" }
            });
        }
        // Gera um novo token se o token for válido
        const jwt = new MeuTokenJWT();
        const autorizado = jwt.validarToken(authorization);

        if (autorizado === true) {
            const payload = jwt.payload;
            const obj = {
                email: payload.email,
                role: payload.role,
                name: payload.name,
                idFuncionario: payload.idFuncionario
            };

            // ✅ ATUALIZAR TOKEN NO HEADER
            const novoToken = jwt.gerarToken(obj);
            request.headers.authorization = `Bearer ${novoToken}`;
            
            // ✅ ADICIONAR DADOS DO USUÁRIO NA REQUEST
            request.user = obj;

            next(); // Prossegue para o próximo middleware ou controller
        } else {
            // ✅ RESPOSTA PADRÃO COM SUCCESS: FALSE
            return response.status(401).json({
                success: false,
                error: { message: "Token inválido ou expirado" }
            });
        }
    }
}