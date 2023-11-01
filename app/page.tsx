'use client';
import React, { useState} from "react";
import RouletteWrapper from "./pages/RouletteWrapper";
import Card, { Avatar, Box, Button, Flex, TextField } from "@radix-ui/themes"

export default function Home() {
  const [stringValue, setStringValue] = useState('');
  const [usernameValue, setUsernameValue] = useState('');
  if (usernameValue === '') {
    return (
      <div>
      <div style={{maxWidth: 400, margin: "auto", marginTop: 100}}>
        <img src="https://th.bing.com/th/id/R.31312cd79f1c8025ecf6aef5385d6f0c?rik=oQJyZFHgUYtt%2fg&pid=ImgRaw&r=0" alt="" />
      </div>
      <div style={{maxWidth: 350, maxHeight: 200, margin: "auto" , marginTop: 10, background: "rgba(0,0,0,0.2)",
                    padding: 20 , borderRadius: 10}}>
        <Flex gap="3" align="center">
          <Box>
            <h5 style={{fontWeight: "bolder",color: "white"}}>
              Create Account
            </h5>
          </Box>
        </Flex>
        <Flex direction="column" gap="6">
        <label style={{marginTop: 10}}>
          <h6 style={{marginBottom: 10, color: "white"}}>
            Name
          </h6>
          <TextField.Input
            defaultValue="Freja Johnsen"
            placeholder="Enter your full name"
            value={stringValue} 
            onChange={
              (event) => setStringValue(event.currentTarget.value)}
          />
        </label>
      </Flex>

      <Flex gap="3" mt="4" justify="end">
          <Button onClick={(event) => 
          {
              if (stringValue.length > 5) {
                setUsernameValue(stringValue)
              }
          } 
        }>Login</Button>
    
      </Flex>
  </div>
  </div>
    );
  } else {
    return (
      <RouletteWrapper username={usernameValue}/>
    );
  }
}
