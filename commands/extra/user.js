const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Muestra información sobre un usuario.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Selecciona un usuario.')
        .setRequired(true)),

  async executeSlash(interaction) {
    const user = interaction.options.getUser('usuario');
    const member = interaction.guild.members.cache.get(user.id);
    const bannerURL = await getUserBannerURL(user, interaction.client);

    const embed = new EmbedBuilder()
      .setTitle(`Información de ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .addFields(
        { name: 'ID:', value: user.id, inline: true },
        { name: 'Tag:', value: user.tag, inline: true },
        { name: 'Fecha de creación:', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>` },
        { name: 'Se unió al servidor:', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : 'No en el servidor' }
      )
      .setColor('Random');

    const avatarButton = new ButtonBuilder()
      .setLabel('Avatar')
      .setStyle(ButtonStyle.Link)
      .setURL(user.displayAvatarURL({ dynamic: true, size: 512 }));

    const bannerButton = new ButtonBuilder()
      .setLabel('Banner')
      .setStyle(ButtonStyle.Link)
      .setDisabled(!bannerURL)
      .setURL(bannerURL || 'https://discord.com');

    const row = new ActionRowBuilder().addComponents(avatarButton, bannerButton);

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};

// Función para obtener el banner del usuario.
async function getUserBannerURL(user, client) {
  try {
    const userWithBanner = await client.users.fetch(user.id, { force: true });
    return userWithBanner.bannerURL({ dynamic: true, size: 1024 });
  } catch (error) {
    console.error('Error al obtener el banner:', error);
    return null;
  }
}
