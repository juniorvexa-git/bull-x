const express = require('express');
const app = express();
app.get('/',(reg,res) => res.send('BULL X IS ONLINE!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT,() => console.log('Server on port' + PORT));
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const sharp = require('sharp');
const fs = require('fs');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const sock = makeWASocket({ logger: pino({ level: 'silent' }), printQRInTerminal: false, auth: state, browser: ['BULL X', 'Chrome', '1.0'] });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log('SCAN THIS QR WITH 254112843071 PHONE:');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') { console.log('BULL X IS ONLINE!'); }
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

        // --- D: STICKER MAKER ---
        // Send image with caption .sticker OR reply to image with .sticker
        if (body.startsWith('.sticker') || body.startsWith('.s')) {
            try {
                let targetMsg = msg;
                // If replying to an image, get that image
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
            // --- B: AUTO-REPLY ---
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

        // --- A: MORE COMMANDS ---
        if (command === 'ping') await reply('Pong! BULL X is alive! ⚡ Speed: Fast');
        if (command === 'menu') await reply('🐂 *BULL X MENU*\n\n*A - GENERAL*\n.ping - Check bot alive\n.menu - This menu\n.owner - Owner info\n.alive - Bot status\n.info - Bot info\n.time - Current time\n\n*B - AUTO*\nJust say hi/hello/sasa\n\n*C - GROUP*\n.tagall - Tag everyone\n.groupinfo - Group info\n\n*D - STICKER*\n.sticker - Send image + caption .sticker');
        if (command === 'owner') await reply('👑 *BULL X OWNER*\n\nName: BULL X Owner\nNumber: +254112843071\nBot: BULL X V2');
        if (command === 'alive') await reply('🐂 *BULL X IS ALIVE!*\n\n✅ Online\n✅ Working\n✅ Ready for commands');
        if (command === 'info') await reply('🐂 *BULL X INFO*\n\nVersion: V2\nOwner: +254112843071\nCommands: .menu\nMade with Baileys');
        if (command === 'time') {
            const now = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });
            await reply('🕒 *TIME*\n' + now);
        }
        if (command === 'bull') await reply('🐂🔥 BULL X MODE ACTIVATED! 🔥🐂\n\nNo one can stop the BULL!');

        // --- C: GROUP COMMANDS ---
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
                await reply(`👥 *GROUP INFO*\n\nName: ${metadata.subject}\nMembers: ${metadata.participants.length}\nID: ${metadata.id}\nCreated: ${new Date(metadata.creation * 1000).toLocaleDateString()}`);
            } catch { await reply('Failed to get group info'); }
        }
    });
}
startBot();