<template>
  <div>
       
  </div>
</template>

<script setup lang="ts">
import { onMounted } from '@vue/runtime-core'
import * as PIXI from 'pixi.js'
import car from '../assets/car.jpg'
import displacement from '../assets/displacement.png'
import { ShockwaveFilter } from 'pixi-filters'
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
    antialias: true //抗锯齿
})
    document.body.appendChild(app.view as any)
    const textture = PIXI.Texture.from(car)
    const sprite = new PIXI.Sprite(textture)
    sprite.width = app.screen.width
    sprite.height = app.screen.height
    const container = new PIXI.Container()
    container.addChild(sprite)
    app.stage.addChild(container)
    const text = new PIXI.Text("前端已死", {
        fontFamily: "Arial",
        fontSize: 140,
        fill: 0xffffff,
        align: "center",
        dropShadow: true,
        dropShadowColor: "#000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 2,
        dropShadowDistance: 20
    })
    text.x = app.screen.width / 2
    text.y = app.screen.height / 2
    text.anchor.set(0.5)
    container.addChild(text)
    const displacementSprite = PIXI.Sprite.from(displacement)
    displacementSprite.scale.set(5)
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    const displacementFilter = new PIXI.DisplacementFilter(displacementSprite)
    container.addChild(displacementSprite)
    // 震荡滤镜
    const shockwaveFilter = new ShockwaveFilter([
        Math.random() * app.screen.width, Math.random() * app.screen.height
    ],
    {
        radius: 160,
        wavelength: 65,
        amplitude: 105,
        speed: 300
    },0
    )
    const shockwaveFilter2 = new ShockwaveFilter([
        Math.random() * app.screen.width, Math.random() * app.screen.height
    ],
    {
        radius: 160,
        wavelength: 65,
        amplitude: 105,
        speed: 300
    },0
    )
    const shockwaveFilter3 = new ShockwaveFilter([
        Math.random() * app.screen.width, Math.random() * app.screen.height
    ],
    {
        radius: 80,
        wavelength: 40,
        amplitude: 40,
        speed: 100
    },0
    )
    container.filters = [displacementFilter,shockwaveFilter as any,shockwaveFilter2 as any, shockwaveFilter3 as any]
    // onMounted(() => {
    //     animate()
    // })
    // const animate = () => {
    //     displacementSprite.x += .8
    //     displacementSprite.y += .2
    //     requestAnimationFrame(animate)
    // }
    app.ticker.add((delta) => {
        displacementSprite.x += 4
        displacementSprite.y += 4
        createWave(shockwaveFilter, 1)
        createWave(shockwaveFilter2, 2)
        createWave(shockwaveFilter3, 3)
    })
    function createWave(waveFilter: any, resetTime: any) {
    
        waveFilter.time += 0.03
        if(waveFilter.time > resetTime) {
            waveFilter.time = 0
            waveFilter.center = [
                Math.random() * app.screen.width,
                Math.random() * app.screen.height
            ]
        }
    }
    (app.view as any).addEventListener("click", (e: any) => {
            console.log(e)
            shockwaveFilter3.center = [e.clientX, e.clientY]
            shockwaveFilter3.time = 0
    })
</script>

<style>

</style>