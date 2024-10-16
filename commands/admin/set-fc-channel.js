const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { query } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-fc-channel')
    .setDescription('Define el canal donde se anunciarán los cumpleaños')
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('El canal para los anuncios de cumpleaños')
        .setRequired(true)),

  name: 'set-fc-channel', // Para comandos con prefijo
  description: 'Define el canal de anuncios de cumpleaños',

  async executeSlash(interaction) {
    await interaction.deferReply({ ephemeral: true });

    // Verificar permisos del usuario
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.editReply({ 
        content: '<:win11erroicon:1287543137505378324> | No tienes permisos para usar este comando.' 
      });
    }

    const canal = interaction.options.getChannel('canal');

    // Verificar si es un canal de texto
    if (!canal || canal.type !== 0) {
      return interaction.editReply({ 
        content: '<:440warning:1287542257985126501> | Por favor selecciona un canal de texto válido.' 
      });
    }

    // Verificar si el bot tiene permisos en el canal
    const botPermissions = canal.permissionsFor(interaction.guild.members.me);
    if (
      !botPermissions.has(PermissionsBitField.Flags.ViewChannel) || 
      !botPermissions.has(PermissionsBitField.Flags.SendMessages)
    ) {
      return interaction.editReply({ 
        content: '<:440warning:1287542257985126501> | No tengo permisos para ver o enviar mensajes en el canal seleccionado. Por favor, verifica mis permisos.' 
      });
    }

    // Guardar el canal en PostgreSQL
    try {
      await query(
        `INSERT INTO config (guild_id, birthday_channel_id)
         VALUES ($1, $2)
         ON CONFLICT (guild_id) 
         DO UPDATE SET birthday_channel_id = EXCLUDED.birthday_channel_id`,
        [interaction.guild.id, canal.id]
      );

      await interaction.editReply({ 
        content: `<:win11checkicon:1287543060015612046> | Canal de cumpleaños establecido en <a:heartarrow_purple:1287542898266607669> ${canal}` 
      });
    } catch (error) {
      console.error('Error al guardar el canal en la base de datos:', error);
      await interaction.editReply({ 
        content: 'Hubo un error al guardar el canal en la base de datos. Inténtalo nuevamente más tarde.' 
      });
    }
  },
};
