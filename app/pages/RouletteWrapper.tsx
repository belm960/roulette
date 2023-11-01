"use client";
import React from "react";
import Wheel from "./Wheel";
import Board from "./Board";
import { useEffect } from "react";
import { Item, PlacedChip, RouletteWrapperState, GameData, GameStages, Tickets, ValueType } from "./Global";
var classNames = require("classnames");
import { io } from "socket.io-client";
import ProgressBarRound from "./ProgressBar";
import { Text, Box, Button, Card, Flex, ScrollArea, Tabs, Table, Dialog, DialogClose, Inset, TableBody, Avatar } from "@radix-ui/themes";
import { TableFooter } from "@mui/material";

// var singleRotation = 0

// var r1 = singleRotation * 0 // 0
// var r2 = singleRotation * 2 // 19.45..

class RouletteWrapper extends React.Component<any, any> {

  rouletteWheelNumbers = [ 
    0, 32, 15, 19, 4, 21, 2, 25,
    17, 34, 6, 27, 13, 36, 11,
    30, 8, 23,10, 5, 24, 16, 33,
    1, 20, 14, 31, 9, 22, 18, 29,
    7, 28, 12, 35, 3, 26
  ];
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
  balance = 100;
  blackNumbers = [ 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 29, 28, 31, 33, 35 ];
  tickets: Tickets[] = new Array()
  constructor(props: { username: string }) {
    super(props);

    console.log(props.username)
    this.onSpinClick = this.onSpinClick.bind(this);
    this.onChipClick = this.onChipClick.bind(this);
    this.getChipClasses = this.getChipClasses.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.placeBet = this.placeBet.bind(this);
    this.clearBet = this.clearBet.bind(this);

    this.socketServer = io("https://roulette-backend.onrender.com:8000");
  }
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  componentDidMount() {
    console.log("component mounted")
    this.socketServer.open();
    this.socketServer.on('stage-change', (data: string) => {
      var gameData = JSON.parse(data) as GameData
      if (gameData.stage !== GameStages.PLACE_BET && gameData.stage !== GameStages.NO_MORE_BETS){
        gameData.wins.forEach((win)=>
        {
          if (win.username === this.props.username){
            this.balance =win.balance
            
          }
          if (gameData.stage===GameStages.WINNERS){
            this.tickets = new Array()
          }
        })
      
      }
      console.log(gameData)

      this.setGameData(gameData)      
    });
    this.socketServer.on("connect", (socket: { on: (arg0: string, arg1: (data: string) => void) => void; }) => {
        console.log("hereee2");
        this.setState({username: this.props.username}, () => {
        this.socketServer.emit("enter", this.state.username);
      });
    });
  }
  componentWillUnmount() {
    this.socketServer.close();
  }
  setGameData(gameData: GameData) { 
    if (gameData.stage === GameStages.NO_MORE_BETS) { // PLACE BET from 25 to 35
      var endTime = 60;
      var nextNumber = gameData.value
      this.setState({ endTime: endTime, progressCountdown: endTime - gameData.time_remaining, number: { next: nextNumber }, stage: gameData.stage, time_remaining: gameData.time_remaining}); 
    }
    else if (gameData.stage === GameStages.DRAW) { // PLACE BET from 25 to 35
      var endTime = 70;
      var nextNumber = gameData.value
      this.setState({ endTime: endTime, progressCountdown: endTime - gameData.time_remaining, number: { next: nextNumber }, stage: gameData.stage, time_remaining: gameData.time_remaining}); 
    } else if (gameData.stage === GameStages.WINNERS) { // PLACE BET from 35 to 59
      var endTime = 79;
      if (gameData.wins.length > 0) {
        this.setState({ endTime: endTime, progressCountdown: endTime - gameData.time_remaining,winners: gameData.wins,stage: gameData.stage, time_remaining: gameData.time_remaining, history: gameData.history }); 
      } else {
        this.setState({ endTime: endTime, progressCountdown: endTime - gameData.time_remaining, stage: gameData.stage, time_remaining: gameData.time_remaining, history: gameData.history }); 
     }
    } else { // PLACE BET from 0 to 25
      var endTime = 50;
      this.setState({endTime: endTime, progressCountdown: endTime - gameData.time_remaining, stage: gameData.stage , time_remaining: gameData.time_remaining}); 
    }
  }
  onCellClick(item: Item) {
    //console.log("----");
    var currentChips = this.state.chipsData.placedChips;

    var chipValue = this.state.chipsData.selectedChip;
    if (chipValue === 0 || chipValue === null) {
      return;
    }
    let currentChip = {} as PlacedChip;
    currentChip.item = item;
    currentChip.sum = chipValue;

    console.log(this.state.chipsData.placedChips);
    console.log(item);
    if (currentChips.get(item) !== undefined) {
      currentChips.delete(item);
    }else{
        currentChips.set(item, currentChip);
    }
    
    this.setState({
      chipsData: {
        selectedChip: this.state.chipsData.selectedChip,
        placedChips: currentChips
      }
    });
  }
  onChipClick(chip: number | null) {
    if (chip != null) {
      this.setState({
        chipsData: {
          selectedChip: chip,
          placedChips: new Map()
        }
      });
    }
  }
  getChipClasses(chip: number) {
    var cellClass = classNames({
      chip_selected: chip === this.state.chipsData.selectedChip,
      "chip-100": chip === 100,
      "chip-20": chip === 20,
      "chip-10": chip === 10,
      "chip-5": chip === 5
    });

    return cellClass;
  }
  onSpinClick() {
    var nextNumber = this.numberRef!.current!.value;
    if (nextNumber != null) {
      this.setState({ number: { next: nextNumber } });
    }
  }
  oddCalculator(){

  }
  showBet() { 
    var placedChipsMap = this.state.chipsData.placedChips
    var chips: PlacedChip[] = new Array()
    for(let key of Array.from( placedChipsMap.keys()) ) {
      var chipsPlaced = placedChipsMap.get(key) as PlacedChip
      chips.push(chipsPlaced);}
      return chips;
    }
  placeBet() { 
    var placedChipsMap = this.state.chipsData.placedChips
    var chips: PlacedChip[] = new Array()
    var odd = 0;
    var numbers= new Array();
    for(let key of Array.from( placedChipsMap.keys()) ) {

      var chipsPlaced = placedChipsMap.get(key) as PlacedChip
      var placedChipType = chipsPlaced.item.type
      chips.push(chipsPlaced);
      var chipOdd = 0;
          if (placedChipType === ValueType.NUMBER)
          {
              chipOdd=1
          }
          else if (placedChipType === ValueType.BLACK)
          { // if bet on black and win
              chipOdd=18
          }
          else if (placedChipType === ValueType.RED)
          { // if bet on red and win
              chipOdd=18
          }
          else if (placedChipType === ValueType.NUMBERS_1_18)
          { // if number is 1 to 18
              chipOdd=18
          }
          else if (placedChipType === ValueType.NUMBERS_19_36)
          { // if number is 19 to 36
              chipOdd=18
          }
          else if (placedChipType === ValueType.NUMBERS_1_12)
          { // if number is within range of row1
              chipOdd=12
          }
          else if (placedChipType === ValueType.NUMBERS_2_12)
          { // if number is within range of row2
              chipOdd=12
          }
          else if (placedChipType === ValueType.NUMBERS_3_12)
          { // if number is within range of row3
              chipOdd=12
          }
          else if (placedChipType === ValueType.EVEN)
          { // if number even
                chipOdd=18
            } 
          else if (placedChipType === ValueType.ODD)
          {// if number is odd
                chipOdd=18
          }
      odd+=chipOdd
   }
   var ball = this.balance
   ball-=(chips[0].sum*chips.length)
   if(ball<0){
      alert("Insufficient Balance")
   }else{
    this.balance-=chips[0].sum*chips.length
    console.log(odd)
    this.tickets.push({chip: chips,odd: odd,balance: this.balance})
    console.log(this.tickets)
    this.socketServer.emit("place-bet", JSON.stringify(this.tickets));
   }
   this.clearBet();
   
  }

  calculateOdd(){
      var placedChipsMap = this.state.chipsData.placedChips
      var odd = 0;
      for(let key of Array.from( placedChipsMap.keys()) ) {
  
        var chipsPlaced = placedChipsMap.get(key) as PlacedChip
        var placedChipType = chipsPlaced.item.type
        var chipOdd = 0;
            if (placedChipType === ValueType.NUMBER)
            {
                chipOdd=1
            }
            else if (placedChipType === ValueType.BLACK)
            { // if bet on black and win
                chipOdd=18
            }
            else if (placedChipType === ValueType.RED)
            { // if bet on red and win
                chipOdd=18
            }
            else if (placedChipType === ValueType.NUMBERS_1_18)
            { // if number is 1 to 18
                chipOdd=18
            }
            else if (placedChipType === ValueType.NUMBERS_19_36)
            { // if number is 19 to 36
                chipOdd=18
            }
            else if (placedChipType === ValueType.NUMBERS_1_12)
            { // if number is within range of row1
                chipOdd=12
            }
            else if (placedChipType === ValueType.NUMBERS_2_12)
            { // if number is within range of row2
                chipOdd=12
            }
            else if (placedChipType === ValueType.NUMBERS_3_12)
            { // if number is within range of row3
                chipOdd=12
            }
            else if (placedChipType === ValueType.EVEN)
            { // if number even
                  chipOdd=18
              } 
            else if (placedChipType === ValueType.ODD)
            {// if number is odd
                  chipOdd=18
            }
        odd+=chipOdd}

        return 36/odd

     }


  clearBet() { 
    this.setState({
      chipsData: {
        placedChips: new Map()
      }
    });
  }

  clearBetChip(num: number) {
    this.setState({
      chipsData: {
        placedChips: new Map()
      }
    });
    this.onChipClick(num)
  }
  render() {
    return (
      <div>
        <div>
          <table className={"rouletteWheelWrapper"}>
            <tr>
            <td className={"winnersBoard pt-5"}>
                  <ScrollArea type="always" scrollbars="vertical" style={{ height: 200, maxWidth: 255 }}>
                        { 
                          this.state.winners.length==0?
                            <Card style={{ maxWidth: 200, marginLeft: 50}} variant="surface" color="green">
                              <Text as="div" size="2" weight="bold">
                                NO ONE WON
                              </Text>
                            </Card>:
                          this.state.winners.map((entry, index) => {
                              return (
                                <Card key={index} style={{ maxWidth: 200, marginLeft: 50}} variant="surface" color="green">
                                    <Text as="div" size="2" weight="bold">
                                      {entry.username}
                                    </Text>
                                    <Text as="div" color="gray" size="2">
                                      Won {entry.sum} Birr
                                    </Text>
                                </Card>
                              );
                          })
                        }
                  </ScrollArea>
            </td>
            <td><Wheel rouletteData={this.state.rouletteData} number={this.state.number} /></td>
            <td>
              <div className={"winnerHistory hideElementsTest"}>
              { 
                this.state.history.map((entry, index) => {
                  if (entry === 0) {
                    return (<div key={index} className="green">{entry}</div>);
                  } else if (this.blackNumbers.includes(entry)) {
                    return (<div key={index} className="black">{entry}</div>);
                  } else {
                    return (<div key={index} className="red">{entry}</div>);
                  }
                })
              }
              </div>
            </td>
              
            </tr>
          </table>
          <Board
            onCellClick={this.onCellClick}
            chipsData={this.state.chipsData}
            rouletteData={this.state.rouletteData}
          />
        </div>
        <div className={"progressBar hideElementsTest"}>
          <ProgressBarRound stage={this.state.stage} maxDuration={this.state.endTime} currentDuration={this.state.time_remaining} />
          <Dialog.Root>
            <Dialog.Trigger>
              <Button size="3" variant="surface" color="green">View Tickets</Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Tickets</Dialog.Title>
              <Inset side="x" my="5">
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Index</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Bet Amount</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Odd</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Win</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <TableBody>
                    {
                      this.tickets.map(
                        (ticket,index)=>{
                          return (
                           <Table.Row key={index}>
                            <Table.RowHeaderCell>{index+1}</Table.RowHeaderCell>
                            <Table.Cell>{ticket.chip[0].sum*ticket.chip.length}</Table.Cell>
                            <Table.Cell>{36/ticket.odd}</Table.Cell>
                            <Table.Cell>{(ticket.chip.length*ticket.chip[0].sum)*(36/ticket.odd)}</Table.Cell>
                          </Table.Row>
                          )
                          
                        }
                      )
                    }
                  </TableBody>
                </Table.Root>
              </Inset>

              <Flex gap="3" justify="end">
                <DialogClose>
                  <Button variant="soft" color="gray">
                    Close
                  </Button>
                </DialogClose>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </div>
        <div className="roulette-actions hideElementsTest" style={{maxWidth: "100%"}}>
          <ul>
            <li>
            <Button  size="4" color="red" variant="solid" onClick={() => this.clearBet()} >Clear</Button>
            </li>
            <li className={"board-chip"}>
              <div
                key={"chip_100"}
                className={this.getChipClasses(100)}
                onClick={() =>   this.onChipClick(100)  }
              >
                100
              </div>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_20"}>
                <div
                  className={this.getChipClasses(20)}
                  onClick={() =>   this.onChipClick(20)  }
                >
                  20
                </div>
              </span>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_10"}>
                <div
                  className={this.getChipClasses(10)}
                  onClick={() =>   this.onChipClick(10)  }
                >
                  10
                </div>
              </span>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_5"}>
                <div
                  className={this.getChipClasses(5)}
                  onClick={() =>   this.onChipClick(5)  }
                >
                  5
                </div>
              </span>
            </li>
            <li style={{marginLeft: 20, marginRight: 20}}>
              <Card size="1" style={{ width: 150 }}>
                <Flex gap="3" align="center">
                  <Box>
                    <Text as="div" size="2" weight="bold">
                      {this.props.username}
                    </Text>
                    <Text as="div" size="2" color="gray">
                      Balance: {this.balance} Birr
                    </Text>
                  </Box>
                </Flex>
              </Card>
            </li>
            <li>
            <Dialog.Root>
              <Dialog.Trigger>
                <Button size="4" color="green" 
                disabled={
                  this.state.stage === GameStages.PLACE_BET ? false : 
                  (this.balance<(this.showBet().length*this.state.chipsData.selectedChip))?false: 
                  this.state.chipsData.placedChips.length==0?false:true}
                  variant="surface">Place Bet</Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Title>Your Bet Info</Dialog.Title>
                <Dialog.Description>
                  You Can Watch you Odd
                </Dialog.Description>
                <Inset side="x" my="5">
                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>Bet Amount</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Odd</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>P Win</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <TableBody>
                      <Table.Row>
                        <Table.RowHeaderCell>{(this.showBet().length)>0?this.showBet().length*this.state.chipsData.selectedChip:0}</Table.RowHeaderCell>
                        <Table.Cell>{(this.showBet().length)>0?this.calculateOdd(): 0}</Table.Cell>
                        <Table.Cell>{(this.showBet().length)>0?(this.showBet().length*this.state.chipsData.selectedChip)*(this.calculateOdd()): 0}</Table.Cell>
                      </Table.Row>
                    </TableBody>
                  </Table.Root>
                </Inset>

                <Flex gap="3" justify="end">
                  <DialogClose>
                    <Button variant="soft" color="gray">
                      Close
                    </Button>
                  </DialogClose>
                  {this.showBet().length>0 && ((this.showBet.length*this.showBet()[0].sum)<=(this.balance))
                  ?<Button variant="soft" color="green" onClick={()=>{this.placeBet()}}>Place Bet</Button>
                  :this.showBet().length>0 && ((this.showBet.length*this.showBet()[0].sum)>(this.balance))?
                  <Button variant="soft" color="green" >Insufficient Balance</Button>:<></>}
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default RouletteWrapper;
