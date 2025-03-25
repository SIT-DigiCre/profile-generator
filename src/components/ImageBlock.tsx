import { RATIO } from "#/libs/constant";

type ImageBlockProps = {
  src: string;
  top: number;
  left: number;
  width?: number;
  height?: number;
  rounded?: boolean;
};

const ImageBlock: React.FC<ImageBlockProps> = ({
  src,
  top,
  left,
  width,
  height,
  rounded = false,
}) => {
  return (
    <img
      src={src}
      style={{
        position: "absolute",
        top: top * RATIO,
        left: left * RATIO,
        width: width && width * RATIO,
        height: height && height * RATIO,
        borderRadius: rounded ? "9999px" : undefined,
      }}
    />
  );
};

export default ImageBlock;
