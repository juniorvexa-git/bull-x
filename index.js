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
        const reply = async (text, opts) => { await sock.sendMessage(from, { text }, { quoted: msg, ...opts }); };
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
                if (msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                    const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
                    const stream = await downloadContentFromMessage(quoted, 'image');
                    let buffer = Buffer.from([]);
                    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
                    const webp = await sharp(buffer).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp().toBuffer();
                    await sock.sendMessage(from, { sticker: webp }, { quoted: msg });
                    return;
                }
                if (isImage) {
                    const stream = await downloadContentFromMessage(msg.message.imageMessage, 'image');
                    let buffer = Buffer.from([]);
                    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
                    const webp = await sharp(buffer).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp().toBuffer();
                    await sock.sendMessage(from, { sticker: webp }, { quoted: msg });
                    return;
                }
                await reply('Send an image with caption *.sticker* or reply to an image with *.sticker*');
                return;
            } catch (e) { await reply('Sticker failed, try smaller image'); return; }
        }

        if (!body.startsWith('.')) {
            const low = body.toLowerCase().trim();
            if (low === 'hi' || low === 'hello' || low === 'hey' || low === 'hii' || low === 'sasa' || low === 'niaje') {
                await reply('Hey! 🐂 BULL X here! Type *.menu* to see commands');
            }
            if (low === 'bull' || low === 'bull x') {
                await reply('BULL X MODE ACTIVATED! 🐂🔥');
            }
            return;
        }

        const args = body.slice(1).trim().split(/ +/);
        const command = args[0].toLowerCase();
        const text = args.slice(1).join(' ');

        if (command === 'ping') await reply('Pong! BULL X is alive! ⚡ Speed: Fast');
        if (command === 'menu') await reply('🐂 *BULL X MENU V5*\n\n*A - GENERAL*\n.ping\n.menu\n.owner\n.alive\n.info\n.time\n.checkadmin\n\n*B - AUTO*\nJust say hi/hello/sasa\n\n*C - GROUP*\n.tagall\n.groupinfo\n.antilink on/off\n.kick @user\n.promote @user\n.demote @user\n\n*D - STICKER*\n.sticker\n\n*E - DOWNLOADER*\n.tiktok <link>\n\n*F - MUSIC*\n.play <song name>\n\n*G - AI*\n.ai <question>');
        if (command === 'owner') await reply('👑 *BULL X OWNER*\n\nName: BULL X Owner\nNumber: +254112843071\nBot: BULL X V5');
        if (command === 'info') await reply('🐂 *BULL X INFO*\n\nVersion: V5\nOwner: +254112843071');
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

        // --- CHECK ADMIN - LID FIXED ---
        if (command === 'checkadmin') {
            try {
                const metadata = await sock.groupMetadata(from);
                const clean = (id) => (id || '').split(':')[0].split('@')[0];
                await reply(`🔍 *ADMIN CHECK*\n\nBot PN: ${clean(sock.user.id)}\nBot LID: ${clean(sock.user.lid || 'none')}\n\nYou are admin? Check group info - You show as Group Admin ✅\n\nMembers: ${metadata.participants.length}\nBULL X = Your account, so if You are admin, BULL X is admin!`);
            } catch { await reply('Check failed'); }
        }

        // --- TIKTOK ---
        if (command === 'tiktok') {
            const linkMatch = body.match(/https?:\/\/\S+/);
            const tiktokUrl = linkMatch ? linkMatch[0] : text;
            if (!tiktokUrl || !tiktokUrl.includes('tiktok')) return reply('Send link like this:\n.tiktok https://vt.tiktok.com/xxxxx/\n\n⚠️ Must have SPACE after .tiktok');
            try {
                await reply('⏳ Downloading TikTok... Please wait');
                let videoUrl = null;
                let title = 'TikTok Video';
                let finalUrl = tiktokUrl;
                try {
                    const r = await fetch(tiktokUrl, { redirect: 'follow' });
                    finalUrl = r.url || tiktokUrl;
                } catch {}
                try {
                    const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(finalUrl)}`);
                    const data = await res.json();
                    if (data.data?.play) { videoUrl = data.data.play; title = data.data.title || title; }
                    else if (data.data?.wmplay) { videoUrl = data.data.wmplay; }
                } catch {}
                if (!videoUrl) {
                    try {
                        const res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(finalUrl)}`);
                        const data = await res.json();
                        if (data.video?.noWatermark) videoUrl = data.video.noWatermark;
                        else if (data.video?.watermark) videoUrl = data.video.watermark;
                    } catch {}
                }
                if (!videoUrl) return reply('❌ TikTok blocked this video. Try a DIFFERENT public video.');
                await sock.sendMessage(from, { video: { url: videoUrl }, caption: `🐂 *BULL X TikTok*\n\n${title}` }, { quoted: msg });
            } catch (e) { await reply('TikTok download failed, try again later'); }
        }

        // --- PLAY - V5 INVIOUS SEARCH ---
        if (command === 'play') {
            if (!text) return reply('Send song name:\n.play Diamond Platnumz - Komasava');
            try {
                await reply('🎵 Searching for: ' + text + '...');
                let videoUrl = null;
                let title = text;
                try {
                    const s = await fetch(`https://inv.nadeko.net/api/v1/search?q=${encodeURIComponent(text)}&type=video`);
                    const sd = await s.json();
                    if (sd[0]?.videoId) { videoUrl = `https://youtube.com/watch?v=${sd[0].videoId}`; title = sd[0].title || text; }
                } catch {}
                if (!videoUrl) {
                    try {
                        const s = await fetch(`https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(text)}`);
                        const sd = await s.json();
                        const v = sd.data?.[0] || sd.result?.[0];
                        if (v) { videoUrl = v.url || `https://youtube.com/watch?v=${v.videoId}`; title = v.title || text; }
                    } catch {}
                }
                if (!videoUrl) {
                    try {
                        const s = await fetch(`https://api.dreaded.site/api/yts?query=${encodeURIComponent(text)}`);
                        const sd = await s.json();
                        const v = sd.result?.[0] || sd.data?.[0];
                        if (v) { videoUrl = v.url || `https://youtube.com/watch?v=${v.videoId}`; title = v.title || text; }
                    } catch {}
                }
                if (!videoUrl) return reply('❌ Song not found, try full name: .play Diamond Platnumz Komasava');
                let audioUrl = null;
                try {
                    const r = await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(videoUrl)}`);
                    const d = await r.json();
                    audioUrl = d.data?.dl || d.data?.url || d.result?.download || d.download;
                } catch {}
                if (!audioUrl) {
                    try {
                        const r = await fetch(`https://api.dreaded.site/api/ytdl?url=${encodeURIComponent(videoUrl)}&format=mp3`);
                        const d = await r.json();
                        audioUrl = d.result?.download || d.download;
                    } catch {}
                }
                if (!audioUrl) return reply('❌ Found song but download failed. Try again in 2 mins.');
                await sock.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mp4', fileName: title + '.mp3' }, { quoted: msg });
                await reply(`🎵 *Now Playing:*\n${title}`);
            } catch (e) { await reply('Play failed, try again later'); }
        }

        // --- AI - V5 MULTIPLE APIS ---
        if (command === 'ai') {
            if (!text) return reply('Ask me anything:\n.ai Who is the best footballer?');
            try {
                await reply('🤖 Thinking...');
                let answer = null;
                try {
                    const r = await fetch(`https://api.nekolabs.my.id/ai/chatgpt?text=${encodeURIComponent(text)}`);
                    const d = await r.json();
                    answer = d.result || d.response;
                } catch {}
                if (!answer) {
                    try {
                        const r = await fetch(`https://api.siputzx.my.id/api/ai/gpt-3?prompt=${encodeURIComponent(text)}`);
                        const d = await r.json();
                        answer = d.data || d.result;
                    } catch {}
                }
                if (!answer) {
                    try {
                        const r = await fetch(`https://api.dreaded.site/api/chatgpt?query=${encodeURIComponent(text)}`);
                        const d = await r.json();
                        answer = d.result || d.response || d.answer;
                    } catch {}
                }
                if (!answer) {
                    try {
                        const r = await fetch(`https://text.pollinations.ai/${encodeURIComponent(text)}`);
                        const t = await r.text();
                        if (!t.includes('Free limit') && !t.includes('45 seconds') && t.length > 5) answer = t;
                    } catch {}
                }
                if (!answer) return reply('AI is busy, wait 1 min and try again!');
                await reply(`🐂 *BULL X AI*\n\n${answer}`);
            } catch { await reply('AI is busy, try again'); }
        }

        // --- KICK / PROMOTE / DEMOTE - LID FIXED ---
        if (command === 'kick' || command === 'promote' || command === 'demote') {
            if (!isGroup) return reply('Only in groups!');
            try {
                const metadata = await sock.groupMetadata(from);
                const participants = metadata.participants;
                const clean = (id) => (id || '').split(':')[0].split('@')[0];
                const myNum = clean(sock.user.id);
                const myLid = clean(sock.user.lid || '');
                const senderNum = clean(sender);
                const senderInfo = participants.find(p => clean(p.id) === senderNum || clean(p.lid || '') === senderNum);
                const botInfo = participants.find(p => clean(p.id) === myNum || clean(p.lid || '') === myNum || clean(p.id) === myLid || clean(p.lid || '') === myLid || clean(p.id) === senderNum);
                const isSenderAdmin = senderInfo?.admin === 'admin' || senderInfo?.admin === 'superadmin';
                const isBotAdmin = botInfo?.admin === 'admin' || botInfo?.admin === 'superadmin' || isSenderAdmin;
                if (!isSenderAdmin) return reply(`❌ You are not admin!`);
                if (!isBotAdmin) return reply(`❌ BULL X is still NOT admin!`);
                let target = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msg.message.extendedTextMessage?.contextInfo?.participant;
                if (!target && text) {
                    const num = text.replace(/[^0-9]/g, '');
                    if (num) target = num + '@s.whatsapp.net';
                }
                if (!target) return reply(`Reply to a message with .${command} OR tag:\n.${command} @person`);
                let realTarget = target;
                const targetClean = clean(target);
                const found = participants.find(p => clean(p.id) === targetClean || clean(p.lid || '') === targetClean);
                if (found) realTarget = found.id;
                if (command === 'kick') {
                    await sock.groupParticipantsUpdate(from, [realTarget], 'remove');
                    await sock.sendMessage(from, { text: `👢 @${targetClean} kicked by BULL X 🐂`, mentions: [realTarget] }, { quoted: msg });
                }
                if (command === 'promote') {
                    await sock.groupParticipantsUpdate(from, [realTarget], 'promote');
                    await sock.sendMessage(from, { text: `👑 @${targetClean} promoted to Admin!`, mentions: [realTarget] }, { quoted: msg });
                }
                if (command === 'demote') {
                    await sock.groupParticipantsUpdate(from, [realTarget], 'demote');
                    await sock.sendMessage(from, { text: `⬇️ @${targetClean} demoted!`, mentions: [realTarget] }, { quoted: msg });
                }
            } catch (e) { console.log(e); await reply('Failed: ' + e.message); }
        }

        // --- ALIVE WITH PHOTO ---
        if (command === 'alive') {
            try {
                await sock.sendMessage(from, { 
                    image: { url: 'https://i.ibb.co/6bQ7qK0/bull.jpg' },
                    caption: `🐂 *BULL X IS ALIVE!* 🔥\n\n✅ Online\n✅ Working\n✅ Ready for commands\n\nType *.menu* to see all commands\nOwner: +254112843071`
                }, { quoted: msg });
            } catch {
                await reply('🐂 *BULL X IS ALIVE!*\n\n✅ Online\n✅ Working\n✅ Ready');
            }
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