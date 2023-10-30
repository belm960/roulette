'use client';
import React, { useState} from "react";
import RouletteWrapper from "./pages/RouletteWrapper";
import Card, { Avatar, Box, Button, Flex, TextField } from "@radix-ui/themes"

export default function Home() {
  const [stringValue, setStringValue] = useState('');
  const [usernameValue, setUsernameValue] = useState('');
  if (usernameValue === '') {
    return (
      <div style={{maxWidth: 350, maxHeight: 200, margin: "auto" , marginTop: 200, background: "white",
                    padding: 20 , borderRadius: 10}}>
        <Flex gap="3" align="center">
          <Avatar
            size="3"
            src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
            radius="full"
            fallback="T"
          />
          <Box>
            <h5 style={{fontWeight: "bolder"}}>
              Create Account
            </h5>
          </Box>
        </Flex>
        <Flex direction="column" gap="6">
        <label style={{marginTop: 10}}>
          <h6 style={{marginBottom: 10}}>
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
          <Button variant="soft" color="gray">
            Cancel
          </Button>
          <Button onClick={(event) => 
          {
              if (stringValue.length > 5) {
                setUsernameValue(stringValue)
              }
          } 
        }>Login</Button>
    
      </Flex>
  </div>
    );
  } else {
    return (
      <RouletteWrapper username={usernameValue}/>
    );
  }
}
