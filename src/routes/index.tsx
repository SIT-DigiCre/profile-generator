import { useEffect, useRef, useState } from "react";

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
import * as fabric from "fabric";

import { VisuallyHiddenInput } from "#/components/VisuallyHiddenInput";
import {
  BASE_IMG_HEIGHT,
  BASE_IMG_WIDTH,
  INTERESETS,
  POSITIONS,
  RATIO,
} from "#/libs/constant";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [name, setName] = useState<fabric.FabricText | null>(null);
  const [grade, setGrade] = useState<fabric.FabricText | null>(null);
  const [course, setCourse] = useState<fabric.FabricText | null>(null);
  const [bio, setBio] = useState<fabric.Textbox | null>(null);
  const [vcRate, setVcRate] = useState<number>(7);
  const [speak, setSpeak] = useState<boolean>(false);
  const [chat, setChat] = useState<boolean>(false);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current!, {
      width: BASE_IMG_WIDTH,
      height: BASE_IMG_HEIGHT,
      backgroundColor: "#fff",
      selection: false,
    });
    fabric.FabricImage.fromURL("/base.png").then((img) => {
      img.scale(RATIO);
      newCanvas.backgroundImage = img;
      newCanvas.requestRenderAll();
    });
    setCanvas(newCanvas);
    return () => {
      newCanvas.dispose();
    };
  }, []);

  const downloadImage = () => {
    if (canvas) {
      const imageSrc = canvas.toDataURL({
        multiplier: 1,
        format: "webp",
      });
      const a = document.createElement("a");
      a.href = imageSrc;
      a.download = "profile.webp";
      a.click();
      URL.revokeObjectURL(imageSrc);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      const objectURL = URL.createObjectURL(file);
      reader.readAsDataURL(file);
      fabric.FabricImage.fromURL(objectURL).then((img) => {
        img.scaleToWidth(POSITIONS.profile.width);
        img.scaleToHeight(POSITIONS.profile.height);
        img.set({ top: POSITIONS.profile.top, left: POSITIONS.profile.left });
        const circleMask = new fabric.Circle({
          radius: 800,
          left: 0,
          top: 0,
          originX: "center",
          originY: "center",
        });
        img.clipPath = circleMask;
        canvas.add(img);
        canvas.requestRenderAll();
      });
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
          <canvas ref={canvasRef} />
        </Stack>
        {canvas && (
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
                value={name?.text}
                onChange={(event) => {
                  if (name) canvas.remove(name);
                  const newName = new fabric.FabricText(
                    event.target.value,
                    POSITIONS.name
                  );
                  setName(newName);
                  canvas.add(newName);
                  canvas.requestRenderAll();
                }}
                placeholder="Your name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>学年</FormLabel>
              <Input
                id="grade"
                type="text"
                value={grade?.text}
                onChange={(event) => {
                  if (grade) canvas.remove(grade);
                  const newGrade = new fabric.FabricText(
                    event.target.value,
                    POSITIONS.grade
                  );
                  setGrade(newGrade);
                  canvas.add(newGrade);
                  canvas.requestRenderAll();
                }}
                placeholder="Your grade"
              />
            </FormControl>
            <FormControl>
              <FormLabel>学科</FormLabel>
              <Input
                id="course"
                type="text"
                value={course?.text}
                onChange={(event) => {
                  if (course) canvas.remove(course);
                  const newCourse = new fabric.FabricText(
                    event.target.value,
                    POSITIONS.course
                  );
                  setCourse(newCourse);
                  canvas.add(newCourse);
                  canvas.requestRenderAll();
                }}
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
                value={bio?.text}
                onChange={(event) => {
                  if (bio) canvas.remove(bio);
                  const newBio = new fabric.Textbox(
                    event.target.value,
                    POSITIONS.bio
                  );
                  setBio(newBio);
                  canvas.add(newBio);
                  canvas.requestRenderAll();
                }}
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
                              interests.filter(
                                (interest) => interest !== item.id
                              )
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
        )}
      </Stack>
    </>
  );
}
