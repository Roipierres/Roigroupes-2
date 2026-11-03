import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
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

const PORT = 3000;

// Gemini API setup
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// AI Development Consultant for Apps & Websites (Conversational Interrogator)
app.post('/api/ai-dev-consultant', async (req, res) => {
  try {
    const { messages = [], lang = 'ar', userInfo } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages history is required.' });
    }

    if (!apiKey) {
      // Very simple fallback for chat if no API key
      const lastUserMsg = messages[messages.length - 1].content;
      return res.json({
        text: lang === 'fr' 
          ? `C'est une excellente idée ! Pour vous aider au mieux, j'ai besoin de quelques détails. Quel est votre nom et votre numéro de téléphone pour que notre équipe technique puisse vous contacter ?` 
          : `هذه فكرة ممتازة! لمساعدتك بشكل احترافي، أحتاج لبعض التفاصيل. ما هو اسمك الكريم ورقم هاتفك ليتواصل معك فريقنا التقني؟`
      });
    }

         const systemInstruction = `أنت "المهندس الأول ورئيس قسم الابتكار" في مجموعة RoiGroupeS.
تتحدث برسمية تامة (Formal Arabic) وباحترافية عالية جداً.
مهمتك هي "استنطاق" الزبون (Interrogating the client) بذكاء ولباقة لمعرفة تفاصيل مشروعه بدقة.

بروتوكول التعامل:
1. لا تقدم اقتراحات عشوائية؛ اسأل العميل ليفصح عما يريد.
2. أخبر العميل أن منصة RoiGroupeS ستتكفل بكل شيء: البرمجة من الصفر، الرفع على المتاجر، الإدارة، والصيانة.
3. كن مقنعاً جداً بأن أفضل بداية للمشروع هي تطبيق موبايل خاص من إنشاء المنصة.
4. الأسعار تبدأ من 1 مليون سنتيم (10,000 دج) لأبسط التطبيقات، وتزيد حسب التعقيد التقني.
5. أنواع التطبيقات التي نبرمجها: تطبيقات توصيل، تطبيقات مؤسساتية، تطبيقات عائلية وأمنية، تطبيقات مبتكرة لكل الأفكار.
6. يجب أن تحصل خلال الحوار على: (اسم العميل، رقم الهاتف، فكرة التطبيق الدقيقة).
7. يمكنك عمل "فاتورة تقديرية" (Pro-forma Invoice) نصية إذا طلب العميل ذلك، موضحاً فيها السعر التقريبي (بدءاً من 10,000 دج).

عند اكتمال الاستنطاق والحصول على الاسم والهاتف، أدرج هذا القالب في نهاية رسالتك الختامية:
[LEAD_DATA]
{
  "userName": "اسم العميل",
  "userPhone": "رقم الهاتف",
  "projectTitle": "عنوان المشروع المقترح",
  "projectType": "mobile_app | website | ecommerce | erp_pos | custom",
  "userIdea": "ملخص كامل للفكرة المستنطقة",
  "suggestedTech": "التقنيات التي سنستخدمها",
  "estimatedTimeline": "المدة المقدرة للتنفيذ"
}
[/LEAD_DATA]

تذكر: كن مرناً ولكن رسمياً جداً. هدفك هو إقناع الزبون وبناء الثقة التامة في RoiGroupeS.`;

    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    const currentMessage = messages[messages.length - 1].content;

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      },
      history
    });

    const result = await chat.sendMessage(currentMessage);
    const text = result.text;

    return res.json({ text });
  } catch (error: any) {
    console.error('AI Dev Consultant Chat Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
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
