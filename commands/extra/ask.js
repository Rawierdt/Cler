const { SlashCommandBuilder, EmbedBuilder, MessageFlags, Collection } = require('discord.js');
const puppeteer = require('puppeteer');
const COOLDOWN_TIME = 15 * 1000; // 15 segundos
const cooldowns = new Collection();
let browser, page;

(async () => {
    try {
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        page = await browser.newPage();
        await page.goto('https://chat-app-f2d296.zapier.app/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    } catch (error) {
        console.error('Error inicializando Puppeteer:', error);
    }
})();

async function ensurePageReady() {
    try {
        if (!browser || !page) {
            browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            page = await browser.newPage();
            await page.goto('https://chat-app-f2d296.zapier.app/', { waitUntil: 'domcontentloaded', timeout: 60000 });
        }
    } catch (error) {
        console.error('Error reabriendo la página:', error);
        throw new Error('No se pudo inicializar el navegador.');
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
            await ensurePageReady();

            // Escribimos y enviamos el mensaje en la página
            await page.waitForSelector('textarea[placeholder="automate"]', { timeout: 30000 });
            await page.type('textarea[placeholder="automate"]', prompt);
            await page.keyboard.press('Enter');

            // Esperamos que aparezcan los mensajes del bot
            await page.waitForSelector('[data-testid="bot-message"]', { timeout: 5000 });

            // Depuración: Verificar cuántos mensajes se encontraron
            const elements = await page.$$('[data-testid="bot-message"]');
            console.log(`Mensajes encontrados: ${elements.length}`);

            // Extraer el contenido del mensaje
            const value = await page.$$eval('[data-testid="bot-message"]', elements =>
                elements.map(el => el.textContent.trim()).filter(text => text.length > 0)
            );

            // Validar si hay contenido
            if (value.length === 0) throw new Error('No hay respuesta válida del bot.');

            value.shift(); // Remover el primer mensaje si es necesario
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

        cooldowns.set(userId, Date.now());
        setTimeout(() => cooldowns.delete(userId), COOLDOWN_TIME);
    }
};
