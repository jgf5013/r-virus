
import { useSignal } from "@preact/signals-react/runtime";
import { archetypeOptions, archetypes, currentForm, DEFAULT_ARCHETYPE, MAX_INDEX, MIN_INDEX, updateArchetypeCorollaries } from "@state/form-controls";

import { NumberInput, Paper, Select } from '@mantine/core';
import { findArchetypeByLabel } from "@utils/state";
import { useState } from "preact/hooks";
import { useInputControlForm } from './InputControlContext';
import { InputControlPopover } from "./InputControlPopover";
import styles from './InputControls.module.css';
import { Refresh } from "./Refresh";


type ValidateProps = { value: number; range: [number, number] };

const validate = ({ value, range }: ValidateProps) => {
  if (value < range[MIN_INDEX] || value > range[MAX_INDEX]) {
    return `Range: ${range[MIN_INDEX]} - ${range[MAX_INDEX]}`;
  }
  return null;
};

const InputControls = () => {
  
  useSignal();

  const markAllFieldsTouched = () => {
    form.setTouched(() => ({
      reproductionNumber: true,
      serialInterval: true,
      mu: true,
      dispersion: true,
      populationSize: true,
      seedInfected: true,
      archetype: true,
    }));
  };
    
  const [archetype, _] = useState(currentForm.value.archetype);

  const initialValues = {
    archetype: currentForm.value.archetype,
    reproductionNumber: currentForm.value.reproductionNumber,
    serialInterval: currentForm.value.serialInterval,
    mu: currentForm.value.mu,
    dispersion: currentForm.value.dispersion,
    populationSize: currentForm.value.populationSize,
    seedInfected: currentForm.value.seedInfected,
  };
  
  const form = useInputControlForm({
    mode: 'controlled',
    validateInputOnChange: true,
    initialValues,
    validate: {
      reproductionNumber: () => {
        const archetypeCorollaries = findArchetypeByLabel(archetypes, currentForm.value.archetype)?.corollaries ?? archetypes[DEFAULT_ARCHETYPE].corollaries;

        const min = archetypeCorollaries?.reproductionNumber.range[MIN_INDEX] as number;
        const max = archetypeCorollaries?.reproductionNumber.range[MAX_INDEX] as number;
        return validate({ value: currentForm.value.reproductionNumber, range: [min, max] });
      },
      serialInterval: () => {
        const archetypeCorollaries = findArchetypeByLabel(archetypes, currentForm.value.archetype)?.corollaries ?? archetypes[DEFAULT_ARCHETYPE].corollaries;
        const min = archetypeCorollaries?.serialInterval.range[MIN_INDEX] as number;
        const max = archetypeCorollaries?.serialInterval.range[MAX_INDEX] as number;
        return validate({ value: currentForm.value.serialInterval, range: [min, max] });
      },
      mu: () => validate({ value: currentForm.value.mu, range: [0, 100] }),
      dispersion: () => validate({ value: currentForm.value.dispersion, range: [0, 10] }),
      populationSize: () => validate({ value: currentForm.value.populationSize, range: [10, 1e10] }),
      seedInfected: () => validate({ value: currentForm.value.seedInfected, range: [1, 10] }),
    },
    onValuesChange: (values) => {
      if(values.archetype && values.archetype !== archetype) {
        handleArchetypeChange(values.archetype);
        return;
      }
      currentForm.value = {
        ...currentForm.value,
        ...values
      };
      markAllFieldsTouched();
      form.validate();
    },
  });

  const handleArchetypeChange = (newArchetype: string | null) => {
    updateArchetypeCorollaries(newArchetype as typeof archetypeOptions[number]);
  };


  return (
    <Paper shadow="xs" p="sm" className={styles.inputControls}>

      <Refresh className={styles.refresh} />
      <form className={styles.inputControlOptions}>
        <Select
          label={<span className={styles.label}>Archetype<InputControlPopover info="Some info about archetype" /></span>}
          data={archetypeOptions}
          key={form.key('archetype')}
          {...form.getInputProps('archetype')}
        />
        <NumberInput
          hideControls
          label={<span className={styles.label}>Reproduction Number<InputControlPopover info="Some info about reproduction number" /></span>}
          {...form.getInputProps('reproductionNumber')}
          value={currentForm.value.reproductionNumber}
        />
        <NumberInput
          hideControls
          label={<span className={styles.label}>Serial Interval<InputControlPopover info="Some info about serial interval" /></span>}
          {...form.getInputProps('serialInterval')}
          value={currentForm.value.serialInterval}
        />
        <NumberInput
          hideControls
          {...form.getInputProps('mu')}
          label={<span className={styles.label}>Mean Degree<InputControlPopover info="Some info about mean degree" /></span>}
          value={currentForm.value.mu}
        />
        <NumberInput
          hideControls
          {...form.getInputProps('dispersion')}
          label={<span className={styles.label}>Dispersion<InputControlPopover info="Some info about dispersion" /></span>}
          value={currentForm.value.dispersion}
        />
        <NumberInput
          hideControls
          {...form.getInputProps('populationSize')}
          clampBehavior="none"
          label={<span className={styles.label}>Population<InputControlPopover info="Some info about population" /></span>}
          value={currentForm.value.populationSize}
        />
      </form>
    </Paper>
  )
};

export { InputControls };
