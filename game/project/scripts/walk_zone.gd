extends Area2D
## منطقة مشي (مثل القرية): داخلها الرحّال يمشي بس، ما يجري.


func _ready() -> void:
	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)


func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		body.walk_zones += 1


func _on_body_exited(body: Node2D) -> void:
	if body is Player:
		body.walk_zones -= 1
