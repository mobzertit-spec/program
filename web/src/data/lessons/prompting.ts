import { R } from '../resources'
import type { LessonInput } from './types'

export const prompting: LessonInput[] = [
  {
    id: 'use-examples',
    track: 'prompting',
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
    resources: [R.bestPractices, R.promptTutorial],
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
    track: 'prompting',
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
    resources: [R.bestPractices, R.promptTutorial],
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
    track: 'prompting',
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
    resources: [R.bestPractices, R.promptTutorial],
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
    track: 'prompting',
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
    resources: [R.bestPractices, R.whenSearch],
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
    id: 'format-control',
    track: 'prompting',
    title: 'Shape the answer',
    titleAr: 'تحكّم في شكل الإجابة',
    summary: {
      en: 'Get the length, layout, and style you need — lists, tables, short answers, or flowing paragraphs.',
      ar: 'احصل على الطول والتنسيق والأسلوب الذي تحتاجه — قوائم، أو جداول، أو إجابات قصيرة، أو فقرات متصلة.',
    },
    level: 'Intermediate',
    minutes: 6,
    icon: 'list',
    sections: [
      {
        heading: 'Say what to do, not what to avoid',
        headingAr: 'قل ماذا يفعل، لا ماذا يتجنب',
        paragraphs: [
          {
            en: 'Positive instructions work better than negative ones. Instead of "Don’t use bullet points", write "Answer in two short paragraphs of normal prose."',
            ar: 'التعليمات الإيجابية تعمل أفضل من السلبية. بدلًا من "لا تستخدم النقاط"، اكتب "أجب في فقرتين قصيرتين من النص العادي."',
          },
          {
            en: 'Be exact about length. "Short" can mean many things, but "under 100 words" or "three bullet points" is clear to everyone.',
            ar: 'كن دقيقًا في الطول. كلمة "قصير" قد تعني أشياء كثيرة، لكن "أقل من 100 كلمة" أو "ثلاث نقاط" واضحة للجميع.',
          },
        ],
      },
      {
        heading: 'Match your prompt to the result',
        headingAr: 'اجعل طلبك يشبه النتيجة',
        paragraphs: [
          {
            en: 'The style of your prompt influences the style of the answer. If you write your prompt with many headings and lists, the answer will often look similar.',
            ar: 'أسلوب طلبك يؤثر في أسلوب الإجابة. إذا كتبت طلبك بعناوين وقوائم كثيرة، ستبدو الإجابة غالبًا مشابهة.',
          },
          {
            en: 'For structured data, name the exact layout: "a table with three columns: word, meaning, example". Claude will follow it closely.',
            ar: 'للبيانات المنظمة، سمِّ التنسيق بالضبط: "جدول من ثلاثة أعمدة: الكلمة، المعنى، المثال". سيتبعه Claude بدقة.',
          },
        ],
      },
    ],
    example: {
      bad: 'Explain the past simple tense. Don’t make it long and don’t use difficult words.',
      good: 'Explain the past simple tense in under 80 words, using easy words. Then give a table with three columns: verb, past form, example sentence. Add 5 rows.',
      why: {
        en: 'The good prompt gives a clear length, a positive instruction, and an exact layout.',
        ar: 'الطلب الجيد يحدد طولًا واضحًا، وتعليمة إيجابية، وتنسيقًا دقيقًا.',
      },
    },
    tip: {
      en: 'Useful phrases: "in one sentence", "as a numbered list", "in a table", "in plain text without headings".',
      ar: 'عبارات مفيدة: "in one sentence" و"as a numbered list" و"in a table" و"in plain text without headings".',
    },
    resources: [R.bestPractices, R.promptTutorial],
    vocab: [
      { word: 'concise', ar: 'موجز', pos: 'adjective', example: 'Please keep your answer concise.' },
      { word: 'prose', ar: 'نثر / نص متصل', pos: 'noun', example: 'Write the summary in prose, not bullet points.' },
      { word: 'heading', ar: 'عنوان فرعي', pos: 'noun', example: 'Each section needs a heading.' },
      { word: 'bullet', ar: 'نقطة (في قائمة)', pos: 'noun', example: 'Give me three bullets with the main ideas.' },
      { word: 'layout', ar: 'تخطيط / ترتيب', pos: 'noun', example: 'I like the layout of this page.' },
    ],
    quiz: [
      {
        q: 'Which instruction usually works better?',
        qAr: 'أي تعليمة تعمل أفضل عادةً؟',
        options: ['Don’t write too much.', 'Answer in under 60 words.', 'Not long please.'],
        answer: 1,
        explain: { en: 'A positive, exact instruction is easiest to follow.', ar: 'التعليمة الإيجابية الدقيقة هي الأسهل في الاتباع.' },
      },
      {
        q: '"Concise" means…',
        qAr: 'كلمة "Concise" تعني…',
        options: ['طويل ومفصّل', 'موجز', 'مضحك'],
        answer: 1,
        explain: { en: 'Concise = short and clear, with no extra words.', ar: 'موجز = قصير وواضح بلا كلمات زائدة.' },
      },
    ],
  },
  {
    id: 'long-documents',
    track: 'prompting',
    title: 'Work with long documents',
    titleAr: 'تعامل مع المستندات الطويلة',
    summary: {
      en: 'Put the document first, ask your question last, and ask Claude to quote the important parts.',
      ar: 'ضع المستند أولًا، واطرح سؤالك في النهاية، واطلب من Claude أن يقتبس الأجزاء المهمة.',
    },
    level: 'Advanced',
    minutes: 7,
    icon: 'book',
    sections: [
      {
        heading: 'Document at the top, question at the bottom',
        headingAr: 'المستند في الأعلى، والسؤال في الأسفل',
        paragraphs: [
          {
            en: 'When you paste a long text, such as a report or a contract, put it at the top of your message. Write your question and instructions in the last section, at the end.',
            ar: 'عندما تلصق نصًا طويلًا، مثل تقرير أو عقد، ضعه في أعلى رسالتك. واكتب سؤالك وتعليماتك في القسم الأخير، في النهاية.',
          },
          {
            en: 'Anthropic’s own tests show that asking the question at the end can improve the quality of answers, especially with several documents.',
            ar: 'اختبارات Anthropic نفسها تُظهر أن طرح السؤال في النهاية قد يحسّن جودة الإجابات، خصوصًا مع عدة مستندات.',
          },
        ],
      },
      {
        heading: 'Quotes first, then the answer',
        headingAr: 'الاقتباسات أولًا، ثم الإجابة',
        paragraphs: [
          {
            en: 'Ask Claude to extract the relevant quotes before it answers. The quotes are evidence: they keep the answer close to the real text and make it easy for you to check.',
            ar: 'اطلب من Claude أن يستخرج الاقتباسات ذات الصلة قبل أن يجيب. الاقتباسات دليل: فهي تُبقي الإجابة قريبة من النص الحقيقي وتسهّل عليك التحقق منها.',
          },
          {
            en: 'With several documents, wrap each one in its own tags, for example <document> with a <source> name, so Claude can tell you where each fact comes from.',
            ar: 'مع عدة مستندات، ضع كل واحد داخل وسومه الخاصة، مثل <document> مع اسم <source>، حتى يخبرك Claude من أين جاءت كل معلومة.',
          },
        ],
      },
    ],
    example: {
      bad: 'What does this contract say about holidays? [contract pasted below the question]',
      good: '<document>\n<source>employment_contract.pdf</source>\n…contract text…\n</document>\nFirst, copy the exact sentences about holidays into <quotes> tags. Then explain them in simple English.',
      why: {
        en: 'The document comes first, and the quotes let you verify every claim.',
        ar: 'المستند يأتي أولًا، والاقتباسات تتيح لك التحقق من كل معلومة.',
      },
    },
    tip: {
      en: 'Reading practice: ask Claude to quote one difficult paragraph and explain it sentence by sentence.',
      ar: 'تمرين قراءة: اطلب من Claude أن يقتبس فقرة صعبة ويشرحها جملة بجملة.',
    },
    resources: [R.bestPractices, R.claude101],
    vocab: [
      { word: 'quote', ar: 'يقتبس / اقتباس', pos: 'verb', example: 'Quote the sentence that proves your point.' },
      { word: 'extract', ar: 'يستخرج', pos: 'verb', example: 'Extract the dates from this email.' },
      { word: 'source', ar: 'مصدر', pos: 'noun', example: 'Always check the source of the information.' },
      { word: 'evidence', ar: 'دليل', pos: 'noun', example: 'Is there any evidence for this idea?' },
      { word: 'section', ar: 'قسم', pos: 'noun', example: 'Read the second section again.' },
    ],
    quiz: [
      {
        q: 'Where should you put your question when you share a long document?',
        qAr: 'أين تضع سؤالك عندما تشارك مستندًا طويلًا؟',
        options: ['At the end, after the document', 'In the middle of the document', 'In a different chat'],
        answer: 0,
        explain: { en: 'Long content first, question last.', ar: 'المحتوى الطويل أولًا، والسؤال في النهاية.' },
      },
      {
        q: 'Why ask Claude for quotes first?',
        qAr: 'لماذا تطلب من Claude الاقتباسات أولًا؟',
        options: ['To make the answer longer', 'To keep the answer close to the real text', 'Because it is required'],
        answer: 1,
        explain: { en: 'Quotes ground the answer and make it easy to check.', ar: 'الاقتباسات تربط الإجابة بالنص وتسهّل التحقق.' },
      },
    ],
  },
  {
    id: 'prompt-chaining',
    track: 'prompting',
    title: 'Break big tasks into steps',
    titleAr: 'قسّم المهام الكبيرة إلى خطوات',
    summary: {
      en: 'Draft, review, refine: a simple chain of prompts gives better results than one giant prompt.',
      ar: 'مسودة، ثم مراجعة، ثم تحسين: سلسلة بسيطة من الطلبات تعطي نتائج أفضل من طلب واحد ضخم.',
    },
    level: 'Advanced',
    minutes: 7,
    icon: 'link',
    sections: [
      {
        heading: 'One step at a time',
        headingAr: 'خطوة واحدة في كل مرة',
        paragraphs: [
          {
            en: 'Some tasks have many parts: research, writing, checking, and formatting. Instead of asking for everything at once, give Claude one stage at a time.',
            ar: 'بعض المهام لها أجزاء كثيرة: البحث، والكتابة، والمراجعة، والتنسيق. بدلًا من طلب كل شيء مرة واحدة، أعطِ Claude مرحلة واحدة في كل مرة.',
          },
          {
            en: 'After each stage, you can read the result, fix problems early, and decide what comes next. This is called prompt chaining.',
            ar: 'بعد كل مرحلة، يمكنك قراءة النتيجة، وإصلاح المشاكل مبكرًا، وتقرير ما يأتي بعدها. يُسمى هذا تسلسل الطلبات.',
          },
        ],
      },
      {
        heading: 'The self-correction chain',
        headingAr: 'سلسلة التصحيح الذاتي',
        paragraphs: [
          {
            en: 'A very useful chain is a sequence of three steps. First, ask Claude for a draft. Next, ask it to evaluate the draft against clear criteria. Finally, ask it to improve the draft using that review.',
            ar: 'سلسلة مفيدة جدًا هي تسلسل من ثلاث خطوات. أولًا، اطلب من Claude مسودة. ثم اطلب منه تقييم المسودة وفق معايير واضحة. وأخيرًا، اطلب منه تحسين المسودة بناءً على تلك المراجعة.',
          },
          {
            en: 'Good criteria are specific, for example: "Is every sentence under 20 words? Is the tone polite? Is the main request in the first line?"',
            ar: 'المعايير الجيدة محددة، مثلًا: "هل كل جملة أقل من 20 كلمة؟ هل الأسلوب مهذب؟ هل الطلب الرئيسي في السطر الأول؟"',
          },
        ],
      },
    ],
    example: {
      bad: 'Research remote jobs, write my cover letter, check it, and make it perfect.',
      good: 'Step 1: "Write a first draft of a cover letter for this job ad: <ad>…</ad>"\nStep 2: "Review your draft: is it under 250 words, specific to the ad, and confident? List the problems."\nStep 3: "Now rewrite the letter and fix every problem you listed."',
      why: {
        en: 'Each step has one clear job, and you can check the result before moving on.',
        ar: 'لكل خطوة مهمة واحدة واضحة، ويمكنك التحقق من النتيجة قبل الانتقال.',
      },
    },
    tip: {
      en: 'Use this chain for your own English writing: draft → "list my grammar mistakes" → "show the corrected version".',
      ar: 'استخدم هذه السلسلة لكتابتك الإنجليزية: مسودة ← "اذكر أخطائي النحوية" ← "اعرض النسخة المصححة".',
    },
    resources: [R.bestPractices, R.apiCourse],
    video: R.vPromptingAgents,
    vocab: [
      { word: 'chain', ar: 'سلسلة', pos: 'noun', example: 'A chain of small steps is easier to manage.' },
      { word: 'sequence', ar: 'تسلسل / ترتيب', pos: 'noun', example: 'Follow the steps in the right sequence.' },
      { word: 'stage', ar: 'مرحلة', pos: 'noun', example: 'We are in the first stage of the project.' },
      { word: 'evaluate', ar: 'يقيّم', pos: 'verb', example: 'Evaluate the answer before you use it.' },
      { word: 'criteria', ar: 'معايير', pos: 'noun', example: 'What are the criteria for a good email?' },
    ],
    quiz: [
      {
        q: 'What are the three steps of the self-correction chain?',
        qAr: 'ما الخطوات الثلاث لسلسلة التصحيح الذاتي؟',
        options: ['Translate → print → send', 'Draft → review → refine', 'Search → copy → paste'],
        answer: 1,
        explain: { en: 'Generate a draft, review it against criteria, then improve it.', ar: 'أنشئ مسودة، وراجعها وفق معايير، ثم حسّنها.' },
      },
      {
        q: '"Criteria" in Arabic is…',
        qAr: 'كلمة "Criteria" بالعربية هي…',
        options: ['مراحل', 'معايير', 'مصادر'],
        answer: 1,
        explain: { en: 'Criteria are the standards used to judge something.', ar: 'المعايير هي المقاييس التي يُحكم بها على الشيء.' },
      },
    ],
  },
]
