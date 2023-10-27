'use client';
import React, { useState} from "react";
import RouletteWrapper from "./pages/RouletteWrapper";

export default function Home() {
  const [stringValue, setStringValue] = useState('');
  const [usernameValue, setUsernameValue] = useState('');
  if (usernameValue === '') {
    return (
      <div className={"auth-user"}>
      <input style={{ width: 150, marginRight:10, float:"left" }} placeholder="Your name" value={stringValue} onChange={(event) => setStringValue(event.currentTarget.value)} />
      <button  onClick={(event) => 
        {
            if (stringValue.length > 5) {
              setUsernameValue(stringValue)
            }
        } 
      } >Login</button>
      </div>
    );
  } else {
    return (
      <RouletteWrapper username={usernameValue}/>
    );
  }
}
