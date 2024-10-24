import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

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

type Boundary = {
  top: number;
  right: number;
  left: number;
  bottom: number;
};
type BoundaryHitType = "top" | "bottom" | "left" | "right" | "corner" | "none";

type LightState = {
  element: HTMLDivElement;
  inUseUntil: number;
  opacityTimeline: gsap.core.Timeline | null;
  movementTimeline: gsap.core.Timeline | null;
};

const PATH_POINT_DISTANCE = 8; // px
const ALLOWED_TURN_RANGE = 22.5; // deg
const MIN_SIZE = 10; // px
const MAX_SIZE = 30; // px
const MIN_TRANS_DUR = 3000; // ms
const MAX_TRANS_DUR = 4000; // ms
const MIN_TIME_UNTIL_NEXT = 2500; // ms
const MAX_TIME_UNTIL_NEXT = 2500; // ms
const MIN_PATH_POINTS = 2; // count
const MAX_PATH_POINTS = 50; // count

const COLORS = {
  //   default: "hsl(343,88%,16%)",
  //   default: "hsl(244,47%,20%)",
  //   hover: "hsl(244,47%,40%)",
  //   hold: "hsl(244,47%,60%)",
  default: "hsl(244,47%,40%)",
  hover: "hsl(244,47%,50%)",
  hold: "hsl(244,47%,60%)",
};

const pointSize = 4;
const lineSize = 2;

export default function LightPathTest() {
  const [lines, setLines] = useState<Line[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const mainContainer = useRef<HTMLDivElement>(null);

  const [lights, setLights] = useState<LightState[]>([]);
  const [generateNextLightAt, setGenerateNextLightAt] = useState(0);

  // activating lights
  useEffect(() => {
    console.log(lights);
    const now = Date.now();
    if (generateNextLightAt <= now) {
      generateLight();
      return;
    }

    const timeoutId = setTimeout(() => {
      setGenerateNextLightAt(0);
    }, generateNextLightAt - now);

    return () => clearTimeout(timeoutId);
  }, [lights, generateNextLightAt]);

  function generateLight() {
    if (!mainContainer.current) {
      throw new Error("mainContainer is false");
    }

    // calculations

    const { width: maxLeft, height: maxTop } =
      mainContainer.current.getBoundingClientRect();

    const startingPoint: Point = {
      top: Math.floor(Math.random() * maxTop),
      left: Math.floor(Math.random() * maxLeft),
      type: "main",
    };

    const glowSize = Math.floor(
      MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE),
    );
    const containerSize = glowSize * 3;
    const appearDuration = Math.floor(
      MIN_TRANS_DUR + Math.random() * (MAX_TRANS_DUR - MIN_TRANS_DUR),
    );
    const disappearDuraiton = Math.floor(
      MIN_TRANS_DUR + Math.random() * (MAX_TRANS_DUR - MIN_TRANS_DUR),
    );
    const pathPoints = Math.floor(
      MIN_PATH_POINTS + Math.random() * (MAX_PATH_POINTS - MIN_PATH_POINTS),
    );

    // element initialization

    const { lightContainer, light, lightIndex } = loadLightElement();

    lightContainer.className = "rounded-full z-0 opacity-0 absolute flex";
    // lightContainer.style.backgroundColor = "rgba(0,0,0,1.0)";
    lightContainer.style.transform = `translate(-${containerSize / 2}px, -${
      containerSize / 2
    }px)`;
    lightContainer.style.width = containerSize + "px";
    lightContainer.style.height = containerSize + "px";

    light.className = "size-0 rounded-full m-auto";
    light.style.transition = `box-shadow 150ms ease-in-out`;
    light.style.boxShadow = `0 0 ${glowSize}px ${glowSize}px ${COLORS.default}`;

    // animation setup

    const travelPath = generatePath(
      startingPoint,
      pathPoints,
      PATH_POINT_DISTANCE,
      ALLOWED_TURN_RANGE,
      {
        top: 0,
        right: maxLeft,
        bottom: maxTop,
        left: 0,
      },
    );

    setPoints(travelPath);
    setLines(createLines(travelPath));

    const { opacityTl, movementTl } = setupLightAnimation(
      lightContainer,
      travelPath,
      appearDuration,
      disappearDuraiton,
    );

    lights[lightIndex] = {
      element: lightContainer,
      opacityTimeline: opacityTl,
      movementTimeline: movementTl,
      inUseUntil: Date.now() + appearDuration + disappearDuraiton,
    };

    opacityTl.eventCallback("onComplete", () => {
      lights[lightIndex].opacityTimeline?.kill();
      lights[lightIndex].movementTimeline?.kill();
      lights[lightIndex].opacityTimeline = null;
      lights[lightIndex].movementTimeline = null;
    });

    // state updates

    const waitFor = Math.floor(
      MIN_TIME_UNTIL_NEXT +
        Math.random() * (MAX_TIME_UNTIL_NEXT - MIN_TIME_UNTIL_NEXT),
    );

    setGenerateNextLightAt(Date.now() + waitFor);
    setLights([...lights]);
  }

  function generatePath(
    start: Point,
    pointAmount: number,
    pointDistance: number,
    allowedDegrees: number,
    boundary: Boundary,
  ) {
    const points = [start];

    let prevDegree = Math.floor(Math.random() * 360);
    const initialRadians = (prevDegree * Math.PI) / 180;

    const secondPoint = getLineEnd(points[0], pointDistance, initialRadians);
    prevDegree = fixPointOutOfBoundary(
      points[0],
      secondPoint,
      pointDistance,
      prevDegree,
      boundary,
    );
    points.push(secondPoint);

    points[1].type = "main";

    for (let i = 2; i < pointAmount; i++) {
      const allowedStart = prevDegree + (180 - allowedDegrees / 2) - 180;
      const allowedEnd = allowedStart + allowedDegrees;

      prevDegree =
        allowedStart + Math.floor(Math.random() * (allowedEnd - allowedStart));
      const radians = (prevDegree * Math.PI) / 180;

      const newPoint = getLineEnd(points[i - 1], pointDistance, radians);
      prevDegree = fixPointOutOfBoundary(
        points[i - 1],
        newPoint,
        pointDistance,
        prevDegree,
        boundary,
      );

      points.push(newPoint);
    }

    return points;
  }

  // if necessary, changes location of the point IN PLACE
  // returns the old degree, or the new one if it changed
  function fixPointOutOfBoundary(
    lastPoint: Point,
    pointToFix: Point,
    distance: number,
    degree: number,
    boundary: Boundary,
  ): number {
    const hitType = getBoundaryHitType(pointToFix, boundary);
    if (hitType === "none") {
      return degree;
    }

    let newDegree;

    switch (hitType) {
      case "top":
      case "bottom":
        newDegree = 180 - degree;
        break;
      case "right":
      case "left":
        newDegree = 360 - degree;
        break;
      case "corner":
        newDegree = 180 + degree;
        break;
    }

    const fixedPoint = getLineEnd(
      lastPoint,
      distance,
      (newDegree * Math.PI) / 180,
    );

    pointToFix.top = fixedPoint.top;
    pointToFix.left = fixedPoint.left;
    return newDegree;
  }

  function getBoundaryHitType(point: Point, boundary: Boundary) {
    let type: BoundaryHitType | undefined = undefined;

    if (point.top < boundary.top) {
      type = "top";
    }

    if (point.top > boundary.bottom) {
      if (type) {
        type = "corner";
      } else {
        type = "bottom";
      }
    }

    if (point.left < boundary.left) {
      if (type) {
        type = "corner";
      } else {
        type = "left";
      }
    }

    if (point.left > boundary.right) {
      if (type) {
        type = "corner";
      } else {
        type = "right";
      }
    }

    if (!type) {
      return "none";
    } else {
      return type;
    }
  }

  function getLineEnd(start: Point, length: number, radians: number): Point {
    return {
      top: length * Math.cos(radians) + start.top,
      left: length * Math.sin(radians) + start.left,
      type: "middle",
    };
  }

  function loadLightElement() {
    let lightContainer;
    let light;
    let lightIndex = -1;

    // reuse an element if its idle

    for (let i = 0; i < lights.length; i++) {
      if (Date.now() > lights[i].inUseUntil) {
        lightContainer = lights[i].element;
        light = lightContainer.children.item(0) as HTMLDivElement;
        lightIndex = i;
        break;
      }
    }

    // otherwise create a new one

    if (!lightContainer || !light) {
      lightContainer = document.createElement("div");
      light = document.createElement("div");
      lightIndex = lights.length;

      lightContainer.append(light);
      mainContainer.current!.prepend(lightContainer);
    }

    return { lightContainer, light, lightIndex };
  }

  function setupLightAnimation(
    element: HTMLDivElement,
    path: Point[],
    appearDuration: number,
    disappearDuraiton: number,
  ) {
    const opacityTl = gsap.timeline({ paused: true });
    opacityTl.set(element, {
      opacity: 0,
    });

    opacityTl.to(element, {
      opacity: 1,
      ease: "sine.out",
      duration: appearDuration / 1000,
    });
    opacityTl.to(element, {
      opacity: 0,
      ease: "sine.in",
      duration: disappearDuraiton / 1000,
    });

    const movementSpeed =
      (appearDuration + disappearDuraiton) / 1000 / path.length;

    const movementTl = gsap.timeline({
      paused: true,
      defaults: { duration: movementSpeed, ease: "none" },
    });
    movementTl.set(element, {
      top: path[0].top,
      left: path[0].left,
    });

    for (let i = 1; i < path.length; i++) {
      movementTl.to(element, {
        top: path[i].top,
        left: path[i].left,
      });
    }

    opacityTl.play();
    movementTl.play();

    return { opacityTl, movementTl };
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
      <div
        ref={mainContainer}
        className="bg-gray-500 size-[300px] m-auto relative"
      >
        {renderPoints()}
        {renderLines()}
      </div>
    </div>
  );
}
