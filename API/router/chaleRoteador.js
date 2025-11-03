module.exports = class chaleRoteador {
    #router;
    #chalemiddleware;
    #chaleControl;
    #jwtMiddleware;

    constructor(router, jwtMiddleware, chalemiddleware, chaleControl) {
        this.#router = router;
        this.#jwtMiddleware = jwtMiddleware;
        this.#chalemiddleware = chalemiddleware;
        this.#chaleControl = chaleControl;
    }

    createRoutes = () => {
        // ✅ ADICIONAR JWT MIDDLEWARE NAS ROTAS
        this.#router.post("/",  
            this.#jwtMiddleware.validateToken, // ✅ JWT
            this.#chalemiddleware.validateBody,
            this.#chaleControl.store
        );
        
        this.#router.get("/",  
            this.#jwtMiddleware.validateToken, // ✅ JWT
            this.#chalemiddleware.validateQueryParams,
            this.#chaleControl.index
        );

        this.#router.get("/:idChale",  
            this.#jwtMiddleware.validateToken, // ✅ JWT
            this.#chalemiddleware.validateIdParam,
            this.#chaleControl.show
        );

        this.#router.put("/:idChale",  
            this.#jwtMiddleware.validateToken, // ✅ JWT
            this.#chalemiddleware.validateIdParam,
            this.#chalemiddleware.validateBody,
            this.#chaleControl.update
        );

        this.#router.delete("/:idChale",  
            this.#jwtMiddleware.validateToken, // ✅ JWT
            this.#chalemiddleware.validateIdParam,
            this.#chaleControl.destroy
        );
        
        return this.#router;
    }
}