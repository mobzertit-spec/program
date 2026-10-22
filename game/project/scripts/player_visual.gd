extends AnimatedSprite2D
## يختار رسمة الرحّال حسب حركته: وقوف، مشي، جري، فرملة، قفز، نزول، اندفاع، وجدار.
## الرسمات إطار إطار، تطلّعها game/tools/sprite_sheet.py في art/hero/frames.tres.
## هالسكربت يختار الحركة وسرعتها، ويطلّع الغبار والظلال. ما يغيّر الفيزياء أبداً، يقرأ حالة الرحّال بس.

# ===== الحجم =====
# طول الرحّال وهو واقف في عالم اللعبة (بكسل). سُبع الشاشة تقريباً
@export var hero_height := 120.0

# ===== الحركات =====
# الإطارات اللي تنحط فيها القدم على الأرض في المشي والجري (يطلع معها غبار خفيف)
@export var walk_contact_frames: Array[int] = [0, 4]
@export var run_contact_frames: Array[int] = [0, 4]
# القفز: إطاراته تمشي مع السرعة العمودية، من أول إطار (طالع بقوة) لآخر إطار (نازل بقوة)
@export var air_rise_speed := -1100.0
@export var air_fall_speed := 900.0
# النزول: أقل قوة نزول تطلّع حركة النزول، وكم تطول (ثواني) للنزول الخفيف والقوي
@export var land_min_impact := 0.2
@export var land_time_soft := 0.08
@export var land_time_hard := 0.22
# الفرملة: لو فك الزر أو عكس وهو أسرع من هالنسبة من سرعة الجري
@export var skid_speed_ratio := 0.7
@export var skid_time := 0.14

# ===== النعومة =====
# لما تتغيّر الحركة، الإطار القديم يختفي بالتدريج فوق الجديد هالمدة (ثواني). 0 = تبديل مباشر
@export var blend_time := 0.08

# ===== المؤثرات =====
@export var dust_color := Color(0.85, 0.82, 0.76, 0.55)
@export var ghost_color := Color(0.55, 0.78, 1.0, 0.45)
# كل كم ثانية يطلع ظل وقت الاندفاع
@export var ghost_interval := 0.035

# لو حركة ما لها رسمات لين الحين، نستخدم اللي بعدها في القائمة
const FALLBACK := {
	&"skid": [&"idle"],
	&"land": [&"idle"],
	&"walk": [&"run", &"idle"],
	&"run": [&"walk", &"idle"],
	&"dash": [&"run", &"idle"],
	&"wall": [&"jump", &"idle"],
	&"jump": [&"idle"],
}

# الحالة اللي اخترناها، حتى لو رسمتها مستعارة من حركة ثانية
var current := &"idle"
var land_timer := 0.0
var skid_timer := 0.0
var ghost_timer := 0.0
var wall_dust_timer := 0.0
var dust_fade := Gradient.new()
var silhouette: Shader = preload("res://shaders/silhouette.gdshader")

@onready var player: Player = owner
@onready var feet: Node2D = get_parent()


func _ready() -> void:
	# مكان القدمين داخل الإطار يجي من أداة القص، فالرجول تضل على الأرض لو تغيّرت الرسمات
	centered = false
	offset = -sprite_frames.get_meta("anchor", Vector2.ZERO)
	var drawn_height: float = sprite_frames.get_meta("height", hero_height)
	scale = Vector2.ONE * hero_height / drawn_height
	# الغبار يبدأ بلونه ويختفي بالتدريج
	dust_fade.set_color(0, Color.WHITE)
	dust_fade.set_color(1, Color(1, 1, 1, 0))
	if player == null:
		return
	player.jumped.connect(_on_jumped)
	player.landed.connect(_on_landed)
	player.dashed.connect(_on_dashed)
	frame_changed.connect(_on_frame_changed)
	show_state(current)


func _process(delta: float) -> void:
	if player == null:
		return
	land_timer -= delta
	skid_timer -= delta
	var next := pick_state()
	if next != current:
		current = next
		show_state(next)
	update_playback()
	update_effects(delta)


func pick_state() -> StringName:
	if player.state == Player.State.DASH:
		return &"dash"
	if player.is_wall_sliding:
		return &"wall"
	if not player.is_on_floor():
		return &"jump"
	var speed := absf(player.velocity.x)
	# فرملة: كان مسرع وفك الزر، أو ضغط عكس اتجاهه
	var braking := player.move_input == 0.0 or signf(player.move_input) != signf(player.velocity.x)
	if braking and speed > skid_speed_ratio * player.max_speed:
		skid_timer = skid_time
	if player.move_input != 0.0:
		land_timer = 0.0                    # أي حركة تقطع النزول، عشان التحكم يضل سريع
	if land_timer > 0.0:
		return &"land"
	if braking and skid_timer > 0.0 and speed > 20.0:
		return &"skid"
	if player.move_input != 0.0 and speed > 20.0:
		return &"walk" if player.is_walking else &"run"
	return &"idle"


func show_state(state: StringName) -> void:
	var anim := state
	var options: Array = [state] + FALLBACK.get(state, [])
	for option: StringName in options:
		if sprite_frames.has_animation(option):
			anim = option
			break
	if anim != animation and blend_time > 0.0 and sprite_frames.has_animation(animation):
		fade_out(sprite_frames.get_frame_texture(animation, frame))
	if anim == &"jump":
		# إطارات القفز تختارها السرعة العمودية، مو الوقت
		animation = anim
		pause()
	else:
		play(anim)


func update_playback() -> void:
	match animation:
		&"jump":
			var t := inverse_lerp(air_rise_speed, air_fall_speed, player.velocity.y)
			var count := sprite_frames.get_frame_count(animation)
			frame = roundi(clampf(t, 0.0, 1.0) * (count - 1))
		&"walk", &"run":
			# سرعة الإطارات تمشي مع سرعة الرحّال، فرجوله ما تنزلق على الأرض
			var base := player.walk_speed if animation == &"walk" else player.max_speed
			speed_scale = clampf(absf(player.velocity.x) / base, 0.6, 1.6)
		_:
			speed_scale = 1.0


func fade_out(texture: Texture2D) -> void:
	# نسخة من الإطار القديم فوق الجديد، تختفي بسرعة، فالتبديل بين الحركات يصير ناعم
	var old := Sprite2D.new()
	old.texture = texture
	old.centered = false
	old.offset = offset
	old.scale = scale
	old.position = position
	old.texture_filter = texture_filter
	old.modulate.a = 0.6
	feet.add_child(old)
	var tween := old.create_tween()
	tween.tween_property(old, "modulate:a", 0.0, blend_time)
	tween.tween_callback(old.queue_free)


func update_effects(delta: float) -> void:
	# غبار ينزل مع الانزلاق على الجدار
	wall_dust_timer -= delta
	if current == &"wall" and wall_dust_timer <= 0.0:
		wall_dust_timer = 0.1
		var side := -player.get_wall_normal().x
		spawn_dust(player.global_position + Vector2(side * 14.0, 20.0), 2, 0.3, Vector2(2, 6))

	# ظلال خفيفة ورا الرحّال وقت الاندفاع
	ghost_timer -= delta
	if current == &"dash" and ghost_timer <= 0.0:
		ghost_timer = ghost_interval
		spawn_ghost()


func _on_jumped(kind: StringName) -> void:
	match kind:
		&"ground":
			spawn_dust(feet.global_position, 5, 0.6)
		&"air":
			# نفخة تحت رجوله، كأنه دعس على الهوا
			spawn_dust(feet.global_position, 7, 0.5, Vector2(16, 2))
		&"wall":
			var side := -float(player.facing)
			spawn_dust(player.global_position + Vector2(side * 14.0, 10.0), 6, 0.6, Vector2(2, 10))


func _on_landed(impact: float) -> void:
	spawn_dust(feet.global_position, int(4 + 8 * impact), clampf(impact, 0.3, 1.0))
	# حركة النزول بس لما يكون واقف أو ماشي، مو وهو يجري (لا يبان كأنه ينزلق)
	if impact >= land_min_impact and absf(player.velocity.x) <= player.walk_speed + 1.0:
		land_timer = lerpf(land_time_soft, land_time_hard, impact)
		if current == &"land":
			show_state(&"land")             # نزول ورا نزول: الحركة تبدأ من أول


func _on_dashed() -> void:
	ghost_timer = 0.0
	if player.is_on_floor():
		spawn_dust(feet.global_position, 5, 0.7, Vector2(6, 2))


func _on_frame_changed() -> void:
	if not player.is_on_floor():
		return
	var contacts: Array[int] = []
	if animation == &"run":
		contacts = run_contact_frames
	elif animation == &"walk":
		contacts = walk_contact_frames
	if frame in contacts and absf(player.velocity.x) > player.walk_speed * 0.8:
		var behind := Vector2(-player.facing * 8.0, 0)
		spawn_dust(feet.global_position + behind, 2, 0.35 if animation == &"run" else 0.2)


func spawn_dust(at: Vector2, amount: int, strength: float, extents := Vector2(10, 2)) -> void:
	var room := player.get_parent()
	if room == null:
		return
	var dust := CPUParticles2D.new()
	dust.one_shot = true
	dust.explosiveness = 1.0
	dust.amount = amount
	dust.lifetime = 0.45
	dust.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	dust.emission_rect_extents = extents
	dust.direction = Vector2(0, -1)
	dust.spread = 70.0
	dust.initial_velocity_min = 30.0 * strength
	dust.initial_velocity_max = 90.0 * strength
	dust.gravity = Vector2(0, 60)
	dust.damping_min = 40.0
	dust.damping_max = 80.0
	dust.scale_amount_min = 2.0
	dust.scale_amount_max = 4.0
	dust.color = dust_color
	dust.color_ramp = dust_fade
	room.add_child(dust)
	dust.global_position = at
	dust.emitting = true
	dust.finished.connect(dust.queue_free)


func spawn_ghost() -> void:
	var room := player.get_parent()
	if room == null:
		return
	# نسخة من الإطار الحالي بلون واحد، تختفي بالتدريج
	var ghost := Sprite2D.new()
	ghost.texture = sprite_frames.get_frame_texture(animation, frame)
	ghost.centered = false
	ghost.offset = offset
	ghost.texture_filter = texture_filter
	ghost.z_index = -1
	var mat := ShaderMaterial.new()
	mat.shader = silhouette
	mat.set_shader_parameter("tint", ghost_color)
	ghost.material = mat
	room.add_child(ghost)
	ghost.global_transform = global_transform
	var tween := ghost.create_tween()
	tween.tween_property(ghost, "modulate:a", 0.0, 0.25)
	tween.tween_callback(ghost.queue_free)
