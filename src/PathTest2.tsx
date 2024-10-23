import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

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

type Path = {
  points: Point[];
  speed: number;
};

const pointSize = 8;
const lineSize = 4;
const initialElevation = 0.25;
const granularitySteps = 5;

export default function PathTest2() {
  const [lines, setLines] = useState<Line[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const movable = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = Date.now();

    const path = generatePath(128, 4, 0.1, 25.5);
    const pathLines = createLines(path.points);

    console.log(path);
    console.log("Calculation time (ms):", Date.now() - s);

    setPoints([...path.points]);
    setLines([...pathLines]);

    const cancelAnimation = runAnimation(path);

    return () => {
      setPoints([]);
      setLines([]);
      cancelAnimation();
    };
  }, []);

  function runAnimation(path: Path) {
    let tl: gsap.core.Timeline | null = gsap.timeline({
      paused: true,
      defaults: { duration: path.speed, ease: "none" },
    });
    tl.set(movable.current!, {
      top: path.points[0].top,
      left: path.points[0].left,
    });

    for (let i = 1; i < path.points.length; i++) {
      tl.to(movable.current!, {
        top: path.points[i].top,
        left: path.points[i].left,
      });
    }

    tl.play();

    return () => {
      tl?.kill();
      tl = null;
    };
  }

  function generatePath(
    pointAmount: number,
    pointDistance: number,
    speed: number,
    allowedDegrees: number,
  ): Path {
    const points: Point[] = [
      {
        top: 250,
        left: 450,
        type: "main",
      },
    ];

    let prevDegree = Math.floor(Math.random() * 360);
    const initialRadians = (prevDegree * Math.PI) / 180;
    points.push(getLineEnd(points[0], pointDistance, initialRadians));
    points[1].type = "main";

    for (let i = 2; i < pointAmount; i++) {
      const allowedStart = prevDegree + (180 - allowedDegrees / 2) - 180;
      const allowedEnd = allowedStart + allowedDegrees;

      prevDegree =
        allowedStart + Math.floor(Math.random() * (allowedEnd - allowedStart));
      const radians = (prevDegree * Math.PI) / 180;
      points.push(getLineEnd(points[i - 1], pointDistance, radians));
    }

    return {
      points: points,
      speed: speed,
    };
  }

  function getRelativeDegree(a: Point, b: Point, c: Point) {
    const rad =
      Math.atan2(c.top - b.top, c.left - b.left) -
      Math.atan2(a.top - b.top, a.left - b.left);
    const deg = (rad * 180) / Math.PI;
    const relativeDegree = deg < 0 ? deg + 360 : deg;
    return relativeDegree;
  }

  function getLineEnd(start: Point, length: number, radians: number): Point {
    return {
      top: length * Math.cos(radians) + start.top,
      left: length * Math.sin(radians) + start.left,
      type: "middle",
    };
  }

  function getDistanceBetweenPoints(from: Point, to: Point): number {
    return Math.sqrt(
      Math.pow(to.top - from.top, 2) + Math.pow(to.left - from.left, 2),
    );
  }

  function getLine(from: Point, to: Point, type: "main" | "middle"): Line {
    // calculation of distance between two points

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
    // same stuff with the line creation above

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
        <div
          ref={movable}
          className="size-1 rounded-full bg-black z-50 absolute translate-x-[-2px] translate-y-[-2px]"
          style={{ boxShadow: "0 0 25px 25px hsla(244, 50%, 50%, 0.75)" }}
        />
        {renderPoints()}
        {renderLines()}
      </div>
    </div>
  );
}
