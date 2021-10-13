import * as React from 'react';
import { Button, VStack, Text, Center } from "@chakra-ui/react";

interface LocalButtonProps {
  isHidden?: boolean;
  enabled?: boolean;
  setter?: (status: boolean) => void;
  handler?: () => void;
  id: string;
  icons: React.ReactElement[];
  names: string[];
}

const LocalButton = (props: LocalButtonProps) => {

  if (props.isHidden) return null;

  return (
    <Button
      key={props.id}
      py="1.5rem"
      w="calc((66.66vw - 120px) / 7)"
      minW="99px"
      maxW="115px"
      px="0px"
      bg="white"
      _hover={{ textColor: "#000" }}
      _focus={{ textColor: "#000" }}
      onClick={() => {
        if (props.setter) {
          props.setter(!props.enabled)
        }
        if (props.handler) {
          props.handler()
        }
      }}
      onTouchStart={() => {
        if (props.setter) {
          props.setter(!props.enabled)
        }
        if (props.handler) {
          props.handler()
        }
      }}
    >
      <VStack>
        <Center minW="1rem">
          <>{props.icons.length > 1 ? (props.enabled ? props.icons[1] : props.icons[0]) : props.icons[0]}</>
        </Center>
        <Center minW="1rem">
          <Text fontSize="0.75em">
            {((props.enabled ? props.names[1] : props.names[0]))}
          </Text>
        </Center>
      </VStack>
    </Button>
  );
};

export default LocalButton;