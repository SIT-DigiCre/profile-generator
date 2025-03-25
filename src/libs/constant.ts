export const RATIO = 0.1;
export const BASE_IMG_WIDTH = 8000;
export const BASE_IMG_HEIGHT = 4500;
export const POSITIONS = {
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

export const INTERESETS = [
  { id: "pg", label: "プログラミング", top: 2700, left: 250 },
  { id: "dtm", label: "DTM", top: 2700, left: 1050 },
  { id: "3dcg", label: "3DCG", top: 2700, left: 1850 },
  { id: "illust", label: "イラスト", top: 2700, left: 2600 },
  { id: "vtuber", label: "VTuber", top: 2700, left: 3300 },
  { id: "sysdev", label: "システム開発", top: 3550, left: 250 },
  { id: "dj", label: "DJ", top: 3550, left: 1050 },
  { id: "movie", label: "映像制作", top: 3550, left: 1850 },
  { id: "literature", label: "文字書き", top: 3550, left: 2600 },
] as const;
