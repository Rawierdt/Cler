const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'chiste',
    description: 'Muestra un chiste aleatorio.',
    async executePrefix(client, message, args) {
        // Lista de enlaces de chistes
        const chistes = [
            "¿Cómo se llama el primo vegano de Bruce Lee? *Brocoli Lee*.",
            "¿Qué le dice un pez a otro? *Nada en particular*.",
            "¿Cómo se llama el fantasma que trabaja en una fábrica de refrescos? *Fanta-sma*.",
            "¿Cuál es el animal más antiguo? La cebra, *porque está en blanco y negro*.",
            "¿Cuál es el animal más perezoso del mundo? *El perezoso, obviamente*.",
            "¿Cuál es el único animal que anda con los pies en la cabeza? *El piojo*",
            "¿Qué animal puede saltar más alto que una casa? Cualquiera, *porque una casa no salta*",
            "¿Cuál es el animal que es dos veces animal? *El gato, porque es gato y araña*",
            "¿Qué hace un perro con un taladro? *Ta—ladrando*",
            "¿Cuál es la diferencia entre un hipopótamo y una pulga? *Que el hipopótamo puede tener pulgas, pero la pulga no puede tener hipopótamos*",
            "¿Qué hace una vaca pensando? Leche concentrada",
            "Esto era un chiste tan malo, tan malo, tan malo... que pegaba a los chistes más pequeños.",
            "¿Cómo queda un mago después de comer? *¡Magordito!*",
            "El dinero no da la felicidad, pero prefiero llorar en un Ferrari.",
            "¿Cuál es el último animal del mundo? *El delfín*",
            "¿Cuál es el café más peligroso del mundo? *El ex-preso*.",
            "Si los zombies se deshacen con el paso del tiempo *¿zombiodegradables?*",
            "¿Qué es rojo y malo para los dientes? *Un ladrillo*.",
            "¿Crees en el amor a primera vista o debo volver a pasar?",
            "¿Eres un wifi? Porque siento una conexión.",
            "He visitado a mi amigo en su nuevo apartamento. Me dijo que me sintiera como en casa. *Así que le eché. Odio tener visitas*.",
            "¿Qué hace un piojo en la cabeza de un calvo? *¡Patinaje sobre hielo!*",
            "**[HUMOR NEGRO]** : Mi novia, hablando de astronomía, me preguntó cómo mueren las estrellas. *Normalmente por sobredosis, le dije*.",
            "**[HUMOR NEGRO]** : ¿Qué tienen en común Miguel Ángel y Kurt Cobain? *Que los dos usaron sus cerebros para pintar el techo*.",
            "**[HUMOR NEGRO]** : Doctor, ¿tendré cura? *Por supuesto, cura, misa y funeral*.",
            "**[HUMOR NEGRO]** : ¿Cuál es la parte más dura de un vegetal? *La silla de ruedas.*",
            "**[HUMOR NEGRO]** : ¿Por qué los estadounidenses son malos jugadores de ajedrez? *Porque perdieron dos torres.*",
            "**[HUMOR NEGRO]** : Papa, ¿soy adoptado? - *¿Tú crees que te habríamos elegido a ti?*",
            "**[HUMOR NEGRO]** : ¿De qué color era el coche de Lady Di? *Negro estampado.*",
            "**[HUMOR NEGRO]** : ¿Cuál es la diferencia entre un Lamborghini y un cadáver? *Que no tengo un Lamborghini en el garaje*.",
            "**[HUMOR NEGRO]** : Nunca olvidaré las últimas palabras de mi suegro justo antes de morir. *¿Sigues sosteniendo la escalera?*",
            "**[HUMOR NEGRO]** : Me gustaría tener hijos un día. *Pero no creo que pueda soportarlos más tiempo que ese*.",
            "**[HUMOR NEGRO]** : Pensé que abrir una puerta para una dama era de buenos modales, *pero ella simplemente me gritó y salió volando del avión*.",
            "**[HUMOR NEGRO]** : ¿Por qué los cigarrillos son buenos para el medio ambiente? *Matan gente.*",
            "**[HUMOR NEGRO]** : Si donas un riñón, todo el mundo te quiere y eres un héroe. *Pero dona cinco y hasta llaman a la policia*.",
            "**[HUMOR NEGRO]** : ¡Tengo un pez que sabe bailar breakdance! *De acuerdooo, solo durante 20 segundos, y solo una vez.*",
            "**[HUMOR NEGRO]** : Tranquilo, se que es tu primera operacion no te pongas nervioso, *Pero Doc, no estoy nerviso*, Ah perdón me lo decia a mi mismo.",
            "**[HUMOR NEGRO]** : Qué es lo más blanco que tiene un negro? *Su dueño*."
        ];
        const randomChiste = chistes[Math.floor(Math.random() * chistes.length)];
        // Crear embed para notificar al canal
        const chisteEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Chiste Aleatorio')
            .setDescription(randomChiste)
            .setTimestamp();
        message.reply({ embeds: [chisteEmbed] });
    },
};
