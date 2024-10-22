const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { query } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('note')
    .setDescription('📝 : Añade una nota a un usuario.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario al que deseas añadir la nota.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('nota')
        .setDescription('Contenido de la nota.')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  name: 'note',
  description: 'Añade una nota a un usuario en el servidor.',

  // Ejecución del comando como Slash Command
  async executeSlash(interaction) {
    const user = interaction.options.getUser('usuario');
    const note = interaction.options.getString('nota');
    const moderatorId = interaction.user.id;
    const guildId = interaction.guild.id;

    await this.addNote(interaction, user, note, guildId, moderatorId);
  },

  // Ejecución del comando como prefijo
  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply('<:win11erroicon:1287543137505378324> | No tienes permisos para añadir notas.');
    }

    // Verificar que se mencionó a un usuario
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('<:440warning:1287542257985126501> | Por favor menciona a un usuario válido.');
    }

    const note = args.slice(1).join(' ') || 'Sin contenido.';
    const moderatorId = message.author.id;
    const guildId = message.guild.id;

    await this.addNote(message, user, note, guildId, moderatorId);
  },

  // Función reutilizable para añadir notas
  async addNote(context, user, note, guildId, moderatorId) {
    try {
      // Verificar si ya existe una nota para este moderador y usuario
      const existingNote = await query(
        `SELECT id FROM user_notes 
         WHERE guild_id = $1 AND user_id = $2 AND moderator_id = $3`,
        [guildId, user.id, moderatorId]
      );

      if (existingNote.rows.length > 0) {
        // Sobrescribir la nota existente
        await query(
          `UPDATE user_notes 
           SET note = $1, timestamp = NOW() 
           WHERE id = $2`,
          [note, existingNote.rows[0].id]
        );

        await context.reply(`Nota actualizada para **${user.tag}**.`);
      } else {
        // Insertar una nueva nota
        await query(
          `INSERT INTO user_notes (guild_id, user_id, moderator_id, note)
           VALUES ($1, $2, $3, $4)`,
          [guildId, user.id, moderatorId, note]
        );

        await context.reply(`Nueva nota añadida para **${user.tag}**.`);
      }

      console.log(`[LOG] ${moderatorId} añadió o actualizó una nota para ${user.tag} en ${guildId}`);
    } catch (error) {
      console.error('Error al añadir la nota:', error);
      context.reply('Hubo un error al añadir la nota.');
    }
  }
};

module.exports.help = {
  name: 'note',
  description: 'Añade una nota a un usuario.',
  usage: 'note <usuario> <nota>',
};
