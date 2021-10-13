import * as React from 'react';
import { Button, GridItem, Grid, Tooltip } from "@chakra-ui/react";

export const ScreenshareBtn = () => {
  return (
    <Tooltip label="Screen share" hasArrow arrowSize={15}>
      <Button
        variant="solid"
        bg="gray.300"
        colorScheme="white"
        aria-label="Sindle User View"
        rounded="none"
        h="1.8rem"
        px="0.5rem"
      >
        <Grid>
          <GridItem h="1.1rem" mt="0.06rem" bg="white" px="0.8rem" />
        </Grid>
      </Button>
    </Tooltip>

  );
};