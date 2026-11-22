const express = require('express');
const app = express();
let lastQR = null;
app.get('/', (req, res) => { res.send(`<h1>🐂 BULL X IS ONLINE!</h1><a href="/qr">👉 SEE QR</a>`); });
app.get('/qr', (req, res) => {
  if (!lastQR) return res.send(`<h1>🐂 BULL X QR</h1><h2>No QR right now</h2><a href="/qr">Refresh</a><script>setTimeout(()=>location.reload(),15000);</script>`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(lastQR)}`;
  res.send(`<center><h1>🐂 BULL X - SCAN THIS QR</h1><img src="${qrUrl}" style="width:400px;height:400px;border:5px solid black;"><br><p>WhatsApp > Linked Devices > Link a Device</p><script>setTimeout(()=>location.reload(),20000);</script></center>`);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server on port ' + PORT));
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const sharp = require('sharp');
const fs = require('fs');
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCUCkkAInPkhAPNil1h';
const CHANNEL_NAME = '🐂 BULL X OFFICIAL CHANNEL';
const DEV_NAME = 'EZEKIA DEV';
const DEV_NUMBER = '254112843071';
const BOT_START = Date.now();
let OWNER_JID = null;
let OWNER_NUMBER = '254112843071';
let settings = { autotyping: false, autorecording: false, autoviewstatus: false, autolikestatus: false, antilink: {}, antidelete: {}, warnings: {}, economy: {}, afk: {}, todos: {}, welcome: {}, goodbye: {} };
try { settings = { ...settings, ...JSON.parse(fs.readFileSync('settings.json','utf8')) }; } catch {}
const saveSettings = () => fs.writeFileSync('settings.json', JSON.stringify(settings));
let msgCache = new Map();
const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];
const JOKES = ["Why did the chicken cross the road? To get to the other side! 😂","Why did Kenyan men marry? Because they couldn't cook ugali! 😂","What do you call a fish without eyes? A fsh! 🐟","Why is 6 afraid of 7? Because 7 ate 9! 😂","Teacher: Why are you late? Student: Because of the sign! 😂","Why did the scarecrow win an award? He was outstanding! 🌾","Why don't skeletons fight? They don't have guts! 💀","What do you call cheese that isn't yours? Nacho cheese! 🧀","Why did Arsenal bring a ladder? To see top of table! ⚽😂","My phone fell in water, now it says 'No SIMpathy' 😂"];
const FACTS = ["Honey never spoils! 🍯","Bananas are berries! 🍌","Kenya is crossed by Equator AND Rift Valley! 🇰🇪","Octopuses have 3 hearts! 🐙","Sharks existed before trees! 🦈🌳","Mt. Kenya is 2nd highest in Africa! ⛰️","Kenya produces best runners! 🏃‍♂️🇰🇪","Hot water freezes faster than cold! 🧊","A day on Venus is longer than a year! 🪐","Cows have best friends! 🐄❤️"];
const QUOTES = ["'Best time to plant a tree was 20 years ago. Second best is now.' 🌳","'Hustle beats talent when talent doesn't hustle!' 🔥","'If you want to go fast, go alone. If you want to go far, go together.' - African Proverb 🤝","'Winners are not people who never fail, but people who never quit!' 🏆","'Education is the most powerful weapon.' - Mandela 📚"];
const ROASTS = ["Your face looks like WiFi - everyone can see it but no one wants to connect! 😂","You're so slow, even a sloth said 'hurry up!' 🦥","Your brain is like a browser with 100 tabs open! 🧠😂","You're so broke, your ATM laughed! 💸😂","You have the personality of a wet sock! 🧦😂"];
const TRUTHS = ["What is your biggest secret? 🤫","Who is your crush in this group? 😍","Most embarrassing thing you ever did? 😳","Have you ever cheated in exam? 📚","What is the last lie you told? 🤥","Who do you hate most here? 👀"];
const DARES = ["Send a voice note singing! 🎤","Text your crush 'I miss you'! 😍","Do 10 pushups and send video! 💪","Dance 30 seconds! 💃","Send your last photo! 📸"];
const RIDDLES = [{q:"I speak without a mouth and hear without ears. What am I?",a:"Echo!"},{q:"What has keys but can't open a lock?",a:"Piano! 🎹"},{q:"What has face and two hands but no arms?",a:"Clock! ⏰"},{q:"What gets wetter the more it dries?",a:"Towel!"}];
const BIBLE = ["John 3:16 - For God so loved the world... ❤️","Philippians 4:13 - I can do all things through Christ! 💪","Jeremiah 29:11 - Plans to prosper you... 🙏","Psalm 23:1 - The Lord is my shepherd! 🐑","Proverbs 3:5 - Trust in the Lord... ❤️"];
const MOTIVATION = ["Wake up! Dreams won't chase themselves! 🔥","No one is coming to save you. Save yourself! 💪","Today's pain is tomorrow's power! ⚡","Stop scrolling, start hustling! 📱➡️💰"];
const FOOTBALL = ["⚽ Messi has 8 Ballon d'Ors! 🐐","⚽ Ronaldo has 900+ goals! 🔥","⚽ Gor Mahia is most successful in Kenya! 🇰🇪","⚽ Arsenal Invincibles 49 games unbeaten! 🏆"];
const HOROSCOPE = { aries: "Aries ♈ Today is your lucky day! Take a risk, it will pay off! 🔥", taurus: "Taurus ♉ Money is coming! Stay patient! 💰", gemini: "Gemini ♊ Someone is thinking about you! 😍", cancer: "Cancer ♋ Family first today! ❤️", leo: "Leo ♌ You will shine today! Be confident! 👑", virgo: "Virgo ♍ Organize your life today! 📋", libra: "Libra ♎ Love is in the air! 💘", scorpio: "Scorpio ♏ Keep your secrets safe! 🤫", sagittarius: "Sagittarius ♐ Adventure awaits! ✈️", capricorn: "Capricorn ♑ Hard work pays today! 💪", aquarius: "Aquarius ♒ New idea = New money! 💡", pisces: "Pisces ♓ Trust your gut today! ✨" };
const getMenu = () => {
  const scannedOwner = OWNER_NUMBER || 'Not Connected';
  return `╔══════════════════════╗
   🐂 *B U L L X V 2 2* 👑
   *ALL IN ONE MENU*
╚══════════════════════╝
👑 *OWNER* : +${scannedOwner} (Scanned QR)
👨‍💻 *DEV* : *${DEV_NAME}* 🔥
📞 *DEV NUMBER* : +${DEV_NUMBER}
💬 *CONTACT DEV* : wa.me/${DEV_NUMBER}
⚡ *STATUS* : Online ✅
💎 *VERSION* : V22 Dynamic Owner + Dev
📱 *PREFIX* : .

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 👤 *GENERAL*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ .ping
┃ ▸ .menu
┃ ▸ .speed
┃ ▸ .owner
┃ ▸ .alive
┃ ▸ .info
┃ ▸ .time
┃ ▸ .date
┃ ▸ .rules
┃ ▸ .checkadmin
┃ ▸ .profile
┃ ▸ .afk
┃ ▸ .channel

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 🤖 *AUTO VIP*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ .autotyping
┃ ▸ .autorecording
┃ ▸ .autoviewstatus
┃ ▸ .autolikestatus
┃ ▸ .autostatus
┃ ▸ .settings

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 👑 *ADMIN*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ .warn
┃ ▸ .warnings
┃ ▸ .resetwarn
┃ ▸ .lock
┃ ▸ .unlock
┃ ▸ .mute
┃ ▸ .unmute
┃ ▸ .kick
┃ ▸ .promote
┃ ▸ .demote
┃ ▸ .hidetag
┃ ▸ .setname
┃ ▸ .setdesc
┃ ▸ .revoke
┃ ▸ .invite

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 👥 *GROUP + DM*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ .tagall
┃ ▸ .groupinfo
┃ ▸ .admins
┃ ▸ .members
┃ ▸ .antilink
┃ ▸ .antidelete
┃ ▸ .welcome
┃ ▸ .goodbye

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 💰 *ECONOMY*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ .balance
┃ ▸ .daily
┃ ▸ .work
┃ ▸ .beg
┃ ▸ .gamble
┃ ▸ .rob
┃ ▸ .pay
┃ ▸ .shop
┃ ▸ .buy
┃ ▸ .leaderboard

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 😂 *FUN*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ .joke
┃ ▸ .dadjoke
┃ ▸ .fact
┃ ▸ .quote
┃ ▸ .quote2
┃ ▸ .meme
┃ ▸ .roast
┃ ▸ .compliment
┃ ▸ .insult
┃ ▸ .8ball
┃ ▸ .dice
┃ ▸ .coin
┃ ▸ .truth
┃ ▸ .dare
┃ ▸ .riddle
┃ ▸ .love
┃ ▸ .ship
┃ ▸ .howgay
┃ ▸ .howcool
┃ ▸ .howrich
┃ ▸ .howold
┃ ▸ .smart
┃ ▸ .beautiful
┃ ▸ .simp
┃ ▸ .crush
┃ ▸ .kiss
┃ ▸ .hug
┃ ▸ .slap
┃ ▸ .kill
┃ ▸ .congrats
┃ ▸ .happybirthday

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 🎲 *GAMES*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ .rps
┃ ▸ .slot
┃ ▸ .lottery
┃ ▸ .guess

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 🛠️ *TOOLS*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ .calc
┃ ▸ .qr
┃ ▸ .password
┃ ▸ .weather
┃ ▸ .define
┃ ▸ .reverse
┃ ▸ .shout
┃ ▸ .age
┃ ▸ .horoscope
┃ ▸ .lyrics
┃ ▸ .translate
┃ ▸ .kenya
┃ ▸ .nairobi
┃ ▸ .kisii
┃ ▸ .binary
┃ ▸ .morse
┃ ▸ .fancy

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 🐱 *ANIMALS & ANIME*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ .cat
┃ ▸ .dog
┃ ▸ .fox
┃ ▸ .panda
┃ ▸ .bird
┃ ▸ .anime
┃ ▸ .waifu
┃ ▸ .neko
┃ ▸ .manga
┃ ▸ .naruto
┃ ▸ .luffy
┃ ▸ .goku

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 🎵 *MUSIC & VIDEO*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ .play
┃ ▸ .song
┃ ▸ .lyrics
┃ ▸ .tiktok
┃ ▸ .igdl
┃ ▸ .fbdl

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 🧠 *AI & LIFE*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ .ai
┃ ▸ .ask
┃ ▸ .bible
┃ ▸ .motivate
┃ ▸ .football
┃ ▸ .story
┃ ▸ .poem

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 🚀 *ADVANCED*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ .img
┃ ▸ .image
┃ ▸ .tts
┃ ▸ .screenshot
┃ ▸ .shortlink
┃ ▸ .news
┃ ▸ .crypto
┃ ▸ .currency
┃ ▸ .github
┃ ▸ .wallpaper
┃ ▸ .reminder
┃ ▸ .todo
┃ ▸ .todos
┃ ▸ .cleartodo
┃ ▸ .poll
┃ ▸ .vcard
┃ ▸ .getpp

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 🎨 *STICKER*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ .sticker
┃ ▸ .s
┃ ▸ .toimg
┃ ▸ .vv

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 👋 *GREETINGS*
┗━━━━━━━━━━━━━━━━━━━━┛
┃ ▸ hi
┃ ▸ hello
┃ ▸ sasa
┃ ▸ mambo
┃ ▸ good morning
┃ ▸ good night
┃ ▸ bull
┃ ▸ i love you

╔══════════════════════╗
  *Total: 220+ Commands* 🔥
  👨‍💻 *Dev: ${DEV_NAME}*
  📞 *+${DEV_NUMBER}*
  👑 *Owner: +${scannedOwner}*
╚══════════════════════╝`;
};
const PREMIUM_MENU = `Use .menu`;
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const sock = makeWASocket({ logger: pino({ level: 'silent' }), printQRInTerminal: false, auth: state, browser: ['BULL X', 'Chrome', '1.0'] });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) { lastQR = qr; qrcode.generate(qr, { small: true }); }
        if (connection === 'close') { const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut; if (shouldReconnect) startBot(); }
        else if (connection === 'open') { console.log('BULL X ONLINE!'); lastQR = null; OWNER_JID = sock.user.id; OWNER_NUMBER = sock.user.id.split(':')[0].split('@')[0]; console.log('👑 OWNER SET TO:', OWNER_NUMBER); }
    });
    sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
        try {
            if (action === 'add' && settings.welcome?.[id]) { for (let p of participants) await sock.sendMessage(id, { text: `👋 Welcome @${p.split('@')[0]} to the group! 🎉\n\nPlease read rules: .rules`, mentions: [p] }); }
            if (action === 'remove' && settings.goodbye?.[id]) { for (let p of participants) await sock.sendMessage(id, { text: `👋 Goodbye @${p.split('@')[0]}! We will miss you! 😢`, mentions: [p] }); }
        } catch {}
    });
    sock.ev.on('messages.update', async (updates) => {
        for (const update of updates) {
            try {
                const isDeleted = update.update?.isDeleted || update.update?.messageStubType === 1 || update.key?.isDeleted;
                if (!isDeleted) continue;
                if (!settings.antidelete[update.key.remoteJid] && !settings.antidelete['GLOBAL']) continue;
                const cached = msgCache.get(update.key.id);
                if (!cached) { await sock.sendMessage(update.key.remoteJid, { text: `🚨 *ANTI-DELETE!* 🐂\n\nSomeone deleted a message but bot restarted / didn't cache it!` }); continue; }
                const deleter = update.key.participant || update.key.remoteJid;
                const m = cached.msg.message;
                const origBody = m.conversation || m.extendedTextMessage?.text || m.imageMessage?.caption || m.videoMessage?.caption || '';
                await sock.sendMessage(update.key.remoteJid, { text: `🚨 *ANTI-DELETE CAUGHT!* 🐂\n\n👤 Deleted by: @${deleter.split('@')[0]}\n📩 From: @${cached.sender.split('@')[0]}\n🕒 Time: ${new Date().toLocaleTimeString('en-KE')}\n\n${origBody ? `💬 *Message:*\n${origBody}` : '📎 *Media message deleted - recovering...*'}`, mentions: [deleter, cached.sender] });
                if (m.imageMessage) { try { const s = await downloadContentFromMessage(m.imageMessage, 'image'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(update.key.remoteJid, { image: b, caption: '🖼️ *Deleted Image Recovered by BULL X!* 🐂' }); } catch {} }
                if (m.videoMessage) { try { const s = await downloadContentFromMessage(m.videoMessage, 'video'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(update.key.remoteJid, { video: b, caption: '🎥 *Deleted Video Recovered!* 🐂' }); } catch {} }
                if (m.stickerMessage) { try { const s = await downloadContentFromMessage(m.stickerMessage, 'sticker'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(update.key.remoteJid, { sticker: b }); } catch {} }
                if (m.audioMessage || m.voiceMessage) { try { const am = m.audioMessage || m.voiceMessage; const s = await downloadContentFromMessage(am, 'audio'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(update.key.remoteJid, { audio: b, mimetype: 'audio/mp4', ptt: true }); } catch {} }
                if (m.documentMessage) { try { const s = await downloadContentFromMessage(m.documentMessage, 'document'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(update.key.remoteJid, { document: b, fileName: m.documentMessage.fileName || 'deleted-file' }); } catch {} }
            } catch (e) { console.log('Antidelete V1 error:', e.message); }
        }
    });
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const m = messages[0]; if (!m.message) return;
        const proto = m.message.protocolMessage;
        if (proto && proto.type === 0 && proto.key) {
            try {
                const deletedId = proto.key.id;
                const chatId = proto.key.remoteJid || m.key.remoteJid;
                if (!settings.antidelete[chatId] && !settings.antidelete['GLOBAL']) return;
                const cached = msgCache.get(deletedId);
                if (!cached) { await sock.sendMessage(chatId, { text: `🚨 *ANTI-DELETE!* 🐂\n\nSomeone deleted a message but bot restarted / didn't cache it!` }); return; }
                const deleter = m.key.participant || m.key.remoteJid;
                const cm = cached.msg.message;
                const origBody = cm.conversation || cm.extendedTextMessage?.text || cm.imageMessage?.caption || cm.videoMessage?.caption || '';
                await sock.sendMessage(chatId, { text: `🚨 *ANTI-DELETE CAUGHT!* 🐂\n\n👤 Deleted by: @${deleter.split('@')[0]}\n📩 From: @${cached.sender.split('@')[0]}\n\n${origBody ? `💬 *Message:*\n${origBody}` : '📎 Media deleted - recovering...'}`, mentions: [deleter, cached.sender] });
                if (cm.imageMessage) { try { const s = await downloadContentFromMessage(cm.imageMessage, 'image'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(chatId, { image: b, caption: '🖼️ *Deleted Image Recovered!* 🐂' }); } catch {} }
                if (cm.videoMessage) { try { const s = await downloadContentFromMessage(cm.videoMessage, 'video'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(chatId, { video: b, caption: '🎥 *Deleted Video Recovered!* 🐂' }); } catch {} }
                if (cm.stickerMessage) { try { const s = await downloadContentFromMessage(cm.stickerMessage, 'sticker'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(chatId, { sticker: b }); } catch {} }
                if (cm.audioMessage) { try { const s = await downloadContentFromMessage(cm.audioMessage, 'audio'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(chatId, { audio: b, mimetype: 'audio/mp4', ptt: true }); } catch {} }
            } catch (e) { console.log('Antidelete V2 error:', e.message); }
        }
    });
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]; if (!msg.message) return;
        if (msg.message.protocolMessage) return;
        const from = msg.key.remoteJid; const isGroup = from.endsWith('@g.us'); const sender = msg.key.participant || msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || '';
        const btnResponse = msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.title || msg.message.templateButtonReplyMessage?.selectedId;
        if (btnResponse) {
            if (btnResponse === 'follow_channel' || btnResponse.includes('FOLLOW')) { await sock.sendMessage(from, { text: `📢 *${CHANNEL_NAME}*\n\nTap here to Follow! 👇\n${CHANNEL_LINK}` }, { quoted: msg }); return; }
            if (btnResponse === 'menu_btn' || btnResponse.includes('MENU')) { await sock.sendMessage(from, { text: getMenu() }, { quoted: msg }); return; }
            if (btnResponse === 'ping_btn' || btnResponse.includes('PING')) { await sock.sendMessage(from, { text: `🏓 *PONG!* 🐂\n✅ BULL X Online!` }, { quoted: msg }); return; }
        }
        const cleanNum = (id) => (id||'').split(':')[0].split('@')[0];
        const senderNum = cleanNum(sender);
        const ownerNum = cleanNum(OWNER_JID || OWNER_NUMBER);
        const isOwnerCommand = body.startsWith('.') && !body.includes('BULL X OFFICIAL CHANNEL') && !body.includes('whatsapp.com/channel');
        const isOwner = senderNum === ownerNum || msg.key.fromMe;
        if (msg.key.fromMe && !isOwnerCommand) return;
        if (msg.key.id?.startsWith('BAE5') && !isOwnerCommand) return;
        const isBot = msg.key.fromMe && !isOwnerCommand;
        if (isBot) return;
        if (from === 'status@broadcast') {
            try { if (settings.autoviewstatus) await sock.readMessages([msg.key]); if (settings.autolikestatus && !isBot) await sock.sendMessage('status@broadcast', { react: { text: pick(['❤️','🔥','😍','👍','😂','🙏']), key: msg.key } }); } catch {} return;
        }
        if (!isBot && settings.afk) {
            for (const [afkId, reason] of Object.entries(settings.afk)) { if (body.includes(afkId.split('@')[0])) { await sock.sendMessage(from, { text: `😴 @${afkId.split('@')[0]} is AFK!\nReason: ${reason}\nPlease wait...`, mentions: [afkId] }); break; } }
            if (settings.afk[sender]) { delete settings.afk[sender]; saveSettings(); await sock.sendMessage(from, { text: `👋 Welcome back @${sender.split('@')[0]}! You are no longer AFK!`, mentions: [sender] }); }
        }
        if (!isBot && (settings.autotyping || settings.autorecording)) {
            try { if (settings.autorecording) await sock.sendPresenceUpdate('recording', from); else if (settings.autotyping) await sock.sendPresenceUpdate('composing', from); await new Promise(r => setTimeout(r, 1200)); await sock.sendPresenceUpdate('paused', from); } catch {}
        }
        const reply = async (text, opts) => {
            if (text.includes('whatsapp.com/channel')) { await sock.sendMessage(from, { text: text }, { quoted: msg, ...opts }); return; }
            try {
                await sock.sendMessage(from, {
                    text: text,
                    footer: '🐂 BULL X V22 | Tap below to Follow! 👑',
                    buttons: [
                        { buttonId: 'follow_channel', buttonText: { displayText: '📢 FOLLOW CHANNEL' }, type: 1 },
                        { buttonId: 'menu_btn', buttonText: { displayText: '📋 MENU' }, type: 1 },
                        { buttonId: 'ping_btn', buttonText: { displayText: '⚡ PING' }, type: 1 }
                    ],
                    headerType: 1
                }, { quoted: msg, ...opts });
            } catch (e) {
                const footer = `\n\n━━━━━━━━━━━━━━━\n📢 *Follow ${CHANNEL_NAME}*\n🔗 ${CHANNEL_LINK}\n━━━━━━━━━━━━━━━`;
                await sock.sendMessage(from, { text: text + footer }, { quoted: msg, ...opts });
            }
        };
        const isImage = !!msg.message.imageMessage;
        if (msg.key.id) { msgCache.set(msg.key.id, { msg, sender, from }); if (msgCache.size > 1000) msgCache.delete(msgCache.keys().next().value); }
        let voMsg = msg.message.viewOnceMessageV2?.message || msg.message.viewOnceMessage?.message || msg.message.ephemeralMessage?.message?.viewOnceMessageV2?.message || msg.message.ephemeralMessage?.message?.viewOnceMessage?.message || msg.message.ephemeralMessage?.message || null;
        if (voMsg?.viewOnceMessageV2) voMsg = voMsg.viewOnceMessageV2.message;
        if (voMsg?.viewOnceMessage) voMsg = voMsg.viewOnceMessage.message;
        if (voMsg && (voMsg.imageMessage || voMsg.videoMessage || voMsg.audioMessage)) {
            try {
                if (voMsg.imageMessage) { const s = await downloadContentFromMessage(voMsg.imageMessage, 'image'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(from, { image: b, caption: '👀 *VIEW ONCE AUTO-OPENED!* 🐂\n\nSent by: @' + sender.split('@')[0] }, { mentions: [sender] }); }
                else if (voMsg.videoMessage) { const s = await downloadContentFromMessage(voMsg.videoMessage, 'video'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(from, { video: b, caption: '👀 *VIEW ONCE AUTO-OPENED!* 🐂' }); }
                else if (voMsg.audioMessage) { const s = await downloadContentFromMessage(voMsg.audioMessage, 'audio'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(from, { audio: b, mimetype: 'audio/mp4', ptt: true }); }
            } catch (e) { await sock.sendMessage(from, { text: '⚠️ *VIEW ONCE DETECTED but WhatsApp blocked it!*\n\nWhatsApp does NOT send View Once media to linked devices (bots).' }); }
            return;
        }
        if (isGroup && settings.antilink[from] && !isBot) {
            const hasLink = /(https?:\/\/|www\.|chat\.whatsapp\.com|t\.me\/|instagram\.com|youtube\.com|tiktok\.com)/i.test(body);
            if (hasLink && !body.includes('whatsapp.com/channel/0029VbCUCkkAInPkhAPNil1h')) { try { await sock.sendMessage(from, { delete: msg.key }); await sock.sendMessage(from, { text: `⚠️ @${sender.split('@')[0]} Links NOT allowed! Deleted by BULL X 🐂`, mentions: [sender] }); } catch {} return; }
        }
        if (body.trim() === '.vv' || body.trim() === '.viewonce' || body.trim() === '.vo') {
            try {
                const ctx = msg.message.extendedTextMessage?.contextInfo;
                if (!ctx?.quotedMessage && !ctx?.stanzaId) return reply('❌ REPLY to View Once first!\n\nLong-press View Once > Reply > Type .vv\n\n⚠️ DON\'T OPEN IT BEFORE!');
                let quoted = ctx?.quotedMessage; let inner = null;
                if (quoted) { inner = quoted.viewOnceMessageV2?.message || quoted.viewOnceMessage?.message || quoted.ephemeralMessage?.message?.viewOnceMessageV2?.message || quoted.ephemeralMessage?.message?.viewOnceMessage?.message || quoted.ephemeralMessage?.message || quoted; if (inner?.viewOnceMessageV2) inner = inner.viewOnceMessageV2.message; if (inner?.viewOnceMessage) inner = inner.viewOnceMessage.message; if (inner?.ephemeralMessage) inner = inner.ephemeralMessage.message; }
                if (!inner?.imageMessage && !inner?.videoMessage && !inner?.audioMessage && ctx?.stanzaId) { const cached = msgCache.get(ctx.stanzaId); if (cached) { const cm = cached.msg.message; inner = cm.viewOnceMessageV2?.message || cm.viewOnceMessage?.message || cm.ephemeralMessage?.message?.viewOnceMessageV2?.message || cm.ephemeralMessage?.message || cm; if (inner?.viewOnceMessageV2) inner = inner.viewOnceMessageV2.message; if (inner?.viewOnceMessage) inner = inner.viewOnceMessage.message; } }
                if (!inner) return reply('❌ Could not find View Once!\n\nReasons:\n1. You already OPENED it\n2. You didn\'t REPLY to it\n3. Bot was restarted after it was sent');
                let imgMsg = inner.imageMessage; let vidMsg = inner.videoMessage; let audMsg = inner.audioMessage || inner.voiceMessage;
                if (imgMsg) { const s = await downloadContentFromMessage(imgMsg, 'image'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(from, { image: b, caption: '👀 *VIEW ONCE OPENED!* 🐂' }, { quoted: msg }); return; }
                if (vidMsg) { const s = await downloadContentFromMessage(vidMsg, 'video'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(from, { video: b, caption: '👀 *VIEW ONCE OPENED!* 🐂' }, { quoted: msg }); return; }
                if (audMsg) { const s = await downloadContentFromMessage(audMsg, 'audio'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(from, { audio: b, mimetype: 'audio/mp4', ptt: true }, { quoted: msg }); return; }
                if (quoted?.imageMessage) { const s = await downloadContentFromMessage(quoted.imageMessage, 'image'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(from, { image: b, caption: '🖼️ Normal image (not View Once)' }, { quoted: msg }); return; }
                return reply('❌ This is NOT a View Once!');
            } catch (e) { await reply('❌ Failed! View Once expired or already opened!'); return; }
        }
        if (body.startsWith('.sticker') || body === '.s') {
            try {
                let buf = null;
                if (msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) { const q = msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage; const s = await downloadContentFromMessage(q, 'image'); buf = Buffer.from([]); for await (const c of s) buf = Buffer.concat([buf, c]); }
                else if (isImage) { const s = await downloadContentFromMessage(msg.message.imageMessage, 'image'); buf = Buffer.from([]); for await (const c of s) buf = Buffer.concat([buf, c]); }
                else return reply('Send image with .sticker or reply to image');
                const webp = await sharp(buf).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp().toBuffer();
                await sock.sendMessage(from, { sticker: webp }, { quoted: msg }); return;
            } catch { await reply('Sticker failed'); return; }
        }
        if (body.startsWith('.toimg') || body === '.toimage') {
            try {
                const quotedSticker = msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
                if (!quotedSticker) return reply('Reply to a sticker with .toimg');
                const s = await downloadContentFromMessage(quotedSticker, 'sticker'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]);
                const png = await sharp(b).png().toBuffer();
                await sock.sendMessage(from, { image: png, caption: '🖼️ Sticker to Image by BULL X 🐂' }, { quoted: msg }); return;
            } catch { return reply('ToImg failed'); }
        }
        if (!body.startsWith('.')) {
            const low = body.toLowerCase().trim();
            if (low === 'channel' || low === 'link' || low === 'follow' || low === 'mychannel' || low === 'bullx channel' || low === 'show channel') { await sock.sendMessage(from, { text: `📢 *${CHANNEL_NAME}*\n\n🔗 ${CHANNEL_LINK}\n\nTap to Follow! 🐂🔥` }, { quoted: msg }); return; }
            if (['hi','hello','hey','hii','sasa','niaje','mambo','poa'].includes(low)) await reply('Hey! 🐂 BULL X here! Type *.menu* 👑');
            if (low === 'bull' || low === 'bull x') await reply('BULL X MODE ACTIVATED! 🐂🔥');
            if (low.includes('i love you')) await reply('Aww I love you too! ❤️🐂');
            if (low.includes('good morning')) await reply('Good morning! ☀️ Have a blessed day!');
            if (low.includes('good night')) await reply('Good night! 😴 Sweet dreams!');
            return;
        }
        const args = body.slice(1).trim().split(/ +/); const command = args[0].toLowerCase(); const text = args.slice(1).join(' ');
        const targetUser = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msg.message.extendedTextMessage?.contextInfo?.participant || sender;
        const targetName = targetUser.split('@')[0].split(':')[0];
        const getBal = (id) => { if (!settings.economy[id]) settings.economy[id] = { bal: 1000, lastDaily: 0 }; return settings.economy[id]; };
        const onlyOwner = async () => { if (!isOwner) { await reply('❌ *VIP ONLY!* 👑\n\nOnly the number that scanned QR can use this!\n\nYour number: ' + senderNum + '\nOwner number: ' + ownerNum); return false; } return true; };
        const checkAdmin = async () => {
            if (!isGroup) { await reply('Groups only!'); return null; }
            const metadata = await sock.groupMetadata(from); const participants = metadata.participants; const clean = (id) => (id||'').split(':')[0].split('@')[0];
            const myNum = clean(sock.user.id); const myLid = clean(sock.user.lid||''); const senderNum2 = clean(sender);
            const senderInfo = participants.find(p=>clean(p.id)===senderNum2||clean(p.lid||'')===senderNum2);
            const botInfo = participants.find(p=>clean(p.id)===myNum||clean(p.lid||'')===myNum||clean(p.id)===senderNum2);
            const isSenderAdmin = senderInfo?.admin==='admin'||senderInfo?.admin==='superadmin'; const isBotAdmin = botInfo?.admin==='admin'||botInfo?.admin==='superadmin'||isSenderAdmin;
            if (!isSenderAdmin) { await reply('❌ You are not admin!'); return null; }
            if (!isBotAdmin) { await reply('❌ BULL X is NOT admin!'); return null; }
            return { metadata, participants, clean };
        };
        const getTarget = async (info) => {
            let target = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msg.message.extendedTextMessage?.contextInfo?.participant;
            if (!target && text) { const num = text.replace(/[^0-9]/g,''); if (num) target = num+'@s.whatsapp.net'; }
            if (!target) { await reply(`Tag or reply! Example: .${command} @user`); return null; }
            let realTarget = target; const tc = info.clean(target); const found = info.participants.find(p=>info.clean(p.id)===tc||info.clean(p.lid||'')===tc); if (found) realTarget = found.id;
            return { realTarget, tc };
        };
        if (command === 'ping' || command === 'speed' || command === 'pong') {
            const start = Date.now(); const msgTime = Number(msg.messageTimestamp) * 1000; const latency = Math.max(1, Date.now() - msgTime); const uptimeMs = Date.now() - BOT_START; const upH = Math.floor(uptimeMs / 3600000); const upM = Math.floor((uptimeMs % 3600000) / 60000); const upS = Math.floor((uptimeMs % 60000) / 1000); const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1); let speedLabel = latency < 200 ? '⚡ ULTRA FAST! God Mode!' : latency < 500 ? '🔥 SUPER FAST!' : latency < 1000 ? '✅ Fast' : '🐢 Slow - Check Render';
            const sent = await sock.sendMessage(from, { text: `🏓 *PINGING...*` }, { quoted: msg }); const roundTrip = Date.now() - start; try { await sock.sendMessage(from, { delete: sent.key }); } catch {}
            return reply(`🏓 *PONG!* 🐂\n\n⚡ *Speed:* ${roundTrip}ms\n📡 *Latency:* ${latency}ms\n${speedLabel}\n\n⏱️ *Uptime:* ${upH}h ${upM}m ${upS}s\n💾 *RAM:* ${mem} MB\n🤖 *Bot:* BULL X V22\n👑 *Owner:* +${ownerNum}\n👨‍💻 *Dev:* ${DEV_NAME} +${DEV_NUMBER}\n✅ *Status:* Online & Stable`);
        }
        if (command === 'img' || command === 'image' || command === 'imagine') { if (!text) return reply('Use: .img Cute cat in Kisii'); try { await reply('🎨 Generating image...'); const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?width=1024&height=1024&seed=${Math.floor(Math.random()*99999)}&nologo=true`; return sock.sendMessage(from, { image: { url }, caption: `🎨 *BULL X AI IMAGE*\n\nPrompt: ${text}` }, { quoted: msg }); } catch { return reply('Image failed, try again!'); } }
        if (command === 'tts' || command === 'say' || command === 'voice') { if (!text) return reply('Use: .tts Hello everyone'); try { const url = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(text)}`; return sock.sendMessage(from, { audio: { url }, mimetype: 'audio/mp4', ptt: true }, { quoted: msg }); } catch { return reply('TTS failed'); } }
        if (command === 'screenshot' || command === 'ss' || command === 'webshot') { let link = body.match(/https?:\/\/\S+/)?.[0] || (text.startsWith('http') ? text : `https://${text}`); if (!text) return reply('Use: .screenshot google.com'); try { const url = `https://image.thum.io/get/width/1200/crop/800/noanimate/${link}`; return sock.sendMessage(from, { image: { url }, caption: `📸 *SCREENSHOT*\n${link}` }, { quoted: msg }); } catch { return reply('Screenshot failed'); } }
        if (command === 'shortlink' || command === 'short' || command === 'tiny') { let link = body.match(/https?:\/\/\S+/)?.[0] || text; if (!link) return reply('Use: .shortlink https://google.com'); try { const r = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(link)}`); const s = await r.text(); return reply(`🔗 *SHORT LINK*\n\nOriginal: ${link}\nShort: ${s}`); } catch { return reply('Shortlink failed'); } }
        if (command === 'news') { try { const r = await fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=3'); const d = await r.json(); let t='📰 *LATEST NEWS*\n\n'; d.results.forEach((a,i)=>{ t+=`${i+1}. ${a.title}\n🔗 ${a.url}\n\n`; }); return reply(t); } catch { return reply('News failed, try .ai latest news in Kenya'); } }
        if (command === 'crypto' || command === 'btc') { try { const coin = text.toLowerCase()||'bitcoin'; const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd,kes&include_24hr_change=true`); const d = await r.json(); const p = d[coin]; if (!p) return reply('Try: .crypto bitcoin / ethereum / solana'); return reply(`💰 *CRYPTO - ${coin.toUpperCase()}*\n\n💵 USD: $${p.usd}\n🇰🇪 KES: Ksh ${Math.round(p.kes)}\n📈 24h: ${p.usd_24h_change?.toFixed(2)}%`); } catch { return reply('Crypto failed'); } }
        if (command === 'currency' || command === 'convert' || command === 'exchange') { const amt = parseFloat(args[1])||100; const fromC = (args[2]||'USD').toUpperCase(); const toC = (args[3]||'KES').toUpperCase(); try { const r = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromC}`); const d = await r.json(); const rate = d.rates[toC]; if (!rate) return reply('Try: .currency 100 USD KES'); return reply(`💱 *CURRENCY*\n\n${amt} ${fromC} = ${(amt*rate).toFixed(2)} ${toC}\nRate: 1 ${fromC} = ${rate} ${toC}`); } catch { return reply('Currency failed'); } }
        if (command === 'github' || command === 'gh') { if (!text) return reply('Use: .github torvalds'); try { const r = await fetch(`https://api.github.com/users/${text}`); const d = await r.json(); if (d.message) return reply('User not found!'); return reply(`🐙 *GITHUB - ${d.login}*\n\n👤 Name: ${d.name||'N/A'}\n📝 Bio: ${d.bio||'N/A'}\n📍 Location: ${d.location||'N/A'}\n👥 Followers: ${d.followers}\n📦 Repos: ${d.public_repos}\n🔗 ${d.html_url}`); } catch { return reply('Github failed'); } }
        if (command === 'wallpaper' || command === 'wall') { try { const r = await fetch('https://picsum.photos/1080/1920'); return sock.sendMessage(from, { image: { url: r.url }, caption: '🖼️ *WALLPAPER* by BULL X 🐂' }, { quoted: msg }); } catch { return reply('Wallpaper failed'); } }
        if (command === 'fancy' || command === 'fancytext') { if (!text) return reply('Use: .fancy hello'); const map = { a:'𝖆',b:'𝖇',c:'𝖈',d:'𝖉',e:'𝖊',f:'𝖋',g:'𝖌',h:'𝖍',i:'𝖎',j:'𝖏',k:'𝖐',l:'𝖑',m:'𝖒',n:'𝖓',o:'𝖔',p:'𝖕',q:'𝖖',r:'𝖗',s:'𝖘',t:'𝖙',u:'𝖚',v:'𝖛',w:'𝖜',x:'𝖝',y:'𝖞',z:'𝖟' }; let out=''; for(let ch of text) out+=map[ch]||ch; return reply(`✨ *FANCY*\n\n${out}`); }
        if (command === 'reminder' || command === 'remind') { const mins = parseInt(args[1])||5; const msgText = args.slice(2).join(' ')||'Reminder!'; setTimeout(async()=>{ try{ await sock.sendMessage(from, { text: `⏰ *REMINDER!*\n\n@${sender.split('@')[0]}: ${msgText}`, mentions: [sender] }); }catch{} }, mins*60000); return reply(`⏰ Reminder set for ${mins} minutes!\nMessage: ${msgText}`); }
        if (command === 'todo' || command === 'task') { if (!text) return reply('Use: .todo Buy milk'); if (!settings.todos) settings.todos={}; if (!settings.todos[sender]) settings.todos[sender]=[]; settings.todos[sender].push(text); saveSettings(); return reply(`✅ Todo added!\n\nYour todos (${settings.todos[sender].length}):\n${settings.todos[sender].map((t,i)=>`${i+1}. ${t}`).join('\n')}`); }
        if (command === 'todos' || command === 'mytodos') { const list = (settings.todos?.[sender]||[]); if (!list.length) return reply('No todos! Use .todo Buy milk'); return reply(`📋 *YOUR TODOS*\n\n${list.map((t,i)=>`${i+1}. ${t}`).join('\n')}\n\nUse .cleartodo to clear`); }
        if (command === 'cleartodo') { if (settings.todos) settings.todos[sender]=[]; saveSettings(); return reply('🗑️ Todos cleared!'); }
        if (command === 'poll' || command === 'vote') { if (!text) return reply('Use: .poll Best team? | Gor | AFC | Tusker'); const parts = text.split('|').map(s=>s.trim()); if (parts.length < 3) return reply('Use: .poll Question | Option1 | Option2'); try { return sock.sendMessage(from, { poll: { name: parts[0], values: parts.slice(1), selectableCount: 1 } }, { quoted: msg }); } catch { return reply('Poll failed'); } }
        if (command === 'welcome') { if (!await onlyOwner()) return; if (!isGroup) return reply('Groups only!'); if (text==='on') { if (!settings.welcome) settings.welcome={}; settings.welcome[from]=true; saveSettings(); return reply('✅ Welcome ON!'); } if (text==='off') { if (settings.welcome) delete settings.welcome[from]; saveSettings(); return reply('❌ Welcome OFF'); } return reply('Use: .welcome on/off'); }
        if (command === 'goodbye' || command === 'bye') { if (!await onlyOwner()) return; if (!isGroup) return reply('Groups only!'); if (text==='on') { if (!settings.goodbye) settings.goodbye={}; settings.goodbye[from]=true; saveSettings(); return reply('✅ Goodbye ON!'); } if (text==='off') { if (settings.goodbye) delete settings.goodbye[from]; saveSettings(); return reply('❌ Goodbye OFF'); } return reply('Use: .goodbye on/off'); }
        if (command === 'vcard' || command === 'contact' || command === 'save') { const name = text||`BULL X ${targetName}`; try { return sock.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;TYPE=CELL:${targetUser.split('@')[0]}\nEND:VCARD` }] } }, { quoted: msg }); } catch { return reply('VCard failed'); } }
        if (command === 'getpp' || command === 'pp') { try { const url = await sock.profilePictureUrl(targetUser, 'image'); return sock.sendMessage(from, { image: { url }, caption: `🖼️ Profile pic of @${targetName}` }, { quoted: msg }); } catch { return reply('No profile pic or private!'); } }
        if (command === 'binary') { if (!text) return reply('Use: .binary hello'); return reply(`💻 Binary:\n${text.split('').map(c=>c.charCodeAt(0).toString(2).padStart(8,'0')).join(' ')}`); }
        if (command === 'morse') { if (!text) return reply('Use: .morse SOS'); const m = { a:'.-',b:'-...',c:'-.-.',d:'-..',e:'.',f:'..-.',g:'--.',h:'....',i:'..',j:'.---',k:'-.-',l:'.-..',m:'--',n:'-.',o:'---',p:'.--.',q:'--.-',r:'.-.',s:'...',t:'-',u:'..-',v:'...-',w:'.--',x:'-..-',y:'-.--',z:'--..',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.',0:'-----',' ':'/' }; return reply(`📻 Morse:\n${text.toLowerCase().split('').map(c=>m[c]||c).join(' ')}`); }
        if (command === 'channel' || command === 'follow' || command === 'join' || command === 'link' || command === 'mychannel' || command === 'mychanel' || command === 'bullx' || command === 'support' || command === 'subscribe' || command === 'updates') {
            try { await sock.sendMessage(from, { text: `📢 *${CHANNEL_NAME}* 🐂👑\n\n🔥 *JOIN BULL X CHANNEL!*\n\n✅ New Commands First!\n✅ Giveaways!\n✅ Updates & Fixes!\n\n👇 *Tap the link below to Follow!* 👇`, footer: '🐂 BULL X V22 | Follow for More! 👑', buttons: [{ buttonId: 'follow_channel', buttonText: { displayText: '📢 FOLLOW CHANNEL' }, type: 1 }, { buttonId: 'menu_btn', buttonText: { displayText: '📋 MENU' }, type: 1 }], headerType: 1 }, { quoted: msg }); } catch {}
            return sock.sendMessage(from, { text: `🔗 *YOUR CHANNEL LINK:*\n\n${CHANNEL_LINK}\n\n👆 Tap it to Follow! 🐂🔥` }, { quoted: msg });
        }
        if (command === 'menu' || command === 'help' || command === 'menu2') return reply(getMenu());
        if (command === 'owner' || command === 'dev' || command === 'developer' || command === 'creator' || command === 'eze' || command === 'ezekia') return reply(`👨‍💻 *BULL X DEVELOPER* 👑🔥\n\n👤 *Name:* ${DEV_NAME}\n📞 *Dev Number:* +${DEV_NUMBER}\n💬 *WhatsApp:* wa.me/${DEV_NUMBER}\n🤖 *Bot:* BULL X V22\n👑 *Current Owner (Scanned QR):* +${ownerNum}\n\n📢 *Channel:* ${CHANNEL_LINK}\n\nContact Dev for:\n✅ Bot Setup\n✅ New Features\n✅ Support & Fixes!`);
        if (command === 'info') return reply(`🐂 *BULL X V22*\n\n👨‍💻 *Dev:* ${DEV_NAME}\n📞 *Dev Number:* +${DEV_NUMBER}\n💬 *Contact:* wa.me/${DEV_NUMBER}\n👑 *Owner (Scanned):* +${ownerNum}\n\nVersion: V22 Dynamic Owner + Dev\nCommands: 220+\nStatus: Online ✅`);
        if (command === 'time') return reply('🕒 ' + new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }));
        if (command === 'date') return reply('📅 ' + new Date().toLocaleDateString('en-KE', { timeZone: 'Africa/Nairobi', weekday:'long', year:'numeric', month:'long', day:'numeric' }));
        if (command === 'rules') return reply('📜 *GROUP RULES*\n1. No links\n2. No insults\n3. Respect admins\n4. No spam\n5. 3 Warns = Kick\n6. Have fun! 🐂');
        if (command === 'bull') return reply('🐂🔥 BULL X MODE ACTIVATED! 🔥🐂');
        if (command === 'alive') return reply(`🐂 *BULL X IS ALIVE!* 🔥\n✅ Online\n✅ 220+ Commands\n✅ V22 Dynamic Owner + Dev 👑\n👨‍💻 Dev: ${DEV_NAME}\n👑 Owner: +${ownerNum}`);
        if (command === 'checkadmin') { try { const m = await sock.groupMetadata(from); const clean = (id) => (id||'').split(':')[0].split('@')[0]; return reply(`🔍 Bot PN: ${clean(sock.user.id)}\nBot LID: ${clean(sock.user.lid||'none')}\nOwner: +${ownerNum}\nDev: ${DEV_NAME} +${DEV_NUMBER}\nMembers: ${m.participants.length}`); } catch { return reply('Check failed'); } }
        if (command === 'profile') { const bal = getBal(sender); const warns = (settings.warnings[from]||{})[sender]||0; return reply(`👤 *YOUR PROFILE* 👑\n\n📞 Number: @${sender.split('@')[0]}\n💰 Balance: ${bal.bal} coins\n⚠️ Warnings: ${warns}/3\n🏆 Rank: ${bal.bal>5000?'Billionaire 🤑':bal.bal>2000?'Rich 💰':'Hustler 💪'}\n🐂 Bot: BULL X V22\n👨‍💻 Dev: ${DEV_NAME}`); }
        if (command === 'afk') { settings.afk[sender] = text||'AFK'; saveSettings(); return reply(`😴 You are now AFK!\nReason: ${text||'AFK'}\nBot will tell anyone who tags you!`); }
        if (command === 'autotyping') { if (!await onlyOwner()) return; if (text==='on') { settings.autotyping=true; saveSettings(); return reply('✅ *AUTO-TYPING ON* ⌨️'); } if (text==='off') { settings.autotyping=false; saveSettings(); return reply('❌ Auto-Typing OFF'); } return reply('Use: .autotyping on/off'); }
        if (command === 'autorecording') { if (!await onlyOwner()) return; if (text==='on') { settings.autorecording=true; settings.autotyping=false; saveSettings(); return reply('✅ *AUTO-RECORDING ON* 🎙️'); } if (text==='off') { settings.autorecording=false; saveSettings(); return reply('❌ Auto-Recording OFF'); } return reply('Use: .autorecording on/off'); }
        if (command === 'autoviewstatus') { if (!await onlyOwner()) return; if (text==='on') { settings.autoviewstatus=true; saveSettings(); return reply('✅ *AUTO-VIEW STATUS ON* 👀'); } if (text==='off') { settings.autoviewstatus=false; saveSettings(); return reply('❌ Auto-View Status OFF'); } return reply('Use: .autoviewstatus on/off'); }
        if (command === 'autolikestatus') { if (!await onlyOwner()) return; if (text==='on') { settings.autolikestatus=true; saveSettings(); return reply('✅ *AUTO-LIKE STATUS ON* ❤️'); } if (text==='off') { settings.autolikestatus=false; saveSettings(); return reply('❌ Auto-Like Status OFF'); } return reply('Use: .autolikestatus on/off'); }
        if (command === 'autostatus') { if (!await onlyOwner()) return; if (text==='on') { settings.autotyping=true; settings.autorecording=false; settings.autoviewstatus=true; settings.autolikestatus=true; saveSettings(); return reply('✅ *ALL AUTO ON!* 👑'); } if (text==='off') { settings.autotyping=false; settings.autorecording=false; settings.autoviewstatus=false; settings.autolikestatus=false; saveSettings(); return reply('❌ All Auto OFF'); } return reply('Use: .autostatus on/off'); }
        if (command === 'settings') return reply(`⚙️ *SETTINGS*\n\n👑 Owner (Scanned): +${ownerNum}\n👨‍💻 Dev: ${DEV_NAME} +${DEV_NUMBER}\n⌨️ Typing: ${settings.autotyping?'✅ ON':'❌ OFF'}\n🎙️ Recording: ${settings.autorecording?'✅ ON':'❌ OFF'}\n👀 View Status: ${settings.autoviewstatus?'✅ ON':'❌ OFF'}\n❤️ Like Status: ${settings.autolikestatus?'✅ ON':'❌ OFF'}\n🔗 Anti-Link: ${settings.antilink[from]?'✅ ON':'❌ OFF'}\n🚨 Anti-Delete: ${settings.antidelete[from]||settings.antidelete['GLOBAL']?'✅ ON':'❌ OFF'}`);
        if (command === 'balance' || command === 'bal' || command === 'money') { const u = getBal(sender); return reply(`💰 *YOUR BALANCE*\n\nCoins: ${u.bal} 🪙\nRank: ${u.bal>5000?'Billionaire 🤑':u.bal>2000?'Rich 💰':'Hustler 💪'}`); }
        if (command === 'daily') { const u = getBal(sender); const now = Date.now(); if (now - u.lastDaily < 86400000) return reply(`⏳ You already claimed daily! Come back tomorrow! Balance: ${u.bal}`); u.lastDaily = now; u.bal += 500; saveSettings(); return reply(`🎁 *DAILY REWARD!*\n\n+500 coins! 🎉\nNew Balance: ${u.bal} 🪙`); }
        if (command === 'work') { const u = getBal(sender); const earn = Math.floor(Math.random()*400)+100; const jobs = ['Matatu Conductor 🚌','Farmer 🌾','Boda Boda 🏍️','Shopkeeper 🏪','Teacher 📚','DJ 🎧','Hustler 💪']; u.bal += earn; saveSettings(); return reply(`💼 *WORK*\n\nYou worked as ${pick(jobs)}!\nEarned: +${earn} coins!\nBalance: ${u.bal} 🪙`); }
        if (command === 'beg') { const u = getBal(sender); const earn = Math.floor(Math.random()*100)+10; u.bal += earn; saveSettings(); return reply(`🙏 Someone gave you ${earn} coins out of pity! 😂\nBalance: ${u.bal}`); }
        if (command === 'gamble') { const u = getBal(sender); const amt = parseInt(text)||100; if (amt > u.bal) return reply(`❌ You don't have ${amt}! Balance: ${u.bal}`); if (Math.random() > 0.5) { u.bal += amt; saveSettings(); return reply(`🎰 *YOU WON!* 🎉\n+${amt} coins!\nBalance: ${u.bal}`); } else { u.bal -= amt; saveSettings(); return reply(`🎰 *YOU LOST!* 😂\n-${amt} coins!\nBalance: ${u.bal}`); } }
        if (command === 'rob') { const u = getBal(sender); const victim = getBal(targetUser); if (victim.bal < 100) return reply('That person is too broke to rob! 😂'); const stolen = Math.floor(Math.random()*200)+50; const amt = Math.min(stolen, victim.bal); if (Math.random() > 0.5) { u.bal += amt; victim.bal -= amt; saveSettings(); return reply(`😈 *ROBBERY SUCCESS!*\nYou stole ${amt} coins from @${targetName}!\nYour Balance: ${u.bal}`, { mentions: [targetUser] }); } else { u.bal -= 100; saveSettings(); return reply(`🚔 *CAUGHT!* You failed to rob and paid 100 fine! Balance: ${u.bal}`); } }
        if (command === 'pay') { const amt = parseInt(args[args.length-1])||0; const u = getBal(sender); if (amt <= 0) return reply('Use: .pay @user 100'); if (amt > u.bal) return reply('Not enough coins!'); const v = getBal(targetUser); u.bal -= amt; v.bal += amt; saveSettings(); return reply(`💸 Sent ${amt} coins to @${targetName}!\nYour Balance: ${u.bal}`, { mentions: [targetUser] }); }
        if (command === 'shop') return reply(`🛒 *BULL X SHOP*\n\n🚗 Lamborghini - 10000 coins (.buy lamborghini)\n🏠 Mansion - 20000 (.buy mansion)\n📱 iPhone 16 - 5000 (.buy iphone)\n🐂 Bull X Crown - 1000 (.buy crown)\n🍕 Pizza - 100 (.buy pizza)`);
        if (command === 'buy') { const u = getBal(sender); const items = { lamborghini: 10000, mansion: 20000, iphone: 5000, crown: 1000, pizza: 100, car: 5000 }; const item = text.toLowerCase(); const price = items[item]; if (!price) return reply('Item not found! Use .shop'); if (u.bal < price) return reply(`❌ Not enough! Need ${price}, you have ${u.bal}`); u.bal -= price; saveSettings(); return reply(`✅ You bought ${item} for ${price} coins! 🎉\nBalance: ${u.bal}`); }
        if (command === 'leaderboard' || command === 'lb') { const sorted = Object.entries(settings.economy).sort((a,b)=>b[1].bal-a[1].bal).slice(0,5); let t = '🏆 *RICHEST LEADERBOARD* 💰\n\n'; sorted.forEach(([id, d], i) => { t += `${i+1}. @${id.split('@')[0]} - ${d.bal} coins\n`; }); if (!sorted.length) t += 'No one has played yet! Use .daily'; return sock.sendMessage(from, { text: t, mentions: sorted.map(([id])=>id) }, { quoted: msg }); }
        if (command === 'cat') { try { const r = await fetch('https://api.thecatapi.com/v1/images/search'); const d = await r.json(); return sock.sendMessage(from, { image: { url: d[0].url }, caption: '🐱 *CUTE CAT!* By BULL X 🐂' }, { quoted: msg }); } catch { return reply('🐱 Cat: Meow! 😻'); } }
        if (command === 'dog') { try { const r = await fetch('https://dog.ceo/api/breeds/image/random'); const d = await r.json(); return sock.sendMessage(from, { image: { url: d.message }, caption: '🐶 *CUTE DOG!* By BULL X 🐂' }, { quoted: msg }); } catch { return reply('🐶 Dog: Woof! 🐕'); } }
        if (command === 'fox') { try { const r = await fetch('https://randomfox.ca/floof/'); const d = await r.json(); return sock.sendMessage(from, { image: { url: d.image }, caption: '🦊 *CUTE FOX!*' }, { quoted: msg }); } catch { return reply('🦊 Fox!'); } }
        if (command === 'panda') return reply('🐼 Panda: I love bamboo! 🎋');
        if (command === 'bird') return reply('🐦 Bird: Tweet tweet! 🎶');
        if (command === 'anime') return reply(`🎌 *ANIME QUOTE*\n\n${pick(["'Whatever you do, enjoy it to the fullest.' - Naruto 🍥","'If you don't take risks, you can't create a future.' - Monkey D. Luffy 🏴‍☠️","'Push through the pain. Giving up hurts more.' - Vegeta 💪"])}`);
        if (command === 'waifu') { try { const r = await fetch('https://api.waifu.pics/sfw/waifu'); const d = await r.json(); return sock.sendMessage(from, { image: { url: d.url }, caption: '💖 *YOUR WAIFU!* By BULL X' }, { quoted: msg }); } catch { return reply('💖 Waifu!'); } }
        if (command === 'neko') { try { const r = await fetch('https://api.waifu.pics/sfw/neko'); const d = await r.json(); return sock.sendMessage(from, { image: { url: d.url }, caption: '🐱 *NEKO!*' }, { quoted: msg }); } catch { return reply('🐱 Neko!'); } }
        if (command === 'manga') return reply('📚 *MANGA*\n\nTop: One Piece, Naruto, Demon Slayer, Jujutsu Kaisen!');
        if (command === 'naruto') return reply('🍥 *NARUTO*\n\nBelieve it! Dattebayo! Naruto Uzumaki - The Hokage! 🔥');
        if (command === 'luffy') return reply('🏴‍☠️ *LUFFY*\n\nI will be King of the Pirates! Gear 5! 🔥');
        if (command === 'goku') return reply('🐉 *GOKU*\n\nKamehameha! Super Saiyan! 💪🔥');
        if (command === 'horoscope' || command === 'zodiac') { const sign = text.toLowerCase()||'leo'; return reply(`🔮 *HOROSCOPE - ${sign.toUpperCase()}*\n\n${HOROSCOPE[sign]||'Try: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces'}`); }
        if (command === 'lyrics') {
            if (!text) return reply('Use: .lyrics Komasava\n.lyrics Rush Ayra Starr\n.lyrics Single Again Harmonize');
            try {
                await reply('🎵 *Searching lyrics for:* ' + text);
                let lyrics = null; let artist = ''; let track = text;
                try { const r = await fetch(`https://lrclib.net/api/search?track_name=${encodeURIComponent(text)}`); const d = await r.json(); if (d && d[0]?.plainLyrics) { lyrics = d[0].plainLyrics; track = d[0].trackName; artist = d[0].artistName; } } catch {}
                if (!lyrics) { try { const parts = text.split(' - '); const art = parts[0] || 'Diamond Platnumz'; const song = parts[1] || text; const r = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(art)}/${encodeURIComponent(song)}`); const d = await r.json(); if (d.lyrics) lyrics = d.lyrics; } catch {} }
                if (!lyrics) { try { const r = await fetch(`https://api.lyrics.ovh/v1/Diamond%20Platnumz/${encodeURIComponent(text)}`); const d = await r.json(); if (d.lyrics) lyrics = d.lyrics; } catch {} }
                if (!lyrics) return reply(`❌ *Lyrics not found for "${text}"!*\n\nTry:\n.lyrics ${text} - Diamond\n.lyrics Komasava\n\nOr use .ai for lyrics:\n.ai Write lyrics of ${text}`);
                return reply(`🎵 *LYRICS - ${track} ${artist ? '- ' + artist : ''}*\n\n${lyrics.slice(0, 2000)}\n\n---\nUse .play ${text} to listen!`);
            } catch (e) { return reply('Lyrics failed, try .ai lyrics of ' + text); }
        }
        if (command === 'translate') { if (!text) return reply('Use: .translate Hello to Swahili'); return reply(`🌍 Use .ai for translation:\n.ai Translate "${text}" to Swahili`); }
        if (command === 'warn') { const info = await checkAdmin(); if (!info) return; const t = await getTarget(info); if (!t) return; if (!settings.warnings[from]) settings.warnings[from] = {}; settings.warnings[from][t.realTarget] = (settings.warnings[from][t.realTarget]||0)+1; saveSettings(); const count = settings.warnings[from][t.realTarget]; if (count >= 3) { settings.warnings[from][t.realTarget] = 0; saveSettings(); try { await sock.groupParticipantsUpdate(from, [t.realTarget], 'remove'); return sock.sendMessage(from, { text: `🚨 @${t.tc} got 3/3 WARNINGS! KICKED! 🐂`, mentions: [t.realTarget] }); } catch { return reply('Failed to kick'); } } return sock.sendMessage(from, { text: `⚠️ *WARNING ${count}/3*\n\n@${t.tc} warned!\nReason: ${text||'Breaking rules'}\n3 warns = Kick!`, mentions: [t.realTarget] }); }
        if (command === 'warnings') { const info = await checkAdmin(); if (!info) return; const t = await getTarget(info); if (!t) return; const count = (settings.warnings[from]||{})[t.realTarget]||0; return reply(`⚠️ *WARNINGS for @${t.tc}*\nWarnings: ${count}/3`); }
        if (command === 'resetwarn' || command === 'unwarn') { const info = await checkAdmin(); if (!info) return; const t = await getTarget(info); if (!t) return; if (settings.warnings[from]) settings.warnings[from][t.realTarget]=0; saveSettings(); return reply(`✅ Warnings cleared for @${t.tc}!`); }
        if (command === 'lock' || command === 'mute') { const info = await checkAdmin(); if (!info) return; try { await sock.groupSettingUpdate(from, 'announcement'); return reply('🔒 *GROUP LOCKED!* Only admins can chat!'); } catch { return reply('Failed'); } }
        if (command === 'unlock' || command === 'unmute') { const info = await checkAdmin(); if (!info) return; try { await sock.groupSettingUpdate(from, 'not_announcement'); return reply('🔓 *GROUP UNLOCKED!* Everyone can chat!'); } catch { return reply('Failed'); } }
        if (command === 'hidetag') { const info = await checkAdmin(); if (!info) return; try { const parts = info.participants.map(p=>p.id); return sock.sendMessage(from, { text: text||'🐂 Hidden Tag!', mentions: parts }); } catch { return reply('Failed'); } }
        if (command === 'setname') { const info = await checkAdmin(); if (!info) return; if (!text) return reply('Use: .setname New Name'); try { await sock.groupUpdateSubject(from, text); return reply(`✅ Group name: *${text}*`); } catch { return reply('Failed'); } }
        if (command === 'setdesc') { const info = await checkAdmin(); if (!info) return; if (!text) return reply('Use: .setdesc New desc'); try { await sock.groupUpdateDescription(from, text); return reply(`✅ Description updated!`); } catch { return reply('Failed'); } }
        if (command === 'revoke') { const info = await checkAdmin(); if (!info) return; try { const code = await sock.groupRevokeInvite(from); return reply(`🔗 *NEW LINK*\nhttps://chat.whatsapp.com/${code}`); } catch { return reply('Failed'); } }
        if (command === 'joke') return reply('😂 *JOKE*\n\n' + pick(JOKES));
        if (command === 'dadjoke') { try { const r = await fetch('https://icanhazdadjoke.com/', { headers: { Accept: 'application/json' } }); const d = await r.json(); return reply(`😂 *DAD JOKE*\n\n${d.joke}`); } catch { return reply('😂 Why did chicken cross road? To get to other side!'); } }
        if (command === 'fact') return reply('🧠 *FACT*\n\n' + pick(FACTS));
        if (command === 'quote') return reply('💬 *QUOTE*\n\n' + pick(QUOTES));
        if (command === 'quote2') { try { const r = await fetch('https://api.quotable.io/random'); const d = await r.json(); return reply(`💬 *QUOTE*\n\n"${d.content}"\n- ${d.author}`); } catch { return reply('Quote failed'); } }
        if (command === 'meme') return reply('😂 *MEME*\n\n' + pick(JOKES));
        if (command === 'motivate' || command === 'motivation') return reply('🔥 *MOTIVATION*\n\n' + pick(MOTIVATION));
        if (command === 'bible' || command === 'verse') return reply('📖 *BIBLE*\n\n' + pick(BIBLE));
        if (command === 'football' || command === 'soccer') return reply(pick(FOOTBALL));
        if (command === 'roast') return reply(`🔥 *ROAST FOR @${targetName}*\n\n${pick(ROASTS)}`, { mentions: [targetUser] });
        if (command === 'insult') return reply(`😂 @${targetName} ${pick(ROASTS)}`, { mentions: [targetUser] });
        if (command === 'compliment') return reply(`❤️ @${targetName} You are amazing! ✨`, { mentions: [targetUser] });
        if (command === '8ball') { const ans = pick(['Yes! ✅','No! ❌','Maybe... 🤔','Definitely! 💯','Ask again...','Without a doubt!','My sources say NO!','Signs point to YES!']); return reply(`🎱 *8-BALL*\nQ: ${text||'Will I be rich?'}\nA: ${ans}`); }
        if (command === 'dice') return reply(`🎲 You rolled: ${Math.floor(Math.random()*6)+1} !`);
        if (command === 'coin' || command === 'flip' || command === 'toss') return reply(`🪙 ${pick(['HEADS! 👑','TAILS! 🪙'])}`);
        if (command === 'truth') return reply('🤫 *TRUTH*\n\n' + pick(TRUTHS));
        if (command === 'dare') return reply('😈 *DARE*\n\n' + pick(DARES));
        if (command === 'riddle') { const r = pick(RIDDLES); return reply(`🧩 *RIDDLE*\n\n${r.q}\n\nAnswer: ${r.a}`); }
        if (command === 'love') { const p = Math.floor(Math.random()*101); return reply(`❤️ *LOVE METER*\n\n@${targetName} ❤️ You\nLove: ${p}%\n${p>80?'TRUE LOVE! 💍':p>50?'Good match! 😍':'Just friends... 😅'}`, { mentions: [targetUser] }); }
        if (command === 'ship') return reply(`💘 *SHIP*\n\n${text||'You + Me'} = ${Math.floor(Math.random()*101)}% match! 💑`);
        if (command === 'howgay') return reply(`🏳️‍🌈 @${targetName} is ${Math.floor(Math.random()*101)}% gay! 😂`, { mentions: [targetUser] });
        if (command === 'howcool') return reply(`😎 @${targetName} is ${Math.floor(Math.random()*101)}% cool! 🔥`, { mentions: [targetUser] });
        if (command === 'howrich') return reply(`💰 @${targetName} will be ${pick(['Millionaire! 💰','Billionaire! 🤑','Broke! 😂'])}`, { mentions: [targetUser] });
        if (command === 'howold') return reply(`🎂 @${targetName} looks ${Math.floor(Math.random()*40)+15} years old!`, { mentions: [targetUser] });
        if (command === 'smart') return reply(`🧠 @${targetName} IQ is ${Math.floor(Math.random()*100)+50}!`, { mentions: [targetUser] });
        if (command === 'beautiful') return reply(`😍 @${targetName} is ${Math.floor(Math.random()*101)}% beautiful!`, { mentions: [targetUser] });
        if (command === 'simp') return reply(`😍 @${targetName} is ${Math.floor(Math.random()*101)}% simp!`, { mentions: [targetUser] });
        if (command === 'crush') return reply(`💘 Your crush is thinking about you! 😍`);
        if (command === 'kiss') return reply(`😘 @${targetName} got a kiss! 💋`, { mentions: [targetUser] });
        if (command === 'hug') return reply(`🤗 @${targetName} got a hug!`, { mentions: [targetUser] });
        if (command === 'slap') return reply(`👋 @${targetName} got slapped! 😂`, { mentions: [targetUser] });
        if (command === 'kill') return reply(`🔫 @${targetName} was killed! RIP 😂`, { mentions: [targetUser] });
        if (command === 'goodmorning' || command === 'gm') return reply('☀️ Good Morning! 🙏');
        if (command === 'goodnight' || command === 'gn') return reply('🌙 Good Night! 😴');
        if (command === 'happybirthday' || command === 'hbd') return reply(`🎂🎉 HAPPY BIRTHDAY @${targetName}! 🥳🎁`, { mentions: [targetUser] });
        if (command === 'congrats') return reply(`🎉 CONGRATS @${targetName}! 🏆`, { mentions: [targetUser] });
        if (command === 'rps') { const u = text.toLowerCase(); const b = pick(['rock','paper','scissors']); if (!['rock','paper','scissors'].includes(u)) return reply('Use: .rps rock/paper/scissors'); let res = u===b?'DRAW! 🤝':(u==='rock'&&b==='scissors')||(u==='paper'&&b==='rock')||(u==='scissors'&&b==='paper')?'YOU WIN! 🎉':'YOU LOSE! 😂'; return reply(`✊✋✌️ *RPS*\nYou: ${u}\nBULL X: ${b}\nResult: ${res}`); }
        if (command === 'slot') { const e = ['🍒','🍋','🔔','⭐','💎','🐂']; const a = pick(e), b = pick(e), c = pick(e); return reply(`🎰 *SLOT*\n| ${a} | ${b} | ${c} |\n${a===b&&b===c?'JACKPOT! 🎉':'Try again! 😅'}`); }
        if (command === 'lottery') return reply(`🎟️ *LOTTERY*\nLucky: ${Math.floor(Math.random()*99)+1} - ${Math.floor(Math.random()*99)+1} - ${Math.floor(Math.random()*99)+1}`);
        if (command === 'guess') { const n = Math.floor(Math.random()*10)+1; const g = parseInt(text); if (!g) return reply('Guess 1-10: .guess 5'); return reply(g===n?`🎉 CORRECT! It was ${n}!`:`❌ Wrong! It was ${n}!`); }
        if (command === 'calc') { try { if (!text) return reply('Use: .calc 2+2'); const r = eval(text.replace(/[^0-9+\-*/(). ]/g,'')); return reply(`🧮 ${text} = ${r}`); } catch { return reply('Invalid math!'); } }
        if (command === 'qr') { if (!text) return reply('Use: .qr Hello'); return reply(`🔲 QR for: ${text}\nhttps://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`); }
        if (command === 'password' || command === 'pass') { const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$'; let p=''; for(let i=0;i<12;i++) p+=chars[Math.floor(Math.random()*chars.length)]; return reply(`🔐 *PASSWORD*\n\n${p}`); }
        if (command === 'weather') { if (!text) return reply('Use: .weather Nairobi'); try { const r = await fetch(`https://wttr.in/${encodeURIComponent(text)}?format=3`); const t = await r.text(); return reply(`🌤️ *WEATHER - ${text}*\n${t}`); } catch { return reply('Weather failed'); } }
        if (command === 'define') { if (!text) return reply('Use: .define love'); try { const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`); const d = await r.json(); const def = d[0]?.meanings?.[0]?.definitions?.[0]?.definition || 'Not found'; return reply(`📖 *DEFINE: ${text}*\n\n${def}`); } catch { return reply('Define failed'); } }
        if (command === 'reverse') return reply(`🔄 Reversed: ${text.split('').reverse().join('')}`);
        if (command === 'shout') return reply(`📢 ${text.toUpperCase()}!!!`);
        if (command === 'age') { const y = parseInt(text); if (!y) return reply('Use: .age 2005'); return reply(`🎂 Born in ${y} = ${2026-y} years old!`); }
        if (command === 'kenya') return reply('🇰🇪 *KENYA*\nCapital: Nairobi\nFamous: Safaris, Runners, Ugali! 🐘🦁');
        if (command === 'nairobi') return reply('🏙️ *NAIROBI*\nCapital of Kenya! Green City in the Sun ☀️🌳');
        if (command === 'kisii') return reply('🏔️ *KISII*\nLand of soapstone, bananas & hardworking people! 🍌💪');
        if (command === 'antilink') { if (!await onlyOwner()) return; if (!isGroup) return reply('Groups only!'); if (text==='on') { settings.antilink[from]=true; saveSettings(); return reply('✅ Anti-Link ON'); } if (text==='off') { delete settings.antilink[from]; saveSettings(); return reply('❌ Anti-Link OFF'); } return reply('Use: .antilink on/off'); }
        if (command === 'antidelete') {
            if (!await onlyOwner()) return;
            if (text === 'all' || text === 'global' || text === 'on all') { settings.antidelete['GLOBAL'] = true; saveSettings(); return reply('✅ *ANTI-DELETE GLOBAL ON!* 🌍🐂\n\nNow works in:\n✅ ALL Groups\n✅ ALL DMs / Private Chats\n✅ Everywhere!\n\nAnyone deletes -> Bot resends!'); }
            if (text === 'off all' || text === 'global off') { delete settings.antidelete['GLOBAL']; saveSettings(); return reply('❌ Anti-Delete GLOBAL OFF'); }
            if (text === 'on') { settings.antidelete[from] = true; saveSettings(); return reply(`✅ *Anti-Delete ON!* 🐂\n\nChat: ${isGroup ? 'This Group' : 'This DM'}\n\nIf anyone deletes a message here, I will resend it!`); }
            if (text === 'off') { delete settings.antidelete[from]; saveSettings(); return reply('❌ Anti-Delete OFF for this chat'); }
            if (text === 'status' || text === 'check') { const isGlobal = !!settings.antidelete['GLOBAL']; const isHere = !!settings.antidelete[from]; return reply(`🚨 *ANTI-DELETE STATUS*\n\n🌍 Global: ${isGlobal ? '✅ ON' : '❌ OFF'}\n💬 This Chat: ${isHere ? '✅ ON' : '❌ OFF'}\n\nUse:\n.antidelete on = This chat only\n.antidelete all = EVERYWHERE!\n.antidelete off = Turn off here`); }
            return reply('Use:\n.antidelete on = This chat\n.antidelete all = ALL DMs + Groups!\n.antidelete off = Turn off\n.antidelete status = Check');
        }
        if (command === 'tagall') { if (!isGroup) return reply('Groups only!'); try { const m = await sock.groupMetadata(from); const parts = m.participants.map(p=>p.id); let t='🐂 *TAGALL*\n\n'; for(let p of parts) t+='@'+p.split('@')[0]+' '; return sock.sendMessage(from, { text: t, mentions: parts }, { quoted: msg }); } catch { return reply('Failed'); } }
        if (command === 'groupinfo') { if (!isGroup) return reply('Groups only!'); try { const m = await sock.groupMetadata(from); return reply(`👥 *GROUP INFO*\nName: ${m.subject}\nMembers: ${m.participants.length}`); } catch { return reply('Failed'); } }
        if (command === 'admins') { if (!isGroup) return reply('Groups only!'); try { const m = await sock.groupMetadata(from); const admins = m.participants.filter(p=>p.admin); let t='👑 *ADMINS*\n\n'; for(let a of admins) t+='@'+a.id.split('@')[0]+'\n'; return sock.sendMessage(from, { text: t, mentions: admins.map(a=>a.id) }, { quoted: msg }); } catch { return reply('Failed'); } }
        if (command === 'members') { if (!isGroup) return reply('Groups only!'); try { const m = await sock.groupMetadata(from); return reply(`👥 Members: ${m.participants.length}`); } catch { return reply('Failed'); } }
        if (command === 'invite') { if (!isGroup) return reply('Groups only!'); try { const code = await sock.groupInviteCode(from); return reply(`🔗 *GROUP LINK*\nhttps://chat.whatsapp.com/${code}`); } catch { return reply('Failed - bot must be admin'); } }
        if (command === 'kick' || command === 'promote' || command === 'demote') { const info = await checkAdmin(); if (!info) return; const t = await getTarget(info); if (!t) return; try { if (command==='kick') { await sock.groupParticipantsUpdate(from, [t.realTarget], 'remove'); return sock.sendMessage(from, { text: `👢 @${t.tc} kicked!`, mentions: [t.realTarget] }, { quoted: msg }); } if (command==='promote') { await sock.groupParticipantsUpdate(from, [t.realTarget], 'promote'); return sock.sendMessage(from, { text: `👑 @${t.tc} promoted!`, mentions: [t.realTarget] }, { quoted: msg }); } if (command==='demote') { await sock.groupParticipantsUpdate(from, [t.realTarget], 'demote'); return sock.sendMessage(from, { text: `⬇️ @${t.tc} demoted!`, mentions: [t.realTarget] }, { quoted: msg }); } } catch(e) { return reply('Failed: '+e.message); } }
        if (command === 'tiktok') { const linkMatch = body.match(/https?:\/\/\S+/); const tiktokUrl = linkMatch?linkMatch[0]:text; if (!tiktokUrl||!tiktokUrl.includes('tiktok')) return reply('Use: .tiktok https://vt.tiktok.com/xxx/'); try { await reply('⏳ Downloading TikTok...'); let videoUrl=null; let title='TikTok'; let finalUrl=tiktokUrl; try { const r=await fetch(tiktokUrl,{redirect:'follow'}); finalUrl=r.url||tiktokUrl; } catch {} try { const res=await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(finalUrl)}`); const d=await res.json(); if(d.data?.play){videoUrl=d.data.play; title=d.data.title||title;} } catch {} if(!videoUrl) return reply('❌ Try different video'); return sock.sendMessage(from, { video: { url: videoUrl }, caption: `🐂 *BULL X TikTok*\n${title}` }, { quoted: msg }); } catch { return reply('TikTok failed'); } }
        if (command === 'igdl' || command === 'fbdl') { const link = body.match(/https?:\/\/\S+/)?.[0] || text; if (!link) return reply(`Use: .${command} <link>`); try { await reply('⏳ Downloading...'); return reply(`🔗 Link received: ${link}\nUse .ai to get help downloading it!`); } catch { return reply('Download failed'); } }
        if (command === 'play' || command === 'song') {
            if (!text) return reply('Use: .play Diamond Platnumz Komasava\n.play Harmonize Single Again\n.play Ayra Starr Rush');
            try {
                await reply('🎵 *Searching:* ' + text + '\n\n⏳ Please wait 10-20 sec...');
                let videoId = null; let title = text; let thumb = null;
                const searchApis = [
                    `https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(text)}`,
                    `https://api.dreaded.site/api/ytsearch?query=${encodeURIComponent(text)}`,
                    `https://api.zenzxz.my.id/api/search/youtube?query=${encodeURIComponent(text)}`
                ];
                for (let url of searchApis) {
                    try {
                        const r = await fetch(url); const d = await r.json();
                        const v = d.data?.[0] || d.result?.[0] || d.results?.[0] || d[0];
                        if (v) { videoId = v.videoId || v.id || v.url?.split('v=')[1]?.split('&')[0]; title = v.title || title; thumb = v.thumbnail || v.image; if (videoId) break; }
                    } catch {}
                }
                if (!videoId) return reply(`❌ *Not found via API!*\n\nTry this:\n🔗 https://www.youtube.com/results?search_query=${encodeURIComponent(text)}\n\nOr try different spelling:\n.play ${text} official audio`);
                const videoUrl = `https://youtube.com/watch?v=${videoId}`;
                await reply(`✅ *Found!*\n\n🎵 ${title}\n🔗 ${videoUrl}\n\n⏳ Downloading audio...`);
                let audioUrl = null;
                const dlApis = [
                    `https://api.dreaded.site/api/ytdl?url=${encodeURIComponent(videoUrl)}&format=mp3`,
                    `https://api.dreaded.site/api/ytdl-v2?url=${encodeURIComponent(videoUrl)}`,
                    `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}`,
                    `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(videoUrl)}`,
                    `https://api.zenzxz.my.id/api/downloader/ytmp3?url=${encodeURIComponent(videoUrl)}`,
                    `https://api.yanzbotz.my.id/api/downloader/ytmp3?url=${encodeURIComponent(videoUrl)}`
                ];
                for (let u of dlApis) {
                    try {
                        const r = await fetch(u, { signal: AbortSignal.timeout(20000) });
                        const d = await r.json();
                        audioUrl = d.result?.download || d.result?.url || d.download || d.url || d.data?.dl || d.data?.url || d.result?.audio || d.audio;
                        if (audioUrl && audioUrl.startsWith('http')) { console.log('Play success via:', u); break; } else audioUrl = null;
                    } catch (e) { console.log('Play API failed:', u); continue; }
                }
                if (!audioUrl) return reply(`❌ *Music servers are busy!*\n\n🎵 ${title}\n🔗 ${videoUrl}\n\nTry again in 2 mins or try:\n.play ${text} lyrics\n\nTip: Use .lyrics ${text} to see lyrics!`);
                try {
                    await sock.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mp4', fileName: title + '.mp3' }, { quoted: msg });
                    return reply(`🎵 *Now Playing!* 🐂\n\n🎤 ${title}\n🔗 ${videoUrl}`);
                } catch (e) {
                    return reply(`✅ *Found but audio too big!*\n\n🎵 ${title}\n🔗 Listen here:\n${videoUrl}\n\nDirect MP3:\n${audioUrl}`);
                }
            } catch (e) { console.log('Play error:', e.message); return reply('❌ Play failed! Try again with exact song name:\n.play Komasava Diamond'); }
        }
        if (command === 'ai' || command === 'ask' || command === 'gpt') { if (!text) return reply('Ask me: .ai Who is best footballer?'); try { await reply('🤖 Thinking...'); let answer=null; try { const r=await fetch(`https://api.nekolabs.my.id/ai/chatgpt?text=${encodeURIComponent(text)}`); const d=await r.json(); answer=d.result||d.response; } catch {} if(!answer){ try{ const r=await fetch(`https://api.siputzx.my.id/api/ai/gpt-3?prompt=${encodeURIComponent(text)}`); const d=await r.json(); answer=d.data||d.result; } catch{} } if(!answer){ try{ const r=await fetch(`https://api.dreaded.site/api/chatgpt?query=${encodeURIComponent(text)}`); const d=await r.json(); answer=d.result||d.response||d.answer; } catch{} } if(!answer){ try{ const r=await fetch(`https://text.pollinations.ai/${encodeURIComponent(text)}`); const t=await r.text(); if(!t.includes('Free limit')&&t.length>5) answer=t; } catch{} } if(!answer) return reply('AI busy, try again!'); return reply(`🐂 *BULL X AI*\n\n${answer}`); } catch { return reply('AI busy'); } }
        if (command === 'story') return reply(`📖 *STORY*\n\nOnce upon a time in Kisii... ${text||'A young hustler'} woke up and decided today is the day! He worked hard, prayed, and became a legend! The end! 🐂🔥`);
        if (command === 'poem') return reply(`📝 *POEM FOR ${text||'YOU'}*\n\nRoses are red,\nViolets are blue,\nBULL X is here,\nAnd so are you! ❤️🐂`);
    });
}
startBot();