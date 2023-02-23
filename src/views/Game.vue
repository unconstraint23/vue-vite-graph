<template>
    <div>
         
    </div>
  </template>
  
  <script setup lang="ts">
 import * as PIXI from 'pixi.js'
  import drangle from '../assets/drangle.png'
  import google from '../assets/google.png'
  const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resolution: window.devicePixelRatio || 1,
      antialias: true //抗锯齿
  })
      document.body.appendChild(app.view as any)
     
    
      const container = new PIXI.Container()
      
      app.stage.addChild(container)
      const baseTexture = PIXI.BaseTexture.from(google)
     const dinoTexture = new PIXI.Texture(
        baseTexture,
        new PIXI.Rectangle(846, 0, 48, 50)
     )
     const dino = new PIXI.Sprite(dinoTexture)
     dino.visible = false
     container.addChild(dino)
     
     const runTextures = []
     for(let i = 0; i < 2; i++) {
        runTextures.push(
            new PIXI.Texture(
                baseTexture,
                new PIXI.Rectangle(842 + (i+2) * 46,0,46,50)
            )
        )
     }
     const runAnimation = new PIXI.AnimatedSprite(runTextures)
     runAnimation.animationSpeed = 0.1
     runAnimation.play()
     container.addChild(runAnimation)
  </script>
  
  <style>
  
  </style>