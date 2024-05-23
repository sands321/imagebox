import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import nlp from "compromise";
import { styled } from "@mui/system";

const RedText = styled("span")(({ theme }) => ({
  color: "red",
}));

const EditableTextField = () => {
  const [text, setText] = useState("");
  const editableRef = useRef(null);

  const highlightAdjectives = (text: string) => {
    const doc = nlp(text);
    const adjectives = doc.adjectives().out("array");
    const words = text.split(" ");

    return words
      .map((word, index) => {
        const cleanedWord = word.replace(/[.,/#!$%^&*;:{}=_`~()]/g, "");
        if (adjectives.includes(cleanedWord.toLowerCase())) {
          return `<span style="color: red;" key=${index}>${word} </span>`;
        }
        return `<span key=${index}>${word} </span>`;
      })
      .join(" ");
  };

  const handleInput = (event: any) => {
    const newText = event.target.innerText;
    setText(newText);
  };

  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.innerHTML = highlightAdjectives(text);
    }
  }, [text]);

  return (
    <Box>
      <Typography
        component="div"
        contentEditable
        ref={editableRef}
        onInput={handleInput}
        suppressContentEditableWarning={true}
        style={{
          border: "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: "4px",
          padding: "16.5px 14px",
          minHeight: "56px",
          outline: "none",
          cursor: "text",
        }}
      />
    </Box>
  );
};

export default EditableTextField;
