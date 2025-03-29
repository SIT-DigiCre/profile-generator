/**
 * 指定した幅内でテキストを折り返して描画する関数
 */
export const wrapText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): void => {
  const words: string[] = text.split(" ");
  let line: string = "";

  words.forEach((word, i) => {
    const testLine = line + word + " ";
    const testWidth = context.measureText(testLine).width;

    if (testWidth > maxWidth && i > 0) {
      context.fillText(line, x, y);
      line = word + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  });

  context.fillText(line, x, y); // 最後の行を描画
};
