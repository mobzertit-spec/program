@tool
extends StaticBody2D
## قطعة أرض أو جدار. غيّر الحجم واللون من الـ Inspector.

# حجم القطعة بالبكسل (العرض، الطول)
@export var size := Vector2(256, 64):
	set(value):
		size = value
		update_block()

# لون القطعة
@export var color := Color("4a4f5c"):
	set(value):
		color = value
		update_block()


func _ready() -> void:
	update_block()


func update_block() -> void:
	# Godot يضبط الخصائص قبل ما تجهز العُقد الأبناء، فنتأكد إنها جاهزة
	if not is_node_ready():
		return
	# نسوي شكل تصادم جديد لكل قطعة، عشان ما تتشارك القطع نفس الحجم
	var shape := RectangleShape2D.new()
	shape.size = size
	$CollisionShape2D.shape = shape
	# مركز شكل التصادم في نص القطعة، والزاوية اليسرى العليا عند نقطة الأصل
	$CollisionShape2D.position = size / 2.0
	$ColorRect.size = size
	$ColorRect.color = color
