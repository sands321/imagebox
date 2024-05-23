import React, { useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, $getRoot, $getSelection } from "lexical";

const editorConfig = {
  namespace: "MyEditor",
  onError: (error: any) => {
    console.error(error);
  },
};

const LexicalEditor = ({ value, onChange }: any) => {
  // const initialEditorState = EditorState.createEmpty();

  const handleChange = (editorState: any) => {
    editorState.read(() => {
      const root = $getRoot();
      const selection = $getSelection();
      onChange && onChange(root.getTextContent());
    });
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable className="content-editable" />}
        placeholder={<div>Enter text...</div>}
        ErrorBoundary={undefined}
      />
      <HistoryPlugin />
      <OnChangePlugin onChange={handleChange} />
    </LexicalComposer>
  );
};

const RichTextField = () => {
  const handleEditorChange = (text: any) => {
    console.log("Editor content:", text);
  };

  return (
    <TextField
      label="Rich TextField"
      fullWidth
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
            }}
          >
            <LexicalEditor onChange={handleEditorChange} />
          </div>
        ),
      }}
    />
  );
};

// export default RichTextField;
export default LexicalEditor;
