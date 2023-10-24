document.addEventListener("DOMContentLoaded", () => {
  animation = window.requestAnimationFrame(runningGame)
  switchShipSpaceView()
  switchEnemyPositions()
})

document.addEventListener("keydown", handleControls)

document.addEventListener("keyup", handleControls)

let ship = document.querySelector("#ship")

let animation

let playerScore = 0

let imagesWithShipView = document.querySelectorAll(`[alt="shipView"]`)

let shipHealthInfo = document.querySelector("#shipInfoContainer")

let movement = {}

let bullets = document.querySelector("#bullets")

let lasersFromPlayer = []

let meteors = []

let lastLaser = 0

let enemyShips = []

let lastRedLaser = new Date().getTime() / 1000

let enemyLasers = []

let lastEnemyShip = new Date().getTime() / 1000

let lastMeteor = new Date().getTime() / 1000

let indexOfArrWithFrames = 0

let arrWithFramesForShip = [
  "starsFromShipF1.png",
  "starsFromShipF2.png",
  "starsFromShipF3.png"
]

function switchEnemyPositions() {
  setInterval(() => {
    leftOrRight = Math.floor(Math.random() * 2)
    willMove = parseInt(Math.floor(Math.random() * 10)) 
  }, 2000)
}


function handleControls(e) {
  let pressedKey = e.key.toLowerCase()
  if (!(pressedKey !== "w" && pressedKey !== "s" && pressedKey !== "a" && pressedKey !== "d" && pressedKey !== " ")) {
    if (e.type === "keydown") {
      movement[pressedKey] = true
    }
    if (e.type === "keyup") {
      movement[pressedKey] = false;
    }
  }
}

function switchShipSpaceView() {
  setInterval(() => {
    if (indexOfArrWithFrames === arrWithFramesForShip.length) {
      indexOfArrWithFrames = 0
    }
    imagesWithShipView.forEach(image => {
      image.src = arrWithFramesForShip[indexOfArrWithFrames]
    })
    indexOfArrWithFrames++
  }, 200)
}

function addEnemeyShips() {
  if (new Date().getTime() / 1000 - lastEnemyShip > 10 && enemyShips.length < 2) {
    let positionOnScreen = Math.floor(Math.random() * window.innerWidth - 150)
    lastEnemyShip = new Date().getTime() / 1000
    let enemyShip = document.createElement("img")
    enemyShip.src = "/shipPictures/enemyShip.png"
    enemyShip.style.position = "absolute"
    enemyShip.style.left = positionOnScreen + "px"
    enemyShip.style.top = 0 + "px"
    document.body.appendChild(enemyShip)
    enemyShips.push({
      enemyShip: enemyShip,
      health: 3
    })
  }
}

function addMeteors() {
  if (new Date().getTime() / 1000 - lastMeteor > 12) {
    let positionOnScreen = Math.floor(Math.random() * window.innerWidth - 150)
    lastMeteor = new Date().getTime() / 1000
    let meteor = document.createElement("img")
    meteor.src = "/spaceObsticals/meteor.png"
    meteor.style.position = "absolute"
    meteor.style.left = positionOnScreen + "px"
    meteor.style.top = 0 + "px"
    document.body.appendChild(meteor)
    meteors.push({
      meteor: meteor,
      health: 2,
      rotation: 90
    })
  }
}

let leftOrRight = Math.floor(Math.random() * 2)

let willMove = parseInt(Math.floor(Math.random() * 10))

function runningGame(timeSpan) {
  addMeteors()
  addEnemeyShips()
  if (movement.a) {
    ship.src = "/shipPictures/shipLeftTurn.png"
  }
  else if (movement.d) {
    ship.src = "/shipPictures/shipRightTurn.png"
  }
  else {
    ship.src = "/shipPictures/ship.png"
  }

  if (enemyShips.length) {
    let isTimeToFire = new Date().getTime() / 1000 - lastRedLaser > 2
    enemyShips.forEach((ship, i) => {
      if (ship.health <= 0) {
        playerScore += 200
        ship.enemyShip.remove()
        enemyShips.splice(i, 1)
      }
      let cordinatesOfEnemyShip = ship.enemyShip.getBoundingClientRect()
      if (leftOrRight && cordinatesOfEnemyShip.left < +window.innerWidth - 100) {
        ship.enemyShip.style.left = cordinatesOfEnemyShip.left + 1 + "px"
      }
      else if (cordinatesOfEnemyShip.left > 0) {
        ship.enemyShip.style.left = cordinatesOfEnemyShip.left - 1 + "px"
      }
      if (cordinatesOfEnemyShip.left <= 0) {
        leftOrRight = 1
      }
      else if (cordinatesOfEnemyShip.left >= +window.innerWidth - 100) {
        leftOrRight = 0
      }
      if (isTimeToFire) {
        lastRedLaser = new Date().getTime() / 1000
        let redLaser = document.createElement("img")
        redLaser.src = "lasersPictures/redLaser.png"
        redLaser.style.position = "absolute"
        redLaser.style.top = "113px"
        redLaser.style.left = cordinatesOfEnemyShip.left + 47 + "px"
        document.body.appendChild(redLaser)
        enemyLasers.push(redLaser)
      }
    })
  }

  if (enemyLasers.length) {
    enemyLasers.forEach((laser, i) => {
      let cordinatesOfCurrentLaser = laser.getBoundingClientRect()
      let cordinatesOfShip = ship.getBoundingClientRect()
      if (cordinatesOfCurrentLaser.top >= 774) {
        laser.remove()
        enemyLasers.splice(i, 1)
      }
      else {
        laser.style.top = cordinatesOfCurrentLaser.top + 12.5 + "px" 
        if (cordinatesOfCurrentLaser.top + 30 >= cordinatesOfShip.top &&
          cordinatesOfCurrentLaser.left >= cordinatesOfShip.left &&
          cordinatesOfCurrentLaser.left <= cordinatesOfShip.right
        ) {
          let currecntPic = window.getComputedStyle(shipHealthInfo, null).backgroundImage.split(`"`)[1].split("/")[4]

          if (currecntPic === "shipdInformationBar.png") {
            shipHealthInfo.style.backgroundImage = `url('shipInfo/shipInformationMinus1Health.png')`
          }
          else if (currecntPic === "shipInformationMinus1Health.png") {
            shipHealthInfo.style.backgroundImage = `url('shipInfo/shipInformationMinus2Health.png')`
          }
          else if (currecntPic === "shipInformationMinus2Health.png") {
            document.querySelector("#endScreen").style.display = "inline-block"
            document.querySelector("#score").textContent = `Score: ${playerScore}`
            throw "Game over"
          }
          laser.remove()
          enemyLasers.splice(i, 1)
        }
      }
    })
  }

  if (lasersFromPlayer.length) {
    lasersFromPlayer.forEach((laser, i) => {
      if (laser.getBoundingClientRect().top <= 0) {
        laser.remove()
        lasersFromPlayer.splice(i, 1)
      }
      laser.style.top = laser.getBoundingClientRect().top + -6 + "px"
      let cordinatesOfCurrentLaser = laser.getBoundingClientRect()
      meteors.forEach((meteor) => {
        let cordinatesOfCurrentMeteor = meteor.meteor.getBoundingClientRect()
        if (cordinatesOfCurrentLaser.top >= cordinatesOfCurrentMeteor.top && cordinatesOfCurrentLaser.bottom <= cordinatesOfCurrentMeteor.bottom
          && cordinatesOfCurrentLaser.left >= cordinatesOfCurrentMeteor.left && cordinatesOfCurrentLaser.right <= cordinatesOfCurrentMeteor.right) {
          laser.remove()
          lasersFromPlayer.splice(i, 1)
          --meteor.health
        }
      })
      enemyShips.forEach(ship => {
        let cordinatesOfEnemyShip = ship.enemyShip.getBoundingClientRect()
        if (cordinatesOfCurrentLaser.left >= cordinatesOfEnemyShip.left && cordinatesOfCurrentLaser.right <= cordinatesOfEnemyShip.right) {
          if (willMove > 6) {
            if (leftOrRight && cordinatesOfEnemyShip.left < +window.innerWidth - 100) {
              ship.enemyShip.style.left = cordinatesOfEnemyShip.left + 15 + "px"
              ship.enemyShip.src = `shipPictures/enemyShipTurningRight.png`
            }
            else if (cordinatesOfEnemyShip.left > 0) {
              ship.enemyShip.style.left = cordinatesOfEnemyShip.left - 15 + "px"
              ship.enemyShip.src = `shipPictures/enemyShipTurningLeft.png`
            }
          }
          ship.enemyShip.src = `shipPictures/enemyShip.png`
          if (cordinatesOfCurrentLaser.top >= cordinatesOfEnemyShip.top && cordinatesOfCurrentLaser.bottom <= cordinatesOfEnemyShip.bottom) {
            ship.health--
            laser.remove()
            lasersFromPlayer.splice(i, 1)
          }
        }
      })
    })
  }
  if (meteors.length) {
    meteors.forEach((meteor, i) => {
      if (meteor.meteor.getBoundingClientRect().top === 694) {
        meteor.meteor.remove()
        meteors.splice(i, 1)
      }
      if (meteor.health <= 0) {
        playerScore += 100
        meteor.meteor.remove()
        meteors.splice(i, 1)
      }
      meteor.meteor.style.top = meteor.meteor.getBoundingClientRect().top + 1 + "px"
      let cordinatesOfMeteor = meteor.meteor.getBoundingClientRect()
      let cordinatesOfShip = ship.getBoundingClientRect()
      console.log(`Meteor: left ${cordinatesOfMeteor.left} right ${cordinatesOfMeteor.right} top ${cordinatesOfMeteor.top} bottom${cordinatesOfMeteor.bottom}`);
      console.log(`Ship: left ${cordinatesOfShip.left} right ${cordinatesOfShip.right} top ${cordinatesOfShip.top} bottom ${cordinatesOfShip.bottom}`);

      if (cordinatesOfMeteor.top + 90 >= cordinatesOfShip.top
        && (cordinatesOfMeteor.left <= cordinatesOfShip.right && cordinatesOfMeteor.right >= cordinatesOfShip.left && cordinatesOfMeteor.bottom <= cordinatesOfShip.bottom)) {
        let currecntPic = window.getComputedStyle(shipHealthInfo, null).backgroundImage.split(`"`)[1].split("/")[4]

        if (currecntPic === "shipdInformationBar.png") {
          shipHealthInfo.style.backgroundImage = `url('shipInfo/shipInformationMinus1Health.png')`
        }
        else if (currecntPic === "shipInformationMinus1Health.png") {
          shipHealthInfo.style.backgroundImage = `url('shipInfo/shipInformationMinus2Health.png')`
        }
        else if (currecntPic === "shipInformationMinus2Health.png") {
          document.querySelector("#endScreen").style.display = "inline-block"
          document.querySelector("#score").textContent = `Score: ${playerScore}`
          throw "Game over"
         
        }
        meteor.meteor.remove()
        meteors.splice(i, 1)
      }
    })
  }

  if (movement[" "] && parseInt(timeSpan / 1000) !== parseInt(lastLaser / 1000)) {
    lastLaser = timeSpan
    bullets.textContent = bullets.textContent - 1

    let blueLaser = document.createElement("img")
    let blueLaser2 = document.createElement("img")
    blueLaser.src = "/lasersPictures/blueLaser.png"
    blueLaser2.src = "/lasersPictures/blueLaser.png"

    document.body.appendChild(blueLaser)
    document.body.appendChild(blueLaser2)

    blueLaser.style.position = "absolute"
    blueLaser.style.top = ship.getBoundingClientRect().top + -3 + "px"
    blueLaser.style.left = ship.getBoundingClientRect().left + 1 + "px"

    blueLaser2.style.position = "absolute"
    blueLaser2.style.top = ship.getBoundingClientRect().top + -3 + "px"
    blueLaser2.style.left = ship.getBoundingClientRect().left + 93 + "px"

    lasersFromPlayer.push(blueLaser)
    lasersFromPlayer.push(blueLaser2)
  }
  if (movement.w) {
    if (ship.getBoundingClientRect().top > 0) {
      ship.style.top = ship.getBoundingClientRect().top - 2 + "px"
    }
  }
  if (movement.s) {
    if (ship.getBoundingClientRect().top < 695) {
      ship.style.top = ship.getBoundingClientRect().top + 2 + "px"
    }
  }
  if (movement.a) {
    if (ship.getBoundingClientRect().left > 0) {
      ship.style.left = ship.getBoundingClientRect().left - 2 + "px"
    }
  }
  if (movement.d) {
    if (ship.getBoundingClientRect().left + 101 < +window.innerWidth) {
      ship.style.left = ship.getBoundingClientRect().left + 2 + "px"
    }
  }
  animation = window.requestAnimationFrame(runningGame)
}
