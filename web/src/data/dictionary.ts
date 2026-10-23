/**
 * Offline English → Arabic dictionary.
 * Format per line: word|part-of-speech|Arabic meaning
 * Inflected forms (plurals, -ed, -ing …) are resolved by `lemmatize` in lib/translate.ts.
 */
const RAW = `
a|det|أداة نكرة (واحد)
able|adj|قادر
about|prep|عن / حول
above|prep|فوق / أعلاه
accuracy|n|دقة
accurate|adj|دقيق
act|v|يتصرّف / يؤدي دورًا
activity|n|نشاط
adapt|v|يتكيّف
add|v|يضيف
advice|n|نصيحة
after|prep|بعد
again|adv|مرة أخرى
age|n|عمر / سن
ai|n|الذكاء الاصطناعي
all|det|كل / جميع
already|adv|بالفعل / مسبقًا
also|adv|أيضًا
always|adv|دائمًا
an|det|أداة نكرة (قبل الحروف المتحركة)
analyze|v|يحلّل
analysis|n|تحليل
and|conj|و
answer|n|إجابة / يجيب
any|det|أي
anything|pron|أي شيء
app|n|تطبيق
apply|v|يتقدّم (لوظيفة) / يطبّق
arabic|n|اللغة العربية
article|n|مقال
as|conj|كـ / بينما
ask|v|يسأل / يطلب
assistant|n|مساعد
at|prep|في / عند
attitude|n|موقف / سلوك
audience|n|جمهور
avoid|v|يتجنّب
background|n|خلفية
battery|n|بطارية
be|v|يكون
because|conj|لأن
become|v|يصبح
before|prep|قبل
beginner|n|مبتدئ
below|prep|أدناه / تحت
best|adj|الأفضل
better|adj|أفضل
between|prep|بين
big|adj|كبير
borrow|v|يستعير / يقترض
bottom|n|أسفل
brief|adj|موجز
briefly|adv|باختصار
brilliant|adj|عبقري / رائع
budget|n|ميزانية
bug|n|خلل برمجي
build|v|يبني
but|conj|لكن
buy|v|يشتري
by|prep|بواسطة / من قِبل
call|v|يسمّي / يتصل
can|v|يستطيع
cannot|v|لا يستطيع
careful|adj|حذر / دقيق
carefully|adv|بعناية
casual|adj|عفوي / غير رسمي
change|v|يغيّر
chat|n|محادثة / دردشة
check|v|يتحقق
choice|n|اختيار
choose|v|يختار
clear|adj|واضح
clearly|adv|بوضوح
click|v|ينقر
close|adj|قريب
closely|adv|عن كثب / بشكل مبالغ
clue|n|دليل / مفتاح
coach|n|مدرّب
code|n|كود / شيفرة برمجية
coding|n|البرمجة
colleague|n|زميل عمل
comment|n|تعليق
common|adj|شائع
compare|v|يقارن
comparison|n|مقارنة
complex|adj|معقّد
component|n|مكوّن
confident|adj|واثق
confused|adj|مرتبك / مشوّش
connect|v|يربط / يتصل
con|n|سلبية / عيب
consistent|adj|ثابت / متّسق
console|n|وحدة التحكم (الكونسول)
contain|v|يحتوي
content|n|محتوى
context|n|سياق
continue|v|يستمر / يواصل
conversation|n|محادثة
copy|v|ينسخ
correct|v|يصحّح / صحيح
correction|n|تصحيح
create|v|ينشئ / يصنع
customer|n|عميل / زبون
cv|n|سيرة ذاتية
daily|adj|يومي
data|n|بيانات
date|n|تاريخ / موعد
day|n|يوم
decide|v|يقرّر
depend|v|يعتمد
describe|v|يصف
description|n|وصف
design|n|تصميم
detail|n|تفصيل
detailed|adj|مفصّل
developer|n|مطوّر
difference|n|فرق
different|adj|مختلف
difficult|adj|صعب
direct|adj|مباشر
direction|n|اتجاه
directly|adv|مباشرة
do|v|يفعل
doctor|n|طبيب
document|n|مستند / وثيقة
draft|n|مسودة
each|det|كل
early|adj|مبكر / أولي
easily|adv|بسهولة
easy|adj|سهل
editor|n|محرّر
egg|n|بيضة
email|n|بريد إلكتروني
encourage|v|يشجّع
encouraging|adj|مشجّع
end|n|نهاية / ينتهي
ending|n|خاتمة / نهاية
english|n|اللغة الإنجليزية
error|n|خطأ
especially|adv|خصوصًا
essay|n|مقال / موضوع إنشائي
evening|n|مساء
every|det|كل
everyone|pron|الجميع
exact|adj|دقيق / بالضبط
exactly|adv|بالضبط
exam|n|امتحان
example|n|مثال
exercise|n|تمرين
expert|n|خبير
explain|v|يشرح
fact|n|حقيقة
fast|adj|سريع
feedback|n|ملاحظات / تقييم
feel|v|يشعر
feeling|n|شعور
few|det|قليل / بضعة
file|n|ملف
final|adj|نهائي
find|v|يجد
fine|adj|جيد / مقبول
first|adj|أول
fix|v|يصلح / إصلاح
flashcard|n|بطاقة تعليمية
fluent|adj|طليق
follow|v|يتبع
for|prep|لـ / من أجل
form|n|شكل / نموذج
formal|adj|رسمي
format|n|تنسيق / شكل
framework|n|إطار عمل
friday|n|الجمعة
friend|n|صديق
friendly|adj|ودود
from|prep|من
full|adj|كامل / ممتلئ
function|n|دالة / وظيفة
funny|adj|مضحك
get|v|يحصل على
give|v|يعطي
go|v|يذهب
goal|n|هدف
good|adj|جيد
grammar|n|قواعد اللغة
great|adj|رائع / عظيم
guess|v|يخمّن
guest|n|ضيف / نزيل
happen|v|يحدث
hard|adj|صعب
have|v|يملك / لديه
help|v|يساعد
helpful|adj|مفيد
her|pron|ها / لها
here|adv|هنا
high|adj|عالٍ
his|pron|ـه / خاصته
honest|adj|صادق
hotel|n|فندق
how|adv|كيف
i|pron|أنا
idea|n|فكرة
if|conj|إذا
image|n|صورة
imagine|v|يتخيّل
important|adj|مهم
improve|v|يحسّن
in|prep|في
include|v|يتضمّن / يضمّن
indoor|adj|داخلي
informal|adj|غير رسمي
information|n|معلومات
inside|prep|داخل
instead|adv|بدلًا من ذلك
instruction|n|تعليمة
interactive|adj|تفاعلي
intermediate|adj|متوسط المستوى
interview|n|مقابلة
interviewer|n|مُجري المقابلة
into|prep|إلى داخل
is|v|يكون (هو/هي)
it|pron|هو / هي (لغير العاقل)
item|n|عنصر
iterate|v|يكرّر للتحسين
its|pron|ـه / ـها (لغير العاقل)
job|n|وظيفة / عمل
junior|adj|مبتدئ / صغير الرتبة
just|adv|فقط / للتو
keep|v|يحافظ / يُبقي
key|n|مفتاح
kid|n|طفل
kind|n|نوع / لطيف
know|v|يعرف
knowledge|n|معرفة
language|n|لغة
laptop|n|حاسوب محمول
last|adj|أخير
lazy|adj|كسول
lead|v|يقود / يؤدي إلى
learn|v|يتعلّم
learner|n|متعلّم
learning|n|التعلّم
length|n|طول
less|adj|أقل
lesson|n|درس
let|v|يدع / يسمح
level|n|مستوى
like|prep|مثل / يحب
line|n|سطر / خط
list|n|قائمة
long|adj|طويل
look|v|ينظر / يبدو
lose|v|يفقد / يضيّع
lot|n|كثير
magic|adj|سحري
main|adj|رئيسي
make|v|يصنع / يجعل
manager|n|مدير
many|det|كثير
map|n|خريطة
math|n|رياضيات
matter|v|يهم
may|v|قد / ربما
me|pron|ني / لي
mean|v|يعني
meaning|n|معنى
meet|v|يقابل / يتعرّف على
meeting|n|اجتماع
mention|v|يذكر
message|n|رسالة
might|v|قد / ربما
mind|n|عقل / ذهن
missing|adj|مفقود / ناقص
mistake|n|خطأ
mix|v|يخلط
more|adj|أكثر
most|adj|معظم / الأكثر
mostly|adv|غالبًا
much|adv|كثيرًا
must|v|يجب
my|pron|ـي (ملكية)
name|n|اسم
natural|adj|طبيعي
naturally|adv|بشكل طبيعي
need|v|يحتاج
new|adj|جديد
next|adj|التالي
no|det|لا
nobody|pron|لا أحد
normal|adj|عادي / طبيعي
not|adv|ليس / لا
note|n|ملاحظة
nothing|pron|لا شيء
now|adv|الآن
number|n|رقم / عدد
numbered|adj|مرقّم
of|prep|من / لـ
off|adv|إجازة / مُطفأ
often|adv|غالبًا
old|adj|قديم / كبير في السن
on|prep|على
once|adv|مرة واحدة
one|n|واحد
only|adv|فقط
opposite|n|عكس
option|n|خيار
or|conj|أو
organize|v|ينظّم
other|adj|آخر
out|adv|خارج
output|n|ناتج / مُخرَج
own|adj|خاص / يملك
paragraph|n|فقرة
part|n|جزء
partner|n|شريك
paste|v|يلصق
patient|adj|صبور
pattern|n|نمط
pdf|n|ملف PDF
people|n|أشخاص / ناس
per|prep|لكل
perfect|adj|مثالي / كامل
personal|adj|شخصي
photosynthesis|n|البناء الضوئي
phrase|n|عبارة
plan|n|خطة
planning|n|تخطيط
play|v|يلعب / يؤدي دورًا
please|adv|من فضلك
poem|n|قصيدة
point|n|نقطة
polite|adj|مهذّب
positive|adj|إيجابي
power|n|قوة
powerful|adj|قوي
practical|adj|عملي
practice|n|تدريب / ممارسة
precise|adj|دقيق / محدد
presentation|n|عرض تقديمي
pretend|v|يتظاهر
price|n|سعر
probably|adv|على الأرجح
problem|n|مشكلة
process|v|يعالج
product|n|منتج
project|n|مشروع
prompt|n|طلب / أمر موجّه للذكاء الاصطناعي
prompting|n|كتابة الطلبات للذكاء الاصطناعي
pro|n|إيجابية / ميزة
purpose|n|غرض / هدف
put|v|يضع
quality|n|جودة
question|n|سؤال
quick|adj|سريع
quickly|adv|بسرعة
quiz|n|اختبار قصير
quote|v|يقتبس
read|v|يقرأ
reader|n|قارئ
reading|n|قراءة
real|adj|حقيقي
reason|n|سبب
reasoning|n|استدلال / طريقة التفكير
receptionist|n|موظف استقبال
recommendation|n|توصية
recruiter|n|مسؤول التوظيف
refer|v|يشير إلى
refine|v|يصقل / يحسّن
rehearse|v|يتدرّب / يُجري بروفة
relaxed|adj|مسترخٍ / هادئ
relevant|adj|ذو صلة
remove|v|يزيل
repeat|v|يكرّر
request|n|طلب
result|n|نتيجة
review|v|يراجع
rewrite|v|يعيد الكتابة
right|adj|صحيح / يمين
robotic|adj|آلي
role|n|دور
rule|n|قاعدة
sale|n|مبيعات / بيع
same|adj|نفس / ذاته
save|v|يحفظ
say|v|يقول
science|n|علوم
second|adj|الثاني / ثانية
see|v|يرى
sense|n|معنى / حِس
sentence|n|جملة
separate|v|يفصل
serious|adj|جاد
session|n|جلسة
set|v|يحدّد / يضبط
she|pron|هي
short|adj|قصير
shot|n|محاولة / لقطة
should|v|ينبغي
show|v|يُظهر / يعرض
similar|adj|متشابه
simple|adj|بسيط
simply|adv|ببساطة
situation|n|موقف / وضع
skill|n|مهارة
small|adj|صغير
smart|adj|ذكي
so|conj|لذلك / جدًا
solution|n|حل
solve|v|يحل
some|det|بعض
something|pron|شيء ما
sometimes|adv|أحيانًا
son|n|ابن
sound|v|يبدو / صوت
speak|v|يتكلّم
speaking|n|التحدث
special|adj|خاص / مميّز
specific|adj|محدد
spreadsheet|n|جدول بيانات
start|v|يبدأ
startup|n|شركة ناشئة
stay|v|يبقى
step|n|خطوة
strict|adj|صارم
structure|n|بنية / هيكل
student|n|طالب
style|n|أسلوب
success|n|نجاح
suggest|v|يقترح
summarize|v|يلخّص
summary|n|ملخّص
table|n|جدول / طاولة
tag|n|وسم
talk|v|يتحدث
task|n|مهمة
teach|v|يعلّم
teacher|n|معلم
technical|adj|تقني
technique|n|تقنية / أسلوب
tell|v|يخبر
ten|n|عشرة
test|n|اختبار
text|n|نص
than|conj|من (للمقارنة)
thanks|int|شكرًا
that|pron|ذلك / أن
the|det|أداة التعريف (الـ)
them|pron|هم / ـهم
then|adv|ثم
there|adv|هناك
these|pron|هؤلاء / هذه
they|pron|هم
think|v|يفكّر
thinking|n|تفكير
this|pron|هذا / هذه
three|n|ثلاثة
time|n|وقت / مرة
to|prep|إلى / لـ
today|adv|اليوم
tomorrow|adv|غدًا
tone|n|نبرة / أسلوب
too|adv|أيضًا / جدًا
tool|n|أداة
top|n|أعلى / قمة
topic|n|موضوع
travel|n|سفر
try|v|يحاول / يجرّب
turn|v|يحوّل / يدير
tutor|n|معلم خصوصي
two|n|اثنان
unclear|adj|غير واضح
under|prep|تحت / أقل من
understand|v|يفهم
until|conj|حتى
up|adv|أعلى / فوق
upload|v|يرفع (ملفًا)
use|v|يستخدم
useful|adj|مفيد
vague|adj|غامض / مبهم
varied|adj|متنوع
verify|v|يتحقق
version|n|نسخة / إصدار
very|adv|جدًا
video|n|فيديو
visit|v|يزور
vocabulary|n|مفردات
want|v|يريد
warm|adj|دافئ
was|v|كان
watch|v|يشاهد
way|n|طريقة
we|pron|نحن
web|n|الويب
website|n|موقع إلكتروني
week|n|أسبوع
weight|n|وزن
well|adv|جيدًا
what|pron|ماذا / ما
when|adv|عندما / متى
where|adv|أين / حيث
whether|conj|ما إذا
which|pron|أي / الذي
who|pron|من / الذي
why|adv|لماذا
will|v|سوف
winter|n|شتاء
with|prep|مع
word|n|كلمة
wording|n|صياغة
work|v|يعمل
would|v|سوف (شرطية)
write|v|يكتب
writing|n|كتابة
wrong|adj|خاطئ
xml|n|لغة XML للترميز
year|n|سنة
you|pron|أنت / أنتم
your|pron|ـك (ملكية)
learn|v|يتعلّم
dog|n|كلب
explain|v|يشرح
language|n|لغة
hello|int|مرحبًا
thank|v|يشكر
yes|int|نعم
sorry|adj|آسف
help|v|يساعد
understandable|adj|مفهوم
curious|adj|فضولي
achieve|v|يحقق
challenge|n|تحدٍّ
opportunity|n|فرصة
knowledgeable|adj|واسع المعرفة
accomplish|v|ينجز
improvement|n|تحسين
pronunciation|n|نطق
pronounce|v|ينطق
translate|v|يترجم
translation|n|ترجمة
meaningful|adj|ذو معنى
effective|adj|فعّال
efficient|adj|كفء / فعّال
generate|v|يولّد / ينتج
response|n|رد / استجابة
assistance|n|مساعدة
chatbot|n|روبوت محادثة
model|n|نموذج
intelligence|n|ذكاء
artificial|adj|اصطناعي
honestly|adv|بصراحة
limitation|n|قيد / حدود
mastery|n|إتقان
master|v|يتقن
daily|adj|يومي
habit|n|عادة
progress|n|تقدّم
goal|n|هدف
beautiful|adj|جميل
simple|adj|بسيط
powerful|adj|قوي
together|adv|معًا
everything|pron|كل شيء
anywhere|adv|في أي مكان
instant|adj|فوري
instantly|adv|فورًا
tap|v|ينقر (باللمس)
hover|v|يمرّر المؤشر
select|v|يحدد / يختار
selection|n|تحديد / اختيار
bookmark|n|إشارة مرجعية
review|n|مراجعة
card|n|بطاقة
flip|v|يقلب
remember|v|يتذكّر
forget|v|ينسى
course|n|دورة / مساق
chapter|n|فصل
begin|v|يبدأ
journey|n|رحلة
explore|v|يستكشف
discover|v|يكتشف
craft|v|يصوغ بإتقان
better|adj|أفضل
fluency|n|طلاقة
confidence|n|ثقة
think|v|يفكّر
lab|n|مختبر
builder|n|أداة بناء / باني
score|n|نتيجة / درجة
level|n|مستوى
advanced|adj|متقدّم
minute|n|دقيقة
complete|v|يكمل / مكتمل
completed|adj|مكتمل
free|adj|مجاني / حر
bank|n|بنك / مصرف
bullet|n|نقطة تعداد / رصاصة
capital|adj|كبير (حرف) / عاصمة
explanation|n|شرح / تفسير
greeting|n|تحية
hurry|v|يستعجل
ignore|v|يتجاهل
letter|n|حرف / رسالة
london|n|لندن
middle|n|وسط / منتصف
never|adv|أبدًا
react|n|React (مكتبة لبناء الواجهات) / يتفاعل
send|v|يرسل
share|v|يشارك
without|prep|بدون
typeerror|n|خطأ في النوع (برمجة)
b|n|الحرف B
doesn't|v|لا (يفعل)
don't|v|لا (تفعل)
didn't|v|لم (يفعل)
isn't|v|ليس
aren't|v|ليسوا
can't|v|لا يستطيع
won't|v|لن
it's|phr|إنه / إنها
let's|phr|هيا بنا / دعنا
i'm|phr|أنا
you're|phr|أنت
i'll|phr|سوف (أنا)
of course|phr|بالطبع
course|n|دورة / مساق
claude|n|Claude (مساعد ذكاء اصطناعي من Anthropic)
anthropic|n|Anthropic (الشركة المطوّرة لـ Claude)
mac|n|حاسوب Mac من Apple
iphone|n|هاتف iPhone
android|n|نظام Android
plus|n|زائد / علامة +
toolbox|n|صندوق أدوات
delegation|n|تفويض
plain|adj|بسيط / عادي
tense|n|زمن (في القواعد)
verb|n|فعل
noun|n|اسم
adjective|n|صفة
adverb|n|ظرف
such|det|مثل / كهذا
wrap|v|يغلّف / يحيط
employment|n|توظيف / عمل
self|n|الذات
ad|n|إعلان
txt|n|ملف نصي (txt)
shuffle|v|يخلط (الترتيب)
trick|n|حيلة
expense|n|مصروف
timetable|n|جدول مواعيد
cutoff|n|حدّ / تاريخ توقف
base|v|يبني على
angle|n|زاوية
uk|n|المملكة المتحدة
morocco|n|المغرب
mcp|n|بروتوكول سياق النموذج (MCP)
google|n|Google (شركة)
slack|n|Slack (تطبيق مراسلة للعمل)
thread|n|سلسلة رسائل / خيط
universal|adj|عالمي / شامل
plug|n|قابس
alpha|n|ألفا (نسخة أولى)
even|adv|حتى
md|n|ملف Markdown (md)
excel|n|برنامج Excel
powerpoint|n|برنامج PowerPoint
word|n|كلمة
progressive|adj|تدريجي
disclosure|n|إفصاح / كشف
index|n|فهرس
html|n|لغة HTML لصفحات الويب
jpg|n|صورة بصيغة JPG
teammate|n|زميل في الفريق
ide|n|بيئة تطوير متكاملة (محرر أكواد)
forth|adv|إلى الأمام (back and forth = ذهابًا وإيابًا)
navbar|n|شريط التنقل
rehearsal|n|بروفة / تدريب
loud|adj|عالٍ (صوت)
quarterly|adj|ربع سنوي
photography|n|التصوير الفوتوغرافي
photographic|adj|فوتوغرافي
syllable|n|مقطع لفظي
bark|v|ينبح
fairy|n|جنية
fool|n|أحمق
minimal|adj|أدنى / متقارب
differ|v|يختلف
icon|n|أيقونة
microphone|n|ميكروفون
tongue|n|لسان
twister|n|عبارة صعبة النطق (tongue twister)
enemy|n|عدو
pls|adv|من فضلك (اختصار please)
reload|v|يعيد التحميل
unauthorized|adj|غير مصرّح به
emoji|n|رمز تعبيري
commit|n|حفظ تغييرات في Git (commit)
stuff|n|أشياء (عامية)
skip|v|يتخطّى / يتجاوز
newton|n|نيوتن (عالم فيزياء)
stuck|adj|عالق / متوقف
weekday|n|يوم من أيام الأسبوع (غير العطلة)
genetics|n|علم الوراثة
anonymous|adj|مجهول الهوية
side|n|جانب
africa|n|أفريقيا
clarity|n|وضوح
`


export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
export const LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']
export const LEVEL_INFO: Record<CefrLevel, { en: string; ar: string }> = {
  A1: { en: 'Beginner', ar: 'مبتدئ' },
  A2: { en: 'Elementary', ar: 'أساسي' },
  B1: { en: 'Intermediate', ar: 'متوسط' },
  B2: { en: 'Upper-intermediate', ar: 'فوق المتوسط' },
  C1: { en: 'Advanced', ar: 'متقدم' },
}

export type DictEntry = { word: string; pos: string; ar: string; level?: CefrLevel }

const POS_LABEL: Record<string, string> = {
  n: 'noun',
  v: 'verb',
  adj: 'adjective',
  adv: 'adverb',
  prep: 'preposition',
  conj: 'conjunction',
  pron: 'pronoun',
  det: 'determiner',
  int: 'interjection',
  phr: 'phrase',
}

export const POS_AR: Record<string, string> = {
  noun: 'اسم',
  verb: 'فعل',
  adjective: 'صفة',
  adverb: 'ظرف',
  preposition: 'حرف جر',
  conjunction: 'أداة ربط',
  pronoun: 'ضمير',
  determiner: 'محدِّد',
  interjection: 'تعجّب',
  phrase: 'عبارة',
}

export const dictionary: Map<string, DictEntry> = new Map()

function load(raw: string, level?: CefrLevel) {
  for (const line of raw.split('\n')) {
    const [word, pos, ar] = line.split('|')
    if (!word || !ar) continue
    const existing = dictionary.get(word)
    if (existing) {
      // curated entries keep their meaning; the word bank only adds the level
      if (level && !existing.level) existing.level = level
      continue
    }
    dictionary.set(word, { word, pos: POS_LABEL[pos] ?? pos, ar, level })
  }
}

load(RAW)

/**
 * Browsable word bank (every entry with a CEFR level, level then alphabetical order).
 * The ~3,000 extra words load in a separate chunk right after the first paint — see loadWordBank().
 */
export const wordBank: DictEntry[] = []
let loaded = false
let loading: Promise<void> | null = null
const listeners = new Set<() => void>()

export function loadWordBank(): Promise<void> {
  loading ??= Promise.all([
    import('./wordbank/a1'),
    import('./wordbank/a2'),
    import('./wordbank/b1'),
    import('./wordbank/b2'),
    import('./wordbank/c1'),
  ]).then((mods) => {
    mods.forEach((m, i) => load(m.default, LEVELS[i]))
    wordBank.push(
      ...[...dictionary.values()]
        .filter((e) => e.level && !e.word.includes(' '))
        .sort((a, b) => LEVELS.indexOf(a.level!) - LEVELS.indexOf(b.level!) || a.word.localeCompare(b.word)),
    )
    loaded = true
    listeners.forEach((l) => l())
  })
  return loading
}

export const isWordBankLoaded = () => loaded
export function subscribeWordBank(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** Irregular forms → base form */
export const IRREGULAR: Record<string, string> = {
  am: 'be', are: 'be', were: 'be', been: 'be', being: 'be',
  has: 'have', had: 'have', does: 'do', did: 'do', done: 'do', doesn: 'do', don: 'do',
  goes: 'go', went: 'go', gone: 'go', made: 'make', found: 'find', gave: 'give', given: 'give',
  got: 'get', knew: 'know', known: 'know', lost: 'lose', led: 'lead', thought: 'think',
  wrote: 'write', written: 'write', said: 'say', saw: 'see', seen: 'see', told: 'tell',
  took: 'take', taken: 'take', built: 'build', bought: 'buy', kept: 'keep', meant: 'mean',
  spoke: 'speak', spoken: 'speak', taught: 'teach', understood: 'understand', began: 'begin',
  children: 'kid', men: 'man', women: 'woman', easier: 'easy', easiest: 'easy',
  smarter: 'smart', faster: 'fast', fastest: 'fast', shorter: 'short', clearer: 'clear',
  larger: 'large', better: 'better', best: 'best', ups: 'up', nword: 'word', nnow: 'now', nrewrite: 'rewrite',
  felt: 'feel', paid: 'pay', ran: 'run', sent: 'send', spent: 'spend', left: 'leave', met: 'meet',
  heard: 'hear', held: 'hold', brought: 'bring', caught: 'catch', chose: 'choose', chosen: 'choose', drove: 'drive',
  ate: 'eat', fell: 'fall', flew: 'fly', forgot: 'forget', grew: 'grow', hid: 'hide', rode: 'ride', rose: 'rise',
  sang: 'sing', sat: 'sit', slept: 'sleep', stood: 'stand', stole: 'steal', swam: 'swim', threw: 'throw', woke: 'wake',
  wore: 'wear', won: 'win', bigger: 'big', biggest: 'big', worse: 'worse', people: 'people', data: 'data',
  s: 'is', t: 'not', n: 'and',
}

/** Very common function words: clickable, but not underlined, to keep text calm. */
export const STOPWORDS = new Set(
  'a an the and or but if of to in on at by for from with as is are am was were be been it its this that these those i you he she we they me my your our their them his her him us so not no do does did can will would should could may might must than then there here what which who whom when where why how all any each some also just very too into up out about'.split(
    ' ',
  ),
)
