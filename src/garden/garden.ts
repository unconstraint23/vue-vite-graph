import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";
import * as THREE from 'three'
export default class Garden {
   private mixer: any;
   private redcar: any;
   private curve: any;
    curveProgress: number = 0;
    scene: any;
    constructor(scene: any) {
        this.scene = scene
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        gltfLoader.setDRACOLoader(dracoLoader)
        dracoLoader.setDecoderPath("./src/public/draco/gltf/");
        gltfLoader.load("/src/model/city4.glb", (gltf: any) => {
            console.log(gltf);
          scene.add(gltf.scene);
          gltf.scene.traverse((child: any) => {
              if(child.name === "热气球") {
                 this.mixer = new THREE.AnimationMixer(child)
                const clip = gltf.animations[1]
                const action = this.mixer.clipAction(clip)
                action.play()
              }
              if(child.name === "汽车园区轨迹") {
                console.log(child)
                const line = child;
                line.visible = false;
                const points = []
                for(let i = line.geometry.attributes.position.count - 1; i >= 0 ;i--) {
                  points.push(
                  new THREE.Vector3(
                    line.geometry.attributes.position.getX(i),
                    line.geometry.attributes.position.getY(i),
                    line.geometry.attributes.position.getZ(i)
                  )
                );
                }
                this.curve = new THREE.CatmullRomCurve3(points)
                this.carAnimation()
              }
    
              if (child.name === "redcar") {
              console.log(child);
              this.redcar = child;
            }
          });
        })
    }
        carAnimation() {
        gsap.to(this, {
          curveProgress: 0.999,
          duration: 15,
          repeat: -1,
          ease: "none",
          yoyo: true,
          onUpdate: () => {
            const point = this.curve?.getPoint(this.curveProgress);
            this.redcar.position.set(point.x, point.y, point.z);
            if (this.curveProgress + 0.001 < 1) {
              const point = this.curve.getPoint(this.curveProgress + 0.001);
              this.redcar.lookAt(point);
            }
          },
        });
      }
      update(time: any) {
        this.mixer?.update(time)
      }
}