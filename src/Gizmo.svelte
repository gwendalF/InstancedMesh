<script lang="ts">
  import { T } from "@threlte/core";
  import DiceFace from "./DiceFace.svelte";
  import { Group, AxesHelper } from "three";

  export let size;

  let quaternion: [number, number, number, number] = [0, 0, 0, 1];
</script>

<T is={Group} position={[-size / 2, -size / 2, -size / 2]}>
  <DiceFace face="Back" {size} />
  <DiceFace face="Front" {size} />
  <DiceFace face="Top" {size} />
  <DiceFace face="Bottom" {size} />
  <DiceFace face="Left" {size} />
  <DiceFace face="Right" {size} />
  <T is={AxesHelper} args={[1.5]} />
</T>
