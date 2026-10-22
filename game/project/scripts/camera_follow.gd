extends Camera2D
## الكاميرا تتقدم شوي في الاتجاه اللي يطالعه الرحّال، عشان تشوف اللي قدامك،
## وتنزل قبله لما يطيح بسرعة. حدود الغرفة تضل شغالة.

# كم تتقدم الكاميرا قدام الرحّال (بكسل)
@export var look_ahead := 110.0
@export var look_ahead_speed := 2.5
# أقصى نزول للكاميرا قبل الرحّال وهو يطيح (بكسل)
@export var fall_look := 140.0
# من أي سرعة سقوط تبدأ الكاميرا تنزل قبله
@export var fall_look_start := 800.0

@onready var player: Player = get_parent()


func _process(delta: float) -> void:
	if player == null:
		return
	var falling := inverse_lerp(fall_look_start, player.max_fall_speed, player.velocity.y)
	var target := Vector2(player.facing * look_ahead, clampf(falling, 0.0, 1.0) * fall_look)
	position.x = lerpf(position.x, target.x, 1.0 - exp(-look_ahead_speed * delta))
	position.y = lerpf(position.y, target.y, 1.0 - exp(-4.0 * delta))
