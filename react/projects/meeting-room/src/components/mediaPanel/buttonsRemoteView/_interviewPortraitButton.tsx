import * as React from 'react';
import { Button, Divider, Tooltip } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";

export const InterviewPortraitButton = () => {
  return (
    <Tooltip label="Interview Portrait View" hasArrow arrowSize={15}>
      <Button
        variant="solid"
        bg="gray.300"
        colorScheme="white"
        aria-label="Sindle User View"
        leftIcon={<FaUser />}
        rightIcon={<FaUser />}
        rounded="none"
        h="1.8rem"
        px="0.5rem"
      >
        <Divider orientation="vertical" />
      </Button>
    </Tooltip>
  );
};