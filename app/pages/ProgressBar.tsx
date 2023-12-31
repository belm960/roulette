import { LinearProgress } from "@mui/material";
import anime from "animejs";
import React from "react";
import { useEffect } from "react";
import { GameStages } from "./Global";

const ProgressBarRound = ( props : {stage : GameStages, maxDuration: number, currentDuration: number}) : JSX.Element => {
 
  useEffect(() => {
    console.log("stage : " + props.stage)
    console.log("maxDuration : " + props.maxDuration)
    console.log("currentDuration : " + props.currentDuration)
    var duration = (props.maxDuration-props.currentDuration)*1000
    console.log(duration);
    anime({
      targets: 'progress',
      value: [0,100],
      easing: 'linear',
      autoplay: true,
      duration: duration
    })
    if(props.stage !== GameStages.PLACE_BET){
       window.scrollTo({
        top: 0,
        behavior: 'smooth' 
      })
    }
    
  }, [props.stage, props.maxDuration, props.currentDuration]);
  return (
    <div>
      <div className="progressRoundTitle">
      {
        (props.stage === GameStages.PLACE_BET) ? "PLACE BET" :
        (props.stage === GameStages.NO_MORE_BETS)? "NO MORE BETS":
        (props.stage === GameStages.DRAW)?"DRAWING":
        (props.stage === GameStages.WINNERS)  ? " WINNERS"
        : "DRAWING"
      }
      </div>
      <progress color="green" className={"linearProgressRounds"} value="0" max="100" />
    </div>
  );
};

export default ProgressBarRound;
