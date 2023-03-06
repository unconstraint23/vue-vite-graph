<template>
    <div>

    </div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted } from 'vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import gsap from "gsap";
import * as dat from 'dat.gui';
onMounted(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 0, 10)
    scene.add(camera)
    // 添加物体
    // 创建几何体
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00
    })
    // 根据几何体和材质创建物体
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    scene.add(cube)
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
    // 设置渲染尺寸的大小
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
    const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
// let animate = gsap.to(cube.position, {
//     x: 5,
//     duration: 5,
//   ease: "power1.inOut",
//   //   设置重复的次数，无限次循环-1
//   repeat: -1,
//   //   往返运动
//   yoyo: true,
//   //   delay，延迟2秒运动
//   delay: 2,
//   onComplete: () => {
//     console.log("动画完成");
//   },
//   onStart: () => {
//     console.log("动画开始");
//   }
// })
const gui = new dat.GUI();
gui.add(cube.position, "x").min(0).max(5).step(0.01).onFinishChange((value: any) => {
  console.log("stop",value)
})
const styleParams = {
  color: "#ff0",
  fn: () => {
    gsap.to(cube.position, {
    x: 5,
    duration: 5,
  ease: "power1.inOut",
  //   设置重复的次数，无限次循环-1
  repeat: -1,
  //   往返运动
  yoyo: true,
  //   delay，延迟2秒运动
  delay: 2,
  onComplete: () => {
    console.log("动画完成");
  },
  onStart: () => {
    console.log("动画开始");
  }
})
  }
}
gui.addColor(styleParams, "color").onChange((value: any) => {
    cube.material.color.set(value)
})
gui.add(cube, "visible").name("是否显示")
// gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, ease: "power1.inOut" });
gui.add(styleParams, "fn").name("点击运动")
let folder = gui.addFolder("设置立方体")
folder.add(cube.material, "wireframe")
window.addEventListener("dblclick", () => {
  //   console.log(animate1);
  // if (animate.isActive()) {
  //   //   暂停
  //   animate.pause();
  // } else {
  //   //   恢复
  //   animate.resume();
  // }
});
  // 监听画面的变化
  window.addEventListener("resize",() => {
    camera.aspect = window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.setPixelRatio(window.devicePixelRatio)
  })
    function render(time?: any) {
        
        // let t = ((time ?? 0) / 1000) % 5
        // cube.position.x = t
        
       renderer.render(scene, camera) 
       requestAnimationFrame(render)
    }
    render()
}) 

</script>