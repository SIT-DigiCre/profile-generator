import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

const ASPECT = 0.1;
const BASE_IMG_WIDTH = 8000;
const BASE_IMG_HEIGHT = 4500;
const POSITIONS = {
  name: {
    top: 1000,
    left: 1700,
    fontSize: 300,
  },
  profile: {
    top: 185,
    left: 185,
    width: 1400,
    height: 1400,
  },
  grade: {
    top: 200,
    left: 1700,
    fontSize: 200,
  },
  course: {
    top: 1900,
    left: 300,
    fontSize: 200,
  },
  bio: {
    top: 1100,
    left: 4100,
    fontSize: 200,
  },
} as const;

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
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name"
      />
      <input
        type="text"
        value={grade}
        onChange={(event) => setGrade(event.target.value)}
        placeholder="Your grade"
      />
      <input
        type="text"
        value={course}
        onChange={(event) => setCourse(event.target.value)}
        placeholder="Your course"
      />
      <textarea
        value={bio}
        onChange={(event) => setBio(event.target.value)}
        placeholder="Your bio"
      />
      <div style={{ position: "relative", display: "inline-block" }}>
        <img
          width={BASE_IMG_WIDTH * 0.1}
          height={BASE_IMG_HEIGHT * 0.1}
          src="/base.png"
          alt="Selected"
        />
        {profile && (
          <img
            width={POSITIONS.profile.width * ASPECT}
            height={POSITIONS.profile.height * ASPECT}
            src={profile}
            alt="Selected"
            style={{
              position: "absolute",
              top: POSITIONS.profile.top * ASPECT,
              left: POSITIONS.profile.left * ASPECT,
              borderRadius: "9999px",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: POSITIONS.name.top * ASPECT,
            left: POSITIONS.name.left * ASPECT,
            color: "black",
            fontSize: POSITIONS.name.fontSize * ASPECT,
          }}
        >
          {name}
        </div>
        <div
          style={{
            position: "absolute",
            top: POSITIONS.grade.top * ASPECT,
            left: POSITIONS.grade.left * ASPECT,
            color: "black",
            fontSize: POSITIONS.grade.fontSize * ASPECT,
          }}
        >
          {grade}
        </div>
        <div
          style={{
            position: "absolute",
            top: POSITIONS.course.top * ASPECT,
            left: POSITIONS.course.left * ASPECT,
            color: "black",
            fontSize: POSITIONS.course.fontSize * ASPECT,
          }}
        >
          {course}
        </div>
        <div
          style={{
            position: "absolute",
            top: POSITIONS.bio.top * ASPECT,
            left: POSITIONS.bio.left * ASPECT,
            color: "black",
            fontSize: POSITIONS.bio.fontSize * ASPECT,
          }}
        >
          {bio}
        </div>
        <button onClick={downloadImage}>Download as WebP</button>
      </div>
    </div>
  );
}
