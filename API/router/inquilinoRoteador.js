module.exports = class inquilinoRoteador {
    #router;
    #inquilinomiddleware;
    #inquilinoControl;
    #jwtMiddleware;

    constructor(router, jwtMiddleware, inquilinomiddleware, inquilinoControl) {
        this.#router = router;
        this.#jwtMiddleware = jwtMiddleware;
        this.#inquilinomiddleware = inquilinomiddleware;
        this.#inquilinoControl = inquilinoControl;
    }

    createRoutes = () => {
        this.#router.post("/",  
            this.#jwtMiddleware.validateToken,
            this.#inquilinomiddleware.validateBody,
            this.#inquilinoControl.store
        );
        

        this.#router.get("/",  
            this.#jwtMiddleware.validateToken,
            this.#inquilinomiddleware.validateQueryParams,
            this.#inquilinoControl.index
        );

        this.#router.get("/:idInquilino",  
            this.#jwtMiddleware.validateToken,
            this.#inquilinomiddleware.validateIdParam,
            this.#inquilinoControl.show
        );

        this.#router.put("/:idInquilino",  
            this.#jwtMiddleware.validateToken,
            this.#inquilinomiddleware.validateIdParam,
            this.#inquilinomiddleware.validateBody,
            this.#inquilinoControl.update
        );

        this.#router.delete("/:idInquilino",  
            this.#jwtMiddleware.validateToken,
            this.#inquilinomiddleware.validateIdParam,
            this.#inquilinoControl.destroy
        );
        
        return this.#router;
    }
}