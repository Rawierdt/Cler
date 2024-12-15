const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { query } = require('../../db');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Ver Cumpleaños')
    .setType(ApplicationCommandType.User),
  async executeContextMenu(interaction) {
    const user = interaction.targetUser;
    const guildId = interaction.guild.id;

    await interaction.deferReply();

    try {
      const res = await query('SELECT day, month FROM birthdays WHERE guild_id = $1 AND user_id = $2', [guildId, user.id]);

      if (res.rows.length === 0) {
        await interaction.editReply(`<:440warning:1287542257985126501> : No se ha encontrado un cumpleaños para **${user.username}** en este servidor.`);
      } else {
        const { day, month } = res.rows[0];

        const birthdayEmbed = new EmbedBuilder()
          .setColor(0x00AE86)
          .setTitle(`Cumpleaños de ${user.username}`)
          .setDescription(`<a:hb_cake:1287508450250719232> : El cumpleaños de *${user.username}* es el **${day}/${month}**.`)
          .setThumbnail(user.displayAvatarURL())
          //.setImage('https://i.pinimg.com/originals/5f/80/12/5f801271cbdff678b97e802fe25555f6.gif')
          .setTimestamp()
          .setFooter({ text: 'Solicitado por ' + interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

        await interaction.editReply({ embeds: [birthdayEmbed] });
      }
    } catch (err) {
      console.error('Error ejecutando la consulta:', err);
      await interaction.editReply('<:440warning:1287542257985126501> : Ocurrió un error al intentar recuperar el cumpleaños.');
    }
  },
};
