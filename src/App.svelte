<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";
  import { vicinities } from "./store";
  import { nanoid } from "nanoid";
  let w: number;
  let h: number;
</script>

<main
  class="h-screen w-screen relative bg-black"
  bind:clientWidth={w}
  bind:clientHeight={h}
>
  <Canvas size={{ width: w, height: h }}>
    <Scene height={h} width={w} />
  </Canvas>
  <button
    class="absolute bg-red-600 top-0 left-0"
    on:click={() => {
      vicinities.update((v) => {
        v.push({
          id: nanoid(),
          position: [0, 0.1, 0.1],
          orientation: [0, 0, 0, 1],
          scale: [0.075, 0.075, 0.075],
          amplitude: 100,
        });
        return v;
      });
    }}>Add vicinity</button
  >
</main>
