const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const PImage = require('pureimage');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('ScreenShot')
    .setType(ApplicationCommandType.Message),
  async executeContextMenu(interaction) {
    const message = interaction.targetMessage;
    const user = message.author;

    await interaction.deferReply();

    // Crear un canvas
    const imgWidth = 800;
    const imgHeight = 400;
    const img = PImage.make(imgWidth, imgHeight);
    const ctx = img.getContext('2d');

    // Fondo blanco
    ctx.fillStyle = '#EAEAEA';
    ctx.fillRect(0, 0, imgWidth, imgHeight);

    // Cargar y registrar la fuente
    const fontPath = path.join(__dirname, 'fonts', 'Poppins.ttf');
    const font = PImage.registerFont(fontPath, 'Poppins');
    font.loadSync();

    const fontPathBold = path.join(__dirname, 'fonts', 'PoppinsBold.ttf');
    const fontBold = PImage.registerFont(fontPathBold, 'PoppinsBold');
    fontBold.loadSync();

    // Dibujar el nombre del usuario 
    ctx.fillStyle = '#2A2A2A'; 
    ctx.font = '24pt PoppinsBold'; 
    ctx.fillText('@' + user.username, 100, 60);

    // Dibujar el mensaje
    if (message.content) {
      ctx.font = '14pt Poppins';
      wrapText(ctx, message.content, 50, 120, imgWidth - 100, 24);
    } else {
      ctx.font = '14pt Poppins';
      ctx.fillText('Mensaje sin texto', 50, 120, imgWidth - 100);
    }

    // Generar un nombre de archivo único
    const bufferPath = path.join(__dirname, `output_${interaction.id}.png`);
    await PImage.encodePNGToStream(img, fs.createWriteStream(bufferPath));

    // Leer la imagen desde el buffer
    const buffer = fs.readFileSync(bufferPath);

    // Crear un attachment para Discord
    const attachment = new AttachmentBuilder(buffer, { name: 'captura.png' });

    const embed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTitle(`<:polaroid:1317928230728241203> : Screenshot de ${user.username}`)
      .setImage('attachment://captura.png')
      .setTimestamp()
      .setFooter({ text: 'Solicitado por ' + interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

    await interaction.editReply({ embeds: [embed], files: [attachment] });

    // Limpieza opcional del archivo temporal
    fs.unlinkSync(bufferPath);
  },
};

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}
