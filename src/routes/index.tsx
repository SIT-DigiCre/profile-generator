import React, { useEffect, useState } from "react";

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [image, setImage] = useState<string>("");
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    const savedText = localStorage.getItem("profileText");
    if (savedImage) {
      setImage(savedImage);
    }
    if (savedText) {
      setText(savedText);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("profileImage", image);
    localStorage.setItem("profileText", text);
  }, [image, text]);

  const downloadImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        // ctxがnullでないことを確認
        ctx.drawImage(img, 0, 0);
        ctx.font = "24px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(text, 20, 40); // テキストを描画

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "profile.webp";
            a.click();
            URL.revokeObjectURL(url);
          }
        }, "image/webp"); // ここで閉じる
      }
    };
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text"
      />
      {image && (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={image} alt="Selected" style={{ maxWidth: "100%" }} />
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              color: "white",
              fontSize: "24px",
            }}
          >
            {text}
          </div>
          <button onClick={downloadImage}>Download as WebP</button>
        </div>
      )}
    </div>
  );
};
