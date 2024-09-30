const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'hack',
    description: 'Hack joke, muestra datos falsos del usuario mencionado.',
    async executePrefix(client, message, args) {
        const usuarioh = message.mentions.users.first(); // Definimos al Usuario
        if (!usuarioh) {
            return message.channel.send(`<@${message.author.id}> <:win11warningicon:1287543045289410602> | Menciona a alguien para hackear 😎`);
        }

        // Listas de datos falsos
        const contras = ['familiassq', 'password', 'root', 'toor', 'admin', 'b23G0FjSs8a', 'HN8sn18ndq', '0ISDN2A', '9NMdsnm2Ub', '1234567890', 'dApaAss8CNN'];
        const gmails = ['aansel97_41@gmail.com', 'h2q.b7cca@gmail.com', 'star.bucks@gmx.de', 'marco1familia@outlook.com', 'corxt.H7@gmail.com'];
        const ips = ['201.158.22.15', '131.168.1.40', '156.156.7.02', '101.151.1.97', '133.34.9.81', '241.98.75.32', '191.145.32.27'];
        const wifi = ['CLARO_FBDA73','TELECENTRO-970D', 'ARRIS-E3F2-5G', 'TP-LINK-342T', 'TP-Link_B453D', 'dlink_A918HC', 'Telecentro_2.4GHz', 'Robar Wi-Fi es ilegal C.G.P.J', 'SGAE-2E7A', 'MOVISTAR_02GC', 'HUAWEI-HG824TU', 'TG1662C', 'SAGENCOM FAST'];

        // Selección aleatoria
        const randomPass = contras[Math.floor(Math.random() * contras.length)];
        const randomGmail = gmails[Math.floor(Math.random() * gmails.length)];
        const randomIP = ips[Math.floor(Math.random() * ips.length)];
        const randomWifi = wifi[Math.floor(Math.random() * wifi.length)];

        message.channel.send('___**Conectando al Wi-Fi...**___').then(async (m) => {
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            // Simulación de conexión al Wi-Fi
            await delay(5000);
            await m.edit('___**Conectando al Wi-Fi..**___');
            await delay(1000);
            await m.edit('___**Conectando al Wi-Fi.**___');
            await delay(1000);
            await m.edit('___**Conectando al Wi-Fi...**___');
            await delay(1000);
            await m.edit('___**Conectado exitosamente ✅**___');
            await delay(1000);
            await m.edit('___**Obteniendo sus datos...**___');
            await delay(1000);
            await m.edit('___**Obteniendo sus datos..**___');
            await delay(1000);
            await m.edit('___**Wi-Fi Conectado ✅\nDatos Obtenidos ✅**___');

            // Creación del embed con los datos "hackeados"
            const embed = new EmbedBuilder()
                .setTitle(`${message.author} hackeó a: ${usuarioh.tag}`)
                .setDescription(`<:5951discordhashtagpurple:1287542382589509643> | Su Email: ${randomGmail} \n<:discordrules:1287542201789841468> | Su Contraseña: ${randomPass} \n<:onlineweb:1287542091735502919> | Su IP: ${randomIP} \n<:onlineweb:1287542091735502919> | Su Red: ${randomWifi}`)
                .setColor('Random')
                .setImage('https://i.gifer.com/NZzo.gif') // GIF de hackeo
                .setFooter({ text: "● Comando Secreto 1/6 ● " })
                .setTimestamp();

            return message.channel.send({ embeds: [embed] }); // Enviamos el embed
        });
    },
};
