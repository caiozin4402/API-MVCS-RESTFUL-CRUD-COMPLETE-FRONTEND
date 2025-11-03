
module.exports = class Reserva{
    #idReserva;
    #idInquilino;
    #idChale;
    #inicio;
    #fim;



    //Regras de domínio devem ser sempre no set, na parte de atribuição

    constructor(){
        console.log("⬆️ Chale.Constructor()");
    }

    get idReserva (){
        return this.#idReserva;
    }

    set idReserva(value){
        const parsed = Number(value);

        if(!Number.isInteger(parsed)){
            throw new Error("id Inquilino deve ser um número inteiro\n");
        }

        if(parsed<=0){
            throw new Error("id Inquilino deve ser maior que 0\n");
        }
        
        this.#idReserva = value;
    }



    get idInquilino(){
        return this.#idInquilino;//Serve para ler o valor e retornar
    }

    set idInquilino(value){
        const parsed = Number(value);

        if(!Number.isInteger(parsed)){
            throw new Error("id Inquilino deve ser um número inteiro\n");
        }

        if(parsed<=0){
            throw new Error("id Inquilino deve ser maior que 0\n");
        }

        this.#idInquilino = value;//Serve para atribuir valor
    }



    get idChale(){
        return this.#idChale;   //Serve para ler o valor e retornar
    }

    set idChale(value){
        const parsed = Number(value);

        if(!Number.isInteger(parsed)){
            throw new Error("id Chalé deve ser um número inteiro\n");
        }

        if(parsed<=0){
            throw new Error("id Chalé deve ser maior que 0\n");
        }

        this.#idChale = value;  //Serve para atribuir valor
    }

    get inicio(){
        return this.#inicio;
    }

    set inicio(value) {

    // Converte para Date se for string

    const data = new Date(value);
    
    if (isNaN(data.getTime())) {
        throw new Error("Data de início inválida");
    }
    
    // Verifica se é uma data futura (não pode ser no passado)

    const agora = new Date();
    if (data < agora) {
        throw new Error("Data de início não pode ser no passado");
    }
    
    this.#inicio = data;
}

    get fim(){
        return this.#fim
    }

    set fim(value) {
        const dataFim = new Date(value);
        
        if (isNaN(dataFim.getTime())) {
            throw new Error("Data de fim inválida");
        }
        
        // Verifica se a data fim é depois da data início
        if (this.#inicio && dataFim <= this.#inicio) {
            throw new Error("Data de fim deve ser após a data de início");
        }
        
        // Verifica se a reserva tem duração mínima (ex: 1 dia)
        const diffTime = Math.abs(dataFim - this.#inicio);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 1) {
            throw new Error("A reserva deve ter no mínimo 1 dia de duração");
        }
        
        // Verifica se a reserva não excede o máximo (ex: 30 dias)
        if (diffDays > 30) {
            throw new Error("A reserva não pode exceder 30 dias");
        }
        
        this.#fim = dataFim;
    }

   
}

