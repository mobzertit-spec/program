import { R } from '../resources'
import type { LessonInput } from './types'

export const english: LessonInput[] = [
  {
    id: 'english-coach',
    track: 'english',
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
    resources: [R.voice, R.aiFluencyStudents, R.projects],
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
    id: 'emails-at-work',
    track: 'english',
    title: 'Professional emails',
    titleAr: 'رسائل البريد الاحترافية',
    summary: {
      en: 'Write clear, polite work emails with Claude — and learn the phrases native speakers use.',
      ar: 'اكتب رسائل عمل واضحة ومهذبة مع Claude — وتعلّم العبارات التي يستخدمها أهل اللغة.',
    },
    level: 'Beginner',
    minutes: 7,
    icon: 'mail',
    sections: [
      {
        heading: 'The shape of a good email',
        headingAr: 'شكل البريد الجيد',
        paragraphs: [
          {
            en: 'A good work email has a short subject line, a greeting, the main point in the first sentence, any details, a clear next step, and a closing like "Best regards".',
            ar: 'البريد الجيد في العمل له سطر موضوع قصير، وتحية، والنقطة الرئيسية في الجملة الأولى، ثم التفاصيل، وخطوة تالية واضحة، وخاتمة مثل "Best regards".',
          },
          {
            en: 'Useful phrases: "I am writing to ask about…", "Could you please…?", "Please find attached…", and "I look forward to hearing from you."',
            ar: 'عبارات مفيدة: "I am writing to ask about…" أي أكتب لأسأل عن، و"Could you please…?" أي هل يمكنك من فضلك، و"Please find attached…" أي تجد مرفقًا، و"I look forward to hearing from you." أي أتطلع إلى ردّك.',
          },
        ],
      },
      {
        heading: 'Write it yourself first',
        headingAr: 'اكتبه بنفسك أولًا',
        paragraphs: [
          {
            en: 'To improve your English, write the first version yourself, even if it has mistakes. Then ask Claude to correct it and explain the three most important changes.',
            ar: 'لتحسين لغتك الإنجليزية، اكتب النسخة الأولى بنفسك حتى لو كانت فيها أخطاء. ثم اطلب من Claude تصحيحها وشرح أهم ثلاثة تغييرات.',
          },
          {
            en: 'Always tell Claude who will read the email and how formal it should be. An email to your manager is different from a message to a close colleague. Also say if the email is urgent or if you need to apologize for something.',
            ar: 'أخبر Claude دائمًا من سيقرأ البريد ومدى الرسمية المطلوبة. البريد إلى مديرك يختلف عن رسالة إلى زميل مقرّب. واذكر أيضًا إن كان البريد عاجلًا أو إن كنت تحتاج إلى الاعتذار عن شيء.',
          },
        ],
      },
    ],
    example: {
      bad: 'write email to boss i am late for deadline',
      good: 'Here is my draft email to my manager: "Hello, the report will be late 2 days because the data is not ready." Please make it polite and professional, keep it under 90 words, and explain your three most important changes.',
      why: {
        en: 'You practice writing first, then learn from specific corrections.',
        ar: 'تتدرب على الكتابة أولًا، ثم تتعلم من تصحيحات محددة.',
      },
    },
    tip: {
      en: 'Keep a list of email phrases you like. After a month, you will write most emails without help.',
      ar: 'احتفظ بقائمة عبارات البريد التي تعجبك. بعد شهر، ستكتب معظم رسائلك بدون مساعدة.',
    },
    resources: [R.claude101, R.aiFluencyStudents],
    vocab: [
      { word: 'attach', ar: 'يُرفق', pos: 'verb', example: 'I attached the report to this email.' },
      { word: 'regards', ar: 'تحيات (في ختام الرسائل)', pos: 'noun', example: 'Best regards, Sara' },
      { word: 'deadline', ar: 'موعد نهائي', pos: 'noun', example: 'The deadline is next Friday.' },
      { word: 'apologize', ar: 'يعتذر', pos: 'verb', example: 'I apologize for the late reply.' },
      { word: 'urgent', ar: 'عاجل', pos: 'adjective', example: 'This is urgent, please reply today.' },
    ],
    quiz: [
      {
        q: 'Where should the main point of an email be?',
        qAr: 'أين يجب أن تكون النقطة الرئيسية في البريد؟',
        options: ['In the first sentence', 'At the very end', 'Only in the subject line'],
        answer: 0,
        explain: { en: 'Busy readers want the main point immediately.', ar: 'القارئ المشغول يريد النقطة الرئيسية فورًا.' },
      },
      {
        q: 'Which phrase means "تجد مرفقًا"?',
        qAr: 'أي عبارة تعني "تجد مرفقًا"؟',
        options: ['Please find attached', 'I look forward to', 'Best regards'],
        answer: 0,
        explain: { en: '"Please find attached" introduces an attachment.', ar: 'عبارة "Please find attached" تُستخدم عند إرفاق ملف.' },
      },
    ],
  },
  {
    id: 'job-interview',
    track: 'english',
    title: 'Practice a job interview',
    titleAr: 'تدرّب على مقابلة عمل',
    summary: {
      en: 'Let Claude play the interviewer, then get feedback on your answers and your English.',
      ar: 'دع Claude يلعب دور مُجري المقابلة، ثم احصل على ملاحظات حول إجاباتك ولغتك الإنجليزية.',
    },
    level: 'Intermediate',
    minutes: 8,
    icon: 'briefcase',
    sections: [
      {
        heading: 'A realistic rehearsal',
        headingAr: 'بروفة واقعية',
        paragraphs: [
          {
            en: 'Give Claude the job description and your CV, so it knows your experience. Ask it to act as the interviewer who decides whether to hire you, ask one question at a time, and wait for your answer.',
            ar: 'أعطِ Claude وصف الوظيفة وسيرتك الذاتية، حتى يعرف خبرتك. اطلب منه أن يتصرف كمُجري المقابلة الذي يقرر توظيفك، ويطرح سؤالًا واحدًا في كل مرة، وينتظر إجابتك.',
          },
          {
            en: 'Answer in English, with your voice if possible. Voice mode makes the practice feel much closer to a real interview.',
            ar: 'أجب بالإنجليزية، وبصوتك إن أمكن. وضع الصوت يجعل التدريب أقرب بكثير إلى مقابلة حقيقية.',
          },
        ],
      },
      {
        heading: 'The STAR method',
        headingAr: 'طريقة STAR',
        paragraphs: [
          {
            en: 'For questions like "Tell me about a challenge you faced", use STAR: Situation, Task, Action, Result. It keeps your answer clear and short.',
            ar: 'لأسئلة مثل "حدّثني عن تحدٍّ واجهته"، استخدم STAR: الموقف، والمهمة، والإجراء، والنتيجة. تجعل إجابتك واضحة وقصيرة.',
          },
          {
            en: 'After the interview, ask Claude for feedback: the main strength of each answer, its main weakness, and the English mistakes you repeated.',
            ar: 'بعد المقابلة، اطلب من Claude ملاحظاته: نقطة القوة الرئيسية في كل إجابة، ونقطة ضعفها الرئيسية، والأخطاء الإنجليزية التي كرّرتها.',
          },
        ],
      },
    ],
    example: {
      bad: 'Give me interview questions.',
      good: 'You are a friendly but professional interviewer for this junior data analyst job: <job>…</job>. Ask me 5 questions, one at a time. After all 5, give me feedback on my answers using the STAR method, and list my English mistakes with corrections.',
      why: {
        en: 'It becomes a real practice session with a role, a structure, and useful feedback.',
        ar: 'يصبح جلسة تدريب حقيقية بدور وبنية وملاحظات مفيدة.',
      },
    },
    tip: {
      en: 'Prepare three short stories about your work or studies. You can use them for many different interview questions.',
      ar: 'جهّز ثلاث قصص قصيرة عن عملك أو دراستك. يمكنك استخدامها في أسئلة مقابلة كثيرة ومختلفة.',
    },
    resources: [R.voice, R.aiFluencyStudents],
    vocab: [
      { word: 'strength', ar: 'نقطة قوة', pos: 'noun', example: 'My biggest strength is teamwork.' },
      { word: 'weakness', ar: 'نقطة ضعف', pos: 'noun', example: 'I am working on my weakness: public speaking.' },
      { word: 'experience', ar: 'خبرة / تجربة', pos: 'noun', example: 'I have two years of experience in sales.' },
      { word: 'achievement', ar: 'إنجاز', pos: 'noun', example: 'Finishing the project early was a big achievement.' },
      { word: 'hire', ar: 'يوظّف', pos: 'verb', example: 'The company wants to hire three developers.' },
    ],
    quiz: [
      {
        q: 'What does STAR stand for?',
        qAr: 'ماذا تعني STAR؟',
        options: ['Start, Try, Ask, Repeat', 'Situation, Task, Action, Result', 'Speak, Think, Answer, Rest'],
        answer: 1,
        explain: { en: 'STAR = Situation, Task, Action, Result.', ar: 'STAR = الموقف، المهمة، الإجراء، النتيجة.' },
      },
      {
        q: '"Achievement" means…',
        qAr: 'كلمة "Achievement" تعني…',
        options: ['إنجاز', 'فشل', 'اجتماع'],
        answer: 0,
        explain: { en: 'An achievement is something good you did successfully.', ar: 'الإنجاز شيء جيد قمت به بنجاح.' },
      },
    ],
  },
  {
    id: 'meetings-presentations',
    track: 'english',
    title: 'Meetings and presentations',
    titleAr: 'الاجتماعات والعروض التقديمية',
    summary: {
      en: 'Prepare what to say, practice your slides, and learn phrases for agreeing, disagreeing, and asking.',
      ar: 'جهّز ما ستقوله، وتدرّب على شرائحك، وتعلّم عبارات الموافقة والاعتراض والسؤال.',
    },
    level: 'Intermediate',
    minutes: 7,
    icon: 'presentation',
    sections: [
      {
        heading: 'Prepare with Claude',
        headingAr: 'استعد مع Claude',
        paragraphs: [
          {
            en: 'Before a meeting, share the agenda with Claude and ask: "What questions might people ask me? Help me prepare short answers."',
            ar: 'قبل الاجتماع، شارك جدول الأعمال مع Claude واسأله: "ما الأسئلة التي قد يطرحها الناس عليّ؟ ساعدني في تجهيز إجابات قصيرة."',
          },
          {
            en: 'For a presentation, ask Claude to turn your notes into a simple slide outline, with one main idea per slide and a short script for each one.',
            ar: 'للعرض التقديمي، اطلب من Claude تحويل ملاحظاتك إلى مخطط شرائح بسيط، بفكرة رئيسية واحدة لكل شريحة ونص قصير لكل منها.',
          },
        ],
      },
      {
        heading: 'Phrases that help you join in',
        headingAr: 'عبارات تساعدك على المشاركة',
        paragraphs: [
          {
            en: 'To agree: "I completely agree." To disagree politely: "I see your point, but…". To give your opinion: "In my opinion…". To ask: "Could you explain that in more detail?"',
            ar: 'للموافقة: "I completely agree." وللاعتراض بأدب: "I see your point, but…". وللتعبير عن رأيك: "In my opinion…". وللسؤال: "Could you explain that in more detail?"',
          },
          {
            en: 'Ask Claude to create a short role-play of a meeting, where you practice these phrases in real situations.',
            ar: 'اطلب من Claude إنشاء تمثيل أدوار قصير لاجتماع، تتدرب فيه على هذه العبارات في مواقف حقيقية.',
          },
        ],
      },
    ],
    example: {
      bad: 'Help me with my presentation.',
      good: 'I will present our quarterly results to my team for 5 minutes. Here are my notes: <notes>…</notes>. Create an outline of 5 slides with one main idea each, and write a simple script I can say in about one minute per slide.',
      why: {
        en: 'Claude knows the audience, the time, and the exact output you need.',
        ar: 'يعرف Claude الجمهور والوقت والناتج الدقيق الذي تحتاجه.',
      },
    },
    tip: {
      en: 'Read your script out loud and record yourself. Then practice the sentences that felt difficult.',
      ar: 'اقرأ نصّك بصوت عالٍ وسجّل نفسك. ثم تدرّب على الجمل التي شعرت بصعوبتها.',
    },
    resources: [R.claude101, R.artifacts],
    vocab: [
      { word: 'agenda', ar: 'جدول أعمال', pos: 'noun', example: 'The first item on the agenda is the budget.' },
      { word: 'slide', ar: 'شريحة (عرض)', pos: 'noun', example: 'Let’s move to the next slide.' },
      { word: 'present', ar: 'يقدّم / يعرض', pos: 'verb', example: 'I will present the results tomorrow.' },
      { word: 'opinion', ar: 'رأي', pos: 'noun', example: 'In my opinion, we need more time.' },
      { word: 'agree', ar: 'يوافق', pos: 'verb', example: 'I agree with your idea.' },
    ],
    quiz: [
      {
        q: 'Which is a polite way to disagree?',
        qAr: 'ما الطريقة المهذبة للاعتراض؟',
        options: ['You are wrong.', 'I see your point, but…', 'No.'],
        answer: 1,
        explain: { en: 'It shows respect before giving your view.', ar: 'تُظهر الاحترام قبل أن تعطي رأيك.' },
      },
      {
        q: 'An "agenda" is…',
        qAr: 'كلمة "agenda" تعني…',
        options: ['جدول أعمال', 'شريحة', 'مدير'],
        answer: 0,
        explain: { en: 'An agenda is the list of topics for a meeting.', ar: 'جدول الأعمال هو قائمة مواضيع الاجتماع.' },
      },
    ],
  },
  {
    id: 'pronunciation',
    track: 'english',
    title: 'Speak clearly: pronunciation practice',
    titleAr: 'تحدّث بوضوح: تدريب على النطق',
    summary: {
      en: 'Common sounds that are hard for Arabic speakers, and how to practice them with Claude and this website.',
      ar: 'أصوات شائعة يصعب نطقها على متحدثي العربية، وكيف تتدرب عليها مع Claude ومع هذا الموقع.',
    },
    level: 'Beginner',
    minutes: 7,
    icon: 'mic',
    sections: [
      {
        heading: 'Sounds to watch',
        headingAr: 'أصوات تحتاج إلى انتباه',
        paragraphs: [
          {
            en: 'Many Arabic speakers find some sounds hard to pronounce. They often mix "p" and "b" (park and bark) or "v" and "f" (very and fairy), because Arabic does not have "p" or "v".',
            ar: 'يجد كثير من متحدثي العربية صعوبة في نطق بعض الأصوات. فهم غالبًا يخلطون بين "p" و"b" (park وbark) أو بين "v" و"f" (very وfairy)، لأن العربية لا تحتوي على صوتي "p" و"v".',
          },
          {
            en: 'English also has more vowel sounds than Arabic. Words like "ship" and "sheep" or "full" and "fool" have different vowels and different meanings.',
            ar: 'تحتوي الإنجليزية أيضًا على أصوات متحركة أكثر من العربية. كلمات مثل "ship" و"sheep" أو "full" و"fool" لها أصوات متحركة مختلفة ومعانٍ مختلفة.',
          },
        ],
      },
      {
        heading: 'Practice every day',
        headingAr: 'تدرّب كل يوم',
        paragraphs: [
          {
            en: 'Ask Claude for "minimal pairs": two words that differ in only one sound. Say them out loud, record yourself, and use voice mode so Claude can hear you. Do not worry about your accent — the goal is to be clear.',
            ar: 'اطلب من Claude "أزواجًا متقاربة": كلمتين تختلفان في صوت واحد فقط. انطقهما بصوت عالٍ، وسجّل نفسك، واستخدم وضع الصوت حتى يسمعك Claude. لا تقلق بشأن لكنتك — الهدف أن تكون واضحًا.',
          },
          {
            en: 'On this website, press the speaker icon to hear a word, then press the microphone icon and say it yourself. The site will tell you if it understood you.',
            ar: 'في هذا الموقع، اضغط على أيقونة السمّاعة لتسمع الكلمة، ثم اضغط على أيقونة الميكروفون وانطقها بنفسك. سيخبرك الموقع إن كان قد فهمك.',
          },
        ],
      },
    ],
    example: {
      bad: 'How to speak English well?',
      good: 'I am an Arabic speaker. Give me 10 minimal pairs for the sounds /p/ and /b/, with a short sentence for each word. Then give me a tongue twister to practice.',
      why: {
        en: 'A specific sound, your first language, and practice material you can use right away.',
        ar: 'صوت محدد، ولغتك الأم، ومواد تدريب يمكنك استخدامها فورًا.',
      },
    },
    tip: {
      en: 'Word stress matters: PHOtograph, phoTOgraphy, photoGRAphic. Ask Claude to mark the stressed syllable in CAPITAL letters.',
      ar: 'نبرة الكلمة مهمة: PHOtograph، وphoTOgraphy، وphotoGRAphic. اطلب من Claude تمييز المقطع المنبور بالحروف الكبيرة.',
    },
    resources: [R.voice],
    vocab: [
      { word: 'pronounce', ar: 'ينطق', pos: 'verb', example: 'How do you pronounce this word?' },
      { word: 'stress', ar: 'نبرة / ضغط (على مقطع)', pos: 'noun', example: 'The stress is on the first syllable.' },
      { word: 'vowel', ar: 'حرف متحرك / صوت علّة', pos: 'noun', example: 'English has many vowel sounds.' },
      { word: 'accent', ar: 'لكنة', pos: 'noun', example: 'Everyone has an accent, and that is fine.' },
      { word: 'record', ar: 'يسجّل', pos: 'verb', example: 'Record yourself and listen again.' },
    ],
    quiz: [
      {
        q: 'Which pair of words is a "minimal pair"?',
        qAr: 'أي زوج من الكلمات يُعد "زوجًا متقاربًا"؟',
        options: ['ship / sheep', 'table / window', 'happy / quickly'],
        answer: 0,
        explain: { en: 'They differ in only one sound: the vowel.', ar: 'تختلفان في صوت واحد فقط: الصوت المتحرك.' },
      },
      {
        q: 'Why do many Arabic speakers mix "p" and "b"?',
        qAr: 'لماذا يخلط كثير من متحدثي العربية بين "p" و"b"؟',
        options: ['Arabic has no "p" sound', 'Because "b" is silent', 'Because they are the same letter'],
        answer: 0,
        explain: { en: 'The "p" sound does not exist in Arabic.', ar: 'صوت "p" غير موجود في العربية.' },
      },
    ],
  },
  {
    id: 'english-for-developers',
    track: 'english',
    title: 'English for developers',
    titleAr: 'الإنجليزية للمبرمجين',
    summary: {
      en: 'Read error messages and documentation, and write clear bug reports and commit messages.',
      ar: 'اقرأ رسائل الأخطاء والوثائق، واكتب تقارير أخطاء ورسائل commit واضحة.',
    },
    level: 'Intermediate',
    minutes: 7,
    icon: 'bug',
    sections: [
      {
        heading: 'Error messages are clues',
        headingAr: 'رسائل الأخطاء أدلة',
        paragraphs: [
          {
            en: 'An error message is not your enemy — it is a clue. "TypeError: items.map is not a function" means "items" is not a list, so it has no "map" method.',
            ar: 'رسالة الخطأ ليست عدوّك — إنها دليل. عبارة "TypeError: items.map is not a function" تعني أن "items" ليست قائمة، لذلك لا تملك دالة "map".',
          },
          {
            en: 'Paste the full error into Claude and ask: "Explain this error word by word, then tell me the most likely cause." You will learn English and debugging together.',
            ar: 'الصق الخطأ كاملًا في Claude واسأله: "اشرح هذا الخطأ كلمة بكلمة، ثم أخبرني بالسبب الأكثر احتمالًا." ستتعلم الإنجليزية وتصحيح الأخطاء معًا.',
          },
        ],
      },
      {
        heading: 'Write like a professional',
        headingAr: 'اكتب كالمحترفين',
        paragraphs: [
          {
            en: 'A good bug report has three parts: what you did, what you expected, and what actually happened. Add the error message and the steps to reproduce it.',
            ar: 'تقرير الخطأ الجيد له ثلاثة أجزاء: ما الذي فعلته، وما الذي توقعته، وما الذي حدث فعلًا. أضف رسالة الخطأ وخطوات إعادة إنتاجه.',
          },
          {
            en: 'Commit messages are short and use the imperative: "Fix login bug", "Add dark mode". Clear messages help your team review and deploy changes safely. Ask Claude to review your commit messages and pull request descriptions.',
            ar: 'رسائل commit قصيرة وتستخدم صيغة الأمر: "Fix login bug" و"Add dark mode". الرسائل الواضحة تساعد فريقك على مراجعة التغييرات ونشرها بأمان. اطلب من Claude مراجعة رسائل commit ووصف طلبات الدمج الخاصة بك.',
          },
        ],
      },
    ],
    example: {
      bad: 'login not work pls fix',
      good: 'Bug: Login fails with correct password.\nSteps: 1. Open /login 2. Enter a valid email and password 3. Click "Sign in".\nExpected: I see the dashboard.\nActual: The page reloads and shows "401 Unauthorized".',
      why: {
        en: 'Anyone — a teammate or Claude — can understand and reproduce the problem.',
        ar: 'أي شخص — زميل أو Claude — يستطيع فهم المشكلة وإعادة إنتاجها.',
      },
    },
    tip: {
      en: 'Read official documentation in English every day, even for 10 minutes. Click any word here that you do not know.',
      ar: 'اقرأ الوثائق الرسمية بالإنجليزية كل يوم، ولو لمدة 10 دقائق. واضغط هنا على أي كلمة لا تعرفها.',
    },
    resources: [R.claudeCodeDocs, R.claudeCode101, R.apiCourse],
    vocab: [
      { word: 'bug', ar: 'خلل برمجي', pos: 'noun', example: 'I found a bug in the app.' },
      { word: 'debug', ar: 'يصحّح الأخطاء البرمجية', pos: 'verb', example: 'It took me an hour to debug this function.' },
      { word: 'deploy', ar: 'ينشر (تطبيقًا)', pos: 'verb', example: 'We deploy the website every Friday.' },
      { word: 'documentation', ar: 'وثائق / توثيق', pos: 'noun', example: 'Read the documentation before you start.' },
      { word: 'clue', ar: 'دليل / مفتاح', pos: 'noun', example: 'The error message is a clue.' },
    ],
    quiz: [
      {
        q: 'What are the three parts of a good bug report?',
        qAr: 'ما الأجزاء الثلاثة لتقرير الخطأ الجيد؟',
        options: ['Name, age, city', 'What you did, what you expected, what happened', 'Title, emoji, signature'],
        answer: 1,
        explain: { en: 'Steps, expected result, and actual result.', ar: 'الخطوات، والنتيجة المتوقعة، والنتيجة الفعلية.' },
      },
      {
        q: 'Which is a good commit message?',
        qAr: 'أي رسالة commit جيدة؟',
        options: ['stuff', 'Fix login bug', 'I changed some things today maybe'],
        answer: 1,
        explain: { en: 'Short, clear, and in the imperative form.', ar: 'قصيرة وواضحة وبصيغة الأمر.' },
      },
    ],
  },
]
