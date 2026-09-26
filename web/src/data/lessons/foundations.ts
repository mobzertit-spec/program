import { R } from '../resources'
import type { LessonInput } from './types'

export const foundations: LessonInput[] = [
  {
    id: 'meet-claude',
    track: 'foundations',
    title: 'Meet Claude',
    titleAr: 'تعرّف على Claude',
    summary: {
      en: 'What Claude is, what it can do for you, and how to start your first conversation.',
      ar: 'ما هو Claude، وماذا يمكنه أن يفعل لك، وكيف تبدأ محادثتك الأولى.',
    },
    level: 'Beginner',
    minutes: 5,
    icon: 'sparkles',
    sections: [
      {
        heading: 'An assistant you can talk to',
        headingAr: 'مساعد يمكنك التحدث معه',
        paragraphs: [
          {
            en: 'Claude is an AI assistant made by Anthropic. You talk to it in normal language, just like you would write a message to a smart friend.',
            ar: 'Claude هو مساعد ذكاء اصطناعي صنعته شركة Anthropic. تتحدث معه بلغة عادية، تمامًا كما تكتب رسالة لصديق ذكي.',
          },
          {
            en: 'It can help you write emails, explain difficult ideas, summarize long documents, write code, and practice a new language.',
            ar: 'يمكنه مساعدتك في كتابة الرسائل الإلكترونية، وشرح الأفكار الصعبة، وتلخيص المستندات الطويلة، وكتابة الأكواد، وممارسة لغة جديدة.',
          },
        ],
      },
      {
        heading: 'What you should know',
        headingAr: 'ما يجب أن تعرفه',
        paragraphs: [
          {
            en: 'Claude is powerful, but it can make mistakes. Always check important facts, numbers, and dates before you use them.',
            ar: 'Claude قوي، لكنه قد يرتكب أخطاء. تحقق دائمًا من الحقائق والأرقام والتواريخ المهمة قبل أن تستخدمها.',
          },
          {
            en: 'The quality of the answer depends on the quality of your question. In the next lessons, you will learn how to ask better questions.',
            ar: 'جودة الإجابة تعتمد على جودة سؤالك. في الدروس القادمة، ستتعلم كيف تطرح أسئلة أفضل.',
          },
        ],
      },
    ],
    example: {
      bad: 'email',
      good: 'Write a short, friendly email to my manager asking for Friday off. Keep it under 80 words.',
      why: {
        en: 'The second message tells Claude the task, the reader, the tone, and the length.',
        ar: 'الرسالة الثانية تخبر Claude بالمهمة، والقارئ، والأسلوب، والطول.',
      },
    },
    tip: {
      en: 'Write to Claude in English from day one. Every prompt is a small writing exercise.',
      ar: 'اكتب لـ Claude بالإنجليزية من اليوم الأول. كل طلب هو تمرين كتابة صغير.',
    },
    resources: [R.getStarted, R.claude101],
    vocab: [
      { word: 'assistant', ar: 'مساعد', pos: 'noun', example: 'Claude is a helpful assistant.' },
      { word: 'summarize', ar: 'يلخّص', pos: 'verb', example: 'Please summarize this article.' },
      { word: 'mistake', ar: 'خطأ', pos: 'noun', example: 'Everyone makes mistakes.' },
      { word: 'quality', ar: 'جودة', pos: 'noun', example: 'The quality of the answer is high.' },
      { word: 'powerful', ar: 'قوي', pos: 'adjective', example: 'This is a powerful tool.' },
    ],
    quiz: [
      {
        q: 'What should you do with important facts from Claude?',
        qAr: 'ماذا يجب أن تفعل بالحقائق المهمة من Claude؟',
        options: ['Use them without checking', 'Check them before using them', 'Ignore them completely'],
        answer: 1,
        explain: { en: 'Claude can make mistakes, so verify important information.', ar: 'قد يخطئ Claude، لذا تحقق من المعلومات المهمة.' },
      },
      {
        q: 'Which word means "يلخّص"?',
        qAr: 'أي كلمة تعني "يلخّص"؟',
        options: ['explain', 'summarize', 'write'],
        answer: 1,
        explain: { en: 'To summarize is to give the main points in a short form.', ar: 'التلخيص هو ذكر النقاط الرئيسية بشكل مختصر.' },
      },
    ],
  },
  {
    id: 'claude-apps',
    track: 'foundations',
    title: 'Find your way around Claude',
    titleAr: 'تجوّل داخل Claude',
    summary: {
      en: 'Where to use Claude, how to start a chat, add files, search the web, and talk with your voice.',
      ar: 'أين تستخدم Claude، وكيف تبدأ محادثة، وتضيف ملفات، وتبحث في الويب، وتتحدث بصوتك.',
    },
    level: 'Beginner',
    minutes: 6,
    icon: 'app',
    sections: [
      {
        heading: 'One assistant, many places',
        headingAr: 'مساعد واحد في أماكن كثيرة',
        paragraphs: [
          {
            en: 'You can use Claude in a web browser at claude.ai, in the desktop app for Mac and Windows, and in the mobile app for iPhone and Android. Your chats are saved in your account, so you can continue on another device.',
            ar: 'يمكنك استخدام Claude في متصفح الويب عبر claude.ai، وفي تطبيق سطح المكتب لأجهزة Mac وWindows، وفي تطبيق الجوال لأجهزة iPhone وAndroid. محادثاتك محفوظة في حسابك، لذا يمكنك المتابعة على جهاز آخر.',
          },
          {
            en: 'Every conversation starts in the message box. Type your request, press Enter, and read the answer. Start a new chat for each new topic, so Claude does not mix different subjects.',
            ar: 'كل محادثة تبدأ من صندوق الرسائل. اكتب طلبك، واضغط Enter، واقرأ الإجابة. ابدأ محادثة جديدة لكل موضوع جديد، حتى لا يخلط Claude بين المواضيع المختلفة.',
          },
        ],
      },
      {
        heading: 'The plus button and voice mode',
        headingAr: 'زر الإضافة ووضع الصوت',
        paragraphs: [
          {
            en: 'The "+" button in the message box is your toolbox. From there you can attach files and images, turn on web search, and open other features like connectors.',
            ar: 'زر "+" في صندوق الرسائل هو صندوق أدواتك. من خلاله يمكنك إرفاق الملفات والصور، وتفعيل البحث في الويب، وفتح ميزات أخرى مثل الموصلات.',
          },
          {
            en: 'Voice mode lets you speak to Claude and hear it answer. It works best on your phone and supports many languages — a great way to practice English speaking.',
            ar: 'وضع الصوت يتيح لك التحدث إلى Claude وسماع إجابته. يعمل بشكل أفضل على هاتفك ويدعم لغات كثيرة — طريقة رائعة لتدريب التحدث بالإنجليزية.',
          },
        ],
      },
    ],
    example: {
      bad: '(A new question about cooking inside an old chat about your CV)',
      good: 'Start a new chat: "I want to cook a healthy dinner for four people in 30 minutes. I have chicken, rice, and vegetables. Give me one simple recipe."',
      why: {
        en: 'A new chat keeps the context clean, so Claude focuses only on the new task.',
        ar: 'المحادثة الجديدة تُبقي السياق نظيفًا، فيركّز Claude على المهمة الجديدة فقط.',
      },
    },
    tip: {
      en: 'Change the app language to English in the settings. You will learn words like "settings", "enable", and "upload" every day.',
      ar: 'غيّر لغة التطبيق إلى الإنجليزية من الإعدادات. ستتعلم كلمات مثل "settings" و"enable" و"upload" كل يوم.',
    },
    resources: [R.getStarted, R.voice, R.webSearch],
    vocab: [
      { word: 'setting', ar: 'إعداد', pos: 'noun', example: 'Open the settings to change the language.' },
      { word: 'feature', ar: 'ميزة', pos: 'noun', example: 'Voice mode is my favorite feature.' },
      { word: 'voice', ar: 'صوت', pos: 'noun', example: 'You can talk to Claude with your voice.' },
      { word: 'enable', ar: 'يفعّل', pos: 'verb', example: 'Enable web search before you ask.' },
      { word: 'toggle', ar: 'يبدّل (تشغيل/إيقاف)', pos: 'verb', example: 'Toggle the switch to turn it on.' },
    ],
    quiz: [
      {
        q: 'Where can you attach a file or turn on web search?',
        qAr: 'من أين يمكنك إرفاق ملف أو تفعيل البحث في الويب؟',
        options: ['From the "+" button in the message box', 'Only from the website footer', 'You cannot do this'],
        answer: 0,
        explain: { en: 'The "+" button opens files, web search, and other tools.', ar: 'زر "+" يفتح الملفات والبحث في الويب وأدوات أخرى.' },
      },
      {
        q: 'When should you start a new chat?',
        qAr: 'متى يجب أن تبدأ محادثة جديدة؟',
        options: ['Never', 'Every five minutes', 'When you start a new topic'],
        answer: 2,
        explain: { en: 'One topic per chat keeps answers focused.', ar: 'موضوع واحد لكل محادثة يُبقي الإجابات مركّزة.' },
      },
    ],
  },
  {
    id: 'be-specific',
    track: 'foundations',
    title: 'Be clear and specific',
    titleAr: 'كن واضحًا ومحددًا',
    summary: {
      en: 'Vague questions get vague answers. Learn to say exactly what you want.',
      ar: 'الأسئلة الغامضة تحصل على إجابات غامضة. تعلّم أن تقول بالضبط ما تريده.',
    },
    level: 'Beginner',
    minutes: 6,
    icon: 'target',
    sections: [
      {
        heading: 'Imagine a new colleague',
        headingAr: 'تخيّل زميلًا جديدًا',
        paragraphs: [
          {
            en: 'Think of Claude as a brilliant new colleague who knows nothing about your project. If your instructions are unclear, the result will be unclear too.',
            ar: 'فكّر في Claude كزميل جديد عبقري لا يعرف شيئًا عن مشروعك. إذا كانت تعليماتك غير واضحة، فستكون النتيجة غير واضحة أيضًا.',
          },
          {
            en: 'A good test: show your prompt to a friend. If they would be confused, Claude will probably be confused as well.',
            ar: 'اختبار جيد: اعرض طلبك على صديق. إذا كان سيشعر بالارتباك، فمن المحتمل أن يرتبك Claude أيضًا.',
          },
        ],
      },
      {
        heading: 'Say what, who, and how',
        headingAr: 'قل ماذا، ولمن، وكيف',
        paragraphs: [
          {
            en: 'A specific prompt describes the task, the audience, and the format. For example: the length, the style, and whether you want a list or a paragraph.',
            ar: 'الطلب المحدد يصف المهمة، والجمهور، والتنسيق. على سبيل المثال: الطول، والأسلوب، وما إذا كنت تريد قائمة أو فقرة.',
          },
          {
            en: 'Use simple, direct sentences. Numbered steps are easier to follow than one long paragraph.',
            ar: 'استخدم جملًا بسيطة ومباشرة. الخطوات المرقّمة أسهل في المتابعة من فقرة واحدة طويلة.',
          },
        ],
      },
    ],
    example: {
      bad: 'Tell me about London.',
      good: 'I am visiting London for 3 days in winter with my two kids (ages 7 and 10). Suggest a simple plan with one indoor activity per day. Use a numbered list.',
      why: {
        en: 'The specific version gives the goal, the details, and the format. Claude does not need to guess.',
        ar: 'النسخة المحددة تعطي الهدف والتفاصيل والتنسيق. لا يحتاج Claude إلى التخمين.',
      },
    },
    tip: {
      en: 'Words like "short", "detailed", "formal", and "friendly" change the answer a lot. Use them!',
      ar: 'كلمات مثل "قصير" و"مفصّل" و"رسمي" و"ودود" تغيّر الإجابة كثيرًا. استخدمها!',
    },
    resources: [R.bestPractices, R.promptTutorial, R.claude101],
    video: R.vPrompting101,
    vocab: [
      { word: 'specific', ar: 'محدد', pos: 'adjective', example: 'Please be more specific.' },
      { word: 'vague', ar: 'غامض / مبهم', pos: 'adjective', example: 'His answer was vague.' },
      { word: 'colleague', ar: 'زميل عمل', pos: 'noun', example: 'My colleague helped me today.' },
      { word: 'audience', ar: 'جمهور', pos: 'noun', example: 'Who is the audience for this text?' },
      { word: 'format', ar: 'تنسيق / شكل', pos: 'noun', example: 'Use a table format.' },
    ],
    quiz: [
      {
        q: 'Which prompt is more specific?',
        qAr: 'أي طلب أكثر تحديدًا؟',
        options: ['Write about dogs.', 'Write a 100-word funny poem about a lazy dog for children.', 'Dogs?'],
        answer: 1,
        explain: { en: 'It gives the length, the style, the topic, and the audience.', ar: 'يحدد الطول والأسلوب والموضوع والجمهور.' },
      },
      {
        q: '"Vague" is the opposite of…',
        qAr: 'كلمة "Vague" عكس…',
        options: ['clear', 'long', 'friendly'],
        answer: 0,
        explain: { en: 'Vague means unclear. Its opposite is clear or specific.', ar: 'غامض يعني غير واضح، وعكسه واضح أو محدد.' },
      },
    ],
  },
  {
    id: 'give-context',
    track: 'foundations',
    title: 'Give Claude context',
    titleAr: 'أعطِ Claude السياق',
    summary: {
      en: 'Explain why you need something. Context helps Claude make smarter choices.',
      ar: 'اشرح لماذا تحتاج شيئًا ما. السياق يساعد Claude على اتخاذ خيارات أذكى.',
    },
    level: 'Beginner',
    minutes: 6,
    icon: 'layers',
    sections: [
      {
        heading: 'Why context matters',
        headingAr: 'لماذا السياق مهم',
        paragraphs: [
          {
            en: 'Claude cannot read your mind. When you explain the purpose of a task, Claude can understand what a good answer looks like.',
            ar: 'لا يستطيع Claude قراءة أفكارك. عندما تشرح الهدف من المهمة، يستطيع Claude فهم شكل الإجابة الجيدة.',
          },
          {
            en: 'For example, "Explain photosynthesis" is fine. But "Explain photosynthesis to my 12-year-old son for his science test tomorrow" is much better.',
            ar: 'على سبيل المثال، "اشرح عملية البناء الضوئي" جيدة. لكن "اشرح عملية البناء الضوئي لابني ذي الاثني عشر عامًا لاختبار العلوم غدًا" أفضل بكثير.',
          },
        ],
      },
      {
        heading: 'Useful context to include',
        headingAr: 'سياق مفيد يجب تضمينه',
        paragraphs: [
          {
            en: 'Tell Claude who you are, who will read the result, what you already tried, and what success means for you.',
            ar: 'أخبر Claude من أنت، ومن سيقرأ النتيجة، وما الذي جربته بالفعل، وماذا يعني النجاح بالنسبة لك.',
          },
          {
            en: 'You can also paste background information, like notes, an article, or an old email. Claude will use it to give a better answer.',
            ar: 'يمكنك أيضًا لصق معلومات خلفية، مثل الملاحظات أو مقال أو بريد إلكتروني قديم. سيستخدمها Claude لإعطاء إجابة أفضل.',
          },
        ],
      },
    ],
    example: {
      bad: 'Fix my CV.',
      good: 'I am a junior web developer applying for my first job at a startup. Here is my CV. Improve the wording so it sounds confident but honest, and point out anything a recruiter might not like.',
      why: {
        en: 'Now Claude knows your level, your goal, and what kind of feedback you want.',
        ar: 'الآن يعرف Claude مستواك وهدفك ونوع الملاحظات التي تريدها.',
      },
    },
    tip: {
      en: 'Start your prompt with "I am…" or "I need this for…". These phrases add context naturally.',
      ar: 'ابدأ طلبك بـ "I am…" أو "I need this for…". هذه العبارات تضيف السياق بشكل طبيعي.',
    },
    resources: [R.bestPractices, R.claude101],
    vocab: [
      { word: 'context', ar: 'سياق', pos: 'noun', example: 'I need more context to understand.' },
      { word: 'purpose', ar: 'غرض / هدف', pos: 'noun', example: 'What is the purpose of this meeting?' },
      { word: 'background', ar: 'خلفية', pos: 'noun', example: 'Here is some background information.' },
      { word: 'improve', ar: 'يحسّن', pos: 'verb', example: 'I want to improve my English.' },
      { word: 'confident', ar: 'واثق', pos: 'adjective', example: 'She sounds confident.' },
    ],
    quiz: [
      {
        q: 'Which one adds useful context?',
        qAr: 'أيّ منها يضيف سياقًا مفيدًا؟',
        options: ['Make it good.', 'This is for a job interview at a bank tomorrow.', 'Please hurry.'],
        answer: 1,
        explain: { en: 'It tells Claude the situation and the goal.', ar: 'يخبر Claude بالموقف والهدف.' },
      },
      {
        q: 'What does "purpose" mean?',
        qAr: 'ماذا تعني كلمة "purpose"؟',
        options: ['غرض / هدف', 'مشكلة', 'نتيجة'],
        answer: 0,
        explain: { en: 'Purpose = the reason you do something.', ar: 'الغرض = السبب الذي تفعل الشيء من أجله.' },
      },
    ],
  },
  {
    id: 'iterate',
    track: 'foundations',
    title: 'Iterate like a conversation',
    titleAr: 'حسّن الإجابة عبر المحادثة',
    summary: {
      en: 'Your first prompt is a draft. Refine the answer with short follow-up messages.',
      ar: 'طلبك الأول مسودة. حسّن الإجابة برسائل متابعة قصيرة.',
    },
    level: 'Intermediate',
    minutes: 5,
    icon: 'refresh',
    sections: [
      {
        heading: 'Nobody gets it perfect the first time',
        headingAr: 'لا أحد يصل إلى الكمال من المرة الأولى',
        paragraphs: [
          {
            en: 'Working with Claude is a conversation. If the first answer is not right, you do not need to start again. Just tell Claude what to change.',
            ar: 'العمل مع Claude هو محادثة. إذا لم تكن الإجابة الأولى صحيحة، فلا تحتاج إلى البدء من جديد. فقط أخبر Claude بما يجب تغييره.',
          },
          {
            en: 'Good follow-ups are short and precise: "Make it shorter", "Add an example", or "The second point is wrong, because…".',
            ar: 'رسائل المتابعة الجيدة قصيرة ودقيقة: "اجعله أقصر"، أو "أضف مثالًا"، أو "النقطة الثانية خاطئة، لأن…".',
          },
        ],
      },
      {
        heading: 'Ask Claude for feedback too',
        headingAr: 'اطلب من Claude ملاحظاته أيضًا',
        paragraphs: [
          {
            en: 'You can ask Claude to improve your prompt: "How can I make this request clearer?" It will suggest missing details.',
            ar: 'يمكنك أن تطلب من Claude تحسين طلبك: "كيف يمكنني جعل هذا الطلب أوضح؟" وسيقترح التفاصيل الناقصة.',
          },
          {
            en: 'When a conversation becomes very long or goes in the wrong direction, start a new chat with a better first prompt.',
            ar: 'عندما تصبح المحادثة طويلة جدًا أو تسير في الاتجاه الخاطئ، ابدأ محادثة جديدة بطلب أول أفضل.',
          },
        ],
      },
    ],
    example: {
      bad: 'No. Wrong. Again.',
      good: 'Good start! Please keep the first paragraph, but make the ending more positive and remove the technical words.',
      why: {
        en: 'Claude learns exactly what worked and what needs to change.',
        ar: 'يعرف Claude بالضبط ما الذي نجح وما الذي يحتاج إلى تغيير.',
      },
    },
    tip: {
      en: 'Follow-ups are perfect English practice: short, polite, and clear sentences.',
      ar: 'رسائل المتابعة تمرين مثالي للإنجليزية: جمل قصيرة ومهذبة وواضحة.',
    },
    resources: [R.claude101, R.bestPractices],
    vocab: [
      { word: 'iterate', ar: 'يكرّر للتحسين', pos: 'verb', example: 'We iterate until the design is perfect.' },
      { word: 'draft', ar: 'مسودة', pos: 'noun', example: 'This is only the first draft.' },
      { word: 'refine', ar: 'يصقل / يحسّن', pos: 'verb', example: 'Let’s refine the plan.' },
      { word: 'precise', ar: 'دقيق / محدد', pos: 'adjective', example: 'Give precise instructions.' },
      { word: 'feedback', ar: 'ملاحظات / تقييم', pos: 'noun', example: 'Thanks for the feedback!' },
    ],
    quiz: [
      {
        q: 'The first answer is not perfect. What should you do?',
        qAr: 'الإجابة الأولى ليست مثالية. ماذا يجب أن تفعل؟',
        options: ['Give up', 'Send a short follow-up about what to change', 'Repeat the same prompt'],
        answer: 1,
        explain: { en: 'Clear follow-ups improve the result quickly.', ar: 'رسائل المتابعة الواضحة تحسّن النتيجة بسرعة.' },
      },
      {
        q: 'A "draft" is…',
        qAr: 'كلمة "draft" تعني…',
        options: ['مسودة', 'نسخة نهائية', 'عنوان'],
        answer: 0,
        explain: { en: 'A draft is an early version of a text.', ar: 'المسودة هي نسخة أولية من النص.' },
      },
    ],
  },
  {
    id: 'ai-fluency',
    track: 'foundations',
    title: 'The 4D framework: use AI wisely',
    titleAr: 'إطار الأبعاد الأربعة: استخدم الذكاء الاصطناعي بحكمة',
    summary: {
      en: 'Anthropic’s AI Fluency framework in four words: Delegation, Description, Discernment, and Diligence.',
      ar: 'إطار الطلاقة في الذكاء الاصطناعي من Anthropic في أربع كلمات: التفويض، والوصف، والتمييز، والعناية.',
    },
    level: 'Beginner',
    minutes: 8,
    icon: 'shield',
    sections: [
      {
        heading: 'Delegation and Description',
        headingAr: 'التفويض والوصف',
        paragraphs: [
          {
            en: 'Delegation means deciding which work to do yourself, which work to do with AI, and which work to give to AI. Not every task is a good task for Claude.',
            ar: 'التفويض يعني أن تقرر أي عمل تقوم به بنفسك، وأي عمل تقوم به مع الذكاء الاصطناعي، وأي عمل تعطيه للذكاء الاصطناعي. ليست كل مهمة مناسبة لـ Claude.',
          },
          {
            en: 'Description means explaining clearly what you want: the goal, the context, and the kind of result. Everything you learned about clear prompts is part of Description.',
            ar: 'الوصف يعني أن تشرح بوضوح ما تريده: الهدف، والسياق، ونوع النتيجة. كل ما تعلمته عن الطلبات الواضحة جزء من الوصف.',
          },
        ],
      },
      {
        heading: 'Discernment and Diligence',
        headingAr: 'التمييز والعناية',
        paragraphs: [
          {
            en: 'Discernment means judging the answer carefully. Is it correct? Is it complete? Does it make sense? You are the expert who decides if the result is good enough.',
            ar: 'التمييز يعني أن تحكم على الإجابة بعناية. هل هي صحيحة؟ هل هي كاملة؟ هل هي منطقية؟ أنت الخبير الذي يقرر إن كانت النتيجة جيدة بما يكفي.',
          },
          {
            en: 'Diligence means being responsible for how you use AI. Be honest when AI helped you, protect private information, and take responsibility for the final work.',
            ar: 'العناية تعني أن تكون مسؤولًا عن طريقة استخدامك للذكاء الاصطناعي. كن صادقًا عندما يساعدك الذكاء الاصطناعي، واحمِ المعلومات الخاصة، وتحمّل مسؤولية العمل النهائي.',
          },
        ],
      },
    ],
    example: {
      bad: 'Write my university essay for me. I will submit it as my own work.',
      good: 'I wrote this essay for my English class. Please point out grammar mistakes and unclear sentences, but do not rewrite it. I want to fix it myself.',
      why: {
        en: 'The second prompt uses AI to learn, keeps the work honest, and leaves the final decisions to you.',
        ar: 'الطلب الثاني يستخدم الذكاء الاصطناعي للتعلّم، ويحافظ على نزاهة العمل، ويترك القرارات النهائية لك.',
      },
    },
    tip: {
      en: 'Never paste passwords, bank details, or other people’s private data into any AI chat.',
      ar: 'لا تلصق أبدًا كلمات المرور أو التفاصيل البنكية أو البيانات الخاصة بالآخرين في أي محادثة مع الذكاء الاصطناعي.',
    },
    resources: [R.aiFluency, R.aiFluencyStudents, R.incognito],
    video: R.vAiFluency4D,
    vocab: [
      { word: 'delegate', ar: 'يفوّض', pos: 'verb', example: 'A good manager knows how to delegate tasks.' },
      { word: 'discernment', ar: 'تمييز / حُسن تقدير', pos: 'noun', example: 'Use discernment when you read online news.' },
      { word: 'diligence', ar: 'عناية / اجتهاد', pos: 'noun', example: 'She finished the project with great diligence.' },
      { word: 'responsible', ar: 'مسؤول', pos: 'adjective', example: 'You are responsible for your final work.' },
      { word: 'verify', ar: 'يتحقّق من', pos: 'verb', example: 'Always verify the numbers in a report.' },
    ],
    quiz: [
      {
        q: 'Which "D" means judging if Claude’s answer is correct and useful?',
        qAr: 'أي بُعد يعني الحكم على صحة إجابة Claude وفائدتها؟',
        options: ['Delegation', 'Discernment', 'Description'],
        answer: 1,
        explain: { en: 'Discernment = evaluating the output carefully.', ar: 'التمييز = تقييم الناتج بعناية.' },
      },
      {
        q: 'What is a good example of Diligence?',
        qAr: 'ما المثال الجيد على العناية؟',
        options: ['Sharing a friend’s private data with AI', 'Being honest that AI helped you', 'Copying the answer without reading it'],
        answer: 1,
        explain: { en: 'Diligence is about honesty, privacy, and responsibility.', ar: 'العناية تتعلق بالصدق والخصوصية والمسؤولية.' },
      },
    ],
  },
]
