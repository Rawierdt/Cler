module.exports = {
    name: 'test',
    description: 'Responde con la cantidad de comandos activos.',
    async executePrefix(client, message, args) {
        const commandFiles = await client.utils.getFiles('commands');
        const commands = commandFiles.filter(file => file.endsWith('.js'));

        if (commands.length === 0) {    
            return message.reply('No hay comandos activos y funcionando.');
        }
        
        message.reply(`Hay ${commands.length} comandos activos y funcionando.`);
    },
};
