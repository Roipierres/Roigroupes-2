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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploads with binary APK attachment headers & range support
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Accept-Ranges', 'bytes');
    if (filePath.endsWith('.apk')) {
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      res.setHeader('Content-Disposition', 'attachment');
    }
  }
}));

// File upload endpoint with robust multer error handling
app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer Upload Error:', err);
      return res.status(400).json({ error: err.message || 'File upload error' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.originalname, size: req.file.size });
  });
});

const PORT = process.env.PORT || 3000;

// Gemini API setup
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// AI Development Consultant for Apps & Websites
app.post('/api/ai-dev-consultant', async (req, res) => {
  try {
    const { userPrompt, projectType = 'mobile_app', lang = 'ar', userInfo } = req.body;

    if (!userPrompt || typeof userPrompt !== 'string') {
      return res.status(400).json({ error: 'User prompt is required.' });
    }

    // Fallback generator if API key is missing or fails
    const generateFallbackConsultation = () => {
      const typeTitles: Record<string, { ar: string; fr: string }> = {
        mobile_app: { ar: 'مشروع تطبيق هاتف ذكي (Android / iOS)', fr: 'Projet Application Mobile (Android / iOS)' },
        website: { ar: 'مشروع موقع ويب احترافي ومنصة إلكترونية', fr: 'Projet Site Web & Plateforme Cloud' },
        ecommerce: { ar: 'مشروع متجر تجارة إلكترونية ودفع إلكتروني', fr: 'Projet Boutique E-Commerce' },
        erp_pos: { ar: 'مشروع نظام سحابي لإدارة الأعمال والمبيعات', fr: 'Projet Système ERP & Gestion Commerciale' },
        custom: { ar: 'مشروع برمجي مخصص', fr: 'Projet Logiciel Personnalisé' }
      };

      const title = typeTitles[projectType] ? typeTitles[projectType][lang === 'fr' ? 'fr' : 'ar'] : (lang === 'fr' ? 'Projet de Développement' : 'مشروع تطوير وبرمجة');

      const isApp = projectType === 'mobile_app' || userPrompt.includes('تطبيق') || userPrompt.includes('app');
      const isStore = projectType === 'ecommerce' || userPrompt.includes('متجر') || userPrompt.includes('منتجات') || userPrompt.includes('شراء');

      let suggestedTech = isApp ? 'React Native / Flutter, Node.js, Firebase Cloud' : 'Next.js, Tailwind CSS, PostgreSQL / Firebase, Stripe / Edahabia';
      let estimatedTimeline = isStore ? '3 إلى 4 أسابيع' : '2 إلى 4 أسابيع';

      let aiSummary = lang === 'fr'
        ? `Étude de faisabilité : Le projet "${userPrompt.slice(0, 50)}..." nécessite une architecture moderne avec interface utilisateur fluide, backend sécurisé et panneau d'administration pour la gestion complète.`
        : `دراسة الجدوى الفنية: يتطلب المشروع نظاماً برمجياً حديثاً يتضمن واجهة مستخدم متجاوبة فائقة السرعة، قاعدة بيانات سحابية متزامنة، ولوحة تحكم إدارية مركزية للتحكم بالبيانات والمستخدمين. الفكرة قابلة للتنفيذ بكفاءة عالية وفق أعلى معايير RoiGroupes.`;

      let adminMessage = lang === 'fr'
        ? `Rapport de consultation IA pour l'administration :\nLe client (${userInfo?.name || 'Visiteur'}) souhaite développer un projet (${title}).\nDescription détaillée : "${userPrompt}".\nTechnologies recommandées : ${suggestedTech}.\nDélai estimé : ${estimatedTimeline}.`
        : `تقرير المساعد الذكي لإدارة RoiGroupes Holding:\nيرغب العضو/العميل (${userInfo?.name || 'زائر الموقع'}) في التعاقد لتطوير (${title}).\n\n📌 ملخص الفكرة من العميل:\n"${userPrompt}"\n\n🛠️ التوصية التقنية المقترحة:\n- البنية: ${suggestedTech}\n- لوحة تحكم سحابية لإدارة البيانات والتقارير.\n- مدة الإنجاز المقدرة: ${estimatedTimeline}.\n\nالرجاء من فريق التطوير التواصل مع العميل للتنسيق وتحديد تفاصيل العقد والبدء بالتنفيذ.`;

      return {
        projectTitle: title,
        projectType,
        aiSummary,
        suggestedTech,
        estimatedTimeline,
        adminMessage
      };
    };

    if (!apiKey) {
      return res.json(generateFallbackConsultation());
    }

    const systemInstruction = `You are the Lead Software Architect and Development Consultant for RoiGroupes Holding (RoiGroupes.com).
Your role:
A client comes to you with an idea for a mobile application (Android/iOS), website, e-commerce store, ERP, or custom software.
Analyze their idea and provide an executive development brief formatted in JSON with the following exact keys:
- "projectTitle": A clear, attractive project title (in ${lang === 'fr' ? 'French' : 'Arabic'}).
- "projectType": normalized type (${projectType}).
- "aiSummary": Professional technical feasibility study & architecture outline explaining what will be built, user journey, and main modules (in ${lang === 'fr' ? 'French' : 'Arabic'}).
- "suggestedTech": Recommended modern technology stack (e.g., React Native/Flutter, Next.js, Node.js, Firebase, Cloud SQL).
- "estimatedTimeline": Realistic timeline (e.g., "3 à 5 semaines" or "3 إلى 5 أسابيع").
- "adminMessage": A formal, well-structured message prepared on behalf of the AI Consultant addressed to RoiGroupes Administration, introducing the client (${userInfo?.name || 'العميل'}), detailing what they need, budget/tech recommendations, and urging the team to follow up.

Output strictly valid JSON with no markdown wrapping or code blocks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `Client idea: "${userPrompt}". Selected type: ${projectType}. Client Name: ${userInfo?.name || 'Member'}` }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.6,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '';
    try {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch {
      return res.json(generateFallbackConsultation());
    }
  } catch (error: any) {
    console.error('AI Dev Consultant Error:', error);
    // Return fallback gracefully
    const fallback = {
      projectTitle: 'مشروع تطبيق / موقع مخصص - RoiGroupes',
      projectType: req.body?.projectType || 'mobile_app',
      aiSummary: 'دراسة استشارية سريعة: فكرة المشروع مدروسة وقابلة للتنفيذ بتصميم عصري وتقنيات سحابية عالية الأمان.',
      suggestedTech: 'React Native / Next.js, Node.js, Firebase',
      estimatedTimeline: '2 إلى 4 أسابيع',
      adminMessage: `طلب استشارة وتطوير مشروع من العضو:\n${req.body?.userPrompt || ''}`
    };
    return res.json(fallback);
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
      let template = await vite.transformIndexHtml(
        url,
        `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RoiGroupes.com - RG App Store</title>
    <meta name="description" content="المنصة الرسمية لمجموعة RoiGroupes Holding لعرض وتحميل التطبيقات التجارية والعائلية والأمنية." />
    <meta property="og:title" content="RoiGroupes.com - RG App Store" />
    <meta property="og:description" content="المنصة الرسمية لمجموعة RoiGroupes Holding لعرض وتحميل التطبيقات التجارية والعائلية والأمنية." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased font-sans selection:bg-indigo-500 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
      );
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
