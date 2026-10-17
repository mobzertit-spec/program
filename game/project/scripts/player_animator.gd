extends Node2D
## يحرّك رسمة الرحّال حسب حركته: الوقوف، الجري، القفز، السقوط، الاندفاع، والانزلاق على الجدار.
## الرسمة أجزاء: العباءة، الجسم، الساعد، وكل رجل قطعتين (الركبة والساق) عشان تنثني.
## ما يغيّر الفيزياء أبداً، يقرأ حالة الرحّال بس.
##
## الزوايا: الموجبة تودّي الطرف لورا، والسالبة لقدّام.

# ===== خطوات الجري =====
# المسافة اللي يقطعها في خطوتين (بكسل). أكبر = خطوات أطول وأهدأ
@export var stride_length := 200.0
# كم تتحرك الفخذ لقدّام ولورا (بالدرجات)
@export var thigh_swing := 26.0
# أقصى انثناء للركبة لما ترتفع الرجل (بالدرجات)
@export var knee_bend := 70.0
# حركة الساعد مع الجري (بالدرجات)
@export var arm_swing := 22.0
# كم ينزل الجسم لما تنحط القدم (بكسل)
@export var step_dip := 1.5

# ===== ميلان الجسم (بالراديان) =====
@export var run_lean := 0.06
@export var dash_lean := 0.14
# ميلان إضافي وقت البداية والتوقف، حسب التسارع
@export var accel_lean := 0.00002

# ===== النعومة =====
# كم بسرعة تنتقل الرسمة من وضعية لوضعية (أكبر = أسرع)
@export var pose_speed := 12.0
@export var cloak_follow_speed := 6.0

# ===== المؤثرات =====
@export var dust_color := Color(0.78, 0.8, 0.86, 0.5)
@export var ghost_color := Color(0.55, 0.75, 1.0, 0.35)
# كل كم ثانية يطلع ظل وقت الاندفاع
@export var ghost_interval := 0.04

# وضعيات الرسمة
enum Pose { IDLE, RUN, AIR, DASH, WALL }

var time := 0.0
var stride_phase := 0.0
var last_step := 0
var last_vx := 0.0
var accel := 0.0
var landing := 0.0
var landing_strength := 0.0
var air_fall_speed := 0.0
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
@onready var arm: Sprite2D = $Arm
@onready var front_thigh: Sprite2D = $FrontThigh
@onready var front_shin: Sprite2D = $FrontThigh/FrontShin
@onready var back_thigh: Sprite2D = $BackThigh
@onready var back_shin: Sprite2D = $BackThigh/BackShin
@onready var eye_glow: Sprite2D = $EyeGlow
@onready var cloak_material: ShaderMaterial = cloak.material


func _ready() -> void:
	# الغبار يبدأ بلونه ويختفي بالتدريج
	dust_fade.set_color(0, Color.WHITE)
	dust_fade.set_color(1, Color(1, 1, 1, 0))


func _process(delta: float) -> void:
	if player == null or delta <= 0.0:
		return
	time += delta
	var pose := current_pose()
	var run := clampf(absf(player.velocity.x) / player.max_speed, 0.0, 1.0)
	track_motion(delta)
	update_limbs(delta, pose, run)
	update_cloak(delta, pose, run)
	update_effects(delta, pose, run)


func current_pose() -> Pose:
	if player.state == Player.State.DASH:
		return Pose.DASH
	if player.is_wall_sliding:
		return Pose.WALL
	if not player.is_on_floor():
		return Pose.AIR
	if absf(player.velocity.x) > 20.0:
		return Pose.RUN
	return Pose.IDLE


func track_motion(delta: float) -> void:
	# التسارع باتجاه وجه الرحّال (موجب = يسرّع لقدّام، سالب = يفرمل)
	var a := (player.velocity.x - last_vx) / delta * player.facing
	last_vx = player.velocity.x
	accel = lerpf(accel, a, 1.0 - exp(-8.0 * delta))
	# نحفظ أسرع سقوط وهو في الهوا، عشان نعرف قوة النزول
	if not player.is_on_floor():
		air_fall_speed = maxf(air_fall_speed, player.velocity.y)
	landing = maxf(landing - delta / 0.22, 0.0)


func update_limbs(delta: float, pose: Pose, run: float) -> void:
	var front_t := 0.0
	var front_s := 4.0
	var back_t := 0.0
	var back_s := 4.0
	var arm_angle := 4.0
	var lean := 0.0
	var dip := 0.0
	match pose:
		Pose.RUN:
			stride_phase += absf(player.velocity.x) * delta / stride_length * TAU
			var p := stride_phase
			# الفخذ تروح وتجي، والركبة تنثني بس وقت ما ترتفع الرجل لقدّام
			front_t = -thigh_swing * run * sin(p)
			front_s = 6.0 + knee_bend * run * pow(maxf(0.0, cos(p)), 1.5)
			back_t = -thigh_swing * run * sin(p + PI)
			back_s = 6.0 + knee_bend * run * pow(maxf(0.0, cos(p + PI)), 1.5)
			# الساعد مرفوع شوي، ويتحرك عكس الرجل القريبة
			arm_angle = -14.0 * run + arm_swing * run * sin(p)
			lean = run_lean * run + clampf(accel * accel_lean, -0.06, 0.06)
			# الجسم ينزل شوي كل ما انحطت قدم، بحركة ناعمة
			dip = step_dip * run * 0.5 * (1.0 + cos(2.0 * p))
		Pose.AIR:
			# 0 = طالع بسرعة، 1 = نازل بسرعة
			var t := clampf(player.velocity.y / 900.0 + 0.5, 0.0, 1.0)
			front_t = lerpf(-28.0, -8.0, t)
			front_s = lerpf(55.0, 14.0, t)
			back_t = lerpf(14.0, 6.0, t)
			back_s = lerpf(35.0, 10.0, t)
			arm_angle = lerpf(-20.0, 8.0, t)
			lean = lerpf(0.03, -0.01, t)
		Pose.DASH:
			front_t = 18.0
			front_s = 50.0
			back_t = 32.0
			back_s = 25.0
			arm_angle = 30.0
			lean = dash_lean
		Pose.WALL:
			front_t = 10.0
			front_s = 35.0
			back_t = 22.0
			back_s = 30.0
			arm_angle = 25.0
			lean = -0.04
		Pose.IDLE:
			arm_angle = 4.0 + 1.5 * sin(time * 2.4)
	# النزول على الأرض: الركب تنثني والجسم ينخفض لحظة، وبعدين يرجع
	if landing > 0.0:
		var l := landing * landing_strength
		front_t -= 12.0 * l
		front_s += 30.0 * l
		back_t -= 8.0 * l
		back_s += 26.0 * l
		dip += 4.0 * l

	var k := 1.0 - exp(-(24.0 if pose == Pose.RUN else pose_speed) * delta)
	front_thigh.rotation_degrees = lerpf(front_thigh.rotation_degrees, front_t, k)
	front_shin.rotation_degrees = lerpf(front_shin.rotation_degrees, front_s, k)
	back_thigh.rotation_degrees = lerpf(back_thigh.rotation_degrees, back_t, k)
	back_shin.rotation_degrees = lerpf(back_shin.rotation_degrees, back_s, k)
	arm.rotation_degrees = lerpf(arm.rotation_degrees, arm_angle, k)
	# الميلان يدور حول القدمين
	rotation = lerpf(rotation, lean, 1.0 - exp(-10.0 * delta))
	position.y = lerpf(position.y, dip, 1.0 - exp(-20.0 * delta))
	# تنفّس خفيف وهو واقف
	var breath := 1.0
	if pose == Pose.IDLE:
		breath = 1.0 + 0.01 * sin(time * 2.4)
	torso.scale.y = breath
	cloak.scale.y = breath


func update_cloak(delta: float, pose: Pose, run: float) -> void:
	var target_sway := 0.02
	var target_flutter := 0.25
	var target_lift := 0.0
	match pose:
		Pose.RUN:
			target_sway = 0.02 + 0.1 * run
			target_flutter = 0.35 + 0.5 * run
		Pose.AIR:
			target_sway = 0.05
			target_flutter = 0.7
			target_lift = clampf(player.velocity.y / player.max_fall_speed, 0.0, 1.0) * 0.06
		Pose.DASH:
			target_sway = 0.18
			target_flutter = 1.0
		Pose.WALL:
			target_sway = -0.03
			target_flutter = 0.5
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
		landing_strength = clampf(air_fall_speed / player.max_fall_speed, 0.25, 1.0)
		landing = 1.0
		air_fall_speed = 0.0
		spawn_dust(feet, int(4 + 8 * landing_strength), landing_strength)
	elif was_on_floor and not on_floor and player.velocity.y < 0.0:
		spawn_dust(feet, 5, 0.6)
	was_on_floor = on_floor

	# غبار خفيف لما تنحط القدم وقت الجري السريع
	var step := int(stride_phase / PI)
	if pose == Pose.RUN and step != last_step and run > 0.7:
		spawn_dust(feet, 2, 0.35)
	last_step = step

	# غبار ينزل مع الانزلاق على الجدار
	wall_dust_timer -= delta
	if pose == Pose.WALL and wall_dust_timer <= 0.0:
		wall_dust_timer = 0.1
		var side := -player.get_wall_normal().x
		spawn_dust(player.global_position + Vector2(side * 11.0, 20.0), 2, 0.3, Vector2(2, 6))

	# ظلال خفيفة ورا الرحّال وقت الاندفاع
	ghost_timer -= delta
	if pose == Pose.DASH and ghost_timer <= 0.0:
		ghost_timer = ghost_interval
		spawn_ghost()


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
	var ghost := Node2D.new()
	ghost.z_index = -1
	ghost.modulate = ghost_color
	room.add_child(ghost)
	for part: Sprite2D in [cloak, back_thigh, back_shin, front_thigh, front_shin, torso, arm]:
		var copy := Sprite2D.new()
		copy.texture = part.texture
		copy.centered = false
		copy.offset = part.offset
		if part == cloak:
			copy.material = cloak_material.duplicate()
		ghost.add_child(copy)
		copy.global_transform = part.global_transform
	var tween := ghost.create_tween()
	tween.tween_property(ghost, "modulate:a", 0.0, 0.25)
	tween.tween_callback(ghost.queue_free)
