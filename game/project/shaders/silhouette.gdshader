shader_type canvas_item;
// ظل الاندفاع: نفس شكل الرسمة بلون واحد. الشفافية تجي من الرسمة ومن modulate.

uniform vec4 tint : source_color = vec4(0.55, 0.78, 1.0, 0.45);

void fragment() {
	COLOR = vec4(tint.rgb, COLOR.a * tint.a);
}
