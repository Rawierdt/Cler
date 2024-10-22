const { SlashCommandBuilder, EmbedBuilder, MessageFlags, Collection } = require('discord.js');
const puppeteer = require('puppeteer');

// Cooldown entre comandos (en milisegundos)
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

        // Verificar si el usuario tiene cooldown
        if (cooldowns.has(userId)) {
            const remaining = ((cooldowns.get(userId) + COOLDOWN_TIME) - Date.now()) / 1000;
            return interaction.reply({
                content: `⏳ Debes esperar ${remaining.toFixed(1)} segundos antes de usar este comando nuevamente.`,
                ephemeral: true
            });
        }

        await interaction.deferReply(); // Asegura que el bot se muestra "pensando".

        const prompt = interaction.options.getString('prompt');
        let browser;

        try {
            // Lanzar Puppeteer en modo headless
            browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            // Navegar a la página requerida
            await page.goto('https://chat-app-f2d296.zapier.app/', { waitUntil: 'networkidle2' });

            // Esperar que el textarea esté listo y escribir el prompt
            await page.waitForSelector('textarea[placeholder="automate"]', { timeout: 60000 });
            await page.focus('textarea[placeholder="automate"]');
            await page.keyboard.type(prompt);
            await page.keyboard.press('Enter');

            // Esperar la respuesta del bot
            await page.waitForSelector('[data-testid="bot-message"]', { timeout: 10000 });
            const value = await page.$$eval('[data-testid="bot-message"]', elements =>
                elements.map(el => el.textContent)
            );

            if (value.length === 0) throw new Error('No hay respuesta del bot.');

            value.shift(); // Eliminar el primer mensaje si es irrelevante

            const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setDescription(`\`\`\`${value.join('\n\n')}\`\`\``);

            await interaction.editReply({
                embeds: [embed],
                flags: MessageFlags.SuppressEmbeds
            });
        } catch (error) {
            console.error('Error en el comando /ask:', error);
            await interaction.editReply({
                content: '❌ No puedo responder eso ahora, inténtalo más tarde.'
            });
        } finally {
            if (browser) await browser.close(); // Cerrar el navegador para evitar fugas de memoria.
        }

        // Establecer cooldown para el usuario
        cooldowns.set(userId, Date.now());
        setTimeout(() => cooldowns.delete(userId), COOLDOWN_TIME);
    }
};
