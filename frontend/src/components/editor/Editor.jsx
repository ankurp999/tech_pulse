import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";

const Editor = ({ onReady }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        placeholder: "Start writing your story...",
        tools: {
          header: Header,
          list: List,
        },
        async onReady() {
          editorRef.current = editor;
          if (onReady) onReady(editor);
        },
      });
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return <div id="editorjs" className="border p-4 rounded-lg bg-white" />;
};

export default Editor;
