const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const db = require('megadb'); // Asegúrate de que MegaDB esté correctamente instalado y configurado
const configDB = new db.crearDB('config');

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
    // Verificar si el usuario tiene permisos de administrador
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
    }

    const canal = interaction.options.getChannel('canal');

    // Verificar si el canal es un canal de texto
    if (!canal || canal.type !== 0) { // 0 es el tipo de canal de texto
      return interaction.reply({ content: 'Por favor selecciona un canal de texto válido.', ephemeral: true });
    }

    // Verificar si el bot tiene permisos para ver y enviar mensajes en el canal seleccionado
    const botPermissions = canal.permissionsFor(interaction.guild.members.me);
    if (!botPermissions.has(PermissionsBitField.Flags.ViewChannel) || !botPermissions.has(PermissionsBitField.Flags.SendMessages)) {
      return interaction.reply({ content: 'No tengo permisos para ver o enviar mensajes en el canal seleccionado. Por favor, verifica mis permisos.', ephemeral: true });
    }

    // Guardar el canal en la base de datos
    await configDB.set(`birthdayChannel_${interaction.guild.id}`, canal.id);

    await interaction.reply({ content: `Canal de cumpleaños establecido en ${canal}`, ephemeral: true });
  },
};
