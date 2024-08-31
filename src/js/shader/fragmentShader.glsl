varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTex;
uniform vec2 uResolution;
uniform vec2 uTexResolution;
uniform float uScrollProgress;

void main() {
  vec2 uv = vUv;

  vec2 repeat = vec2(56., 24.); // 24 columns, 24 rows
  uv = fract(vUv * repeat);

  vec3 texture = texture2D(uTex, uv).rgb;
  // texture *= vec3(1.0, 1.0, 1.0);
  // texture *= vec3(0.8, 1., 1.);


  vec3 color1 = vec3(1.0, 1.0, 1.0);
  vec3 color2 = vec3(0.9569, 0.8157, 0.2471);
  vec3 color3 = vec3(0.0863, 0.6275, 0.5216);
  vec3 color4 = vec3(1.0, 1.0, 1.0);

  if(uScrollProgress < 0.25) {

    texture *= color4;

  } else if(uScrollProgress < 0.5) {

    float progress = (uScrollProgress - 0.25) / 0.25;
    texture *= mix(color1, color2, progress);

  } else if(uScrollProgress < 0.7) {

    float progress = (uScrollProgress - 0.5) / 0.25;
    texture *= mix(color2, color3, progress);

  } else {
    float progress = (uScrollProgress - 0.7) / 0.25;
    texture *= mix(color3, color4, progress);
  }

  gl_FragColor = vec4(texture, 1.0);
}