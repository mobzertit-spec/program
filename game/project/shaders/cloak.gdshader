shader_type canvas_item;
// حركة العباءة: الجزء اللي تحت يميل لورا ويتموّج.
// عند الأكتاف ما يتحرك شي، وعند طرف العباءة تتحرك الحركة كاملة.

// كم يندفع طرف العباءة لورا (بوحدات الصورة: 0.1 = عُشر عرضها)
uniform float sway = 0.0;
// قوة التموّج
uniform float flutter = 0.0;
// كم يرتفع طرف العباءة لفوق (وقت السقوط)
uniform float lift = 0.0;
// من وين تبدأ العباءة تتحرك (0 = أعلى الصورة، 1 = أسفلها)
uniform float start_v = 0.25;

varying vec4 tint;

void vertex() {
	// نحفظ اللون (modulate) عشان نطبّقه بعد ما نحرّك البكسلات
	tint = COLOR;
}

void fragment() {
	float w = clamp((UV.y - start_v) / (1.0 - start_v), 0.0, 1.0);
	w = w * w;
	float ripple = sin(UV.y * 24.0 - TIME * 9.0) * 0.02 * flutter;
	vec2 uv = UV + vec2((sway + ripple) * w, lift * w);
	vec4 c = texture(TEXTURE, uv);
	if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
		c.a = 0.0;
	}
	COLOR = c * tint;
}
