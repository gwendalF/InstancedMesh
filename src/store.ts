import { writable } from "svelte/store";

export type Vicinity = {
  id: string;
  position: [number, number, number];
  orientation: [number, number, number, number];
  scale: [number, number, number];
  amplitude: number;
};

export const vicinities = writable<Vicinity[]>([]);
