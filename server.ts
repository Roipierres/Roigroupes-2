import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import fs from 'fs';
import { buildRealAndroidApk } from './server/apkBuilder';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Generate the official real APK package immediately on startup
try {
  buildRealAndroidApk({
    appName: 'RoiGroupeS Official Store',
    shortName: 'RGS',
    packageName: 'com.roigroupes.official',
    versionName: '2.4.0',
    versionCode: 24,
    startUrl: '/'
  }, uploadsDir);
  console.log('Official Android APK ready at:', path.join(uploadsDir, 'RoiGroupeS-Official.apk'));
} catch (e) {
  console.error('Initial APK generation note:', e);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit for APKs and packages
});

const app = express();
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Serve static uploads with binary APK attachment headers & range support
app.use('/uploads', express.static(uploadsDir, {
  fallthrough: false, // Ensure it doesn't fall through to other middlewares if file not found
  setHeaders: (res, filePath) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.apk') {
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      const baseName = path.basename(filePath);
      res.setHeader('Content-Disposition', `attachment; filename="${baseName}"`);
    } else if (ext === '.png') {
      res.setHeader('Content-Type', 'image/png');
    } else if (ext === '.jpg' || ext === '.jpeg') {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (ext === '.webp') {
      res.setHeader('Content-Type', 'image/webp');
    }
  }
}));

// Error handler for /uploads to prevent falling through to SPA HTML catch-all
app.use('/uploads', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Uploads Access Error:', err);
  res.status(404).json({ error: 'File not found on server' });
});

// File upload endpoint with robust multer error handling
app.post('/api/upload', (req, res) => {
  console.log('Upload request received...');
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer Upload Error:', err);
      return res.status(400).json({ error: err.message || 'File upload error' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    console.log(`File uploaded successfully: ${req.file.filename} (${req.file.size} bytes)`);
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.originalname, size: req.file.size });
  });
});

// Dynamic PWA Manifest Generator
app.get('/api/manifest', (req, res) => {
  const { name, short_name, start_url, icon } = req.query;
  const manifest = {
    name: name || 'RoiGroupes.com Official Store',
    short_name: short_name || 'RGS',
    start_url: start_url || '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#f59e0b',
    icons: [
      {
        src: icon || '/assets/aistudio/1793173133604_a080e212.jpg',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  };
  res.setHeader('Content-Type', 'application/manifest+json');
  res.send(JSON.stringify(manifest));
});

// Endpoint to generate and compile a real Android APK package on demand
app.post('/api/build-official-apk', (req, res) => {
  try {
    const { appName, shortName, packageName, versionName, iconBase64, startUrl } = req.body || {};
    const result = buildRealAndroidApk({
      appName: appName || 'RoiGroupeS Official Store',
      shortName: shortName || 'RGS',
      packageName: packageName || 'com.roigroupes.official',
      versionName: versionName || '2.4.0',
      iconBase64,
      startUrl: startUrl || '/'
    }, uploadsDir);

    const sizeMB = (result.sizeBytes / (1024 * 1024)).toFixed(1);

    res.json({
      success: true,
      fileName: result.fileName,
      downloadUrl: `/uploads/${result.fileName}`,
      size: `${sizeMB} MB`,
      version: versionName || '2.4.0',
      message: 'تم بناء وتوليد حزمة تطبيق المنصة (APK) بنجاح!'
    });
  } catch (err: any) {
    console.error('Build APK Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate APK' });
  }
});

// --- Server-backed Chat Persistence and Real-time Relay ---
const chatsDbPath = path.join(uploadsDir, 'chats_db.json');
const usersDbPath = path.join(uploadsDir, 'users_db.json');

function readChatsDb(): any[] {
  try {
    if (fs.existsSync(chatsDbPath)) {
      return JSON.parse(fs.readFileSync(chatsDbPath, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function writeChatsDb(chats: any[]) {
  try {
    fs.writeFileSync(chatsDbPath, JSON.stringify(chats, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing chats_db.json:', e);
  }
}

function readUsersDb(): any[] {
  try {
    if (fs.existsSync(usersDbPath)) {
      return JSON.parse(fs.readFileSync(usersDbPath, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function writeUsersDb(users: any[]) {
  try {
    fs.writeFileSync(usersDbPath, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing users_db.json:', e);
  }
}

// Get chats endpoint
app.get('/api/chat/messages', (req, res) => {
  const userId = String(req.query.userId || '');
  const chats = readChatsDb();
  if (!userId) {
    return res.json(chats);
  }
  const isAdmin = userId === 'user-admin' || userId === 'user-manager' || userId.toLowerCase().includes('admin') || userId.includes('bahrinho93') || userId.includes('manager@roigroupes.com');
  if (isAdmin) {
    return res.json(chats);
  }
  const filtered = chats.filter(m => 
    m.senderId === userId || 
    m.receiverId === userId ||
    m.receiverId === 'user-admin' ||
    m.receiverId === 'user-manager'
  );
  res.json(filtered);
});

// Send chat message endpoint
app.post('/api/chat/send', (req, res) => {
  try {
    const { id, senderId, senderName, receiverId, text, timestamp, isRead, senderAvatar } = req.body || {};
    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ error: 'Missing required chat fields' });
    }
    const chats = readChatsDb();
    const msgId = id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newMsg = {
      id: msgId,
      senderId: String(senderId),
      senderName: String(senderName || 'مستخدم'),
      senderAvatar: senderAvatar || '',
      receiverId: String(receiverId),
      text: String(text).trim(),
      timestamp: timestamp || new Date().toISOString(),
      isRead: Boolean(isRead)
    };

    // De-duplicate if already exists
    const idx = chats.findIndex(c => c.id === msgId);
    if (idx >= 0) {
      chats[idx] = newMsg;
    } else {
      chats.push(newMsg);
    }
    writeChatsDb(chats);
    res.json({ success: true, message: newMsg });
  } catch (err: any) {
    console.error('Chat send error:', err);
    res.status(500).json({ error: err.message || 'Server chat error' });
  }
});

// Mark messages as read endpoint
app.post('/api/chat/read', (req, res) => {
  try {
    const { senderId, receiverId } = req.body || {};
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: 'senderId and receiverId required' });
    }
    const chats = readChatsDb();
    let updated = false;
    for (const msg of chats) {
      if (msg.senderId === senderId && (msg.receiverId === receiverId || (receiverId === 'user-admin' && msg.receiverId.includes('admin')))) {
        if (!msg.isRead) {
          msg.isRead = true;
          updated = true;
        }
      }
    }
    if (updated) {
      writeChatsDb(chats);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Register active user in chat directory
app.post('/api/chat/register-user', (req, res) => {
  try {
    const user = req.body;
    if (!user || !user.id) {
      return res.status(400).json({ error: 'User id is required' });
    }
    const users = readUsersDb();
    const idx = users.findIndex(u => u.id === user.id);
    const updatedUser = {
      ...user,
      lastSeen: new Date().toISOString()
    };
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updatedUser };
    } else {
      users.push(updatedUser);
    }
    writeUsersDb(users);
    res.json({ success: true, user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get registered users for chat
app.get('/api/chat/users', (req, res) => {
  const users = readUsersDb();
  res.json(users);
});

// --- Friend Requests Persistence & Logic ---
const friendRequestsDbPath = path.join(uploadsDir, 'friend_requests_db.json');

function readFriendRequestsDb(): any[] {
  try {
    if (fs.existsSync(friendRequestsDbPath)) {
      return JSON.parse(fs.readFileSync(friendRequestsDbPath, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function writeFriendRequestsDb(requests: any[]) {
  try {
    fs.writeFileSync(friendRequestsDbPath, JSON.stringify(requests, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing friend_requests_db.json:', e);
  }
}

// Get friend requests for a user
app.get('/api/chat/friend-requests', (req, res) => {
  const userId = String(req.query.userId || '');
  const requests = readFriendRequestsDb();
  if (!userId) {
    return res.json(requests);
  }
  const filtered = requests.filter(r => r.senderId === userId || r.receiverId === userId);
  res.json(filtered);
});

// Send friend request
app.post('/api/chat/friend-request', (req, res) => {
  try {
    const { id, senderId, senderName, senderAvatar, receiverId, receiverName } = req.body || {};
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: 'senderId and receiverId required' });
    }
    const requests = readFriendRequestsDb();
    const existing = requests.find(r => 
      ((r.senderId === senderId && r.receiverId === receiverId) ||
       (r.senderId === receiverId && r.receiverId === senderId)) &&
      r.status !== 'declined'
    );
    if (existing) {
      return res.json({ success: true, request: existing, message: 'Request already exists' });
    }
    const reqId = id || `freq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newReq = {
      id: reqId,
      senderId: String(senderId),
      senderName: String(senderName || 'مستخدم'),
      senderAvatar: senderAvatar || '',
      receiverId: String(receiverId),
      receiverName: receiverName || '',
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    requests.push(newReq);
    writeFriendRequestsDb(requests);
    res.json({ success: true, request: newReq });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Respond to friend request (accept or decline)
app.post('/api/chat/friend-request/respond', (req, res) => {
  try {
    const { requestId, status } = req.body || {};
    if (!requestId || !status) {
      return res.status(400).json({ error: 'requestId and status required' });
    }
    const requests = readFriendRequestsDb();
    const reqItem = requests.find(r => r.id === requestId);
    if (!reqItem) {
      return res.status(404).json({ error: 'Request not found' });
    }
    reqItem.status = status; // 'accepted' | 'declined'
    writeFriendRequestsDb(requests);

    // If accepted, link friends in users db
    if (status === 'accepted') {
      const users = readUsersDb();
      const u1 = users.find(u => u.id === reqItem.senderId);
      const u2 = users.find(u => u.id === reqItem.receiverId);
      if (u1) {
        u1.friends = Array.from(new Set([...(u1.friends || []), reqItem.receiverId]));
      }
      if (u2) {
        u2.friends = Array.from(new Set([...(u2.friends || []), reqItem.senderId]));
      }
      writeUsersDb(users);
    }

    res.json({ success: true, request: reqItem });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = 3000;

// Gemini API setup
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper for intelligent interrogation fallback when Gemini API key is unavailable or fails
function runSmartInterrogator(messages: any[], lang: string, userInfo?: any) {
  const allUserTexts = messages.filter((m: any) => m.role === 'user').map((m: any) => m.content).join(' ');
  const lastMsg = messages[messages.length - 1]?.content || '';

  // Extract phone number if present
  const phoneMatch = allUserTexts.match(/(?:\+213|00213|0)?[5-7][0-9]{8}/) || allUserTexts.match(/\b\d{8,12}\b/);
  const detectedPhone = phoneMatch ? phoneMatch[0] : '';

  // Extract name if provided
  let detectedName = userInfo?.name || '';
  const nameMatch = allUserTexts.match(/(?:اسمي|أنا|معك|أخوك|الاسم)\s+([^\s,،.]+)/);
  if (nameMatch && nameMatch[1]) {
    detectedName = nameMatch[1];
  } else if (!detectedName) {
    if (messages.length >= 3 && lastMsg.length < 25 && !lastMsg.includes('?') && !phoneMatch) {
      detectedName = lastMsg.replace(/(?:اسمي|أنا)\s*/, '').trim();
    }
  }

  // Detect price / invoice inquiries
  const isAskingPriceOrInvoice = /سعر|تكلفة|بكم|فاتورة|فاتوره|كم يكلف|كم السعر|devis|facture|prix/i.test(lastMsg);

  // If user provided phone and some details, finalize and generate LEAD_DATA
  if (detectedPhone && messages.length >= 3) {
    const projectTitle = allUserTexts.includes('توصيل') ? 'هيكلية نظام توصيل لوجستي' 
      : allUserTexts.includes('متجر') ? 'بنية منصة تجارة متكاملة'
      : allUserTexts.includes('مطعم') ? 'هندسة نظام إدارة مطاعم'
      : 'مشروع هندسي مخصص معتمد من RoiGroupeS';

    const cleanName = detectedName || (lang === 'fr' ? 'Client Estimé' : 'عميلنا الكريم');

    return {
      text: lang === 'fr'
        ? `Étude de faisabilité finalisée pour M. ${cleanName}. Vos spécifications techniques et contact (${detectedPhone}) ont été transmis à l'ingénierie. Nous allons analyser le flux de données et la charge serveur pour votre solution Native. Un ingénieur senior vous contactera via WhatsApp.

[LEAD_DATA]
{
  "userName": "${cleanName}",
  "userPhone": "${detectedPhone}",
  "projectTitle": "${projectTitle}",
  "projectType": "mobile_app",
  "userIdea": "${allUserTexts.replace(/["\n\r]/g, ' ').substring(0, 200)}",
  "suggestedTech": "Architecture Native, PostgreSQL, Node.js",
  "estimatedTimeline": "15 à 25 jours"
}
[/LEAD_DATA]`
        : `أهلاً بك سيدي ${cleanName}! لقد تم استكمال التأطير الهندسي الأولي لمشروعكم (${projectTitle}). تم تسجيل رقمكم (${detectedPhone}) بنجاح. نقوم الآن بتحليل "المخطط التقني" لضمان أفضل أداء واستقرار للنظام.

ملف مشروعكم الآن قيد المراجعة في قسم الهندسة والابتكار، وسيتواصل معكم أحد كبار المهندسين عبر الواتساب لمناقشة التفاصيل التقنية النهائية قبل البدء.

[LEAD_DATA]
{
  "userName": "${cleanName}",
  "userPhone": "${detectedPhone}",
  "projectTitle": "${projectTitle}",
  "projectType": "mobile_app",
  "userIdea": "${allUserTexts.replace(/["\n\r]/g, ' ').substring(0, 200)}",
  "suggestedTech": "Architecture Native, PostgreSQL, Node.js",
  "estimatedTimeline": "15 إلى 25 يوم"
}
[/LEAD_DATA]`
    };
  }

  // If asking for invoice or price
  if (isAskingPriceOrInvoice) {
    return {
      text: lang === 'fr'
        ? `L'ingénierie RoiGroupeS propose des solutions sur-mesure. Le coût final dépend de la complexité de l'architecture (API, Sécurité, Temps réel) :

📋 Composants de l'Étude Technique :
• Design de l'Architecture Native : Inclus
• Sécurisation des Endpoints API : Inclus
• Optimisation des Requêtes DB : Inclus
• Déploiement Cloud Scalable : Inclus

Veuillez laisser votre nom et WhatsApp pour recevoir une proposition financière détaillée basée على vos spécifications.`
        : `في RoiGroupeS، التكلفة النهائية لمشروعكم تتحدد بناءً على "المتطلبات الهندسية" (الربط البرمجي، الأمان، سرعة المعالجة):

📋 بنود الدراسة الفنية والمالية:
• تصميم هيكلية النظام (Native Architecture): مُدرج
• تشفير البيانات وحماية النهايات الطرفية: مُدرج
• تحسين أداء قواعد البيانات السحابية: مُدرج
• دعم فني وصيانة دورية: مُدرج

يرجى تزويدي باسمكم ورقم الواتساب لإرسال العرض المالي والتقني المفصل لمشروعكم.`
    };
  }

  // Technical Domain Interrogation
  const isDelivery = /توصيل|livraison|delivery|مناديب/i.test(allUserTexts);
  const isSecurity = /أمن|امني|أمنية|عائل|حماية|securite/i.test(allUserTexts);

  if (!detectedPhone) {
    if (isDelivery) {
      return {
        text: lang === 'fr'
          ? `Pour une application de livraison, nous devons définir : la gestion des files d'attente, le calcul d'itinéraire optimisé et le système de notifications push en temps réel.

Quel est votre nom et votre numéro WhatsApp pour cadrer ces points techniques ?`
          : `لتأطير تطبيق توصيل ناجح، نحتاج لتحديد: نظام إدارة الطلبات المتزامن، خوارزمية تتبع المناديب، وآلية الإشعارات اللحظية.

ما هو اسمكم الكريم ورقم الواتساب لنقوم بإعداد المخطط الهندسي الأولي؟`
      };
    }
    if (isSecurity || allUserTexts.includes('عائل')) {
      return {
        text: lang === 'fr'
          ? `La cybersécurité est notre priorité. Nous utilisons des protocoles de chiffrement asymétriques pour protéger les données de vos utilisateurs.

Quel est votre nom et votre contact WhatsApp pour une analyse de vos besoins en sécurité ?`
          : `الأمان هو ركيزتنا الأساسية؛ نعتمد بروتوكولات تشفير متطورة لحماية خصوصية بيانات المستخدمين بشكل مطلق.

ما هو اسمكم الكريم ورقم الواتساب لنقوم بعمل دراسة المخاطر والأمان لمشروعكم؟`
      };
    }
  }

  return {
    text: lang === 'fr'
      ? "Bonjour. Je suis l'Ingénieur Principal de RoiGroupeS. Pour encadrer techniquement votre projet, j'ai besoin de comprendre les flux de données prévus. Quel est l'objectif principal et votre numéro WhatsApp ?"
      : "أهلاً بك. أنا المهندس الأول في RoiGroupeS. لكي نتمكن من تأطير مشروعك هندسياً، أحتاج لفهم تدفق البيانات المطلوب: ما هي الوظائف الأساسية، وما هو رقم الواتساب الخاص بكم؟"
  };
}


// AI Development Consultant for Apps & Websites (Conversational Interrogator)
app.post('/api/ai-dev-consultant', async (req, res) => {
  try {
    const { messages = [], lang = 'ar', userInfo } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages history is required.' });
    }

    const systemInstruction = `أنت "المهندس الأول ورئيس قسم الحلول البرمجية" في RoiGroupeS.
تتحدث بلغة تقنية احترافية (Professional Engineering Arabic).
مهمتك هي "التأطير التقني المعمق" (Deep Technical Framing) لمشاريع الزبائن.

بروتوكول الاستنطاق الهندسي:
1. لا تكتفِ بالأفكار العامة. إذا قال الزبون "أريد تطبيق توصيل"، اسأله عن: (خوارزمية توزيع الطلبات، نظام المحفظة المالية، التكامل مع خرائط Google أو OpenStreetMap، وضوابط الأمان).
2. بادر دائماً بطلب "المواصفات الفنية" (Technical Specifications): مثل عدد المستخدمين المتوقع في الساعة (Peak Load)، ونوع قواعد البيانات (SQL vs NoSQL).
3. ركز على أن RoiGroupeS تبرمج تطبيقات Native و Hybrid مع تشفير كامل للبيانات، وليست مجرد واجهات ويب.
4. وضح للزبون أنك تقوم الآن بعمل "دراسة جدوى تقنية" (Technical Feasibility Study) لضمان نجاح مشروعه.
5. يجب أن تحصل على: (الاسم، رقم الواتساب، وهيكلية العمل التفصيلية).
6. كن صارماً تقنياً ولبقاً تجارياً. لا تتحدث عن الأسعار إلا إذا طلب الزبون "فاتورة تقديرية".

عند الحصول على البيانات الكافية، أدرج هذا القالب التقني:
[LEAD_DATA]
{
  "userName": "اسم العميل",
  "userPhone": "رقم الهاتف",
  "projectTitle": "العنوان الهندسي للمشروع",
  "projectType": "mobile_app | website | ecommerce | erp_pos | custom",
  "userIdea": "خلاصة الدراسة الفنية والهيكلية المقترحة",
  "suggestedTech": "المكدس التقني المقترح (Tech Stack)",
  "estimatedTimeline": "الجدول الزمني المقدر للمراحل"
}
[/LEAD_DATA]

تذكر: أنت مهندس برمجيات ولست مجرد موظف مبيعات. هدفك هو تحويل فكرة الزبون إلى مواصفات هندسية دقيقة.`;

    let generatedText = '';

    if (apiKey) {
      try {
        const contents = messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const result = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents,
          config: {
            systemInstruction
          }
        });

        generatedText = result.text || '';
      } catch (geminiError) {
        console.warn('Gemini API call warning (using smart fallback interrogator):', geminiError);
      }
    }

    if (!generatedText) {
      const fallbackResult = runSmartInterrogator(messages, lang, userInfo);
      generatedText = fallbackResult.text;
    }

    return res.json({ text: generatedText });
  } catch (error: any) {
    console.error('AI Dev Consultant Global Error:', error);
    const fallbackResult = runSmartInterrogator(req.body?.messages || [], req.body?.lang || 'ar', req.body?.userInfo);
    return res.json({ text: fallbackResult.text });
  }
});

// Vite integration in development
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      // Read index.html from the root directory
      const indexPath = path.resolve(__dirname, 'index.html');
      let template = fs.readFileSync(indexPath, 'utf-8');
      
      // Transform index.html with Vite
      template = await vite.transformIndexHtml(url, template);
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
} else {
  // Static serving in production
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
