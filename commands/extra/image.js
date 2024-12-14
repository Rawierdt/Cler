const { SlashCommandBuilder, EmbedBuilder, Collection } = require('discord.js');
const axios = require('axios');
const PQueue = require('p-queue').default;

const COOLDOWN_TIME = 30 * 1000; // 30 segundos
const cooldowns = new Collection();

const queue = new PQueue({ interval: 1000, intervalCap: 1 }); // Límite: 1 solicitud por segundo

async function fetchImage(apiUrl) {
    return queue.add(async () => {
        const response = await axios.get(apiUrl);
        if (!response.data || !response.data.url || !response.data.prompt) {
            throw new Error('Respuesta inválida de la API.');
        }
        return {
            url: response.data.url.trim(),
            prompt: response.data.prompt.trim(),
        };
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('🖼️ : Genera una imagen IA.')
        .addStringOption(option =>
            option.setName('model')
                .setDescription('Modelo a usar para generar la imagen')
                .setRequired(true)
                .addChoices(
                    { name: 'Animefy', value: 'animefy' },
                    { name: 'DALL-E', value: 'v3' },
                    { name: 'Prodia', value: 'prodia' },
                    { name: 'Lexica', value: 'lexica' },
                    { name: 'Raava', value: 'raava' },
                    { name: 'Simurg', value: 'simurg' },
                    { name: 'Shonin', value: 'shonin' }
                )
        )
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Descripción para la generación de la imagen')
                .setRequired(true)
        ),
    async executeSlash(interaction) {
        const userId = interaction.user.id;

        // Verificar cooldown
        const lastUsed = cooldowns.get(userId);
        if (lastUsed && Date.now() - lastUsed < COOLDOWN_TIME) {
            const remaining = ((lastUsed + COOLDOWN_TIME) - Date.now()) / 1000;
            return interaction.reply({
                content: `<:cooldown:1287542331473399949> Debes esperar ${remaining.toFixed(1)} segundos antes de usar este comando nuevamente.`,
                ephemeral: true,
            });
        }

        await interaction.deferReply();

        const model = interaction.options.getString('model');
        const prompt = interaction.options.getString('prompt');

        try {
            const apiUrl = `https://hercai.onrender.com/${model}/text2image?prompt=${encodeURIComponent(prompt)}`;

            // Generar dos imágenes en cola
            const [image1] = await Promise.all([
                fetchImage(apiUrl),
            ]);

            const embed1 = new EmbedBuilder()
                .setTitle('<:completedaquest:1287542357083820096> Imagen 1')
                .setDescription(`**Prompt:** ${prompt}\n**Modelo:** ${model}`)
                .setImage(image1.url)
                .setColor('Green')
                .setFooter({ text: 'Generado con ayuda de Hercai' });

            // const embed2 = new EmbedBuilder()
            //     .setTitle('<:completedaquest:1287542357083820096> Imagen 2')
            //     .setImage(image2.url)
            //     .setColor('Green')
            //     .setFooter({ text: 'Generado con ayuda de Hercai' });

            await interaction.editReply({ embeds: [embed1] });

            // Establecer cooldown
            cooldowns.set(userId, Date.now());
            setTimeout(() => cooldowns.delete(userId), COOLDOWN_TIME);
        } catch (error) {
            console.error('[DEBUG] Error en el comando /image:', error.message);

            await interaction.editReply({
                content: '<:win11warningicon:1287543045289410602> Hubo un problema al generar las imágenes. Porfa, inténtalo de nuevo más tarde.',
            });
        }
    },
};
