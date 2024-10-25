const { SlashCommandBuilder, EmbedBuilder, MessageFlags, Collection } = require('discord.js');
const puppeteer = require('puppeteer');
const COOLDOWN_TIME = 15 * 1000;
const cooldowns = new Collection();
let browser, page;

(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('https://chat-app-f2d296.zapier.app/', { waitUntil: 'networkidle2' });
})();

async function ensurePageReady() {
    if (!browser || !page) {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
        await page.goto('https://chat-app-f2d296.zapier.app/', { waitUntil: 'networkidle2' });
    }
}

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

        // Verificar cooldown antes de proceder
        const lastUsed = cooldowns.get(userId);
        if (lastUsed && Date.now() - lastUsed < COOLDOWN_TIME) {
            const remaining = ((lastUsed + COOLDOWN_TIME) - Date.now()) / 1000;
            return interaction.reply({
                content: `⏳ Debes esperar ${remaining.toFixed(1)} segundos antes de usar este comando nuevamente.`,
                ephemeral: true
            });
        }

        await interaction.deferReply();
        const prompt = interaction.options.getString('prompt');

        try {
            // Asegurar que la página esté lista
            await ensurePageReady();

            await page.waitForSelector('textarea[placeholder="automate"]', { timeout: 30000 });
            await page.type('textarea[placeholder="automate"]', prompt);
            await page.keyboard.press('Enter');

            await page.waitForSelector('[data-testid="bot-message"]', { timeout: 5000 });
            const value = await page.$$eval('[data-testid="bot-message"]', elements =>
                elements.map(el => el.textContent)
            );

            if (value.length === 0) throw new Error('No hay respuesta del bot.');

            value.shift(); // Remover mensaje inicial si es necesario
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
        }

        // Registrar el uso del comando y configurar cooldown
        cooldowns.set(userId, Date.now());
        setTimeout(() => cooldowns.delete(userId), COOLDOWN_TIME);
    }
};
