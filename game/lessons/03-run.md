# الدرس 03: الجري والجاذبية

**الهدف:** أول سكربت للرحّال: يطيح على الأرض، ويجري يمين ويسار، ويلف.
**الوقت:** حوالي 45 دقيقة.
**قبله:** [الدرس 02](02-player.md)

---

## الفكرة

كل إطار (Frame) في اللعبة، Godot يسأل الرحّال: «وش بتسوي الحين؟». واحنا نجاوب بثلاث خطوات:

1. **الجاذبية:** لو الرحّال في الهوا، نزوّد سرعته لتحت.
2. **الجري:** نشوف وش ضاغط اللاعب، ونغيّر السرعة يمين أو يسار.
3. **الحركة:** نقول لـ Godot «حرّكه بهالسرعة»، وهو يوقّفه لو اصطدم بشي.

السرعة محفوظة في متغيّر جاهز اسمه `velocity`. فيه رقمين: `velocity.x` يمين ويسار، و `velocity.y` فوق وتحت.

## 1. أضف السكربت

1. افتح `player.tscn`.
2. حدد `Player`، واضغط **Attach Script**.
3. **Path:** `res://scripts/player.gd`، واضغط **Create**.
4. بيطلع كود جاهز. **احذفه كله** (Ctrl+A ثم Delete) والصق هذا:

`scripts/player.gd`

```gdscript
extends CharacterBody2D
## الرحّال: كل حركة البطل في هذا السكربت.

# ===== الجري =====
# أقصى سرعة جري (بكسل في الثانية)
@export var max_speed := 520.0
# كم بسرعة يوصل للسرعة القصوى
@export var acceleration := 5000.0
# كم بسرعة يوقف لما تفك الزر
@export var friction := 6000.0

# ===== الجاذبية =====
@export var gravity := 3400.0
@export var max_fall_speed := 1300.0

# اتجاه الرحّال: 1 يمين، -1 يسار
var facing := 1

@onready var body: Node2D = $Body


func _physics_process(delta: float) -> void:
	apply_gravity(delta)
	handle_run(delta)
	move_and_slide()
	update_visual()


func apply_gravity(delta: float) -> void:
	if is_on_floor():
		return
	velocity.y = minf(velocity.y + gravity * delta, max_fall_speed)


func handle_run(delta: float) -> void:
	var direction := Input.get_axis("move_left", "move_right")
	if direction != 0.0:
		velocity.x = move_toward(velocity.x, direction * max_speed, acceleration * delta)
		facing = 1 if direction > 0.0 else -1
	else:
		velocity.x = move_toward(velocity.x, 0.0, friction * delta)


func update_visual() -> void:
	body.scale.x = facing
```

5. احفظ (Ctrl+S)، وشغّل اللعبة (F5).

## 2. افهم الكود

### المتغيّرات اللي فوق

```gdscript
@export var max_speed := 520.0
```
أقصى سرعة جري: 520 بكسل في الثانية. يعني تقريباً ربع عرض الشاشة كل ثانية.

```gdscript
@export var acceleration := 5000.0
@export var friction := 6000.0
```
- `acceleration`: كم بسرعة يوصل للسرعة القصوى. رقم كبير يعني يوصل بسرعة.
- `friction`: كم بسرعة يوقف لما تفك الزر.

ألعاب زي Hollow Knight حركتها سريعة الاستجابة، فخلّينا الرقمين كبار.

```gdscript
var facing := 1
```
وين يطالع الرحّال. 1 يعني يمين، و -1 يعني يسار. هذا مو `@export` لأنه يتغيّر وقت اللعب بس.

```gdscript
@onready var body: Node2D = $Body
```
نحفظ عقدة `Body` في متغيّر عشان نستخدمها بسهولة. `@onready` يعني «جيبها لما تجهز العقدة».

### الدالة الرئيسية

```gdscript
func _physics_process(delta: float) -> void:
	apply_gravity(delta)
	handle_run(delta)
	move_and_slide()
	update_visual()
```
Godot يستدعي `_physics_process` **60 مرة في الثانية**. كل مرة نسوي الخطوات بالترتيب.

**وش هو `delta`؟** الوقت اللي مر من الإطار اللي قبل، تقريباً 0.016 ثانية. نضرب فيه عشان تكون الحركة بنفس السرعة حتى لو الجهاز بطيء.

`move_and_slide()` دالة جاهزة في `CharacterBody2D`: تحرّك الرحّال بسرعة `velocity`، ولو صدم أرض أو جدار توقّفه وتزحلقه على السطح.

### الجاذبية

```gdscript
func apply_gravity(delta: float) -> void:
	if is_on_floor():
		return
	velocity.y = minf(velocity.y + gravity * delta, max_fall_speed)
```
- `if is_on_floor(): return` يعني: لو هو على الأرض، اطلع من الدالة وما تسوي شي.
- غير كذا، نزوّد السرعة لتحت شوي كل إطار، فيطيح أسرع وأسرع.
- `minf` يختار الأصغر بين رقمين، فما تتعدى السرعة `max_fall_speed`.

### الجري

```gdscript
	var direction := Input.get_axis("move_left", "move_right")
```
`get_axis` يرجّع رقم بين -1 و 1: يسار يعطي -1، يمين يعطي 1، ولا شي يعطي 0. ويد التحكم تعطي أرقام بينهم حسب قد إيش دفّيت العصا.

```gdscript
	if direction != 0.0:
		velocity.x = move_toward(velocity.x, direction * max_speed, acceleration * delta)
		facing = 1 if direction > 0.0 else -1
	else:
		velocity.x = move_toward(velocity.x, 0.0, friction * delta)
```
- `move_toward(من، إلى، خطوة)` يقرّب الرقم الأول من الثاني بمقدار الخطوة، بدون ما يتعداه. فالسرعة تزيد شوي شوي بدل ما تقفز مرة وحدة.
- لو ضاغط زر: قرّب السرعة من السرعة القصوى، وغيّر الاتجاه.
- لو ما ضاغط: قرّب السرعة من صفر.

### الشكل

```gdscript
func update_visual() -> void:
	body.scale.x = facing
```
لما `scale.x` يصير -1، الشكل ينقلب كأنه في مراية، فتروح العين للجهة الثانية.

## 3. جرّب الحين

- الرحّال يطيح ويوقف على الأرض.
- A و D (أو الأسهم) يحركونه، والعين تلف مع الاتجاه.
- يوقف عند الجدران، ويطلع على الدرجة؟ لا، ما يقدر للحين. يحتاج قفز.

### غيّر الأرقام وأنت تلعب

1. في `test_room.tscn` حدد `Player`.
2. في الـ Inspector فوق، تحت **player.gd**، بتلقى كل متغيّرات `@export`.
3. جرّب `Max Speed` = 900، أو `Acceleration` = 800، وشغّل وشوف الفرق.
4. زر السهم الدائري جنب الرقم يرجّعه للقيمة الأصلية.

> التعديل هنا يتطبق على هالنسخة من الرحّال في الغرفة بس. لو تبي تغيّر الرقم في كل مكان، عدّله في الكود.

---

## ✔ تأكد قبل ما تكمل

- [ ] الرحّال يطيح على الأرض ويوقف.
- [ ] يجري يمين ويسار ويوقف بنعومة.
- [ ] العين تلف مع الاتجاه.

## لو واجهتك مشكلة

- **`The InputMap action "move_left" doesn't exist`:** اسم الفعل في Input Map مختلف عن الكود. لازم يكون `move_left` بالضبط.
- **`Node not found: "Body"` أو `Invalid access to property or key 'scale' on a base object of type 'null instance'`:** العقدة مو اسمها `Body` بالضبط، أو مو تحت `Player` مباشرة.
- **الرحّال يطيح من الأرض ويختفي:** تأكد إن القطع فيها `CollisionShape2D` شغّال (الدرس 01)، وإن `Player` فيه `CollisionShape2D` بشكل مستطيل.
- **`Used space character for indentation instead of tab`:** من قائمة **Edit** في محرر الكود اختر **Convert Indent to Tabs**.

## تحدّي (اختياري)

خلّ `Friction` = 300 وجرّب. بتحس إن الأرض صارت ثلج. هالرقم بنستخدمه بعدين لمناطق الجليد في دير الجليد.

## الدرس الجاي

[الدرس 04: القفز](04-jump.md)
