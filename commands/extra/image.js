const { SlashCommandBuilder, EmbedBuilder, Collection } = require('discord.js');
const axios = require('axios');

const COOLDOWN_TIME = 30 * 1000; // 30 segundos
const cooldowns = new Collection();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('🖼️ : Genera una imagen IA.')
        .addStringOption(option =>
            option.setName('model')
                .setDescription('Modelo a usar para generar la imagen')
                .setRequired(true)
                .addChoices(
                    { name: 'Shonin', value: 'shonin' },
                    { name: 'Animefy', value: 'animefy' },
                    { name: 'Raava', value: 'raava' },
                    { name: 'Prodia', value: 'prodia' }
                )
        )
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Descripción para la generación de la imagen')
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

        const model = interaction.options.getString('model'); // Modelo elegido
        const prompt = interaction.options.getString('prompt'); // Prompt proporcionado por el usuario

        try {
            const apiUrl = `https://hercai.onrender.com/${model}/text2image?prompt=${encodeURIComponent(prompt)}`;
            console.log(`[DEBUG] Solicitando a la API: ${apiUrl}`);

            const response = await axios.get(apiUrl);
            console.log('[DEBUG] Respuesta completa de la API:', response.data);

            if (!response.data || !response.data.url || !response.data.prompt) {
                console.error('[DEBUG] Respuesta inválida de la API:', response.data);
                throw new Error('Respuesta inválida de la API.');
            }

            const imageUrl = response.data.url.trim();
            const promptUsed = response.data.prompt.trim();

            const embed = new EmbedBuilder()
                .setTitle('<:completedaquest:1287542357083820096> Este es el resultado')
                .setDescription(`**Prompt:** ${promptUsed}\n**Modelo:** ${model}`)
                .setImage(imageUrl)
                .setColor('Green')
                .setFooter({ text: 'Generado con ayuda de Hercai' });

            await interaction.editReply({ embeds: [embed] });

            cooldowns.set(userId, Date.now());
            setTimeout(() => cooldowns.delete(userId), COOLDOWN_TIME);
        } catch (error) {
            console.error('[DEBUG] Error en el comando /image:', error.message);

            await interaction.editReply({
                content: '<:win11warningicon:1287543045289410602> Hubo un problema al generar la imagen. Por favor, inténtalo de nuevo más tarde.'
            });
        }
    }
};
