import * as React from 'react';
import { useRecoilState } from 'recoil';
import { alertSelector } from '../../../recoil/atoms/alert';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

interface AlertProps {
  title: string;
  description: string;
  cancelButtonName: string;
  actionButtonName: string;
  actionFunction: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Alert = ({ title, description, cancelButtonName, actionButtonName, actionFunction }: AlertProps) => {
  const cancelRef = React.useRef(null);
  const [isOpen, setIsOpen] = useRecoilState(alertSelector);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setIsOpen(false)}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            {description}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
              {cancelButtonName}
            </Button>
            <Button colorScheme="red" onClick={actionFunction} ml={3}>
              {actionButtonName}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
