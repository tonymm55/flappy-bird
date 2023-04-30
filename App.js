import React, { useState, useEffect } from  "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import Bird from "./components/Bird"
import Obstacles from "./components/Obstacles";

export default function App() {
  const screenWidth = Dimensions.get("screen").width
  const screenHeight = Dimensions.get("screen").height
  const birdLeft = screenWidth / 2 
  const [birdBottom, setBirdBottom] = useState(screenHeight/2)
  const [obstaclesLeft, setObstaclesLeft] = useState(screenWidth)
  const [obstaclesLeftTwo, setObstaclesLeftTwo] = useState(screenWidth + screenWidth/2 + 10)
  const [obstaclesNegHeight, setObstaclesNegHeight] = useState(0)
  const [obstaclesNegHeightTwo, setObstaclesNegHeightTwo] = useState(0)
  const obstacleWidth = 60
  const obstacleHeight = 300
  const gap = 200
  const gravity = 3.5
  let gameTimerId 
  let obstaclesLeftTimerId
  let obstaclesLeftTimerIdTwo
  
  //start bird falling animation
  useEffect(() => {
    if (birdBottom > 0 ) {
      gameTimerId = setInterval(() => {
        setBirdBottom(birdBottom => birdBottom - gravity)
      }, 20)

      return () => {
        clearInterval(gameTimerId)
      }
    }
  }, [birdBottom])
  
  
  //start first obstacles
  useEffect(() => {
    if (obstaclesLeft > -obstacleWidth) {
      obstaclesLeftTimerId = setInterval(() => {
        setObstaclesLeft(obstaclesLeft => obstaclesLeft - 5)
      }, 30)
      return () => {
        clearInterval(obstaclesLeftTimerId)
      }
    } else {
      setObstaclesLeft(screenWidth)
      setObstaclesNegHeight( - Math.random() * 100)
    }
  }, [obstaclesLeft])
  
  //start second obstacles
  useEffect(() => {
    if (obstaclesLeftTwo > -obstacleWidth) {
      obstaclesLeftTimerIdTwo = setInterval(() => {
        setObstaclesLeftTwo(obstaclesLeftTwo => obstaclesLeftTwo - 5)
      }, 30)
      return () => {
        clearInterval(obstaclesLeftTimerIdTwo)
      }
    } else {
      setObstaclesLeftTwo(screenWidth)
      setObstaclesNegHeightTwo( - Math.random() * 100)
    }
  }, [obstaclesLeftTwo])

  //check for collisions
  useEffect(() => {
    if (
    ((birdBottom < (obstaclesNegHeight + obstacleHeight + 30) ||
    birdBottom > (obstaclesNegHeight + obstacleHeight + gap -30)) &&
    (obstaclesLeft > screenWidth/2 -30 && obstaclesLeft < screenWidth/2 + 30) 
    )
    ||
    ((birdBottom < (obstaclesNegHeightTwo + obstacleHeight + 30) ||
    birdBottom > (obstaclesNegHeightTwo + obstacleHeight + gap -30)) &&
    (obstaclesLeftTwo > screenWidth/2 -30 && obstaclesLeftTwo < screenWidth/2 + 30)
    )
    )
    {
      console.log("Game Over!");
      gameOver()
    }
  })

  const gameOver = () => {
    clearInterval(gameTimerId)
    clearInterval(obstaclesLeftTimerId)
    clearInterval(obstaclesLeftTimerIdTwo)
  }

  return (
    <View style={styles.container}>
      {/* <Text className="flappy-bird-text">Flappy Bird!</Text> */}
      <Bird 
        birdBottom={birdBottom}
        birdLeft={birdLeft}
        />
      <Obstacles
        color={"green"}
        obstacleWidth={obstacleWidth}
        obstacleHeight={obstacleHeight}
        obstaclesLeft={obstaclesLeft}
        randomBottom={obstaclesNegHeight}
        gap={gap}
      />
      <Obstacles
        color={"red"}
        obstacleWidth={obstacleWidth}
        obstacleHeight={obstacleHeight}
        obstaclesLeft={obstaclesLeftTwo}
        randomBottom={obstaclesNegHeightTwo}
        gap={gap}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
