<script lang="ts">
  import {
    Shape,
    ShapeGeometry,
    Mesh,
    MeshBasicMaterial,
    Group,
    BackSide,
    FrontSide,
    Vector3,
  } from "three";
  import { degToRad } from "three/src/math/MathUtils";
  import { Text, type EventMap } from "@threlte/extras";
  import { T, useThrelte } from "@threlte/core";

  type Face = "Left" | "Front" | "Top" | "Right" | "Back" | "Bottom";

  export let face: Face;
  export let size = 1;
  export let ratio = 1 / 4;
  export let radius = size * ratio;

  const origin = new Vector3(0, 0, 0);
  const { camera } = useThrelte();

  const getShape = (
    x: number,
    y: number,
    size: number,
    radius: number
  ): Shape => {
    const shape = new Shape();
    shape.moveTo(x, y + radius);
    shape.lineTo(x, y + size - radius);
    shape.quadraticCurveTo(x, y + size, x + radius, y + size);
    shape.lineTo(x + size - radius, y + size);
    shape.quadraticCurveTo(x + size, y + size, x + size, y + size - radius);
    shape.lineTo(x + size, y + radius);
    shape.quadraticCurveTo(x + size, y, x + size - radius, y);
    shape.lineTo(x + radius, y);
    shape.quadraticCurveTo(x, y, x, y + radius);
    return shape;
  };

  const frontShape = getShape(
    radius / 4,
    radius / 4,
    size - radius / 2,
    radius / 4
  );
  const backShape = getShape(0, 0, size, radius);

  const getPosition = (
    face: Face
  ): {
    position: [number, number, number];
    rotation: [number, number, number];
  } => {
    switch (face) {
      case "Front":
        return { position: [0, 0, size], rotation: [0, 0, 0] };
      case "Back": {
        return { position: [size, 0, 0], rotation: [0, degToRad(180), 0] };
      }
      case "Left":
        return { position: [0, 0, 0], rotation: [0, -degToRad(90), 0] };
      case "Right":
        return { position: [size, 0, size], rotation: [0, degToRad(90), 0] };
      case "Top":
        return { position: [0, size, size], rotation: [-degToRad(90), 0, 0] };
      case "Bottom":
        return { position: [0, 0, 0], rotation: [degToRad(90), 0, 0] };
      default:
        return { position: [0, 0, 0], rotation: [0, 0, 0] };
    }
  };

  const getTextPosition = (): {
    position: [number, number, number];
    rotation: [number, number, number];
  } => {
    return { position: [size / 2, size / 2, size / 30], rotation: [0, 0, 0] };
  };

  const facePosition = getPosition(face);
  const textPosition = getTextPosition();

  const overColor = "#3edddd";
  const frontColor = "#ffffff";
  const backColor = "#9b9796";
  let colorFront = frontColor;
  let colorBack = backColor;

  const clickHandler = (e: EventMap["click"], reverse = false) => {
    e.stopPropagation();
    if (e.face) {
      const q = e.eventObject.quaternion.clone().invert();
      const updated = e.face.normal;
      switch (face) {
        case "Front":
        case "Back":
          break;
        default:
          updated.negate();
      }
      updated.applyQuaternion(q).normalize();
      const distance = $camera.position.distanceTo(origin);
      console.log({
        distance,
        pos: $camera.position,
        updated,
      });
      const newPosition = updated.multiplyScalar(distance);
      console.log(newPosition.distanceTo(origin));
      $camera.position.set(newPosition.x, newPosition.y, newPosition.z);
      $camera.lookAt(new Vector3(0, 0, 0));
    }
  };
</script>

<T.Group>
  <T.Group
    position={facePosition.position}
    rotation={facePosition.rotation}
    on:pointerenter={(e) => {
      e.stopPropagation();
      colorFront = overColor;
    }}
    on:pointerleave={(e) => {
      e.stopPropagation();
      colorFront = frontColor;
    }}
    on:click={(e) => {
      e.stopPropagation();
      console.log(e);
      clickHandler(e);
    }}
  >
    <Text
      text={face}
      color="black"
      anchorX="center"
      anchorY="middle"
      position={textPosition.position}
      rotation={textPosition.rotation}
      fontSize={0.2}
    />
    <T.Mesh>
      <T is={ShapeGeometry} args={[frontShape]} />
      <T is={MeshBasicMaterial} color={colorFront} side={FrontSide} />
    </T.Mesh>
  </T.Group>
  <T.Group
    position={facePosition.position}
    rotation={facePosition.rotation}
    on:pointerenter={(e) => {
      e.stopPropagation();
      colorBack = overColor;
    }}
    on:pointerleave={(e) => {
      e.stopPropagation();
      colorBack = backColor;
    }}
    on:click={(e) => {
      console.log(e);
      clickHandler(e, true);
    }}
  >
    <T.Mesh>
      <T is={ShapeGeometry} args={[backShape]} />
      <T is={MeshBasicMaterial} color={colorBack} side={BackSide} />
    </T.Mesh>
  </T.Group>
</T.Group>
