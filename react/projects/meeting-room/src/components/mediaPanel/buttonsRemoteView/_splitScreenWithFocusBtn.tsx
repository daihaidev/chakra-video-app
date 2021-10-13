import * as React from 'react';
import { Button, GridItem, Grid, Tooltip } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";

export const SplitScreenWithFocusBtn = () => {
  return (
    <Tooltip label="Split Screen With Focus" hasArrow arrowSize={15}>
      <Button
        variant="solid"
        bg="gray.300"
        colorScheme="white"
        aria-label="Sindle User View"
        rounded="none"
        h="1.8rem"
        px="0.5rem"
      >
        <Grid
          h="1.8rem"
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(2, 1fr)"
          gap={1}
        >
          <GridItem rowSpan={2} pt={1.5}>
            <FaUser />
          </GridItem>

          <GridItem colSpan={1} pt={0.5} pb={0}>
            <FaUser size="0.6rem" />
          </GridItem>

          <GridItem colSpan={1} pt={0} pb={0.5}>
            <FaUser size="0.6rem" />
          </GridItem>
        </Grid>
      </Button>
    </Tooltip>
  );
};