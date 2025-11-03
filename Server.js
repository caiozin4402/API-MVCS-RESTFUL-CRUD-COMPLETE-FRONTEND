const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const MysqlDatabase = require('./API/DATABASE/mysqldatabase');

// JWT
const MeuTokenJWT = require('./API/http/meuTokenJWT');
const JwtMiddleware = require('./API/middleware/jwtmiddleware');

// Módulos
const inquilinoDAO = require('./API/DAO/inquilinoDAO');
const inquilinoService = require('./API/service/inquilinoService');
const inquilinoControl = require('./API/Controle/InquilinoControl');    
const inquilinoRoteador = require('./API/router/inquilinoRoteador');
const inquilinomiddleware = require('./API/middleware/inquilinomiddleware');

const chaleDAO = require('./API/DAO/chaleDAO');
const chaleService = require('./API/service/chaleService');
const chaleControl = require('./API/Controle/chaleControl');    
const chaleRoteador = require('./API/router/chaleRoteador');
const chalemiddleware = require('./API/middleware/chalemiddleware');

const reservaDAO = require('./API/DAO/reservaDAO');
const reservaService = require('./API/service/reservaService');
const reservaControl = require('./API/Controle/reservaControl');    
const reservaRoteador = require('./API/router/reservaRoteador');
const reservamiddleware = require('./API/middleware/reservamiddleware');

// Auth
const AuthRoteador = require('./API/router/authRoteador');

module.exports = class Server {
    #porta;
    #app;
    #database;

    // JWT
    #jwtMiddleware;
    #meuTokenJWT;

    // Módulos
    #inquilinoDAO;
    #inquilinoService;
    #inquilinoControl;
    #inquilinoRoteador;
    #inquilinomiddleware;

    #chaleDAO;
    #chaleService;
    #chaleControl;
    #chaleRoteador;
    #chalemiddleware;
    
    #reservaDAO;
    #reservaService;
    #reservaControl;
    #reservaRoteador;
    #reservamiddleware;

    // Auth
    #authRoteador;

    constructor(porta) {
        console.log("⬆️  ServerConstructor()");
        this.#porta = porta ?? 8000;
        
        // Inicializar JWT
        this.#meuTokenJWT = new MeuTokenJWT();
        this.#jwtMiddleware = new JwtMiddleware();
    }

    init = async () => {
        console.log("⬆️  Server.init()");
        this.#app = express();
        
        // CORS
        this.#app.use(cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
            credentials: true
        }));

        // JSON middleware
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));

        // Arquivos estáticos
        this.#app.use(express.static("static"));

        // Conectar ao banco
        try {
            this.#database = new MysqlDatabase({
                host: "localhost",
                user: "root",
                password: "85252317b",
                database: "casa_branca",
                port: 3306,
                waitForConnections: true,
                connectionLimit: 50,
                queueLimit: 10
            });
            
            await this.#database.connect();
            console.log("✅ Conectado ao banco de dados MySQL");
        } catch (error) {
            console.error("❌ Erro ao conectar com o banco:", error);
            throw error;
        }

        // CONFIGURAR AUTH
        await this.setupAuth();

        // Rotas
        this.#setupStaticRoutes();
        await this.setupInquilino();
        await this.setupChale();
        await this.setupReserva();

        console.log("✅ Todas as rotas configuradas");
    }

    // Configurar Auth
    setupAuth = async () => {
        console.log("⬆️  Server.setupAuth()");
        try {
            this.#authRoteador = new AuthRoteador(
                express.Router(),
                this.#database
            );
            
            this.#app.use("/api/v1/auth", this.#authRoteador.createRoutes());
            console.log("✅ Módulo Auth configurado");
        } catch (error) {
            console.error("❌ Erro ao configurar módulo Auth:", error);
            throw error;
        }
    }

    // Rotas estáticas para HTML
    #setupStaticRoutes = () => {
        console.log("⬆️  Configurando rotas estáticas...");
        
        // Rota raiz
        this.#app.get('/', (req, res) => {
            res.sendFile('login.html', { root: './static' });
        });

        // Páginas HTML
        this.#app.get('/Inquilinos.html', (req, res) => {
            res.sendFile('Inquilinos.html', { root: './static' });
        });

        this.#app.get('/Chales.html', (req, res) => {
            res.sendFile('Chales.html', { root: './static' });
        });

        this.#app.get('/Reservas.html', (req, res) => {
            res.sendFile('Reservas.html', { root: './static' });
        });

        this.#app.get('/dashboard.html', (req, res) => {
            res.sendFile('dashboard.html', { root: './static' });
        });
    }

    setupInquilino = async () => {
        console.log("⬆️  Server.setupInquilino()");
        try {
            this.#inquilinoDAO = new inquilinoDAO(this.#database);
            this.#inquilinoService = new inquilinoService(this.#inquilinoDAO);
            this.#inquilinoControl = new inquilinoControl(this.#inquilinoService);
            this.#inquilinomiddleware = new inquilinomiddleware();

            this.#inquilinoRoteador = new inquilinoRoteador(
                express.Router(),
                this.#jwtMiddleware,
                this.#inquilinomiddleware,  
                this.#inquilinoControl
            );
            
            this.#app.use("/api/v1/inquilinos", this.#inquilinoRoteador.createRoutes());
            console.log("✅ Módulo Inquilino configurado");
        } catch (error) {
            console.error("❌ Erro ao configurar módulo Inquilino:", error);
            throw error;
        }
    }

    setupChale = async () => {
        console.log("⬆️  Server.setupChale()");
        try {
            this.#chaleDAO = new chaleDAO(this.#database);
            this.#chaleService = new chaleService(this.#chaleDAO);
            this.#chaleControl = new chaleControl(this.#chaleService);
            this.#chalemiddleware = new chalemiddleware();

            this.#chaleRoteador = new chaleRoteador(
                express.Router(),
                this.#jwtMiddleware,
                this.#chalemiddleware,  
                this.#chaleControl
            );
            
            this.#app.use("/api/v1/chales", this.#chaleRoteador.createRoutes());
            console.log("✅ Módulo Chalé configurado");
        } catch (error) {
            console.error("❌ Erro ao configurar módulo Chalé:", error);
            throw error;
        }
    }

    setupReserva = async () => {
        console.log("⬆️  Server.setupReserva()");
        try {
            this.#reservaDAO = new reservaDAO(this.#database);
            
            if (!this.#inquilinoDAO) {
                this.#inquilinoDAO = new inquilinoDAO(this.#database);
            }
            if (!this.#chaleDAO) {
                this.#chaleDAO = new chaleDAO(this.#database);
            }

            this.#reservaService = new reservaService(
                this.#reservaDAO, 
                this.#inquilinoDAO, 
                this.#chaleDAO
            );
            
            this.#reservaControl = new reservaControl(this.#reservaService);
            this.#reservamiddleware = new reservamiddleware();

            this.#reservaRoteador = new reservaRoteador(
                express.Router(),
                this.#jwtMiddleware,
                this.#reservamiddleware,
                this.#reservaControl
            );
            
            this.#app.use("/api/v1/reservas", this.#reservaRoteador.createRoutes());
            console.log("✅ Módulo Reserva configurado");
        } catch (error) {
            console.error("❌ Erro ao configurar módulo Reserva:", error);
            throw error;
        }
    }

    start = () => {
        this.#app.listen(this.#porta, () => {
            console.log(`🚀 Servidor Node.js rodando na porta ${this.#porta}`);
            console.log(`🏠 Frontend: http://localhost:${this.#porta}/`);
            console.log(`📊 Dashboard: http://localhost:${this.#porta}/dashboard.html`);
            console.log(`👤 Inquilinos: http://localhost:${this.#porta}/Inquilinos.html`);
            console.log(`🏠 Chalés: http://localhost:${this.#porta}/Chales.html`);
            console.log(`📅 Reservas: http://localhost:${this.#porta}/Reservas.html`);
            console.log(`🔐 Auth: http://localhost:${this.#porta}/api/v1/auth/login`);
            console.log(`🔗 API Inquilinos: http://localhost:${this.#porta}/api/v1/inquilinos`);
            console.log(`🔗 API Chalés: http://localhost:${this.#porta}/api/v1/chales`);
            console.log(`🔗 API Reservas: http://localhost:${this.#porta}/api/v1/reservas`);
            console.log(`\n💡 Use: admin@casabranca.com / admin123 para testar`);
        });
    }
}