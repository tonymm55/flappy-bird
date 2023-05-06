import React, { useState, useEffect } from  "react";
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import Bird from "./components/Bird"
import Obstacles from "./components/Obstacles";
import Scores from "./components/Scores";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Expo } from 'expo';

export default function App() {
  const screenWidth = Dimensions.get("screen").width
  const screenHeight = Dimensions.get("screen").height
  const birdLeft = screenWidth / 2 
  const [birdBottom, setBirdBottom] = useState(screenHeight/2)
  const [obstaclesLeft, setObstaclesLeft] = useState(screenWidth)
  const [obstaclesLeftTwo, setObstaclesLeftTwo] = useState(screenWidth + screenWidth/2 + 10)
  const [obstaclesNegHeight, setObstaclesNegHeight] = useState(0)
  const [obstaclesNegHeightTwo, setObstaclesNegHeightTwo] = useState(0)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const obstacleWidth = 60
  const obstacleHeight = 350 
  const gap = 200
  const gravity = 3
  let gameTimerId 
  let obstaclesLeftTimerId
  let obstaclesLeftTimerIdTwo
  const [isGameOver, setIsGameOver] = useState(false)

  const setRestart = () => {
    setIsGameOver(false);
    setScore(0);
    AsyncStorage.getItem('highScore').then((value) => {
      const prevHighScore = value !== null ? parseInt(value) : 0;
      setHighScore(Math.max(prevHighScore, score));
    });
    setBirdBottom(screenHeight / 2);
    setObstaclesLeft(screenWidth);
    setObstaclesNegHeight(-Math.random() * 100);
    setObstaclesLeftTwo(screenWidth + screenWidth / 2);
    setObstaclesNegHeightTwo(-Math.random() * 100);
  };

  // Load high score from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('highScore').then((value) => {
      if (value !== null) {
        setHighScore(parseInt(value));
      }
    });
  }, []);

  //start bird falling 
  useEffect(() => {
    if (birdBottom > 0 ) {
      gameTimerId = setInterval(() => {
        setBirdBottom(birdBottom => birdBottom - gravity)
      }, 30)

      return () => {
        clearInterval(gameTimerId)
      }
    }
  }, [birdBottom])
  // console.log(birdBottom)

  const jump = () => {
    if (!isGameOver && (birdBottom < screenHeight)) {
      setBirdBottom(birdBottom => birdBottom + 50)
      console.log('jumped')
    }
  }
  
  //start first obstacles
  useEffect(() => {
    if (obstaclesLeft > -obstacleWidth) {
      obstaclesLeftTimerId = setInterval(() => {
        setObstaclesLeft(obstaclesLeft => obstaclesLeft - 5)
      }, 20)
      return () => {
        clearInterval(obstaclesLeftTimerId)
      }
    } else {
      setObstaclesLeft(screenWidth)
      setObstaclesNegHeight( - Math.random() * 100)
      setScore(score => score + 1)
    }
  }, [obstaclesLeft])
  
  //start second obstacles
  useEffect(() => {
    if (obstaclesLeftTwo > -obstacleWidth) {
      obstaclesLeftTimerIdTwo = setInterval(() => {
        setObstaclesLeftTwo(obstaclesLeftTwo => obstaclesLeftTwo - 5)
      }, 20)
      return () => {
        clearInterval(obstaclesLeftTimerIdTwo)
      }
    } else {
      setObstaclesLeftTwo(screenWidth)
      setObstaclesNegHeightTwo( - Math.random() * 100)
      setScore(score => score + 1)
    }
  }, [obstaclesLeftTwo])

  //check for collisions
  useEffect(() => {
    if (
    ((birdBottom < (obstaclesNegHeight + obstacleHeight + 30) ||
    birdBottom > (obstaclesNegHeight + obstacleHeight + gap -30)) &&
    (obstaclesLeft > screenWidth/2 -30 && obstaclesLeft < screenWidth/2 + 30) //30 is centre if obstacle width. Hard coded 30s.
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
    setIsGameOver(true)

    //check if current score is higher than high score in AsyncStorage
    AsyncStorage.getItem('highScore').then((value) => {
      if (value === null || score > parseInt(value)) {
        //Update high score and store it in AsyncStorage
        AsyncStorage.setItem('highScore', score.toString());
        setHighScore(score);
      }
    });
  };

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        {isGameOver ? (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverText}>
              Game Over ☠️{"\n"}
            </Text>
            <Text style={styles.gameOverScores}>
              Score: {score}{"\n"}High Score: {highScore}
            </Text>
            <TouchableOpacity onPress={setRestart}> 
              <View style={styles.restartButton}>
                <Text style={styles.restartButtonText}>Restart Game 🚀</Text>
              </View>
            </TouchableOpacity>
      </View>
        ) : (
          <>
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
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
  },
  restartButton: {
    marginTop: 70,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
  },
  restartButtonText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  gameOverText: {
    color: "red",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 0,
  },
  gameOverScores: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 0,
  },
})

