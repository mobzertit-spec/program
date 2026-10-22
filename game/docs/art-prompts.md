# رسم الرحّال وحركاته

نولّد الرسمات في **Higgsfield**. البرومبتات بالإنجليزي لأن نتايجها أدق، والشرح بالعربي.

**الشكل المعتمد [متفق عليه]:** ورقة الشخصية في `game/art/concept/hero_sheet.png`.
- ولد صغير راسه كبير.
- شعره بني مائل للأصفر.
- تيشرت أزرق فاتح، وسروال بيج، وحذاء قماش.
- ما معه سلاح.
- مرسوم باليد: خطوط حبر وألوان مسطّحة ناعمة.

## الصورة الجانبية (ارفعها مع كل حركة)

[`game/art/hero/reference_side.png`](https://github.com/mobzertit-spec/program/raw/claude/jolly-fermat-x99np1/game/art/hero/reference_side.png): الولد من الجنب بس، مطالع يمين، على خلفية فاضية. قصّيتها من ورقة الشخصية.

**ليش ما نرفع الورقة كاملة:** في المحاولة الأولى رفعنا الورقة كاملة، فرسم الموقع الولد من قدام ومن ورا وسط الحركات. الصورة الجانبية تمنع هالشي.

## 1. الطريقة الأفضل: AutoSprite

في Higgsfield أداة اسمها **AutoSprite Animation**. ترفع لها صورة وحدة للشخصية، وتطلّع لك ورقة إطارات لحركة كاملة. تسوي الحركة من فيديو، فالإطارات **متناسقة مع بعض**، أحسن بكثير من برومبت صور يرسم صف وضعيات.

**كل مرة:**
1. افتح **AutoSprite Animation** في Higgsfield.
2. ارفع `reference_side.png`.
3. اختر الحركة من الجدول تحت.
4. خلّ **حجم الإطار** (Frame size) على **512**، وشغّل **إزالة الخلفية** (Remove background).
5. خلّ عدد الإطارات على الافتراضي.
6. نزّل الصورة وأرسلها لي مع اسم الحركة.

لو الخيارات عندك مختلفة شوي، اختر الأقرب لها.

**رصيدك محدود** (الحساب المجاني فيه تقريباً 46 رصيد)، فسوّها بهالترتيب. لو خلص الرصيد، أرسل اللي سويته وأنا أكمل بالإطارات المؤقتة:

| # | الحركة | اختر | الوصف (لو اخترت Custom) |
|---|---|---|---|
| 1 | الجري | **Run** | |
| 2 | الوقوف | **Idle** | |
| 3 | القفز | **Jump** | |
| 4 | المشي | **Walk** | |
| 5 | الاندفاع | **Custom**، والاسم `dash` | الوصف 5 تحت |
| 6 | النزول | **Custom**، والاسم `land` | الوصف 6 تحت |
| 7 | الجدار | **Custom**، والاسم `wall_slide` | الوصف 7 تحت |
| 8 | الفرملة (اختياري) | **Custom**، والاسم `skid` | الوصف 8 تحت |

**5. الاندفاع:**
```
A quick forward dash: he crouches for an instant, then bursts forward with his body leaning far forward, arms swept back and hair blown back, feet off the ground, then catches himself.
```

**6. النزول:**
```
Landing after a jump: he drops onto the ground, his knees bend into a low crouch to absorb the impact, arms forward for balance, then he stands back up.
```

**7. الجدار:**
```
Sliding down a wall that is behind his back, on the left side. He faces right, away from the wall; his back, his left hand and one foot press against the wall to slow down, and his hair is pushed upward. Do not show the wall.
```

**8. الفرملة:**
```
Running fast, then braking hard to a sudden stop: he leans back, plants his front foot and slides a little, arms out for balance, then stands still.
```

## 2. الطريقة الاحتياطية: برومبت صور لكل حركة

لو AutoSprite ما اشتغلت أو خلص رصيدها:
- استخدم موديل صور يقبل صورة مرجع، مثل **Nano Banana Pro** أو **Seedream**.
- ارفع `reference_side.png`، واختر الحجم الأفقي **16:9**.
- **حركة وحدة في كل صورة**، لأن الحركات كلها في صورة وحدة طلعت غلط.
- البرومبت فيه تحذيرات من أغلاط المحاولة الأولى: خط أرض، وجدار، ورسمات من قدام وورا، وخطوط حركة.

انسخ القالب، وبدّل `[MOVE]` بوصف الحركة، و `[N]` بعدد الإطارات من الجدول اللي تحت:

```
Using the attached image as the exact character reference, draw a sprite sheet of this same boy for a 2D side-scrolling game: [MOVE].
- [N] frames in ONE horizontal row, evenly spaced, with clear empty space between frames.
- Every frame is a side view facing right. No front views, no back views.
- Full body in every frame, nothing cropped. Same size, proportions, hair, clothes and colours as the reference in every frame.
- The animation plays in place: the boy does not move across the row.
- Hand-drawn 2D game art, clean dark ink outlines, soft flat colours, minimal shading, same style as the reference.
- Solid flat pure magenta (#FF00FF) background. No ground line, no floor, no wall, no motion lines, no shadows, no text, no numbers.
```

| الحركة | `[N]` | `[MOVE]` |
|---|---|---|
| الجري | 8 | `a fast, natural run cycle: both feet leave the ground between steps, arms pump opposite to the legs, body leans forward, hair bounces; the last frame leads back into the first` |
| الوقوف | 6 | `an idle loop: standing relaxed, breathing gently, chest rising and falling slightly, hair moving a little` |
| القفز | 5 | `a jump in this order: pushing off the ground, rising with knees up and arms raised, the top of the jump, falling with hair blown upward, legs reaching down about to land` |
| المشي | 8 | `a calm walk cycle: one foot always on the ground, relaxed arm swing; the last frame leads back into the first` |
| الاندفاع | 3 | `a quick forward dash: bracing low, then bursting forward with the body leaning far forward, arms back, hair blown back, feet off the ground` |
| النزول | 3 | `landing after a jump: feet touch down with knees bending, a low crouch absorbing the impact, standing back up` |
| الجدار | 2 | `sliding down an invisible wall on his LEFT, behind his back; he faces right; back, left hand and one foot press against it; hair pushed up. Do not draw the wall` |

**لو طلع غلط:**
- خطوط أو جدار مرسوم: `Remove the ground line, the wall and all motion lines. Keep everything else the same.`
- رسمات من قدام أو ورا: `Make every frame a side view facing right. Keep everything else the same.`

## 3. ورقة الشخصية (خلصت)

هذا البرومبت اللي طلّع ورقة الشخصية. نرجع له لو احتجنا نعيدها، أو لما نسوي ملابس جديدة.

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

## 4. ورقة السيف المكسور (خلصت)

الرحّال يلقى هالسيف بعد ما يطلع من القرية.

```
Item reference sheet for a 2D hand-drawn dark fantasy platformer game.

An old broken sword: a plain one-handed straight blade of scratched, corroded grey iron with small rust spots. The top third of the blade is snapped off, leaving a jagged broken edge. A simple dark iron cross guard, a grip wrapped in faded, frayed cloth, and a small round pommel. No decorations, no gems, no glow.

Show it twice: the full sword lying horizontally with the blade pointing right, and a close-up of the broken edge of the blade.

Style: hand-drawn 2D game art, clean black ink outlines with slightly varied line weight, flat muted colors, very minimal shading, dark and melancholic mood.
Background: plain flat light grey. No text, no labels.
```

## 5. وش صار بالرسمات

- **ورقة الشخصية:** نظّفت الخلفية (`game/art/concept/hero_sheet.png`)، وقصّيت منها الصورة الجانبية. الأصل في `game/art/hero/source/character_sheet.png`.
- **محاولة الحركات الأولى** (`game/art/hero/source/first_try_sheet.png`):
  - شلت خطوط الأرض والجدار، وأخذت الإطارات الجانبية بس.
  - صارت حركات **مؤقتة** في اللعبة:
    - المشي والجري من نفس إطارات المشي.
    - الوقوف من إطار واقف تقريباً، مع تنفّس خفيف.
    - القفز من إطار ركبته مرفوعة.
    - الجدار من إطار ظهره على الجدار.
  - تتبدّل كلها لما توصل حركات AutoSprite.
- **السيف:** الورقة في `game/art/concept/sword_sheet.png`، والسيف لحاله بخلفية شفافة في `game/project/art/items/sword_broken.png`.
- **الرحّال القديم (بالغطاء والعباءة):** انشال. ورقته في `game/art/concept/old/wanderer_sheet.png`.

## 6. كيف تدخل الحركات اللعبة (لي أنا)

1. أحط الصور في `game/art/hero/source/`، وأكتب كل حركة في `game/art/hero/frames.json`: أي صورة، وأي إطارات، وكم إطار في الثانية.
2. أشغّل `python game/tools/sprite_sheet.py game/art/hero/frames.json`. الأداة:
   - تشيل الخلفية أو الخطوط.
   - تقص الإطارات.
   - تخلي كل الحركات بنفس الحجم ورجوله على نفس الخط.
   - تكتب `game/project/art/hero/frames.tres`.
3. Godot يقرأ الرسمات الجديدة على طول. سكربت `player_visual.gd` يختار الحركة حسب حالة الرحّال، ولو حركة ما لها رسمات يستخدم أقرب حركة لها.
