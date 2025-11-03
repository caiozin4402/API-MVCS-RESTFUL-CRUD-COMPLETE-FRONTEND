const bcrypt = require('bcrypt');

module.exports = class Usuario {
    constructor() {
        this._idUsuario = null;
        this._nome = null;
        this._email = null;
        this._senha = null;
        this._role = null;
        this._ativo = true;
        this._dataCriacao = null;
    }

    // Getters e Setters
    get idUsuario() {
        return this._idUsuario;
    }

    set idUsuario(valor) {
        const parsed = parseInt(valor);
        if (isNaN(parsed) || parsed <= 0) {
            throw new Error("idUsuario deve ser um número inteiro positivo.");
        }
        this._idUsuario = parsed;
    }

    get nome() {
        return this._nome;
    }

    set nome(value) {
        if (typeof value !== 'string') {
            throw new Error("nome deve ser uma string.");
        }

        const nomeTrim = value.trim();
        if (nomeTrim.length < 3) {
            throw new Error("nome deve ter pelo menos 3 caracteres.");
        }
        this._nome = nomeTrim;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        if (typeof value !== 'string') {
            throw new Error("email deve ser uma string.");
        }

        const emailTrim = value.trim().toLowerCase();
        
        if (emailTrim === "") {
            throw new Error("email não pode ser vazio.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailTrim)) {
            throw new Error("email em formato inválido.");
        }

        this._email = emailTrim;
    }

    get senha() {
        return this._senha;
    }

    set senha(value) {
        if (typeof value !== 'string') {
            throw new Error("senha deve ser uma string.");
        }

        if (value.length < 6) {
            throw new Error("senha deve ter pelo menos 6 caracteres.");
        }

        this._senha = value;
    }

    get role() {
        return this._role;
    }

    set role(value) {
        const rolesPermitidos = ['admin', 'user', 'funcionario'];
        if (!rolesPermitidos.includes(value)) {
            throw new Error(`role deve ser um dos valores: ${rolesPermitidos.join(', ')}`);
        }
        this._role = value;
    }

    get ativo() {
        return this._ativo;
    }

    set ativo(value) {
        this._ativo = Boolean(value);
    }

    get dataCriacao() {
        return this._dataCriacao;
    }

    set dataCriacao(value) {
        this._dataCriacao = value;
    }

    // Métodos de instância
    async hashSenha() {
        if (this._senha) {
            const saltRounds = 12;
            this._senha = await bcrypt.hash(this._senha, saltRounds);
        }
    }

    async verificarSenha(senhaPlain) {
        if (!this._senha) {
            return false;
        }
        return await bcrypt.compare(senhaPlain, this._senha);
    }

    validar() {
        const errors = [];

        if (!this._nome) errors.push("Nome é obrigatório");
        if (!this._email) errors.push("Email é obrigatório");
        if (!this._senha) errors.push("Senha é obrigatória");
        if (!this._role) errors.push("Role é obrigatória");

        if (errors.length > 0) {
            throw new Error(`Erros de validação: ${errors.join(', ')}`);
        }

        return true;
    }
}
