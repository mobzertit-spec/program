import { PageHeader } from '@/components/ui/page-header'

type Item = { title: string; titleAr: string; body: string; bodyAr: string }

const ITEMS: Item[] = [
  {
    title: 'Your progress stays on your device',
    titleAr: 'تقدّمك يبقى على جهازك',
    body: 'Lessons you finish, XP, saved words and settings are stored in your browser (local storage). Without an account, nothing about your learning leaves your device. You can download a backup or reset everything on the Path page.',
    bodyAr: 'الدروس التي تنهيها والنقاط والكلمات المحفوظة والإعدادات تُحفظ في متصفحك. بدون حساب لا يخرج شيء من تعلّمك من جهازك، ويمكنك تنزيل نسخة احتياطية أو مسح كل شيء من صفحة المسار.',
  },
  {
    title: 'An account is optional',
    titleAr: 'الحساب اختياري',
    body: 'If you sign in, we use Supabase (servers in Frankfurt, Germany) to keep your email address and a copy of your progress, so you can continue on other devices. With Google sign-in we also receive your name and profile picture. Only you can read your progress — every table is protected by row-level security.',
    bodyAr: 'إذا سجّلت الدخول نستخدم Supabase (خوادم في فرانكفورت، ألمانيا) لحفظ بريدك ونسخة من تقدّمك لتتابع على أجهزة أخرى. ومع الدخول بجوجل نستلم اسمك وصورتك. لا أحد غيرك يستطيع قراءة تقدّمك.',
  },
  {
    title: 'The leaderboard is opt-in',
    titleAr: 'لوحة المتصدّرين باختيارك',
    body: 'You only appear on the weekly leaderboard if you choose to join. Then your chosen display name and your XP from the last 7 days are public. You can leave at any time and you disappear from the board at once.',
    bodyAr: 'لا تظهر في لوحة المتصدّرين إلا إذا اخترت الانضمام، وعندها يظهر الاسم الذي تختاره ونقاطك في آخر 7 أيام فقط. يمكنك المغادرة في أي وقت.',
  },
  {
    title: 'Lesson feedback',
    titleAr: 'تقييم الدروس',
    body: 'When you answer “Was this lesson helpful?”, we store your answer and your optional comment to improve the lessons. The answer is anonymous unless you are signed in.',
    bodyAr: 'عندما تجيب على سؤال "هل كان الدرس مفيدًا؟" نحفظ إجابتك وتعليقك الاختياري لتحسين الدروس. الإجابة مجهولة الهوية ما لم تكن مسجّل الدخول.',
  },
  {
    title: 'Prompt coach',
    titleAr: 'مدرّب الطلبات',
    body: 'When you ask the coach for feedback, the text you wrote is sent to Anthropic’s Claude API to create the feedback. CE does not keep your text. To stop abuse we count requests per day using a one-way code made from your IP address that changes every day; the address itself is never stored. Do not type personal or secret information into the coach.',
    bodyAr: 'عندما تطلب رأي المدرّب يُرسَل النص الذي كتبته إلى واجهة Claude من Anthropic لإعداد الملاحظات، ولا يحتفظ CE بنصك. ولمنع إساءة الاستخدام نعدّ الطلبات اليومية برمز أحادي الاتجاه مشتق من عنوان IP يتغير كل يوم، ولا نحفظ العنوان نفسه. لا تكتب معلومات شخصية أو سرية في المدرّب.',
  },
  {
    title: 'Translations and videos',
    titleAr: 'الترجمة والفيديوهات',
    body: 'Most words are translated offline. Words that are not in the built-in dictionary are sent (the word or phrase only) to the free MyMemory translation service. Official videos load from youtube-nocookie.com only after you press play.',
    bodyAr: 'تُترجم أغلب الكلمات دون إنترنت. الكلمات غير الموجودة في القاموس المدمج تُرسل وحدها إلى خدمة الترجمة المجانية MyMemory. والفيديوهات الرسمية لا تُحمَّل من youtube-nocookie.com إلا بعد الضغط على تشغيل.',
  },
  {
    title: 'No ads, no tracking',
    titleAr: 'بلا إعلانات ولا تتبّع',
    body: 'CE has no ads, no tracking cookies and no third-party analytics. Fonts are served from this site. CE is an independent learning project and is not affiliated with Anthropic.',
    bodyAr: 'لا إعلانات ولا ملفات تتبّع ولا أدوات تحليل خارجية. الخطوط تُحمَّل من الموقع نفسه. CE مشروع تعليمي مستقل وغير تابع لشركة Anthropic.',
  },
]

export default function Privacy() {
  return (
    <div className="mx-auto max-w-[760px] px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      <PageHeader
        eyebrow={{ en: 'Privacy', ar: 'الخصوصية' }}
        title={{ en: 'Your data, in plain words.', ar: 'بياناتك بكلمات واضحة' }}
        intro={{ en: 'What CE stores, where, and why — short and honest.', ar: 'ماذا يحفظ CE، وأين، ولماذا — باختصار وصراحة.' }}
      />
      <div className="mt-12 space-y-4">
        {ITEMS.map((it) => (
          <section key={it.title} className="rounded-3xl border border-border-soft bg-surface p-6 shadow-card">
            <h2 className="text-xl font-semibold tracking-tight">{it.title}</h2>
            <p lang="ar" data-ar-help className="text-sm text-fg-muted">{it.titleAr}</p>
            <p className="mt-3 leading-relaxed text-fg-muted">{it.body}</p>
            <p lang="ar" data-ar-help className="mt-2 text-sm leading-relaxed text-fg-subtle">{it.bodyAr}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm text-fg-muted">
        Questions or a request to delete your data? Open an issue on{' '}
        <a href="https://github.com/mobzertit-spec/program/issues" target="_blank" rel="noreferrer" className="font-medium text-link hover:underline">
          GitHub
        </a>
        . Last updated: September 2026.
      </p>
    </div>
  )
}
