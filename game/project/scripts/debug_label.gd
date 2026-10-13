extends Label
## نص للتجربة يعرض حالة الرحّال وقت اللعب.

@export var player: Player


func _process(_delta: float) -> void:
	if player == null:
		return
	text = "state: %s\nspeed: %d, %d\nfloor: %s   wall: %s" % [
		Player.State.keys()[player.state],
		player.velocity.x,
		player.velocity.y,
		player.is_on_floor(),
		player.is_wall_sliding,
	]
