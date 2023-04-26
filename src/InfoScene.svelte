<script lang="ts">
  import { T, useFrame } from "@threlte/core";
  import { interactivity } from "@threlte/extras";
  import { OrthographicCamera, type PerspectiveCamera } from "three";
  import Gizmo from "./Gizmo.svelte";

  const frustumSize = 10;
  const gizmoSize = 1;

  export let defaultCamera: PerspectiveCamera;
  export let aspectRatio: number;
  export let camera = new OrthographicCamera(
    (-frustumSize * aspectRatio) / 2,
    (frustumSize * aspectRatio) / 2,
    frustumSize / 2,
    -frustumSize / 2,
    1,
    100
  );

  let quaternion: [number, number, number, number] = [0, 0, 0, 1];

  interactivity({
    compute: (event, state) => {
      state.pointer.update((p) => {
        const target = state.target.current;
        if (target) {
          const { x, y, width, height } = target.getBoundingClientRect();
          p.x = ((event.clientX - x) / width) * 2 - 1;
          p.y = -((event.clientY - y) / height) * 2 + 1;
        }

        return p;
      });
      state.raycaster.setFromCamera(state.pointer.current, camera);
    },
  });

  $: {
    camera.left = (-aspectRatio * frustumSize) / 2;
    camera.right = (aspectRatio * frustumSize) / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;
    camera.updateProjectionMatrix();
  }

  useFrame(
    ({ invalidate }) => {
      const q = defaultCamera.quaternion.clone();
      const { x, y, z, w } = q.invert();
      const updated: [number, number, number, number] = [x, y, z, w];
      if (updated.some((val, i) => quaternion[i] !== val)) {
        quaternion = updated;
        invalidate();
      }
    },
    { invalidate: false }
  );
</script>

<T is={camera} position={[0, 0, 2]} manual />
<T.Group
  position={[
    ((frustumSize - gizmoSize) * aspectRatio) / 2,
    (frustumSize - gizmoSize * 2) / 2,
    0,
  ]}
  {quaternion}
>
  <Gizmo size={gizmoSize} />
</T.Group>
