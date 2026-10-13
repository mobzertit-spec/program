# الدرس 04: القفز

**الهدف:** قفزة تحس فيها بالتحكم: طويلة لما تضغط مطوّل، وقصيرة لما تنقر، ومتسامحة مع اللاعب.
**الوقت:** حوالي 45 دقيقة.
**قبله:** [الدرس 03](03-run.md)

---

## الفكرة

القفز سهل في الكود: نعطي الرحّال سرعة لفوق، والجاذبية ترجّعه. بس عشان **يحس** زي ألعاب Hollow Knight و Celeste، نضيف أربع حيل:

| الحيلة | وش تسوي | ليش |
|---|---|---|
| **قفزة متغيّرة** | لو فكّيت الزر بدري، نقص السرعة لفوق | تتحكم بطول القفزة |
| **نزول أثقل** | الجاذبية وقت النزول أقوى من الطلوع | القفزة ما تحس إنها عايمة |
| **Coyote time** | تقدر تقفز بعد ما تطلع من الحافة بلحظة | اللاعب يحس إنه ضغط في الوقت، حتى لو تأخر شوي |
| **Jump buffer** | لو ضغطت قفز قبل ما توصل الأرض بلحظة، يقفز أول ما يلمسها | ما تضيع الضغطة |

اسم **Coyote time** جاي من شخصية الذيب في رسوم Road Runner، اللي يمشي في الهوا شوي قبل ما يطيح.

> **فوق يعني y سالب.** الأرض عند y = 960 والسقف عند y = 0، فعشان يطلع الرحّال لازم سرعته `velocity.y` تكون بالسالب.

## 1. الإضافات

افتح `scripts/player.gd`. بنضيف أجزاء جديدة، وتحت بتلقى السكربت كامل لو تبي تنسخه مرة وحدة.

### متغيّرات جديدة

تحت `gravity` أضف `fall_gravity_multiplier`، وتحت قسم الجاذبية أضف قسم القفز:

```gdscript
# الجاذبية وقت النزول أقوى، عشان القفزة ما تحس إنها عايمة
@export var fall_gravity_multiplier := 1.6
```

```gdscript
# ===== القفز =====
# سالب لأن فوق في Godot يعني y أصغر
@export var jump_velocity := -1300.0
# لو فكّيت زر القفز بدري، نضرب السرعة في هالرقم فتصير القفزة قصيرة
@export var jump_cut_multiplier := 0.45
# وقت سماح تقدر تقفز فيه بعد ما تطلع من الحافة
@export var coyote_time := 0.1
# لو ضغطت قفز قبل ما تلمس الأرض بشوي، نتذكر الضغطة هالمدة
@export var jump_buffer_time := 0.12
```

وتحت `var facing := 1` أضف عدّادين:

```gdscript
var coyote_timer := 0.0
var jump_buffer_timer := 0.0
```

### العدّادات

العدّاد رقم ننقص منه `delta` كل إطار. لو هو أكبر من صفر، يعني «الوقت لسا ما خلص».

```gdscript
func update_timers(delta: float) -> void:
	jump_buffer_timer -= delta
	if is_on_floor():
		coyote_timer = coyote_time
	else:
		coyote_timer -= delta
```
- `-=` يعني «نقّص منه».
- وأنت على الأرض، عدّاد الـ Coyote مليان دايم (0.1 ثانية). أول ما تطلع من الحافة يبدأ ينقص، وعندك 0.1 ثانية تقدر تقفز فيها.

### الجاذبية الثقيلة وقت النزول

```gdscript
func apply_gravity(delta: float) -> void:
	if is_on_floor():
		return
	var current_gravity := gravity
	if velocity.y > 0.0:
		current_gravity *= fall_gravity_multiplier
	velocity.y = minf(velocity.y + current_gravity * delta, max_fall_speed)
```
لو `velocity.y` موجب، يعني الرحّال نازل، فنضرب الجاذبية في 1.6.

### القفز

```gdscript
func handle_jump() -> void:
	if Input.is_action_just_pressed("jump"):
		jump_buffer_timer = jump_buffer_time

	if jump_buffer_timer > 0.0 and coyote_timer > 0.0:
		jump(jump_velocity)

	# قفزة قصيرة: لو فكّيت الزر والرحّال لسا طالع، نقص سرعته
	if Input.is_action_just_released("jump") and velocity.y < 0.0:
		velocity.y *= jump_cut_multiplier


func jump(strength: float) -> void:
	velocity.y = strength
	jump_buffer_timer = 0.0
	coyote_timer = 0.0
```
- `is_action_just_pressed` صح بس في الإطار اللي ضغطت فيه الزر، مو طول ما أنت ضاغط.
- لما تضغط، ما نقفز على طول. نعبّي عدّاد الـ buffer، وبعدين نسأل: «فيه ضغطة محفوظة **و** أنا على الأرض (أو لسا في وقت السماح)؟». لو إيه، نقفز.
- بعد القفزة نصفّر العدّادين عشان ما يقفز مرتين.
- `jump(strength)` دالة تاخذ **مدخل**: قوة القفزة. خلّيناها كذا عشان نستخدمها للقفزة المزدوجة في الدرس الجاي بقوة ثانية.

### رتّب `_physics_process`

```gdscript
func _physics_process(delta: float) -> void:
	update_timers(delta)
	apply_gravity(delta)
	handle_run(delta)
	handle_jump()
	move_and_slide()
	update_visual()
```

## 2. السكربت كامل لين هالدرس

قارن سكربتك بهذا. لو تبي، احذف كل شي والصقه:

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
# الجاذبية وقت النزول أقوى، عشان القفزة ما تحس إنها عايمة
@export var fall_gravity_multiplier := 1.6
@export var max_fall_speed := 1300.0

# ===== القفز =====
# سالب لأن فوق في Godot يعني y أصغر
@export var jump_velocity := -1300.0
# لو فكّيت زر القفز بدري، نضرب السرعة في هالرقم فتصير القفزة قصيرة
@export var jump_cut_multiplier := 0.45
# وقت سماح تقدر تقفز فيه بعد ما تطلع من الحافة
@export var coyote_time := 0.1
# لو ضغطت قفز قبل ما تلمس الأرض بشوي، نتذكر الضغطة هالمدة
@export var jump_buffer_time := 0.12

# اتجاه الرحّال: 1 يمين، -1 يسار
var facing := 1
var coyote_timer := 0.0
var jump_buffer_timer := 0.0

@onready var body: Node2D = $Body


func _physics_process(delta: float) -> void:
	update_timers(delta)
	apply_gravity(delta)
	handle_run(delta)
	handle_jump()
	move_and_slide()
	update_visual()


func update_timers(delta: float) -> void:
	jump_buffer_timer -= delta
	if is_on_floor():
		coyote_timer = coyote_time
	else:
		coyote_timer -= delta


func apply_gravity(delta: float) -> void:
	if is_on_floor():
		return
	var current_gravity := gravity
	if velocity.y > 0.0:
		current_gravity *= fall_gravity_multiplier
	velocity.y = minf(velocity.y + current_gravity * delta, max_fall_speed)


func handle_run(delta: float) -> void:
	var direction := Input.get_axis("move_left", "move_right")
	if direction != 0.0:
		velocity.x = move_toward(velocity.x, direction * max_speed, acceleration * delta)
		facing = 1 if direction > 0.0 else -1
	else:
		velocity.x = move_toward(velocity.x, 0.0, friction * delta)


func handle_jump() -> void:
	if Input.is_action_just_pressed("jump"):
		jump_buffer_timer = jump_buffer_time

	if jump_buffer_timer > 0.0 and coyote_timer > 0.0:
		jump(jump_velocity)

	# قفزة قصيرة: لو فكّيت الزر والرحّال لسا طالع، نقص سرعته
	if Input.is_action_just_released("jump") and velocity.y < 0.0:
		velocity.y *= jump_cut_multiplier


func jump(strength: float) -> void:
	velocity.y = strength
	jump_buffer_timer = 0.0
	coyote_timer = 0.0


func update_visual() -> void:
	body.scale.x = facing
```

## 3. جرّب الحين

- **انقر** زر القفز: قفزة قصيرة. **اضغط مطوّل**: قفزة عالية (تقريباً 250 بكسل).
- اطلع فوق الدرجة. طولها 192، يعني تحتاج قفزة شبه كاملة.
- **Coyote:** امش من حافة الدرجة واضغط قفز متأخر شوي بعد ما تطلع منها. بيقفز.
- **Buffer:** وأنت نازل، اضغط قفز قبل ما توصل الأرض بلحظة. بيقفز أول ما يلمس.

---

## ✔ تأكد قبل ما تكمل

- [ ] القفزة القصيرة واضح إنها أقصر من الطويلة.
- [ ] تقدر تطلع فوق الدرجة.
- [ ] النزول أسرع من الطلوع.

## لو واجهتك مشكلة

- **ما يقفز أبد:** تأكد إن اسم الفعل `jump` في Input Map، وإنك أضفت `handle_jump()` في `_physics_process`.
- **يطير لفوق وما يرجع:** تأكد إن `jump_velocity` بالسالب (`-1300.0`) و `gravity` بالموجب.
- **`Identifier "coyote_timer" not declared`:** نسيت تضيف `var coyote_timer := 0.0` فوق.

## تحدّي (اختياري)

- خلّ `Jump Cut Multiplier` = 1 وجرّب. صارت كل القفزات بنفس الطول. حسيت بالفرق؟
- خلّ `Coyote Time` = 0 وحاول تقفز من حافة الدرجة وأنت تجري. بتحس إن اللعبة «ظالمة» شوي.

## الدرس الجاي

[الدرس 05: القفزة المزدوجة](05-double-jump.md)
