const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'deathnote',
    description: 'Escribe en la death note, elige la causa de muerte y muestra una imagen correspondiente.',
    async executePrefix(client, message, args) {
        if (message.deletable) message.delete();

        const user = message.mentions.users.first(); // Obtenemos el usuario mencionado
        const deathCause = args.slice(1).join(' '); // Obtenemos la causa de muerte del resto de argumentos
        
        if (!user) {
            return message.reply('<:440warning:1287542257985126501> | Debes mencionar a alguien para usar la death note.');
        }
        if (!deathCause) {
            return message.reply('<:440warning:1287542257985126501> | Debes escribir una causa de muerte para usar la death note.');
        }
        if (user.id === message.author.id) {
            return message.reply('<:440warning:1287542257985126501> | ¡No puedes usar la death note en ti mismo!');
        }
        if (user.id === message.client.user.id) {
            return message.reply('<a:19998rainbowpeacesign:1287542721095143536> JAJAJA ¡Buen intento!');
        }

        // Definir una lista de causas de muerte y sus imágenes asociadas
        const deathList = {
            "por jugar videojuegos": "https://giffiles.alphacoders.com/132/132603.gif", // Imagen correspondiente
            "de hambre": "https://pop.h-cdn.co/assets/17/24/640x392/gallery-1497533116-not-dead.gif", 
            "un disparo": "https://i.makeagif.com/media/3-20-2017/GqRQld.gif",
            "disparo": "https://tenor.com/1e2v.gif",
            "disparo en la cabeza": "https://tenor.com/8PAJ.gif",
            "cansansio": "https://i.pinimg.com/originals/c1/4a/52/c14a520bcf21045c70bbaa648a497a86.gif",
            "ver anime": "https://i.pinimg.com/originals/c1/4a/52/c14a520bcf21045c70bbaa648a497a86.gif",
            "sangrado": "https://66.media.tumblr.com/f341b19a268f68ca8f3bb6a4a76935d9/tumblr_nhjxluKUwR1qf5do9o1_500.gif",
            "covid": "https://64.media.tumblr.com/2247951fc8dea5a136fe47873588cce9/bf3756633aa0d453-c0/s500x750/6f1cd430a58a08cded2e996032a0b7bdcec31b45.gif",
            "por caida": "https://i.makeagif.com/media/5-22-2015/iLeLdm.gif",
            "explosion": "https://38.media.tumblr.com/1ec26dabe3c6d6499d37e31b74e1bcab/tumblr_mm8yztHCC51spox3yo1_500.gif",
            "por jugar lol": "https://i.makeagif.com/media/5-22-2015/iLeLdm.gif",
            "por estudiar": "https://tenor.com/bStuR.gif",
            "atropellado": "https://tenor.com/bndav.gif",
            "chasquido": "https://tenor.com/bLTRE.gif",
            "capitalismo": "https://tenor.com/blpRb.gif",
            "tristeza": "https://tenor.com/bArOW.gif",
            "soledad": "https://tenor.com/bArOW.gif",
            "por menso": "https://tenor.com/bArOW.gif",
            "pelear con un osos": "https://tenor.com/bBc7s.gif",
            "comunismo": "https://tenor.com/bU1AG.gif",
            "caer de las escaleras": "https://tenor.com/bH4Z8.gif",
            "amor": "https://tenor.com/jjBV7TqBteG.gif",
            "exceso de amor": "https://tenor.com/jjBV7TqBteG.gif",
            "de frio": "https://tenor.com/h2oGWnDsQZ6.gif",
            "de calor": "https://tenor.com/Nn4r.gif",
            "frio": "https://tenor.com/h2oGWnDsQZ6.gif",
            "calor": "https://tenor.com/Nn4r.gif",
            "funado": "https://tenor.com/QYvn.gif",
            "caer a un volcan": "https://tenor.com/bSOxd.gif",
            "caida": "https://tenor.com/bES0H.gif",
            "suicidio": "https://tenor.com/bES0H.gif",
            "caer de un edificio": "https://tenor.com/bES0H.gif",
            "de risa": "https://tenor.com/bqvPk.gif",
            "muerte": "https://tenor.com/bqvPk.gif",
            "auto": "https://tenor.com/4xmv.gif",
            "choque": "https://tenor.com/6R9x.gif",
            "accidente automovilistico": "https://tenor.com/6R9x.gif",
            "accidente de auto": "https://tenor.com/6R9x.gif",
            "no saber programar": "https://tenor.com/bIFY3.gif",
            "de tristeza": "https://tenor.com/b0GJy.gif",
            "esquizofrenia": "https://tenor.com/bR5pb.gif",
            "estudiar": "https://tenor.com/bHwUk.gif",
            "volver con la ex": "https://tenor.com/bHwUk.gif",
            "por vivir en mexico": "https://tenor.com/bv8Oj.gif",
            "locura": "https://tenor.com/tHU91WuVMws.gif",
            "bomba atomica": "https://tenor.com/byrsk.gif",
            "explosion atomica": "https://tenor.com/bS2Ep.gif",
            "miedo": "https://tenor.com/tHU91WuVMws.gif",
            "ahogamiento": "https://tenor.com/bvZGj.gif",
            "asesinato": "https://tenor.com/bRHng.gif",
            "paro cardiaco": "https://tenor.com/bjB50.gif",
            "un choque": "https://tenor.com/4xmv.gif",
            "mordido por un tiburon": "https://tenor.com/oHrQHPqmVYS.gif",
            "desconocida": "https://tenor.com/bV7KP.gif",
            "un beso": "https://tenor.com/bRtWS.gif",
            "mordedura de gato": "https://tenor.com/bWG6B.gif",
            "de sueño": "https://tenor.com/bCBT5.gif",
            // Agrega más causas y sus imágenes aquí
        };

        // Verificar si la causa de muerte está en la lista
        let deathImage;
        if (deathList[deathCause.toLowerCase()]) {
            deathImage = deathList[deathCause.toLowerCase()];
        } else {
            // Imagen por defecto si la causa no está en la lista
            deathImage = 'https://tenor.com/bES13.gifs';
        }

        // Crear el primer embed (la escritura en la death note)
        const embed1 = new EmbedBuilder()
            .setDescription(`${message.author} escribe algo en su libreta :closed_book:`)
            .setFooter({ text: '● Comando Secreto 6/6 ●' })
            .setImage('https://i.gifer.com/DU2.gif');

        await message.channel.send({ embeds: [embed1] }); // Enviamos el primer embed
        await message.channel.sendTyping(); // Iniciamos el efecto de "escribiendo"

        // Usamos un setTimeout para la pausa dramática antes del segundo embed
        setTimeout(async () => {
            const embed2 = new EmbedBuilder()
                .setDescription(`${user} ha muerto ${deathCause ? `${deathCause}` : ''} :cry:`)
                .setFooter({ text: '● Comando Secreto 6/6 ●' })
                .setImage(deathImage); // Mostramos la imagen de la causa de muerte

            await message.channel.send({ embeds: [embed2] }); // Enviamos el segundo embed
            await message.channel.sendTyping(false); // Terminamos el efecto de "escribiendo"
        }, 4000); // El setTimeout está en milisegundos, 4000ms = 4 segundos
    },
};
