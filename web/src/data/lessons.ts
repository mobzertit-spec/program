export type Level = 'Beginner' | 'Intermediate' | 'Advanced'

export type Bilingual = { en: string; ar: string }

export type VocabItem = {
  word: string
  ar: string
  pos: string
  example: string
}

export type QuizQuestion = {
  q: string
  qAr: string
  options: string[]
  answer: number
  explain: Bilingual
}

export type Lesson = {
  id: string
  number: number
  title: string
  titleAr: string
  summary: Bilingual
  level: Level
  minutes: number
  icon: 'sparkles' | 'target' | 'layers' | 'quote' | 'user' | 'code' | 'brain' | 'refresh' | 'graduation' | 'file'
  sections: { heading: string; headingAr: string; paragraphs: Bilingual[] }[]
  example?: { bad: string; good: string; why: Bilingual }
  tip: Bilingual
  vocab: VocabItem[]
  quiz: QuizQuestion[]
}

export const lessons: Lesson[] = [
  {
    id: 'meet-claude',
    number: 1,
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
    id: 'be-specific',
    number: 2,
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
    number: 3,
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
    id: 'use-examples',
    number: 4,
    title: 'Show, don’t just tell',
    titleAr: 'أرِه ولا تكتفِ بالوصف',
    summary: {
      en: 'Examples are the fastest way to show Claude the style and format you want.',
      ar: 'الأمثلة هي أسرع طريقة لتُري Claude الأسلوب والتنسيق الذي تريده.',
    },
    level: 'Intermediate',
    minutes: 7,
    icon: 'quote',
    sections: [
      {
        heading: 'The power of examples',
        headingAr: 'قوة الأمثلة',
        paragraphs: [
          {
            en: 'Sometimes it is hard to describe the style you want. Instead, give Claude one or two examples, and it will follow the same pattern.',
            ar: 'أحيانًا يكون من الصعب وصف الأسلوب الذي تريده. بدلًا من ذلك، أعطِ Claude مثالًا أو مثالين، وسيتبع النمط نفسه.',
          },
          {
            en: 'This technique is often called "few-shot prompting". It works very well for tasks like writing product descriptions or creating quiz questions.',
            ar: 'تُسمى هذه التقنية غالبًا "few-shot prompting". وهي تعمل بشكل ممتاز لمهام مثل كتابة أوصاف المنتجات أو إنشاء أسئلة الاختبارات.',
          },
        ],
      },
      {
        heading: 'Good examples are varied',
        headingAr: 'الأمثلة الجيدة متنوعة',
        paragraphs: [
          {
            en: 'Make your examples different from each other. If all examples are similar, Claude may copy them too closely.',
            ar: 'اجعل أمثلتك مختلفة عن بعضها. إذا كانت كل الأمثلة متشابهة، قد ينسخها Claude بشكل مبالغ فيه.',
          },
          {
            en: 'Clearly separate the examples from your instructions, so Claude knows which part is an example and which part is the real task.',
            ar: 'افصل الأمثلة بوضوح عن تعليماتك، حتى يعرف Claude أي جزء هو مثال وأي جزء هو المهمة الحقيقية.',
          },
        ],
      },
    ],
    example: {
      bad: 'Make English sentences for the word "borrow".',
      good: 'Create 3 example sentences for a new word, like this:\nWord: "improve" → "I read every day to improve my vocabulary."\nWord: "avoid" → "Try to avoid long sentences in emails."\nNow do the same for: "borrow"',
      why: {
        en: 'The examples show the exact format and the simple level of the sentences.',
        ar: 'الأمثلة توضح التنسيق الدقيق والمستوى البسيط للجمل.',
      },
    },
    tip: {
      en: 'Learning English? Give Claude an example sentence you like, and ask for ten more in the same style.',
      ar: 'تتعلم الإنجليزية؟ أعطِ Claude جملة تعجبك واطلب عشر جمل أخرى بنفس الأسلوب.',
    },
    vocab: [
      { word: 'example', ar: 'مثال', pos: 'noun', example: 'Can you give me an example?' },
      { word: 'pattern', ar: 'نمط', pos: 'noun', example: 'Follow the same pattern.' },
      { word: 'technique', ar: 'تقنية / أسلوب', pos: 'noun', example: 'This is a useful technique.' },
      { word: 'separate', ar: 'يفصل', pos: 'verb', example: 'Separate the eggs.' },
      { word: 'similar', ar: 'متشابه', pos: 'adjective', example: 'These two words are similar.' },
    ],
    quiz: [
      {
        q: 'Why should examples be different from each other?',
        qAr: 'لماذا يجب أن تكون الأمثلة مختلفة عن بعضها؟',
        options: ['To make the prompt longer', 'So Claude does not copy them too closely', 'It does not matter'],
        answer: 1,
        explain: { en: 'Varied examples teach the pattern, not the exact words.', ar: 'الأمثلة المتنوعة تعلّم النمط، لا الكلمات نفسها.' },
      },
      {
        q: '"Pattern" in Arabic is…',
        qAr: 'كلمة "Pattern" بالعربية هي…',
        options: ['نمط', 'صورة', 'سؤال'],
        answer: 0,
        explain: { en: 'A pattern is a repeated form or design.', ar: 'النمط هو شكل أو تصميم يتكرر.' },
      },
    ],
  },
  {
    id: 'role-and-tone',
    number: 5,
    title: 'Set a role and a tone',
    titleAr: 'حدّد دورًا وأسلوبًا',
    summary: {
      en: 'Ask Claude to act as a teacher, an editor, or an expert — and choose how it sounds.',
      ar: 'اطلب من Claude أن يتصرف كمعلم أو محرر أو خبير — واختر الطريقة التي يتحدث بها.',
    },
    level: 'Intermediate',
    minutes: 6,
    icon: 'user',
    sections: [
      {
        heading: 'Give Claude a role',
        headingAr: 'أعطِ Claude دورًا',
        paragraphs: [
          {
            en: 'A role tells Claude which knowledge and attitude to use. "You are a patient English teacher" leads to very different answers than "You are a strict editor".',
            ar: 'الدور يخبر Claude بأي معرفة وأي موقف يستخدم. عبارة "أنت معلم لغة إنجليزية صبور" تؤدي إلى إجابات مختلفة جدًا عن "أنت محرر صارم".',
          },
          {
            en: 'Roles are especially helpful for practice. Claude can play a job interviewer, a hotel receptionist, or a customer, so you can rehearse real conversations.',
            ar: 'الأدوار مفيدة بشكل خاص للتدريب. يمكن لـ Claude أن يلعب دور مُجري مقابلة عمل، أو موظف استقبال في فندق، أو عميل، حتى تتدرب على محادثات حقيقية.',
          },
        ],
      },
      {
        heading: 'Choose the tone',
        headingAr: 'اختر الأسلوب',
        paragraphs: [
          {
            en: 'Tone is the feeling of the text. It can be formal, casual, warm, funny, or serious. Always mention the tone when you write messages to other people.',
            ar: 'الأسلوب هو الشعور الذي ينقله النص. يمكن أن يكون رسميًا أو عفويًا أو دافئًا أو مضحكًا أو جادًا. اذكر الأسلوب دائمًا عندما تكتب رسائل لأشخاص آخرين.',
          },
          {
            en: 'If you do not like the tone, just say so: "Make it more polite" or "Sound less robotic".',
            ar: 'إذا لم يعجبك الأسلوب، قلها ببساطة: "اجعله أكثر تهذيبًا" أو "اجعله يبدو أقل آلية".',
          },
        ],
      },
    ],
    example: {
      bad: 'Correct my English.',
      good: 'You are a friendly English teacher. Correct the mistakes in my paragraph below. For each correction, explain the rule in one simple sentence. Be encouraging.',
      why: {
        en: 'The role and tone turn a simple correction into a real lesson.',
        ar: 'الدور والأسلوب يحوّلان التصحيح البسيط إلى درس حقيقي.',
      },
    },
    tip: {
      en: 'Try: "Pretend you are a hotel receptionist. I am a guest who lost my key. Start the conversation."',
      ar: 'جرّب: "تظاهر بأنك موظف استقبال في فندق. أنا نزيل أضعت مفتاحي. ابدأ المحادثة."',
    },
    vocab: [
      { word: 'role', ar: 'دور', pos: 'noun', example: 'Play the role of a doctor.' },
      { word: 'tone', ar: 'نبرة / أسلوب', pos: 'noun', example: 'I like the tone of this email.' },
      { word: 'formal', ar: 'رسمي', pos: 'adjective', example: 'Use formal language at work.' },
      { word: 'rehearse', ar: 'يتدرّب / يُجري بروفة', pos: 'verb', example: 'I rehearse before my presentation.' },
      { word: 'polite', ar: 'مهذّب', pos: 'adjective', example: 'Please be polite.' },
    ],
    quiz: [
      {
        q: 'Which is an example of a role?',
        qAr: 'أيّ مما يلي مثال على دور؟',
        options: ['Use bullet points.', 'You are a job interviewer.', 'Keep it short.'],
        answer: 1,
        explain: { en: 'A role describes who Claude should be.', ar: 'الدور يصف من يجب أن يكون Claude.' },
      },
      {
        q: 'The opposite of "formal" is…',
        qAr: 'عكس كلمة "formal" هو…',
        options: ['serious', 'casual', 'polite'],
        answer: 1,
        explain: { en: 'Casual means relaxed and informal.', ar: 'Casual تعني عفوي وغير رسمي.' },
      },
    ],
  },
  {
    id: 'xml-structure',
    number: 6,
    title: 'Structure with tags',
    titleAr: 'نظّم باستخدام الوسوم',
    summary: {
      en: 'Use simple XML tags to organize long prompts, documents, and instructions.',
      ar: 'استخدم وسوم XML بسيطة لتنظيم الطلبات الطويلة والمستندات والتعليمات.',
    },
    level: 'Advanced',
    minutes: 8,
    icon: 'code',
    sections: [
      {
        heading: 'Why tags help',
        headingAr: 'لماذا تساعد الوسوم',
        paragraphs: [
          {
            en: 'When a prompt has many parts, Claude may mix them up. Tags like <document> and <instructions> clearly show where each part starts and ends.',
            ar: 'عندما يحتوي الطلب على أجزاء كثيرة، قد يخلط Claude بينها. الوسوم مثل <document> و<instructions> توضح بجلاء أين يبدأ كل جزء وأين ينتهي.',
          },
          {
            en: 'There are no magic tag names. Choose names that make sense, and use the same names every time.',
            ar: 'لا توجد أسماء وسوم سحرية. اختر أسماء منطقية، واستخدم الأسماء نفسها في كل مرة.',
          },
        ],
      },
      {
        heading: 'Refer to your tags',
        headingAr: 'أشِر إلى وسومك',
        paragraphs: [
          {
            en: 'After you add tags, mention them in your instructions: "Summarize the text inside the <article> tags."',
            ar: 'بعد أن تضيف الوسوم، اذكرها في تعليماتك: "لخّص النص الموجود داخل وسوم <article>."',
          },
          {
            en: 'You can also ask Claude to answer inside tags, which makes the output easy to copy or process with code.',
            ar: 'يمكنك أيضًا أن تطلب من Claude أن يجيب داخل وسوم، مما يجعل الناتج سهل النسخ أو المعالجة بالكود.',
          },
        ],
      },
    ],
    example: {
      bad: 'Here is my essay and the teacher feedback, rewrite it: [essay] [feedback]',
      good: '<essay>\n…your essay…\n</essay>\n<feedback>\n…teacher comments…\n</feedback>\nRewrite the essay in <essay> using the advice in <feedback>. Put the new version inside <rewrite> tags.',
      why: {
        en: 'Claude now knows exactly which text is the essay and which text is the feedback.',
        ar: 'الآن يعرف Claude بالضبط أي نص هو المقال وأي نص هو الملاحظات.',
      },
    },
    tip: {
      en: 'Tags are great for long texts. Put the long document at the top and your question at the bottom.',
      ar: 'الوسوم رائعة للنصوص الطويلة. ضع المستند الطويل في الأعلى وسؤالك في الأسفل.',
    },
    vocab: [
      { word: 'structure', ar: 'بنية / هيكل', pos: 'noun', example: 'The structure of this essay is clear.' },
      { word: 'organize', ar: 'ينظّم', pos: 'verb', example: 'Organize your notes before the exam.' },
      { word: 'instruction', ar: 'تعليمة', pos: 'noun', example: 'Read the instructions carefully.' },
      { word: 'output', ar: 'ناتج / مُخرَج', pos: 'noun', example: 'The output is a table.' },
      { word: 'refer', ar: 'يشير إلى', pos: 'verb', example: 'Refer to the document above.' },
    ],
    quiz: [
      {
        q: 'Are there special "magic" tag names Claude needs?',
        qAr: 'هل هناك أسماء وسوم "سحرية" يحتاجها Claude؟',
        options: ['Yes, only <prompt> works', 'No, use clear and consistent names', 'Yes, they must be in capital letters'],
        answer: 1,
        explain: { en: 'Any clear, consistent tag name works.', ar: 'أي اسم وسم واضح وثابت يعمل.' },
      },
      {
        q: 'Where should a long document go?',
        qAr: 'أين يجب أن يوضع المستند الطويل؟',
        options: ['At the top, before the question', 'In the middle of a sentence', 'It should not be included'],
        answer: 0,
        explain: { en: 'Long content first, your question last.', ar: 'المحتوى الطويل أولًا، وسؤالك في النهاية.' },
      },
    ],
  },
  {
    id: 'step-by-step',
    number: 7,
    title: 'Let Claude think',
    titleAr: 'دع Claude يفكّر',
    summary: {
      en: 'For hard problems, ask Claude to think step by step before it answers.',
      ar: 'للمسائل الصعبة، اطلب من Claude أن يفكر خطوة بخطوة قبل أن يجيب.',
    },
    level: 'Advanced',
    minutes: 7,
    icon: 'brain',
    sections: [
      {
        heading: 'Thinking improves accuracy',
        headingAr: 'التفكير يحسّن الدقة',
        paragraphs: [
          {
            en: 'Complex tasks, like math problems, planning, or comparing options, become more accurate when Claude writes its reasoning first.',
            ar: 'المهام المعقدة، مثل المسائل الرياضية أو التخطيط أو مقارنة الخيارات، تصبح أكثر دقة عندما يكتب Claude طريقة تفكيره أولًا.',
          },
          {
            en: 'A simple phrase like "Think step by step" can make a big difference. You can also list the steps you want Claude to follow.',
            ar: 'عبارة بسيطة مثل "فكّر خطوة بخطوة" يمكن أن تُحدث فرقًا كبيرًا. يمكنك أيضًا ذكر الخطوات التي تريد من Claude اتباعها.',
          },
        ],
      },
      {
        heading: 'Separate thinking from the answer',
        headingAr: 'افصل التفكير عن الإجابة',
        paragraphs: [
          {
            en: 'Ask Claude to put its reasoning in <thinking> tags and the final result in <answer> tags. This way, you can read the answer quickly.',
            ar: 'اطلب من Claude أن يضع طريقة تفكيره داخل وسوم <thinking> والنتيجة النهائية داخل وسوم <answer>. بهذه الطريقة، يمكنك قراءة الإجابة بسرعة.',
          },
          {
            en: 'Reading the reasoning is also a great way to learn. You see how the problem is solved, not only the solution.',
            ar: 'قراءة طريقة التفكير هي أيضًا طريقة رائعة للتعلّم. ترى كيف تُحل المشكلة، وليس الحل فقط.',
          },
        ],
      },
    ],
    example: {
      bad: 'Which laptop should I buy, A or B?',
      good: 'I am a student who mostly writes documents and watches videos. My budget is $700. Compare laptop A and laptop B step by step (price, battery, weight), then give your recommendation in one sentence.',
      why: {
        en: 'Claude compares the options carefully before it decides.',
        ar: 'يقارن Claude الخيارات بعناية قبل أن يقرر.',
      },
    },
    tip: {
      en: 'Useful phrase: "Before you answer, list the pros and cons."',
      ar: 'عبارة مفيدة: "قبل أن تجيب، اذكر الإيجابيات والسلبيات."',
    },
    vocab: [
      { word: 'accurate', ar: 'دقيق', pos: 'adjective', example: 'The numbers must be accurate.' },
      { word: 'reasoning', ar: 'استدلال / طريقة التفكير', pos: 'noun', example: 'Explain your reasoning.' },
      { word: 'compare', ar: 'يقارن', pos: 'verb', example: 'Compare the two prices.' },
      { word: 'complex', ar: 'معقّد', pos: 'adjective', example: 'This is a complex problem.' },
      { word: 'recommendation', ar: 'توصية', pos: 'noun', example: 'What is your recommendation?' },
    ],
    quiz: [
      {
        q: 'When is "think step by step" most useful?',
        qAr: 'متى تكون عبارة "فكّر خطوة بخطوة" أكثر فائدة؟',
        options: ['For simple greetings', 'For complex problems', 'Never'],
        answer: 1,
        explain: { en: 'Reasoning helps with math, planning, and comparisons.', ar: 'التفكير يساعد في الرياضيات والتخطيط والمقارنات.' },
      },
      {
        q: '"Accurate" means…',
        qAr: 'كلمة "Accurate" تعني…',
        options: ['سريع', 'دقيق', 'قديم'],
        answer: 1,
        explain: { en: 'Accurate = correct in every detail.', ar: 'دقيق = صحيح في كل التفاصيل.' },
      },
    ],
  },
  {
    id: 'iterate',
    number: 8,
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
    id: 'english-coach',
    number: 9,
    title: 'Your personal English coach',
    titleAr: 'مدرّبك الشخصي للإنجليزية',
    summary: {
      en: 'Practical prompts to use Claude for grammar, vocabulary, speaking, and writing practice.',
      ar: 'طلبات عملية لاستخدام Claude في تدريبات القواعد والمفردات والمحادثة والكتابة.',
    },
    level: 'Beginner',
    minutes: 8,
    icon: 'graduation',
    sections: [
      {
        heading: 'Practice every day',
        headingAr: 'تدرّب كل يوم',
        paragraphs: [
          {
            en: 'Ask Claude to have a simple conversation with you about your day. Tell it your level, for example: "I am a beginner, please use easy words."',
            ar: 'اطلب من Claude أن يجري معك محادثة بسيطة عن يومك. أخبره بمستواك، مثلًا: "أنا مبتدئ، من فضلك استخدم كلمات سهلة."',
          },
          {
            en: 'After each of your messages, Claude can correct your mistakes and show a more natural way to say the same idea.',
            ar: 'بعد كل رسالة منك، يمكن لـ Claude تصحيح أخطائك وإظهار طريقة أكثر طبيعية لقول الفكرة نفسها.',
          },
        ],
      },
      {
        heading: 'Build your vocabulary',
        headingAr: 'ابنِ مفرداتك',
        paragraphs: [
          {
            en: 'When you find a new word, ask Claude for its meaning, three example sentences, and common mistakes. Then write your own sentence and ask for feedback.',
            ar: 'عندما تجد كلمة جديدة، اسأل Claude عن معناها، وثلاث جمل كمثال، والأخطاء الشائعة. ثم اكتب جملتك الخاصة واطلب ملاحظات عليها.',
          },
          {
            en: 'Save the words you learn on this website, and review them with flashcards. Small daily practice is better than long sessions once a week.',
            ar: 'احفظ الكلمات التي تتعلمها في هذا الموقع، وراجعها باستخدام البطاقات التعليمية. التدريب اليومي القليل أفضل من جلسات طويلة مرة في الأسبوع.',
          },
        ],
      },
    ],
    example: {
      bad: 'Teach me English.',
      good: 'I am an intermediate English learner. Let’s chat about travel. Ask me one question at a time. After each answer, correct my grammar briefly and then continue the conversation.',
      why: {
        en: 'Claude becomes an interactive tutor that adapts to your level.',
        ar: 'يصبح Claude معلمًا تفاعليًا يتكيف مع مستواك.',
      },
    },
    tip: {
      en: 'Ask: "What is the difference between ‘make’ and ‘do’? Give me a short quiz."',
      ar: 'اسأل: "ما الفرق بين make وdo؟ أعطني اختبارًا قصيرًا."',
    },
    vocab: [
      { word: 'vocabulary', ar: 'مفردات', pos: 'noun', example: 'Reading helps build your vocabulary.' },
      { word: 'grammar', ar: 'قواعد اللغة', pos: 'noun', example: 'English grammar is not so hard.' },
      { word: 'fluent', ar: 'طليق', pos: 'adjective', example: 'She is fluent in three languages.' },
      { word: 'correct', ar: 'يصحّح', pos: 'verb', example: 'Please correct my sentence.' },
      { word: 'review', ar: 'يراجع', pos: 'verb', example: 'Review your notes every evening.' },
    ],
    quiz: [
      {
        q: 'Which prompt is best for speaking practice?',
        qAr: 'أي طلب هو الأفضل لتدريب المحادثة؟',
        options: ['Translate this.', 'Let’s chat. Ask me one question at a time and correct my mistakes.', 'What is English?'],
        answer: 1,
        explain: { en: 'It creates a real, interactive conversation with corrections.', ar: 'ينشئ محادثة حقيقية وتفاعلية مع التصحيح.' },
      },
      {
        q: '"Fluent" means…',
        qAr: 'كلمة "Fluent" تعني…',
        options: ['طليق', 'متعب', 'مبتدئ'],
        answer: 0,
        explain: { en: 'Fluent = able to speak easily and well.', ar: 'طليق = قادر على التحدث بسهولة وإتقان.' },
      },
    ],
  },
  {
    id: 'files-and-code',
    number: 10,
    title: 'Documents, files, and code',
    titleAr: 'المستندات والملفات والأكواد',
    summary: {
      en: 'Upload files, analyze long documents, and use Claude as a coding partner.',
      ar: 'ارفع الملفات، وحلّل المستندات الطويلة، واستخدم Claude كشريك في البرمجة.',
    },
    level: 'Advanced',
    minutes: 8,
    icon: 'file',
    sections: [
      {
        heading: 'Working with documents',
        headingAr: 'العمل مع المستندات',
        paragraphs: [
          {
            en: 'You can upload PDFs, spreadsheets, and images. Then ask Claude to summarize them, find key points, or answer questions about them.',
            ar: 'يمكنك رفع ملفات PDF وجداول البيانات والصور. ثم اطلب من Claude تلخيصها، أو إيجاد النقاط الرئيسية، أو الإجابة عن أسئلة حولها.',
          },
          {
            en: 'For long documents, ask Claude to quote the relevant parts first. This helps it stay close to the real text.',
            ar: 'بالنسبة للمستندات الطويلة، اطلب من Claude أن يقتبس الأجزاء ذات الصلة أولًا. هذا يساعده على البقاء قريبًا من النص الحقيقي.',
          },
        ],
      },
      {
        heading: 'Claude as a coding partner',
        headingAr: 'Claude كشريك في البرمجة',
        paragraphs: [
          {
            en: 'Claude can explain code line by line, find bugs, write tests, and build small projects. Tools like Claude Code let it work directly inside your project.',
            ar: 'يستطيع Claude شرح الكود سطرًا بسطر، وإيجاد الأخطاء البرمجية، وكتابة الاختبارات، وبناء مشاريع صغيرة. أدوات مثل Claude Code تتيح له العمل مباشرة داخل مشروعك.',
          },
          {
            en: 'Always describe the goal, the language or framework, and any errors you see. Paste the full error message — it contains important clues.',
            ar: 'صِف دائمًا الهدف، ولغة البرمجة أو إطار العمل، وأي أخطاء تراها. الصق رسالة الخطأ كاملة — فهي تحتوي على أدلة مهمة.',
          },
        ],
      },
    ],
    example: {
      bad: 'My code doesn’t work.',
      good: 'I am building a to-do app with React. When I click "Add", nothing happens and the console shows: "TypeError: items.map is not a function". Here is my component: <code>…</code> Explain the bug simply and show the fix.',
      why: {
        en: 'The goal, the framework, the exact error, and the code are all there.',
        ar: 'الهدف وإطار العمل والخطأ بالضبط والكود كلها موجودة.',
      },
    },
    tip: {
      en: 'Reading error messages in English is a skill. Ask Claude to explain them word by word.',
      ar: 'قراءة رسائل الخطأ بالإنجليزية مهارة. اطلب من Claude شرحها كلمة بكلمة.',
    },
    vocab: [
      { word: 'upload', ar: 'يرفع (ملفًا)', pos: 'verb', example: 'Upload the file here.' },
      { word: 'analyze', ar: 'يحلّل', pos: 'verb', example: 'Analyze the sales data.' },
      { word: 'relevant', ar: 'ذو صلة', pos: 'adjective', example: 'Only include relevant details.' },
      { word: 'bug', ar: 'خلل برمجي', pos: 'noun', example: 'I found a bug in the app.' },
      { word: 'clue', ar: 'دليل / مفتاح', pos: 'noun', example: 'The error message is a clue.' },
    ],
    quiz: [
      {
        q: 'What should you include when asking for help with an error?',
        qAr: 'ماذا يجب أن تضمّن عند طلب المساعدة في خطأ برمجي؟',
        options: ['Only "it doesn’t work"', 'The goal, the code, and the full error message', 'Nothing, Claude will guess'],
        answer: 1,
        explain: { en: 'More details = faster and better fixes.', ar: 'تفاصيل أكثر = إصلاحات أسرع وأفضل.' },
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
]

export const getLesson = (id: string) => lessons.find((l) => l.id === id)
