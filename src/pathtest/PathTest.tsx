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
    const s = Date.now();

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

    const newEndPoint: Point = {
      top: 300,
      left: 100,
      type: "main",
    };

    const newLine = getLine(endPoint, newEndPoint, "main");
    const newA = test(endPoint, newEndPoint);

    const newNewPoints = createMiddlePointsForSteps(
      endPoint,
      newEndPoint,
      initialElevation * -1,
      granularitySteps,
    );

    const newNewLines = createLines(newNewPoints);

    const mp = mergePoints(newPoints, newNewPoints);
    const mpLine = getLine(mp[0], mp[mp.length - 1], "main");
    // const mpp = createMiddlePointsForSteps(mp[0], mp[1], 0.3, granularitySteps);
    const mpl = createLines(mp);

    console.log("Calculation time (ms):", Date.now() - s);
    console.log(mp);

    // setPoints([a, ...newPoints, newA, ...newNewPoints]);
    // setLines([line, ...newLines, newLine, ...newNewLines, mpLine, ...mpl]);
    setPoints([a, newA, ...mp]);
    setLines([line, newLine, ...mpl]);

    return () => {
      setPoints([]);
      setLines([]);
    };
  }, []);

  // start and end points are assumed to share a single point at their end
  // returns a new array BUT MODIFIES THE UNDERLYING POINTS
  function mergePoints(startPoints: Point[], endPoints: Point[]): Point[] {
    const startSplitIndex = Math.floor(startPoints.length / 2);
    const endSplitIndex = Math.floor(endPoints.length / 2);

    const mergeStart = startPoints[startSplitIndex];
    const mergeEnd = endPoints[endSplitIndex];

    const targetCurve = createMiddlePointsForSteps(
      mergeStart,
      mergeEnd,
      0.3,
      granularitySteps,
    );
    const pointsToMove = [
      ...startPoints.slice(startSplitIndex),
      ...endPoints.slice(1, endSplitIndex + 1),
    ];

    const maxMoveIndex = Math.floor(pointsToMove.length / 2);

    for (let i = 0; i < pointsToMove.length; i++) {
      const initialMoveRatio = 1 - Math.abs(maxMoveIndex - i) / maxMoveIndex;
      const moveRatio = Math.min(
        initialMoveRatio + initialMoveRatio * 0.25 * initialMoveRatio,
        1,
      );

      const from = pointsToMove[i];
      const to = targetCurve[i];

      const dist = getDistanceBetweenPoints(from, to);
      const targetDist = dist * moveRatio;
      if (targetDist === 0) {
        continue;
      }

      const sinLeft = (to.left - from.left) / dist;
      const cosTop = (to.top - from.top) / dist;

      const targetTop = targetDist * cosTop + from.top;
      const targetLeft = targetDist * sinLeft + from.left;

      from.top = targetTop;
      from.left = targetLeft;
    }

    return [
      ...startPoints.slice(0, startSplitIndex),
      ...pointsToMove,
      ...endPoints.slice(endSplitIndex + 1),
    ];
  }

  function getDistanceBetweenPoints(from: Point, to: Point): number {
    return Math.sqrt(
      Math.pow(to.top - from.top, 2) + Math.pow(to.left - from.left, 2),
    );
  }

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
