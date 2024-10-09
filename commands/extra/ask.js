const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Has una pregunta para Cler')
        .addStringOption(option => option.setName('prompt').setDescription('¿Cuál es tu pregunta?').setRequired(true)),
    async executeSlash (interaction) {
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const prompt = options.getString('prompt');

        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            await page.goto('https://chat-app-f2d296.zapier.app/');

            // typing prompt
            await page.waitForSelector('textarea[placeholder="Ask me anything!"]');
            await page.focus('textarea[placeholder="Ask me anything!"]');
            await page.waitForTimeout(1000);
            await page.keyboard.type(prompt);
            await page.keyboard.press('Enter');

            // get response
            await page.waitForTimeout(10000);
            await page.waitForSelector('[data-testid="bot-message"]');

            var value = await page.$$eval('[data-testid="bot-message"]', async (elements) => {
                return elements.map((element) => element.textContent);
            });

            if (value.length === 0) {
                throw new Error('No response from the bot');
            }

            value.shift();
            const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setDescription(`\`\`\`${value.join('\n\n')}\`\`\``);

            await interaction.editReply({ embeds: [embed] });

            await browser.close();
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'There was an error getting that response, try again later!' });
        }
    }
};
