varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTex;
uniform vec2 uResolution;
uniform vec2 uTexResolution;

void main() {
  vec2 uv = vUv;

  vec2 repeat = vec2(56., 24.); // 24 columns, 24 rows
  uv = fract(vUv * repeat);

  vec3 texture = texture2D(uTex, uv).rgb;
  // texture *= vec3(0.8, 1., 1.);

  gl_FragColor = vec4(texture, 1.);
}