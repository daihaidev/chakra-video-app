/**
 * Copyright (c) 2021 MeetOnline.io
 *
 * long description for the file
 *
 * @summary Error Message Component
 * @author Rishabh <rishabh.it.007@gmail.com>
 *
 * Created at     : 2021-02-26 12:00:00 
 * Last modified  : 2021-02-26 12:00:00 
 */
import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from "@chakra-ui/react";
import { errorSelector } from '../../../recoil/atoms/error';
import { useRecoilState } from 'recoil';

const ErrorMessage = () => {
  const [visible, setVisible] = React.useState(true);
  const [error, setError] = useRecoilState(errorSelector);

  const closeError = () => {
    setVisible(false);
    setError(null);
  }

  if (!visible) return null;

  if (!error) return null;

  if (!error?.title) return null;


  return (
    <Alert status="error" zIndex="100000">
      <AlertIcon />
      <AlertTitle mr={2}>{error.title}</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
      <CloseButton position="absolute" right="8px" top="8px" onClick={closeError} />
    </Alert>
  );
};

export default ErrorMessage;
