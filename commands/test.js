module.exports = {
    name: 'test',
    description: 'Responde con la cantidad de comandos activos.',
    async executePrefix(client, message, args) {
        message.reply(`Se encontrarón **${message.client.commands.size}** comandos funcionando con normalidad!`);
    },
};
