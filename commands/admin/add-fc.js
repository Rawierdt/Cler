const { SlashCommandBuilder } = require('discord.js');
const { query } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-fc')
    .setDescription('Agrega una fecha de cumpleaños')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('El usuario al que deseas agregar el cumpleaños (opcional)'))
    .addStringOption(option =>
      option.setName('nombre')
        .setDescription('El nombre de la persona si no es un usuario de Discord (opcional)'))
    .addIntegerOption(option =>
      option.setName('día')
        .setDescription('Día del cumpleaños')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('mes')
        .setDescription('Mes del cumpleaños')
        .setRequired(true)),

  name: 'add-fc',
  description: 'Agrega una fecha de cumpleaños',

  async executeSlash(interaction) {
    try {
      const user = interaction.options.getUser('usuario');
      const nombre = interaction.options.getString('nombre');
      const día = interaction.options.getInteger('día');
      const mes = interaction.options.getInteger('mes');
      const guildId = interaction.guild.id;

      // Validar día y mes
      if (día < 1 || día > 31) {
        return interaction.reply({ content: '⚠️ Por favor, ingresa un día válido (1-31).', ephemeral: true });
      }
      if (mes < 1 || mes > 12) {
        return interaction.reply({ content: '⚠️ Por favor, ingresa un mes válido (1-12).', ephemeral: true });
      }

      // Validación de opciones (no se puede usar nombre y usuario al mismo tiempo)
      if (user && nombre) {
        return interaction.reply({ content: '❌ No puedes agregar un usuario y un nombre al mismo tiempo. **Elige solo una opción**.', ephemeral: true });
      }

      // Definir identificador y nombre para almacenar
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

      // Verificar si ya existe un cumpleaños para el mismo identificador
      const birthdayExists = await query(
        'SELECT 1 FROM birthdays WHERE guild_id = $1 AND user_id = $2',
        [guildId, id]
      );

      if (birthdayExists.rowCount > 0) {
        return interaction.reply({ content: `ℹ️ Ya existe un cumpleaños registrado para **${displayName}**.`, ephemeral: true });
      }

      // Verificar si hay un canal de cumpleaños configurado
      const result = await query(
        'SELECT birthday_channel_id FROM config WHERE guild_id = $1',
        [guildId]
      );

      if (result.rowCount === 0) {
        return interaction.reply({
          content: '⚠️ No se ha configurado un canal de cumpleaños. Un administrador debe usar el comando `/set-fc-channel` para definirlo.',
          ephemeral: true
        });
      }

      // Insertar el cumpleaños en la base de datos
      await query(
        'INSERT INTO birthdays (guild_id, user_id, day, month, announced) VALUES ($1, $2, $3, $4, $5)',
        [guildId, id, día, mes, false]
      );

      await interaction.reply({
        content: `✅ El cumpleaños de **${displayName}** ha sido establecido para el **${día}/${mes}**.`,
        ephemeral: false
      });

    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ Ocurrió un error al intentar agregar el cumpleaños. Inténtalo nuevamente más tarde.',
        ephemeral: true
      });
    }
  },
};
