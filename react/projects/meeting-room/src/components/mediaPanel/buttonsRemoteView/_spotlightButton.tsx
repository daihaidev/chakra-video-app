import * as React from 'react';
import { IconButton, Tooltip } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";

export const SpotlightButton = () => {
  return (
    <Tooltip label="Spotlight View" hasArrow arrowSize={15}>
      <IconButton
        variant="solid"
        bg="gray.300"
        colorScheme="white"
        aria-label="Sindle User View"
        icon={<FaUser />}
        rounded="none"
        h="1.8rem"
        px="0.5rem"
      />
    </Tooltip>
  );
};