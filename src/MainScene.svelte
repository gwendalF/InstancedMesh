<script lang="ts">
  import {
    Instance,
    InstancedMesh,
    OrbitControls,
    interactivity,
  } from "@threlte/extras";
  import { T } from "@threlte/core";
  import { writable } from "svelte/store";
  import { nanoid } from "nanoid";
  import { AdditiveBlending, PerspectiveCamera } from "three";
  import { degToRad } from "three/src/math/MathUtils";
  import { vicinities } from "./store";
  import { Vector3 } from "three";

  export let camera = new PerspectiveCamera();

  interactivity({
    compute: (event, state) => {
      state.pointer.update((p) => {
        const target = state.target.current;
        if (target) {
          const { x, y, width, height } = target.getBoundingClientRect();
          p.x = ((event.clientX - x) / width) * 2 - 1;
          p.y = (-(event.clientY - y) / height) * 2 + 1;
        }
        return p;
      });
      state.raycaster.setFromCamera(state.pointer.current, camera);
    },
  });
  // Capsule color
  const capsuleColor = "#bababa";
</script>

<T is={camera} makeDefault fov={50} position={[0.75, 0.75, 0.3]}>
  <OrbitControls
    on:create={({ ref }) => {
      ref.update();
    }}
  />
</T>

<T.AmbientLight intensity={5} />

<T.Mesh>
  <T.CapsuleGeometry args={[0.12, 0.18, 10, 20]} />
  <T.MeshStandardMaterial
    color={capsuleColor}
    transparent={true}
    opacity={0.5}
  />
</T.Mesh>

<T.DirectionalLight intensity={2} position={[1, 1, 1]} />
<T.GridHelper args={[20, 100, "#FFBB00", "#4E4E4E"]} />

{#each $vicinities as v, i (v.id)}
  {@const position = new Vector3(
    v.position[0],
    v.position[1],
    v.position[2]
  ).applyAxisAngle(
    new Vector3(0, 1, 0),
    degToRad((180 * i) / $vicinities.length)
  )}
  <T.Mesh
    scale={v.scale}
    position.x={position.x}
    position.y={position.y}
    position.z={position.z}
  >
    <T.SphereGeometry />
    <T.MeshToonMaterial color="#0006b1" blending={AdditiveBlending} />
  </T.Mesh>
{/each}

<InstancedMesh>
  <T.SphereGeometry />
  <T.MeshToonMaterial color="#ffffff" blending={AdditiveBlending} />
  {#each $vicinities as v, i (v.id)}
    {@const position = new Vector3(
      v.position[0],
      v.position[1],
      v.position[2]
    ).applyAxisAngle(
      new Vector3(0, 1, 0),
      degToRad((i * 90) / $vicinities.length)
    )}
    <Instance
      position.x={position.x}
      position.y={position.y}
      position.z={position.z}
      scale={v.scale.map((v) => v * 1.2)}
      on:click={(e) => {
        e.stopPropagation();
        console.log({ position, base: v.position });
      }}
    />
  {/each}
</InstancedMesh>
