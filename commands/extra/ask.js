const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Has una pregunta para Cler')
        .addStringOption(option => option.setName('prompt')
            .setDescription('¿Cuál es tu pregunta?')
            .setRequired(true)),
    async executeSlash(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const prompt = interaction.options.getString('prompt');

        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            await page.goto('https://chat-app-f2d296.zapier.app/', { waitUntil: 'networkidle2' });

            await page.waitForSelector('textarea[placeholder="automate"]', { timeout: 60000 });
            await page.focus('textarea[placeholder="automate"]');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await page.keyboard.type(prompt);
            await page.keyboard.press('Enter');

            await new Promise(resolve => setTimeout(resolve, 10000));
            await page.waitForSelector('[data-testid="bot-message"]');

            const value = await page.$$eval('[data-testid="bot-message"]', elements => {
                return elements.map(element => element.textContent);
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
            await interaction.editReply({ content: '<:Fadeaway:1293808891850788944> No puedo responder eso ahora, intentalo mas tarde' });
        }
    }
};