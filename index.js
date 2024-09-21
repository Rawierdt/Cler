const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
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
  ],
});

// Cargar comandos en la colección
client.commands = new Collection();

// Cargar comandos generales
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    
    // Verificar si el comando tiene 'data' o 'name'
    if (command.data) {
        client.commands.set(command.data.name, command);  // Para slash commands
    } else if (command.name) {
        client.commands.set(command.name, command);  // Para comandos con prefijo
    } else {
        console.warn(`[WARN] El comando en ${file} no tiene ni 'data' ni 'name'. Ignorado.`);
    }
}

// Cargar comandos de admin (kick, ban)
const adminFiles = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));
for (const file of adminFiles) {
    const command = require(`./commands/admin/${file}`);
    
    // Verificar si el comando tiene 'data' o 'name'
    if (command.data) {
        client.commands.set(command.data.name, command);  // Para slash commands
    } else if (command.name) {
        client.commands.set(command.name, command);  // Para comandos con prefijo
    } else {
        console.warn(`[WARN] El comando en ${file} no tiene ni 'data' ni 'name'. Ignorado.`);
    }
}

// Logs de actividad del bot
client.once('ready', () => {
  console.log(`En línea como ${client.user.tag}`);
  console.log(`[LOG] Bot atendiendo en ${client.guilds.cache.size} servidores`);
  client.user.setStatus('idle');
  client.user.setActivity(`SOON!`, { type: ActivityType.Watching});
});

// Manejando eventos de interacción (slash commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
  
    try {
      if (command.executeSlash) {
        await command.executeSlash(interaction);  // Ejecuta el método para slash commands
      }
      console.log(`[LOG] ${interaction.user.tag} ha ejecutado ${interaction.commandName} en ${interaction.guild.name}`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al ejecutar el comando.', ephemeral: true });
    }
  });

  // Manejo de mensajes (comandos con prefijo)
client.on('messageCreate', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  
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
