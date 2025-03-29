import CheckIcon from "@mui/icons-material/Check";

import { RATIO } from "#/libs/constant";

type CircleBlockProps = {
  top: number;
  left: number;
};

const CheckBlock: React.FC<CircleBlockProps> = ({ top, left }) => {
  return (
    <CheckIcon
      color="error"
      style={{
        position: "absolute",
        top: top * RATIO,
        left: left * RATIO,
        width: 50,
        height: 50,
      }}
    />
  );
};

export default CheckBlock;
