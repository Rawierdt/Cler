const { SlashCommandBuilder } = require('discord.js');
const { query } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-fc')
    .setDescription('Elimina un cumpleaños registrado')
    .addUserOption(option =>
      option.setName('user') // Aquí es 'user', no 'usuario'
        .setDescription('El usuario cuyo cumpleaños deseas eliminar (opcional)'))
    .addStringOption(option =>
      option.setName('nombre')
        .setDescription('El nombre de la persona si no es un usuario de Discord (opcional)')),

  name: 'remove-fc',
  description: 'Elimina un cumpleaños registrado',

  async executeSlash(interaction) {
    try {
      const user = interaction.options.getUser('user'); // Usar 'user', no 'usuario'
      const nombre = interaction.options.getString('nombre');
      const guildId = interaction.guild.id;

      // Validación: No se puede usar nombre y usuario al mismo tiempo
      if (user && nombre) {
        return interaction.reply({
          content: '❌ No puedes eliminar un usuario y un nombre al mismo tiempo. **Elige solo una opción**.',
          ephemeral: true
        });
      }

      // Definir identificador y nombre para la operación
      let id;
      let displayName;

      if (user) {
        id = user.id;
        displayName = user.username;
      } else if (nombre) {
        id = nombre.toLowerCase();
        displayName = nombre;
      } else {
        id = interaction.user.id;
        displayName = interaction.user.username;
      }

      // Verificar si el cumpleaños existe en la base de datos
      const birthdayExists = await query(
        'SELECT 1 FROM birthdays WHERE guild_id = $1 AND user_id = $2',
        [guildId, id]
      );

      if (birthdayExists.rowCount === 0) {
        return interaction.reply({
          content: `ℹ️ No se encontró un cumpleaños registrado para **${displayName}**.`,
          ephemeral: true
        });
      }

      // Eliminar el cumpleaños de la base de datos
      await query(
        'DELETE FROM birthdays WHERE guild_id = $1 AND user_id = $2',
        [guildId, id]
      );

      await interaction.reply({
        content: `✅ El cumpleaños de **${displayName}** ha sido eliminado exitosamente.`,
        ephemeral: false
      });

    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ Ocurrió un error al intentar eliminar el cumpleaños. Inténtalo nuevamente más tarde.',
        ephemeral: true
      });
    }
  },
};
