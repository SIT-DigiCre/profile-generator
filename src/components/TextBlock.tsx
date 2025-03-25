import { RATIO } from "#/libs/constant";

type TextBlockProps = {
  text: string;
  top: number;
  left: number;
  width?: number;
  height?: number;
  fontSize?: number;
  color?: string;
};

const TextBlock: React.FC<TextBlockProps> = ({
  text,
  top,
  left,
  width,
  height,
  fontSize,
  color,
}) => {
  return (
    <span
      style={{
        position: "absolute",
        top: top * RATIO,
        left: left * RATIO,
        width: width && width * RATIO,
        height: height && height * RATIO,
        color: color,
        fontSize: fontSize && fontSize * RATIO,
      }}
    >
      {text}
    </span>
  );
};

export default TextBlock;
