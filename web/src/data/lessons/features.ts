import { R } from '../resources'
import type { LessonInput } from './types'

export const features: LessonInput[] = [
  {
    id: 'projects',
    track: 'features',
    title: 'Projects: a home for your work',
    titleAr: 'المشاريع: بيت لعملك',
    summary: {
      en: 'Keep files, instructions, and chats together so Claude always knows the background.',
      ar: 'اجمع الملفات والتعليمات والمحادثات معًا حتى يعرف Claude الخلفية دائمًا.',
    },
    level: 'Intermediate',
    minutes: 6,
    icon: 'folder',
    sections: [
      {
        heading: 'What is a project?',
        headingAr: 'ما هو المشروع؟',
        paragraphs: [
          {
            en: 'A project is a workspace with its own chats and its own knowledge. You can upload documents, notes, or code to the project, and Claude uses them in every chat inside it.',
            ar: 'المشروع مساحة عمل لها محادثاتها ومعرفتها الخاصة. يمكنك رفع مستندات أو ملاحظات أو أكواد إلى المشروع، ويستخدمها Claude في كل محادثة داخله.',
          },
          {
            en: 'This means you can reuse the same background instead of explaining it again and again. Projects are available on all plans, including the free plan.',
            ar: 'هذا يعني أنك تستطيع إعادة استخدام الخلفية نفسها بدلًا من شرحها مرارًا وتكرارًا. المشاريع متاحة في كل الخطط، بما فيها الخطة المجانية.',
          },
        ],
      },
      {
        heading: 'Project instructions',
        headingAr: 'تعليمات المشروع',
        paragraphs: [
          {
            en: 'Each project can have instructions that apply to all its chats, so the answers stay consistent. For example: "Always answer in simple English and add Arabic translations of difficult words."',
            ar: 'يمكن أن يكون لكل مشروع تعليمات تنطبق على كل محادثاته، فتبقى الإجابات متّسقة. مثلًا: "أجب دائمًا بإنجليزية بسيطة وأضف ترجمة عربية للكلمات الصعبة."',
          },
          {
            en: 'Good project ideas: an "English Practice" project with your level and goals, a "Job Search" project with your CV, or a "Study" project with your course notes. On Team and Enterprise plans, you can also share a project and collaborate with colleagues.',
            ar: 'أفكار جيدة للمشاريع: مشروع "تدريب الإنجليزية" بمستواك وأهدافك، أو مشروع "البحث عن عمل" بسيرتك الذاتية، أو مشروع "الدراسة" بملاحظات مقرراتك. وفي خطط Team وEnterprise يمكنك أيضًا مشاركة مشروع والتعاون مع زملائك.',
          },
        ],
      },
    ],
    example: {
      bad: 'Pasting your CV and your English level into every new chat.',
      good: 'Project "Job Search" → knowledge: CV.pdf, job_ads.txt\nInstructions: "I am an intermediate English learner looking for a junior developer job. Keep answers short and correct my English at the end of each reply."',
      why: {
        en: 'You write the background once, and every chat in the project starts with it.',
        ar: 'تكتب الخلفية مرة واحدة، وتبدأ بها كل محادثة داخل المشروع.',
      },
    },
    tip: {
      en: 'Create an "English Coach" project today. Put your level, your goals, and a list of your common mistakes in the instructions.',
      ar: 'أنشئ مشروع "مدرّب الإنجليزية" اليوم. ضع مستواك وأهدافك وقائمة بأخطائك الشائعة في التعليمات.',
    },
    resources: [R.projects, R.manageProjects, R.claude101],
    vocab: [
      { word: 'workspace', ar: 'مساحة عمل', pos: 'noun', example: 'Each project is a separate workspace.' },
      { word: 'knowledge', ar: 'معرفة', pos: 'noun', example: 'Add your notes to the project knowledge.' },
      { word: 'collaborate', ar: 'يتعاون', pos: 'verb', example: 'We collaborate on the same project.' },
      { word: 'reuse', ar: 'يعيد الاستخدام', pos: 'verb', example: 'You can reuse these instructions every day.' },
      { word: 'consistent', ar: 'ثابت / متّسق', pos: 'adjective', example: 'Project instructions keep the answers consistent.' },
    ],
    quiz: [
      {
        q: 'What is the main benefit of a project?',
        qAr: 'ما الفائدة الرئيسية من المشروع؟',
        options: ['It makes Claude faster', 'Claude uses the same files and instructions in every chat inside it', 'It deletes old chats'],
        answer: 1,
        explain: { en: 'Projects keep shared knowledge and instructions for all their chats.', ar: 'المشاريع تحفظ المعرفة والتعليمات المشتركة لكل محادثاتها.' },
      },
      {
        q: '"Workspace" means…',
        qAr: 'كلمة "Workspace" تعني…',
        options: ['مساحة عمل', 'استراحة', 'ملف صوتي'],
        answer: 0,
        explain: { en: 'A workspace is a place where you do your work.', ar: 'مساحة العمل هي المكان الذي تنجز فيه عملك.' },
      },
    ],
  },
  {
    id: 'artifacts',
    track: 'features',
    title: 'Artifacts: make real things',
    titleAr: 'الأعمال (Artifacts): اصنع أشياء حقيقية',
    summary: {
      en: 'Documents, websites, diagrams, and small interactive tools that open beside your chat.',
      ar: 'مستندات ومواقع ومخططات وأدوات تفاعلية صغيرة تُفتح بجانب محادثتك.',
    },
    level: 'Intermediate',
    minutes: 6,
    icon: 'layout',
    sections: [
      {
        heading: 'More than a chat message',
        headingAr: 'أكثر من رسالة في محادثة',
        paragraphs: [
          {
            en: 'An artifact is something Claude makes for you that you would show to other people: a document, a presentation, a diagram, a dashboard, a web page, or a small app.',
            ar: 'العمل (Artifact) هو شيء يصنعه Claude لك وتعرضه على الآخرين: مستند، أو عرض تقديمي، أو مخطط، أو لوحة بيانات، أو صفحة ويب، أو تطبيق صغير.',
          },
          {
            en: 'Artifacts open beside the conversation. You can change them by talking to Claude, and you can find everything you made in the Artifacts area of the app. On paid plans, you can also start from a template.',
            ar: 'تُفتح الأعمال بجانب المحادثة. يمكنك تعديلها بالتحدث مع Claude، ويمكنك إيجاد كل ما صنعته في قسم Artifacts في التطبيق. وفي الخطط المدفوعة يمكنك أيضًا البدء من قالب.',
          },
        ],
      },
      {
        heading: 'Ideas for learners',
        headingAr: 'أفكار للمتعلمين',
        paragraphs: [
          {
            en: 'Ask Claude to build a small quiz app with ten words you want to learn, or a flashcard game you can play every morning. A quick prototype like this takes only minutes.',
            ar: 'اطلب من Claude أن يبني تطبيق اختبار صغيرًا بعشر كلمات تريد تعلمها، أو لعبة بطاقات تلعبها كل صباح. نموذج أولي سريع كهذا لا يستغرق إلا دقائق.',
          },
          {
            en: 'When the artifact is ready, you can share it with friends or export it. Documents, for example, can be exported to formats like Word or PDF.',
            ar: 'عندما يصبح العمل جاهزًا، يمكنك مشاركته مع أصدقائك أو تصديره. المستندات مثلًا يمكن تصديرها إلى صيغ مثل Word أو PDF.',
          },
        ],
      },
    ],
    example: {
      bad: 'Give me some English words.',
      good: 'Create an interactive flashcard app with these 10 words: borrow, improve, avoid, achieve, remind, deliver, apply, explain, compare, suggest. Show the English word first; when I click, show the Arabic meaning and one example sentence. Add a "shuffle" button.',
      why: {
        en: 'You get a real tool you can use every day, not just a list of words.',
        ar: 'تحصل على أداة حقيقية تستخدمها كل يوم، وليس مجرد قائمة كلمات.',
      },
    },
    tip: {
      en: 'Describe what you want to see and what should happen when you click. Those two things make artifacts much better.',
      ar: 'صِف ما تريد أن تراه وما يجب أن يحدث عند النقر. هذان الأمران يجعلان الأعمال أفضل بكثير.',
    },
    resources: [R.artifacts, R.claude101],
    vocab: [
      { word: 'artifact', ar: 'عمل / منتَج (يصنعه Claude)', pos: 'noun', example: 'Claude made an artifact with my study plan.' },
      { word: 'interactive', ar: 'تفاعلي', pos: 'adjective', example: 'This quiz is interactive.' },
      { word: 'prototype', ar: 'نموذج أولي', pos: 'noun', example: 'We built a quick prototype of the app.' },
      { word: 'export', ar: 'يصدّر (ملفًا)', pos: 'verb', example: 'Export the document as a PDF.' },
      { word: 'template', ar: 'قالب', pos: 'noun', example: 'Start from a template to save time.' },
    ],
    quiz: [
      {
        q: 'Which is a good example of an artifact?',
        qAr: 'أيّ مما يلي مثال جيد على العمل (Artifact)؟',
        options: ['A one-word answer', 'A small interactive quiz app', 'A greeting like "Hi"'],
        answer: 1,
        explain: { en: 'Artifacts are substantial things you can use or share.', ar: 'الأعمال أشياء كبيرة يمكنك استخدامها أو مشاركتها.' },
      },
      {
        q: '"Export" means…',
        qAr: 'كلمة "Export" تعني…',
        options: ['يحذف', 'يصدّر', 'يستورد'],
        answer: 1,
        explain: { en: 'To export is to save your work in another format or place.', ar: 'التصدير هو حفظ عملك بصيغة أو مكان آخر.' },
      },
    ],
  },
  {
    id: 'files-and-code',
    track: 'features',
    title: 'Files, images, and data',
    titleAr: 'الملفات والصور والبيانات',
    summary: {
      en: 'Upload PDFs, photos, and spreadsheets — then ask Claude to read, explain, and analyze them.',
      ar: 'ارفع ملفات PDF والصور وجداول البيانات — ثم اطلب من Claude قراءتها وشرحها وتحليلها.',
    },
    level: 'Intermediate',
    minutes: 7,
    icon: 'file',
    sections: [
      {
        heading: 'Claude can read your files',
        headingAr: 'يستطيع Claude قراءة ملفاتك',
        paragraphs: [
          {
            en: 'You can upload PDFs, spreadsheets, and images with the "+" button. Then ask Claude to summarize them, find key points, or answer questions about them.',
            ar: 'يمكنك رفع ملفات PDF وجداول البيانات والصور عبر زر "+". ثم اطلب من Claude تلخيصها، أو إيجاد النقاط الرئيسية، أو الإجابة عن أسئلة حولها.',
          },
          {
            en: 'Claude also understands images. Take a photo of a menu, a sign, or a page from a book, and ask Claude to explain the English words in it.',
            ar: 'يفهم Claude الصور أيضًا. التقط صورة لقائمة طعام، أو لافتة، أو صفحة من كتاب، واطلب من Claude شرح الكلمات الإنجليزية فيها.',
          },
        ],
      },
      {
        heading: 'Analyze data',
        headingAr: 'حلّل البيانات',
        paragraphs: [
          {
            en: 'With a spreadsheet, you can ask real questions: "Which month had the highest sales?" or "Make a chart of my monthly expenses."',
            ar: 'مع جدول البيانات، يمكنك طرح أسئلة حقيقية: "أي شهر كانت مبيعاته الأعلى؟" أو "اصنع رسمًا بيانيًا لمصاريفي الشهرية."',
          },
          {
            en: 'Always tell Claude what the data is and what decision you need to make, so it can give you a useful insight. Then check the important numbers yourself.',
            ar: 'أخبر Claude دائمًا ما هي البيانات وما القرار الذي تحتاج إلى اتخاذه، حتى يقدّم لك استنتاجًا مفيدًا. ثم تحقق من الأرقام المهمة بنفسك.',
          },
        ],
      },
    ],
    example: {
      bad: '[uploads a photo] what?',
      good: '[uploads a photo of a train timetable] I am a tourist in London. Explain this timetable in simple English. Which train should I take to arrive before 10 a.m.?',
      why: {
        en: 'Claude knows what the image is, who you are, and what you need to decide.',
        ar: 'يعرف Claude ما هي الصورة، ومن أنت، وما الذي تحتاج إلى تقريره.',
      },
    },
    tip: {
      en: 'Learning trick: photograph any English text you see outside, and ask Claude for the five most useful words in it.',
      ar: 'حيلة تعلّم: صوّر أي نص إنجليزي تراه في الخارج، واطلب من Claude أهم خمس كلمات فيه.',
    },
    resources: [R.claude101, R.bestPractices],
    vocab: [
      { word: 'upload', ar: 'يرفع (ملفًا)', pos: 'verb', example: 'Upload the file here.' },
      { word: 'analyze', ar: 'يحلّل', pos: 'verb', example: 'Analyze the sales data.' },
      { word: 'relevant', ar: 'ذو صلة', pos: 'adjective', example: 'Only include relevant details.' },
      { word: 'chart', ar: 'رسم بياني', pos: 'noun', example: 'This chart shows our monthly sales.' },
      { word: 'insight', ar: 'فكرة عميقة / استنتاج', pos: 'noun', example: 'The report gave us a useful insight.' },
    ],
    quiz: [
      {
        q: 'Can Claude understand photos?',
        qAr: 'هل يستطيع Claude فهم الصور؟',
        options: ['No, only text', 'Yes, it can read and explain images', 'Only black-and-white photos'],
        answer: 1,
        explain: { en: 'Claude can read text and details in images.', ar: 'يستطيع Claude قراءة النصوص والتفاصيل في الصور.' },
      },
      {
        q: '"Relevant" means…',
        qAr: 'كلمة "Relevant" تعني…',
        options: ['ذو صلة', 'جديد', 'طويل'],
        answer: 0,
        explain: { en: 'Relevant = connected to the topic.', ar: 'ذو صلة = مرتبط بالموضوع.' },
      },
    ],
  },
  {
    id: 'web-research',
    track: 'features',
    title: 'Web search and Research',
    titleAr: 'البحث في الويب والبحث المعمّق',
    summary: {
      en: 'Get current information with sources — and learn to check those sources yourself.',
      ar: 'احصل على معلومات حديثة مع مصادرها — وتعلّم أن تتحقق من تلك المصادر بنفسك.',
    },
    level: 'Intermediate',
    minutes: 6,
    icon: 'globe',
    sections: [
      {
        heading: 'Web search',
        headingAr: 'البحث في الويب',
        paragraphs: [
          {
            en: 'Claude’s knowledge has a cutoff date. For news, prices, or anything that changes, turn on web search from the "+" button, and Claude will search the live web.',
            ar: 'معرفة Claude لها تاريخ توقف. للأخبار أو الأسعار أو أي شيء يتغير، فعّل البحث في الويب من زر "+"، وسيبحث Claude في الويب مباشرة.',
          },
          {
            en: 'Answers based on web search include links to the sources. Open them and read the important parts yourself.',
            ar: 'الإجابات المبنية على البحث في الويب تتضمن روابط للمصادر. افتحها واقرأ الأجزاء المهمة بنفسك.',
          },
        ],
      },
      {
        heading: 'Research mode',
        headingAr: 'وضع البحث المعمّق',
        paragraphs: [
          {
            en: 'On paid plans, Research goes further. Claude runs many searches that build on each other, investigates a question from different angles, and gives a detailed answer with citations.',
            ar: 'في الخطط المدفوعة، يذهب وضع Research أبعد من ذلك. يُجري Claude عمليات بحث كثيرة يبني بعضها على بعض، ويستقصي السؤال من زوايا مختلفة، ويقدّم إجابة مفصلة مع الاستشهادات.',
          },
          {
            en: 'Use it for bigger questions, like comparing universities or planning a trip. For a quick fact, normal web search is enough.',
            ar: 'استخدمه للأسئلة الكبيرة، مثل مقارنة الجامعات أو التخطيط لرحلة. أما للمعلومة السريعة، فالبحث العادي في الويب يكفي.',
          },
        ],
      },
    ],
    example: {
      bad: 'Tell me about scholarships.',
      good: 'Search the web for fully funded master’s scholarships in the UK for students from Morocco, with deadlines in 2027. Give a table: name, amount, deadline, link. Only use official university or government websites.',
      why: {
        en: 'Clear search terms, a table format, and a rule about reliable sources.',
        ar: 'مصطلحات بحث واضحة، وتنسيق جدول، وقاعدة حول المصادر الموثوقة.',
      },
    },
    tip: {
      en: 'Add "Only use official sources" or "Include the publication date of each source" to get more reliable results.',
      ar: 'أضف "Only use official sources" أو "Include the publication date of each source" للحصول على نتائج أكثر موثوقية.',
    },
    resources: [R.webSearch, R.research, R.whenSearch],
    vocab: [
      { word: 'research', ar: 'بحث / يبحث', pos: 'noun', example: 'I need to do some research before I decide.' },
      { word: 'citation', ar: 'استشهاد / إشارة إلى مصدر', pos: 'noun', example: 'Each fact has a citation.' },
      { word: 'current', ar: 'حالي / حديث', pos: 'adjective', example: 'I need the current price.' },
      { word: 'reliable', ar: 'موثوق', pos: 'adjective', example: 'Is this website reliable?' },
      { word: 'investigate', ar: 'يحقّق / يستقصي', pos: 'verb', example: 'Claude investigates the question from many angles.' },
    ],
    quiz: [
      {
        q: 'When should you turn on web search?',
        qAr: 'متى يجب أن تفعّل البحث في الويب؟',
        options: ['For current information like news or prices', 'For grammar questions only', 'Never'],
        answer: 0,
        explain: { en: 'Web search gives Claude up-to-date information.', ar: 'البحث في الويب يعطي Claude معلومات حديثة.' },
      },
      {
        q: 'What should you do with the sources in an answer?',
        qAr: 'ماذا تفعل بالمصادر في الإجابة؟',
        options: ['Ignore them', 'Open them and check the important parts', 'Delete them'],
        answer: 1,
        explain: { en: 'Checking sources is part of using AI responsibly.', ar: 'التحقق من المصادر جزء من الاستخدام المسؤول للذكاء الاصطناعي.' },
      },
    ],
  },
  {
    id: 'connectors-mcp',
    track: 'features',
    title: 'Connectors and MCP',
    titleAr: 'الموصلات وبروتوكول MCP',
    summary: {
      en: 'Connect Claude to apps like Google Drive or Slack so it can find your information and take actions.',
      ar: 'اربط Claude بتطبيقات مثل Google Drive أو Slack حتى يجد معلوماتك وينفّذ مهام.',
    },
    level: 'Advanced',
    minutes: 7,
    icon: 'plug',
    sections: [
      {
        heading: 'Claude meets your apps',
        headingAr: 'Claude يلتقي بتطبيقاتك',
        paragraphs: [
          {
            en: 'Connectors let Claude access your apps and services. For example, Claude can search your Google Drive files, read a Slack thread, or create a task in a project tool.',
            ar: 'الموصلات تتيح لـ Claude الوصول إلى تطبيقاتك وخدماتك. مثلًا، يستطيع Claude البحث في ملفات Google Drive، أو قراءة محادثة في Slack، أو إنشاء مهمة في أداة إدارة مشاريع.',
          },
          {
            en: 'Claude only gets the same permissions you have. If you cannot open a file in the app, Claude cannot open it either.',
            ar: 'يحصل Claude على الصلاحيات نفسها التي لديك فقط. إذا لم تستطع فتح ملف في التطبيق، فلن يستطيع Claude فتحه أيضًا.',
          },
        ],
      },
      {
        heading: 'What is MCP?',
        headingAr: 'ما هو MCP؟',
        paragraphs: [
          {
            en: 'MCP, the Model Context Protocol, is an open standard for connecting AI to tools and data. Think of it like a universal plug: one standard shape that many apps can use.',
            ar: 'MCP، أي بروتوكول سياق النموذج، معيار مفتوح لربط الذكاء الاصطناعي بالأدوات والبيانات. فكّر فيه كقابس عالمي: شكل واحد موحّد تستطيع تطبيقات كثيرة استخدامه.',
          },
          {
            en: 'You can browse ready-made connectors in the Connectors Directory, and developers can build their own MCP servers to integrate any service.',
            ar: 'يمكنك تصفّح الموصلات الجاهزة في دليل الموصلات، ويستطيع المطورون بناء خوادم MCP خاصة بهم لدمج أي خدمة.',
          },
        ],
      },
    ],
    example: {
      bad: 'What did my team decide?',
      good: 'Using the Slack connector, read the #project-alpha channel from this week. Summarize the decisions in 5 bullet points and list any tasks that mention my name.',
      why: {
        en: 'You name the connector, the exact place, the time range, and the format.',
        ar: 'تحدد الموصل، والمكان بالضبط، والفترة الزمنية، والتنسيق.',
      },
    },
    tip: {
      en: 'Before you connect an app, read which permissions it needs. Only connect what you really use.',
      ar: 'قبل أن تربط تطبيقًا، اقرأ الصلاحيات التي يحتاجها. لا تربط إلا ما تستخدمه فعلًا.',
    },
    resources: [R.connectors, R.mcpCourse, R.claude101],
    video: R.vMcp201,
    vocab: [
      { word: 'connector', ar: 'موصل', pos: 'noun', example: 'I added the Google Drive connector.' },
      { word: 'permission', ar: 'إذن / صلاحية', pos: 'noun', example: 'The app asks for permission to read your files.' },
      { word: 'integrate', ar: 'يدمج', pos: 'verb', example: 'We integrate Claude with our tools.' },
      { word: 'access', ar: 'وصول / يصل إلى', pos: 'noun', example: 'Claude has access to my calendar.' },
      { word: 'protocol', ar: 'بروتوكول / معيار تواصل', pos: 'noun', example: 'MCP is an open protocol.' },
    ],
    quiz: [
      {
        q: 'Can Claude open a file that you are not allowed to open?',
        qAr: 'هل يستطيع Claude فتح ملف لا يُسمح لك بفتحه؟',
        options: ['Yes, always', 'No, it has the same permissions as you', 'Only on weekends'],
        answer: 1,
        explain: { en: 'Connectors follow your own permissions.', ar: 'الموصلات تتبع صلاحياتك أنت.' },
      },
      {
        q: 'MCP is best described as…',
        qAr: 'أفضل وصف لـ MCP هو…',
        options: ['A video game', 'An open standard for connecting AI to tools and data', 'A type of keyboard'],
        answer: 1,
        explain: { en: 'MCP = Model Context Protocol, an open standard.', ar: 'MCP = بروتوكول سياق النموذج، وهو معيار مفتوح.' },
      },
    ],
  },
  {
    id: 'skills',
    track: 'features',
    title: 'Skills: teach Claude your way',
    titleAr: 'المهارات: علّم Claude طريقتك',
    summary: {
      en: 'Skills are folders of instructions and resources that Claude loads automatically when a task needs them.',
      ar: 'المهارات مجلدات من التعليمات والموارد يحمّلها Claude تلقائيًا عندما تحتاجها المهمة.',
    },
    level: 'Advanced',
    minutes: 8,
    icon: 'puzzle',
    sections: [
      {
        heading: 'What is a skill?',
        headingAr: 'ما هي المهارة؟',
        paragraphs: [
          {
            en: 'A skill is a reusable folder with a SKILL.md file inside. The file has a name, a description, and instructions. It can also include scripts, templates, and examples.',
            ar: 'المهارة مجلد قابل لإعادة الاستخدام بداخله ملف SKILL.md. يحتوي الملف على اسم ووصف وتعليمات. ويمكن أن يتضمن أيضًا سكربتات وقوالب وأمثلة.',
          },
          {
            en: 'Anthropic provides skills for documents like Word, Excel, PowerPoint, and PDF. You can also create custom skills that add your own expertise or workflow, for example your company’s email style.',
            ar: 'توفر Anthropic مهارات للمستندات مثل Word وExcel وPowerPoint وPDF. ويمكنك أيضًا إنشاء مهارات مخصصة تضيف خبرتك أو سير عملك، مثل أسلوب البريد الإلكتروني في شركتك.',
          },
        ],
      },
      {
        heading: 'Loaded only when needed',
        headingAr: 'تُحمَّل فقط عند الحاجة',
        paragraphs: [
          {
            en: 'Claude always sees the short name and description of each skill. When your request matches a description, Claude loads the full instructions. This is called progressive disclosure.',
            ar: 'يرى Claude دائمًا الاسم والوصف القصير لكل مهارة. وعندما يطابق طلبك وصفًا ما، يحمّل Claude التعليمات الكاملة. يُسمى هذا الإفصاح التدريجي.',
          },
          {
            en: 'That is why the description matters so much: it must say what the skill does and when to use it. This website was built with the help of design skills in exactly this way.',
            ar: 'لهذا السبب الوصف مهم جدًا: يجب أن يقول ما تفعله المهارة ومتى تُستخدم. وقد بُني هذا الموقع بمساعدة مهارات تصميم بهذه الطريقة تمامًا.',
          },
        ],
      },
    ],
    example: {
      bad: 'Writing the same long instructions about your email style in every chat.',
      good: '---\nname: email-writer\ndescription: Write professional emails in our company style. Use when the user asks for an email, a reply, or a follow-up message.\n---\n# Email style\n1. Subject line under 8 words.\n2. Greeting: "Hi {name},"\n3. Main request in the first sentence.\n4. Sign off with "Best regards,".',
      why: {
        en: 'Write it once as a skill, and Claude applies it automatically whenever you ask for an email.',
        ar: 'اكتبها مرة واحدة كمهارة، وسيطبّقها Claude تلقائيًا كلما طلبت بريدًا إلكترونيًا.',
      },
    },
    tip: {
      en: 'You can turn skills on or off in Claude’s settings, and you can even ask Claude to help you write a new skill.',
      ar: 'يمكنك تفعيل المهارات أو إيقافها من إعدادات Claude، ويمكنك حتى أن تطلب من Claude مساعدتك في كتابة مهارة جديدة.',
    },
    resources: [R.skillsHelp, R.useSkills, R.createSkill, R.agentSkillsCourse, R.skillsDocs],
    vocab: [
      { word: 'skill', ar: 'مهارة', pos: 'noun', example: 'Writing clear emails is an important skill.' },
      { word: 'reusable', ar: 'قابل لإعادة الاستخدام', pos: 'adjective', example: 'A skill is a reusable set of instructions.' },
      { word: 'workflow', ar: 'سير عمل', pos: 'noun', example: 'Our workflow has four steps.' },
      { word: 'load', ar: 'يحمّل', pos: 'verb', example: 'Claude loads the skill when it needs it.' },
      { word: 'expertise', ar: 'خبرة', pos: 'noun', example: 'Skills give Claude special expertise.' },
    ],
    quiz: [
      {
        q: 'Which file is the heart of every skill?',
        qAr: 'أي ملف هو قلب كل مهارة؟',
        options: ['SKILL.md', 'index.html', 'photo.jpg'],
        answer: 0,
        explain: { en: 'SKILL.md holds the name, description, and instructions.', ar: 'ملف SKILL.md يحتوي على الاسم والوصف والتعليمات.' },
      },
      {
        q: 'Why is the skill description so important?',
        qAr: 'لماذا وصف المهارة مهم جدًا؟',
        options: ['It changes the colors', 'Claude uses it to decide when to load the skill', 'It is not important'],
        answer: 1,
        explain: { en: 'The description tells Claude what the skill does and when to use it.', ar: 'الوصف يخبر Claude بما تفعله المهارة ومتى يستخدمها.' },
      },
    ],
  },
  {
    id: 'claude-code',
    track: 'features',
    title: 'Claude Code: an AI teammate for coding',
    titleAr: 'Claude Code: زميل برمجة ذكي',
    summary: {
      en: 'An agent that reads your project, edits files, and runs commands — in the terminal, your IDE, the desktop app, or the browser.',
      ar: 'وكيل يقرأ مشروعك، ويعدّل الملفات، وينفّذ الأوامر — في الطرفية، أو محرر الأكواد، أو تطبيق سطح المكتب، أو المتصفح.',
    },
    level: 'Advanced',
    minutes: 8,
    icon: 'terminal',
    sections: [
      {
        heading: 'From chat to action',
        headingAr: 'من المحادثة إلى التنفيذ',
        paragraphs: [
          {
            en: 'In a normal chat, you copy code back and forth. Claude Code is different: it works directly in your project repository. It can read many files, make changes, and run commands like tests.',
            ar: 'في المحادثة العادية، تنسخ الكود ذهابًا وإيابًا. Claude Code مختلف: فهو يعمل مباشرة داخل مستودع مشروعك. يستطيع قراءة ملفات كثيرة، وإجراء تغييرات، وتنفيذ أوامر مثل الاختبارات.',
          },
          {
            en: 'It asks you to approve important actions, and you can review every change. You stay in control of your code.',
            ar: 'يطلب منك الموافقة على الإجراءات المهمة، ويمكنك مراجعة كل تغيير. تبقى أنت المتحكم في الكود الخاص بك.',
          },
        ],
      },
      {
        heading: 'CLAUDE.md and good habits',
        headingAr: 'ملف CLAUDE.md والعادات الجيدة',
        paragraphs: [
          {
            en: 'A CLAUDE.md file gives Claude permanent instructions about your project: how to run it, how to test it, and which style rules to follow.',
            ar: 'ملف CLAUDE.md يعطي Claude تعليمات دائمة عن مشروعك: كيف يُشغَّل، وكيف يُختبَر، وأي قواعد أسلوب يجب اتباعها.',
          },
          {
            en: 'Good habits: ask for a plan before big changes, give one clear task at a time, and describe how to check that the work is correct.',
            ar: 'عادات جيدة: اطلب خطة قبل التغييرات الكبيرة، وأعطِ مهمة واحدة واضحة في كل مرة، وصِف كيف تتحقق من أن العمل صحيح.',
          },
        ],
      },
    ],
    example: {
      bad: 'make the app better',
      good: 'In this React app, the "Save word" button does not update the counter in the navbar. First, find the cause and explain it in simple English. Then propose a fix, wait for my approval, and run the build to check it.',
      why: {
        en: 'A clear problem, an order of steps, a moment for approval, and a way to verify.',
        ar: 'مشكلة واضحة، وترتيب للخطوات، ولحظة للموافقة، وطريقة للتحقق.',
      },
    },
    tip: {
      en: 'Great English practice for developers: ask Claude Code to explain each change in two simple sentences.',
      ar: 'تمرين إنجليزية رائع للمطورين: اطلب من Claude Code شرح كل تغيير في جملتين بسيطتين.',
    },
    resources: [R.claudeCodeDocs, R.claudeCode101, R.claudeCodeMemory],
    video: R.vClaudeCodeBP,
    vocab: [
      { word: 'agent', ar: 'وكيل', pos: 'noun', example: 'Claude Code is an AI agent for coding.' },
      { word: 'terminal', ar: 'الطرفية (سطر الأوامر)', pos: 'noun', example: 'Open the terminal and run the command.' },
      { word: 'repository', ar: 'مستودع (أكواد)', pos: 'noun', example: 'Clone the repository from GitHub.' },
      { word: 'command', ar: 'أمر', pos: 'noun', example: 'Type this command and press Enter.' },
      { word: 'approve', ar: 'يوافق على', pos: 'verb', example: 'Please approve the changes before I continue.' },
    ],
    quiz: [
      {
        q: 'What is CLAUDE.md used for?',
        qAr: 'ما فائدة ملف CLAUDE.md؟',
        options: ['Storing photos', 'Giving Claude permanent instructions about your project', 'Playing music'],
        answer: 1,
        explain: { en: 'CLAUDE.md holds project instructions Claude reads every session.', ar: 'CLAUDE.md يحتوي على تعليمات المشروع التي يقرأها Claude في كل جلسة.' },
      },
      {
        q: 'What is a good habit before a big change?',
        qAr: 'ما العادة الجيدة قبل تغيير كبير؟',
        options: ['Ask Claude for a plan first', 'Delete the project', 'Give ten tasks at once'],
        answer: 0,
        explain: { en: 'A plan lets you check the approach before any code changes.', ar: 'الخطة تتيح لك مراجعة الطريقة قبل أي تغيير في الكود.' },
      },
    ],
  },
]
