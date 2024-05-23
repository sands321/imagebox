import React from "react";
import { Typography } from "@mui/material";
import nlp from "compromise";
import { styled } from "@mui/system";

const RedText = styled("span")(({ theme }) => ({
  color: "red",
}));

const HighlightAdjectives = ({ sentence }: any) => {
  // 解析句子
  const doc = nlp(sentence);

  // 找出所有形容词
  const adjectives = doc.adjectives().out("array");

  // 将句子分割成单词数组
  const words = sentence.split(" ");

  return (
    <Typography component="span" sx={{ background: "red" }}>
      {words.map((word: string, index: number) => {
        // 移除单词中的标点符号以便于匹配
        const cleanedWord = word.replace(/[.,/#!$%^&*;:{}=_`~()]/g, "");
        if (adjectives.includes(cleanedWord.toLowerCase())) {
          return <RedText key={index}>{word} </RedText>;
        }
        return <span key={index}>{word} </span>;
      })}
    </Typography>
  );
};

export default HighlightAdjectives;
