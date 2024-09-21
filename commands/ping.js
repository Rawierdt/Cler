module.exports = {
    name: 'ping',
    description: 'Responde con Pong! y muestra la latencia del bot.',
    async executePrefix(client, message, args) {
        const latency = Date.now() - message.createdTimestamp;
        message.reply(`🏓 Pong! Latencia: ${latency}ms`);
    },
};
