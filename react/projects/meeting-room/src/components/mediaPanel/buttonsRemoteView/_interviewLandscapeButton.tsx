import * as React from 'react';
import { Button, GridItem, Grid, Tooltip } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";

export const InterviewLandscapeButton = () => {
  return (
    <Tooltip label="Interview Landscape View" hasArrow arrowSize={15}>
      <Button
        variant="solid"
        bg="gray.300"
        colorScheme="white"
        aria-label="Sindle User View"
        rounded="none"
        h="1.8rem"
        px="0.5rem"
      >
        <Grid templateColumns="repeat(2, 1fr)" gap={0.5}>
          <GridItem bg="blackAlpha.100" p={0.5}>
            <FaUser />
          </GridItem>
          <GridItem bg="blackAlpha.100" p={0.5}>
            <FaUser />
          </GridItem>
        </Grid>
      </Button>
    </Tooltip>
  );
};