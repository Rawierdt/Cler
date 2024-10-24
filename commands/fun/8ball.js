const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: '8ball',
    description: 'Responde a una pregunta con una respuesta aleatoria.',
    async executePrefix(client, message, args) {
        let mensaje = args.slice().join(" ");
        //if (message.deletable) message.delete();
        if (!mensaje) return message.reply("Primero pregúntame algo.");

        const respuestas = [
            "En mi opinión, sí", "Es cierto", "Es decididamente así", "Probablemente", 
            "Todo apunta a que sí", "Sin duda", "Sí definitivamente", "Debes confiar en ello", 
            "Pregunta en otro momento", "Será mejor que no te lo diga ahora", "Puede ser...", 
            "No cuentes con ello", "Mi respuesta es no", "Mis fuentes me dicen que no", 
            "Las perspectivas no son buenas", "Muy dudoso", "Sí", "No", "Tal vez", "Obvio", 
            "Yo digo que sí", "Yo digo que no", "Probablemente", "Clarito que sí", "No mi estimado", 
            "Podría ser", "Para nada", "No en lo absoluto", "Clarita dice que sí", "Afirmativo", 
            "Nel", "Simón", "Clarito que no"];

        const ballEmbed = new EmbedBuilder()
            .setFooter({ text: "8Ball · Cler", iconURL: message.client.user.avatarURL() })
            .setTitle(`:thinking: | Pregunta: \`${mensaje}\``)
            .setDescription(`:face_with_hand_over_mouth: | Respuesta: ${respuestas[Math.floor(Math.random() * respuestas.length)]}.`)
            .setColor(0x20112E);
        message.reply({ embeds: [ballEmbed] });
    },
};