import { useEffect, useState } from "react";

type Point = {
  top: number;
  left: number;
  type: "main" | "middle";
};

type Line = {
  top: number;
  left: number;
  length: number;
  radians: number;
  type: "main" | "middle";
};

const pointSize = 16;
const lineSize = 8;
const initialMiddleElevation = 100;

export default function PathTest() {
  const [lines, setLines] = useState<Line[]>([]);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    // const points: Point[] = [
    //   {
    //     top: 200,
    //     left: 100,
    //     type: "main",
    //   },
    //   {
    //     top: 300,
    //     left: 300,
    //     type: "main",
    //   },
    //   {
    //     top: 100,
    //     left: 250,
    //     type: "middle",
    //   },
    // ];

    const startPoint: Point = {
      top: 200,
      left: 100,
      type: "main",
    };

    const endPoint: Point = {
      top: 300,
      left: 300,
      type: "main",
    };

    const line = getLine(startPoint, endPoint, "main");
    const a = test(startPoint, endPoint);

    const newPoints = createPointsForSteps(startPoint, endPoint, 0.3, 4);
    const newLines = createLines(newPoints);

    console.log(newPoints, newLines);

    // const middlePoint = getInitialMiddle(points[0], points[1], 0.25);
    // const toMiddleLine = getLine(points[0], middlePoint, "middle");
    // const fromMiddleLine = getLine(middlePoint, points[1], "middle");

    // const quarterPoint1 = getInitialMiddle(points[0], middlePoint, 0.125);
    // const toQuarterLine1 = getLine(points[0], quarterPoint1, "middle");
    // const fromQuarterLine1 = getLine(quarterPoint1, middlePoint, "middle");

    // const quarterPoint2 = getInitialMiddle(middlePoint, points[1], 0.125);
    // const toQuarterLine2 = getLine(middlePoint, quarterPoint2, "middle");
    // const fromQuarterLine2 = getLine(quarterPoint2, points[1], "middle");

    // const topPoint = getInitialMiddle(quarterPoint1, quarterPoint2, 0.125);
    // const toTopLine = getLine(quarterPoint1, topPoint, "middle");
    // const fromTopLine = getLine(topPoint, quarterPoint2, "middle");

    setPoints([
      //   ...points,
      a,
      ...newPoints,
      //   middlePoint,
      //   quarterPoint1,
      //   quarterPoint2,
      //   topPoint,
    ]);
    setLines([
      line,
      ...newLines,
      //   toMiddleLine,
      //   fromMiddleLine,
      //   toQuarterLine1,
      //   fromQuarterLine1,
      //   toQuarterLine2,
      //   fromQuarterLine2,
      //   toTopLine,
      //   fromTopLine,
    ]);

    return () => {
      setPoints([]);
      setLines([]);
    };
  }, []);

  function getLine(from: Point, to: Point, type: "main" | "middle"): Line {
    // calculation of a distance between two points + accounting for the line thickness
    const length =
      Math.sqrt(
        Math.pow(to.top - from.top, 2) + Math.pow(to.left - from.left, 2),
      ) + lineSize;

    // calculation of the degree of the line connecting two points relative to positive X axis
    const radians = Math.atan((to.top - from.top) / (to.left - from.left));

    // calculation of the line's origin. making sure that the point order doesn't matter and also accounting for the thickness
    let top = lineSize / -2;
    let left = lineSize / -2;

    if (from.left <= to.left) {
      top += from.top;
      left += from.left;
    } else {
      top += to.top;
      left += to.left;
    }

    const line = {
      top: top,
      left: left,
      length: length,
      radians: radians,
      type: type,
    };

    return line;
  }

  function getInitialMiddle(
    from: Point,
    to: Point,
    elevationPercentage: number,
  ): Point {
    const radians = Math.atan((to.top - from.top) / (to.left - from.left));

    const length = Math.sqrt(
      Math.pow(to.top - from.top, 2) + Math.pow(to.left - from.left, 2),
    );

    // getting the point coordinates assuming that the rotation is 0deg

    // const baseTop = from.top - initialMiddleElevation;
    // const baseTop = from.top - length / 4;
    const baseTop = from.top - length * elevationPercentage;
    const baseLeft = from.left + length / 2;

    // to rotate, offsetting the point so that the origin becomes 0, 0

    const topUntilOrigin = from.top;
    const leftUntilOrigin = from.left;
    const topWithOrigin = baseTop - topUntilOrigin;
    const leftWithOrigin = baseLeft - leftUntilOrigin;

    // once the origin is 0, 0, this calculates the new rotated coordinates

    const originRotatedTop =
      leftWithOrigin * Math.sin(radians) + topWithOrigin * Math.cos(radians);
    const originRotatedLeft =
      leftWithOrigin * Math.cos(radians) - topWithOrigin * Math.sin(radians);

    // after rotation, adding the offset back

    const rotatedTop = originRotatedTop + topUntilOrigin;
    const rotatedLeft = originRotatedLeft + leftUntilOrigin;

    let resultTop = rotatedTop;
    let resultLeft = rotatedLeft;

    // if the rotation is more than 180, then there is a need to mirror the point

    if (to.left < from.left) {
      const topDiff = resultTop - from.top;
      const leftDiff = resultLeft - from.left;

      resultTop -= topDiff * 2;
      resultLeft -= leftDiff * 2;
    }

    const point: Point = {
      top: resultTop,
      left: resultLeft,
      type: "middle",
    };

    return point;
  }

  function test(from: Point, to: Point): Point {
    const middleTop = from.top + (to.top - from.top) / 2;
    const middleLeft = from.left + (to.left - from.left) / 2;

    const point: Point = {
      top: middleTop,
      left: middleLeft,
      //   top: baseTop,
      //   left: baseLeft,
      type: "middle",
    };

    return point;
  }

  function createPointsForSteps(
    initialStart: Point,
    initialEnd: Point,
    initialElevation: number,
    steps: number,
  ): Point[] {
    let currPoints = [initialStart, initialEnd];

    for (let i = 0; i < steps; i++) {
      currPoints = createPoints(currPoints, initialElevation);
      initialElevation /= 2;
    }

    return currPoints;
  }

  function createPoints(points: Point[], elevationPercentage: number): Point[] {
    const newPoints = [points[0]];

    for (let i = 0; i < points.length - 1; i++) {
      const newPoint = getInitialMiddle(
        points[i],
        points[i + 1],
        elevationPercentage,
      );

      newPoints.push(newPoint, points[i + 1]);
    }

    return newPoints;
  }

  function createLines(points: Point[]): Line[] {
    const lines = [];

    for (let i = 0; i < points.length - 1; i++) {
      const line = getLine(points[i], points[i + 1], "middle");
      lines.push(line);
    }

    return lines;
  }

  function renderPoints() {
    return points.map((p) => {
      let color;
      switch (p.type) {
        case "main":
          color = "bg-gray-800";
          break;
        case "middle":
          color = "bg-rose-700";
          break;
      }

      return (
        <div
          key={Math.random()}
          className={"  rounded-full absolute " + color}
          style={{
            top: p.top - pointSize / 2,
            left: p.left - pointSize / 2,
            width: pointSize,
            height: pointSize,
          }}
        />
      );
    });
  }

  function renderLines() {
    return lines.map((l) => {
      let color;
      switch (l.type) {
        case "main":
          color = "bg-gray-700";
          break;
        case "middle":
          color = "bg-rose-900";
          break;
      }

      return (
        <div
          key={Math.random()}
          className={"  rounded-full absolute " + color}
          style={{
            top: l.top,
            left: l.left,
            width: l.length,
            height: lineSize,
            transform: `rotate(${l.radians}rad)`,
            transformOrigin: `${lineSize / 2}px ${lineSize / 2}px`,
          }}
        />
      );
    });
  }

  return (
    <div className="h-dvh flex">
      <div className="bg-gray-500 size-[900px] m-auto relative">
        {renderPoints()}
        {renderLines()}
      </div>
    </div>
  );
}
