const { EmbedBuilder } = require('discord.js');
const os = require('os');
let color = "5e10f8";  // O usa parseInt("5e10f8", 16) si prefieres el valor numérico
let dev = process.env.DEV;

module.exports = {
    name: "info",
    description: "Muestra la información del bot",
    aliases: ["info"],
    async executePrefix(client, message, args) {
        try {
            if (!client.user) {
                return message.channel.send("El bot aún no está listo. Inténtalo de nuevo en unos momentos.");
            }

            const avatarURL = client.user.displayAvatarURL({ format: 'png', dynamic: true });
            const totalGuilds = client.guilds.cache.size;
            const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

            const embed = new EmbedBuilder()
                .setAuthor({ name: "Cler", iconURL: avatarURL })
                .setFooter({ text: "Botinfo · Cler", iconURL: avatarURL })
                .setThumbnail(avatarURL)
                .addFields(
                    { name: "<a:activedeveloperbadgeanimated:1287542344329203813> Developer", value: dev },
                    { name: "<:useapps:1287542291078189140> Servidores", value: `${totalGuilds}` },
                    { name: ":maple_leaf: Usuarios", value: `${totalUsers}` },
                    { name: "<:debian:1289395332706205717> Sistema Operativo", value: `${os.platform()}`, inline: true },
                    { name: "<a:7loading:1287542248258666647> Arquitectura", value: `${os.arch()}`, inline: true },
                    { name: "<:Intel:1289395942759596062> Procesador", value: `${os.cpus().map(i => `${i.model}`)[0]}`, inline: true },
                    { name: ":pager: Ram", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` },
                    { name: "<:nodejs:1289396587235377162> Entorno", value: "NodeJS" },
                    { name: "<a:discordverifypurple:1287542526848532500> Librería", value: "Discord.js v14.16.2" },
                    { name: ":clock3: Local Time", value: new Intl.DateTimeFormat('es-AR', {timeStyle: 'short', hourCycle: 'h23'}).format(new Date()) },                    
                    { name: ":alarm_clock: Uptime", value: `${Math.round(client.uptime / (1000 * 60 * 60))} Hora(s), ${Math.round(client.uptime / (1000 * 60)) % 60} minuto(s), ${Math.round(client.uptime / 1000) % 60} segundo(s)` }
                )
                .setColor(color);  // Se usa color como cadena o número

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error ejecutando el comando 'info':", error);
            message.reply("Hubo un error al intentar ejecutar el comando.");
        }
    }
};
