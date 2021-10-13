import * as React from 'react';
import { Button } from "@chakra-ui/react";
import { PlusSquareIcon, MinusIcon } from '@chakra-ui/icons';

interface MouseHoverButtonsProps {
  isPublished: boolean;
  isHovered: boolean;
  toggleOverlay: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const MouseHoverButtons = ({ isPublished, isHovered, toggleOverlay }: MouseHoverButtonsProps) => {
  if (!isHovered) return null;

  if (isPublished) {
    return (
      <Button
        leftIcon={<MinusIcon />}
        variant="ghost"
        _hover={{}}
        pos="absolute"
        zIndex="10000"
        opacity="1"
        fontWeight="bold"
        onClick={toggleOverlay}
      >
        Hide
      </Button>
    );
  }
  return (
    <Button
      leftIcon={<PlusSquareIcon />}
      variant="ghost"
      _hover={{}}
      pos="absolute"
      zIndex="10000"
      opacity="1"
      fontWeight="bold"
      onClick={toggleOverlay}
    >
      Show
    </Button>
  );
};

export default MouseHoverButtons;