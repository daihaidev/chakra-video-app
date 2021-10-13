import * as React from "react";
import {
  Flex,
  Stack,
  Heading,
  CircularProgress
} from "@chakra-ui/react";

export const NotFound = () => {

  return (
    <Flex
      minH="calc(100vh)"
      align={"center"}
      justify={"center"}
      bgGradient="linear(to-r, orange.400,green.200)"
      bgSize="cover"
      bgRepeat="no-repeat"
      pos="absolute"
      left="0"
      top="0"
      w="100%"
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"2xl"}>Loading...</Heading>
          <CircularProgress isIndeterminate value={30} color="orange.400" thickness="12px" />
        </Stack>

      </Stack>
    </Flex>
  );
};
export default NotFound;
