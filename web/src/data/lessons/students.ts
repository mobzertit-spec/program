import { R } from '../resources'
import type { LessonInput } from './types'

export const students: LessonInput[] = [
  {
    id: 'study-partner',
    track: 'students',
    title: 'Claude as a study partner',
    titleAr: 'Claude شريكًا في الدراسة',
    summary: {
      en: 'Use Claude to understand ideas, not to skip them — ask for questions, hints, and simple explanations.',
      ar: 'استخدم Claude لفهم الأفكار لا لتجاوزها — اطلب أسئلة وتلميحات وشروحًا بسيطة.',
    },
    level: 'Beginner',
    minutes: 6,
    icon: 'graduation',
    sections: [
      {
        heading: 'Learn, don’t just copy',
        headingAr: 'تعلّم، ولا تكتفِ بالنسخ',
        paragraphs: [
          {
            en: 'If Claude does your homework, you get a grade but no knowledge. The goal is to understand each concept well enough to explain it yourself.',
            ar: 'إذا حلّ Claude واجبك، تحصل على درجة بلا معرفة. الهدف أن تفهم كل مفهوم جيدًا بما يكفي لتشرحه بنفسك.',
          },
          {
            en: 'Ask Claude to explain a difficult idea at your level, with a simple example from daily life. Then explain it back in your own words and ask Claude to check you.',
            ar: 'اطلب من Claude أن يشرح فكرة صعبة بمستواك، مع مثال بسيط من الحياة اليومية. ثم اشرحها بكلماتك واطلب من Claude أن يتحقق منك.',
          },
        ],
      },
      {
        heading: 'Questions and hints',
        headingAr: 'أسئلة وتلميحات',
        paragraphs: [
          {
            en: 'A powerful way to learn is to ask Claude not to give the answer. Instead, it can ask you questions and give one hint at a time.',
            ar: 'من الطرق القوية للتعلّم أن تطلب من Claude ألا يعطيك الإجابة. بدلًا من ذلك، يمكنه أن يطرح عليك أسئلة ويعطيك تلميحًا واحدًا في كل مرة.',
          },
          {
            en: 'This feels like a challenge, and that is good. When you find the answer yourself, you remember it much longer. Stay curious and ask "why?" often.',
            ar: 'قد يبدو هذا تحديًا، وهذا جيد. عندما تجد الإجابة بنفسك، تتذكرها مدة أطول بكثير. ابقَ فضوليًا واسأل "لماذا؟" كثيرًا.',
          },
        ],
      },
    ],
    example: {
      bad: 'Solve question 4 of my physics homework.',
      good: 'I am studying Newton’s second law for a test. Do not give me the answer to question 4. Ask me one question at a time and give me a hint only if I am stuck.',
      why: {
        en: 'Claude becomes a tutor that guides your thinking instead of doing the work.',
        ar: 'يصبح Claude معلمًا يوجّه تفكيرك بدلًا من أن يؤدي العمل عنك.',
      },
    },
    tip: {
      en: 'Try to memorize less and understand more: ask Claude "Can you give me a real-life example of this?"',
      ar: 'حاول أن تحفظ أقل وتفهم أكثر: اسأل Claude "هل يمكنك أن تعطيني مثالًا من الحياة الواقعية على هذا؟"',
    },
    resources: [R.aiFluencyStudents, R.aiFluency],
    vocab: [
      { word: 'concept', ar: 'مفهوم', pos: 'noun', example: 'This concept is easy once you see an example.' },
      { word: 'hint', ar: 'تلميح', pos: 'noun', example: 'Can you give me a small hint?' },
      { word: 'challenge', ar: 'تحدٍّ', pos: 'noun', example: 'Learning a language is a big challenge.' },
      { word: 'curious', ar: 'فضولي', pos: 'adjective', example: 'Curious students ask many questions.' },
      { word: 'memorize', ar: 'يحفظ عن ظهر قلب', pos: 'verb', example: 'I memorize ten new words every day.' },
    ],
    quiz: [
      {
        q: 'What is the best way to use Claude for homework?',
        qAr: 'ما أفضل طريقة لاستخدام Claude في الواجبات؟',
        options: ['Copy the answers', 'Ask for questions and hints so you find the answer', 'Never use it'],
        answer: 1,
        explain: { en: 'Guided questions build real understanding.', ar: 'الأسئلة الموجّهة تبني فهمًا حقيقيًا.' },
      },
      {
        q: '"Hint" means…',
        qAr: 'كلمة "Hint" تعني…',
        options: ['إجابة كاملة', 'اختبار', 'تلميح'],
        answer: 2,
        explain: { en: 'A hint is a small help, not the full answer.', ar: 'التلميح مساعدة صغيرة، وليس الإجابة كاملة.' },
      },
    ],
  },
  {
    id: 'study-plan',
    track: 'students',
    title: 'Plan your studying',
    titleAr: 'خطّط لدراستك',
    summary: {
      en: 'Turn a big exam into small daily steps with a realistic plan you can actually follow.',
      ar: 'حوّل الامتحان الكبير إلى خطوات يومية صغيرة بخطة واقعية يمكنك الالتزام بها فعلًا.',
    },
    level: 'Beginner',
    minutes: 6,
    icon: 'calendar',
    sections: [
      {
        heading: 'Give Claude the full picture',
        headingAr: 'أعطِ Claude الصورة كاملة',
        paragraphs: [
          {
            en: 'A good study schedule needs details: the exam date, the subjects, how many hours you have each day, and which topics are hardest for you.',
            ar: 'جدول الدراسة الجيد يحتاج إلى تفاصيل: تاريخ الامتحان، والمواد، وعدد الساعات المتاحة لك كل يوم، وأي المواضيع هي الأصعب عليك.',
          },
          {
            en: 'Ask Claude to put the most difficult topic first as the top priority, and to add short breaks. A plan with no rest is not realistic.',
            ar: 'اطلب من Claude أن يضع الموضوع الأصعب أولًا بوصفه الأولوية القصوى، وأن يضيف استراحات قصيرة. الخطة بلا راحة ليست واقعية.',
          },
        ],
      },
      {
        heading: 'Check your progress',
        headingAr: 'تابع تقدّمك',
        paragraphs: [
          {
            en: 'At the end of each week, tell Claude what you finished and what you missed. It can update the plan without making you start again.',
            ar: 'في نهاية كل أسبوع، أخبر Claude بما أنهيته وما فاتك. يستطيع تحديث الخطة دون أن تضطر إلى البدء من جديد.',
          },
          {
            en: 'Small progress every day is better than one long night before the exam. Keep the plan in a project so Claude remembers it.',
            ar: 'التقدّم الصغير كل يوم أفضل من ليلة طويلة واحدة قبل الامتحان. احفظ الخطة في مشروع حتى يتذكرها Claude.',
          },
        ],
      },
    ],
    example: {
      bad: 'Make me a study plan.',
      good: 'My biology exam is in 3 weeks. I can study 2 hours on weekdays and 4 hours on weekends. The hardest topic for me is genetics. Make a realistic weekly schedule with short breaks, as a table.',
      why: {
        en: 'Dates, hours, priorities, and a format — Claude can build a plan that fits your life.',
        ar: 'التواريخ والساعات والأولويات والتنسيق — يستطيع Claude بناء خطة تناسب حياتك.',
      },
    },
    tip: {
      en: 'Useful phrase for a break: "I will take a short break and come back in ten minutes."',
      ar: 'عبارة مفيدة للاستراحة: "I will take a short break and come back in ten minutes."',
    },
    resources: [R.aiFluencyStudents, R.projects],
    vocab: [
      { word: 'schedule', ar: 'جدول زمني', pos: 'noun', example: 'My schedule is very busy this week.' },
      { word: 'priority', ar: 'أولوية', pos: 'noun', example: 'My first priority is the math exam.' },
      { word: 'realistic', ar: 'واقعي', pos: 'adjective', example: 'Make a realistic plan.' },
      { word: 'break', ar: 'استراحة', pos: 'noun', example: 'Let’s take a ten-minute break.' },
      { word: 'progress', ar: 'تقدّم', pos: 'noun', example: 'I can see my progress every week.' },
    ],
    quiz: [
      {
        q: 'Which detail helps Claude make a better study plan?',
        qAr: 'أي تفصيل يساعد Claude على إعداد خطة دراسة أفضل؟',
        options: ['Your favorite color', 'The exam date and your free hours', 'Nothing, just ask'],
        answer: 1,
        explain: { en: 'Time limits and dates shape a realistic plan.', ar: 'حدود الوقت والتواريخ تشكّل الخطة الواقعية.' },
      },
      {
        q: '"Priority" means…',
        qAr: 'كلمة "Priority" تعني…',
        options: ['أولوية', 'استراحة', 'امتحان'],
        answer: 0,
        explain: { en: 'A priority is the most important thing to do first.', ar: 'الأولوية هي أهم شيء تبدأ به.' },
      },
    ],
  },
  {
    id: 'research-sources',
    track: 'students',
    title: 'Research and real sources',
    titleAr: 'البحث والمصادر الحقيقية',
    summary: {
      en: 'Use Claude to find and understand sources — and always check them before you cite them.',
      ar: 'استخدم Claude لإيجاد المصادر وفهمها — وتحقق منها دائمًا قبل أن تستشهد بها.',
    },
    level: 'Intermediate',
    minutes: 7,
    icon: 'search',
    sections: [
      {
        heading: 'Find sources, then read them',
        headingAr: 'جِد المصادر، ثم اقرأها',
        paragraphs: [
          {
            en: 'With web search or Research, Claude can find articles and give you links. This is a starting point, not the end of your research.',
            ar: 'مع البحث في الويب أو وضع Research، يستطيع Claude إيجاد مقالات وإعطاءك روابطها. هذه نقطة بداية، وليست نهاية بحثك.',
          },
          {
            en: 'Open every link and read the important parts. Only cite a reference that you have checked yourself, because AI can make mistakes.',
            ar: 'افتح كل رابط واقرأ الأجزاء المهمة. لا تستشهد إلا بمرجع تحققت منه بنفسك، لأن الذكاء الاصطناعي قد يخطئ.',
          },
        ],
      },
      {
        heading: 'Is the source credible?',
        headingAr: 'هل المصدر موثوق؟',
        paragraphs: [
          {
            en: 'Ask Claude to help you judge a source: who wrote it, when, and why. A university or government page is usually more credible than an anonymous blog.',
            ar: 'اطلب من Claude أن يساعدك في تقييم المصدر: من كتبه، ومتى، ولماذا. صفحة جامعة أو جهة حكومية عادةً أكثر موثوقية من مدوّنة مجهولة.',
          },
          {
            en: 'Also look for bias. Does the author only show one side? Ask Claude to explain the main claim and the strongest argument against it.',
            ar: 'ابحث أيضًا عن التحيّز. هل يعرض الكاتب جانبًا واحدًا فقط؟ اطلب من Claude أن يشرح الادعاء الرئيسي وأقوى حجة ضده.',
          },
        ],
      },
    ],
    example: {
      bad: 'Give me 5 sources about climate change for my essay.',
      good: 'Search the web for 5 recent sources about the effect of climate change on farming in North Africa. Only use university, government, or international organization websites. For each one, give the link, the publication date, and one sentence about its main claim.',
      why: {
        en: 'Clear topic, reliable source types, and details you can check.',
        ar: 'موضوع واضح، وأنواع مصادر موثوقة، وتفاصيل يمكنك التحقق منها.',
      },
    },
    tip: {
      en: 'Learn this academic phrase: "According to [source], …" — it shows where an idea comes from.',
      ar: 'تعلّم هذه العبارة الأكاديمية: "According to [source], …" — فهي توضح مصدر الفكرة.',
    },
    resources: [R.research, R.webSearch, R.aiFluencyStudents],
    vocab: [
      { word: 'reference', ar: 'مرجع', pos: 'noun', example: 'Add the reference at the end of your essay.' },
      { word: 'credible', ar: 'موثوق به', pos: 'adjective', example: 'Is this website a credible source?' },
      { word: 'bias', ar: 'تحيّز', pos: 'noun', example: 'The article shows a strong bias.' },
      { word: 'claim', ar: 'ادعاء / يدّعي', pos: 'noun', example: 'The main claim of the study is surprising.' },
      { word: 'cite', ar: 'يستشهد بـ', pos: 'verb', example: 'You must cite every source you use.' },
    ],
    quiz: [
      {
        q: 'Claude gives you a link. What should you do before citing it?',
        qAr: 'أعطاك Claude رابطًا. ماذا تفعل قبل الاستشهاد به؟',
        options: ['Open it and check it yourself', 'Cite it immediately', 'Delete it'],
        answer: 0,
        explain: { en: 'Always verify a source before you use it.', ar: 'تحقق دائمًا من المصدر قبل أن تستخدمه.' },
      },
      {
        q: '"Credible" means…',
        qAr: 'كلمة "Credible" تعني…',
        options: ['قديم', 'موثوق به', 'طويل'],
        answer: 1,
        explain: { en: 'Credible = you can trust it.', ar: 'موثوق به = يمكنك الثقة فيه.' },
      },
    ],
  },
  {
    id: 'academic-writing',
    track: 'students',
    title: 'Academic writing, honestly',
    titleAr: 'الكتابة الأكاديمية بنزاهة',
    summary: {
      en: 'Get feedback on your outline and drafts, keep the writing yours, and follow your school’s AI rules.',
      ar: 'احصل على ملاحظات حول مخططك ومسوداتك، وأبقِ الكتابة لك، واتبع قواعد مدرستك بشأن الذكاء الاصطناعي.',
    },
    level: 'Intermediate',
    minutes: 7,
    icon: 'pen',
    sections: [
      {
        heading: 'Your ideas, better organized',
        headingAr: 'أفكارك، بتنظيم أفضل',
        paragraphs: [
          {
            en: 'Start with your own ideas. Write a short outline, then ask Claude if the order is logical and if any important point is missing.',
            ar: 'ابدأ بأفكارك الخاصة. اكتب مخططًا قصيرًا، ثم اسأل Claude إن كان الترتيب منطقيًا وإن كانت هناك نقطة مهمة ناقصة.',
          },
          {
            en: 'After you write a draft, ask for feedback on clarity and grammar. Rewrite the sentences yourself — that is how your English improves.',
            ar: 'بعد أن تكتب مسودة، اطلب ملاحظات حول الوضوح والقواعد. أعد كتابة الجمل بنفسك — هكذا تتحسن لغتك الإنجليزية.',
          },
        ],
      },
      {
        heading: 'Academic integrity',
        headingAr: 'النزاهة الأكاديمية',
        paragraphs: [
          {
            en: 'Submitting text you did not write as your own work is plagiarism, even if an AI wrote it. Integrity means being honest about how you made your work.',
            ar: 'تقديم نص لم تكتبه على أنه عملك هو سرقة أدبية، حتى لو كتبه ذكاء اصطناعي. النزاهة تعني أن تكون صادقًا بشأن كيفية إنجاز عملك.',
          },
          {
            en: 'Every school has different rules about AI. Read your course policy, and if it asks you to disclose AI use, explain clearly what you used it for.',
            ar: 'لكل مدرسة قواعد مختلفة بشأن الذكاء الاصطناعي. اقرأ سياسة مقررك، وإذا طلبت منك الإفصاح عن استخدام الذكاء الاصطناعي، فاشرح بوضوح فيمَ استخدمته.',
          },
        ],
      },
    ],
    example: {
      bad: 'Write a 1,000-word essay about social media for my class.',
      good: 'Here is my outline for an essay about social media and sleep: <outline>…</outline> Is the order logical? What important point is missing? Do not write the essay — just give me feedback.',
      why: {
        en: 'You stay the author, and Claude acts as a helpful reviewer.',
        ar: 'تبقى أنت الكاتب، ويعمل Claude مراجعًا مفيدًا.',
      },
    },
    tip: {
      en: 'To paraphrase well, close the source, explain the idea from memory, then compare with the original.',
      ar: 'لإعادة الصياغة جيدًا، أغلق المصدر، واشرح الفكرة من ذاكرتك، ثم قارنها بالنص الأصلي.',
    },
    resources: [R.aiFluencyStudents, R.aiFluency],
    vocab: [
      { word: 'outline', ar: 'مخطط', pos: 'noun', example: 'Write an outline before you start the essay.' },
      { word: 'paraphrase', ar: 'يعيد الصياغة', pos: 'verb', example: 'Paraphrase the idea in your own words.' },
      { word: 'plagiarism', ar: 'سرقة أدبية', pos: 'noun', example: 'Copying without a reference is plagiarism.' },
      { word: 'disclose', ar: 'يفصح عن', pos: 'verb', example: 'Please disclose if you used AI.' },
      { word: 'integrity', ar: 'نزاهة', pos: 'noun', example: 'Academic integrity is very important.' },
    ],
    quiz: [
      {
        q: 'Which is an honest way to use Claude for an essay?',
        qAr: 'أي طريقة نزيهة لاستخدام Claude في المقال؟',
        options: ['Ask for feedback on your own outline', 'Submit Claude’s essay as your work', 'Hide that you used AI when the rules ask you to tell'],
        answer: 0,
        explain: { en: 'Feedback keeps you the author of your work.', ar: 'الملاحظات تُبقيك مؤلف عملك.' },
      },
      {
        q: '"Plagiarism" means…',
        qAr: 'كلمة "Plagiarism" تعني…',
        options: ['مراجعة', 'سرقة أدبية', 'مخطط'],
        answer: 1,
        explain: { en: 'Plagiarism is using someone else’s work as your own.', ar: 'السرقة الأدبية هي استخدام عمل غيرك على أنه عملك.' },
      },
    ],
  },
  {
    id: 'exam-prep',
    track: 'students',
    title: 'Prepare for exams',
    titleAr: 'استعد للامتحانات',
    summary: {
      en: 'Turn your notes into practice questions, mock exams, and flashcards — then learn from every mistake.',
      ar: 'حوّل ملاحظاتك إلى أسئلة تدريبية وامتحانات تجريبية وبطاقات — ثم تعلّم من كل خطأ.',
    },
    level: 'Beginner',
    minutes: 6,
    icon: 'check',
    sections: [
      {
        heading: 'Practice like the real exam',
        headingAr: 'تدرّب كالامتحان الحقيقي',
        paragraphs: [
          {
            en: 'Share your notes or the syllabus with Claude and ask for a mock exam with the same types of questions your teacher uses.',
            ar: 'شارك ملاحظاتك أو المنهج الدراسي مع Claude واطلب امتحانًا تجريبيًا بنفس أنواع الأسئلة التي يستخدمها معلمك.',
          },
          {
            en: 'Answer without looking at your notes. Trying to recall information is one of the best ways to make it stay in your memory.',
            ar: 'أجب دون النظر إلى ملاحظاتك. محاولة تذكّر المعلومات من أفضل الطرق لتثبيتها في ذاكرتك.',
          },
        ],
      },
      {
        heading: 'Learn from mistakes',
        headingAr: 'تعلّم من الأخطاء',
        paragraphs: [
          {
            en: 'After each attempt, ask Claude to explain every wrong answer and to give you two new questions on the same topic.',
            ar: 'بعد كل محاولة، اطلب من Claude أن يشرح كل إجابة خاطئة وأن يعطيك سؤالين جديدين في الموضوع نفسه.',
          },
          {
            en: 'Revise a little every day, not everything the night before. You can also ask Claude to make an artifact with flashcards from your notes.',
            ar: 'راجع قليلًا كل يوم، وليس كل شيء في الليلة السابقة. يمكنك أيضًا أن تطلب من Claude صنع عمل (Artifact) فيه بطاقات تعليمية من ملاحظاتك.',
          },
        ],
      },
    ],
    example: {
      bad: 'Test me on history.',
      good: 'Here are my notes on World War I: <notes>…</notes> Create a mock exam with 5 multiple-choice questions and 2 short-answer questions. Wait for my answers, then explain each mistake.',
      why: {
        en: 'The exam is based on your notes, matches the real format, and teaches you from mistakes.',
        ar: 'الامتحان مبني على ملاحظاتك، ويطابق الشكل الحقيقي، ويعلّمك من أخطائك.',
      },
    },
    tip: {
      en: 'Before an exam, ask Claude: "What are the five questions students usually get wrong about this topic?"',
      ar: 'قبل الامتحان، اسأل Claude: "ما الأسئلة الخمسة التي يخطئ فيها الطلاب عادةً في هذا الموضوع؟"',
    },
    resources: [R.aiFluencyStudents, R.artifacts],
    vocab: [
      { word: 'syllabus', ar: 'منهج دراسي', pos: 'noun', example: 'The syllabus lists all the topics for the exam.' },
      { word: 'mock', ar: 'تجريبي', pos: 'adjective', example: 'We have a mock exam next week.' },
      { word: 'recall', ar: 'يتذكّر / يستحضر', pos: 'verb', example: 'Try to recall the answer before you look.' },
      { word: 'attempt', ar: 'محاولة', pos: 'noun', example: 'I passed on my second attempt.' },
      { word: 'revise', ar: 'يراجع (للامتحان)', pos: 'verb', example: 'I revise for one hour every evening.' },
    ],
    quiz: [
      {
        q: 'Why should you answer practice questions without your notes?',
        qAr: 'لماذا يجب أن تجيب عن الأسئلة التدريبية دون ملاحظاتك؟',
        options: ['It is faster', 'Trying to recall helps you remember', 'Notes are not allowed in life'],
        answer: 1,
        explain: { en: 'Active recall makes memory stronger.', ar: 'التذكّر النشط يقوّي الذاكرة.' },
      },
      {
        q: 'A "mock exam" is…',
        qAr: 'عبارة "mock exam" تعني…',
        options: ['a final exam', 'a practice exam', 'a cancelled exam'],
        answer: 1,
        explain: { en: 'A mock exam is a practice version of the real one.', ar: 'الامتحان التجريبي نسخة تدريبية من الامتحان الحقيقي.' },
      },
    ],
  },
]
