import '../css/style.scss';
import { lerp } from "./utils";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertexSource from "./shader/vertexShader.glsl";
import fragmentSource from "./shader/fragmentShader.glsl";
import Lenis from '@studio-freight/lenis';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import img from '../images/text_re.png';

class Main {
  constructor() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.canvas = document.querySelector("#canvas");
    this.renderer = null;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.controls = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.uniforms = {
      uTime: {
        value: 0.0
      },
      uTex: {
        value: this.texture
      },
      uResolution: {
        value: new THREE.Vector2(this.viewport.width, this.viewport.height)
      },
      uTexResolution: {
        value: new THREE.Vector2(2048, 256)
      },
    };

    this.clock = new THREE.Clock();

    this.lenis = new Lenis({
      lerp: 0.04, // 慣性の強さ
    });

    this.percentage = 0;
    this.targetPercentage = 0;

    this.init();
  }

  init() {
    this._setRenderer();
    this._setCamera();
    // this._setControlls();
    this._setLight();
    this._setCurve();
    this._setScroll();
    this._addMesh();


    this._update();
    this._addEvent();
  }

  _setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  _setCamera() {
    // this.camera = new THREE.PerspectiveCamera(45, this.viewport.width / this.viewport.height, 1, 100);
    // this.camera.position.set(0, 0, 5);
    // this.scene.add(this.camera);

    //ウインドウとWebGL座標を一致させる
    const fov = 45;
    const fovRadian = (fov / 2) * (Math.PI / 180); //視野角をラジアンに変換
    const distance = (this.viewport.height / 2) / Math.tan(fovRadian); //ウインドウぴったりのカメラ距離
    this.camera = new THREE.PerspectiveCamera(fov, this.viewport.width / this.viewport.height, 1, distance * 2);
    this.camera.position.z = distance;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
  }

  // _setControlls() {
  //   this.controls = new OrbitControls(this.camera, this.canvas);
  //   this.controls.enableDamping = true;
  // }

  _setLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1);
    this.scene.add(light);
  }

  _setCurve() {
    this.curveLine = new THREE.CatmullRomCurve3([
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 0, 0, -50 ),
      new THREE.Vector3( 10, 15, -200 ),
      new THREE.Vector3( -10, 25, -400 ),
      new THREE.Vector3( 30, 5, -600 ),
      new THREE.Vector3( -10, -5, -800 ),
      new THREE.Vector3( 0, 0, -1000 ),
      new THREE.Vector3( 0, 0, -1050 ),
      new THREE.Vector3( 10, 15, -1200 ),
      new THREE.Vector3( -10, 25, -1400 ),
      new THREE.Vector3( 30, 5, -1600 ),
      new THREE.Vector3( -10, -5, -1800 ),
      new THREE.Vector3( 0, 0, -2000 ),
    ]);

    // this.curveLine.closed = true;
    this.curveLine.tension = 20.0;
  }

  _addMesh() {
    const geometry = new THREE.TubeGeometry(this.curveLine, 200, 6, 4, false);

    //テクスチャ
    const loader = new THREE.TextureLoader();
    const texture = loader.load(img);
    // テクスチャの境界線の調整
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    this.uniforms.uTex.value = texture;

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
      // side: THREE.DoubleSide,
      side: THREE.BackSide,
      // wireframe: true,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  _setScroll() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#section01',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        // markers: true,
        onUpdate: (self) => {
          // this._updateCamera();
          const progress = self.progress;

          if(progress > 0.96) return;
          
          // this.percentage = progress;
          this.targetPercentage = progress;
        }
      }
    });

    const tlMouse = gsap.timeline({
      scrollTrigger: {
        trigger: '#section01',
        start: 'top top-=100',
        // markers: true,
      }
    })
    tlMouse.to('.mouse', {
      opacity: 0,
      duration: 0.6,
    })
  }

  _updateCamera() {
    this.percentage = lerp(this.percentage, this.targetPercentage, 0.08);

    let p1 = this.curveLine.getPoint(this.percentage%1);
    let p2 = this.curveLine.getPointAt((this.percentage + 0.01)%1);

    this.camera.position.set(p1.x, p1.y, p1.z);
    this.camera.lookAt(p2);
  }



  _update(time) {
    this.lenis.raf(time);

    const elapsedTime = this.clock.getElapsedTime();
    this.uniforms.uTime.value = elapsedTime * 0.03;

    // const previousPercentage = this.percentage;

    this._updateCamera();

    //レンダリング
    this.renderer.render(this.scene, this.camera);
    // this.controls.update();
    requestAnimationFrame(this._update.bind(this));
  }

  _onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    // レンダラーのサイズを修正
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    // カメラのアスペクト比を修正
    this.camera.aspect = this.viewport.width / this.viewport.height;
    this.camera.updateProjectionMatrix();
    // カメラの位置を調整
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian); //ウインドウぴったりのカメラ距離
    this.camera.position.z = this.cameraDistance;
    // uniforms変数に反映
    this.mesh.material.uniforms.uResolution.value.set(this.viewport.width, this.viewport.height);
    // meshのscale設定
    const scaleX = Math.round(this.viewport.width / this.mesh.geometry.parameters.width * 100) / 100 + 0.01;
    const scaleY = Math.round(this.viewport.height / this.mesh.geometry.parameters.height * 100) / 100 + 0.01;
    this.mesh.scale.set(scaleX, scaleY, 1);
  }

  _addEvent() {
    window.addEventListener("resize", this._onResize.bind(this));
  }
}

const main = new Main();
