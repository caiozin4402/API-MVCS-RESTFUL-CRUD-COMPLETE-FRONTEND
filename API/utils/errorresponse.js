
module.exports = class errorresponse extends Error{//Herda caracteriísticas da classe error do javasscript
    #httpCode;
    #name;
    #error;
    constructor(httpCode, message, error = null){
        super(message);
        this.#name = "ErrorResponse";
        this.#httpCode = httpCode;
        this.#error = error;

    }

    get name(){
        return this.#name;
    }

    get httpCode(){
        return this.#httpCode;
    }

    get error(){
        return this.#error;
    }
    }
