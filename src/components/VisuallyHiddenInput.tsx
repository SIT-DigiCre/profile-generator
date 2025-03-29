import { styled } from "@mui/material/styles";

/**
 * 不可視のinput要素
 * {@link https://mui.com/material-ui/react-button/#file-upload}
 */
export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
