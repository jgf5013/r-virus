import { ActionIcon, Popover, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconQuestionMark } from "@tabler/icons-react";

type InputControlPopoverProps = {
  info: string;
};

export const InputControlPopover = ({info}: InputControlPopoverProps) => {
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover position="right" withArrow opened={opened}>
      <Popover.Target>
          <ActionIcon size="xs" variant="outline" radius="xl" aria-label="Settings" onMouseEnter={open} onMouseLeave={close}>
            <IconQuestionMark size={12} />
          </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: 'none' }}>
        <Text size="sm">{info}</Text>
      </Popover.Dropdown>
    </Popover>
  );
};