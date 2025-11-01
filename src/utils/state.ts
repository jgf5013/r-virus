import type { Archetype, ArchetypeOption } from "@state/form-controls";

// Helper function to find an archetype by its label
export const findArchetypeByLabel = (archetypes: Record<string, Archetype>, value: ArchetypeOption): Archetype | undefined => {
  return Object.values(archetypes).find(archetype => archetype.label === value);
};