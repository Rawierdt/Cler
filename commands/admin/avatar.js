const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
  data: [
    new SlashCommandBuilder()
      .setName('avatar')
      .setDescription('Muestra el avatar de un usuario.')
      .addUserOption(option =>
        option.setName('user')
          .setDescription('El usuario del que deseas ver el avatar.')
          .setRequired(false)),
    new ContextMenuCommandBuilder()
      .setName('Ver Avatar')
      .setType(ApplicationCommandType.User),
  ],

  name: 'avatar', // Nombre para comandos con prefijo
  description: 'Muestra el avatar de un usuario.',

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    await this.sendAvatarMessage(interaction, user);
  },

  async executeContextMenu(interaction) {
    const user = interaction.targetUser;
    await this.sendAvatarMessage(interaction, user);
  },

  async executePrefix(message, args) {
    const user = message.mentions.users.first() || message.author;
    await this.sendAvatarMessage(message, user);
  },

  async sendAvatarMessage(context, user) {
    const avatarEmbed = new EmbedBuilder()
      .setColor(0x0099ff) // Azul
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setFooter({ text: `ID: ${user.id}` })
      .setTimestamp();

    // Envía la respuesta directamente
    await context.reply({ embeds: [avatarEmbed] });
  },
};
