import { createFormContext } from '@mantine/form';

interface InputControlFormValues {
  archetype: string;
  reproductionNumber: number;
  serialInterval: number;
  mu: number;
  dispersion: number;
  populationSize: number;
  seedInfected: number;
}

// You can give context variables any name
export const [InputControlFormProvider, useInputControlFormContext, useInputControlForm] =
  createFormContext<InputControlFormValues>();