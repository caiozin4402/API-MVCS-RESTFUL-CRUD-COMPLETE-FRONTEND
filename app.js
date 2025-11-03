const Server = require('./Server');

(async () => {
    try {
        const server = new Server(8000);
        await server.init();
        server.start();
        
        console.log("✅ Servidor inicializado com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao iniciar servidor:", error);
        process.exit(1); // Encerra o processo com erro
    }
})();