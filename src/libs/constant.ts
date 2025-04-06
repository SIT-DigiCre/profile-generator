export const RATIO = 0.1;
export const BASE_IMG_WIDTH = 800;
export const BASE_IMG_HEIGHT = 450;
export const POSITIONS = {
  name: {
    top: 100,
    left: 170,
    fontSize: 30,
    fontFamily: "Noto Sans JP",
    fill: "black",
  },
  profile: {
    top: 18.5,
    left: 18.5,
    width: 140,
    height: 140,
  },
  grade: {
    top: 20,
    left: 170,
    fontSize: 20,
    fontFamily: "Noto Sans JP",
    fill: "black",
  },
  course: {
    top: 190,
    left: 30,
    fontSize: 20,
    fontFamily: "Noto Sans JP",
    fill: "black",
  },
  vcRate: {
    top: 580,
    left: 4590,
  },
  bio: {
    top: 110,
    left: 410,
    fontSize: 20,
    width: 350,
    fontFamily: "Noto Sans JP",
    fill: "black",
    breakWords: true,
    opacity: 1,
    textAlign: "left",
    splitByGrapheme: true,
  },
  speak: {
    top: 55,
    left: 670,
  },
  chat: {
    top: 55,
    left: 725,
  },
} as const;

export const INTERESETS = [
  { id: "pg", label: "プログラミング", top: 270, left: 25 },
  { id: "dtm", label: "DTM", top: 270, left: 105 },
  { id: "3dcg", label: "3DCG", top: 270, left: 185 },
  { id: "illust", label: "イラスト", top: 270, left: 265 },
  { id: "vtuber", label: "VTuber", top: 270, left: 335 },
  { id: "sysdev", label: "システム開発", top: 365, left: 25 },
  { id: "dj", label: "DJ", top: 365, left: 105 },
  { id: "movie", label: "映像制作", top: 365, left: 185 },
  { id: "literature", label: "文字書き", top: 365, left: 265 },
] as const;
