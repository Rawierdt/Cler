require('dotenv').config();
const { EmbedBuilder } = require('discord.js');
const beautify = require('beautify');
const fetch = require('node-fetch');
const { query } = require('../../db');
const { checkBirthdays, resetAnnouncedBirthdays } = require('../../utils');
const path = require('path');
const utilsPath = path.resolve(__dirname, 'utils.js'); 
const fs = require('fs');
const cron = require('node-cron');
const chalk = require('chalk');

module.exports = {
  name: 'clseval',
  description: 'Ejecuta código directamente en Discord. (Solo para desarrolladores)',
  async executePrefix(client, message, args) {
    const dev = process.env.OWNER;

    if (!dev) {
      console.error('ID del owner no está configurado en .env');
      return message.channel.send('Error de configuración: Falta el ID del owner.');
    }

    if (message.author.id !== dev) {
      return message.reply('No eres un desarrollador, no puedes ejecutar código.');
    }

    if (!args[0]) {
      return message.channel.send('Por favor proporciona algo de código para evaluar.');
    }

    try {
      const code = args.join(' ');

      // Evita exponer el token del bot
      if (code.toLowerCase().includes('token')) {
        return message.channel.send('No, no puedo darte mi token. ¡Buen intento!');
      }

      // Usamos await para manejar promesas correctamente
      let evaluated = await eval(`(async () => { ${code} })()`);

      // Convertimos el resultado en string para evitar errores
      if (typeof evaluated !== 'string') {
        evaluated = require('util').inspect(evaluated, { depth: 1 });
      }

      // Crear el embed con los resultados de la evaluación
      const embed = new EmbedBuilder()
        .setColor('Purple')
        .setTimestamp()
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTitle('Evaluación de Código')
        .addFields(
          { name: 'Código:', value: `\`\`\`js\n${beautify(code, { format: 'js' })}\n\`\`\`` },
          { name: 'Resultado:', value: `\`\`\`js\n${evaluated}\n\`\`\`` },
          { name: 'Tipo:', value: `\`\`\`\n${typeof evaluated}\n\`\`\`` }
        );

      return message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error al evaluar el código:', error);

      return message.channel.send({
        content: `ERROR!\n\`\`\`js\n${error.message}\n\`\`\``,
      });
    }
  },
};
