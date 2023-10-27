import React from 'react'

const BuildWheelpage = () => {

    let numbers =[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  return (
    <div class='wheel'>
        <div class='outerRim'></div>
        {numbers.map((number, index)=>(
            <div id={'sect'+(index+1)} class='sect'>
                <span className={(number < 10)? 'single' : 'double'}>{number}</span>
                <div class='block'></div>
            </div>
        ))
        }
        <div class='pocketsRim'></div>
        <div class='ballTrack'>
            <div class='ball'></div>
        </div>
        <div class='pockets'></div>
        <div class='cone'></div>
        <div class='turret'></div>
        <div class='turretHandle'>
            <div class='thendOne'></div>
            <div class='thendTwo'></div>
        </div>        
    </div>
  )
}

export default BuildWheelpage