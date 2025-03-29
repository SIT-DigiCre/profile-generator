import { RATIO } from "#/libs/constant";

type FillSquareBlockProps = {
  top: number;
  left: number;
};

const FillSquareBlock: React.FC<FillSquareBlockProps> = ({ top, left }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: top * RATIO,
        left: left * RATIO,
        width: 25,
        height: 25,
        backgroundColor: "red",
      }}
    />
  );
};

export default FillSquareBlock;
