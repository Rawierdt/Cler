const { SlashCommandBuilder } = require('discord.js');
const db = require('megadb'); // Asegúrate de que MegaDB esté correctamente instalado y configurado
//const birthdaysDB = new db.crearDB('birthdays');
const birthdaysDB= new db.crearDB({
  nombre: 'birthdays',
  guardar_tiempo: 7
});
const configDB = new db.crearDB('config'); // Base de datos donde se guarda el canal de cumpleaños

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-fc')
    .setDescription('Agrega una fecha de cumpleaños')
    .addUserOption(option => 
      option.setName('usuario')
        .setDescription('El usuario al que deseas agregar el cumpleaños (opcional)'))
    .addStringOption(option => 
      option.setName('nombre')
        .setDescription('El nombre de la persona si no es un usuario de Discord (opcional)'))
    .addIntegerOption(option => 
      option.setName('día')
        .setDescription('Día del cumpleaños')
        .setRequired(true))
    .addIntegerOption(option => 
      option.setName('mes')
        .setDescription('Mes del cumpleaños')
        .setRequired(true)),

  name: 'add-fc', // Para comandos con prefijo
  description: 'Agrega una fecha de cumpleaños',

  async executeSlash(interaction) {
    try {
      const user = interaction.options.getUser('usuario');
      const nombre = interaction.options.getString('nombre');
      const día = interaction.options.getInteger('día');
      const mes = interaction.options.getInteger('mes');

      // Validar día y mes
      if (día < 1 || día > 31) {
        return interaction.reply({ content: '<:440warning:1287542257985126501> Por favor, ingresa un día válido (1-31).', ephemeral: true });
      }
      if (mes < 1 || mes > 12) {
        return interaction.reply({ content: '<:440warning:1287542257985126501> Por favor, ingresa un mes válido (1-12).', ephemeral: true });
      }

      // Validación de opciones (no se puede usar nombre y usuario al mismo tiempo)
      if (user && nombre) {
        return interaction.reply({ content: '<a:denyxbox:1287542408082358292> No puedes agregar un usuario y un nombre al mismo tiempo. **Elige solo una opción**.', ephemeral: true });
      }

      // Verificar si ya existe un cumpleaños registrado para el mismo identificador
      let id;
      let displayName;

      if (user) {
        id = user.id;
        displayName = user.username;
      } else if (nombre) {
        id = nombre.toLowerCase(); // Usamos el nombre como identificador si no es un usuario de Discord
        displayName = nombre;
      } else {
        id = interaction.user.id; // El autor del comando si no hay otra opción
        displayName = interaction.user.username;
      }

      const birthdayExists = await birthdaysDB.has(`${interaction.guild.id}.${id}`);
      if (birthdayExists) {
        return interaction.reply({ content: `<:765discordinfowhitetheme:1287542268328280197> Ya existe un cumpleaños registrado para **${displayName}**.`, ephemeral: true });
      }

      // Verificar si hay un canal de cumpleaños configurado
      const birthdayChannelId = await configDB.get(`birthdayChannel_${interaction.guild.id}`);
      if (!birthdayChannelId) {
        return interaction.reply({ content: '<:440warning:1287542257985126501> No se ha configurado un canal de cumpleaños. Un administrador debe usar el comando `/set-fc-channel` para definirlo.', ephemeral: true });
      }

      // Guardar la fecha de cumpleaños en la base de datos
      await birthdaysDB.set(`${interaction.guild.id}.${id}`, { día, mes });

      await interaction.reply({ content: `<a:7checkbox:1287542421386690570> El cumpleaños de **${displayName}** ha sido establecido para el **${día}/${mes}**.`, ephemeral: false });

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '<:win11erroicon:1287543137505378324> Ocurrió un error al intentar agregar el cumpleaños. Inténtalo nuevamente más tarde.', ephemeral: true });
    }
  },
};
