const fetch = require('node-fetch');
const { query } = require('../../db');
const { checkBirthdays, resetAnnouncedBirthdays } = require('../../utils');
const path = require('path');
const utilsPath = path.resolve(__dirname, 'utils.js'); 
const fs = require('fs');
const cron = require('node-cron');
const chalk = require('chalk');
require('dotenv').config();
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const beautify = require('beautify');
const { inspect } = require('util'); // Para inspeccionar objetos grandes

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

      if (code.toLowerCase().includes('token')) {
        return message.channel.send('No, no puedo darte mi token. ¡Buen intento!');
      }

      let evaluated;

      const asyncEval = async () => {
        return await eval(`(async () => { 
          try { 
            return ${code}; 
          } catch (err) { 
            return err.message; 
          } 
        })()`);
      };

      evaluated = await asyncEval();

      // Si el resultado no es cadena, lo inspeccionamos
      if (typeof evaluated !== 'string') {
        evaluated = inspect(evaluated, { depth: 1 });
      }

      // Limitamos la longitud del resultado a 1024 caracteres
      if (evaluated.length > 1024) {
        const attachment = new AttachmentBuilder(Buffer.from(evaluated), {
          name: 'resultado.txt',
        });

        return message.channel.send({
          content: 'El resultado es muy largo, aquí está como archivo:',
          files: [attachment],
        });
      }

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
