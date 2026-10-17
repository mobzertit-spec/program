# برومبتات الرسم في ChatGPT

برومبتات تلصقها في ChatGPT عشان يولّد صور اللعبة. البرومبتات بالإنجليزي لأن نتايجها أدق، والشرح بالعربي.

**الشكل المتفق عليه:** رحّال صغير شوي ونحيف، غطاء رأس يخفي وجهه وما يبان إلا عيون بيضاء باهتة تلمع، عباءة طويلة أزرق رمادي باهت أطرافها ممزّقة، دفتر وخريطة على الحزام، وسيف قديم مكسور على ظهره. الستايل خطوط حبر سوداء وألوان مسطّحة.

## كيف تستخدمها

1. افتح ChatGPT وابدأ محادثة جديدة.
2. انسخ البرومبت كامل (من المربع الرمادي) والصقه.
3. لو سألك عن الحجم، اختر **الأفقي** (Landscape).
4. لو ما عجبتك الصورة، اطلب صورة ثانية، أو عدّلها بجمل التعديل اللي تحت.
5. نزّل أفضل صورة وأرسلها لي.

ابدأ بورقة الشخصية، وبعدها السيف.

## 1. ورقة الشخصية

الرحّال ثلاث مرات: من قدام، ومن الجنب، ومن ورا. نثبّت فيها شكله قبل ما نسوي صور اللعبة.

```
Character reference sheet for a 2D hand-drawn dark fantasy platformer game.

The character: a lone wandering traveler who is small and slender: slightly short and compact, not tall, about 4.5 heads tall, so they look small in a big world. Not chibi, not a child.
- A deep, slightly oversized hood that hides the whole face in shadow. Only two small, pale white glowing eyes are visible inside the hood.
- A long, muted blue-grey travel cloak (color close to #6f8fa3) that falls below the knees, with torn, tattered edges worn out by years of travel.
- Under the cloak: simple dark travel clothes, cloth-wrapped forearms, worn soft boots.
- A leather belt with a small worn journal and a rolled-up map tied to it.
- An old broken sword strapped diagonally across the back: a plain, scratched, corroded iron blade with the tip snapped off, and a grip wrapped in faded cloth.

Show the same character three times, full body, in a calm neutral standing pose, evenly spaced: front view, side view facing right, back view.

Style: hand-drawn 2D game art, clean black ink outlines with slightly varied line weight, flat muted colors, very minimal shading, dark and melancholic but calm mood.
Background: plain flat light grey. No scenery, no text, no labels.
Keep the proportions, colors and details exactly the same in all three views.
```

**وش يقول البرومبت:** رحّال صغير شوي ونحيف، طوله تقريباً أربع رؤوس ونص (مو طويل، ومو كرتوني صغير مرة)، وبعدها تفاصيل الغطاء والعيون والعباءة والحزام والسيف. وفي الأخير يطلب الثلاث زوايا، والستايل، وخلفية رمادية فاضية بدون كتابة.

## 2. ورقة السيف

السيف القديم المكسور لحاله: مرة كامل، ومرة مقرّب على مكان الكسر.

```
Item reference sheet for a 2D hand-drawn dark fantasy platformer game.

An old broken sword: a plain one-handed straight blade of scratched, corroded grey iron with small rust spots. The top third of the blade is snapped off, leaving a jagged broken edge. A simple dark iron cross guard, a grip wrapped in faded, frayed cloth, and a small round pommel. No decorations, no gems, no glow.

Show it twice: the full sword lying horizontally with the blade pointing right, and a close-up of the broken edge of the blade.

Style: hand-drawn 2D game art, clean black ink outlines with slightly varied line weight, flat muted colors, very minimal shading, dark and melancholic mood.
Background: plain flat light grey. No text, no labels.
```

**عشان السيف يطابق اللي على ظهر الرحّال:** ارفع صورة ورقة الشخصية مع البرومبت، وأضف هالسطر في آخره:

```
Match the sword strapped on the back of the character in the attached image.
```

## 3. جمل للتعديل

اكتبها في نفس المحادثة بعد ما تطلع الصورة:

| تبي | اكتب |
|---|---|
| تغيّر شي واحد بس | `Keep everything exactly the same. Only change: ...` |
| الرحّال طلع طويل | `Make the character smaller and more compact, about 4 heads tall. Keep everything else the same.` |
| الرحّال طلع صغير مرة أو كرتوني | `Make the character slightly taller and less cartoonish, about 5 heads tall. Keep everything else the same.` |
| طلع كلام أو أسماء في الصورة | `Remove all text and labels.` |
| الزوايا مو نفس الشخصية | `Make all three views the same character with identical proportions and colors.` |
| الألوان ناعمة ومظلّلة | `Use flatter colors and clean black ink outlines, almost no shading.` |
| العيون قوية مرة | `Make the glowing eyes smaller and dimmer.` |

## 4. وش صار بالرسمات

- **السيف:** قصّيت طرفه، فصار مكسور ونهايته متكسّرة، وشلت علامة الموقع. النسخة في `game/art/concept/sword_sheet.png`، والسيف لحاله بخلفية شفافة في `game/project/art/items/sword_broken.png`.
- **ورقة الشخصية:** السيف اللي على ظهره صار قصير ومكسور في كل الزوايا، وشلت علامة الموقع. النسخة في `game/art/concept/wanderer_sheet.png`.
- **في اللعبة:** قصّيت الرحّال من الرسمة الجانبية، وقسّمته أجزاء، وصار يتحرك بالكود (شوف `game/README.md`).

## 5. المرحلة الجاية

لو نبي حركة مرسومة إطار إطار بدل حركة الكود، نولّد رسمات للرحّال وهو يجري ويقفز، بنفس الستايل وبخلفية شفافة، ونرفع معها ورقة الشخصية كمرجع.
