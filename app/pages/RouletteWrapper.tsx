import React from "react";
import Wheel from "./Wheel";
import { RouletteWrapperState, GameStages } from "./Global";
import { Timer } from "easytimer.js";


class RouletteWrapper extends React.Component<any, any> {
  
  rouletteWheelNumbers = [ 
    0, 32, 15, 19, 4, 21, 2, 25,
    17, 34, 6, 27, 13, 36, 11,
    30, 8, 23,10, 5, 24, 16, 33,
    1, 20, 14, 31, 9, 22, 18, 29,
    7, 28, 12, 35, 3, 26
  ];


  timer = new Timer();
  numberRef = React.createRef<HTMLInputElement>();
  state: RouletteWrapperState = {
    rouletteData: {
      numbers: this.rouletteWheelNumbers
    },
    chipsData: {
      selectedChip: null,
      placedChips: new Map()
    },
    number: {
      next: null
    },
    winners: [],
    history: [],
    stage: GameStages.NONE,
    username: "",
    endTime: 0,
    progressCountdown: 0,
    time_remaining: 0,
  };
  socketServer: any;
  animateProgress: any;

  blackNumbers = [ 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 29, 28, 31, 33, 35 ];
  constructor(props: { username: string }) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>
          <table className={"rouletteWheelWrapper"}>
            <tr>
            <td className={"winnersBoard"}>
            <div className={"winnerItemHeader hideElementsTest"} >WINNERS</div>
              { 
                this.state.winners.map((entry, index) => {
                    return (<div className="winnerItem">{index+1}. {entry.username} won {entry.sum}$</div>);
                })
              }
            </td>
            <td><Wheel rouletteData={this.state.rouletteData} number={this.state.number} /></td>
            <td>
              <div className={"winnerHistory hideElementsTest"}>
              {
                this.state.history.map((entry, index) => {
                  if (entry === 0) {
                    return (<div className="green">{entry}</div>);
                  } else if (this.blackNumbers.includes(entry)) {
                    return (<div className="black">{entry}</div>);
                  } else {
                    return (<div className="red">{entry}</div>);
                  }
                })
              }
              </div>
            </td>
              
            </tr>
          </table>
        </div>
      </div>
    );
  }
}
export default RouletteWrapper;
