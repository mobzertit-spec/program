# الدرس 06: الاندفاع

**الهدف:** انطلاقة سريعة للأمام، ونتعلم معها فكرة «حالات» الرحّال.
**الوقت:** حوالي 45 دقيقة.
**قبله:** [الدرس 05](05-double-jump.md)

---

## الفكرة

وقت الاندفاع الرحّال يتصرف بطريقة مختلفة تماماً:
- سرعته ثابتة للأمام.
- ما فيه جاذبية (يطير مستقيم).
- ما يسمع أزرار الجري والقفز.

بدل ما نحط `if` في كل دالة («لو مندفع لا تسوي كذا»)، نقسم تصرفات الرحّال إلى **حالات (States)**. في كل لحظة يكون في حالة وحدة بس:

| الحالة | وش يسوي فيها |
|---|---|
| `NORMAL` | جاذبية، جري، قفز، ويقدر يبدأ اندفاع |
| `DASH` | سرعة ثابتة للأمام لين يخلص الوقت، وبعدين يرجع `NORMAL` |

بعدين بنضيف حالات ثانية زي: يضرب بالسيف، انضرب، يشرب من القِربة... وكل حالة لها كودها، فما يتلخبط شي.

**قواعد الاندفاع:**
- مدته 0.18 ثانية، ويقطع تقريباً 250 بكسل.
- بعده فيه انتظار (تبريد) 0.4 ثانية قبل اندفاع ثاني.
- في الهوا: اندفاعة وحدة بس، ترجع لما تلمس الأرض.

## 1. الإضافات

### القدرة والأرقام

في قسم القدرات:

```gdscript
@export var can_dash := true
```

تحت قسم القفزة المزدوجة:

```gdscript
# ===== الاندفاع =====
@export var dash_speed := 1400.0
@export var dash_duration := 0.18
@export var dash_cooldown := 0.4

# حالات الرحّال: يا يتحرك عادي، يا يندفع
enum State { NORMAL, DASH }
var state := State.NORMAL
```
- `enum` قائمة أسماء ثابتة. بدل ما نكتب أرقام (0 و 1) ونضيع، نكتب `State.NORMAL` و `State.DASH`.
- `state` متغيّر يحفظ الحالة الحين، ويبدأ `NORMAL`.

وتحت العدّادات:

```gdscript
var dash_timer := 0.0
var dash_cooldown_timer := 0.0
var can_air_dash := true
```

### `_physics_process` بالحالات

```gdscript
func _physics_process(delta: float) -> void:
	update_timers(delta)
	match state:
		State.NORMAL:
			normal_state(delta)
		State.DASH:
			dash_state(delta)
	move_and_slide()
	update_visual()
```
`match` يشوف قيمة `state` ويشغّل الكود اللي تحت الحالة المطابقة. كأنها «لو الحالة كذا سوّ كذا، ولو كذا سوّ كذا».

### الحالة العادية

كل اللي كان في `_physics_process` قبل، صار في دالة وحدة، ومعه بداية الاندفاع:

```gdscript
func normal_state(delta: float) -> void:
	apply_gravity(delta)
	handle_run(delta)
	handle_jump()
	handle_dash()
```

### العدّادات

في `update_timers` أضف عدّاد التبريد، ورجّع الاندفاعة الهوائية لما يلمس الأرض:

```gdscript
func update_timers(delta: float) -> void:
	jump_buffer_timer -= delta
	dash_cooldown_timer -= delta
	if is_on_floor():
		# على الأرض: نرجّع كل شي يتجدد بلمس الأرض
		coyote_timer = coyote_time
		air_jumps_left = max_air_jumps
		can_air_dash = true
	else:
		coyote_timer -= delta
```

### الاندفاع نفسه

أضف هالدوال الثلاث فوق `update_visual`:

```gdscript
func handle_dash() -> void:
	if not can_dash:
		return
	if Input.is_action_just_pressed("dash") and dash_cooldown_timer <= 0.0:
		if is_on_floor() or can_air_dash:
			start_dash()


func start_dash() -> void:
	state = State.DASH
	dash_timer = dash_duration
	dash_cooldown_timer = dash_cooldown
	if not is_on_floor():
		can_air_dash = false


func dash_state(delta: float) -> void:
	# سرعة ثابتة للأمام، وبدون جاذبية
	velocity = Vector2(facing * dash_speed, 0.0)
	dash_timer -= delta
	if dash_timer <= 0.0:
		state = State.NORMAL
		velocity.x = facing * max_speed
```
- `handle_dash`: يبدأ الاندفاع لو ضغطت الزر، والتبريد خلص، وأنت على الأرض أو باقي لك اندفاعة هوائية.
- `start_dash`: يحوّل الحالة لـ `DASH` ويعبّي العدّادات. لو كان في الهوا، يصرف الاندفاعة الهوائية.
- `dash_state`: كل إطار وهو مندفع، السرعة ثابتة (`facing` يحدد يمين أو يسار، و `y = 0` يعني ما يطيح). ولما يخلص الوقت يرجع `NORMAL`.
- آخر سطر يخلي سرعته بعد الاندفاع تساوي سرعة الجري، عشان ما يوقف فجأة.

## 2. السكربت كامل لين هالدرس

`scripts/player.gd`

```gdscript
extends CharacterBody2D
## الرحّال: كل حركة البطل في هذا السكربت.

# ===== القدرات (شغّلها أو طفّها من الـ Inspector) =====
@export var can_double_jump := true
@export var can_dash := true

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

# ===== القفزة المزدوجة =====
@export var double_jump_velocity := -1150.0
@export var max_air_jumps := 1

# ===== الاندفاع =====
@export var dash_speed := 1400.0
@export var dash_duration := 0.18
@export var dash_cooldown := 0.4

# حالات الرحّال: يا يتحرك عادي، يا يندفع
enum State { NORMAL, DASH }
var state := State.NORMAL

# اتجاه الرحّال: 1 يمين، -1 يسار
var facing := 1
var coyote_timer := 0.0
var jump_buffer_timer := 0.0
var air_jumps_left := 0
var dash_timer := 0.0
var dash_cooldown_timer := 0.0
var can_air_dash := true

@onready var body: Node2D = $Body


func _physics_process(delta: float) -> void:
	update_timers(delta)
	match state:
		State.NORMAL:
			normal_state(delta)
		State.DASH:
			dash_state(delta)
	move_and_slide()
	update_visual()


func update_timers(delta: float) -> void:
	jump_buffer_timer -= delta
	dash_cooldown_timer -= delta
	if is_on_floor():
		# على الأرض: نرجّع كل شي يتجدد بلمس الأرض
		coyote_timer = coyote_time
		air_jumps_left = max_air_jumps
		can_air_dash = true
	else:
		coyote_timer -= delta


func normal_state(delta: float) -> void:
	apply_gravity(delta)
	handle_run(delta)
	handle_jump()
	handle_dash()


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
	elif Input.is_action_just_pressed("jump") and can_double_jump and air_jumps_left > 0:
		air_jumps_left -= 1
		jump(double_jump_velocity)

	# قفزة قصيرة: لو فكّيت الزر والرحّال لسا طالع، نقص سرعته
	if Input.is_action_just_released("jump") and velocity.y < 0.0:
		velocity.y *= jump_cut_multiplier


func jump(strength: float) -> void:
	velocity.y = strength
	jump_buffer_timer = 0.0
	coyote_timer = 0.0


func handle_dash() -> void:
	if not can_dash:
		return
	if Input.is_action_just_pressed("dash") and dash_cooldown_timer <= 0.0:
		if is_on_floor() or can_air_dash:
			start_dash()


func start_dash() -> void:
	state = State.DASH
	dash_timer = dash_duration
	dash_cooldown_timer = dash_cooldown
	if not is_on_floor():
		can_air_dash = false


func dash_state(delta: float) -> void:
	# سرعة ثابتة للأمام، وبدون جاذبية
	velocity = Vector2(facing * dash_speed, 0.0)
	dash_timer -= delta
	if dash_timer <= 0.0:
		state = State.NORMAL
		velocity.x = facing * max_speed


func update_visual() -> void:
	body.scale.x = facing
```

## 3. جرّب الحين

- اضغط **L** أو **C** (أو RT): الرحّال ينطلق للأمام.
- اقفز واندفع في الهوا: يطير مستقيم بدون ما يطيح.
- جرّب تندفع مرتين في الهوا: الثانية ما تشتغل لين تلمس الأرض.
- اقفز، اندفع، وبعدين قفزة مزدوجة. كذا توصل لأبعد مسافة.

---

## ✔ تأكد قبل ما تكمل

- [ ] الاندفاع يقطع مسافة واضحة ويرجع للحركة العادية.
- [ ] اندفاعة وحدة في الهوا.
- [ ] الاندفاع يمشي باتجاه ما يطالع الرحّال.

## لو واجهتك مشكلة

- **`Identifier "State" not declared`:** سطر `enum State { NORMAL, DASH }` لازم يكون فوق الدوال.
- **يندفع وما يوقف:** تأكد إن `dash_timer -= delta` موجود داخل `dash_state`.
- **الجاذبية والجري ما يشتغلون:** تأكد إن `normal_state` فيها الأربع دوال، وإن `match` يستدعيها.

## تحدّي (اختياري)

- خلّ `Dash Cooldown` = 0 وجرّب تندفع على الأرض ورا بعض. هذا ليش نحتاج التبريد.
- خلّ `Dash Speed` = 2500 و `Dash Duration` = 0.1. نفس المسافة تقريباً، بس إحساس مختلف.

## الدرس الجاي

[الدرس 07: الجدار](07-wall.md)
