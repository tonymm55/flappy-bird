import React from "react";
import { View } from "react-native";

const Bird = ({birdBottom, birdLeft}) => {
    const birdWidth = 60
    const birdHeight = 60 //middle of height =30, hence the 30 references throughout the code. Hardcoded!

    return (
        <View style={{
            position: "absolute",
            backgroundColor: "blue",
            width: birdWidth,
            height: birdHeight,
            left: birdLeft - (birdWidth/2),
            bottom: birdBottom - (birdHeight/2),
        }}/>
    )
}

export default Bird
