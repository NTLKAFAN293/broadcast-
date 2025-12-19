require('dotenv').config();
const { Client, GatewayIntentBits, Partials, PermissionsBitField } = require('discord.js');
const http = require('http');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.once('ready', () => {
  console.log(`BOT ON: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith('-رسل لحق بهذا الروم')) return;

  if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return message.reply('❌ تحتاج صلاحية Administrator');
  }

  const arg = message.content.replace('-رسل لحق بهذا الروم', '').trim();
  if (!arg) return message.reply('❌ اكتب رقم أو "الكل"');

  await message.guild.members.fetch();

  let members = message.guild.members.cache.filter(m => !m.user.bot);
  if (arg !== 'الكل') {
    const num = parseInt(arg);
    if (isNaN(num)) return message.reply('❌ رقم غير صحيح');
    members = members.first(num);
  }

  let ok = 0, fail = 0;

  for (const member of members) {
    try {
      await member.send(`📢 رسالة من <@${message.author.id}> : لحق بهذا الروم`);
      ok++;
    } catch {
      fail++;
    }
    await new Promise(r => setTimeout(r, 1200));
  }

  message.channel.send(`✅ تم الإرسال | نجح: ${ok} | فشل: ${fail}`);
});

client.login(process.env.BOT_TOKEN);

// Port وهمي للاستضافات
http.createServer((_, res) => res.end('Bot Running')).listen(process.env.PORT || 3000);
