module.exports = class ReservaRoteador {
    #router;
    #reservamiddleware;
    #reservaControl;
    #jwtMiddleware;

    constructor(router, jwtMiddleware, reservamiddleware, reservaControl) {
        this.#router = router;
        this.#jwtMiddleware = jwtMiddleware;
        this.#reservamiddleware = reservamiddleware;
        this.#reservaControl = reservaControl;
    }

    createRoutes = () => {
        // ✅ ADICIONAR JWT MIDDLEWARE NAS ROTAS
        this.#router.post("/",  
            this.#jwtMiddleware.validateToken, // ✅ JWT
            this.#reservamiddleware.validateBody,
            this.#reservaControl.store
        );
        
        this.#router.get("/",  
            this.#jwtMiddleware.validateToken, // ✅ JWT
            this.#reservamiddleware.validateQueryParams,
            this.#reservaControl.index
        );

        this.#router.get("/:idReserva",  
            this.#jwtMiddleware.validateToken, // ✅ JWT
            this.#reservamiddleware.validateIdParam,
            this.#reservaControl.show
        );

        this.#router.put("/:idReserva",  
            this.#jwtMiddleware.validateToken, // ✅ JWT
            this.#reservamiddleware.validateIdParam,
            this.#reservamiddleware.validateBody,
            this.#reservaControl.update
        );

        this.#router.delete("/:idReserva",  
            this.#jwtMiddleware.validateToken, // ✅ JWT
            this.#reservamiddleware.validateIdParam,
            this.#reservaControl.destroy
        );
        
        return this.#router;
    }
}