import * as fabric from "fabric";

export const paintDoubleCircle = () => {
  const outerCircle = new fabric.Circle({
    left: 50,
    top: 50,
    radius: 50,
    fill: "transparent",
    stroke: "red",
    strokeWidth: 5,
  });

  const innerCircle = new fabric.Circle({
    left: 65,
    top: 65,
    radius: 35,
    fill: "transparent",
    stroke: "red",
    strokeWidth: 5,
  });

  return [outerCircle, innerCircle];
};
