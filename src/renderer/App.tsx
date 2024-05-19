/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  Snackbar,
  ThemeProvider,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { darkTheme } from "./base";
import { ElUtil } from "../lib/elutil";
import { rpc } from "../lib/rpc";

//init
ElUtil.userDir = rpc.sendSync("userDir");

function App() {
  const hasRun = useRef(false);
  const [img, setImg] = React.useState<string | null>(null);
  const [lsImg, setLsImg] = React.useState<string[]>([]);
  const [snackMsg, setSnackMsg] = React.useState("");
  const [selImg, setSelImg] = React.useState<string | null>(null);

  const refreshImgs = async () => {
    // const tmpLs = ElUtil.getImages();
    const tmpLs = await rpc.sendSync("getImages");
    setLsImg(tmpLs);
  };

  const onDelImg = () => {
    console.log(`del>>${selImg}`);
  };

  useEffect(() => {
    // if (hasRun.current) {
    //   return;
    // }
    // hasRun.current = true;
    console.log(`app>>init,useEffect`);
    const handleKeyDown = async (event: KeyboardEvent) => {
      console.log(`keydown>>${event.key},meta:${event.metaKey}`);
      //粘贴
      // if (event.metaKey && event.key === "v") {
      //   const tmp = ElUtil.getClipboardImage();
      //   if (tmp) {
      //     setImg(tmp);
      //   }
      // }
      if (event.metaKey && event.key === "c") {
        if (!selImg) {
          setSnackMsg("No image selected! 😭");
          return;
        }
        rpc.send("setCbImg", selImg);
        // ElUtil.setClipboardImage(selImg);
      } else if (event.metaKey && event.key === "v") {
        if (!ElUtil.hasClipboardImage()) {
          setSnackMsg("No image in clipboard! 😭");
          return;
        }
        const ts = Date.now();
        await ElUtil.saveClipboardImage(`box/${ts}.png`);
        refreshImgs();
      } else if (event.metaKey && event.key === "Backspace") {
        console.log(`del>>${selImg}`);
        // onDelImg();
        if (!selImg) {
          setSnackMsg("No image selected! 😭");
          return;
        }
        ElUtil.removeImage(selImg);
        refreshImgs();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    refreshImgs();
    return () => {
      console.log(`app>>unmount,useEffect`);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selImg]);

  const onDbClickImg = (item: string) => {
    console.log(`dbclick>>${item}`);
    rpc.sendSync("setCbImg", item);
    ElUtil.setImg2App(item);
  };

  const onClickBtn1 = () => {
    // const ts = Date.now();
    // ElUtil.saveClipboardImage(`box/${ts}.png`);
    rpc.send("syncDb");
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Box>
          <Button onClick={onClickBtn1}>SAVE</Button>
          <Box
            component="img"
            sx={{
              height: 30,
              width: 30,
              objectFit: "scale-down",
              objectPosition: "center",
              background: "#eee",
              visibility: "hidden",
            }}
            src={img}
          />
        </Box>
        {/* <Box> */}
        {/* <img src={img} style={{ width: 100, height: 100 }} /> */}
        {/* </Box> */}
        {/* 1.设H后,行距会拉开(可换maxH) */}
        <ImageList
          sx={{ width: 1000, maxHeight: 600, background: "#eee" }}
          cols={10}
          rowHeight={100}
          // 横距
          gap={0}
        >
          {lsImg.map((item) => (
            <ImageListItem
              key={item}
              cols={1}
              rows={1}
              sx={{
                // background: "red",
                border: selImg === item ? "1px solid #f00" : "none",
              }}
              onClick={() => setSelImg(item)}
              onDoubleClick={() => onDbClickImg(item)}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                component="img"
                src={`app://${item}`}
              />
            </ImageListItem>
          ))}
        </ImageList>
        {/* 全局组件---- */}
        <Snackbar
          open={Boolean(snackMsg)}
          autoHideDuration={2000}
          onClose={() => setSnackMsg("")}
          message={snackMsg}
        />
      </ThemeProvider>
    </>
  );
}
export default App;
