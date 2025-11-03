
module.exports = class Chale{
    #idChale;
    #nome;
    #capacidade;



    //Regras de domínio devem ser sempre no set, na parte de atribuição

    constructor(){
        console.log("⬆️ Chale.Constructor()");
    }

    get idChale(){
        return this.#idChale;//Serve para ler o valor e retornar
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

    get nome(){
        return this.#nome;
    }

    set nome(value){
        if(typeof value != "string" ){
            throw new Error("O nome deve ser constituído por caracteres\n");
        }

        const nome = value.trim();  //retira espaços

        if(nome.length<3){
            throw new Error("O nome deve conter mais de 3 carácteres\n");
        }

        if(nome.length>70){
            throw new Error("Nome inválido por ter mais de 70 carácteres\n-");
        }

        this.#nome = nome;
    }

    get capacidade(){
        return this.#capacidade;
    }

    set capacidade(value) {
        const parsed = Number(value);

        if(!Number.isInteger(parsed)){
            throw new Error("A capacidade deve ser um número inteiro\n");
        }
        this.#capacidade = value;
    }

   
}

