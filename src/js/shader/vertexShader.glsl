varying vec2 vUv;
uniform float uTime;

#pragma glslify: pnoise = require(glsl-noise/periodic/3d);
// #pragma glslify: rotateY = require(glsl-rotate/rotateY);
// #pragma glslify: rotateX = require(glsl-rotate/rotateX);

void main() {
  vUv = uv;
  vec3 pos = position;

  // pos = pos + (normal * 10.0 * sin(uTime * 10.0));
  // pos.x = pos.x + (normal.x * 10.0 * sin(uTime * 10.0));


  float distortion = pnoise((normal + uTime * 5.0), vec3(5.0) * 3.5) * 1.0;
  pos = pos + (normal + distortion);


  // z軸の位置に基づいて回転角度を計算
  // float twist = 0.01; // ねじれの強さ
  // float angle = twist * pos.z + uTime; // ねじれの強さと時間による変化

  // // 回転行列を適用
  // float s = sin(angle);
  // float c = cos(angle);

  // // x, y の位置に回転を適用
  // pos.x = c * position.x - s * position.y;
  // pos.y = s * position.x + c * position.y;


  // 半径を維持しながらx, y座標を回転
  // float s = sin(angle);
  // float c = cos(angle);
  // float radius = length(vec2(pos.x, pos.y)); // 半径を計算
  // pos.x = radius * (c * (pos.x / radius) - s * (pos.y / radius));
  // pos.y = radius * (s * (pos.x / radius) + c * (pos.y / radius));



  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}