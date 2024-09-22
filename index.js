const { Client, GatewayIntentBits, Collection, ActivityType, Events } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
require('dotenv').config();

// Crear el cliente del bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.DirectMessages, // Asegúrate de incluir esto
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.Guilds, 
  ],
});

// Cargar comandos en la colección
client.commands = new Collection();

// Función para cargar comandos
function loadCommands(directory) {
  const commandFiles = fs.readdirSync(directory).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`${directory}/${file}`);
    if (command.data) {
      client.commands.set(command.data.name, command);  // Para slash commands
    } else if (command.name) {
      client.commands.set(command.name, command);  // Para comandos con prefijo
    } else {
      console.warn(`[WARN] El comando en ${file} no tiene ni 'data' ni 'name'. Ignorado.`);
    }
  }
}

// Cargar comandos generales y de admin
loadCommands('./commands');
loadCommands('./commands/admin');
loadCommands('./commands/social');
loadCommands('./commands/contextMenu');
loadCommands('./commands/fun');
loadCommands('./commands/secrets');
loadCommands('./commands/utility');

// Logs de actividad del bot
client.once('ready', () => {
  console.log(`En línea como ${client.user.tag}`);
  console.log(`[LOG] Bot atendiendo en ${client.guilds.cache.size} servidores`);
  client.user.setStatus('online');
  client.user.setActivity(`c!help | /help`, { type: ActivityType.Listening });
});

// Manejando eventos de interacción (slash commands)
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      if (command.executeSlash) {
        await command.executeSlash(interaction);  // Ejecuta el método para slash commands
      }
      console.log(`[LOG] ${interaction.user.tag} ha ejecutado ${interaction.commandName} en ${interaction.guild.name}`);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
      }
    }
  } else if (interaction.isContextMenuCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      if (command.executeContextMenu) {
        await command.executeContextMenu(interaction);  // Ejecuta el método para context menu commands
      }
      console.log(`[LOG] ${interaction.user.tag} ha ejecutado ${interaction.commandName} en ${interaction.guild.name}`);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
      }
    }
  }
});


// Manejo de mensajes (comandos con prefijo y DMs)
client.on('messageCreate', message => {
  // Ignorar mensajes del propio bot
  if (message.author.bot) return;

  // Manejo de mensajes en DMs
  if (message.channel.type === 'DM') {
    console.log(`[DM] ${message.author.tag} envió un mensaje: ${message.content}`);
    // Aquí puedes agregar más lógica para responder a DMs, si lo deseas
    return; // Salimos aquí para no seguir procesando como un comando
  }

  // Comandos con prefijo
  if (!message.content.startsWith(config.prefix)) ret<urn;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    if (command.executePrefix) {
      command.executePrefix(client, message, args);  // Ejecuta el método para comandos con prefijo
    }
    console.log(`[LOG] ${message.author.tag} ha ejecutado ${commandName} en ${message.guild.name}`);
  } catch (error) {
    console.error(error);
    message.reply('Hubo un error al ejecutar ese comando.');
  }
});


// Iniciar el bot
client.login(process.env.BOT_TOKEN);
