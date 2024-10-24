const { SlashCommandBuilder, EmbedBuilder, MessageFlags, Collection } = require('discord.js');
const puppeteer = require('puppeteer');
const COOLDOWN_TIME = 15 * 1000; // 15 segundos
const cooldowns = new Collection();
let browser; // Mantenemos la instancia del navegador globalmente

(async () => {
    browser = await puppeteer.launch({ headless: true });
})();

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
        if (cooldowns.has(userId)) {
            const remaining = ((cooldowns.get(userId) + COOLDOWN_TIME) - Date.now()) / 1000;
            return interaction.reply({
                content: `⏳ Debes esperar ${remaining.toFixed(1)} segundos antes de usar este comando nuevamente.`,
                ephemeral: true
            });
        }

        await interaction.deferReply();
        const prompt = interaction.options.getString('prompt');
        try {
            if (!browser) { // Reabrir el navegador si no está abierto
                browser = await puppeteer.launch({ headless: true });
            }
            const page = await browser.newPage();
            await page.goto('https://chat-app-f2d296.zapier.app/', { waitUntil: 'networkidle2' });
            await page.waitForSelector('textarea[placeholder="automate"]', { timeout: 30000 });
            await page.type('textarea[placeholder="automate"]', prompt);
            await page.keyboard.press('Enter');
            await page.waitForSelector('[data-testid="bot-message"]', { timeout: 5000 });
            const value = await page.$$eval('[data-testid="bot-message"]', elements =>
                elements.map(el => el.textContent)
            );

            if (value.length === 0) throw new Error('No hay respuesta del bot.');

            value.shift();
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
            // Cerrar la página en lugar del navegador
            if (browser) await browser.pages().then(pages => pages.forEach(page => page.close()));
        }

        cooldowns.set(userId, Date.now());
        setTimeout(() => cooldowns.delete(userId), COOLDOWN_TIME);
    }
};
