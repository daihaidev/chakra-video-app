import * as React from 'react';
import { Button, GridItem, Grid, Tooltip } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";

export const ScreenshareWithHostsBtn = () => {
  return (
    <Tooltip label="Screen share With Hosts" hasArrow arrowSize={15}>
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
          gap={0}
        >
          <GridItem colSpan={1} pt="0.2rem" pb="0">
            <FaUser size="0.6rem" />
          </GridItem>

          <GridItem rowSpan={2} h="1.1rem" px="0.7rem" mt="0.35rem" ml="-x0.1rem" bg="white" />

          <GridItem colSpan={1} pt="0.1rem" pb={0.2}>
            <FaUser size="0.6rem" />
          </GridItem>
        </Grid>
      </Button>
    </Tooltip>
  );
};