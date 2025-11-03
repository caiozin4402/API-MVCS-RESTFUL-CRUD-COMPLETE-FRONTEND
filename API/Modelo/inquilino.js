
module.exports = class Inquilino{
    #idInquilino;
    #nome;
    #telefone;
    #email;
    #requisicao;
    #cpf;


    //Regras de domínio devem ser sempre no set, na parte de atribuição

    constructor(){
        console.log("⬆️ Inquilino.Constructor()");
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

    get nome(){
        return this.#nome;
    }

    set nome(value){
        if(typeof value != "string" ){
            throw new Error("O nome deve ser constituído por caracteres\n");
        }

        const nome = value.trim();//retira espaços

        if(nome.length<3){
            throw new Error("O nome deve conter mais de 3 carácteres\n");
        }

        if(nome.length>70){
            throw new Error("Nome inválido por ter mais de 70 carácteres\n-");
        }

        this.#nome = nome;
    }

    get telefone(){
        return this.#telefone;
    }

    set telefone(value) {
        function validarTelefone(telefone) {
            const numeroLimpo = telefone.replace(/\D/g, "");
            if (!/^(\d{10}|\d{11})$/.test(numeroLimpo)) {
                throw new Error("Telefone inválido. Deve conter 10 ou 11 dígitos.\n");
            }
            return true;
        }

        validarTelefone(value); // valida o valor passado
        this.#telefone = value; // salva no atributo privado
    }

    get email(){
        return this.#email;
    }

    set email(value){
        function validarEmail(value){
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//Regra de negócio/ MUDAR DEPOIS PARA O SERVICE
            if (!re.test(value)) {
                throw new Error("E-mail inválido\n");
            }
        }

        validarEmail(value);
        this.#email = value;      
    }

    get requisicao(){
        return this.#requisicao; //Basicamente um comentário do cliente(OPCIONAL)
    }

    set requisicao(value){
        this.#requisicao = value;
    }

    get cpf(){
        return this.#cpf;
    }

    set cpf(value){
        this.#cpf = value;
    }
    //CPF(talvez eu faça, vou confirmar)



}

//É interessante fazer uma para reservas!!!!!
//Arrumar esse banco de dados Varzea