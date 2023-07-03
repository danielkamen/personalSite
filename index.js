const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1920
canvas.height = 1080

const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
}

const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 120) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 120))
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1223) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      )
    }
  })
})

const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += 120) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 120))
}

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol !== 0) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4,
        })
      )
    }
  })
})

const gravity = .04

const player = new Player({
  position: {
    x: 100,
    y: 1000,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: './img/sprites/Idle.png',
  frameRate: 10,
  animations: {
    Idle: {
      imageSrc: './img/sprites/Idle.png',
      frameRate: 10,
      frameBuffer: 25,
    },
    IdleLeft: {
        imageSrc: './img/sprites/Idle.png',
        frameRate: 10,
        frameBuffer: 25,
      },
    Run: {
      imageSrc: './img/sprites/RunRight.png',
      frameRate: 8,
      frameBuffer: 25,
    },
    RunLeft: {
        imageSrc: './img/sprites/RunLeft.png',
        frameRate: 8,
        frameBuffer: 25,
      },
    Jump: {
      imageSrc: './img/sprites/Jump.png',
      frameRate: 3,
      frameBuffer: 25,
    },
    JumpLeft: {
        imageSrc: './img/sprites/Jump.png',
        frameRate: 3,
        frameBuffer: 25,
      },
    Fall: {
      imageSrc: './img/sprites/Land.png',
      frameRate: 9,
      frameBuffer: 25,
    },
    FallLeft: {
      imageSrc: './img/sprites/Land.png',
      frameRate: 9,
      frameBuffer: 25,
    },
   
    
    
  },
})

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
}

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/map.png',
})

const backgroundImageHeight = 1000



const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
}

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, scaledCanvas.width, scaledCanvas.height)

  c.save()
  c.scale(2, 2)
  c.translate(camera.position.x, camera.position.y)
  background.update()
   collisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update()
   })

   platformCollisionBlocks.forEach((block) => {
     block.update()
   })

  player.checkForHorizontalCanvasCollision()
  player.update()

  player.velocity.x = 0
  if (keys.d.pressed) {
    player.switchSprite('Run')
    player.velocity.x = 2
    player.lastDirection = 'right'
    player.shouldPanCameraToTheLeft({ canvas, camera })
  } else if (keys.a.pressed) {
    player.switchSprite('RunLeft')
    player.velocity.x = -2
    player.lastDirection = 'left'
    player.shouldPanCameraToTheRight({ canvas, camera })
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === 'right') player.switchSprite('Idle')
    else player.switchSprite('IdleLeft')
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas })
    if (player.lastDirection === 'right') player.switchSprite('Jump')
    else player.switchSprite('JumpLeft')
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ camera, canvas })
    if (player.lastDirection === 'right') player.switchSprite('Fall')
    else player.switchSprite('FallLeft')
  }

  c.restore()
}

animate()



window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case 'w':
        if (player.velocity.y === 0) {
      player.velocity.y = -4
        }
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }
})