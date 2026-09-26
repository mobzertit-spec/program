/** Content for the Practice games. English stays simple (B1); Arabic hints help beginners. */

export type OrderTask = {
  id: string
  goal: string
  goalAr: string
  /** prompt parts in the best order */
  parts: { text: string; label: 'Role' | 'Context' | 'Task' | 'Example' | 'Format' }[]
}

export const orderTasks: OrderTask[] = [
  {
    id: 'email',
    goal: 'Ask for a polite email to your manager',
    goalAr: 'اطلب بريدًا مهذبًا إلى مديرك',
    parts: [
      { label: 'Role', text: 'You are an expert business writer.' },
      { label: 'Context', text: 'I need Friday off because my brother is getting married.' },
      { label: 'Task', text: 'Write a short email to my manager asking for the day off.' },
      { label: 'Format', text: 'Keep it under 80 words and use a friendly, professional tone.' },
    ],
  },
  {
    id: 'grammar',
    goal: 'Get your English corrected',
    goalAr: 'احصل على تصحيح لغتك الإنجليزية',
    parts: [
      { label: 'Role', text: 'You are a patient English teacher.' },
      { label: 'Context', text: 'I am an intermediate learner and I often make mistakes with verb tenses.' },
      { label: 'Task', text: 'Correct the paragraph below.' },
      { label: 'Format', text: 'For each correction, explain the rule in one simple sentence.' },
    ],
  },
  {
    id: 'trip',
    goal: 'Plan a short trip',
    goalAr: 'خطّط لرحلة قصيرة',
    parts: [
      { label: 'Context', text: 'I am visiting Istanbul for two days with my parents, who cannot walk very far.' },
      { label: 'Task', text: 'Suggest a simple plan with two places to visit each day.' },
      { label: 'Example', text: 'For example: "Morning — Hagia Sophia (short walk from the tram)."' },
      { label: 'Format', text: 'Use a numbered list for each day.' },
    ],
  },
  {
    id: 'code',
    goal: 'Get help with a coding error',
    goalAr: 'اطلب المساعدة في خطأ برمجي',
    parts: [
      { label: 'Role', text: 'You are a senior JavaScript developer and a good teacher.' },
      { label: 'Context', text: 'I am building a to-do app in React and I see "TypeError: items.map is not a function".' },
      { label: 'Task', text: 'Explain the most likely cause and show me how to fix it.' },
      { label: 'Format', text: 'Use simple English and a short code example.' },
    ],
  },
  {
    id: 'summary',
    goal: 'Summarize a long article',
    goalAr: 'لخّص مقالًا طويلًا',
    parts: [
      { label: 'Context', text: '<article> …the full article… </article>' },
      { label: 'Task', text: 'Summarize the article above for a busy manager.' },
      { label: 'Format', text: 'Give three bullet points, then one sentence with your recommendation.' },
    ],
  },
]

export type FixTask = {
  id: string
  weak: string
  options: { text: string; good: boolean; why: string; whyAr: string }[]
  strong: string
}

export const fixTasks: FixTask[] = [
  {
    id: 'london',
    weak: 'Tell me about London.',
    options: [
      { text: 'Say why you need it (a 3-day family trip in winter)', good: true, why: 'Context tells Claude what matters.', whyAr: 'السياق يخبر Claude بما هو مهم.' },
      { text: 'Ask for a numbered list with one plan per day', good: true, why: 'A clear format makes the answer easy to use.', whyAr: 'التنسيق الواضح يجعل الإجابة سهلة الاستخدام.' },
      { text: 'Write "please" five times so Claude tries harder', good: false, why: 'Politeness is nice, but repetition adds nothing.', whyAr: 'التهذيب جميل، لكن التكرار لا يضيف شيئًا.' },
      { text: 'Mention your kids’ ages and that you prefer indoor places', good: true, why: 'Specific details lead to specific answers.', whyAr: 'التفاصيل المحددة تؤدي إلى إجابات محددة.' },
      { text: 'Make it shorter: just "London?"', good: false, why: 'Shorter is not clearer — it removes the task.', whyAr: 'الأقصر ليس أوضح — إنه يحذف المهمة.' },
    ],
    strong:
      'I am visiting London for 3 days in winter with my two kids (ages 7 and 10). We prefer indoor places. Suggest a simple plan with one indoor activity per day. Use a numbered list.',
  },
  {
    id: 'cv',
    weak: 'Fix my CV.',
    options: [
      { text: 'Say which job you are applying for', good: true, why: 'Claude can match your CV to the job.', whyAr: 'يستطيع Claude مواءمة سيرتك مع الوظيفة.' },
      { text: 'Ask Claude to invent more experience', good: false, why: 'Your CV must stay honest.', whyAr: 'يجب أن تبقى سيرتك صادقة.' },
      { text: 'Paste the CV and the job ad inside separate tags', good: true, why: 'Tags keep the two texts clearly apart.', whyAr: 'الوسوم تفصل النصين بوضوح.' },
      { text: 'Ask for the three most important changes, with reasons', good: true, why: 'A clear output you can learn from.', whyAr: 'ناتج واضح يمكنك التعلّم منه.' },
      { text: 'Use ALL CAPITAL LETTERS so it looks important', good: false, why: 'Capital letters do not add information.', whyAr: 'الحروف الكبيرة لا تضيف معلومات.' },
    ],
    strong:
      'I am applying for a junior data analyst job. <cv>…</cv> <job_ad>…</job_ad> Suggest the three most important changes to my CV for this job, and explain why. Keep everything honest.',
  },
  {
    id: 'code',
    weak: 'My code doesn’t work.',
    options: [
      { text: 'Paste the full error message', good: true, why: 'The error is the most important clue.', whyAr: 'رسالة الخطأ هي أهم دليل.' },
      { text: 'Say what you expected to happen', good: true, why: 'Claude needs to know the goal.', whyAr: 'يحتاج Claude إلى معرفة الهدف.' },
      { text: 'Only write "urgent!!!"', good: false, why: 'Urgency does not help Claude find the bug.', whyAr: 'الاستعجال لا يساعد Claude على إيجاد الخطأ.' },
      { text: 'Share the code and the language or framework', good: true, why: 'Without the code, Claude can only guess.', whyAr: 'بدون الكود، لا يستطيع Claude إلا التخمين.' },
      { text: 'Ask Claude not to explain anything', good: false, why: 'Short explanations help you learn and avoid the bug next time.', whyAr: 'الشرح القصير يساعدك على التعلّم وتجنّب الخطأ لاحقًا.' },
    ],
    strong:
      'In my React to-do app, clicking "Add" does nothing and the console shows: "TypeError: items.map is not a function". I expected the new item to appear in the list. <code>…</code> Explain the cause simply and show the fix.',
  },
]
