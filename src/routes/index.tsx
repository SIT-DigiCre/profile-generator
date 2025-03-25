import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import ImageBlock from "#/components/ImageBlock";
import TextBlock from "#/components/TextBlock";
import { BASE_IMG_HEIGHT, BASE_IMG_WIDTH, POSITIONS } from "#/libs/constant";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [name, setName] = useState<string>("");
  const [profile, setProfile] = useState<string>("");
  const [grade, setGrade] = useState<string>("21st");
  const [course, setCourse] = useState<string>("Computer Science");
  const [bio, setBio] = useState<string>("");

  const downloadImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "/base.png";

    img.onload = async () => {
      await document.fonts.ready;
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.font = "24px Noto Sans JP";
        ctx.fillStyle = "black";
        // name
        ctx.fillText(name, POSITIONS.name.top, POSITIONS.name.left);
        // icon
        const profileEl = new Image();
        profileEl.src = profile;
        profileEl.style.borderRadius = "9999px";
        ctx.drawImage(
          profileEl,
          POSITIONS.profile.top,
          POSITIONS.profile.left,
          POSITIONS.profile.width,
          POSITIONS.profile.height
        );
        // grade
        ctx.fillText(grade, POSITIONS.grade.top, POSITIONS.grade.left);
        // course
        ctx.fillText(course, POSITIONS.course.top, POSITIONS.course.left);
        // bio
        // TODO: 折り返し
        ctx.fillText(bio, POSITIONS.bio.top, POSITIONS.bio.left);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "profile.webp";
            a.click();
            URL.revokeObjectURL(url);
          }
        }, "image/webp");
      }
    };
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setProfile(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="wrapper">
      <div className="preview">
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            width={BASE_IMG_WIDTH * 0.1}
            height={BASE_IMG_HEIGHT * 0.1}
            src="/base.png"
            alt="Selected"
          />
          {profile && <ImageBlock {...POSITIONS.profile} src={profile} />}
          <TextBlock {...POSITIONS.name} text={name} />
          <TextBlock {...POSITIONS.grade} text={grade} />
          <TextBlock {...POSITIONS.course} text={course} />
          <TextBlock {...POSITIONS.bio} text={bio} />
        </div>
        <button onClick={downloadImage}>ダウンロードする</button>
      </div>
      <div className="form">
        <div className="form-control">
          <label htmlFor="profile">アイコン画像</label>
          <input
            id="profile"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="name">ハンドルネーム</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="form-control">
          <label htmlFor="grade">学年</label>
          <input
            id="grade"
            type="text"
            value={grade}
            onChange={(event) => setGrade(event.target.value)}
            placeholder="Your grade"
          />
        </div>
        <div className="form-control">
          <label htmlFor="course">学科</label>
          <input
            id="course"
            type="text"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
            placeholder="Your course"
          />
        </div>
        <div className="form-control">
          <label htmlFor="bio">自己紹介</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Your bio"
          />
        </div>
      </div>
    </div>
  );
}
