import config from '../../config.cjs';

const kick = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefix = config.PREFIX;
const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['kick', 'remove'];

    if (!validCommands.includes(cmd)) return;

    if (!m.isGroup) return m.reply("*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*");
    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("කට්ටියව අයින් කරන්න මට ඇඩ්මින් දීපල්ලා . මේක හරි වැඩක් උනානේ");
    if (!senderAdmin) return m.reply("අනේ ඔයා ඇඩ්මින් නෙමේ සුදූ. ඔයාට බෑ  කාවවත් අයින් කරන්න 😁😘");

    if (!m.mentionedJid) m.mentionedJid = [];

    if (m.quoted?.participant) m.mentionedJid.push(m.quoted.participant);

    const users = m.mentionedJid.length > 0
      ? m.mentionedJid
      : text.replace(/[^0-9]/g, '').length > 0
      ? [text.replace(/[^0-9]/g, '') + '@s.whatsapp.net']
      : [];

    if (users.length === 0) {
      return m.reply("කාවද අයින් කරන්න ඕනි? .kick එක්ක මෙන්ෂන් කරන්න අපහු .මන් අයින් කරන්නම්👀");
    }

    const validUsers = users.filter(Boolean);

    await gss.groupParticipantsUpdate(m.from, validUsers, 'remove')
      .then(() => {
        const kickedNames = validUsers.map(user => `@${user.split("@")[0]}`);
        m.reply(`*USERS ${kickedNames} KICKED SUCCESSFULLY FROM THE GROUP ${groupMetadata.subject}*`);
      })
      .catch(() => m.reply('Failed to kick user(s) from the group.'));
  } catch (error) {
    console.error('Error:', error);
    m.reply('An error occurred while processing the command.');
  }
};

export default kick;
