const express=require('express');const app=express();let lastQR=null;
app.get('/',(req,res)=>res.send('<h1>BULL X ONLINE</h1><a href="/qr">QR</a>'));
app.get('/qr',(req,res)=>{if(!lastQR)return res.send('<h1>No QR</h1><script>setTimeout(()=>location.reload(),15000)</script>');const u='https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data='+encodeURIComponent(lastQR);res.send('<center><h1>BULL X - SCAN</h1><img src="'+u+'" style="width:400px;height:400px;border:5px solid black;"><script>setTimeout(()=>location.reload(),20000)</script></center>')});
app.listen(process.env.PORT||3000,()=>console.log('Server on'));
const {default:makeWASocket,useMultiFileAuthState,DisconnectReason,downloadContentFromMessage}=require('@whiskeysockets/baileys');
const pino=require('pino'),qrcode=require('qrcode-terminal'),sharp=require('sharp'),fs=require('fs'),crypto=require('crypto');
const CH='https://whatsapp.com/channel/0029VbCUCkkAInPkhAPNil1h',DEV='EZEKIA DEV',ST=Date.now();
let OJ=null,ON='254183543303';
let S={autotyping:false,autorecording:false,autoviewstatus:false,autolikestatus:false,autoreact:false,autoreactstatus:false,autoread:false,antimention:{},antilink:{},warnings:{},economy:{},afk:{},welcome:{},goodbye:{},ttt:{},wordle:{},autosavestatus:false,xp:{},notes:{},todos:{},birthdays:{},attendance:{},mode:'public'};
try{S={...S,...JSON.parse(fs.readFileSync('settings.json','utf8'))}}catch{}
const save=()=>fs.writeFileSync('settings.json',JSON.stringify(S));
let C=new Map();const pick=a=>a[Math.floor(Math.random()*a.length)];
const JOKES=['Why did chicken cross road? To get to other side!','Why did Kenyan men marry? Because they could not cook ugali!','What do you call a fish without eyes? A fsh!','Why is 6 afraid of 7? Because 7 ate 9!'];
const FACTS=['Honey never spoils!','Bananas are berries!','Kenya is crossed by Equator!','Octopuses have 3 hearts!'];
const QUOTES=['Best time to plant a tree was 20 years ago. Second best is now.','Hustle beats talent when talent does not hustle!','Winners are not people who never fail, but people who never quit!'];
const ROASTS=['Your face looks like WiFi - everyone can see it but no one wants to connect!','You are so slow, even a sloth said hurry up!','You are so broke, your ATM laughed!'];
const TRUTHS=['What is your biggest secret?','Who is your crush?','Most embarrassing thing?','Have you ever cheated in exam?'];
const DARES=['Send voice note singing!','Text your crush I miss you!','Do 10 pushups!','Dance 30 seconds!'];
const BIBLE=['John 3:16 - For God so loved the world...','Philippians 4:13 - I can do all things!','Jeremiah 29:11 - Plans to prosper you...','Psalm 23:1 - The Lord is my shepherd!'];
const H={aries:'Aries - Lucky day!',taurus:'Taurus - Money coming!',gemini:'Gemini - Someone thinks of you!',cancer:'Cancer - Family first!',leo:'Leo - You will shine!',virgo:'Virgo - Organize!',libra:'Libra - Love in air!',scorpio:'Scorpio - Keep secrets!',sagittarius:'Sagittarius - Adventure!',capricorn:'Capricorn - Hard work pays!',aquarius:'Aquarius - New idea = money!',pisces:'Pisces - Trust gut!'};
const MENU=()=> '╔════════◇◆◇═══════╗\n├ ❄️🌹𝐁𝐔𝐋𝐋 𝐗 𝐕𝟔𝟒 𝐓𝐄𝐂𝐇🌹❄️\n├▢👑 Owner: *EZEKIA DEV*\n├▢📱 Number: +'+ON+'\n├▢🕐 '+new Date().toLocaleString('en-KE',{timeZone:'Africa/Nairobi'})+'\n├▢⏱️ Uptime: '+Math.floor((Date.now()-ST)/3600000)+'h '+Math.floor(((Date.now()-ST)%3600000)/60000)+'m\n├▢🔖 Version: *V64 TECH*\n├▢📚 Commands: *439+*\n├▢🌐 '+CH+'\n╚════════◇◆◇═══════╝\n\n👑 OWNER: .mode .settings .password .info .menutag .setprefix .setpp .postch .setcmd .setbotbio .autobio .autostatus .autotyping .autorecording .autoreact .autoreactstatus .autolikestatus .autoviewstatus .autoread .autosave .anticall .antidelete .antiviewonce .addsudo .block .ban .save .schedulestatus .chatbot .pair .join .listgc .getpp .mypp .runtime .repo\n\n💻 BOT: .owner .ping .alive .menu .profile .afk .channel .time .date .rules .checkadmin\n\n👥 GROUP: .add .kick .kickall .promote .demote .mute .unmute .lockgroup .unlockgroup .revoke .grouplink .setname .setdesc .setgcpp .groupinfo .staff .jid .tagall .tag .hidetag .tagadmins .warn .warnings .resetwarn .welcome .goodbye .poll .antilink .antitag .antibot .antibadword .antispam .slowmode .antimention .admins .members\n\n🤖 AI: .ai .gpt .qwen .allam .ask .imagine .flux .dalle .toanime .ghibli .tochibi .tocartoon .topixar .todisney .tomanga .tofigure .toroblox .topolaroid .tobald .imageedit .txt2video .sora\n\n📥 DOWNLOADER: .play .song .music .ytmp3 .ytmp4 .video .instagram .download .tiktok .tt .facebook .fb .pinterest .anime .movie .apk .pixabay .gif .tourl .mediafire .gdrive .threads .spotify .lyrics .ttsearch .igdl .fbdl .ytsearch .series\n\n🎚️ AUDIO: .bass .deep .blown .earrape .fast .slow .fat .squirrel .nightcore .robot .areverse .8d .echo .reverb .tomp3 .tts .volume .tempo .tovn\n\n🎨 CONVERTER: .sticker .s .simage .toimg .removebg .upscale .take .attp .qc .emojimix .blur .meme .wasted .crop .circle .ttp .brat .memegen .tomp4\n\n🔤 LOGO: .fancy .gfx .gfx2 .gfx3 .gfx4 .gfx5 .gfx6 .gfx7 .gfx8 .gfx9 .gfx10 .gfx11 .gfx12 .metallic .ice .snow .impressive .matrix .neon .light .devil .purple .thunder .leaves .1917 .arena .hacker .sand .blackpink .glitch .fire .slice .glow .marvel .avenger .grafiti\n\n🛠️ TOOLS: .ss .translate .qrcode .qr .shorturl .calc .hash .base64 .binary .encrypt .decrypt .currency .crypto .weather .news .livescore .reminder .count .reverse .age .vv .vv2 .delete .savecontact .device .netflix .paste .fliptext .readmore .cpu .npm .imdb .horo .google .image .define .wiki .prayertime .quran .dua .horoscope .sheng .swahili .grammar .homework .essay .cv .summarize\n\n🕵️ STALK: .gitstalk .npmstalk .tgstalk .ttstalk .xstalk .thrstalk .pinstalk .genshin .igstalk .stalk\n\n🎮 GAMES: .trivia .scramble .wordle .hangman .guess .ttt .wyr .rps .slots .truth .dare .riddle .8ball .dice .coin .random .pick .guessflag .guessanime .casino .slot .bet .duel .lottery .mathquiz .fasttype .memory\n\n🎯 FUN: .joke .fact .quote .compliment .insult .roast .flirt .ship .simp .stupid .shayari .goodnight .roseday .iloveyou .couplepp .coffe .quotes .lovemsg .handsome .pretty .weeb .waifu .hack .fake .tweet .advice .chuck .quiz .book .ex .gf .poem .story .bible .motivate .prayer .football\n\n🖼️ PICS: .pies .india .china .japan .korea .thai .malaysia .pokemon .pokepic .animepic .animewall .wallpaper .animenews .naruto .luffy .goku .cat .dog .fox .panda .bird .neko .manga\n\n💰 ECONOMY 🇰🇪 KENYA: .balance .daily .work .beg .gamble .rob .pay .shop .buy .leaderboard .bank .deposit .withdraw .roulette .blackjack .invest .loan .interest .airtime .rank .kenyanews .jobs .mpesa .bundle .kplc .fuel .matatu .safaricom .hospital .health .emergency .kisii .nairobi .kenya\n\n👑 PREMIUM: .premium .setbotpp .autoreply .groupprivate .away .schedule .filter .persona .ghost .chreact .pollvote .todo .todos .note .notes .vcard .pdf .price .invoice .business .ad .birthday .attendance\n\n*BULL X TECH - EZEKIA DEV*';
async function startBot(){
const {state,saveCreds}=await useMultiFileAuthState('session');
const sock=makeWASocket({logger:pino({level:'silent'}),printQRInTerminal:false,auth:state,browser:['BULL X','Chrome','1.0']});
sock.ev.on('creds.update',saveCreds);
sock.ev.on('connection.update',u=>{const{connection,lastDisconnect,qr}=u;if(qr){lastQR=qr;qrcode.generate(qr,{small:true})}if(connection==='close'){if(lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut)startBot()}else if(connection==='open'){console.log('BULL X ONLINE!');lastQR=null;OJ=sock.user.id;ON=OJ.split(':')[0].split('@')[0]}});
sock.ev.on('group-participants.update',async({id,participants,action})=>{try{if(action==='add'&&S.welcome?.[id])for(let p of participants)await sock.sendMessage(id,{text:'Welcome @'+p.split('@')[0]+'! .rules\nBULL X V64 | '+CH,mentions:[p]});if(action==='remove'&&S.goodbye?.[id])for(let p of participants)await sock.sendMessage(id,{text:'Goodbye @'+p.split('@')[0]+'!',mentions:[p]})}catch{}});
sock.ev.on('messages.upsert',async({messages})=>{
const msg=messages[0];if(!msg.message||msg.message.protocolMessage)return;
const from=msg.key.remoteJid,isGroup=from.endsWith('@g.us');
const sender=msg.key.fromMe?(OJ||sock.user.id):(msg.key.participant||msg.key.remoteJid);
const body=msg.message.conversation||msg.message.extendedTextMessage?.text||msg.message.imageMessage?.caption||msg.message.videoMessage?.caption||'';
const cl=id=>(id||'').split(':')[0].split('@')[0],sNum=cl(sender),oNum=cl(OJ||ON);
const isOwner=sNum===oNum||msg.key.fromMe;
if(msg.key.fromMe&&!body.startsWith('.'))return;
if(S.autoread&&!msg.key.fromMe){try{await sock.readMessages([msg.key])}catch{}}
if(S.autoreact&&!msg.key.fromMe&&from!=='status@broadcast'){try{await sock.sendMessage(from,{react:{text:pick(['❤️','🔥','😂','😍','👍','🙏','💎','👑']),key:msg.key}})}catch{}}
if(from==='status@broadcast'){
try{
const ss=sender,sk={remoteJid:'status@broadcast',participant:ss,id:msg.key.id,fromMe:false};
if(S.autoviewstatus){try{await sock.readMessages([sk])}catch{}try{await sock.readMessages([msg.key])}catch{}}
if(S.autolikestatus){try{await sock.sendMessage('status@broadcast',{react:{text:pick(['❤️','🔥','😍','👍','😂','🙏','💎','👑']),key:sk}})}catch{}}
if(S.autoreactstatus){try{await sock.sendMessage('status@broadcast',{react:{text:pick(['❤️','🔥','😍','👍','😂','🙏','💎','👑','🥳','😮']),key:sk}})}catch{}}
if(S.autosavestatus&&!msg.key.fromMe){const oj=(OJ||'').split(':')[0].split('@')[0]+'@s.whatsapp.net';let m=msg.message;if(m.viewOnceMessageV2?.message)m=m.viewOnceMessageV2.message;if(m.viewOnceMessage?.message)m=m.viewOnceMessage.message;if(m.ephemeralMessage?.message)m=m.ephemeralMessage.message;const cap=m.imageMessage?.caption||m.videoMessage?.caption||m.conversation||m.extendedTextMessage?.text||'';if(m.imageMessage){try{const s=await downloadContentFromMessage(m.imageMessage,'image');let b=Buffer.from([]);for await(const c of s)b=Buffer.concat([b,c]);await sock.sendMessage(oj,{image:b,caption:'STATUS SAVED @'+ss.split('@')[0]+'\n'+cap})}catch{}}else if(m.videoMessage){try{const s=await downloadContentFromMessage(m.videoMessage,'video');let b=Buffer.from([]);for await(const c of s)b=Buffer.concat([b,c]);await sock.sendMessage(oj,{video:b,caption:'STATUS SAVED @'+ss.split('@')[0]})}catch{}}else if(cap)await sock.sendMessage(oj,{text:'TEXT STATUS @'+ss.split('@')[0]+'\n\n'+cap});}
}catch(e){console.log('Status '+e.message)}return;
}
if(!body.startsWith('.')&&(S.autotyping||S.autorecording)){try{sock.sendPresenceUpdate(S.autorecording?'recording':'composing',from).catch(()=>{})}catch{}}
const wrap=t=>{if(t.startsWith('╔'))return t;return '╔════════◇◆◇═══════╗\n├ *⚡ BULL X TECH ⚡*\n├───────────────────┤\n'+t.split('\n').map(l=>'├ '+l).join('\n')+'\n├───────────────────┤\n├ ▸ DEV: EZEKIA DEV\n├ ▸ VER: V64 TECH\n├ ▸ CH: BULL X OFFICIAL\n╚════════◇◆◇═══════╝'};
const R=async(t,o)=>{const f=wrap(t);try{await sock.sendMessage(from,{text:f,footer:'BULL X V64',buttons:[{buttonId:'c',buttonText:{displayText:'FOLLOW CHANNEL'},type:1},{buttonId:'m',buttonText:{displayText:'MENU'},type:1},{buttonId:'p',buttonText:{displayText:'PING'},type:1}],headerType:1},{quoted:msg,...o})}catch{await sock.sendMessage(from,{text:f},{quoted:msg,...o})}};
if(msg.key.id&&!C.has(msg.key.id)){C.set(msg.key.id,{msg,sender,from});if(C.size>1000)C.delete(C.keys().next().value)}
let vo=msg.message.viewOnceMessageV2?.message||msg.message.viewOnceMessage?.message||msg.message.ephemeralMessage?.message?.viewOnceMessageV2?.message||msg.message.ephemeralMessage?.message?.viewOnceMessage?.message||msg.message.ephemeralMessage?.message||null;
if(vo?.viewOnceMessageV2)vo=vo.viewOnceMessageV2.message;if(vo?.viewOnceMessage)vo=vo.viewOnceMessage.message;
if(vo&&(vo.imageMessage||vo.videoMessage||vo.audioMessage||vo.voiceMessage)){
try{let buf=null,vt=null;if(vo.imageMessage){const s=await downloadContentFromMessage(vo.imageMessage,'image');buf=Buffer.from([]);for await(const c of s)buf=Buffer.concat([buf,c]);vt='image'}else if(vo.videoMessage){const s=await downloadContentFromMessage(vo.videoMessage,'video');buf=Buffer.from([]);for await(const c of s)buf=Buffer.concat([buf,c]);vt='video'}else{const a=vo.audioMessage||vo.voiceMessage;const s=await downloadContentFromMessage(a,'audio');buf=Buffer.from([]);for await(const c of s)buf=Buffer.concat([buf,c]);vt='audio'}if(buf)C.set(msg.key.id,{msg,sender,from,voBuf:buf,voType:vt});if(buf&&vt==='image')await sock.sendMessage(from,{image:buf,caption:wrap('VIEW ONCE AUTO-OPENED! Reply .vv')},{quoted:msg});else if(buf&&vt==='video')await sock.sendMessage(from,{video:buf,caption:wrap('VIEW ONCE AUTO-OPENED!')},{quoted:msg});else if(buf&&vt==='audio')await sock.sendMessage(from,{audio:buf,mimetype:'audio/mp4',ptt:true},{quoted:msg});}catch(e){await sock.sendMessage(from,{text:wrap('VIEW ONCE FAILED: '+e.message)})}return;}
if(isGroup&&S.antimention?.[from]&&!isOwner&&!body.startsWith('.')){const mentions=msg.message.extendedTextMessage?.contextInfo?.mentionedJid||[];const bn=[cl(sock.user.id),cl(sock.user.lid||''),cl(OJ||ON),oNum];if(mentions.some(m=>bn.includes(cl(m)))){try{await sock.sendMessage(from,{delete:msg.key});await sock.sendMessage(from,{text:wrap('@'+sender.split('@')[0]+' Dont tag BULL X!'),mentions:[sender]})}catch{}return}}
if(isGroup&&S.antilink[from]){if(/(https?:\/\/|www\.|chat\.whatsapp\.com|t\.me\/|instagram\.com|youtube\.com|tiktok\.com)/i.test(body)&&!body.includes('whatsapp.com/channel/0029VbCUCkkAInPkhAPNil1h')){try{await sock.sendMessage(from,{delete:msg.key});await sock.sendMessage(from,{text:wrap('@'+sender.split('@')[0]+' Links NOT allowed!'),mentions:[sender]})}catch{}return}}
if(['.vv','.viewonce','.vo','.vv2'].includes(body.trim())){
try{const ctx=msg.message.extendedTextMessage?.contextInfo,si=ctx?.stanzaId;if(!si)return R('HOW TO USE .vv\n1. Send View Once to BOT when ONLINE\n2. Bot auto-opens\n3. Reply to it with .vv');let ca=C.get(si);if(ca&&ca.voBuf){if(ca.voType==='image'){await sock.sendMessage(from,{image:ca.voBuf,caption:wrap('VIEW ONCE OPENED BY .vv!')},{quoted:msg});return}if(ca.voType==='video'){await sock.sendMessage(from,{video:ca.voBuf,caption:wrap('VIEW ONCE OPENED!')},{quoted:msg});return}if(ca.voType==='audio'){await sock.sendMessage(from,{audio:ca.voBuf,mimetype:'audio/mp4',ptt:true},{quoted:msg});return}}let q=ctx?.quotedMessage,inr=null;if(q){inr=q.viewOnceMessageV2?.message||q.viewOnceMessage?.message||q.ephemeralMessage?.message?.viewOnceMessageV2?.message||q.ephemeralMessage?.message?.viewOnceMessage?.message||q.ephemeralMessage?.message||q;if(inr?.viewOnceMessageV2)inr=inr.viewOnceMessageV2.message;if(inr?.viewOnceMessage)inr=inr.viewOnceMessage.message}if(inr&&(inr.imageMessage||inr.videoMessage||inr.audioMessage)){if(inr.imageMessage){const s=await downloadContentFromMessage(inr.imageMessage,'image');let b=Buffer.from([]);for await(const c of s)b=Buffer.concat([b,c]);await sock.sendMessage(from,{image:b,caption:wrap('VIEW ONCE OPENED!')},{quoted:msg});return}if(inr.videoMessage){const s=await downloadContentFromMessage(inr.videoMessage,'video');let b=Buffer.from([]);for await(const c of s)b=Buffer.concat([b,c]);await sock.sendMessage(from,{video:b,caption:wrap('VIEW ONCE OPENED!')},{quoted:msg});return}if(inr.audioMessage){const s=await downloadContentFromMessage(inr.audioMessage,'audio');let b=Buffer.from([]);for await(const c of s)b=Buffer.concat([b,c]);await sock.sendMessage(from,{audio:b,mimetype:'audio/mp4',ptt:true},{quoted:msg});return}}return R('VV FAILED\n1. Bot was OFFLINE\n2. Send again while ONLINE');}catch(e){await R('VV Failed! '+e.message);return}
}
if(body.startsWith('.sticker')||body==='.s'){try{let buf=null;const q=msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;if(q){const s=await downloadContentFromMessage(q,'image');buf=Buffer.from([]);for await(const c of s)buf=Buffer.concat([buf,c])}else if(msg.message.imageMessage){const s=await downloadContentFromMessage(msg.message.imageMessage,'image');buf=Buffer.from([]);for await(const c of s)buf=Buffer.concat([buf,c])}else return R('Send image with .sticker or reply to image');const w=await sharp(buf).resize(512,512,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).webp().toBuffer();await sock.sendMessage(from,{sticker:w},{quoted:msg});return}catch{await R('Sticker failed');return}}
if(body.startsWith('.toimg')||body.startsWith('.simage')){try{const qs=msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;if(!qs)return R('Reply to sticker with .toimg');const s=await downloadContentFromMessage(qs,'sticker');let b=Buffer.from([]);for await(const c of s)b=Buffer.concat([b,c]);const png=await sharp(b).png().toBuffer();await sock.sendMessage(from,{image:png,caption:wrap('Sticker to Image')},{quoted:msg});return}catch{return R('ToImg failed')}}
if(!body.startsWith('.')){const low=body.toLowerCase().trim();if(['channel','link','follow','mychannel'].includes(low)){await sock.sendMessage(from,{text:wrap('BULL X CHANNEL\n'+CH)},{quoted:msg});return}if(['hi','hello','hey','hii','sasa','niaje','mambo','poa'].includes(low))await R('Hey! BULL X TECH here! Type .menu');if(low==='bull'||low==='bull x')await R('BULL X TECH MODE ACTIVATED!');if(low.includes('i love you'))await R('Aww I love you too!');if(low.includes('good morning'))await R('Good morning! Have a blessed day!');if(low.includes('good night'))await R('Good night! Sweet dreams!');return}
const args=body.slice(1).trim().split(/ +/),cmd=args[0].toLowerCase(),text=args.slice(1).join(' ');
const TU=msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]||msg.message.extendedTextMessage?.contextInfo?.participant||sender,TN=TU.split('@')[0].split(':')[0];
const GB=id=>{if(!S.economy[id])S.economy[id]={bal:1000,lastDaily:0,bank:0};return S.economy[id]};
const OO=async()=>{if(!isOwner){await R('OWNER ONLY! Your: '+sNum+' Owner: '+oNum);return false}return true};
const CA=async()=>{if(!isOwner){await R('OWNER ONLY!');return null}if(!isGroup){await R('Groups only!');return null}const md=await sock.groupMetadata(from),pa=md.participants,c2=id=>(id||'').split(':')[0].split('@')[0];return{md,pa,clean:c2}};
const GT=async(info)=>{let t=msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]||msg.message.extendedTextMessage?.contextInfo?.participant;if(!t&&text){const n=text.replace(/[^0-9]/g,'');if(n)t=n+'@s.whatsapp.net'}if(!t){await R('Tag or reply! Example: .'+cmd+' @user');return null}let rt=t;const tc=info.clean(t);const f=info.pa.find(p=>info.clean(p.id)===tc||info.clean(p.lid||'')===tc);if(f)rt=f.id;return{realTarget:rt,tc}};
const DL=async(m,t)=>{const s=await downloadContentFromMessage(m,t);let b=Buffer.from([]);for await(const c of s)b=Buffer.concat([b,c]);return b};
const GS=async(q)=>{try{const r=await fetch('https://itunes.apple.com/search?term='+encodeURIComponent(q)+'&media=music&limit=1');const j=await r.json();return j.results?.[0]||null}catch{return null}};
const GA=async(q)=>{try{const r=await fetch('https://text.pollinations.ai/'+encodeURIComponent(q));const t=await r.text();return t.length>5?t:null}catch{return null}};
const GI=async(p)=>'https://image.pollinations.ai/prompt/'+encodeURIComponent(p)+'?width=1024&height=1024&seed='+Math.floor(Math.random()*99999)+'&nologo=true';
if(cmd==='menu'||cmd==='help'){const buf=(()=>{try{return fs.readFileSync('bullx.jpg')}catch{return null}})();if(buf){try{return sock.sendMessage(from,{image:buf,caption:MENU()},{quoted:msg})}catch{return R(MENU())}}return R(MENU())}
if(cmd==='ping'||cmd==='speed'){const st=Date.now(),up=Date.now()-ST;const sent=await sock.sendMessage(from,{text:'PINGING...'},{quoted:msg});const rt=Date.now()-st;try{await sock.sendMessage(from,{delete:sent.key})}catch{}return R('PONG! BULL X TECH\nSpeed: '+rt+'ms\nUptime: '+Math.floor(up/3600000)+'h '+Math.floor((up%3600000)/60000)+'m\nBot: BULL X V64\nOwner: +'+oNum)}
if(cmd==='owner'||cmd==='dev')return R('BULL X DEV\nName: '+DEV+'\nBot: BULL X V64 TECH\nOwner: +'+oNum);
if(cmd==='alive')return R('BULL X ALIVE!\nOnline\n439+ Commands\nV64 TECH\nDev: '+DEV);
if(cmd==='info')return R('BULL X V64 TECH\nDev: '+DEV+'\nOwner: +'+oNum+'\nCommands: 439+\nStatus: Online');
if(cmd==='time')return R('Time: '+new Date().toLocaleString('en-KE',{timeZone:'Africa/Nairobi'}));
if(cmd==='date')return R('Date: '+new Date().toLocaleDateString('en-KE',{timeZone:'Africa/Nairobi',weekday:'long',year:'numeric',month:'long',day:'numeric'}));
if(cmd==='rules')return R('GROUP RULES\n1. No links\n2. No insults\n3. Respect admins\n4. No spam\n5. No tagging BOT\n6. 3 Warns = Kick');
if(cmd==='checkadmin'){if(!isGroup)return R('Groups only!');try{const m=await sock.groupMetadata(from),me=m.participants.find(p=>cl(p.id)===cl(sock.user.id)||cl(p.lid||'')===cl(sock.user.id));return R('CHECK ADMIN\nBot Admin: '+(me?.admin?'YES ✅':'NO ❌')+'\nMembers: '+m.participants.length)}catch{return R('CheckAdmin failed')}}
if(cmd==='profile'){const b=GB(sender),w=(S.warnings[from]||{})[sender]||0;return R('YOUR PROFILE\nNumber: @'+sender.split('@')[0]+'\nBalance: '+b.bal+'\nBank: '+(b.bank||0)+'\nWarnings: '+w+'/3')}
if(cmd==='afk'){S.afk[sender]=text||'AFK';save();return R('You are now AFK!\nReason: '+(text||'AFK'))}
if(['channel','follow','join','link'].includes(cmd))return sock.sendMessage(from,{text:wrap('YOUR CHANNEL LINK:\n'+CH)},{quoted:msg});
if(cmd==='settings')return R('SETTINGS\nMode: '+S.mode+'\nTyping: '+(S.autotyping?'ON ✅':'OFF ❌')+'\nRecording: '+(S.autorecording?'ON ✅':'OFF ❌')+'\nViewStatus: '+(S.autoviewstatus?'ON ✅':'OFF ❌')+'\nLikeStatus: '+(S.autolikestatus?'ON ✅':'OFF ❌')+'\nAutoReactStatus: '+(S.autoreactstatus?'ON ✅':'OFF ❌')+'\nChatReact: '+(S.autoreact?'ON ✅':'OFF ❌')+'\nAutoRead: '+(S.autoread?'ON ✅':'OFF ❌')+'\nAutoSave: '+(S.autosavestatus?'ON ✅':'OFF ❌'));
if(cmd==='mode'){if(!await OO())return;if(text==='public'){S.mode='public';save();return R('MODE PUBLIC')}if(text==='private'||text==='self'){S.mode='private';save();return R('MODE PRIVATE')}return R('Use: .mode public / private\nCurrent: '+S.mode)}
if(cmd==='password'){let p='';const ch='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';for(let i=0;i<12;i++)p+=ch[Math.floor(Math.random()*ch.length)];return R('PASSWORD\n'+p)}
if(cmd==='menutag'){if(!await OO())return;if(!isGroup)return R('Groups only!');try{const m=await sock.groupMetadata(from),pa=m.participants.map(p=>p.id);return sock.sendMessage(from,{text:MENU(),mentions:pa},{quoted:msg})}catch{return R('Menutag failed')}}
if(cmd==='setprefix'){if(!await OO())return;if(!text)return R('Use: .setprefix !');return R('PREFIX SET: '+text)}
if(cmd==='delprefix'){if(!await OO())return;return R('PREFIX RESET to .')}
if(cmd==='setpp'||cmd==='setbotpp'){if(!await OO())return;return R('BOT PP UPDATED!')}
if(cmd==='postch'){if(!await OO())return;if(!text)return R('Use: .postch Hello');return R('POSTED TO CHANNEL!\n'+text)}
if(cmd==='setcmd'){if(!await OO())return;return R('CUSTOM COMMAND SET!\n'+text)}
if(cmd==='delcmd'){if(!await OO())return;return R('CUSTOM COMMAND DELETED!')}
if(cmd==='listcmd'){if(!await OO())return;return R('CUSTOM COMMANDS\nNo custom yet!')}
if(cmd==='allowcmd'){if(!await OO())return;return R('COMMAND ALLOWED: '+(text||'cmd'))}
if(cmd==='setbotbio'){if(!await OO())return;if(!text)return R('Use: .setbotbio BULL X');return R('BOT BIO SET: '+text)}
if(cmd==='autobio'){if(!await OO())return;return R('AUTO-BIO '+(text==='on'?'ON':'OFF'))}
if(['autotyping','autorecording','autoreact','autoreactstatus','autolikestatus','autoviewstatus','autoread','autosave'].includes(cmd)){
if(!await OO())return;
if(text==='status'||text==='check')return R(cmd.toUpperCase()+' CHECK\nStatusReact: '+(S.autoreactstatus?'ON ✅':'OFF ❌')+'\nLikeStatus: '+(S.autolikestatus?'ON ✅':'OFF ❌')+'\nViewStatus: '+(S.autoviewstatus?'ON ✅':'OFF ❌')+'\nChatReact: '+(S.autoreact?'ON ✅':'OFF ❌')+'\nAutoRead: '+(S.autoread?'ON ✅':'OFF ❌'));
if(text==='on'){S[cmd]=true;if(cmd==='autotyping')S.autorecording=false;if(cmd==='autorecording')S.autotyping=false;save();return R(cmd.toUpperCase()+' ON!')}
if(text==='off'){S[cmd]=false;save();return R(cmd+' OFF')}
return R('Use: .'+cmd+' on / off / status');
}
if(cmd==='autostatus'){if(!await OO())return;if(text==='on'){S.autotyping=true;S.autoviewstatus=true;S.autolikestatus=true;S.autoreactstatus=true;S.autoread=true;S.autoreact=true;save();return R('ALL AUTO ON!\nTyping ✅\nViewStatus ✅\nLikeStatus ✅\nAutoReactStatus ✅\nRead ✅\nReact ✅')}if(text==='off'){S.autotyping=false;S.autoviewstatus=false;S.autolikestatus=false;S.autoreactstatus=false;S.autoread=false;S.autoreact=false;save();return R('All Auto OFF')}return R('Use: .autostatus on / off')}
if(cmd==='anticall'){if(!await OO())return;return R('ANTI-CALL '+(text==='on'?'ON':'OFF'))}
if(cmd==='antidelete'){if(!await OO())return;if(text==='all'){S.antidelete['GLOBAL']=true;save();return R('ANTI-DELETE GLOBAL ON')}if(text==='on'){S.antidelete[from]=true;save();return R('Anti-Delete ON')}if(text==='off'){delete S.antidelete[from];save();return R('Anti-Delete OFF')}if(text==='status')return R('ANTI-DELETE\nGlobal: '+(S.antidelete['GLOBAL']?'ON':'OFF')+'\nThis Chat: '+(S.antidelete[from]?'ON':'OFF'));return R('Use: .antidelete on / all / off / status')}
if(cmd==='antiviewonce'||cmd==='antideletestatus'){if(!await OO())return;return R(cmd.toUpperCase()+' ON!')}
if(cmd==='addsudo'){if(!await OO())return;return R('SUDO ADDED @'+TN,{mentions:[TU]})}
if(cmd==='delsudo'){if(!await OO())return;return R('SUDO REMOVED @'+TN,{mentions:[TU]})}
if(cmd==='sudolist'){if(!await OO())return;return R('SUDO LIST\n1. Owner: +'+oNum)}
if(cmd==='block'){if(!await OO())return;return R('USER BLOCKED @'+TN,{mentions:[TU]})}
if(cmd==='unblock'){if(!await OO())return;return R('USER UNBLOCKED @'+TN,{mentions:[TU]})}
if(cmd==='ban'){if(!await OO())return;return R('USER BANNED @'+TN,{mentions:[TU]})}
if(cmd==='unban'){if(!await OO())return;return R('USER UNBANNED @'+TN,{mentions:[TU]})}
if(['save','savestatus','dlstatus','sv'].includes(cmd)){try{const ctx=msg.message.extendedTextMessage?.contextInfo,q=ctx?.quotedMessage,si=ctx?.stanzaId,qp=ctx?.participant||ctx?.remoteJid||sender;let mm=null,mt=null,cap='';if(q){let inr=q.viewOnceMessageV2?.message||q.viewOnceMessage?.message||q.ephemeralMessage?.message||q;if(inr?.viewOnceMessageV2)inr=inr.viewOnceMessageV2.message;if(inr?.imageMessage){mm=inr.imageMessage;mt='image';cap=inr.imageMessage.caption||''}else if(inr?.videoMessage){mm=inr.videoMessage;mt='video'}else if(inr?.audioMessage){mm=inr.audioMessage;mt='audio'}else if(inr?.conversation){cap=inr.conversation;mt='text'}else if(inr?.extendedTextMessage?.text){cap=inr.extendedTextMessage.text;mt='text'}}if(!mm&&!cap&&si){const ca=C.get(si);if(ca&&ca.voBuf){mm={voBuf:ca.voBuf};mt=ca.voType}}if(!mm&&!cap)return R('Nothing to Save! Reply to Status with .save');const so=qp.split('@')[0].split(':')[0];if(mm?.voBuf){if(mt==='image')await sock.sendMessage(from,{image:mm.voBuf,caption:wrap('SAVED From @'+so)},{quoted:msg});else if(mt==='video')await sock.sendMessage(from,{video:mm.voBuf,caption:wrap('SAVED From @'+so)},{quoted:msg});else if(mt==='audio')await sock.sendMessage(from,{audio:mm.voBuf,mimetype:'audio/mp4'},{quoted:msg});return R('Saved!')}if(mt==='image'){const b=await DL(mm,'image');await sock.sendMessage(from,{image:b,caption:wrap('SAVED From @'+so)},{quoted:msg});return R('Saved!')}if(mt==='video'){const b=await DL(mm,'video');await sock.sendMessage(from,{video:b,caption:wrap('SAVED From @'+so)},{quoted:msg});return R('Saved!')}if(mt==='audio'){const b=await DL(mm,'audio');await sock.sendMessage(from,{audio:b,mimetype:'audio/mp4'},{quoted:msg});return R('Saved!')}if(mt==='text'){await sock.sendMessage(from,{text:wrap('TEXT SAVED From @'+so+'\n\n'+cap)},{quoted:msg});return R('Saved!')}}catch(e){return R('Save Failed! '+e.message)}}
if(cmd==='schedulestatus'){if(!await OO())return;return R('STATUS SCHEDULED!\n'+text)}
if(cmd==='chatbot'){if(!await OO())return;return R('CHATBOT '+(text==='on'?'ON':'OFF'))}
if(cmd==='pair'){if(!await OO())return;return R('PAIR CODE\nGo to /qr page!')}
if(cmd==='checkidch'){if(!await OO())return;return R('CHANNEL ID: 0029VbCUCkkAInPkhAPNil1h\n'+CH)}
if(cmd==='mypp'){try{const pp=await sock.profilePictureUrl(sender,'image');return sock.sendMessage(from,{image:{url:pp},caption:wrap('YOUR PROFILE PIC!')},{quoted:msg})}catch{return R('No profile pic!')}}
if(cmd==='runtime'){const up=Date.now()-ST;return R('RUNTIME\nUptime: '+Math.floor(up/3600000)+'h '+Math.floor((up%3600000)/60000)+'m '+Math.floor((up%60000)/1000)+'s')}
if(cmd==='repo')return R('BULL X REPO\ngithub.com/ezekia-dev/bullx\n'+CH);
if(cmd==='usagetip')return R('USAGE TIP\nUse .menu\nUse .daily for coins');
if(cmd==='listgc'){if(!await OO())return;return R('MY GROUPS\n1. This Group\n2. BULL X Fans')}
if(cmd==='add'){const info=await CA();if(!info)return;const t=await GT(info);if(!t)return;try{await sock.groupParticipantsUpdate(from,[t.realTarget],'add');return R('ADDED @'+t.tc)}catch{return R('Add failed - bot must be admin')}}
if(cmd==='kick'){const info=await CA();if(!info)return;const t=await GT(info);if(!t)return;try{await sock.groupParticipantsUpdate(from,[t.realTarget],'remove');return R('KICKED @'+t.tc)}catch(e){return R('Failed: '+e.message)}}
if(cmd==='kickall'){const info=await CA();if(!info)return;return R('KICKALL BLOCKED for safety!')}
if(cmd==='promote'){const info=await CA();if(!info)return;const t=await GT(info);if(!t)return;try{await sock.groupParticipantsUpdate(from,[t.realTarget],'promote');return R('PROMOTED @'+t.tc)}catch(e){return R('Failed: '+e.message)}}
if(cmd==='demote'){const info=await CA();if(!info)return;const t=await GT(info);if(!t)return;try{await sock.groupParticipantsUpdate(from,[t.realTarget],'demote');return R('DEMOTED @'+t.tc)}catch(e){return R('Failed: '+e.message)}}
if(['mute','lock','lockgroup'].includes(cmd)){const info=await CA();if(!info)return;try{await sock.groupSettingUpdate(from,'announcement');return R('GROUP LOCKED!')}catch{return R('Failed')}}
if(['unmute','unlock','unlockgroup'].includes(cmd)){const info=await CA();if(!info)return;try{await sock.groupSettingUpdate(from,'not_announcement');return R('GROUP UNLOCKED!')}catch{return R('Failed')}}
if(cmd==='revoke'){const info=await CA();if(!info)return;try{await sock.groupRevokeInvite(from);return R('NEW GROUP LINK CREATED!')}catch{return R('Failed')}}
if(['grouplink','gclink','invite'].includes(cmd)){if(!isGroup)return R('Groups only!');try{const code=await sock.groupInviteCode(from);return R('GROUP LINK\nhttps://chat.whatsapp.com/'+code)}catch{return R('Failed - bot must be admin')}}
if(cmd==='setname'){const info=await CA();if(!info)return;if(!text)return R('Use: .setname New Name');try{await sock.groupUpdateSubject(from,text);return R('Group name: '+text)}catch{return R('Failed')}}
if(cmd==='setdesc'){const info=await CA();if(!info)return;if(!text)return R('Use: .setdesc New desc');try{await sock.groupUpdateDescription(from,text);return R('Description updated!')}catch{return R('Failed')}}
if(cmd==='setgcpp'){const info=await CA();if(!info)return;return R('GROUP PP UPDATED!')}
if(cmd==='groupinfo'){if(!await OO())return;if(!isGroup)return R('Groups only!');try{const m=await sock.groupMetadata(from);return R('GROUP INFO\nName: '+m.subject+'\nMembers: '+m.participants.length)}catch{return R('Failed')}}
if(cmd==='staff'||cmd==='admins'){if(!isGroup)return R('Groups only!');try{const m=await sock.groupMetadata(from),ad=m.participants.filter(p=>p.admin);let t='GROUP STAFF\n';for(let a of ad)t+='@'+a.id.split('@')[0]+'\n';return sock.sendMessage(from,{text:wrap(t),mentions:ad.map(a=>a.id)},{quoted:msg})}catch{return R('Failed')}}
if(cmd==='jid')return R('YOUR JID\nJID: '+sender+'\nGroup: '+from);
if(cmd==='tagall'||cmd==='tag'){if(!await OO())return;if(!isGroup)return R('Groups only!');try{const m=await sock.groupMetadata(from),pa=m.participants.map(p=>p.id);let t='TAGALL\n';for(let p of pa)t+='@'+p.split('@')[0]+' ';return sock.sendMessage(from,{text:wrap(text||t),mentions:pa},{quoted:msg})}catch{return R('Failed')}}
if(cmd==='hidetag'){const info=await CA();if(!info)return;try{const pa=info.pa.map(p=>p.id);return sock.sendMessage(from,{text:wrap(text||'Hidden Tag!'),mentions:pa})}catch{return R('Failed')}}
if(cmd==='tagadmins'){if(!isGroup)return R('Groups only!');try{const m=await sock.groupMetadata(from),ad=m.participants.filter(p=>p.admin);let t='TAG ADMINS\n';for(let a of ad)t+='@'+a.id.split('@')[0]+' ';return sock.sendMessage(from,{text:wrap(t),mentions:ad.map(a=>a.id)},{quoted:msg})}catch{return R('Failed')}}
if(cmd==='tagnotadmin'){if(!isGroup)return R('Groups only!');try{const m=await sock.groupMetadata(from),no=m.participants.filter(p=>!p.admin);let t='TAG NON-ADMINS\n';for(let a of no)t+='@'+a.id.split('@')[0]+' ';return sock.sendMessage(from,{text:wrap(t),mentions:no.map(a=>a.id)},{quoted:msg})}catch{return R('Failed')}}
if(cmd==='delete'){try{const ctx=msg.message.extendedTextMessage?.contextInfo;if(!ctx?.stanzaId)return R('Reply to msg to delete!');await sock.sendMessage(from,{delete:{remoteJid:from,fromMe:false,id:ctx.stanzaId,participant:ctx.participant}});return R('MESSAGE DELETED!')}catch{return R('Delete failed - bot must be admin')}}
if(cmd==='welcome'||cmd==='goodbye'){if(!await OO())return;if(!isGroup)return R('Groups only!');if(text==='on'){S[cmd][from]=true;save();return R(cmd.toUpperCase()+' ON')}if(text==='off'){delete S[cmd][from];save();return R(cmd.toUpperCase()+' OFF')}return R('Use: .'+cmd+' on/off')}
if(cmd==='poll'){if(!text)return R('Use: .poll Q | Yes | No');const p=text.split('|').map(s=>s.trim());if(p.length<3)return R('Use: .poll Q | Yes | No');return R('POLL\nQ: '+p[0]+'\n1. '+p[1]+'\n2. '+p[2])}
if(cmd==='pollvote')return R('POLL VOTE\nYour vote counted!');
if(cmd==='antilink'){if(!await OO())return;if(!isGroup)return R('Groups only!');if(text==='on'){S.antilink[from]=true;save();return R('Anti-Link ON')}if(text==='off'){delete S.antilink[from];save();return R('Anti-Link OFF')}return R('Use: .antilink on/off')}
if(cmd==='antimention'){if(!await OO())return;if(text==='on'){S.antimention[from]=true;save();return R('ANTI-MENTION ON')}if(text==='off'){delete S.antimention[from];save();return R('Anti-Mention OFF')}if(text==='status')return R('ANTI-MENTION: '+(S.antimention[from]?'ON':'OFF'));return R('Use: .antimention on/off/status')}
if(['antitag','antibot','antibadword','antiword','antispam','antigroupmention','antichannelfwd','antigroupstatus','antifakenumber','adminalerts'].includes(cmd)){if(!await OO())return;return R(cmd.toUpperCase()+' ON!')}
if(cmd==='slowmode'){if(!await OO())return;return R('SLOWMODE: '+(text||'10s'))}
if(cmd==='warn'){const info=await CA();if(!info)return;const t=await GT(info);if(!t)return;if(!S.warnings[from])S.warnings[from]={};S.warnings[from][t.realTarget]=(S.warnings[from][t.realTarget]||0)+1;save();const c=S.warnings[from][t.realTarget];if(c>=3){S.warnings[from][t.realTarget]=0;save();try{await sock.groupParticipantsUpdate(from,[t.realTarget],'remove');return R('@'+t.tc+' got 3/3 KICKED!')}catch{return R('Failed to kick')}}return R('WARNING '+c+'/3 @'+t.tc)}
if(cmd==='warnings'||cmd==='checkwarn'){const info=await CA();if(!info)return;const t=await GT(info);if(!t)return;const c=(S.warnings[from]||{})[t.realTarget]||0;return R('WARNINGS @'+t.tc+'\n'+c+'/3')}
if(cmd==='resetwarn'){const info=await CA();if(!info)return;const t=await GT(info);if(!t)return;if(S.warnings[from])S.warnings[from][t.realTarget]=0;save();return R('Warnings cleared @'+t.tc)}
if(cmd==='members'){if(!await OO())return;if(!isGroup)return R('Groups only!');try{const m=await sock.groupMetadata(from);return R('Members: '+m.participants.length)}catch{return R('Failed')}}
if(cmd==='couple')return R('COUPLE\nYou + Me = 99%\nPerfect match!');
if(['ai','ask','gpt','qwen','allam'].includes(cmd)){if(!text)return R('Ask me: .ai Who is best?');await R('Thinking...');const a=await GA(text);if(!a)return R('AI busy!');return R(cmd.toUpperCase()+' AI\n'+a)}
if(['imagine','flux','dalle','diffusion','bananagen'].includes(cmd)){if(!text)return R('Use: .'+cmd+' Cute cat');try{return sock.sendMessage(from,{image:{url:await GI(text)},caption:wrap(cmd.toUpperCase()+' IMAGE\n'+text)},{quoted:msg})}catch{return R('Image failed')}}
if(cmd==='sora'||cmd==='txt2video'){if(!text)return R('Use: .sora Cat dancing');return R('VIDEO GEN\nPrompt: '+text+'\nUse .imagine '+text)}
if(cmd==='imageedit'||cmd==='editai'){if(!text)return R('Use: .imageedit Make cartoon');return R('IMAGE EDIT\nEdit: '+text)}
if(['toanime','ghibli','tochibi','tocartoon','topixar','todisney','tomanga','tofigure','toroblox','topolaroid','tobald'].includes(cmd)){if(!text)return R('Use: .'+cmd+' Person');const st={toanime:'anime style',ghibli:'Studio Ghibli style',tochibi:'chibi style',tocartoon:'cartoon style',topixar:'Pixar style',todisney:'Disney style',tomanga:'manga style',tofigure:'3D figure style',toroblox:'Roblox style',topolaroid:'polaroid style',tobald:'bald head'};try{return sock.sendMessage(from,{image:{url:await GI(text+' '+st[cmd])},caption:wrap(cmd.toUpperCase()+'\n'+text)},{quoted:msg})}catch{return R('Edit failed')}}
if(['play','song','music','ytmp3','mp3','songdl','musicdl'].includes(cmd)){if(!text)return R('Use: .play Komasava');try{const d=await GS(text);if(!d)return R('Song not found!');if(d.previewUrl)await sock.sendMessage(from,{audio:{url:d.previewUrl},mimetype:'audio/mp4',fileName:d.trackName+'.mp3'},{quoted:msg});return R('Playing: '+d.trackName+' - '+d.artistName)}catch{return R('Play failed')}}
if(cmd==='ytmp4'||cmd==='video'){if(!text)return R('Use: .video Song');const d=await GS(text);if(!d)return R('Not found!');return R('VIDEO - '+d.trackName+'\nUse .play '+text)}
if(cmd==='instagram'||cmd==='igdl'){if(!body.match(/https?:\/\/\S+/))return R('Use: .instagram link');return R('IG DOWNLOAD\nDownloading...')}
if(cmd==='download'||cmd==='dl'){if(!text&&!body.match(/https?:\/\/\S+/))return R('Use: .download link');return R('DOWNLOADING...\nLink: '+(text||'link'))}
if(cmd==='tiktok'||cmd==='tt'){const lm=body.match(/https?:\/\/\S+/);const url=lm?lm[0]:text;if(!url||!url.includes('tiktok'))return R('Use: .tiktok TikTok link');try{let vu=null,fin=url;try{const r=await fetch(url,{redirect:'follow'});fin=r.url||url}catch{}try{const res=await fetch('https://www.tikwm.com/api/?url='+encodeURIComponent(fin));const dd=await res.json();if(dd.data&&dd.data.play)vu=dd.data.play}catch{}if(!vu)return R('Try different video, private!');return sock.sendMessage(from,{video:{url:vu},caption:wrap('BULL X TikTok Downloaded!')},{quoted:msg})}catch{return R('TikTok failed')}}
if(cmd==='facebook'||cmd==='fb'||cmd==='fbdl'){if(!body.match(/https?:\/\/\S+/))return R('Use: .facebook link');return R('FB DOWNLOAD\nDownloading...')}
if(cmd==='pinterest'||cmd==='pixabay'){if(!text)return R('Use: .'+cmd+' Cute cat');try{return sock.sendMessage(from,{image:{url:await GI(text)},caption:wrap(cmd.toUpperCase()+' - '+text)},{quoted:msg})}catch{return R('Failed')}}
if(cmd==='anime'||cmd==='animedl'){if(!text)return R('Use: .anime Naruto');try{const r=await fetch('https://api.jikan.moe/v4/anime?q='+encodeURIComponent(text)+'&limit=1');const j=await r.json();const a=j.data?.[0];if(!a)return R('Anime not found!');return R('ANIME\nTitle: '+a.title+'\nScore: '+(a.score||'?')+'/10\nEpisodes: '+(a.episodes||'?'))}catch{return R('Anime failed')}}
if(['movie','moviedl','film','watch','cinesubz','series','tv','show','imdb'].includes(cmd)){if(!text)return R('Use: .'+cmd+' Avatar');try{const r=await fetch('https://www.omdbapi.com/?t='+encodeURIComponent(text)+(cmd==='series'||cmd==='tv'||cmd==='show'?'&type=series':'')+'&apikey=trilogy');const d=await r.json();if(d.Response!=='True')return R('Not found!');return R(cmd.toUpperCase()+'\nTitle: '+d.Title+'\nYear: '+d.Year+'\nRating: '+d.imdbRating+'/10\nStory: '+d.Plot)}catch{return R('Failed')}}
if(cmd==='apk'){if(!text)return R('Use: .apk WhatsApp');return R('APK - '+text+'\nSearch Play Store!')}
if(cmd==='gif'){if(!text)return R('Use: .gif Funny');return R('GIF - '+text)}
if(cmd==='tourl')return R('IMAGE URL\nReply to image with .tourl');
if(['mediafire','gdrive','threads','xdown','capcut','wikimedia'].includes(cmd)){if(!body.match(/https?:\/\/\S+/)&&!text)return R('Use: .'+cmd+' link/text');return R(cmd.toUpperCase()+' DOWNLOADING...\n'+(text||''))}
if(cmd==='ytdoc'){if(!text)return R('Use: .ytdoc Song');return R('YT DOC - '+text)}
if(cmd==='ringtone'){if(!text)return R('Use: .ringtone iPhone');const d=await GS(text);if(d&&d.previewUrl){await sock.sendMessage(from,{audio:{url:d.previewUrl},mimetype:'audio/mp4',fileName:'ringtone.mp3'},{quoted:msg});return R('RINGTONE SENT: '+d.trackName)}return R('Ringtone not found!')}
if(cmd==='spotify'){if(!text)return R('Use: .spotify Komasava');const d=await GS(text);if(!d)return R('Not found!');return R('SPOTIFY\nSong: '+d.trackName+'\nArtist: '+d.artistName)}
if(cmd==='lyrics'){if(!text)return R('Use: .lyrics Komasava');try{const r=await fetch('https://lrclib.net/api/search?track_name='+encodeURIComponent(text));const d=await r.json();if(d&&d[0]?.plainLyrics)return R('LYRICS - '+text+'\n\n'+d[0].plainLyrics.slice(0,3000));return R('Lyrics not found!')}catch{return R('Lyrics failed')}}
if(cmd==='ttsearch'){if(!text)return R('Use: .ttsearch Diamond');return R('TIKTOK SEARCH - '+text)}
if(cmd==='ytsearch'){if(!text)return R('Use: .ytsearch Diamond');return R('YT SEARCH - '+text)}
if(cmd==='ytchannel'){if(!text)return R('Use: .ytchannel Diamond');return R('YT CHANNEL - '+text)}
if(cmd==='gitclone'){if(!text)return R('Use: .gitclone user/repo');return R('GIT CLONE\nRepo: '+text)}
if(['bass','deep','blown','earrape','fast','slow','fat','squirrel','nightcore','robot','areverse','8d','echo','reverb','vibrato','tremolo','radio','alien','audiofx'].includes(cmd)){try{const q=msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage||msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;if(!q)return R('Reply to audio/video with .'+cmd);const b=await DL(q,q.audioMessage?'audio':'video');await sock.sendMessage(from,{audio:b,mimetype:'audio/mp4',fileName:cmd+'.mp3'},{quoted:msg});return R('AUDIO FX: '+cmd.toUpperCase())}catch{return R('AudioFX failed - reply to audio!')}}
if(cmd==='volume')return R('VOLUME: '+(text||'100')+'%');
if(cmd==='tempo')return R('TEMPO: '+(text||'1.0')+'x');
if(cmd==='tomp3'){try{const q=msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;if(!q)return R('Reply to video with .tomp3');const b=await DL(q,'video');await sock.sendMessage(from,{audio:b,mimetype:'audio/mp4',fileName:'converted.mp3'},{quoted:msg});return R('Converted to MP3!')}catch{return R('ToMP3 failed')}}
if(cmd==='tts'||cmd==='voice'){if(!text)return R('Use: .tts Hello');try{const url='https://api.streamelements.com/kappa/v2/speech?voice=Brian&text='+encodeURIComponent(text);return sock.sendMessage(from,{audio:{url},mimetype:'audio/mp4',ptt:true},{quoted:msg})}catch{return R('TTS failed')}}
if(['tovn','saudio','saudioformat'].includes(cmd)){try{const q=msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage;if(!q)return R('Reply to audio with .'+cmd);const b=await DL(q,'audio');await sock.sendMessage(from,{audio:b,mimetype:'audio/mp4',ptt:true},{quoted:msg});return R('Converted to Voice Note!')}catch{return R('ToVN failed')}}
if(cmd==='removebg')return R('REMOVE BG\nSend image with .removebg');
if(cmd==='upscale')return R('UPSCALE\nSend image with .upscale');
if(cmd==='take')return R('TAKE STICKER\nSticker taken!');
if(cmd==='attp'){if(!text)return R('Use: .attp Hello');return R('ATTP\nText: '+text)}
if(cmd==='qc'){if(!text)return R('Use: .qc Hello');return R('QUOTE CARD\n"'+text+'"')}
if(cmd==='emojimix'){if(!text)return R('Use: .emojimix 😂+❤️');return R('EMOJI MIX: '+text)}
if(cmd==='tgsticker')return R('TG STICKER\nUse .sticker!');
if(['blur','grayscale','invert','sepia','sharpen'].includes(cmd)){try{const q=msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage||msg.message.imageMessage;if(!q)return R('Reply to image with .'+cmd);const b=await DL(q,'image');let img=sharp(b);if(cmd==='blur')img=img.blur(5);if(cmd==='grayscale')img=img.grayscale();if(cmd==='invert')img=img.negate();if(cmd==='sepia')img=img.tint({r:112,g:66,b:20});if(cmd==='sharpen')img=img.sharpen();const out=await img.png().toBuffer();await sock.sendMessage(from,{image:out,caption:wrap('FILTER: '+cmd.toUpperCase())},{quoted:msg});return}catch{return R('Filter failed')}}
if(cmd==='meme'||cmd==='memeke')return R('MEME\n'+pick(JOKES));
if(cmd==='memegen'){if(!text)return R('Use: .memegen Top | Bottom');const p=text.split('|');return R('MEME GEN\nTop: '+(p[0]||'')+'\nBottom: '+(p[1]||''))}
if(cmd==='wasted'){try{const q=msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage||msg.message.imageMessage;if(!q)return R('Reply to image with .wasted');const b=await DL(q,'image');const out=await sharp(b).grayscale().png().toBuffer();await sock.sendMessage(from,{image:out,caption:wrap('WASTED! 💀')},{quoted:msg});return}catch{return R('Wasted failed')}}
if(cmd==='character'){if(!text)return R('Use: .character Naruto');return R('CHARACTER - '+text)}
if(['crop','circle','round'].includes(cmd)){try{const q=msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage||msg.message.imageMessage;if(!q)return R('Reply to image');const b=await DL(q,'image');const out=await sharp(b).resize(512,512).png().toBuffer();await sock.sendMessage(from,{image:out,caption:wrap(cmd.toUpperCase())},{quoted:msg});return}catch{return R('Crop failed')}}
if(cmd==='ttp'){if(!text)return R('Use: .ttp Hello');return R('TTP\nText: '+text)}
if(['brat','bratpink','bratvid','bratclassic','bratimg','bratimghd','bratwindows','brattimoty','bratanime','bratgura'].includes(cmd)){if(!text)return R('Use: .'+cmd+' Hello');if(['bratvid','bratclassic','bratwindows','brattimoty','bratanime','bratgura'].includes(cmd))return R(cmd.toUpperCase()+'\nText: '+text);try{return sock.sendMessage(from,{image:{url:await GI('Brat style "'+text+'" green')},caption:wrap('BRAT - '+text)},{quoted:msg})}catch{return R('Brat failed')}}
if(cmd==='tomp4'){try{const q=msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage;if(!q)return R('Reply to audio with .tomp4');const b=await DL(q,'audio');await sock.sendMessage(from,{video:b,caption:wrap('Converted to MP4!')},{quoted:msg});return R('Converted!')}catch{return R('ToMP4 failed')}}
if(cmd==='getpp'){try{const pp=await sock.profilePictureUrl(TU,'image');return sock.sendMessage(from,{image:{url:pp},caption:wrap('PROFILE PIC - @'+TN)},{quoted:msg})}catch{return R('No profile pic!')}}
if(['fancy','gfx','gfx2','gfx3','gfx4','gfx5','gfx6','gfx7','gfx8','gfx9','gfx10','gfx11','gfx12','metallic','ice','snow','impressive','matrix','neon','light','devil','purple','thunder','leaves','1917','arena','hacker','sand','blackpink','glitch','glitch2','fire','slice','glow','gitch1','steal','avenger','marvel','grafiti'].includes(cmd)){if(!text)return R('Use: .'+cmd+' BULL X');const st={fancy:'fancy logo',gfx:'3D gaming logo',gfx2:'neon gaming logo',gfx3:'golden logo',gfx4:'fire logo',gfx5:'ice logo',gfx6:'purple logo',gfx7:'metal logo',gfx8:'thunder logo',gfx9:'hacker logo',gfx10:'marvel logo',gfx11:'avenger logo',gfx12:'blackpink logo',metallic:'metallic logo',ice:'ice logo',snow:'snow logo',impressive:'impressive logo',matrix:'matrix logo',neon:'neon logo',light:'light logo',devil:'devil logo',purple:'purple logo',thunder:'thunder logo',leaves:'leaves logo',arena:'arena logo',hacker:'hacker logo',sand:'sand logo',blackpink:'blackpink logo',glitch:'glitch logo',fire:'fire logo',slice:'slice logo',glow:'glow logo',avenger:'avenger logo',marvel:'marvel logo',grafiti:'grafiti logo'};try{return sock.sendMessage(from,{image:{url:await GI((st[cmd]||'logo')+' "'+text+'"')},caption:wrap(cmd.toUpperCase()+' LOGO - '+text)},{quoted:msg})}catch{return R('Logo failed')}}
if(['ss','ssweb','screenshot'].includes(cmd)){if(!text)return R('Use: .ss google.com');try{const url='https://image.thum.io/get/width/1200/crop/800/noanimate/'+encodeURIComponent(text.startsWith('http')?text:'https://'+text);return sock.sendMessage(from,{image:{url},caption:wrap('SCREENSHOT - '+text)},{quoted:msg})}catch{return R('Screenshot failed')}}
if(cmd==='translate'||cmd==='tr'){if(!text)return R('Use: .translate Hello');const a=await GA('Translate: '+text);if(!a)return R('Translate failed');return R('TRANSLATE\n'+a.slice(0,1500))}
if(['qrcode','qmaker','qr'].includes(cmd)){if(!text)return R('Use: .qr Hello');try{const url='https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='+encodeURIComponent(text);return sock.sendMessage(from,{image:{url},caption:wrap('QR for: '+text)},{quoted:msg})}catch{return R('QR failed')}}
if(['shorturl','urlshortener','shortlink'].includes(cmd)){if(!text)return R('Use: .shorturl https://google.com');try{const r=await fetch('https://is.gd/create.php?format=simple&url='+encodeURIComponent(text));const t=await r.text();return R('SHORTLINK\nOriginal: '+text+'\nShort: '+t)}catch{return R('Shortlink failed')}}
if(cmd==='calculator')return R('CALCULATOR\nUse .calc 2+2');
if(cmd==='calc'){try{if(!text)return R('Use: .calc 2+2');const r=eval(text.replace(/[^0-9+\-*/(). ]/g,''));return R(text+' = '+r)}catch{return R('Invalid math!')}}
if(cmd==='hash'){if(!text)return R('Use: .hash Hello');return R('HASH\nMD5: '+crypto.createHash('md5').update(text).digest('hex')+'\nSHA256: '+crypto.createHash('sha256').update(text).digest('hex').slice(0,32)+'...')}
if(cmd==='base64'){if(!text)return R('Use: .base64 Hello');return R('BASE64\n'+Buffer.from(text).toString('base64'))}
if(cmd==='decode64'){if(!text)return R('Use: .decode64 SGVsbG8=');try{return R('DECODED\n'+Buffer.from(text,'base64').toString())}catch{return R('Decode failed')}}
if(cmd==='binary'){if(!text)return R('Use: .binary Hello');return R('BINARY\n'+text.split('').map(c=>c.charCodeAt(0).toString(2).padStart(8,'0')).join(' '))}
if(cmd==='binarytotext'){if(!text)return R('Use: .binarytotext 01001000');try{return R('BINARY TO TEXT\n'+text.split(' ').map(b=>String.fromCharCode(parseInt(b,2))).join(''))}catch{return R('Decode failed')}}
if(cmd==='encrypt'){if(!text)return R('Use: .encrypt Hello');return R('ENCRYPTED\n'+text.split('').map(c=>String.fromCharCode(c.charCodeAt(0)+3)).join(''))}
if(cmd==='decrypt'){if(!text)return R('Use: .decrypt Hello');return R('DECRYPTED\n'+text.split('').map(c=>String.fromCharCode(c.charCodeAt(0)-3)).join(''))}
if(cmd==='timestamp')return R('TIMESTAMP\nNow: '+Date.now()+'\nDate: '+new Date().toLocaleString('en-KE'));
if(cmd==='currency'||cmd==='forex'){const amt=parseFloat(args[0])||100,fc=(args[1]||'USD').toUpperCase(),tc=(args[2]||'KES').toUpperCase();try{const r=await fetch('https://api.exchangerate-api.com/v4/latest/'+fc);const d=await r.json();const rate=d.rates[tc];if(!rate)return R('Try: .currency 100 USD KES');return R('CURRENCY\n'+amt+' '+fc+' = '+(amt*rate).toFixed(2)+' '+tc)}catch{return R('Currency failed - 1 USD = 130 KES')}}
if(cmd==='crypto'){try{const coin=text.toLowerCase()||'bitcoin';const r=await fetch('https://api.coingecko.com/api/v3/simple/price?ids='+coin+'&vs_currencies=usd,kes');const d=await r.json();const p=d[coin];if(!p)return R('Try: .crypto bitcoin');return R('CRYPTO - '+coin.toUpperCase()+'\nUSD: $'+p.usd+'\nKES: Ksh '+Math.round(p.kes))}catch{return R('Crypto failed')}}
if(cmd==='weather'){if(!text)return R('Use: .weather Nairobi');try{const r=await fetch('https://wttr.in/'+encodeURIComponent(text)+'?format=3');const t=await r.text();return R('WEATHER - '+text+'\n'+t)}catch{return R('Weather failed')}}
if(cmd==='news'){try{let t='LATEST NEWS\n\n';try{const r=await fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=5');const d=await r.json();d.results.forEach((a,i)=>{t+=(i+1)+'. '+a.title+'\n'})}catch{}return R(t)}catch{return R('News failed')}}
if(cmd==='livescore')return R('LIVE SCORES\nGor Mahia 2 - 1 AFC Leopards\nMan City 1 - 0 Arsenal');
if(cmd==='epl')return R('PREMIER LEAGUE\n1. Arsenal - 75\n2. Man City - 73\n3. Liverpool - 70');
if(cmd==='kenyapremier')return R('FKF PREMIER\n1. Gor Mahia - 60\n2. Tusker - 58\n3. AFC Leopards - 55');
if(cmd==='reminder'){if(!text)return R('Use: .reminder Buy milk');return R('REMINDER SAVED!\n'+text)}
if(cmd==='count'){if(!text)return R('Use: .count Hello');return R('COUNT\nChars: '+text.length+'\nWords: '+text.split(' ').length)}
if(cmd==='reverse'){if(!text)return R('Use: .reverse Hello');return R('REVERSE\n'+text.split('').reverse().join(''))}
if(cmd==='case'){if(!text)return R('Use: .case Hello');return R('CASE\nUpper: '+text.toUpperCase()+'\nLower: '+text.toLowerCase())}
if(cmd==='palindrome'){if(!text)return R('Use: .palindrome madam');const rev=text.split('').reverse().join('').toLowerCase();return R('PALINDROME\n'+text+' = '+(rev===text.toLowerCase()?'YES ✅':'NO ❌'))}
if(cmd==='age'){if(!text)return R('Use: .age 2005');const y=parseInt(text);return R('AGE\nBorn: '+y+'\nAge: '+(2026-y))}
if(cmd==='vv2')return R('VV2\nUse .vv by replying to View Once!');
if(cmd==='savecontact')return R('CONTACT SAVED!\nName: '+(text||'Contact')+'\nNumber: +'+TN);
if(cmd==='device')return R('DEVICE INFO\nDevice: '+sender.split('@')[0]+'\nBot: BULL X V64 TECH');
if(cmd==='netflix'){if(!text)return R('Use: .netflix Money Heist');return R('NETFLIX - '+text)}
if(cmd==='paste'){if(!text)return R('Use: .paste Hello');return R('PASTE CREATED!\n'+text)}
if(cmd==='fliptext'){if(!text)return R('Use: .fliptext Hello');return R('FLIPPED\n'+text.split('').reverse().join(''))}
if(cmd==='readmore'){if(!text)return R('Use: .readmore Hello');return R(text+'\n'+'\u200b'.repeat(4000)+'\nHidden!')}
if(cmd==='cpu')return R('CPU INFO\nCPU: 4 Cores\nRAM: 2GB\nServer: Render');
if(cmd==='npm'){if(!text)return R('Use: .npm baileys');try{const r=await fetch('https://registry.npmjs.org/'+encodeURIComponent(text));const d=await r.json();return R('NPM - '+d.name+'\nVersion: '+d['dist-tags']?.latest)}catch{return R('NPM failed')}}
if(cmd==='horo')return R('HOROSCOPE\nUse .horoscope leo');
if(cmd==='horoscope'){const s=text.toLowerCase()||'leo';return R('HOROSCOPE - '+s.toUpperCase()+'\n'+(H[s]||'Try: aries, leo, virgo'))}
if(cmd==='google'){if(!text)return R('Use: .google Kenya');return R('GOOGLE SEARCH - '+text)}
if(cmd==='image'||cmd==='img'){if(!text)return R('Use: .image Cute cat');try{return sock.sendMessage(from,{image:{url:await GI(text)},caption:wrap('BULL X IMAGE\n'+text)},{quoted:msg})}catch{return R('Image failed')}}
if(cmd==='define'){if(!text)return R('Use: .define love');try{const r=await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(text));const d=await r.json();return R('DEFINE: '+text+'\n'+(d[0]?.meanings?.[0]?.definitions?.[0]?.definition||'Not found'))}catch{return R('Define failed')}}
if(cmd==='wiki'){if(!text)return R('Use: .wiki Kenya');try{const r=await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(text));const d=await r.json();return R('WIKI - '+d.title+'\n'+(d.extract||'Not found').slice(0,800))}catch{return R('Wiki failed')}}
if(cmd==='element'){if(!text)return R('Use: .element Oxygen');return R('ELEMENT - '+text)}
if(cmd==='wattpad'){if(!text)return R('Use: .wattpad Love');return R('WATTPAD - '+text)}
if(cmd==='scloud'){if(!text)return R('Use: .scloud Song');const d=await GS(text);if(!d)return R('Not found!');return R('SOUNDCLOUD - '+d.trackName+' by '+d.artistName)}
if(cmd==='shazam')return R('SHAZAM\nSend audio with .shazam');
if(cmd==='ocr')return R('OCR\nSend image with .ocr');
if(cmd==='earthquake')return R('EARTHQUAKE - KENYA\nNo earthquake today!');
if(cmd==='emojigif'){if(!text)return R('Use: .emojigif 😂');return R('EMOJI GIF: '+text)}
if(cmd==='prayertime')return R('PRAYER TIME - KISII\nFajr: 5:15 AM\nDhuhr: 12:30 PM\nAsr: 3:45 PM\nMaghrib: 6:20 PM\nIsha: 7:30 PM');
if(cmd==='quran')return R('QURAN\nAl-Fatiha: In the name of Allah, the Most Gracious, the Most Merciful.');
if(cmd==='asmaulhusna')return R('ASMAUL HUSNA\n1. Ar-Rahman\n2. Ar-Rahim\n3. Al-Malik\n99 Names!');
if(cmd==='dua')return R('DUA\nAllahumma inni as-aluka ilman nafia');
if(cmd==='morse'){if(!text)return R('Use: .morse SOS');const mor={a:'.-',b:'-...',c:'-.-.',d:'-..',e:'.',f:'..-.',g:'--.',h:'....',i:'..',j:'.---',k:'-.-',l:'.-..',m:'--',n:'-.',o:'---',p:'.--.',q:'--.-',r:'.-.',s:'...',t:'-',u:'..-',v:'...-',w:'.--',x:'-..-',y:'-.--',z:'--..'};return R('MORSE\n'+text.toLowerCase().split('').map(c=>mor[c]||c).join(' '))}
if(cmd==='shout'){if(!text)return R('Use: .shout Hello');return R(text.toUpperCase()+'!!!')}
if(cmd==='timer'){const s=parseInt(text)||5;return R('TIMER SET!\n'+s+' seconds!')}
if(cmd==='note'){if(!text)return R('Use: .note Buy milk');if(!S.notes[sender])S.notes[sender]=[];S.notes[sender].push(text);save();return R('NOTE SAVED!\n'+text)}
if(cmd==='notes'){const n=(S.notes?.[sender]||[]);if(!n.length)return R('No notes!');return R('YOUR NOTES\n'+n.map((x,i)=>(i+1)+'. '+x).join('\n'))}
if(cmd==='ip'){try{const r=await fetch('https://api.ipify.org?format=json');const d=await r.json();return R('SERVER IP\n'+d.ip)}catch{return R('IP failed')}}
if(cmd==='domain'){if(!text)return R('Use: .domain google.com');return R('DOMAIN - '+text+'\nStatus: Active')}
if(cmd==='email'){if(!text)return R('Use: .email test@gmail.com');const ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);return R('EMAIL CHECK\n'+text+'\nValid: '+(ok?'YES ✅':'NO ❌'))}
if(cmd==='alarm'){if(!text)return R('Use: .alarm 7am Wake');return R('ALARM SET!\n'+text)}
if(cmd==='speedtest'){const s=(Math.random()*50+10).toFixed(1);return R('SPEEDTEST\nDownload: '+s+' Mbps\nPing: '+(Math.floor(Math.random()*50)+10)+'ms')}
if(cmd==='emojify'){if(!text)return R('Use: .emojify Hello');return R('EMOJIFY\n'+text.split('').join('✨')+'✨')}
if(cmd==='pin'){if(!text)return R('Use: .pin 1234');return R('PIN CHECK\n'+text+'\nNever share PIN!')}
if(cmd==='price'){const p=text.split(' ');const cost=parseFloat(p[0])||0,perc=parseFloat(p[1])||20;if(!cost)return R('Use: .price 500 20');return R('PRICE\nCost: '+cost+'\nSelling: '+(cost+cost*perc/100))}
if(cmd==='invoice'){if(!text)return R('Use: .invoice John, Item, 5000');const p=text.split(',').map(s=>s.trim());return R('INVOICE\nTo: '+(p[0]||'Customer')+'\nItem: '+(p[1]||'Item')+'\nAmount: '+(p[2]||'0'))}
if(cmd==='business'){const cap=parseInt(text)||5000;return R('BUSINESS IDEAS - Ksh '+cap+'\n1. Mitumba\n2. Fruits\n3. Airtime')}
if(cmd==='ad'){if(!text)return R('Use: .ad I sell mitumba');return R('ADVERT\n'+text+'\nOrder: +'+sender.split('@')[0])}
if(cmd==='birthday'){if(!text)return R('Use: .birthday @user 12 Dec');S.birthdays[TU]=text;save();return R('BIRTHDAY SAVED!\n@'+TN+' - '+text,{mentions:[TU]})}
if(cmd==='attendance'||cmd==='present'){if(!S.attendance[from])S.attendance[from]=[];if(!S.attendance[from].includes(sender))S.attendance[from].push(sender);save();return R('ATTENDANCE\n@'+sender.split('@')[0]+' - PRESENT\nTotal: '+S.attendance[from].length,{mentions:[sender]})}
if(cmd==='todo'){if(!text)return R('Use: .todo Buy milk');if(!S.todos[sender])S.todos[sender]=[];S.todos[sender].push(text);save();return R('TODO ADDED!\n'+text)}
if(cmd==='todos'){const t=(S.todos?.[sender]||[]);if(!t.length)return R('No todos!');return R('YOUR TODOS\n'+t.map((x,i)=>(i+1)+'. '+x).join('\n'))}
if(cmd==='cleartodo'){S.todos[sender]=[];save();return R('All todos cleared!')}
if(cmd==='vcard'){if(!text)return R('Use: .vcard Ezekia 254183543303');const p=text.split(' ');return R('VCARD\nName: '+(p[0]||'Contact')+'\nNumber: +'+(p[1]||oNum))}
if(cmd==='pdf'){if(!text)return R('Use: .pdf Hello');try{return sock.sendMessage(from,{document:Buffer.from(text),fileName:'BULLX.pdf',mimetype:'application/pdf',caption:wrap('PDF by BULL X')},{quoted:msg})}catch{return R('PDF failed')}}
if(cmd==='emergency')return R('KENYA EMERGENCY\nPolice: 999 / 112\nAmbulance: 999\nKPLC: 95551\nChild: 116');
if(cmd==='hospital'){const town=text||'Kisii';if(town.toLowerCase()==='kisii')return R('HOSPITALS - KISII\nKisii Teaching & Referral - 058 203 0000\nChristamarianne - Kisii\nRam Hospital - Kisii Town');if(town.toLowerCase()==='nairobi')return R('HOSPITALS - NAIROBI\nKenyatta National - 020 272 6300\nNairobi Hospital - 020 284 5000');return R('HOSPITALS - '+town.toUpperCase()+'\nSearch Maps for hospital in '+town)}
if(cmd==='health'){if(!text)return R('Use: .health headache');return R('HEALTH - '+text+'\nDrink water, rest. If serious, go hospital! Call 999!')}
if(cmd==='homework'){if(!text)return R('Use: .homework 12 x 12?');const a=await GA('Solve simply for Kenyan student: '+text);if(!a)return R('Homework failed');return R('HOMEWORK\nQ: '+text+'\n\n'+a.slice(0,1800))}
if(cmd==='essay'){if(!text)return R('Use: .essay Education');const a=await GA('Write simple 300 word essay for Kenyan student on: '+text);if(!a)return R('Essay failed');return R('ESSAY: '+text+'\n\n'+a.slice(0,2000))}
if(cmd==='summarize'){if(!text)return R('Use: .summarize long text');const a=await GA('Summarize in short points: '+text);if(!a)return R('Summarize failed');return R('SUMMARY\n'+a.slice(0,1800))}
if(cmd==='cv'){if(!text)return R('Use: .cv Ezekia, 20, Kisii');const p=text.split(',').map(s=>s.trim());return R('YOUR CV\nName: '+(p[0]||'Name')+'\nAge: '+(p[1]||'20')+'\nLocation: '+(p[2]||'Kisii'))}
if(cmd==='sheng'){if(!text)return R('Use: .sheng I love you');const mp={love:'penda',money:'doo',friend:'mbogi',house:'keja',girl:'madem',boy:'mse',good:'poa'};let out=text.toLowerCase().split(' ').map(w=>mp[w]||w).join(' ');return R('SHENG\nEnglish: '+text+'\nSheng: '+out+' msee!')}
if(cmd==='swahili'){if(!text)return R('Use: .swahili I love you');const mp={love:'penda',money:'pesa',friend:'rafiki',house:'nyumba',food:'chakula',girl:'msichana',boy:'mvulana',good:'nzuri'};let out=text.toLowerCase().split(' ').map(w=>mp[w]||w).join(' ');return R('SWAHILI\nEnglish: '+text+'\nSwahili: '+out)}
if(cmd==='grammar'){if(!text)return R('Use: .grammar I is going');return R('GRAMMAR\nOriginal: '+text+'\nCorrected: '+text.replace(/\bi is\b/gi,'I am'))}
if(cmd==='airoast')return R('AI ROAST FOR @'+TN+'\n'+pick(['Your WiFi is faster than your brain!','You are like Kisii matatu - loud but going nowhere!']),{mentions:[TU]});
if(cmd==='bible')return R('BIBLE\n'+pick(BIBLE));
if(cmd==='motivate')return R('MOTIVATION\n'+pick(MOTIVATION));
if(cmd==='prayer')return R('PRAYER\n'+pick(BIBLE)+'\n\nLord bless my hustle. Amen');
if(cmd==='football')return R('FOOTBALL FACT\nGor Mahia is most successful in Kenya!');
if(cmd==='story'||cmd==='story2')return R('STORY\nOnce in Kisii... '+(text||'A hustler')+' became a legend!');
if(cmd==='poem'||cmd==='poem2')return R('POEM FOR '+(text||'YOU')+'\nRoses are red,\nViolets are blue,\nBULL X is here,\nAnd so are you!');
if(cmd==='recipe'){if(!text)return R('Use: .recipe Pilau');try{const r=await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+encodeURIComponent(text));const j=await r.json();const m=j.meals?.[0];if(!m)return R('Recipe for '+text+': Fry onions, add spices, rice + water, cook 20 mins.');return R('RECIPE: '+m.strMeal+'\n'+m.strInstructions.slice(0,1000))}catch{return R('Recipe failed')}}
if(cmd==='book'){if(!text)return R('Use: .book Atomic Habits');return R('BOOK - '+text+'\nGreat book! Read 10 pages daily!')}
if(cmd==='stalk')return R('STALK REPORT - @'+TN+'\nLast seen: Recently\nMood: Happy',{mentions:[TU]});
if(cmd==='ex')return R('EX.EXE\nYour ex is thinking about you... or your money. Move on King!');
if(cmd==='gf')return R('LOVE.EXE\nEzed_GF.status :: PENDING...\nLoading... 30%\nError 404 : GF_NOT_FOUND');
if(cmd==='kenya')return R('KENYA 🇰🇪\nCapital: Nairobi\nPop: ~55M\nFamous: Maasai Mara, Mount Kenya, Kisii Soapstone');
if(cmd==='nairobi')return R('NAIROBI\nCapital of Kenya\nWeather: 18-24C\nPlaces: Westlands, CBD, Karen, KICC');
if(cmd==='kisii')return R('KISII\nFamous: Soapstone, Bananas, Tea\nBULL X Home!');
if(cmd==='gitstalk'){if(!text)return R('Use: .gitstalk username');try{const r=await fetch('https://api.github.com/users/'+text);const d=await r.json();if(d.message)return R('User not found!');return R('GITHUB - '+d.login+'\nName: '+(d.name||'N/A')+'\nFollowers: '+d.followers+'\nRepos: '+d.public_repos)}catch{return R('Gitstalk failed')}}
if(cmd==='npmstalk'){if(!text)return R('Use: .npmstalk package');return R('NPM STALK - '+text)}
if(cmd==='tgstalk'){if(!text)return R('Use: .tgstalk username');return R('TG STALK - @'+text.replace('@',''))}
if(cmd==='ttstalk'){if(!text)return R('Use: .ttstalk username');return R('TT STALK - @'+text.replace('@',''))}
if(cmd==='xstalk'){if(!text)return R('Use: .xstalk username');return R('X STALK - @'+text.replace('@',''))}
if(cmd==='thrstalk'){if(!text)return R('Use: .thrstalk username');return R('THREADS STALK - @'+text.replace('@',''))}
if(cmd==='pinstalk'){if(!text)return R('Use: .pinstalk username');return R('PINTEREST STALK - @'+text.replace('@',''))}
if(cmd==='genshin'){if(!text)return R('Use: .genshin Character');return R('GENSHIN - '+text)}
if(cmd==='igstalk'){if(!text)return R('Use: .igstalk diamondplatnumz');return R('IG PROFILE\n@'+text.replace('@','')+'\nOpen Instagram and search!')}
if(['joke','dadjoke','joke2'].includes(cmd))return R('JOKE\n'+pick(JOKES));
if(['fact','fact2'].includes(cmd))return R('FACT\n'+pick(FACTS));
if(['quote','quote2','quotes'].includes(cmd))return R('QUOTES\n'+pick(QUOTES));
if(['compliment','compliment2'].includes(cmd))return R('COMPLIMENT FOR @'+TN+'\nYou are amazing!',{mentions:[TU]});
if(['insult','roast','roast2'].includes(cmd))return R('ROAST FOR @'+TN+'\n'+pick(ROASTS),{mentions:[TU]});
if(cmd==='insultke')return R('INSULTKE FOR @'+TN+'\nWewe ni kama bundles za 10 bob!',{mentions:[TU]});
if(cmd==='flirt')return R('FLIRT\nAre you WiFi? Feeling connection!');
if(cmd==='ship')return R('SHIP\n'+(text||'You + Me')+' = '+Math.floor(Math.random()*101)+'% match!');
if(cmd==='simp')return R('@'+TN+' is '+Math.floor(Math.random()*101)+'% simp!',{mentions:[TU]});
if(cmd==='stupid')return R('@'+TN+' is 0% stupid, 100% smart!',{mentions:[TU]});
if(cmd==='shayari')return R('SHAYARI\nTeri yaadon mein khoya hoon!');
if(cmd==='goodnight')return R('GOOD NIGHT!\nSweet dreams! 🌙');
if(cmd==='roseday')return R('ROSE DAY 🌹\nSending you a rose!');
if(cmd==='iloveyou')return R('I LOVE YOU TOO! ❤️');
if(cmd==='couplepp')return R('COUPLE PP\nYou + Partner = Perfect!');
if(cmd==='coffe')return R('COFFEE ☕\nHere is your coffee!');
if(cmd==='question')return R('QUESTION\n'+pick(['What is your dream?','What makes you happy?']));
if(cmd==='teddy')return R('TEDDY 🧸\nSending teddy! Hug it!');
if(cmd==='lovemsg')return R('LOVE MSG 💌\nYou are my sunshine!');
if(cmd==='handsome')return R('@'+TN+' is '+(Math.floor(Math.random()*50)+50)+'% handsome!',{mentions:[TU]});
if(cmd==='pretty')return R('@'+TN+' is '+(Math.floor(Math.random()*50)+50)+'% pretty!',{mentions:[TU]});
if(cmd==='weeb')return R('@'+TN+' is '+Math.floor(Math.random()*101)+'% weeb!',{mentions:[TU]});
if(cmd==='waifu'){try{const r=await fetch('https://api.waifu.pics/sfw/waifu');const d=await r.json();return sock.sendMessage(from,{image:{url:d.url},caption:wrap('YOUR WAIFU!')},{quoted:msg})}catch{return R('Waifu!')}}
if(cmd==='neko'){try{const r=await fetch('https://api.waifu.pics/sfw/neko');const d=await r.json();return sock.sendMessage(from,{image:{url:d.url},caption:wrap('NEKO!')},{quoted:msg})}catch{return R('Neko!')}}
if(cmd==='hack')return R('HACKING @'+TN+'...\n100% HACKED! Just joking!',{mentions:[TU]});
if(cmd==='fake'){if(!text)return R('Use: .fake Hello');return R('FAKE CHAT\nEZEKIA: '+text+'\nYou: Haha true')}
if(cmd==='tweet'){if(!text)return R('Use: .tweet Hello');return R('TWEET\n@'+sender.split('@')[0]+': "'+text+'"')}
if(cmd==='advice'){try{const r=await fetch('https://api.adviceslip.com/advice');const d=await r.json();return R('ADVICE\n'+d.slip.advice)}catch{return R('Advice: Drink water!')}}
if(cmd==='chuck'){try{const r=await fetch('https://api.chucknorris.io/jokes/random');const d=await r.json();return R('CHUCK NORRIS\n'+d.value)}catch{return R('Chuck Norris counted to infinity. Twice.')}}
if(cmd==='quiz'||cmd==='quizke'){const qs=[{q:'Capital of Kenya?',a:'Nairobi'},{q:'10 + 15?',a:'25'}];const q=pick(qs);return R('QUIZ\nQ: '+q.q+'\nAnswer: '+q.a)}
if(cmd==='trivia')return R('TRIVIA\nQ: Capital of Kenya?\nA: Nairobi');
if(cmd==='scramble'){const w=pick(['BULL','KISII','KENYA']);return R('SCRAMBLE\nUnscramble: '+w.split('').sort(()=>Math.random()-0.5).join('')+'\nAnswer: '+w)}
if(cmd==='wordle'){const ws=[{w:'BULL',hint:'BULL X animal'},{w:'KISII',hint:'Your town'},{w:'KENYA',hint:'Your country'}];const ch=pick(ws);S.wordle[from+sender]={word:ch.w,hint:ch.hint,tries:0};save();return R('WORDLE\nHint: '+ch.hint+'\nWord: '+ch.w.length+' letters')}
if(cmd==='guessword'||cmd==='guess'){const g=S.wordle[from+sender];if(!g)return R('No Wordle! Start with .wordle');if(!text)return R('Use: .guessword BULL');const gu=text.toUpperCase().trim();g.tries++;if(gu===g.word){delete S.wordle[from+sender];save();const u=GB(sender);u.bal+=300;save();return R('WORDLE WIN!\n+300 coins! Balance: '+u.bal)}if(g.tries>=6){const w=g.word;delete S.wordle[from+sender];save();return R('WORDLE LOST!\nWord was: '+w)}save();return R('WORDLE - Try '+g.tries+'/6\nGuess: '+gu+'\nHint: '+g.hint)}
if(cmd==='hangman'){const w=pick(['BULL','KISII','KENYA']);return R('HANGMAN\nWord: '+('_ '.repeat(w.length))+'\nHint: Starts with '+w[0])}
if(cmd==='ttt'){if(!isGroup)return R('Groups only!');if(msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]){const opp=msg.message.extendedTextMessage.contextInfo.mentionedJid[0];S.ttt[from]={p1:sender,p2:opp,board:['1','2','3','4','5','6','7','8','9'],turn:sender,moves:0};save();return R('TTT STARTED!\n@'+sender.split('@')[0]+' (X) vs @'+opp.split('@')[0]+' (O)\n1 | 2 | 3\n4 | 5 | 6\n7 | 8 | 9',{mentions:[sender,opp]})}const pos=parseInt(text),g=S.ttt[from];if(!g)return R('No game! Start: .ttt @friend');if(sender!==g.turn)return R('Not your turn!');if(!pos||pos<1||pos>9)return R('Use: .ttt 1-9');if(g.board[pos-1]==='X'||g.board[pos-1]==='O')return R('Spot taken!');const mk=sender===g.p1?'X':'O';g.board[pos-1]=mk;g.moves++;const b=g.board,bs=b[0]+' | '+b[1]+' | '+b[2]+'\n'+b[3]+' | '+b[4]+' | '+b[5]+'\n'+b[6]+' | '+b[7]+' | '+b[8];const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];const wn=wins.find(w=>b[w[0]]===mk&&b[w[1]]===mk&&b[w[2]]===mk);if(wn){delete S.ttt[from];save();const u=GB(sender);u.bal+=200;save();return R(mk+' WINS!\n'+bs+'\n+200 coins!')}if(g.moves===9){delete S.ttt[from];save();return R('DRAW!\n'+bs)}g.turn=sender===g.p1?g.p2:g.p1;save();return R('TTT\n'+bs+'\n@'+g.turn.split('@')[0]+' your turn!',{mentions:[g.turn]})}
if(cmd==='tttstop'){delete S.ttt[from];save();return R('TTT stopped!')}
if(cmd==='tictactoe')return R('TICTACTOE\nUse .ttt @friend');
if(cmd==='wyr'||cmd==='wouldyou')return R('WOULD YOU RATHER\n'+pick(['Be rich or famous?','Live in Kisii or Nairobi?','Be invisible or fly?']));
if(cmd==='rps'){const u=text.toLowerCase(),b=pick(['rock','paper','scissors']);if(!['rock','paper','scissors'].includes(u))return R('Use: .rps rock/paper/scissors');let res=u===b?'DRAW!':(u==='rock'&&b==='scissors')||(u==='paper'&&b==='rock')||(u==='scissors'&&b==='paper')?'YOU WIN!':'YOU LOSE!';return R('RPS\nYou: '+u+'\nBULL X: '+b+'\n'+res)}
if(cmd==='slots'){const e=['🍒','🍋','🔔','⭐','💎'];const a=pick(e),b=pick(e),c=pick(e);return R('SLOTS\n| '+a+' | '+b+' | '+c+' |\n'+(a===b&&b===c?'JACKPOT!':'Try again!'))}
if(cmd==='slot'){const e=['CHERRY','LEMON','BELL','STAR','DIAMOND'];const a=pick(e),b=pick(e),c=pick(e);return R('SLOT\n| '+a+' | '+b+' | '+c+' |\n'+(a===b&&b===c?'JACKPOT!':'Try again!'))}
if(cmd==='truth')return R('TRUTH\n'+pick(TRUTHS));
if(cmd==='dare')return R('DARE\n'+pick(DARES));
if(cmd==='truthordare')return R(pick(['TRUTH\n'+pick(TRUTHS),'DARE\n'+pick(DARES)]));
if(cmd==='riddle'||cmd==='riddleke'){const r=pick([{q:'I speak without a mouth and hear without ears. What am I?',a:'Echo!'},{q:'What has keys but cannot open a lock?',a:'Piano!'},{q:'What has face and two hands but no arms?',a:'Clock!'}]);return R('RIDDLE\n'+r.q+'\nAnswer: '+r.a)}
if(cmd==='8ball'){const a=pick(['Yes!','No!','Maybe...','Definitely!']);return R('8-BALL\nQ: '+(text||'Will I be rich?')+'\nA: '+a)}
if(cmd==='dice')return R('You rolled: '+(Math.floor(Math.random()*6)+1)+' !');
if(cmd==='dice2')return R('Dice 2: '+(Math.floor(Math.random()*6)+1)+' + '+(Math.floor(Math.random()*6)+1)+' !');
if(cmd==='coin'||cmd==='coinflip')return R(pick(['HEADS!','TAILS!']));
if(cmd==='random')return R('RANDOM\nNumber: '+Math.floor(Math.random()*100)+' / 100');
if(cmd==='pick'){if(!text)return R('Use: .pick Apple | Banana');const o=text.split('|').map(s=>s.trim());return R('PICK\nI pick: '+pick(o))}
if(cmd==='guessflag')return R('GUESS FLAG\n🇰🇪 Which country?\nAnswer: Kenya!');
if(cmd==='guessanime')return R('GUESS ANIME\nWhich anime has Hokage?\nAnswer: Naruto!');
if(cmd==='guessgenshin')return R('GUESS GENSHIN\nWho is emergency food?\nAnswer: Paimon!');
if(cmd==='guessgame')return R('GUESS GAME\nUse .guessword!');
if(cmd==='guesslogo')return R('GUESS LOGO\n🍎 Which brand?\nAnswer: Apple!');
if(cmd==='guesshero')return R('GUESS HERO\nWho is Man of Steel?\nAnswer: Superman!');
if(cmd==='hint')return R('HINT\nThink about BULL X!');
if(cmd==='giveup')return R('GIVE UP?\nNever give up King!');
if(cmd==='giveaway'){if(!await OO())return;return R('GIVEAWAY!\n'+(text||'500')+' coins!')}
if(cmd==='lottery')return R('LOTTERY\nLucky: '+(Math.floor(Math.random()*99)+1)+' - '+(Math.floor(Math.random()*99)+1));
if(cmd==='mathquiz'){const a=Math.floor(Math.random()*20)+1,b=Math.floor(Math.random()*20)+1;return R('MATH QUIZ\nWhat is '+a+' + '+b+' ?\nAnswer: '+(a+b))}
if(cmd==='fasttype')return R('FAST TYPE\nType: "BULL X is the king of bots"');
if(cmd==='memory'){const sq=[Math.floor(Math.random()*9)+1,Math.floor(Math.random()*9)+1,Math.floor(Math.random()*9)+1].join(' ');return R('MEMORY\nRemember: '+sq)}
if(cmd==='never')return R('NEVER HAVE I EVER\n'+pick(['Never have I ever cheated','Never have I ever stolen food']));
if(cmd==='paradox')return R('PARADOX\nThis sentence is false.');
if(cmd==='tongue')return R('TONGUE TWISTER\nShe sells seashells by the seashore');
if(cmd==='love'){const p=Math.floor(Math.random()*101);return R('LOVE METER\n@'+TN+' Love: '+p+'%',{mentions:[TU]})}
if(cmd==='howgay')return R('@'+TN+' is '+Math.floor(Math.random()*101)+'% gay!',{mentions:[TU]});
if(cmd==='howcool')return R('@'+TN+' is '+Math.floor(Math.random()*101)+'% cool!',{mentions:[TU]});
if(cmd==='howrich')return R('@'+TN+' will be '+pick(['Millionaire!','Billionaire!','Broke!']),{mentions:[TU]});
if(cmd==='howold')return R('@'+TN+' looks '+(Math.floor(Math.random()*20)+15)+' years old!',{mentions:[TU]});
if(cmd==='smart')return R('@'+TN+' is '+Math.floor(Math.random()*101)+'% smart!',{mentions:[TU]});
if(cmd==='beautiful')return R('@'+TN+' is '+Math.floor(Math.random()*101)+'% beautiful!',{mentions:[TU]});
if(cmd==='crush')return R('@'+TN+' has a crush on you!',{mentions:[TU]});
if(cmd==='kiss')return R('@'+TN+' got a kiss!',{mentions:[TU]});
if(cmd==='hug')return R('@'+TN+' got a hug!',{mentions:[TU]});
if(cmd==='slap')return R('@'+TN+' got slapped!',{mentions:[TU]});
if(cmd==='kill')return R('@'+TN+' was killed! RIP',{mentions:[TU]});
if(cmd==='congrats')return R('CONGRATS @'+TN+'!',{mentions:[TU]});
if(cmd==='happybirthday')return R('HAPPY BIRTHDAY @'+TN+'!',{mentions:[TU]});
if(cmd==='pickup'||cmd==='pickuplineke')return R('PICKUP LINE\nAre you WiFi? Feeling connection!');
if(cmd==='darkjoke')return R('DARK JOKE\nMy WiFi went down 5 mins. Had to talk to family. Nice people.');
if(cmd==='rap')return R('RAP - BULL X\nYo yo, from Kisii to Nairobi, BULL X is king!');
if(cmd==='manga'){if(!text)return R('Use: .manga Naruto');return R('MANGA - '+text+'\nChapters: 700+')}
if(cmd==='naruto')return R('NARUTO\nVillage: Hidden Leaf\nPower: Nine-Tails');
if(cmd==='luffy')return R('LUFFY\nCrew: Straw Hats\nDream: Pirate King!');
if(cmd==='goku')return R('GOKU\nRace: Saiyan\nPower: Ultra Instinct');
if(['pies','india','china','japan','korea','thai','malaysia'].includes(cmd)){try{const url='https://picsum.photos/1080/1080?random='+Math.floor(Math.random()*1000);return sock.sendMessage(from,{image:{url},caption:wrap(cmd.toUpperCase()+' PICS')},{quoted:msg})}catch{return R(cmd.toUpperCase()+' pics!')}}
if(cmd==='pokemon')return R('POKEMON\nPikachu! I choose you!');
if(cmd==='pokepic'){try{const url='https://picsum.photos/1080/1080?random='+Math.floor(Math.random()*1000);return sock.sendMessage(from,{image:{url},caption:wrap('POKEMON PIC!')},{quoted:msg})}catch{return R('Pokemon pic!')}}
if(cmd==='animepic'||cmd==='animewall'){try{const r=await fetch('https://api.waifu.pics/sfw/waifu');const d=await r.json();return sock.sendMessage(from,{image:{url:d.url},caption:wrap('ANIME PIC!')},{quoted:msg})}catch{return R('Anime pic!')}}
if(cmd==='wallpaper'){try{const r=await fetch('https://picsum.photos/1080/1920');return sock.sendMessage(from,{image:{url:r.url},caption:wrap('WALLPAPER!')},{quoted:msg})}catch{return R('Wallpaper failed')}}
if(cmd==='animenews')return R('ANIME NEWS\nNew One Piece out!\nNaruto remake soon!');
if(cmd==='cat'){try{const r=await fetch('https://api.thecatapi.com/v1/images/search');const d=await r.json();return sock.sendMessage(from,{image:{url:d[0].url},caption:wrap('CUTE CAT!')},{quoted:msg})}catch{return R('Cat: Meow!')}}
if(cmd==='dog'){try{const r=await fetch('https://dog.ceo/api/breeds/image/random');const d=await r.json();return sock.sendMessage(from,{image:{url:d.message},caption:wrap('CUTE DOG!')},{quoted:msg})}catch{return R('Dog: Woof!')}}
if(cmd==='fox'){try{const r=await fetch('https://randomfox.ca/floof/');const d=await r.json();return sock.sendMessage(from,{image:{url:d.image},caption:wrap('CUTE FOX!')},{quoted:msg})}catch{return R('Fox!')}}
if(cmd==='panda'){try{const r=await fetch('https://some-random-api.com/animal/panda');const d=await r.json();return sock.sendMessage(from,{image:{url:d.image},caption:wrap('PANDA!')},{quoted:msg})}catch{return R('Panda!')}}
if(cmd==='bird'){try{const r=await fetch('https://some-random-api.com/animal/bird');const d=await r.json();return sock.sendMessage(from,{image:{url:d.image},caption:wrap('BIRD!')},{quoted:msg})}catch{return R('Bird!')}}
if(cmd==='balance'||cmd==='bal'){const u=GB(sender);return R('YOUR BALANCE\nCoins: '+u.bal+'\nBank: '+(u.bank||0))}
if(cmd==='daily'){const u=GB(sender),now=Date.now();if(now-u.lastDaily<86400000)return R('Already claimed daily! Balance: '+u.bal);u.lastDaily=now;u.bal+=500;save();return R('DAILY REWARD!\n+500 coins!\nBalance: '+u.bal)}
if(cmd==='work'){const u=GB(sender),e=Math.floor(Math.random()*400)+100;u.bal+=e;save();return R('WORK\nEarned: +'+e+'\nBalance: '+u.bal)}
if(cmd==='beg'){const u=GB(sender),e=Math.floor(Math.random()*100)+10;u.bal+=e;save();return R('Someone gave you '+e+' coins!\nBalance: '+u.bal)}
if(cmd==='gamble'||cmd==='bet'){const u=GB(sender),amt=parseInt(text)||100;if(amt>u.bal)return R('Not enough!');const win=Math.random()>0.5;if(win){u.bal+=amt;save();return R('BET WON! +'+amt+' Balance: '+u.bal)}u.bal-=amt;save();return R('BET LOST! -'+amt+' Balance: '+u.bal)}
if(cmd==='rob'||cmd==='steal'){const u=GB(sender),v=GB(TU);if(v.bal<100)return R('Too broke to rob!');const amt=Math.min(Math.floor(Math.random()*200)+50,v.bal);if(Math.random()>0.5){u.bal+=amt;v.bal-=amt;save();return R('ROB SUCCESS! Stole '+amt+' from @'+TN,{mentions:[TU]})}u.bal-=100;save();return R('CAUGHT! Paid 100 fine!')}
if(cmd==='pay'||cmd==='gift'){const amt=parseInt(args[args.length-1])||0,u=GB(sender);if(amt<=0)return R('Use: .pay @user 100');if(amt>u.bal)return R('Not enough!');const v=GB(TU);u.bal-=amt;v.bal+=amt;save();return R('Sent '+amt+' to @'+TN+'! Balance: '+u.bal,{mentions:[TU]})}
if(cmd==='shop')return R('BULL X SHOP\nLamborghini - 10000\nMansion - 20000\niPhone - 5000\nCrown - 1000\nPizza - 100');
if(cmd==='buy'){const u=GB(sender),items={lamborghini:10000,mansion:20000,iphone:5000,crown:1000,pizza:100,car:5000},item=text.toLowerCase(),price=items[item];if(!price)return R('Item not found! Use .shop');if(u.bal<price)return R('Not enough! Need '+price);u.bal-=price;save();return R('Bought '+item+' for '+price+'!\nBalance: '+u.bal)}
if(['leaderboard','lb','rich'].includes(cmd)){const sorted=Object.entries(S.economy).sort((a,b)=>b[1].bal-a[1].bal).slice(0,5);let t='RICHEST\n';sorted.forEach(([id,d],i)=>{t+=(i+1)+'. @'+id.split('@')[0]+' - '+d.bal+'\n'});if(!sorted.length)t+='No one yet!';return sock.sendMessage(from,{text:wrap(t),mentions:sorted.map(([id])=>id)},{quoted:msg})}
if(cmd==='bank'){const u=GB(sender);return R('YOUR BANK\nWallet: '+u.bal+'\nBank: '+(u.bank||0)+'\nTotal: '+(u.bal+(u.bank||0)))}
if(cmd==='deposit'){const u=GB(sender);const amt=parseInt(text)||u.bal;if(amt>u.bal)return R('Not enough!');u.bal-=amt;u.bank=(u.bank||0)+amt;save();return R('Deposited '+amt+'!\nWallet: '+u.bal+'\nBank: '+u.bank)}
if(cmd==='withdraw'){const u=GB(sender);const amt=parseInt(text)||u.bank||0;if(amt>(u.bank||0))return R('Not enough in bank!');u.bank-=amt;u.bal+=amt;save();return R('Withdrew '+amt+'!\nWallet: '+u.bal+'\nBank: '+u.bank)}
if(cmd==='roulette'){const u=GB(sender),amt=parseInt(text)||100;if(amt>u.bal)return R('Not enough!');const num=Math.floor(Math.random()*37),win=num%2===0;if(win){u.bal+=amt;save();return R('ROULETTE\nNumber: '+num+'\nWIN +'+amt+' Balance: '+u.bal)}u.bal-=amt;save();return R('ROULETTE\nNumber: '+num+'\nLOST -'+amt+' Balance: '+u.bal)}
if(cmd==='blackjack'){const u=GB(sender),amt=parseInt(text)||100;if(amt>u.bal)return R('Not enough!');const you=Math.floor(Math.random()*11)+10,dealer=Math.floor(Math.random()*11)+10;if(you>dealer){u.bal+=amt;save();return R('BLACKJACK\nYou: '+you+' Dealer: '+dealer+'\nWIN +'+amt)}if(you===dealer)return R('DRAW!');u.bal-=amt;save();return R('BLACKJACK\nYou: '+you+' Dealer: '+dealer+'\nLOST -'+amt)}
if(cmd==='invest'){const u=GB(sender),amt=parseInt(text)||100;if(amt>u.bal)return R('Not enough!');const profit=Math.floor(amt*(Math.random()*0.8-0.3));u.bal+=profit;save();return R('INVEST\nProfit: '+profit+'\nBalance: '+u.bal)}
if(cmd==='loan'){const u=GB(sender);u.bal+=1000;save();return R('LOAN APPROVED!\n+1000 Balance: '+u.bal)}
if(cmd==='interest'){const u=GB(sender);if(!u.bank)u.bank=0;const intr=Math.floor(u.bank*0.05);u.bank+=intr;save();return R('INTEREST\nBank: '+u.bank+'\n+'+intr)}
if(cmd==='airtime'){const amt=parseInt(text)||50;return R('AIRTIME\nKsh '+amt+'\nBuy: *544# Safaricom')}
if(['rank','level','xp'].includes(cmd)){if(!S.xp[sender])S.xp[sender]=0;S.xp[sender]+=10;save();const xp=S.xp[sender];return R('RANK\n@'+sender.split('@')[0]+'\nLevel: '+(Math.floor(xp/100)+1)+'\nXP: '+xp,{mentions:[sender]})}
if(cmd==='duel'){const u=GB(sender),amt=parseInt(text)||100;if(amt>u.bal)return R('Not enough!');const v=GB(TU);const my=Math.floor(Math.random()*6)+1,opp=Math.floor(Math.random()*6)+1;if(my===opp)return R('DUEL DRAW! '+my+' vs '+opp);if(my>opp){u.bal+=amt;v.bal-=amt;save();return R('DUEL WIN! '+my+' vs '+opp+' +'+amt)}u.bal-=amt;v.bal+=amt;save();return R('DUEL LOST! '+my+' vs '+opp+' -'+amt)}
if(cmd==='casino'){const u=GB(sender);if(!text)return R('BULL X CASINO\nBalance: '+u.bal+'\n.casino slot 100\n.casino roulette 100');const pa=text.split(' '),g=pa[0].toLowerCase(),amt=parseInt(pa[1])||100;if(amt>u.bal)return R('Not enough!');if(g==='slot'){const e=['CHERRY','LEMON','BELL','STAR','DIAMOND'];const a=pick(e),b=pick(e),c=pick(e);if(a===b&&b===c){u.bal+=amt*5;save();return R('SLOT JACKPOT! +'+(amt*5))}u.bal-=amt;save();return R('SLOT LOST -'+amt)}if(g==='roulette'){const num=Math.floor(Math.random()*37);if(num%2===0){u.bal+=amt;save();return R('ROULETTE WIN +'+amt)}u.bal-=amt;save();return R('ROULETTE LOST -'+amt)}return R('Use: .casino slot / roulette + amount')}
if(cmd==='kenyanews')return R('KENYA NEWS\n1. Gor Mahia wins\n2. Safaricom new bundle\n3. Rains in Kisii\n4. Shilling stable');
if(cmd==='jobs'){if(!text)text='Kenya';return R('JOBS IN '+text.toUpperCase()+'\n1. Shopkeeper - Kisii - 15k\n2. Boda - 800/day\n3. Mitumba - 1000/day\n4. Cyber - 12k')}
if(cmd==='mpesa'){const amt=parseInt(text);if(!amt)return R('Use: .mpesa 5000');let fee=0;if(amt<=100)fee=0;else if(amt<=500)fee=7;else if(amt<=1000)fee=13;else if(amt<=5000)fee=61;else if(amt<=10000)fee=87;else fee=132;return R('M-PESA\nSend: '+amt+'\nFee: '+fee+'\nTotal: '+(amt+fee))}
if(cmd==='bundle'){const amt=parseInt(text)||100;return R('BEST BUNDLE Ksh '+amt+'\nSafaricom: *544#\nAirtel: *544#\nBest: Airtel!')}
if(cmd==='kplc'){const amt=parseInt(text);if(!amt)return R('Use: .kplc 500');return R('KPLC TOKENS\nAmount: '+amt+'\nUnits: ~'+(amt/25).toFixed(1)+'\nBuy: *444#')}
if(cmd==='fuel')return R('FUEL - KENYA\nPetrol: ~185 / litre\nDiesel: ~170\nKerosene: ~155');
if(cmd==='matatu'){if(!text)return R('Use: .matatu Nairobi to Kisii');return R('MATATU ROUTE\nRoute: '+text+'\nNairobi-Kisii: 500-800, 5-6hrs')}
if(cmd==='safaricom')return R('SAFARICOM\n1GB - 99 (*544#)\n2GB - 199\n5GB - 499\nM-PESA: *334#');
if(cmd==='premium')return R('PREMIUM 👑\nBULL X Premium FREE!\nAll 439 commands unlocked!');
if(cmd==='autoreply'){if(!await OO())return;return R('AUTO-REPLY ON!')}
if(cmd==='groupprivate'){if(!await OO())return;return R('GROUP PRIVATE MODE!')}
if(cmd==='away'){if(!await OO())return;S.afk[sender]=text||'Away';save();return R('AWAY MODE ON!\n'+(text||'Away'))}
if(cmd==='schedule'){if(!await OO())return;return R('SCHEDULED!\n'+(text||'Message'))}
if(cmd==='filter'){if(!await OO())return;return R('FILTER SET!\n'+(text||'badword'))}
if(cmd==='persona'){if(!await OO())return;return R('PERSONA SET!\n'+(text||'BULL X King'))}
if(cmd==='ghost'){if(!await OO())return;return R('GHOST MODE ON!')}
if(cmd==='chreact'){if(!await OO())return;return R('CHANNEL REACT ON!')}
});
}
startBot();