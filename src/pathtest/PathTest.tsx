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
const initialElevation = 0.25;
const granularitySteps = 4;

export default function PathTest() {
  const [lines, setLines] = useState<Line[]>([]);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
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

    const newPoints = createMiddlePointsForSteps(
      startPoint,
      endPoint,
      initialElevation,
      granularitySteps,
    );

    const newLines = createLines(newPoints);

    setPoints([a, ...newPoints]);
    setLines([line, ...newLines]);

    return () => {
      setPoints([]);
      setLines([]);
    };
  }, []);

  function getLine(from: Point, to: Point, type: "main" | "middle"): Line {
    // calculation of the distance between two points

    const length = Math.sqrt(
      Math.pow(to.top - from.top, 2) + Math.pow(to.left - from.left, 2),
    );

    // calculation of the degree of the line connecting two points (relative to positive X axis line)

    const radians = Math.atan((to.top - from.top) / (to.left - from.left));

    // calculation of the line's origin. making sure that the location order of points doesn't matter

    let top;
    let left;

    if (from.left <= to.left) {
      top = from.top;
      left = from.left;
    } else {
      top = to.top;
      left = to.left;
    }

    // collecting and returning the stuff

    const line = {
      top: top,
      left: left,
      length: length,
      radians: radians,
      type: type,
    };

    return line;
  }

  function getMiddlePoint(
    from: Point,
    to: Point,
    elevationPercentage: number,
  ): Point {
    // same stuff with the line above

    const radians = Math.atan((to.top - from.top) / (to.left - from.left));
    const length = Math.sqrt(
      Math.pow(to.top - from.top, 2) + Math.pow(to.left - from.left, 2),
    );

    // getting the initial point coordinates assuming that the rotation is 0deg

    const baseTop = from.top - length * elevationPercentage;
    const baseLeft = from.left + length / 2;

    // then to rotate, offsetting the point so that the origin becomes 0, 0

    const topUntilOrigin = from.top;
    const leftUntilOrigin = from.left;
    const topWithOrigin = baseTop - topUntilOrigin;
    const leftWithOrigin = baseLeft - leftUntilOrigin;

    // once the origin is 0, 0, calculate the new rotated coordinates

    const originRotatedTop =
      leftWithOrigin * Math.sin(radians) + topWithOrigin * Math.cos(radians);
    const originRotatedLeft =
      leftWithOrigin * Math.cos(radians) - topWithOrigin * Math.sin(radians);

    // after rotation, adding the offset back

    const rotatedTop = originRotatedTop + topUntilOrigin;
    const rotatedLeft = originRotatedLeft + leftUntilOrigin;

    // if the rotation is more than 180, then there is a need to mirror the point

    let resultTop = rotatedTop;
    let resultLeft = rotatedLeft;

    if (to.left < from.left) {
      const topDiff = resultTop - from.top;
      const leftDiff = resultLeft - from.left;

      resultTop -= topDiff * 2;
      resultLeft -= leftDiff * 2;
    }

    // return the stuff

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
      type: "middle",
    };

    return point;
  }

  function createMiddlePointsForSteps(
    initialStart: Point,
    initialEnd: Point,
    initialElevation: number,
    steps: number,
  ): Point[] {
    let currPoints = [initialStart, initialEnd];

    for (let i = 0; i < steps; i++) {
      currPoints = createMiddlePoints(currPoints, initialElevation);
      initialElevation /= 2;
    }

    return currPoints;
  }

  function createMiddlePoints(
    points: Point[],
    elevationPercentage: number,
  ): Point[] {
    const newPoints = [points[0]];

    for (let i = 0; i < points.length - 1; i++) {
      const newPoint = getMiddlePoint(
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
            top: l.top - lineSize / 2,
            left: l.left - lineSize / 2,
            width: l.length + lineSize,
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
