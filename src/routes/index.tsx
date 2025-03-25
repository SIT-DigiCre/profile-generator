import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import CircleBlock from "#/components/CircleBlock";
import ImageBlock from "#/components/ImageBlock";
import TextBlock from "#/components/TextBlock";
import {
  BASE_IMG_HEIGHT,
  BASE_IMG_WIDTH,
  INTERESETS,
  POSITIONS,
} from "#/libs/constant";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [name, setName] = useState<string>("");
  const [profile, setProfile] = useState<string>("");
  const [grade, setGrade] = useState<string>("21st");
  const [course, setCourse] = useState<string>("Computer Science");
  const [bio, setBio] = useState<string>("");
  const [vcRate, setVcRate] = useState<number>(0);
  const [speak, setSpeak] = useState<boolean>(false);
  const [chat, setChat] = useState<boolean>(false);
  const [interests, setInterests] = useState<string[]>([]);

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

        // interests
        interests.forEach((interest) => {
          const item = INTERESETS.find((item) => item.id === interest);
          if (item) {
            ctx.arc(item.top, item.left, 1000, 0, Math.PI * 2, true);
          }
        });

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
          {[...Array(vcRate)].map((_, index) => (
            <CircleBlock
              key={index}
              top={POSITIONS.vcRate.top}
              left={POSITIONS.vcRate.left + 100 * index}
            />
          ))}
          {speak && <CircleBlock {...POSITIONS.speak} />}
          {chat && <CircleBlock {...POSITIONS.chat} />}
          <TextBlock {...POSITIONS.bio} text={bio} />
          {interests.map((interest) => {
            const item = INTERESETS.find((item) => item.id === interest);
            if (item) {
              return (
                <CircleBlock key={item.id} top={item.top} left={item.left} />
              );
            }
          })}
        </div>
        <button onClick={downloadImage}>ダウンロードする</button>
      </div>
      <div className="form">
        <fieldset>
          <legend>アイコン画像</legend>
          <input
            id="profile"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </fieldset>
        <fieldset>
          <legend>ハンドルネーム</legend>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
          />
        </fieldset>
        <fieldset>
          <legend>学年</legend>
          <input
            id="grade"
            type="text"
            value={grade}
            onChange={(event) => setGrade(event.target.value)}
            placeholder="Your grade"
          />
        </fieldset>
        <fieldset>
          <legend>学科</legend>
          <input
            id="course"
            type="text"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
            placeholder="Your course"
          />
        </fieldset>
        <fieldset>
          <legend>VS出現率</legend>
          <input
            type="number"
            min={0}
            max={7}
            onChange={(e) => setVcRate(e.target.value as unknown as number)}
          />
        </fieldset>
        <fieldset>
          <legend>自己紹介</legend>
          <textarea
            id="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="Your bio"
          />
        </fieldset>
        <fieldset>
          <legend>おしゃべり</legend>
          <input type="checkbox" onChange={(e) => setSpeak(e.target.checked)} />
        </fieldset>
        <fieldset>
          <legend>チャット</legend>
          <input type="checkbox" onChange={(e) => setChat(e.target.checked)} />
        </fieldset>
        <fieldset>
          <legend>興味のあること</legend>
          {INTERESETS.map((item) => (
            <div key={item.id}>
              <input
                id={item.id}
                name="interests"
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setInterests([...interests, item.id]);
                  } else {
                    setInterests(
                      interests.filter((interest) => interest !== item.id)
                    );
                  }
                }}
              />
              <label htmlFor={item.id}>{item.label}</label>
            </div>
          ))}
        </fieldset>
      </div>
    </div>
  );
}
