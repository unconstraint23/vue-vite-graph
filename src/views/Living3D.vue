<template>
    <div ref="containerRef">
     
    </div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted, ref } from 'vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
const containerRef = ref<any>(null)
const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 0, 10)
    scene.add(camera)
// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
    
const render = (time?: any) => {
        
       renderer.render(scene, camera) 
       requestAnimationFrame(render)
    }

onMounted(() => {
    


    // 贴图必须宽高相等
    
    // blockTexture.offset.x = 0.5
    // blockTexture.offset.y = 0.5
   
    // const geometry = new THREE.BoxGeometry(10, 10, 10)
   
   

   

    // let arr = ["4_l.jpg","4_r.jpg","4_u.jpg","4_d.jpg","4_b.jpg","4_f.jpg"]
    // let boxMaterial: any[] = []
    // arr.forEach(item => {
    //     let textrue = new THREE.TextureLoader().load(`./src/assets/living/${item}`)
    //     if(item === "4_u.jpg" || item === "4_d.jpg") {
    //         textrue.rotation = Math.PI
    //         textrue.center = new THREE.Vector2(0.5, 0.5)
    //     }
    //     boxMaterial.push(new THREE.MeshBasicMaterial({map: textrue}))
    // })
    //  // 根据几何体和材质创建物体
    //  const cube = new THREE.Mesh(geometry, boxMaterial)
    //     cube.geometry.scale(1, 1, -1)
    // scene.add(cube)
   const sphere = new THREE.SphereGeometry(5, 32, 32)
   const rbgeLoader = new RGBELoader()
   rbgeLoader.load("./src/assets/hdr/Living.hdr",(textrue) => {
        const material = new THREE.MeshBasicMaterial({map: textrue})
        const sphereCube = new THREE.Mesh(sphere, material)
        sphereCube.geometry.scale(1, 1, -1)
        scene.add(sphereCube)
   })

    renderer.shadowMap.enabled = true
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    
    const controls = new OrbitControls(camera, renderer.domElement)
    const axesHelper = new THREE.AxesHelper(30);
    scene.add(axesHelper);
    
    
    render()
  
}) 

</script>