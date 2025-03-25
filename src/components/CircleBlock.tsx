import { RATIO } from "#/libs/constant";

type CircleBlockProps = {
  top: number;
  left: number;
};

const CircleBlock: React.FC<CircleBlockProps> = ({ top, left }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: top * RATIO,
        left: left * RATIO,
        width: 50,
        height: 50,
        border: "10px double red",
        borderRadius: "9999px",
      }}
    />
  );
};

export default CircleBlock;
