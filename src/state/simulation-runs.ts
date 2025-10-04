import { computed, signal } from "@preact/signals-react";
import { currentForm, DataElement, FormValues } from "@state/form-controls";
import { ModelReferences, ModelType } from "./chart";

const INITIAL_RUN_ID = 1;

export type LoadingChart = {
  status: SimulationRunStatus;
  modelType: ModelType;
};

export type LoadedChart = {
  status: SimulationRunStatus;
  modelType: ModelType;
  data: DataElement[];
};

export type Chart = LoadingChart | LoadedChart;


type EndStat = {
  totalRecovered: number;
};

export type SimulationRun = {
  formValues: FormValues;
  charts: Chart[];
  endStats: EndStat;
};

export type MultiSimulationRun = {
  [runId: number]: SimulationRun;
};

export const MultiRunStatuses = {
  LOADING_R: 'LOADING_R',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
} as const;


export const SimulationRunStatuses = {
  LOADING_R: 'LOADING_R',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
} as const;

export type MultiRunStatus = keyof typeof MultiRunStatuses;
export type SimulationRunStatus = keyof typeof SimulationRunStatuses;

export const displayedRunId = signal<number>(INITIAL_RUN_ID);
export const maxRunId = signal<number>(INITIAL_RUN_ID);

export const simulationRuns = signal<MultiSimulationRun>({
  [INITIAL_RUN_ID]: {
    formValues: {
      ...currentForm.value,
    },
    charts: [],
    endStats: { totalRecovered: 0 },
  },
});


export const createNewRun = () => {
  maxRunId.value += 1;
  simulationRuns.value = {
    ...simulationRuns.value,
    [maxRunId.value]: {
      formValues: {
        ...currentForm.value,
      },
      charts: [],
      endStats: { totalRecovered: 0 },
    },
  };
};

export const markRunAsCompleted = () => {
  simulationRuns.value = {
    ...simulationRuns.value,
    [maxRunId.value]: {
      ...simulationRuns.value[maxRunId.value],
      charts: simulationRuns.value[maxRunId.value].charts.map((chart) => ({
        ...chart,
        status: SimulationRunStatuses.COMPLETED,
      })),
      formValues: {
        ...currentForm.value,
      },
      endStats: { totalRecovered: 0 },
    },
  };
};

export const executingSimulationRunNumber = computed(() => {
  return Math.max(...Object.keys(simulationRuns.value).map(Number));
});

export const displayedSimulationRun = computed(() => simulationRuns.value[displayedRunId.value]);

export const currentSimulationRunStatus = computed(() => {
  const hasSimulationStillRunning = Object.entries(simulationRuns.value[maxRunId.value].charts).some(([_, result]) => {
    return result.status === SimulationRunStatuses.IN_PROGRESS;
  });
  if (hasSimulationStillRunning) {
    return MultiRunStatuses.IN_PROGRESS;
  }
  const isLoadingR = Object.entries(simulationRuns.value[maxRunId.value].charts).some(([_, result]) => {
    return result.status === SimulationRunStatuses.LOADING_R;
  });
  if (isLoadingR) { 
    return MultiRunStatuses.LOADING_R;
  }
  return MultiRunStatuses.COMPLETED;
});

type RecoveredStats = {
  [modelReference: string]: {
    recovered: number;
    time: number;
  } | undefined;
}

export const recoveredStats = computed(() => {
  const d: RecoveredStats = {};
  Object.entries(ModelReferences).forEach(([modelType, _]) => {
    const chart = displayedSimulationRun.value.charts.find(
      (c) => c.modelType === modelType && (c as LoadedChart).data
    ) as LoadedChart | undefined;
    const data = chart?.data ?? [];
    d[modelType] = {
      recovered: data[data.length - 1]?.state?.R ?? 0,
      time: data.find((d) => data[data.length - 1]?.state?.R === d.state?.R)?.time ?? 0,
    };
  });
  return d;
})