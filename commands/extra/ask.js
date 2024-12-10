const { SlashCommandBuilder, EmbedBuilder, MessageFlags, Collection } = require('discord.js');
const axios = require('axios');
const COOLDOWN_TIME = 15 * 1000; // 15 segundos
const cooldowns = new Collection();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('⁉️ : Haz una pregunta a Cler')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('¿Cuál es tu pregunta?')
                .setRequired(true)
        ),
    async executeSlash(interaction) {
        const userId = interaction.user.id;

        const lastUsed = cooldowns.get(userId);
        if (lastUsed && Date.now() - lastUsed < COOLDOWN_TIME) {
            const remaining = ((lastUsed + COOLDOWN_TIME) - Date.now()) / 1000;
            return interaction.reply({
                content: `<:cooldown:1287542331473399949> Debes esperar ${remaining.toFixed(1)} segundos antes de usar este comando nuevamente.`,
                ephemeral: true
            });
        }

        await interaction.deferReply();
        const prompt = interaction.options.getString('prompt');

        try {
            const apiUrl = `https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(prompt)}`;
            console.log(`[DEBUG] Solicitando a la API: ${apiUrl}`);

            const response = await axios.get(apiUrl);
            console.log('[DEBUG] Respuesta completa de la API:', response.data);

            if (!response.data || !response.data.reply) {
                console.error('[DEBUG] La respuesta no tiene el campo "reply".');
                throw new Error('Respuesta inválida de la API.');
            }

            const reply = response.data.reply.trim();
            console.log(`[DEBUG] Respuesta "reply" extraída: "${reply}"`);

            if (!reply) {
                throw new Error('El campo "reply" está vacío.');
            }

            await interaction.editReply({
                content: reply,
                flags: MessageFlags.SuppressEmbeds
            });
        } catch (error) {
            console.error('[DEBUG] Error en el comando /ask:', error.message);

            await interaction.editReply({
                content: '<:win11warningicon:1287543045289410602> No puedo responder eso ahora, inténtalo en un rato.'
            });
        }

        cooldowns.set(userId, Date.now());
        setTimeout(() => cooldowns.delete(userId), COOLDOWN_TIME);
    }
};
