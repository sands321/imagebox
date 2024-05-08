/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, ThemeProvider } from "@mui/material";
import React from "react";
import { darkTheme } from "./base";

function App() {
  const onClickBtn1 = () => {
    //@ts-ignore
    rpc.onBtn1();
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Button onClick={onClickBtn1}>btn1</Button>
      </ThemeProvider>
    </>
  );
}
export default App;
