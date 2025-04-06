import { useEffect, useRef, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
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
  const [vcRate, setVcRate] = useState<fabric.Rect[]>([]);
  const [speak, setSpeak] = useState<fabric.Polyline | null>(null);
  const [chat, setChat] = useState<fabric.Polyline | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [interestsCircles, setInterestsCircles] = useState<{
    [key: string]: fabric.Group;
  }>({});

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
        multiplier: 10,
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
    if (!file || !canvas) return;

    // 画像サイズ等を取得するため、FileReader ではなく一旦 Blob URL からロードする
    const objectURL = URL.createObjectURL(file);

    const diameter = 140; // 画面上での最終的な円の直径(px)

    fabric.FabricImage.fromURL(objectURL).then((img) => {
      const origW = img.width ?? 0;
      const origH = img.height ?? 0;
      // cover風に、短辺に合わせてスケーリング
      const scaleRatio = diameter / Math.min(origW, origH);

      // ▼ 画像を拡大・縮小
      img.scale(scaleRatio);

      // ▼ ここが重要：「ローカル座標系の円半径」
      //    画面上では 70px に見せたいが、オブジェクトは scaleRatio 倍されているため
      //    ローカル座標での半径は「70 / scaleRatio」にする
      const circleMask = new fabric.Circle({
        radius: diameter / 2 / scaleRatio, // = 70 / scaleRatio
        originX: "center",
        originY: "center",
      });

      img.set({
        originX: "center",
        originY: "center",
        clipPath: circleMask,
        // 円の中心をキャンバス座標 (left + 70, top + 70) に持っていきたい
        left: POSITIONS.profile.left + diameter / 2,
        top: POSITIONS.profile.top + diameter / 2,
      });

      canvas.add(img);
      canvas.requestRenderAll();
    });
  };

  // 興味のあることを変更したときの処理
  const handleInterestChange = (id: string, checked: boolean) => {
    if (!canvas) return;

    if (checked) {
      // すでに追加済みなら処理しない
      const position = INTERESETS.find((item) => item.id === id);
      if (interestsCircles[id] || !position) return;

      console.log(position);

      // 二重丸を作成
      const outerCircle = new fabric.Circle({
        radius: 20,
        fill: "transparent",
        stroke: "red",
        strokeWidth: 4,
        left: position.left,
        top: position.top,
      });

      const innerCircle = new fabric.Circle({
        radius: 10,
        fill: "transparent",
        stroke: "red",
        strokeWidth: 4,
        left: position.left + 10,
        top: position.top + 10,
      });

      // グループ化して追加
      const group = new fabric.Group([outerCircle, innerCircle]);
      setInterestsCircles((prev) => ({ ...prev, [id]: group }));
      canvas.add(group);
    } else {
      // 削除処理
      if (interestsCircles[id]) {
        canvas.remove(interestsCircles[id]);
        setInterestsCircles((prev) => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
      }
    }

    canvas.requestRenderAll();
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
          startIcon={<DownloadIcon />}
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
        <Stack flexGrow={1} gap={2} justifyContent="center" alignItems="center">
          <canvas ref={canvasRef} />
          <Stack>
            <Button
              variant="contained"
              onClick={() => {
                if (canvas) {
                  const selectedObject = canvas.getActiveObject();
                  if (selectedObject) {
                    canvas.remove(selectedObject);
                    canvas.requestRenderAll();
                  }
                }
              }}
              startIcon={<DeleteIcon />}
            >
              選択中の要素を削除
            </Button>
          </Stack>
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
                startIcon={<UploadIcon />}
              >
                画像を読み込む
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                />
              </Button>
              <FormHelperText>正方形の画像を用意してください</FormHelperText>
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
                value={vcRate.length}
                onChange={(event) => {
                  vcRate.forEach((item) => canvas.remove(item));
                  const newVcRate: fabric.Rect[] = [];
                  const x = event.currentTarget.value as unknown as number;
                  for (let i = 0; i < x; i++) {
                    const newItem = new fabric.Rect({
                      top: 61,
                      left: 460 + i * 29,
                      fill: "red",
                      width: 20,
                      height: 20,
                    });
                    canvas.add(newItem);
                    newVcRate.push(newItem);
                  }
                  setVcRate(newVcRate);
                  canvas.requestRenderAll();
                }}
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
                  console.log(newBio);
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
                    checked={!!speak}
                    onChange={() => {
                      if (speak) {
                        canvas.remove(speak);
                        setSpeak(null);
                      } else {
                        const checkMark = new fabric.Polyline(
                          [
                            { x: 685, y: 75 },
                            { x: 695, y: 85 },
                            { x: 710, y: 60 },
                          ],
                          {
                            fill: "transparent",
                            stroke: "red",
                            strokeWidth: 5,
                            strokeLineCap: "round",
                            strokeLineJoin: "round",
                          }
                        );
                        setSpeak(checkMark);
                        canvas.add(checkMark);
                      }
                    }}
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
                    checked={!!chat}
                    onChange={() => {
                      if (chat) {
                        canvas.remove(chat);
                        setChat(null);
                      } else {
                        const checkMark = new fabric.Polyline(
                          [
                            { x: 740, y: 75 },
                            { x: 750, y: 85 },
                            { x: 765, y: 60 },
                          ],
                          {
                            fill: "transparent",
                            stroke: "red",
                            strokeWidth: 5,
                            strokeLineCap: "round",
                            strokeLineJoin: "round",
                          }
                        );
                        setChat(checkMark);
                        canvas.add(checkMark);
                      }
                    }}
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
                        checked={interests.includes(item.id)}
                        onChange={(e) => {
                          const newInterests = e.target.checked
                            ? [...interests, item.id]
                            : interests.filter(
                                (interest) => interest !== item.id
                              );
                          setInterests(newInterests);
                          handleInterestChange(item.id, e.target.checked);
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
