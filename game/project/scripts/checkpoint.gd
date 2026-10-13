extends Area2D
## نقطة رجوع: لما يمر الرحّال من هنا، يصير هذا مكان رجوعه لو طاح.
## (بعدين بنبدّلها بنار المخيّم)


func _ready() -> void:
	body_entered.connect(_on_body_entered)


func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		# نرجّعه فوق النقطة بشوي عشان ما يعلق في الأرض
		body.spawn_position = global_position + Vector2(0, -60)
