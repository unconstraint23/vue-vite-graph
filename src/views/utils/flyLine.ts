import * as THREE from "three";
import gsap from "gsap";
export default class FlyLine {
    private lineCurve
    private geometry
    private texture
    private material
    public mesh
    constructor() {
        let linePoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, 4, 0),
            new THREE.Vector3(10, 0, 0),
          ];
          // 1/创建曲线
          this.lineCurve = new THREE.CatmullRomCurve3(linePoints);
          // 2/根据曲线生成管道几何体
          this.geometry = new THREE.TubeGeometry(
            this.lineCurve,
            100,
            0.4,
            2,
            false
          );
          // 创建纹理
            const textloader = new THREE.TextureLoader();
            this.texture = textloader.load("/src/assets/textures/z_11.png");
            this.texture.repeat.set(1, 2);
            this.texture.wrapS = THREE.RepeatWrapping;
            this.texture.wrapT = THREE.MirroredRepeatWrapping;

            this.material = new THREE.MeshBasicMaterial({
            // color: 0xfff000,
            map: this.texture,
            transparent: true,
            });

           
          
              // 4/创建飞线物体
              this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
}
