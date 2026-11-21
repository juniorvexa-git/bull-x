const express = require('express');
const app = express();
let lastQR = null;

app.get('/', (req, res) => {
  res.send(`
    <h1>🐂 BULL X IS ONLINE!</h1>
    <p>Bot is running on Render!</p>
    <a href="/qr" style="font-size:24px; background:black; color:white; padding:15px; text-decoration:none;">👉 CLICK HERE TO SEE QR CODE</a>
  `);
});

app.get('/qr', (req, res) => {
  if (!lastQR) {
    return res.send(`
      <h1>🐂 BULL X QR</h1>
      <h2>No QR right now</h2>
      <p>Bot is already linked OR waiting for new QR.</p>
      <p>If bot logged out, a new QR will appear here in 30 seconds.</p>
      <a href="/qr">🔄 Refresh</a>
      <script>setTimeout(()=>location.reload(), 15000);</script>
    `);
  }
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(lastQR)}`;
  res.send(`
    <center>
      <h1>🐂 BULL X - SCAN THIS QR</h1>
      <img src="${qrUrl}" style="width:400px;height:400px;border:5px solid black;">
      <br><br>
      <p>Open WhatsApp > Linked Devices > Link a Device > Scan this</p>
      <p>QR expires in 20 seconds - page auto-refreshes</p>
      <a href="/qr">🔄 Refresh Now</a>
      <script>setTimeout(()=>location.reload(), 20000);</script>
    </center>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server on port ' + PORT));

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const sharp = require('sharp');
const fs = require('fs');

let antilinkGroups = {};
try { antilinkGroups = JSON.parse(fs.readFileSync('antilink.json','utf8')); } catch {}
const saveAntilink = () => fs.writeFileSync('antilink.json', JSON.stringify(antilinkGroups));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const sock = makeWASocket({ logger: pino({ level: 'silent' }), printQRInTerminal: false, auth: state, browser: ['BULL X', 'Chrome', '1.0'] });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            lastQR = qr;
            console.log('NEW QR READY - Go to https://bull-x.onrender.com/qr');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') { 
            console.log('BULL X IS ONLINE!'); 
            lastQR = null;
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = msg.key.participant || msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || '';
        const reply = async (text) => { await sock.sendMessage(from, { text }, { quoted: msg }); };
        const isImage = !!msg.message.imageMessage;
        const isBot = msg.key.fromMe;

        if (isGroup && antilinkGroups[from] && !isBot) {
            const hasLink = /(https?:\/\/|www\.|chat\.whatsapp\.com|t\.me\/|instagram\.com|youtube\.com|tiktok\.com)/i.test(body);
            if (hasLink) {
                try {
                    await sock.sendMessage(from, { delete: msg.key });
                    await sock.sendMessage(from, { text: `⚠️ @${sender.split('@')[0]} Links are NOT allowed here! Message deleted by BULL X 🐂`, mentions: [sender] });
                } catch {}
                return;
            }
        }

        if (body.startsWith('.sticker') || body.startsWith('.s')) {
            try {
        if (command === 'menu') await reply('🐂 *BULL X MENU*\n\n*A - GENERAL*\n.ping\n.menu\n.owner\n.alive\n.info\n.time\n\n*B - AUTO*\nJust say hi/hello/sasa\n\n*C - GROUP*\n.tagall\n.groupinfo\n.antilink on / off\n\n*D - STICKER*\n.sticker\n\n*E - DOWNLOADER*\n.tiktok <link>');
        if (command === 'owner') await reply('👑 *BULL X OWNER*\n\nName: BULL X Owner\nNumber: +254112843071\nBot: BULL X V2');
        if (command === 'alive') await reply('🐂 *BULL X IS ALIVE!*\n\n✅ Online\n✅ Working\n✅ Ready');
        if (command === 'info') await reply('🐂 *BULL X INFO*\n\nVersion: V2\nOwner: +254112843071');
        if (command === 'time') {
            const now = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });
            await reply('🕒 *TIME*\n' + now);
        }
        if (command === 'bull') await reply('🐂🔥 BULL X MODE ACTIVATED! 🔥🐂');
        if (command === 'antilink') {
            if (!isGroup) return reply('This only works in groups!');
            if (text === 'on') { antilinkGroups[from] = true; saveAntilink(); await reply('✅ *Anti-Link ON*'); }
            else if (text === 'off') { delete antilinkGroups[from]; saveAntilink(); await reply('❌ *Anti-Link OFF*'); }
            else await reply('Use: *.antilink on* or *.antilink off*');
        }
        if (command === 'tiktok') {
            if (!text) return reply('Send link: *.tiktok https://tiktok.com/...*');
            try {
                await reply('⏳ Downloading TikTok...');
                const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(text)}`);
                const data = await res.json();
                if (!data.data?.play) return reply('Failed to download. Check link.');
                await sock.sendMessage(from, { video: { url: data.data.play }, caption: `🐂 *BULL X TikTok*\n\nTitle: ${data.data.title || ''}` }, { quoted: msg });
            } catch { await reply('TikTok download failed'); }
        }
        if (command === 'tagall') {
            if (!isGroup) return reply('This only works in groups!');
            try {
                const metadata = await sock.groupMetadata(from);
                const participants = metadata.participants.map(p => p.id);
                let tagText = '🐂 *BULL X TAGALL*\n\n';
                for (let p of participants) tagText += '@' + p.split('@')[0] + ' ';
                await sock.sendMessage(from, { text: tagText, mentions: participants }, { quoted: msg });
            } catch { await reply('Failed to tag all'); }
        }
        if (command === 'groupinfo') {
            if (!isGroup) return reply('This only works in groups!');
            try {
                const metadata = await sock.groupMetadata(from);
                await reply(`👥 *GROUP INFO*\n\nName: ${metadata.subject}\nMembers: ${metadata.participants.length}`);
            } catch { await reply('Failed'); }
        }
    });
}
startBot();