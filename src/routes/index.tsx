import { useState } from "react";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Input,
  Stack,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

import CheckBlock from "#/components/CheckBlock";
import CircleBlock from "#/components/CircleBlock";
import FillSquareBlock from "#/components/FillSquareBlock";
import ImageBlock from "#/components/ImageBlock";
import TextBlock from "#/components/TextBlock";
import { VisuallyHiddenInput } from "#/components/VisuallyHiddenInput";
import {
  BASE_IMG_HEIGHT,
  BASE_IMG_WIDTH,
  INTERESETS,
  POSITIONS,
} from "#/libs/constant";
import { wrapText } from "#/libs/functions";

export const Route = createFileRoute("/")({
  component: Index,
});

const TOP_OFFSET = 200;

function Index() {
  const [name, setName] = useState<string>("");
  const [profile, setProfile] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [vcRate, setVcRate] = useState<number>(7);
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
        // 背景の描画
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "black";
        // 名前
        ctx.font = `${POSITIONS.name.fontSize}px Noto Sans JP`;
        ctx.fillText(
          name,
          POSITIONS.name.left,
          POSITIONS.name.top + TOP_OFFSET
        );
        // 学年
        ctx.font = `${POSITIONS.grade.fontSize}px Noto Sans JP`;
        ctx.fillText(
          grade,
          POSITIONS.grade.left,
          POSITIONS.grade.top + TOP_OFFSET
        );
        // 学科
        ctx.font = `${POSITIONS.course.fontSize}px Noto Sans JP`;
        ctx.fillText(
          course,
          POSITIONS.course.left,
          POSITIONS.course.top + TOP_OFFSET
        );
        // 自己紹介
        // TODO: 折り返し
        wrapText(
          ctx,
          bio,
          POSITIONS.bio.left,
          POSITIONS.bio.top + TOP_OFFSET,
          3000,
          POSITIONS.bio.fontSize
        );

        // 興味
        interests.forEach((interest) => {
          const item = INTERESETS.find((item) => item.id === interest);
          if (item) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 100;
            ctx.beginPath();
            ctx.arc(item.left + 250, item.top + 250, 250, 0, Math.PI * 2);
            ctx.stroke();
          }
        });

        // VS出現率
        ctx.fillStyle = "red";
        [...Array(vcRate)].map((_, index) =>
          ctx.fillRect(
            POSITIONS.vcRate.left + 285 * index,
            POSITIONS.vcRate.top,
            250,
            250
          )
        );
        // おしゃべり
        if (speak) {
          ctx.fillStyle = "red";
          ctx.fillRect(
            POSITIONS.speak.left + 180,
            POSITIONS.speak.top + TOP_OFFSET,
            150,
            150
          );
        }
        // チャット
        if (chat) {
          ctx.fillStyle = "red";
          ctx.fillRect(
            POSITIONS.chat.left + 180,
            POSITIONS.chat.top + TOP_OFFSET,
            150,
            150
          );
        }

        // アイコン
        const profileEl = new Image();
        profileEl.crossOrigin = "anonymous";
        profileEl.src = profile;
        profileEl.onload = () => {
          ctx.beginPath();
          ctx.arc(
            POSITIONS.profile.left + 700,
            POSITIONS.profile.top + 700,
            700,
            0,
            Math.PI * 2
          );
          ctx.clip();
          ctx.drawImage(
            profileEl,
            POSITIONS.profile.left,
            POSITIONS.profile.top,
            POSITIONS.profile.width,
            POSITIONS.profile.height
          );
          ctx.restore();

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
        };
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
    <>
      <Stack
        padding={2}
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        bgcolor={"#eeeeee"}
      >
        <h1>デジクリ部員図鑑ジェネレータ</h1>
        <Button
          variant="contained"
          onClick={downloadImage}
          startIcon={<ArrowDownwardIcon />}
        >
          ダウンロードする
        </Button>
      </Stack>
      <Stack
        direction={["column", "column", "row"]}
        gap={2}
        padding={2}
        justifyContent={["center", "space-between"]}
      >
        <Stack flexGrow={1} justifyContent="center" alignItems="center">
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              width={BASE_IMG_WIDTH * 0.1}
              height={BASE_IMG_HEIGHT * 0.1}
              src="/base.png"
              alt="Selected"
            />
            {profile && (
              <ImageBlock {...POSITIONS.profile} src={profile} rounded />
            )}
            <TextBlock {...POSITIONS.name} text={name} />
            <TextBlock {...POSITIONS.grade} text={grade} />
            <TextBlock {...POSITIONS.course} text={course} />
            {[...Array(vcRate)].map((_, index) => (
              <FillSquareBlock
                key={index}
                top={POSITIONS.vcRate.top}
                left={POSITIONS.vcRate.left + 285 * index}
              />
            ))}
            {speak && <CheckBlock {...POSITIONS.speak} />}
            {chat && <CheckBlock {...POSITIONS.chat} />}
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
        </Stack>
        <Stack
          maxHeight={[undefined, undefined, "80vh"]}
          gap={3}
          overflow="auto"
        >
          <FormControl>
            <FormLabel>プロフィール画像</FormLabel>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              画像を読み込む
              <VisuallyHiddenInput
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                multiple
              />
            </Button>
          </FormControl>
          <FormControl>
            <FormLabel>ハンドルネーム</FormLabel>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>学年</FormLabel>
            <Input
              id="grade"
              type="text"
              value={grade}
              onChange={(event) => setGrade(event.target.value)}
              placeholder="Your grade"
            />
          </FormControl>
          <FormControl>
            <FormLabel>学科</FormLabel>
            <Input
              id="course"
              type="text"
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              placeholder="Your course"
            />
          </FormControl>
          <FormControl>
            <FormLabel>VC出現率</FormLabel>
            <Input
              id="vcRate"
              type="number"
              value={vcRate}
              onChange={(event) =>
                setVcRate(event.target.value as unknown as number)
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>自己紹介</FormLabel>
            <Input
              id="profile"
              type="text"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Your profile"
            />
          </FormControl>
          <FormControl>
            <FormLabel>おしゃべり</FormLabel>
            <FormControlLabel
              control={
                <Checkbox
                  checked={speak}
                  onChange={(event) => setSpeak(event.target.checked)}
                />
              }
              label="おしゃべり"
            />
          </FormControl>
          <FormControl>
            <FormLabel>チャット</FormLabel>
            <FormControlLabel
              control={
                <Checkbox
                  checked={chat}
                  onChange={(event) => setChat(event.target.checked)}
                />
              }
              label="チャット"
            />
          </FormControl>
          <FormControl>
            <FormLabel>興味のあること</FormLabel>
            <Stack direction="column">
              {INTERESETS.map((item) => (
                <FormControlLabel
                  key={item.id}
                  control={
                    <Checkbox
                      id={item.id}
                      name="interests"
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
                  }
                  label={item.label}
                />
              ))}
            </Stack>
          </FormControl>
        </Stack>
      </Stack>
    </>
  );
}
