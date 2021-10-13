import * as React from 'react';
import {
  Box,
  Flex,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
  Button
} from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { popupSelector } from '../../../recoil/atoms/popup';
import { useSetRecoilState } from 'recoil';
import { OverlayModel } from '../../../recoil/atoms/overlay/types';

const BadgeOverlay = ({ id, title, description, currentPrice, oldPrice, sellerEmail, image, checkoutUrl, buttonText }: OverlayModel) => {
  const setPopup = useSetRecoilState(popupSelector);
  const badgeObj = { id: id, title: title, checkoutUrl: checkoutUrl };
  return (
    <Stat
      id={id}
      px={{ base: 2, md: 2 }}
      py={'2'}
      borderWidth="1px"
      borderStyle="solid"
      borderColor="gray.300"
      rounded={'lg'}
      roundedBottomLeft={'none'}
      roundedTopLeft={'none'}
      bg="white"
    >
      <Flex justifyContent='space-between'>
        <Box my={'auto'} alignContent={'center'}>
          <Image src={image} alt={title} boxSize="75px" objectFit="cover" />
        </Box>
        <Box pl="0.5rem" w="65%">
          <StatLabel fontWeight={'medium'} isTruncated>{title}</StatLabel>
          <StatHelpText maxHeight="85px" overflowY="auto">{description}</StatHelpText>
          <StatNumber fontSize={'md'} fontWeight={'medium'} display={'inline'} mr={'0.6rem'}>
            {currentPrice}
          </StatNumber>
          <StatNumber fontSize={'md'} fontWeight={'medium'} textDecoration={'line-through'} color={'red.600'} display={'inline'} mr={'0.6rem'}>
            {oldPrice}
          </StatNumber>
          {/* <Text fontWeight={400} fontSize={'md'} color={'gray.600'} display={'inline'}>
                            (inc.tax)
                        </Text> */}
          {
            // Show email icon only if email is available.
            (!!sellerEmail) ?
              <Text fontWeight={400} fontSize={'xs'} color={'tomato'} textDecoration={'underline'}>
                <EmailIcon mr="0.4rem" />{sellerEmail}
              </Text>
              : null
          }
        </Box>
        <Box mt="auto" alignContent={'end'}>
          <Button
            colorScheme="teal"
            variant="outline"
            size="sm"
            onClick={() => setPopup(badgeObj)}
          >
            {buttonText}
          </Button>
        </Box>
      </Flex>
    </Stat>
  );
};
export default BadgeOverlay;