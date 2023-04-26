<script lang="ts">
  import {
    Scene,
    type PerspectiveCamera,
    type OrthographicCamera,
  } from "three";
  import { useRender, T } from "@threlte/core";
  import MainScene from "./MainScene.svelte";
  import InfoScene from "./InfoScene.svelte";

  export let height: number;
  export let width: number;

  const mainScene = new Scene();
  const infoScene = new Scene();
  let mainCamera: PerspectiveCamera;
  let infoCamera: OrthographicCamera;

  useRender(({ renderer }) => {
    if (!renderer) {
      return;
    }
    renderer.autoClear = false;
    renderer.render(mainScene, mainCamera);
    renderer.render(infoScene, infoCamera);
  });
</script>

<T is={mainScene}>
  <MainScene bind:camera={mainCamera} />
</T>
<T is={infoScene}>
  <InfoScene
    bind:camera={infoCamera}
    aspectRatio={width / height}
    defaultCamera={mainCamera}
  />
</T>
