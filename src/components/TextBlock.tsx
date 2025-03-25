import { ASPECT } from "#/libs/constant";

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
        top: top * ASPECT,
        left: left * ASPECT,
        width: width && width * ASPECT,
        height: height && height * ASPECT,
        color: color,
        fontSize: fontSize && fontSize * ASPECT,
      }}
    >
      {text}
    </span>
  );
};

export default TextBlock;
