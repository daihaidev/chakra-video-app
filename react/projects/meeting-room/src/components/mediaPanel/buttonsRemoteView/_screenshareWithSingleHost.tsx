import * as React from 'react';
import { Button, GridItem, Grid, Tooltip } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";

export const ScreenshareWithSingleHost = () => {
  return (
    <Tooltip label="Screen share With Single Host" hasArrow arrowSize={15}>
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
          <GridItem p={0.5}>
            <FaUser />
          </GridItem>
          <GridItem h="1.1rem" w="1.5rem" mt="0.06rem" bg="white" />
        </Grid>
      </Button>
    </Tooltip>
  );
};