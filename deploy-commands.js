const { REST, Routes, SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType, Events } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa a un miembro del servidor.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario que deseas expulsar')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Razón de la expulsión')
        .setRequired(false)),
  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea a un miembro del servidor.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario que deseas banear')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Razón del baneo')
        .setRequired(false)),
  new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Realiza un softban a un miembro, banea temporalmente y borra mensajes recientes.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario que deseas softbanear')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Razón del softban')
        .setRequired(false)),
  new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Desbanea a un miembro del servidor.')
    .addStringOption(option =>
      option.setName('id')
        .setDescription('El usuario que deseas desbanear')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Advierte a un miembro.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario a advertir')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Razón de la advertencia')
        .setRequired(false)),
    new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Ver advertencias de un miembro.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario a ver')
        .setRequired(true)),
    new SlashCommandBuilder()
    .setName('unwarn')
    .setDescription('Elimina advertencias de un miembro.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('index')
        .setDescription('El número de la advertencia')
        .setRequired(true)),
    new SlashCommandBuilder()
    .setName('set_mute')
    .setDescription('Configura el rol de mute para el servidor.')
    .addRoleOption(option => 
      option.setName('role')
        .setDescription('El rol que deseas configurar como rol de mute.')
        .setRequired(true)),
    new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Silencia a un miembro del servidor por un tiempo definido.')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('El usuario que deseas silenciar')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('time')
        .setDescription('Tiempo en minutos para silenciar al usuario (opcional)'))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Razón del mute (opcional)')),
    new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Desmuta a un miembro del servidor.')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('El usuario que deseas desmutear')
        .setRequired(true)),
    new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Elimina una cantidad especificada de mensajes en el canal actual.')
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('La cantidad de mensajes a borrar')
        .setRequired(true)),
    new SlashCommandBuilder()
      .setName('help')
      .setDescription('Muestra la lista de comandos disponibles.'),
  new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Muestra el avatar de un usuario.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario del que deseas ver el avatar.')),
  new SlashCommandBuilder()
    .setName('test')
    .setDescription('Un comando de prueba'),
  new ContextMenuCommandBuilder()
    .setName('Ver Avatar')
    .setType(ApplicationCommandType.User),
  new SlashCommandBuilder()
    .setName('set-fc-channel')
    .setDescription('Define el canal donde se anunciarán los cumpleaños')
    .addChannelOption(option => 
      option.setName('canal')
        .setDescription('El canal para los anuncios de cumpleaños')
        .setRequired(true)),
  new SlashCommandBuilder()
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
].map(command => {
  console.log(`Comando: ${command.name} registrado.`); // Agrega un log para cada comando
  return command.toJSON();
});

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Iniciando registro de comandos...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('Comandos registrados correctamente.');
  } catch (error) {
    console.error('Error al registrar comandos:', error);
  }
})();
