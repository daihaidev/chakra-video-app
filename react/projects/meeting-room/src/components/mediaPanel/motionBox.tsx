import { Box } from "@chakra-ui/react"
import { motion } from "framer-motion"
import React from "react"

import { HTMLChakraProps } from "@chakra-ui/react"
import { HTMLMotionProps } from "framer-motion"

export type Merge<P, T> = Omit<P, keyof T> & T
export type MotionBoxProps = Merge<
  HTMLChakraProps<'div'>,
  HTMLMotionProps<'div'>
>

interface VideoControlsProps extends MotionBoxProps {
  initial?: string
  variants?: {
    visible: {
      opacity: number
    }
    hidden: {
      opacity: number
    }
  }
};

export const MotionBox = motion(Box);

const VideoControls = ({
  initial,
  variants,
  children,
  ...props
}: VideoControlsProps) => {
  return (
    <MotionBox
      d="flex"
      flexDirection="row"
      justifyContent="space-between"
      p="2"
      initial={initial}
      variants={variants}
      zIndex="docked"
      {...props}
    >
      {children}
    </MotionBox>
  )
};

export default VideoControls;