
import { loadFBX } from './load'
export class City {

    public scane: any 
    public camera
    public controls
    public tweenPosition: any
    public tweenRotation: any
    constructor(scane: any, camera: any, controls: any) {
        this.scane = scane;
        this.camera = camera;
        this.controls = controls;

        this.tweenPosition = null;
        this.tweenRotation = null;
        this.loadCity()
    }
    loadCity() {
        // 加载模型，并且渲染到画布上
        loadFBX('/src/model/beijing.fbx').then((object: any) => {
          object.traverse((child: any) => {
            console.log(child)
            if (child.isMesh) {
              
            }
          })
    
         
        })
      }
      start() {

      }
}