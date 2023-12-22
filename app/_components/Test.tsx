"use client";
import FormInputRichTextSun from "@/components/shared/RichTextEditor";
import React from "react";

function Test() {
  const [content, setContent] = React.useState("");
  return (
    <div>
      <FormInputRichTextSun
        content={content}
        label={"Test"}
        setContent={(e: string) => {
          setContent(e);
        }}
      />
    </div>
  );
}

export default Test;
