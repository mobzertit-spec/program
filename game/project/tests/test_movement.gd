extends SceneTree
# Automated movement checks for the lesson project.
# Run: godot --headless --path <project> --script res://tests/test_movement.gd

var room: Node2D
var player: CharacterBody2D
var failures := 0
var stage := 9


func _initialize() -> void:
	var args := OS.get_cmdline_user_args()
	if args.size() > 0:
		stage = int(args[0])
	var scene_path := "res://scenes/test_room.tscn"
	if args.size() > 1:
		scene_path = args[1]
	room = load(scene_path).instantiate()
	root.add_child(room)
	player = room.get_node_or_null("Player")
	run.call_deferred()


func frames(n: int) -> void:
	for i in n:
		await physics_frame


func check(cond: bool, label: String) -> void:
	if cond:
		print("PASS  ", label)
	else:
		failures += 1
		print("FAIL  ", label)


func release_all() -> void:
	for a in ["move_left", "move_right", "move_up", "move_down", "jump", "dash"]:
		Input.action_release(a)


func place(pos: Vector2) -> void:
	release_all()
	player.global_position = pos
	player.velocity = Vector2.ZERO
	if "state" in player:
		player.state = 0
	await frames(40)


func place_air(pos: Vector2) -> void:
	release_all()
	player.global_position = pos
	player.velocity = Vector2.ZERO
	player.state = 0


func has(prop: String) -> bool:
	return prop in player


func run() -> void:
	if stage <= 2:
		await smoke_test()
		return
	await frames(60)
	check(player.is_on_floor(), "player lands on the floor")

	# --- run ---
	await place(Vector2(256, 880))
	Input.action_press("move_right")
	await frames(30)
	check(absf(player.velocity.x - 520.0) < 1.0, "reaches max run speed (vx=%.1f)" % player.velocity.x)
	Input.action_release("move_right")
	await frames(12)
	check(absf(player.velocity.x) < 1.0, "stops after releasing (vx=%.1f)" % player.velocity.x)
	Input.action_press("move_left")
	await frames(5)
	Input.action_release("move_left")
	await frames(1)
	check(player.facing == -1, "faces left after pressing left")
	check(player.get_node("Body").scale.x < 0.0, "body is flipped when facing left")

	if stage >= 4:
		# --- full jump ---
		await place(Vector2(400, 880))
		var y0 := player.global_position.y
		var min_y := y0
		Input.action_press("jump")
		for i in 50:
			await physics_frame
			min_y = minf(min_y, player.global_position.y)
		Input.action_release("jump")
		var full_h := y0 - min_y
		check(full_h > 230.0 and full_h < 270.0, "full jump height ~248 (got %.0f)" % full_h)

		# --- short hop ---
		await place(Vector2(400, 880))
		y0 = player.global_position.y
		min_y = y0
		Input.action_press("jump")
		await physics_frame
		await physics_frame
		Input.action_release("jump")
		for i in 40:
			await physics_frame
			min_y = minf(min_y, player.global_position.y)
		var short_h := y0 - min_y
		check(short_h < full_h * 0.5, "short hop is lower (got %.0f vs %.0f)" % [short_h, full_h])

		# --- coyote time: walk off the step, jump right after leaving it ---
		await place(Vector2(1000, 700))
		check(player.is_on_floor(), "standing on the step")
		Input.action_press("move_right")
		var left_floor_frames := 0
		for i in 60:
			await physics_frame
			if not player.is_on_floor():
				left_floor_frames += 1
				if left_floor_frames == 3:
					break
		Input.action_press("jump")
		await frames(2)
		check(player.velocity.y < -1000.0, "coyote jump works 3 frames after leaving the edge (vy=%.0f)" % player.velocity.y)
		release_all()
		await frames(60)

		# --- jump buffer: press jump a few frames before landing ---
		await place(Vector2(400, 880))
		Input.action_press("jump")
		await frames(4)
		Input.action_release("jump")
		var landed := false
		for i in 120:
			await physics_frame
			if player.velocity.y > 0.0 and player.global_position.y > 870.0 and not landed:
				landed = true
				break
		Input.action_press("jump")
		await frames(1)
		Input.action_release("jump")
		var buffered := false
		for i in 12:
			await physics_frame
			if player.velocity.y < -200.0 and player.is_on_floor() == false and player.global_position.y < 905.0:
				buffered = true
		check(buffered, "jump buffer: early press jumps on landing")
		await frames(60)

	if stage >= 5 and has("can_double_jump"):
		# --- double jump ---
		await place(Vector2(400, 880))
		var y0 := player.global_position.y
		var min_y := y0
		Input.action_press("jump")
		await frames(18)
		Input.action_release("jump")
		await frames(4)
		Input.action_press("jump")
		await frames(2)
		var vy_after_double := player.velocity.y
		for i in 40:
			await physics_frame
			min_y = minf(min_y, player.global_position.y)
		Input.action_release("jump")
		check(vy_after_double < -1000.0, "double jump fires in the air (vy=%.0f)" % vy_after_double)
		var dj_h := y0 - min_y
		check(dj_h > 330.0, "double jump height ~400+ (got %.0f)" % dj_h)
		# third press does nothing
		Input.action_press("jump")
		await frames(1)
		Input.action_release("jump")
		check(player.velocity.y > -500.0, "no third jump (vy=%.0f)" % player.velocity.y)
		await frames(90)

		# --- HighPlatform (top 448) is 320px above the Step: single jump fails, double jump works ---
		await place(Vector2(1180, 700))
		check(player.is_on_floor() and player.global_position.y < 730.0, "standing on the step's right edge")
		Input.action_press("jump")
		Input.action_press("move_right")
		await frames(40)
		Input.action_release("jump")
		Input.action_release("move_right")
		await frames(60)
		check(player.global_position.y > 430.0, "single jump from the step does not reach HighPlatform (y=%.0f)" % player.global_position.y)
		await place(Vector2(1180, 700))
		Input.action_press("jump")
		await frames(16)
		Input.action_release("jump")
		await frames(2)
		Input.action_press("jump")
		await frames(10)
		Input.action_press("move_right")
		for i in 60:
			await physics_frame
			if player.global_position.x > 1360.0:
				Input.action_release("move_right")
		Input.action_release("jump")
		release_all()
		await frames(30)
		check(player.is_on_floor() and player.global_position.y < 410.0, "double jump from the step reaches HighPlatform (pos=%s)" % player.global_position)

	if stage >= 6 and has("can_dash"):
		# --- ground dash distance ---
		await place(Vector2(200, 880))
		var x0 := player.global_position.x
		Input.action_press("move_right")
		await frames(1)
		Input.action_release("move_right")
		Input.action_press("dash")
		await frames(1)
		Input.action_release("dash")
		await frames(1)
		check(player.state == 1, "dash state starts")
		await frames(11)
		var dash_dist := player.global_position.x - x0
		check(dash_dist > 230.0 and dash_dist < 300.0, "dash distance ~250 (got %.0f)" % dash_dist)
		check(player.state == 0, "dash ends")

		# --- only one air dash (start high so we stay airborne past the cooldown) ---
		await frames(30)
		place_air(Vector2(600, -600))
		await frames(2)
		Input.action_press("dash")
		await frames(1)
		Input.action_release("dash")
		await frames(1)
		check(player.state == 1, "air dash works")
		await frames(36)
		check(not player.is_on_floor(), "still airborne for the second dash test")
		Input.action_press("dash")
		await frames(1)
		Input.action_release("dash")
		await frames(1)
		check(player.state == 0, "second air dash is blocked")
		release_all()
		await frames(90)

	if stage >= 7 and has("can_wall_jump"):
		# --- wall slide on the left wall ---
		place_air(Vector2(150, 300))
		Input.action_press("move_left")
		var slid := false
		for i in 90:
			await physics_frame
			if player.is_wall_sliding:
				slid = true
				break
		await frames(10)
		check(slid, "wall slide starts when pushing into a wall")
		check(player.velocity.y <= 221.0, "wall slide caps fall speed (vy=%.0f)" % player.velocity.y)
		check(player.facing == 1, "faces away from the wall while sliding")
		Input.action_press("jump")
		await frames(2)
		Input.action_release("jump")
		check(player.velocity.x > 500.0 and player.velocity.y < -1000.0, "wall jump pushes away and up (v=%s)" % player.velocity)
		release_all()
		await frames(90)

	if stage == 7:
		await climb_small_shaft()

	if stage >= 8:
		await place(Vector2(400, 880))
		Input.action_press("jump")
		await frames(3)
		check(player.get_node("Body").scale.y > 1.02, "body stretches when jumping (scale=%s)" % player.get_node("Body").scale)
		Input.action_release("jump")
		var squashed := false
		for i in 80:
			await physics_frame
			if player.is_on_floor() and player.get_node("Body").scale.y < 0.95:
				squashed = true
		check(squashed, "body squashes on landing")
		var cam := player.get_node_or_null("Camera2D") as Camera2D
		check(cam != null and cam.position_smoothing_enabled, "camera follows the player with smoothing")

	if stage >= 9:
		await climb_shaft()
		await dash_corridor()
		await fall_and_respawn()

	print("DONE stage %d — failures: %d" % [stage, failures])
	release_all()
	quit(1 if failures > 0 else 0)


# Bot: climb the 256px shaft between UpperRock (x=3520) and ShaftWall (x=3776).
# Like a player: hold jump for a full jump, wall-jump near the top of each jump.
func climb_shaft() -> void:
	await place(Vector2(3648, 520))
	var dir := 1
	Input.action_press("move_right")
	Input.action_press("jump")
	await frames(15)
	Input.action_release("jump")
	var jumps := 0
	for n in 14:
		var waited := 0
		while not (player.is_wall_sliding and player.velocity.y > -150.0) and waited < 90:
			await physics_frame
			waited += 1
			if player.is_on_floor() and player.global_position.y < -280.0:
				break
		if not player.is_wall_sliding:
			break
		Input.action_press("jump")
		jumps += 1
		dir = -dir
		Input.action_release("move_left")
		Input.action_release("move_right")
		Input.action_press("move_right" if dir == 1 else "move_left")
		await frames(15)
		Input.action_release("jump")
	# walk right on top of ShaftWall
	Input.action_release("move_left")
	Input.action_press("move_right")
	await frames(20)
	release_all()
	await frames(30)
	print("      wall jumps used: ", jumps)
	check(player.global_position.y < -280.0 and player.global_position.x > 3776.0,
		"bot climbs the wall-jump shaft and stands on top (pos=%s)" % player.global_position)


# The low corridor over the pit: jump + double jump alone must fail, dash must pass.
func dash_corridor() -> void:
	# without dash
	player.spawn_position = Vector2(1920, 516)
	await place(Vector2(2100, 520))
	Input.action_press("move_right")
	await frames(16)
	Input.action_press("jump")
	await frames(3)
	Input.action_release("jump")
	await frames(6)
	Input.action_press("jump")
	await frames(3)
	Input.action_release("jump")
	await frames(120)
	release_all()
	await frames(20)
	check(player.global_position.x < 2400.0, "without dash you cannot cross the pit (pos=%s)" % player.global_position)

	# with dash
	await place(Vector2(2100, 520))
	Input.action_press("move_right")
	await frames(16)
	Input.action_press("jump")
	await frames(3)
	Input.action_release("jump")
	Input.action_press("dash")
	await frames(1)
	Input.action_release("dash")
	await frames(60)
	release_all()
	await frames(30)
	check(player.global_position.x > 2640.0 and player.global_position.y < 540.0 and player.is_on_floor(),
		"jump + dash crosses the pit (pos=%s)" % player.global_position)


func fall_and_respawn() -> void:
	player.spawn_position = Vector2(1920, 516)
	await place(Vector2(2430, 700))
	await frames(80)
	check(player.global_position.distance_to(Vector2(1920, 516)) < 80.0,
		"falling into the pit respawns at the checkpoint (pos=%s)" % player.global_position)
	# checkpoint updates spawn
	await place(Vector2(3600, 520))
	Input.action_press("move_right")
	await frames(20)
	release_all()
	check(player.spawn_position.distance_to(Vector2(3648, 516)) < 1.0, "checkpoint sets the spawn point (%s)" % player.spawn_position)



# Lessons 01-02: the room loads and each block's collision matches its size.
func smoke_test() -> void:
	await frames(30)
	for child in room.get_children():
		if child is StaticBody2D:
			var shape := child.get_node("CollisionShape2D").shape as RectangleShape2D
			var rect := child.get_node("ColorRect") as ColorRect
			check(shape != null and shape.size == child.size and rect.size == child.size,
				"%s: collision and color match size %s" % [child.name, child.size])
	var shapes := {}
	for child in room.get_children():
		if child is StaticBody2D:
			shapes[child.get_node("CollisionShape2D").shape] = true
	check(shapes.size() > 1, "blocks do not share one collision shape")
	if stage == 2:
		var p := room.get_node_or_null("Player")
		check(p != null and p is CharacterBody2D, "player instance is in the room")
	print("DONE stage %d — failures: %d" % [stage, failures])
	quit(1 if failures > 0 else 0)



# Lesson 07 room: walk under ClimbWall into the shaft, climb, stand on ClimbWall (top y=192).
func climb_small_shaft() -> void:
	await place(Vector2(1500, 880))
	Input.action_press("move_right")
	await frames(30)
	check(player.global_position.x > 1610.0 and player.is_on_floor(), "can walk under ClimbWall into the shaft (x=%.0f)" % player.global_position.x)
	var dir := 1
	var hold := 15
	Input.action_press("jump")
	for i in 400:
		await physics_frame
		hold -= 1
		if hold == 0:
			Input.action_release("jump")
		if player.is_on_floor() and player.global_position.y < 160.0:
			release_all()
			break
		if hold < 0 and player.is_wall_sliding and player.velocity.y > -150.0:
			Input.action_press("jump")
			hold = 15
			dir = -dir
			Input.action_release("move_left")
			Input.action_release("move_right")
			Input.action_press("move_right" if dir == 1 else "move_left")
	release_all()
	await frames(30)
	check(player.is_on_floor() and player.global_position.y < 160.0, "bot climbs the small shaft onto ClimbWall (pos=%s)" % player.global_position)
