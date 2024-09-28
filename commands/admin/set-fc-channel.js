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
      return interaction.reply({ content: '<:win11erroicon:1287543137505378324> No tienes permisos para usar este comando.', ephemeral: true });
    }

    const canal = interaction.options.getChannel('canal');

    // Verificar si el canal es un canal de texto
    if (!canal || canal.type !== 0) { // 0 es el tipo de canal de texto
      return interaction.reply({ content: '<:440warning:1287542257985126501> Por favor selecciona un canal de texto válido.', ephemeral: true });
    }

    // Verificar si el bot tiene permisos para ver y enviar mensajes en el canal seleccionado
    const botPermissions = canal.permissionsFor(interaction.guild.members.me);
    if (!botPermissions.has(PermissionsBitField.Flags.ViewChannel) || !botPermissions.has(PermissionsBitField.Flags.SendMessages)) {
      return interaction.reply({ content: '<:440warning:1287542257985126501> No tengo permisos para ver o enviar mensajes en el canal seleccionado. Por favor, verifica mis permisos. <:toggleon:1287542502613712990>', ephemeral: true });
    }

    // Guardar el canal en la base de datos
    await configDB.set(`birthdayChannel_${interaction.guild.id}`, canal.id);

    await interaction.reply({ content: `<:win11checkicon:1287543060015612046> Canal de cumpleaños establecido en <a:heartarrow_purple:1287542898266607669> ${canal}`, ephemeral: true });
  },
};
