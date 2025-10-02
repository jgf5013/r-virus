import { ActionIcon, type ActionIconProps } from "@mantine/core";
import { useSignals } from "@preact/signals-react/runtime";
import { createNewRun, currentSimulationRunStatus, displayedRunId, maxRunId, MultiRunStatuses, markRunAsCompleted } from "@state/simulation-runs";
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';

type RefreshProps = ActionIconProps;

const Refresh = (props: RefreshProps) => {
  useSignals();

  const handleOnPlayClick = () => {
    createNewRun();
    displayedRunId.value = maxRunId.value;
  };

  const handleOnStopClick = () => {
    markRunAsCompleted();
  };

  const isCurrentlyRunning = currentSimulationRunStatus.value !== MultiRunStatuses.COMPLETED;

  if(isCurrentlyRunning) {
    return (
      <ActionIcon
        gradient={{ from: 'gray', to: 'dark', deg: 90 }}
        variant="filled"
        size="xl"
        radius="xl"
        aria-label="Stop simulation"
        onClick={handleOnStopClick}
        {...props}
      >
        <IconPlayerStop />
      </ActionIcon>
    );
  }


  return (
    <ActionIcon
      gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
      variant="filled"
      size="xl"
      radius="xl"
      aria-label="Settings"
      onClick={handleOnPlayClick}
      {...props}
    >
      <IconPlayerPlay />
    </ActionIcon>
  );
};

export { Refresh };
