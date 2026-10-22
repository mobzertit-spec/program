# برومبتات الرسم

برومبتات تلصقها في ChatGPT أو Higgsfield عشان تولّد صور اللعبة. البرومبتات بالإنجليزي لأن نتايجها أدق، والشرح بالعربي.

**الشكل الجديد [متفق عليه]:** شاب صغير الحجم وراسه كبير شوي، وجهه بسيط، وشعره مميّز (غرّة جانبية طويلة وذيل صغير ورا) لونه بني مائل للأصفر. لابس تيشرت أزرق فاتح خفيف، وسروال بيج، وحذاء قماش، وما معه سلاح. الستايل مرسوم باليد: خطوط حبر وألوان مسطّحة ناعمة.

ما نكتب أسماء ألعاب ولا شخصيات في البرومبت (مثل لينك أو هورنت). نوصف الشكل بالكلام، عشان الرسمة تطلع خاصة فينا.

## كيف تستخدمها

1. **ورقة الشخصية أول (رقم 1).** ولّدها لين يطلع شكل يعجبك، وأرسلها لي. أشيّك على الحجم والخلفية قبل ما تكمل.
2. **بعدها الحركات (رقم 2).** لكل حركة:
   - افتح محادثة جديدة.
   - ارفع صورة ورقة الشخصية اللي اخترتها.
   - الصق برومبت الحركة كامل.
3. لو سألك عن الحجم، اختر **الأفقي** (Landscape).
4. لو إطار واحد خرب (يد زايدة، شعر مختلف، الشخصية مقصوصة)، اطلب صورة ثانية أو استخدم جمل التعديل اللي تحت.
5. أرسل لي كل الصور مع اسم الحركة.

## 1. ورقة الشخصية

الشاب ثلاث مرات: من قدام، ومن الجنب، ومن ورا. هذي المرجع اللي ترفعه مع كل برومبت حركة، فلازم تكون الأوضح.

```
Character reference sheet for a 2D hand-drawn metroidvania game.

The character: a young man of about 17, small and compact with a slightly large head (about 3.5 heads tall), lean, curious and calm. Not a child.
- Simple face: clear eyes, small nose, simple mouth. Few details so it reads at small size.
- Distinctive hair: medium-length layered hair with long side-swept bangs framing the face, a few strands over the ears, and a small short ponytail at the back. Colour: light brown leaning towards dark blond.
- Clothes from a coastal fishing village: a light blue short-sleeved t-shirt, thin and slightly worn; simple beige trousers; light cloth shoes tied with string.
- No weapon, no bag, no armor.

Show the same character three times, full body, relaxed neutral standing pose, evenly spaced: front view, side view facing right, back view.

Style: hand-drawn 2D game art, clean dark ink outlines with slightly varied line weight, soft flat colours, minimal shading, calm and slightly melancholic mood.
Background: plain flat light grey. No scenery, no text, no labels.
Keep the proportions, colours and details exactly the same in all three views.
```

**وش يقول البرومبت:** شاب عمره تقريباً 17، صغير وراسه كبير شوي (طوله ثلاث رؤوس ونص)، ومو طفل. بعدها الوجه البسيط، والشعر، والملابس، وإنه بدون سلاح ولا شنطة. وفي الأخير الثلاث زوايا، والستايل، وخلفية رمادية فاضية بدون كتابة.

## 2. الحركات

ست صور، كل صورة لحركة وحدة. كل إطارات الحركة في **صف واحد**، والشاب **مطالع يمين**، ورجوله على **نفس الخط** في كل إطار. الخلفية **فوشيا** (#FF00FF) لأنه لون ما يجي في الرسمة، فأقدر أشيلها بدقة.

| الحركة | الإطارات | متى تطلع في اللعبة |
|---|---|---|
| الوقوف | 6 | لما يكون واقف |
| الجري | 8 | لما يجري يمين أو يسار |
| القفز | 5 | من أول ما يقفز لين قبل ما يلمس الأرض |
| النزول | 3 | لحظة ما يلمس الأرض بعد القفز |
| الاندفاع | 3 | الانطلاقة السريعة |
| الجدار | 2 | لما ينزلق على جدار |

ارفع ورقة الشخصية مع كل واحد منها.

### الوقوف (6 إطارات)

```
Using the attached character sheet as the exact reference, draw a sprite sheet of the same character for a 2D game animation: an idle loop. He stands relaxed and breathes gently; his chest rises and falls slightly, and his hair and t-shirt move a little.
- 6 frames in one horizontal row, evenly spaced, every frame the same size.
- Side view facing right, full body in every frame, nothing cropped.
- The animation plays in place: the character does not move across the sheet, and the feet sit on the same invisible ground line in every frame.
- Same proportions, colours, hair and clothes as the reference in every frame.
- Hand-drawn 2D game art, clean dark ink outlines, soft flat colours, minimal shading.
- Solid flat pure magenta (#FF00FF) background, no gradient. No shadow, no text, no numbers, no labels.
```

### الجري (8 إطارات)

```
Using the attached character sheet as the exact reference, draw a sprite sheet of the same character for a 2D game animation: a run cycle. A full, natural, light running loop: the arms swing opposite to the legs, the body leans slightly forward, and the hair bounces with each step. The last frame leads smoothly back into the first.
- 8 frames in one horizontal row, evenly spaced, every frame the same size.
- Side view facing right, full body in every frame, nothing cropped.
- The animation plays in place: the character does not move across the sheet, and the feet sit on the same invisible ground line in every frame.
- Same proportions, colours, hair and clothes as the reference in every frame.
- Hand-drawn 2D game art, clean dark ink outlines, soft flat colours, minimal shading.
- Solid flat pure magenta (#FF00FF) background, no gradient. No shadow, no text, no numbers, no labels.
```

### القفز (5 إطارات)

```
Using the attached character sheet as the exact reference, draw a sprite sheet of the same character for a 2D game animation: a jump, in this order: 1. pushing off the ground, 2. rising with knees pulled up and arms raised, 3. the top of the jump, body almost weightless, 4. falling with hair and t-shirt blown upward, 5. legs reaching down, about to land.
- 5 frames in one horizontal row, evenly spaced, every frame the same size.
- Side view facing right, full body in every frame, nothing cropped.
- The character stays in the same spot in every frame; do not draw him higher or lower across the sheet.
- Same proportions, colours, hair and clothes as the reference in every frame.
- Hand-drawn 2D game art, clean dark ink outlines, soft flat colours, minimal shading.
- Solid flat pure magenta (#FF00FF) background, no gradient. No shadow, no text, no numbers, no labels.
```

### النزول (3 إطارات)

```
Using the attached character sheet as the exact reference, draw a sprite sheet of the same character for a 2D game animation: landing after a jump, in this order: 1. feet touching the ground, knees bending, 2. a low crouch absorbing the impact, arms forward for balance, 3. standing back up.
- 3 frames in one horizontal row, evenly spaced, every frame the same size.
- Side view facing right, full body in every frame, nothing cropped.
- The animation plays in place: the character does not move across the sheet, and the feet sit on the same invisible ground line in every frame.
- Same proportions, colours, hair and clothes as the reference in every frame.
- Hand-drawn 2D game art, clean dark ink outlines, soft flat colours, minimal shading.
- Solid flat pure magenta (#FF00FF) background, no gradient. No shadow, no text, no numbers, no labels.
```

### الاندفاع (3 إطارات)

```
Using the attached character sheet as the exact reference, draw a sprite sheet of the same character for a 2D game animation: a quick forward dash, in this order: 1. bracing, body low and coiled, 2. bursting forward, body stretched and leaning far forward, arms back, hair and t-shirt blown back, 3. the same burst a moment later. His feet are off the ground in frames 2 and 3.
- 3 frames in one horizontal row, evenly spaced, every frame the same size.
- Side view facing right, full body in every frame, nothing cropped.
- The character stays in the same spot in every frame; do not move him across the sheet.
- Same proportions, colours, hair and clothes as the reference in every frame.
- Hand-drawn 2D game art, clean dark ink outlines, soft flat colours, minimal shading.
- Solid flat pure magenta (#FF00FF) background, no gradient. No speed lines, no shadow, no text, no numbers, no labels.
```

### الجدار (إطارين)

```
Using the attached character sheet as the exact reference, draw a sprite sheet of the same character for a 2D game animation: sliding down a wall. The wall is on the LEFT side, behind his back, but do not draw the wall. He faces right, away from the wall; his back, his left hand and one foot press against the invisible wall to slow the slide, and his hair is pushed upward. The two frames differ slightly, so the slide looks alive.
- 2 frames in one horizontal row, evenly spaced, every frame the same size.
- Side view facing right, full body in every frame, nothing cropped.
- Same proportions, colours, hair and clothes as the reference in every frame.
- Hand-drawn 2D game art, clean dark ink outlines, soft flat colours, minimal shading.
- Solid flat pure magenta (#FF00FF) background, no gradient. No wall, no shadow, no text, no numbers, no labels.
```

## 3. جمل للتعديل

اكتبها في نفس المحادثة بعد ما تطلع الصورة:

| تبي | اكتب |
|---|---|
| تغيّر شي واحد بس | `Keep everything exactly the same. Only change: ...` |
| الشاب طلع طويل | `Make the character smaller and more compact, about 3 heads tall, with a slightly larger head. Keep everything else the same.` |
| الشاب طلع طفل أو كرتوني مرة | `Make the character a little older and less cartoonish, about 4 heads tall. Keep everything else the same.` |
| الشعر مو مميّز | `Make the hair more distinctive: long side-swept bangs framing the face and a small short ponytail at the back. Keep everything else the same.` |
| طلع كلام أو أرقام في الصورة | `Remove all text, numbers and labels.` |
| الزوايا أو الإطارات مو نفس الشخصية | `Make every view the same character with identical proportions, hair and colours.` |
| الألوان مظلّلة مرة | `Use flatter colours and clean ink outlines, almost no shading.` |
| الخلفية مو فوشيا ثابت | `Make the background one solid flat colour: pure magenta #FF00FF, no gradient, no shadow.` |
| الإطارات لازقة في بعض أو الشخصية مقصوصة | `Leave clear empty space between the frames and around the character, so no frame touches another.` |
| رجوله مو على نفس الخط | `Place the feet on the same ground line in every frame.` |

**لو الشاب طلع صغير مرة في ورقة الجري:** اطلبها صورتين، كل وحدة 4 إطارات: الأولى `the first half of the run cycle (frames 1 to 4)`، والثانية `the second half of the run cycle (frames 5 to 8)`.

**علامة الموقع:** لو الموقع يحط علامته على الصورة، تأكد إنها بعيدة عن الشاب. أنا أشيلها.

## 4. ورقة السيف المكسور

الشاب ما معه سلاح في البداية، ويلقى هالسيف بعد ما يطلع من القرية. الورقة جاهزة (شوف تحت)، فما تحتاج تولّدها مرة ثانية إلا لو تبي شكل جديد.

```
Item reference sheet for a 2D hand-drawn dark fantasy platformer game.

An old broken sword: a plain one-handed straight blade of scratched, corroded grey iron with small rust spots. The top third of the blade is snapped off, leaving a jagged broken edge. A simple dark iron cross guard, a grip wrapped in faded, frayed cloth, and a small round pommel. No decorations, no gems, no glow.

Show it twice: the full sword lying horizontally with the blade pointing right, and a close-up of the broken edge of the blade.

Style: hand-drawn 2D game art, clean black ink outlines with slightly varied line weight, flat muted colors, very minimal shading, dark and melancholic mood.
Background: plain flat light grey. No text, no labels.
```

## 5. وش صار بالرسمات

- **السيف:** قصّيت طرفه فصار مكسور، وشلت علامة الموقع. الورقة في `game/art/concept/sword_sheet.png`، والسيف لحاله بخلفية شفافة في `game/project/art/items/sword_broken.png`.
- **الرحّال القديم (بالغطاء والعباءة):** انشال من التصميم. ورقته في `game/art/concept/old/wanderer_sheet.png`، ويضل في غرفة التجربة لين توصل رسمات الشاب الجديد.

## 6. بعد ما ترسل الصور

1. أشيل الخلفية الفوشيا، وأقص كل إطار لحاله.
2. أحط رجوله على نفس الخط في كل الإطارات، وأخليها كلها بنفس الحجم.
3. أركّبها في اللعبة: كل حركة تطلع في وقتها (وقوف، جري، قفز، نزول، اندفاع، جدار).
4. أكبّر الشاب أو أصغّره لين يصير حجمه تقريباً سُبع طول الشاشة.
5. أرسل لك مقطع وهو يتحرك، وملف اللعبة الجديد.
