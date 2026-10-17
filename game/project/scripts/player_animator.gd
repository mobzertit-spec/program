extends Node2D
## يحرّك رسمة الرحّال حسب حركته: الوقوف، الجري، القفز، السقوط، الاندفاع، والانزلاق على الجدار.
## الرسمة مقسومة أجزاء (العباءة، الجسم، الرجلين)، وهذا السكربت يحرّك كل جزء لحاله.
## ما يغيّر الفيزياء أبداً، يقرأ حالة الرحّال بس.

# ===== الرجلين =====
# أقصى زاوية للرجل وقت الجري (بالدرجات)
@export var leg_swing_degrees := 28.0
# المسافة اللي يقطعها الرحّال في خطوتين (بكسل)
@export var stride_length := 120.0

# ===== الجسم =====
# كم يرتفع الجسم مع كل خطوة (بكسل)
@export var run_bob := 3.0
# ميلان الجسم للأمام وقت الجري ووقت الاندفاع (بالراديان)
@export var run_lean := 0.07
@export var dash_lean := 0.16

# ===== العباءة =====
# كم بسرعة تلحق العباءة حركة الرحّال
@export var cloak_follow_speed := 6.0

# ===== المؤثرات =====
@export var dust_color := Color(0.78, 0.8, 0.86, 0.6)
@export var ghost_color := Color(0.55, 0.75, 1.0, 0.45)
# كل كم ثانية يطلع ظل وقت الاندفاع
@export var ghost_interval := 0.035

# وضعيات الرسمة
enum Pose { IDLE, RUN, RISE, FALL, DASH, WALL }

var time := 0.0
var stride_phase := 0.0
var last_step := 0
var sway := 0.0
var flutter := 0.0
var lift := 0.0
var was_on_floor := true
var ghost_timer := 0.0
var wall_dust_timer := 0.0
var dust_fade := Gradient.new()

@onready var player: Player = owner
@onready var cloak: Sprite2D = $Cloak
@onready var torso: Sprite2D = $Torso
@onready var front_leg: Sprite2D = $FrontLeg
@onready var back_leg: Sprite2D = $BackLeg
@onready var eye_glow: Sprite2D = $EyeGlow
@onready var cloak_material: ShaderMaterial = cloak.material


func _ready() -> void:
	# الغبار يبدأ بلونه ويختفي بالتدريج
	dust_fade.set_color(0, Color.WHITE)
	dust_fade.set_color(1, Color(1, 1, 1, 0))


func _process(delta: float) -> void:
	if player == null:
		return
	time += delta
	var pose := current_pose()
	var run := clampf(absf(player.velocity.x) / player.max_speed, 0.0, 1.0)
	update_legs(delta, pose, run)
	update_body(delta, pose, run)
	update_cloak(delta, pose, run)
	update_effects(delta, pose, run)


func current_pose() -> Pose:
	if player.state == Player.State.DASH:
		return Pose.DASH
	if player.is_wall_sliding:
		return Pose.WALL
	if not player.is_on_floor():
		return Pose.RISE if player.velocity.y < 0.0 else Pose.FALL
	if absf(player.velocity.x) > 20.0:
		return Pose.RUN
	return Pose.IDLE


func update_legs(delta: float, pose: Pose, run: float) -> void:
	# الزاوية الموجبة تودّي القدم لورا، والسالبة لقدّام
	var front := 0.0
	var back := 0.0
	match pose:
		Pose.RUN:
			stride_phase += absf(player.velocity.x) * delta / stride_length * TAU
			var swing := sin(stride_phase) * leg_swing_degrees * run
			front = swing
			back = -swing
		Pose.RISE:
			front = -30.0
			back = 18.0
		Pose.FALL:
			front = -10.0
			back = 14.0
		Pose.DASH:
			front = 24.0
			back = 34.0
		Pose.WALL:
			front = 12.0
			back = 26.0
	var k := 1.0 - exp(-(30.0 if pose == Pose.RUN else 14.0) * delta)
	front_leg.rotation_degrees = lerpf(front_leg.rotation_degrees, front, k)
	back_leg.rotation_degrees = lerpf(back_leg.rotation_degrees, back, k)


func update_body(delta: float, pose: Pose, run: float) -> void:
	var lean := 0.0
	var bob := 0.0
	match pose:
		Pose.RUN:
			lean = run_lean * run
			bob = -absf(sin(stride_phase)) * run_bob * run
		Pose.DASH:
			lean = dash_lean
		Pose.WALL:
			lean = -0.05
		Pose.RISE:
			lean = 0.03
		Pose.FALL:
			lean = -0.02
	# الميلان يدور حول القدمين
	rotation = lerpf(rotation, lean, 1.0 - exp(-12.0 * delta))
	position.y = lerpf(position.y, bob, 1.0 - exp(-25.0 * delta))
	# تنفّس خفيف وهو واقف
	var breath := 1.0
	if pose == Pose.IDLE:
		breath = 1.0 + 0.018 * sin(time * 2.4)
	torso.scale.y = breath
	cloak.scale.y = breath


func update_cloak(delta: float, pose: Pose, run: float) -> void:
	var target_sway := 0.02
	var target_flutter := 0.25
	var target_lift := 0.0
	match pose:
		Pose.RUN:
			target_sway = 0.02 + 0.12 * run
			target_flutter = 0.4 + 0.6 * run
		Pose.RISE:
			target_sway = 0.06
			target_flutter = 0.5
		Pose.FALL:
			target_sway = 0.04
			target_flutter = 1.0
			target_lift = clampf(player.velocity.y / player.max_fall_speed, 0.0, 1.0) * 0.07
		Pose.DASH:
			target_sway = 0.2
			target_flutter = 1.2
		Pose.WALL:
			target_sway = -0.03
			target_flutter = 0.6
			target_lift = 0.03
	var k := 1.0 - exp(-cloak_follow_speed * delta)
	sway = lerpf(sway, target_sway, k)
	flutter = lerpf(flutter, target_flutter, k)
	lift = lerpf(lift, target_lift, k)
	cloak_material.set_shader_parameter("sway", sway)
	cloak_material.set_shader_parameter("flutter", flutter)
	cloak_material.set_shader_parameter("lift", lift)


func update_effects(delta: float, pose: Pose, run: float) -> void:
	# العيون تلمع بهدوء، وتقوى وقت الاندفاع
	var glow := 0.4 + 0.1 * sin(time * 1.7)
	if pose == Pose.DASH:
		glow = 0.8
	eye_glow.modulate.a = lerpf(eye_glow.modulate.a, glow, 1.0 - exp(-10.0 * delta))

	var feet := player.global_position + Vector2(0, 48)
	var on_floor := player.is_on_floor()
	if on_floor and not was_on_floor:
		spawn_dust(feet, 10, 1.0)
	elif was_on_floor and not on_floor and player.velocity.y < 0.0:
		spawn_dust(feet, 6, 0.7)
	was_on_floor = on_floor

	# غبار خفيف مع كل خطوة وقت الجري السريع
	var step := int(stride_phase / PI)
	if pose == Pose.RUN and step != last_step and run > 0.6:
		spawn_dust(feet, 3, 0.4)
	last_step = step

	# غبار ينزل مع الانزلاق على الجدار
	wall_dust_timer -= delta
	if pose == Pose.WALL and wall_dust_timer <= 0.0:
		wall_dust_timer = 0.09
		var side := -player.get_wall_normal().x
		spawn_dust(player.global_position + Vector2(side * 14.0, 20.0), 2, 0.3)

	# ظلال ورا الرحّال وقت الاندفاع
	ghost_timer -= delta
	if pose == Pose.DASH and ghost_timer <= 0.0:
		ghost_timer = ghost_interval
		spawn_ghost()


func spawn_dust(at: Vector2, amount: int, strength: float) -> void:
	var room := player.get_parent()
	if room == null:
		return
	var dust := CPUParticles2D.new()
	dust.one_shot = true
	dust.explosiveness = 1.0
	dust.amount = amount
	dust.lifetime = 0.45
	dust.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	dust.emission_rect_extents = Vector2(10, 2)
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
	var ghost := Node2D.new()
	ghost.z_index = -1
	ghost.modulate = ghost_color
	room.add_child(ghost)
	for part: Sprite2D in [cloak, back_leg, front_leg, torso]:
		var copy := Sprite2D.new()
		copy.texture = part.texture
		copy.centered = false
		copy.offset = part.offset
		ghost.add_child(copy)
		copy.global_transform = part.global_transform
	var tween := ghost.create_tween()
	tween.tween_property(ghost, "modulate:a", 0.0, 0.28)
	tween.tween_callback(ghost.queue_free)
