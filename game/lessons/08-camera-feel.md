# الدرس 08: الكاميرا والإحساس

**الهدف:** كاميرا تلحق الرحّال بنعومة وما تطلع برا الغرفة، وشكل يتمدد وينضغط مع الحركة.
**الوقت:** حوالي 40 دقيقة.
**قبله:** [الدرس 07](07-wall.md)

---

## الفكرة

**الكاميرا:** عقدة `Camera2D` تخلّي الشاشة تلحق العقدة اللي هي تحتها. بنحطها تحت الرحّال، ونعطيها:
- **نعومة (Smoothing):** تلحقه بتأخير بسيط بدل ما تلتصق فيه، فالحركة تبان أنعم.
- **حدود (Limits):** ما تطلع برا حدود الغرفة، فما تشوف الفراغ اللي ورا الجدران.

**التمدد والانضغاط (Squash & Stretch):** حيلة قديمة من أفلام الكرتون:
- لما يقفز: يطوّل وينحف شوي.
- لما ينزل على الأرض: يقصر ويعرض شوي.
- لما يندفع: يطوّل بالعرض.

وبعدها يرجع لحجمه الطبيعي بسرعة. ما ينتبه له اللاعب بشكل واضح، بس يحس إن الحركة «حية».

## 1. الكاميرا

ليش نحطها في الغرفة مو في مشهد الرحّال؟ لأن **كل غرفة لها حدود مختلفة**. فنضيفها تحت نسخة الرحّال اللي في الغرفة.

1. افتح `test_room.tscn`.
2. اضغط يمين على `Player` واختر **Add Child Node**، واختر `Camera2D`.
3. في الـ Inspector، افتح **Position Smoothing**:
   - **Enabled:** ✓
   - **Speed:** `6`
4. شغّل وجرّب تمشي لعند الجدار اليسار. بتشوف الفراغ اللي برا الغرفة. هذا اللي بنحله الحين.
5. افتح **Limit** في الـ Inspector:
   - **Left:** `0`
   - **Top:** `0`
   - **Right:** `1920`
   - **Bottom:** `1152`
6. شغّل مرة ثانية. الكاميرا ما تطلع برا الغرفة.

الغرفة الحين بحجم الشاشة تقريباً، فما راح تشوف الكاميرا تتحرك كثير. في الدرس الجاي نكبّر الغرفة وتبان فايدتها.

## 2. التمدد والانضغاط

### متغيّرات جديدة

تحت قسم الجدار:

```gdscript
# ===== الإحساس =====
# سرعة رجوع الشكل لحجمه الطبيعي بعد التمدد والانضغاط
@export var stretch_recover_speed := 12.0
```

وتحت العدّادات:

```gdscript
var body_stretch := Vector2.ONE
```
`Vector2.ONE` يعني (1, 1): الحجم الطبيعي.

### نعرف متى نزل على الأرض

في `_physics_process`، نحفظ «كان على الأرض؟» قبل الحركة، ونقارن بعدها:

```gdscript
func _physics_process(delta: float) -> void:
	update_timers(delta)
	match state:
		State.NORMAL:
			normal_state(delta)
		State.DASH:
			dash_state(delta)

	var was_on_floor := is_on_floor()
	move_and_slide()
	if not was_on_floor and is_on_floor():
		on_land()
	update_visual(delta)
```
لو **ما كان** على الأرض، **وصار** على الأرض، يعني نزل الحين.

### نغيّر الشكل في اللحظات المهمة

آخر سطر في `jump`، وآخر سطر في `wall_jump`:

```gdscript
	body_stretch = Vector2(0.75, 1.25)
```

آخر سطر في `start_dash`:

```gdscript
	body_stretch = Vector2(1.3, 0.75)
```

ودالة جديدة للنزول:

```gdscript
func on_land() -> void:
	body_stretch = Vector2(1.25, 0.8)
```

### نرجّع الشكل لطبيعته

بدّل `update_visual` القديمة بهذي:

```gdscript
func update_visual(delta: float) -> void:
	body_stretch = body_stretch.lerp(Vector2.ONE, stretch_recover_speed * delta)
	body.scale = Vector2(facing * body_stretch.x, body_stretch.y)
```
- `lerp` يقرّب `body_stretch` من (1, 1) شوي كل إطار، فيرجع الشكل لطبيعته بنعومة.
- نضرب `x` في `facing` عشان القلب يمين ويسار يضل شغّال.
- لأن نقطة `Body` عند الرجول (من الدرس 02)، الشكل يتمدد لفوق وينضغط على الأرض، وما يطيح تحتها.

## 3. السكربت كامل لين هالدرس

`scripts/player.gd`

```gdscript
extends CharacterBody2D
## الرحّال: كل حركة البطل في هذا السكربت.

# ===== القدرات (شغّلها أو طفّها من الـ Inspector) =====
@export var can_double_jump := true
@export var can_dash := true
@export var can_wall_jump := true

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

# ===== الجدار =====
@export var wall_slide_speed := 220.0
# x: قوة الدفعة بعيد عن الجدار، y: قوة القفزة لفوق
@export var wall_jump_velocity := Vector2(650.0, -1150.0)
# بعد القفز من الجدار، نوقف التحكم هالمدة عشان الدفعة تكمل
@export var wall_jump_lock_time := 0.15

# ===== الإحساس =====
# سرعة رجوع الشكل لحجمه الطبيعي بعد التمدد والانضغاط
@export var stretch_recover_speed := 12.0

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
var is_wall_sliding := false
var wall_jump_lock_timer := 0.0
var body_stretch := Vector2.ONE

@onready var body: Node2D = $Body


func _physics_process(delta: float) -> void:
	update_timers(delta)
	match state:
		State.NORMAL:
			normal_state(delta)
		State.DASH:
			dash_state(delta)

	var was_on_floor := is_on_floor()
	move_and_slide()
	if not was_on_floor and is_on_floor():
		on_land()
	update_visual(delta)


func update_timers(delta: float) -> void:
	jump_buffer_timer -= delta
	dash_cooldown_timer -= delta
	wall_jump_lock_timer -= delta
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
	handle_wall_slide()
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
	if wall_jump_lock_timer > 0.0:
		return
	var direction := Input.get_axis("move_left", "move_right")
	if direction != 0.0:
		velocity.x = move_toward(velocity.x, direction * max_speed, acceleration * delta)
		facing = 1 if direction > 0.0 else -1
	else:
		velocity.x = move_toward(velocity.x, 0.0, friction * delta)


func handle_wall_slide() -> void:
	is_wall_sliding = false
	if not can_wall_jump or not is_on_wall_only():
		return
	var direction := Input.get_axis("move_left", "move_right")
	var wall_normal := get_wall_normal()
	# الـ normal سهم يطلع من الجدار. لو ضغطك عكسه، يعني أنت ضاغط على الجدار
	if direction * wall_normal.x < 0.0:
		is_wall_sliding = true
		velocity.y = minf(velocity.y, wall_slide_speed)
		# يطالع بعيد عن الجدار
		facing = 1 if wall_normal.x > 0.0 else -1
		# لمس الجدار يرجّع القفزة المزدوجة والاندفاع
		air_jumps_left = max_air_jumps
		can_air_dash = true


func handle_jump() -> void:
	if Input.is_action_just_pressed("jump"):
		jump_buffer_timer = jump_buffer_time

	if jump_buffer_timer > 0.0 and coyote_timer > 0.0:
		jump(jump_velocity)
	elif jump_buffer_timer > 0.0 and is_wall_sliding:
		wall_jump()
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
	body_stretch = Vector2(0.75, 1.25)


func wall_jump() -> void:
	var push := get_wall_normal().x
	velocity.x = push * wall_jump_velocity.x
	velocity.y = wall_jump_velocity.y
	facing = 1 if push > 0.0 else -1
	wall_jump_lock_timer = wall_jump_lock_time
	jump_buffer_timer = 0.0
	is_wall_sliding = false
	body_stretch = Vector2(0.75, 1.25)


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
	body_stretch = Vector2(1.3, 0.75)


func dash_state(delta: float) -> void:
	# سرعة ثابتة للأمام، وبدون جاذبية
	velocity = Vector2(facing * dash_speed, 0.0)
	dash_timer -= delta
	if dash_timer <= 0.0:
		state = State.NORMAL
		velocity.x = facing * max_speed


func on_land() -> void:
	body_stretch = Vector2(1.25, 0.8)


func update_visual(delta: float) -> void:
	body_stretch = body_stretch.lerp(Vector2.ONE, stretch_recover_speed * delta)
	body.scale = Vector2(facing * body_stretch.x, body_stretch.y)
```

## 4. جرّب الحين

- اقفز وشوف الرحّال يطوّل، وانزل وشوفه ينضغط.
- اندفع وشوفه يتمدد بالعرض.
- لو تبي تشوفها أوضح، خلّ `Stretch Recover Speed` = 3.

---

## ✔ تأكد قبل ما تكمل

- [ ] فيه `Camera2D` تحت `Player` في `test_room.tscn`، و Position Smoothing شغّال.
- [ ] الكاميرا ما تطلع برا حدود الغرفة.
- [ ] الشكل يتمدد وقت القفز والاندفاع، وينضغط لما ينزل.

## لو واجهتك مشكلة

- **`Too few arguments for "update_visual()" call`:** لازم تمرّر `delta`: `update_visual(delta)`.
- **الرحّال ما يلف يمين ويسار:** تأكد إن `body.scale = Vector2(facing * body_stretch.x, body_stretch.y)` وفيه `facing`.
- **الكاميرا ما تتحرك أبد:** في هالغرفة الصغيرة هذا طبيعي. بتشوفها تتحرك في الدرس الجاي.

## تحدّي (اختياري)

خلّ الكاميرا تطالع قدّام الرحّال شوي: في `update_visual` حاول تحرّك `$Camera2D.offset.x` باتجاه `facing`. (تلميح: الكاميرا موجودة في الغرفة بس، فاستخدم `get_node_or_null("Camera2D")` وتأكد إنها مو `null`.)

## الدرس الجاي

[الدرس 09: غرفة التجربة الكاملة](09-test-room.md)
