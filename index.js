const express = require('express');
const app = express();
let lastQR = null;
app.get('/', (req, res) => { res.send(`<h1>🐂 BULL X IS ONLINE!</h1><p>Bot is running!</p><a href="/qr">👉 SEE QR</a>`); });
app.get('/qr', (req, res) => {
  if (!lastQR) return res.send(`<h1>🐂 BULL X QR</h1><h2>No QR right now</h2><p>Bot already linked</p><a href="/qr">Refresh</a><script>setTimeout(()=>location.reload(),15000);</script>`);
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
let antilinkGroups = {};
try { antilinkGroups = JSON.parse(fs.readFileSync('antilink.json','utf8')); } catch {}
const saveAntilink = () => fs.writeFileSync('antilink.json', JSON.stringify(antilinkGroups));
let antideleteGroups = {};
try { antideleteGroups = JSON.parse(fs.readFileSync('antidelete.json','utf8')); } catch {}
const saveAntidelete = () => fs.writeFileSync('antidelete.json', JSON.stringify(antideleteGroups));
let msgCache = new Map();
const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];
const JOKES = ["Why did the chicken cross the road? To get to the other side! 😂","Why did Kenyan men marry? Because they couldn't cook ugali! 😂","What do you call a fish without eyes? A fsh! 🐟","Why is 6 afraid of 7? Because 7 ate 9! 😂","Teacher: Why are you late? Student: Because of the sign! Teacher: What sign? Student: School ahead, go slow! 😂","My phone fell in water, now it says 'No SIMpathy' 😂","Why did the scarecrow win an award? He was outstanding in his field! 🌾","What did one wall say to the other? I'll meet you at the corner! 😂","Why don't skeletons fight? They don't have the guts! 💀","How does a penguin build its house? Igloos it together! 🐧","Why did the math book look sad? It had too many problems! 📚","What do you call cheese that isn't yours? Nacho cheese! 🧀","Why did Arsenal fans bring a ladder? To see the top of the table! ⚽😂","My girlfriend said I should be more in touch with my feelings... so I bought a car with leather seats! 😂","Why did the coffee file a police report? It got mugged! ☕","Kenyan matatu conductor: 'Beba beba! Hakuna traffic!' - 2 hours later still in traffic 😂"];
const FACTS = ["Honey never spoils. Archaeologists found 3000-year-old honey still edible! 🍯","Bananas are berries, but strawberries are NOT! 🍌","Kenya is the only country in the world crossed by both the Equator AND the Great Rift Valley! 🇰🇪","A group of flamingos is called a flamboyance! 🦩","Octopuses have 3 hearts! 🐙","The Great Wall of China is held together by sticky rice! 🧱","Sharks existed before trees! 🦈🌳","Your brain uses 20% of your body's energy! 🧠","Mt. Kenya is the 2nd highest mountain in Africa! ⛰️","Cows have best friends and get stressed when separated! 🐄❤️","There are more possible chess games than atoms in the universe! ♟️","The first 1GB hard drive cost $40,000 in 1956! 💾","Hot water freezes faster than cold water - Mpemba effect! 🧊","A day on Venus is longer than a year on Venus! 🪐","Kenya produces the best long-distance runners in the world! 🏃‍♂️🇰🇪"];
const QUOTES = ["'The best time to plant a tree was 20 years ago. The second best time is now.' - Proverb 🌳","'Success is not final, failure is not fatal: It is the courage to continue that counts.' - Churchill 💪","'Don't watch the clock; do what it does. Keep going.' - Sam Levenson ⏰","'Hustle beats talent when talent doesn't hustle!' 🔥","'If you want to go fast, go alone. If you want to go far, go together.' - African Proverb 🤝","'Education is the most powerful weapon you can use to change the world.' - Mandela 📚","'Winners are not people who never fail, but people who never quit!' 🏆","'Your only limit is your mind!' 🧠","'Hard work beats talent!' 💪","'Small small, one day you will make it!' - Kenyan Hustle 🇰🇪"];
const ROASTS = ["Your face looks like WiFi - everyone can see it but no one wants to connect! 😂","You're so slow, even a sloth said 'hurry up!' 🦥","You are the reason the gene pool needs a lifeguard! 😂","Your brain is like a browser with 100 tabs open and music playing somewhere! 🧠😂","You're not ugly, you're just... uniquely challenged! 😂","If laughter is medicine, your face is the cure for overpopulation! 😂","You're so broke, your ATM said 'insufficient funds' and laughed! 💸😂","You have the personality of a wet sock! 🧦😂"];
const TRUTHS = ["What is your biggest secret? 🤫","Who is your crush in this group? 😍","What is the most embarrassing thing you have ever done? 😳","Have you ever cheated in an exam? 📚","What is the last lie you told? 🤥","Who do you hate most in this group? 👀","Have you ever stalked your ex? 👀","What is your biggest fear? 😨"];
const DARES = ["Send a voice note singing your favourite song! 🎤","Change your profile pic to a funny face for 1 hour! 😂","Text your crush 'I miss you' right now! 😍","Do 10 pushups and send a video! 💪","Speak in English only for the next 10 minutes! 🇬🇧","Send your last photo in your gallery! 📸","Call the last person you texted and say 'I love you'! 📞","Dance for 30 seconds and send video! 💃"];
const RIDDLES = [{q:"I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",a:"Echo!"},{q:"The more of me you take, the more you leave behind. What am I?",a:"Footsteps!"},{q:"What has keys but can't open a single lock?",a:"Piano! 🎹"},{q:"What has a face and two hands but no arms or legs?",a:"Clock! ⏰"},{q:"What gets wetter the more it dries?",a:"Towel!"},{q:"I'm tall when I'm young, and short when I'm old. What am I?",a:"Candle! 🕯️"},{q:"What has a neck but no head?",a:"Bottle! 🍾"}];
const BIBLE = ["John 3:16 - For God so loved the world... ❤️","Philippians 4:13 - I can do all things through Christ who strengthens me! 💪","Jeremiah 29:11 - For I know the plans I have for you, plans to prosper you... 🙏","Psalm 23:1 - The Lord is my shepherd, I shall not want! 🐑","Proverbs 3:5 - Trust in the Lord with all your heart... ❤️","Romans 8:28 - All things work together for good... ✨","Isaiah 41:10 - Fear not, for I am with you... 🙌"];
const MOTIVATION = ["Wake up! Your dreams won't chase themselves! 🔥","No one is coming to save you. Save yourself! 💪","Today's pain is tomorrow's power! ⚡","Stop scrolling, start hustling! 📱➡️💰","You are one decision away from a different life! 🚀","If it was easy, everyone would do it! 🏆","Your future self is watching you right now! 👀"];
const FOOTBALL = ["⚽ Did you know? Messi has 8 Ballon d'Ors! 🐐","⚽ Ronaldo has scored 900+ career goals! 🔥","⚽ Gor Mahia is the most successful club in Kenya! 🇰🇪","⚽ Arsenal's Invincibles went 49 games unbeaten! 🏆","⚽ The World Cup is watched by 3.5 BILLION people! 🌍","⚽ Harambee Stars! 🇰🇪⭐"];

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const sock = makeWASocket({ logger: pino({ level: 'silent' }), printQRInTerminal: false, auth: state, browser: ['BULL X', 'Chrome', '1.0'] });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) { lastQR = qr; console.log('NEW QR READY'); qrcode.generate(qr, { small: true }); }
        if (connection === 'close') { const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut; if (shouldReconnect) startBot(); }
        else if (connection === 'open') { console.log('BULL X IS ONLINE!'); lastQR = null; }
    });
    sock.ev.on('messages.update', async (updates) => {
        for (const update of updates) {
            try {
                if (!update.update || !update.update.isDeleted) continue;
                const deletedId = update.key.id; const deletedFrom = update.key.remoteJid; const deleter = update.key.participant || update.key.remoteJid;
                const cached = msgCache.get(deletedId); if (!cached) continue; if (!antideleteGroups[deletedFrom]) continue;
                const deleterNum = deleter.split('@')[0].split(':')[0]; const originalSender = cached.sender.split('@')[0].split(':')[0]; const origMsg = cached.msg;
                const origBody = origMsg.message.conversation || origMsg.message.extendedTextMessage?.text || '';
                if (origBody) await sock.sendMessage(deletedFrom, { text: `🚨 *ANTI-DELETE CAUGHT!* 🐂\n\n@${deleterNum} deleted from @${originalSender}:\n${origBody}`, mentions: [deleter, cached.sender] });
            } catch {}
        }
    });
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]; if (!msg.message) return;
        const from = msg.key.remoteJid; const isGroup = from.endsWith('@g.us'); const sender = msg.key.participant || msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || '';
        const reply = async (text, opts) => { await sock.sendMessage(from, { text }, { quoted: msg, ...opts }); };
        const isImage = !!msg.message.imageMessage; const isBot = msg.key.fromMe;
        if (msg.key.id) { msgCache.set(msg.key.id, { msg, sender, from }); if (msgCache.size > 200) msgCache.delete(msgCache.keys().next().value); }
        // AUTO VIEW ONCE
        let voMsg = msg.message.viewOnceMessageV2?.message || msg.message.viewOnceMessage?.message || msg.message.ephemeralMessage?.message?.viewOnceMessageV2?.message;
        if (voMsg && (voMsg.imageMessage || voMsg.videoMessage)) {
            try {
                if (voMsg.imageMessage) { const s = await downloadContentFromMessage(voMsg.imageMessage, 'image'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(from, { image: b, caption: '👀 *VIEW ONCE AUTO-OPENED* 🐂 From: @'+sender.split('@')[0], mentions: [sender] }); }
                else { const s = await downloadContentFromMessage(voMsg.videoMessage, 'video'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(from, { video: b, caption: '👀 *VIEW ONCE AUTO-OPENED* 🐂', mentions: [sender] }); }
            } catch {} return;
        }
        if (isGroup && antilinkGroups[from] && !isBot) {
            const hasLink = /(https?:\/\/|www\.|chat\.whatsapp\.com|t\.me\/|instagram\.com|youtube\.com|tiktok\.com)/i.test(body);
            if (hasLink) { try { await sock.sendMessage(from, { delete: msg.key }); await sock.sendMessage(from, { text: `⚠️ @${sender.split('@')[0]} Links NOT allowed! Deleted by BULL X 🐂`, mentions: [sender] }); } catch {} return; }
        }
        if (body.trim() === '.vv') {
            try {
                const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage; if (!quoted) return reply('Reply to View Once with .vv');
                let inner = quoted.viewOnceMessageV2?.message || quoted.viewOnceMessage?.message || quoted;
                let imgMsg = inner.imageMessage; let vidMsg = inner.videoMessage;
                if (imgMsg) { const s = await downloadContentFromMessage(imgMsg, 'image'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(from, { image: b, caption: '👀 *VIEW ONCE OPENED* 🐂' }, { quoted: msg }); return; }
                if (vidMsg) { const s = await downloadContentFromMessage(vidMsg, 'video'); let b = Buffer.from([]); for await (const c of s) b = Buffer.concat([b, c]); await sock.sendMessage(from, { video: b, caption: '👀 *VIEW ONCE OPENED* 🐂' }, { quoted: msg }); return; }
                return reply('Not a View Once! That was a normal photo.');
            } catch { await reply('Failed - View Once expired!'); return; }
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
        if (!body.startsWith('.')) {
            const low = body.toLowerCase().trim();
            if (['hi','hello','hey','hii','sasa','niaje','mambo','poa'].includes(low)) await reply('Hey! 🐂 BULL X here! Type *.menu*');
            if (low === 'bull' || low === 'bull x') await reply('BULL X MODE ACTIVATED! 🐂🔥');
            if (low.includes('i love you')) await reply('Aww I love you too! ❤️🐂');
            if (low.includes('good morning')) await reply('Good morning! ☀️ Have a blessed day! Type .menu');
            if (low.includes('good night')) await reply('Good night! 😴 Sweet dreams!');
            return;
        }
        const args = body.slice(1).trim().split(/ +/); const command = args[0].toLowerCase(); const text = args.slice(1).join(' ');
        const targetUser = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msg.message.extendedTextMessage?.contextInfo?.participant || sender;
        const targetName = targetUser.split('@')[0].split(':')[0];

        // ===== 1. GENERAL =====
        if (command === 'ping') return reply('Pong! ⚡ BULL X is alive! Speed: Fast');
        if (command === 'menu' || command === 'help') return reply('🐂 *BULL X MENU V9 - 120+ COMMANDS*\n\n*GENERAL:* .ping .menu .owner .alive .info .time .date .uptime .checkadmin .rules\n*FUN:* .joke .fact .quote .meme .roast @user .8ball .dice .coin .truth .dare .riddle .love @user .ship @a @b .compliment @user .insult @user .howgay @user .howcool @user\n*GAMES:* .rps rock .slot .lottery .guess\n*GROUP:* .tagall .groupinfo .antilink .antidelete .kick .promote .demote .mute .unmute .invite .admins .members\n*TOOLS:* .calc 2+2 .qr hello .password .translate .weather Nairobi .time .bible .motivate .football .news .define word\n*DOWNLOADER:* .tiktok .play .song .video .ig\n*AI:* .ai .ask .gpt .imagine\n*STICKER:* .sticker .s\n*SECRET:* .vv\n\nType any command! Example: .joke');
        if (command === 'owner') return reply('👑 *OWNER*\nName: BULL X Owner\nNumber: +254112843071\nBot: BULL X V9');
        if (command === 'info') return reply('🐂 *BULL X V9*\nVersion: V9\nCommands: 120+\nOwner: +254112843071\nStatus: Online ✅');
        if (command === 'time') return reply('🕒 ' + new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }));
        if (command === 'date') return reply('📅 ' + new Date().toLocaleDateString('en-KE', { timeZone: 'Africa/Nairobi', weekday:'long', year:'numeric', month:'long', day:'numeric' }));
        if (command === 'uptime') return reply('🐂 BULL X has been online since last restart! Uptime: Active ✅');
        if (command === 'rules') return reply('📜 *GROUP RULES*\n1. No links\n2. No insults\n3. Respect admins\n4. No spam\n5. Have fun! 🐂');
        if (command === 'bull') return reply('🐂🔥 BULL X MODE ACTIVATED! 🔥🐂');
        if (command === 'alive') return reply('🐂 *BULL X IS ALIVE!* 🔥\n✅ Online\n✅ Working\n✅ 120+ Commands\nType *.menu*');
        if (command === 'checkadmin') { try { const m = await sock.groupMetadata(from); const clean = (id) => (id||'').split(':')[0].split('@')[0]; return reply(`🔍 Bot PN: ${clean(sock.user.id)}\nBot LID: ${clean(sock.user.lid||'none')}\nMembers: ${m.participants.length}`); } catch { return reply('Check failed'); } }

        // ===== 2. FUN =====
        if (command === 'joke') return reply('😂 *JOKE*\n\n' + pick(JOKES));
        if (command === 'fact') return reply('🧠 *DID YOU KNOW?*\n\n' + pick(FACTS));
        if (command === 'quote') return reply('💬 *QUOTE*\n\n' + pick(QUOTES));
        if (command === 'meme') return reply('😂 *MEME*\n\n' + pick(JOKES) + '\n\nSend .meme again for another!');
        if (command === 'motivate' || command === 'motivation') return reply('🔥 *MOTIVATION*\n\n' + pick(MOTIVATION));
        if (command === 'bible' || command === 'verse') return reply('📖 *BIBLE VERSE*\n\n' + pick(BIBLE));
        if (command === 'football' || command === 'soccer') return reply(pick(FOOTBALL));
        if (command === 'roast') return reply(`🔥 *ROAST FOR @${targetName}*\n\n${pick(ROASTS)}`, { mentions: [targetUser] });
        if (command === 'insult') return reply(`😂 @${targetName} ${pick(ROASTS)}`, { mentions: [targetUser] });
        if (command === 'compliment') return reply(`❤️ @${targetName} You are amazing, smart, beautiful and one of a kind! ✨`, { mentions: [targetUser] });
        if (command === '8ball' || command === 'ask8') { const ans = pick(['Yes! ✅','No! ❌','Maybe... 🤔','Definitely! 💯','Ask again later...','Without a doubt!','My sources say NO!','Signs point to YES!']); return reply(`🎱 *MAGIC 8-BALL*\n\nQ: ${text||'Will I be rich?'}\nA: ${ans}`); }
        if (command === 'dice') return reply(`🎲 You rolled: ${Math.floor(Math.random()*6)+1} !`);
        if (command === 'coin' || command === 'flip') return reply(`🪙 Coin: ${pick(['HEADS! 👑','TAILS! 🪙'])}`);
        if (command === 'truth') return reply('🤫 *TRUTH*\n\n' + pick(TRUTHS));
        if (command === 'dare') return reply('😈 *DARE*\n\n' + pick(DARES));
        if (command === 'riddle') { const r = pick(RIDDLES); return reply(`🧩 *RIDDLE*\n\n${r.q}\n\nReply .riddleanswer to see answer! (Answer: ${r.a})`); }
        if (command === 'love') { const p = Math.floor(Math.random()*101); return reply(`❤️ *LOVE METER*\n\n@${targetName} ❤️ You\nLove: ${p}%\n${p>80?'TRUE LOVE! 💍':p>50?'Good match! 😍':'Just friends... 😅'}`, { mentions: [targetUser] }); }
        if (command === 'ship') return reply(`💘 *SHIP*\n\n${text||'You + Me'} = ${Math.floor(Math.random()*101)}% match! 💑`);
        if (command === 'howgay') return reply(`🏳️‍🌈 @${targetName} is ${Math.floor(Math.random()*101)}% gay! 😂`, { mentions: [targetUser] });
        if (command === 'howcool') return reply(`😎 @${targetName} is ${Math.floor(Math.random()*101)}% cool! 🔥`, { mentions: [targetUser] });
        if (command === 'howrich') return reply(`💰 @${targetName} will be ${pick(['Millionaire! 💰','Billionaire! 🤑','Broke! 😂','Rich in love! ❤️'])}`, { mentions: [targetUser] });
        if (command === 'howold') return reply(`🎂 @${targetName} looks ${Math.floor(Math.random()*40)+15} years old!`, { mentions: [targetUser] });
        if (command === 'smart') return reply(`🧠 @${targetName} IQ is ${Math.floor(Math.random()*100)+50}!`, { mentions: [targetUser] });
        if (command === 'beautiful' || command === 'handsome') return reply(`😍 @${targetName} is ${Math.floor(Math.random()*101)}% beautiful!`, { mentions: [targetUser] });
        if (command === 'simp') return reply(`😍 @${targetName} is ${Math.floor(Math.random()*101)}% simp!`, { mentions: [targetUser] });
        if (command === 'crush') return reply(`💘 Your crush is thinking about you right now! 😍`);
        if (command === 'kiss') return reply(`😘 @${targetName} got a kiss from BULL X! 💋`, { mentions: [targetUser] });
        if (command === 'hug') return reply(`🤗 @${targetName} got a big hug!`, { mentions: [targetUser] });
        if (command === 'slap') return reply(`👋 @${targetName} got slapped by BULL X! 😂`, { mentions: [targetUser] });
        if (command === 'kill') return reply(`🔫 @${targetName} was killed by BULL X! RIP 😂`, { mentions: [targetUser] });
        if (command === 'goodmorning' || command === 'gm') return reply('☀️ Good Morning! Have a blessed day! 🙏');
        if (command === 'goodnight' || command === 'gn') return reply('🌙 Good Night! Sweet dreams! 😴');
        if (command === 'happybirthday' || command === 'hbd') return reply(`🎂🎉 HAPPY BIRTHDAY @${targetName}! 🥳🎁 May God bless you!`, { mentions: [targetUser] });
        if (command === 'congrats') return reply(`🎉 CONGRATS @${targetName}! You did it! 🏆`, { mentions: [targetUser] });

        // ===== 3. GAMES =====
        if (command === 'rps') { const u = text.toLowerCase(); const b = pick(['rock','paper','scissors']); if (!['rock','paper','scissors'].includes(u)) return reply('Use: .rps rock / paper / scissors'); let res = u===b?'DRAW! 🤝':(u==='rock'&&b==='scissors')||(u==='paper'&&b==='rock')||(u==='scissors'&&b==='paper')?'YOU WIN! 🎉':'YOU LOSE! 😂'; return reply(`✊✋✌️ *ROCK PAPER SCISSORS*\nYou: ${u}\nBULL X: ${b}\nResult: ${res}`); }
        if (command === 'slot') { const e = ['🍒','🍋','🔔','⭐','💎','🐂']; const a = pick(e), b = pick(e), c = pick(e); return reply(`🎰 *SLOT MACHINE*\n\n| ${a} | ${b} | ${c} |\n\n${a===b&&b===c?'JACKPOT! 🎉💰':'Try again! 😅'}`); }
        if (command === 'lottery') return reply(`🎟️ *LOTTERY*\nYour lucky numbers: ${Math.floor(Math.random()*99)+1} - ${Math.floor(Math.random()*99)+1} - ${Math.floor(Math.random()*99)+1} - ${Math.floor(Math.random()*99)+1}`);
        if (command === 'guess') { const n = Math.floor(Math.random()*10)+1; const g = parseInt(text); if (!g) return reply('Guess a number 1-10: .guess 5'); return reply(g===n?`🎉 CORRECT! It was ${n}!`:`❌ Wrong! It was ${n}! Try again!`); }
        if (command === 'toss') return reply(pick(['Heads!','Tails!']));

        // ===== 4. TOOLS =====
        if (command === 'calc' || command === 'calculator') { try { if (!text) return reply('Use: .calc 2+2'); const r = eval(text.replace(/[^0-9+\-*/(). ]/g,'')); return reply(`🧮 *CALCULATOR*\n${text} = ${r}`); } catch { return reply('Invalid math! Try .calc 2+2'); } }
        if (command === 'qr') { if (!text) return reply('Use: .qr Hello'); return reply(`🔲 QR for: ${text}\nhttps://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`); }
        if (command === 'password' || command === 'pass') { const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$'; let p=''; for(let i=0;i<12;i++) p+=chars[Math.floor(Math.random()*chars.length)]; return reply(`🔐 *YOUR PASSWORD*\n\n${p}\n\nDon't share it!`); }
        if (command === 'translate') return reply(`🌍 *TRANSLATE*\n\n"${text}"\n\nUse .ai for translation: .ai Translate "${text}" to Swahili`);
        if (command === 'weather') { if (!text) return reply('Use: .weather Nairobi'); try { const r = await fetch(`https://wttr.in/${encodeURIComponent(text)}?format=3`); const t = await r.text(); return reply(`🌤️ *WEATHER - ${text}*\n${t}`); } catch { return reply('Weather failed, try again'); } }
        if (command === 'define' || command === 'meaning') { if (!text) return reply('Use: .define love'); try { const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`); const d = await r.json(); const def = d[0]?.meanings?.[0]?.definitions?.[0]?.definition || 'Not found'; return reply(`📖 *DEFINE: ${text}*\n\n${def}`); } catch { return reply('Define failed'); } }
        if (command === 'news') return reply('📰 *NEWS*\n\nUse .ai for news: .ai What is happening in Kenya today?');
        if (command === 'count' || command === 'counter') return reply(`🔢 Counting: ${text||'100'} characters: ${(text||'').length}`);
        if (command === 'reverse') return reply(`🔄 Reversed: ${text.split('').reverse().join('')}`);
        if (command === 'shout') return reply(`📢 ${text.toUpperCase()}!!!`);
        if (command === 'small') return reply(`🤫 ${text.toLowerCase()}`);
        if (command === 'emojify') return reply(`✨ ${text.split('').join('✨')} ✨`);
        if (command === 'repeat') return reply(text.repeat(3).slice(0,500));
        if (command === 'age') { const y = parseInt(text); if (!y) return reply('Use: .age 2005'); return reply(`🎂 If you were born in ${y}, you are ${2026-y} years old!`); }
        if (command === 'kenya') return reply('🇰🇪 *KENYA*\nCapital: Nairobi\nPopulation: ~55M\nLanguage: Swahili + English\nFamous: Safaris, Runners, Ugali! 🐘🦁');
        if (command === 'nairobi') return reply('🏙️ *NAIROBI*\nCapital of Kenya! Green City in the Sun ☀️🌳');
        if (command === 'kisii') return reply('🏔️ *KISII*\nLand of soapstone, bananas & hardworking people! 🍌💪');

        // ===== 5. GROUP =====
        if (command === 'antilink') { if (!isGroup) return reply('Groups only!'); if (text==='on') { antilinkGroups[from]=true; saveAntilink(); return reply('✅ Anti-Link ON'); } if (text==='off') { delete antilinkGroups[from]; saveAntilink(); return reply('❌ Anti-Link OFF'); } return reply('Use: .antilink on/off'); }
        if (command === 'antidelete') { if (!isGroup) return reply('Groups only!'); if (text==='on') { antideleteGroups[from]=true; saveAntidelete(); return reply('✅ Anti-Delete ON (Works best if BULL X has its own number!)'); } if (text==='off') { delete antideleteGroups[from]; saveAntidelete(); return reply('❌ Anti-Delete OFF'); } return reply('Use: .antidelete on/off'); }
        if (command === 'tagall') { if (!isGroup) return reply('Groups only!'); try { const m = await sock.groupMetadata(from); const parts = m.participants.map(p=>p.id); let t='🐂 *TAGALL*\n\n'; for(let p of parts) t+='@'+p.split('@')[0]+' '; return sock.sendMessage(from, { text: t, mentions: parts }, { quoted: msg }); } catch { return reply('Failed'); } }
        if (command === 'groupinfo') { if (!isGroup) return reply('Groups only!'); try { const m = await sock.groupMetadata(from); return reply(`👥 *GROUP INFO*\nName: ${m.subject}\nMembers: ${m.participants.length}\nID: ${m.id}`); } catch { return reply('Failed'); } }
        if (command === 'admins') { if (!isGroup) return reply('Groups only!'); try { const m = await sock.groupMetadata(from); const admins = m.participants.filter(p=>p.admin); let t='👑 *ADMINS*\n\n'; for(let a of admins) t+='@'+a.id.split('@')[0]+'\n'; return sock.sendMessage(from, { text: t, mentions: admins.map(a=>a.id) }, { quoted: msg }); } catch { return reply('Failed'); } }
        if (command === 'members') { if (!isGroup) return reply('Groups only!'); try { const m = await sock.groupMetadata(from); return reply(`👥 Members: ${m.participants.length}`); } catch { return reply('Failed'); } }
        if (command === 'invite') { if (!isGroup) return reply('Groups only!'); try { const code = await sock.groupInviteCode(from); return reply(`🔗 *GROUP LINK*\nhttps://chat.whatsapp.com/${code}`); } catch { return reply('Failed - bot must be admin'); } }
        if (command === 'mute') return reply('🔇 Group muted (Admins only - use WhatsApp settings)');
        if (command === 'unmute') return reply('🔊 Group unmuted (Admins only - use WhatsApp settings)');
        if (command === 'kick' || command === 'promote' || command === 'demote') {
            if (!isGroup) return reply('Groups only!');
            try {
                const metadata = await sock.groupMetadata(from); const participants = metadata.participants; const clean = (id) => (id||'').split(':')[0].split('@')[0];
                const myNum = clean(sock.user.id); const myLid = clean(sock.user.lid||''); const senderNum = clean(sender);
                const senderInfo = participants.find(p=>clean(p.id)===senderNum||clean(p.lid||'')===senderNum);
                const botInfo = participants.find(p=>clean(p.id)===myNum||clean(p.lid||'')===myNum||clean(p.id)===myLid||clean(p.lid||'')===myLid||clean(p.id)===senderNum);
                const isSenderAdmin = senderInfo?.admin==='admin'||senderInfo?.admin==='superadmin'; const isBotAdmin = botInfo?.admin==='admin'||botInfo?.admin==='superadmin'||isSenderAdmin;
                if (!isSenderAdmin) return reply('❌ You are not admin!'); if (!isBotAdmin) return reply('❌ BULL X not admin!');
                let target = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msg.message.extendedTextMessage?.contextInfo?.participant;
                if (!target && text) { const num = text.replace(/[^0-9]/g,''); if (num) target = num+'@s.whatsapp.net'; }
                if (!target) return reply(`Reply with .${command} OR tag`);
                let realTarget = target; const tc = clean(target); const found = participants.find(p=>clean(p.id)===tc||clean(p.lid||'')===tc); if (found) realTarget = found.id;
                if (command==='kick') { await sock.groupParticipantsUpdate(from, [realTarget], 'remove'); return sock.sendMessage(from, { text: `👢 @${tc} kicked!`, mentions: [realTarget] }, { quoted: msg }); }
                if (command==='promote') { await sock.groupParticipantsUpdate(from, [realTarget], 'promote'); return sock.sendMessage(from, { text: `👑 @${tc} promoted!`, mentions: [realTarget] }, { quoted: msg }); }
                if (command==='demote') { await sock.groupParticipantsUpdate(from, [realTarget], 'demote'); return sock.sendMessage(from, { text: `⬇️ @${tc} demoted!`, mentions: [realTarget] }, { quoted: msg }); }
            } catch(e) { return reply('Failed: '+e.message); }
        }

        // ===== 6. DOWNLOADER + MUSIC + AI =====
        if (command === 'tiktok') {
            const linkMatch = body.match(/https?:\/\/\S+/); const tiktokUrl = linkMatch?linkMatch[0]:text;
            if (!tiktokUrl||!tiktokUrl.includes('tiktok')) return reply('Use: .tiktok https://vt.tiktok.com/xxx/');
            try { await reply('⏳ Downloading TikTok...'); let videoUrl=null; let title='TikTok'; let finalUrl=tiktokUrl; try { const r=await fetch(tiktokUrl,{redirect:'follow'}); finalUrl=r.url||tiktokUrl; } catch {}
                try { const res=await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(finalUrl)}`); const d=await res.json(); if(d.data?.play){videoUrl=d.data.play; title=d.data.title||title;} } catch {}
                if(!videoUrl) return reply('❌ Try different video'); return sock.sendMessage(from, { video: { url: videoUrl }, caption: `🐂 *BULL X TikTok*\n${title}` }, { quoted: msg });
            } catch { return reply('TikTok failed'); }
        }
        if (command === 'play' || command === 'song') {
            if (!text) return reply('Use: .play Diamond Platnumz Komasava');
            try { await reply('🎵 Searching: '+text); let videoUrl=null; let title=text;
                try { const s=await fetch(`https://inv.nadeko.net/api/v1/search?q=${encodeURIComponent(text)}&type=video`); const sd=await s.json(); if(sd[0]?.videoId){videoUrl=`https://youtube.com/watch?v=${sd[0].videoId}`; title=sd[0].title||text;} } catch {}
                if(!videoUrl){ try{ const s=await fetch(`https://api.siputzx.my.id/api/s/youtube?query=${encodeURIComponent(text)}`); const sd=await s.json(); const v=sd.data?.[0]||sd.result?.[0]; if(v){videoUrl=v.url||`https://youtube.com/watch?v=${v.videoId}`; title=v.title||text;} } catch {} }
                if(!videoUrl) return reply('❌ Not found');
                await reply('✅ Found: '+title+'\n⏳ Downloading...');
                let audioUrl=null;
                const tries = [`https://api.zenzxz.my.id/api/downloader/ytmp3?url=${encodeURIComponent(videoUrl)}`,`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}`,`https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(videoUrl)}`,`https://api.dreaded.site/api/ytdl-v2?url=${encodeURIComponent(videoUrl)}`,`https://api.dreaded.site/api/ytdl?url=${encodeURIComponent(videoUrl)}&format=mp3`,`https://api.yanzbotz.my.id/api/downloader/ytmp3?url=${encodeURIComponent(videoUrl)}`];
                for(let u of tries){ try{ const r=await fetch(u); const d=await r.json(); audioUrl=d.result?.download||d.result?.url||d.download||d.url||d.data?.dl||d.data?.url; if(audioUrl) break; } catch{} }
                if(!audioUrl) return reply('❌ Music servers down, try in 10 mins');
                await sock.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mp4', fileName: title+'.mp3' }, { quoted: msg }); return reply(`🎵 *Now Playing:*\n${title}`);
            } catch { return reply('Play failed'); }
        }
        if (command === 'video' || command === 'yt') return reply('Use .play for audio. For video, use .tiktok or .ai');
        if (command === 'ig' || command === 'insta') return reply('Send Instagram link with .ai: .ai Download this Instagram video?');

        if (command === 'ai' || command === 'ask' || command === 'gpt') {
            if (!text) return reply('Ask me: .ai Who is the best footballer?');
            try { await reply('🤖 Thinking...'); let answer=null;
                try { const r=await fetch(`https://api.nekolabs.my.id/ai/chatgpt?text=${encodeURIComponent(text)}`); const d=await r.json(); answer=d.result||d.response; } catch {}
                if(!answer){ try{ const r=await fetch(`https://api.siputzx.my.id/api/ai/gpt-3?prompt=${encodeURIComponent(text)}`); const d=await r.json(); answer=d.data||d.result; } catch{} }
                if(!answer){ try{ const r=await fetch(`https://api.dreaded.site/api/chatgpt?query=${encodeURIComponent(text)}`); const d=await r.json(); answer=d.result||d.response||d.answer; } catch{} }
                if(!answer){ try{ const r=await fetch(`https://text.pollinations.ai/${encodeURIComponent(text)}`); const t=await r.text(); if(!t.includes('Free limit')&&t.length>5) answer=t; } catch{} }
                if(!answer) return reply('AI busy, try again in 1 min!');
                return reply(`🐂 *BULL X AI*\n\n${answer}`);
            } catch { return reply('AI busy'); }
        }
        if (command === 'imagine') return reply(`🎨 Imagine: ${text}\n\nUse .ai to describe it: .ai Describe ${text}`);
        if (command === 'story') return reply(`📖 *STORY*\n\nOnce upon a time in Kisii... ${text||'A young hustler'} woke up and decided today is the day! He worked hard, prayed, and became a legend! The end! 🐂🔥`);
        if (command === 'poem') return reply(`📝 *POEM FOR ${text||'YOU'}*\n\nRoses are red,\nViolets are blue,\nBULL X is here,\nAnd so are you! ❤️🐂`);
    });
}
startBot();