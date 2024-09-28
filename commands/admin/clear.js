const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Elimina una cantidad especificada de mensajes en el canal actual.')
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('La cantidad de mensajes a borrar (mínimo 1)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Permisos para gestionar mensajes

  name: 'clear', // Nombre para comandos con prefijo
  description: 'Elimina una cantidad especificada de mensajes en el canal actual.',

  async executeSlash(interaction) {
    const cantidad = interaction.options.getInteger('cantidad');

    await this.clearMessages(interaction, cantidad);
  },

  async executePrefix(message, args) {
    const cantidad = parseInt(args[0], 10);

    await this.clearMessages(message, cantidad);
  },

  async clearMessages(context, cantidad) {
    const isInteraction = !!context.isCommand;

    // Verificar si tiene permisos para gestionar mensajes
    if (!isInteraction && !context.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return context.reply({ content: '<:win11erroicon:1287543137505378324> | No tienes permiso para gestionar mensajes.', ephemeral: true });
    }

    if (isNaN(cantidad) || cantidad < 1) {
      return context.reply({ content: '<:440warning:1287542257985126501> | Debes proporcionar un número válido de mensajes a borrar (mínimo 1).', ephemeral: true });
    }

    // Limitar la cantidad de mensajes a un máximo de 100 (límite de Discord)
    const cantidadBorrar = Math.min(cantidad, 100);

    try {
      const channel = isInteraction ? context.channel : context.channel;
      await channel.bulkDelete(cantidadBorrar, true); // El segundo argumento es para ignorar mensajes mayores a 14 días

      // No se envía mensaje de éxito, como lo solicitaste
    } catch (error) {
      console.error(`[ERROR] No se pudo borrar los mensajes: ${error}`);
      context.reply({ content: 'Hubo un error al intentar borrar los mensajes.', ephemeral: true });
    }
  },
};
