/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Box,
  Button,
  Card,
  ImageList,
  ImageListItem,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { darkTheme } from "./base";
import { ElUtil } from "../lib/elutil";
import { rpc } from "../lib/rpc";
import { Img } from "@models/Img";
import HighlightAdjectives from "./lib/HighlightAdjectives";
import EditableTextField from "./lib/EditableTextField";
import RichTextField from "./lib/RichTextField";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { $getRoot, $getSelection } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { exec } from "child_process";

//init
ElUtil.userDir = rpc.sendSync("userDir");

function MyCustomAutoFocusPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

function App() {
  const hasRun = useRef(false);
  const [img, setImg] = React.useState<string | null>(null);
  const [lsImg, setLsImg] = React.useState<Img[]>([]);
  const [snackMsg, setSnackMsg] = React.useState("");
  const [selImg, setSelImg] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState<string | null>("");
  const [desc, setDesc] = React.useState<string | null>("");
  const [tags, setTags] = React.useState<string | null>("");

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
      const focusEl = document.activeElement.nodeName;
      //保存元数据
      if (event.metaKey && event.key === "s") {
        if (!selImg) {
          setSnackMsg("No image selected! 😭");
          return;
        }
        rpc.sendSync("updateImg", { path: selImg, title, desc, tags });
        setSnackMsg("Saved!");
      }
      //焦点需在body上---------------
      if (focusEl !== "BODY") {
        return;
      }
      //拷贝图片
      if (event.metaKey && event.key === "c") {
        if (!selImg) {
          setSnackMsg("No image selected! 😭");
          return;
        }
        rpc.send("setCbImg", selImg);
        // ElUtil.setClipboardImage(selImg);
      }
      //保存图片
      else if (event.metaKey && event.key === "v") {
        if (!ElUtil.hasClipboardImage()) {
          setSnackMsg("No image in clipboard! 😭");
          return;
        }
        rpc.sendSync("saveCbImg");
        refreshImgs();
      }
      //删
      else if (event.metaKey && event.key === "Backspace") {
        console.log(`del>>${selImg}`);
        // onDelImg();
        if (!selImg) {
          setSnackMsg("No image selected! 😭");
          return;
        }
        rpc.sendSync("delImg", selImg);
        refreshImgs();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    refreshImgs();
    return () => {
      console.log(`app>>unmount,useEffect`);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selImg, title, desc, tags]);

  const onDbClickImg = (item: string) => {
    console.log(`dbclick>>${item}`);
    // rpc.sendSync("setCbImg", item);
    // ElUtil.setImg2App(item);
    //open in app
    exec(`open -a "Preview" ${item}`);
  };

  const onClickImg = (item: Img) => {
    setSelImg(item.path);
    setTitle(item.title ?? "");
    setDesc(item.desc ?? "");
    setTags(item.tags ?? "");
    console.log(`click>>${item.path}`);
  };

  const onClickBtn1 = () => {
    // const ts = Date.now();
    // ElUtil.saveClipboardImage(`box/${ts}.png`);
    rpc.send("syncDb");
  };

  function onChangeDesc(editorState: any) {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = $getRoot();
      const selection = $getSelection();

      console.log(root, selection);
    });
  }

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        {/* <Box><Button onClick={onClickBtn1}>SYNC</Button></Box> */}
        {/* <Box> */}
        {/* <img src={img} style={{ width: 100, height: 100 }} /> */}
        {/* </Box> */}
        {/* 1.设H后,行距会拉开(可换maxH) */}
        {/* <HighlightAdjectives sentence={"you are nice"} /> */}
        <Box sx={{ overflowY: "auto", width: 1100, height: 720 }}>
          <ImageList
            sx={{
              width: "100%",
              background: "#efee",
              mt: 3,
              pb: 30,
            }}
            cols={11}
            rowHeight={100}
            // 横距
            gap={0}
          >
            {lsImg.map((item) => (
              <ImageListItem
                key={item.path}
                cols={1}
                rows={1}
                sx={{
                  // background: "red",
                  border: selImg === item.path ? "1px solid #f00" : "none",
                }}
                onClick={() => onClickImg(item)}
                onDoubleClick={() => onDbClickImg(item.path)}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    position: "absolute",
                  }}
                  component="img"
                  src={`app://${item.path}`}
                  loading="lazy"
                />
                {/* <Typography
                variant="caption"
                sx={{
                  color: "red",
                  zIndex: 1,
                  right: 0,
                  bottom: 0,
                  position: "absolute",
                  mr: 1,
                }}
              >
                AI
              </Typography> */}
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    padding: "0px 4px",
                    borderRadius: "3px",
                    m: "4px",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 8,
                    textTransform: "uppercase",
                  }}
                >
                  {item.tags}
                </Typography>
              </ImageListItem>
            ))}
          </ImageList>
        </Box>

        {/* 元数据 */}
        <Card
          sx={{
            width: 700,
            height: 210,
            padding: 1,
            position: "absolute",
            bottom: 4,
            zIndex: 2,
          }}
        >
          <Stack direction="row" spacing={2}>
            <TextField
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              placeholder="title"
              sx={{ flexGrow: 1 }}
              // sx={{
              // '& .MuiInputBase-root': { padding: '8px 12px', },
              // '& .MuiOutlinedInput-notchedOutline': { borderColor: 'blue', },
              // }}
              size="small"
              inputProps={{ style: { fontSize: 14 } }}
            />
            <TextField
              onChange={(e) => setTags(e.target.value)}
              value={tags}
              placeholder="tags"
              sx={{ width: 100 }}
              size="small"
              inputProps={{ style: { fontSize: 14 } }}
            />
          </Stack>
          <TextField
            multiline
            rows={6}
            fullWidth
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            sx={{ marginTop: 1 }}
            placeholder="description"
            size="small"
            inputProps={{
              style: { fontSize: 12 },
            }}
          ></TextField>
          <TextField
            fullWidth
            sx={{ background: "red", visibility: "hidden" }}
            InputProps={{
              inputComponent: ({ inputRef, ...otherProps }) => (
                <div
                  ref={inputRef}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "4px",
                    minHeight: "100px",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <LexicalComposer
                    initialConfig={{
                      namespace: "my-editor",
                      onError: (e) => {
                        console.log(e);
                      },
                    }}
                  >
                    <PlainTextPlugin
                      contentEditable={<ContentEditable />}
                      placeholder={<div>Enter some text...</div>}
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OnChangePlugin onChange={onChangeDesc} />
                    <HistoryPlugin />
                    {/* <MyCustomAutoFocusPlugin /> */}
                  </LexicalComposer>
                </div>
              ),
            }}
          />
        </Card>

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
