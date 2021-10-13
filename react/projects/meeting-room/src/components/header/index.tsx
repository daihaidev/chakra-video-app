import {
  Box,
  Flex,
  HStack,
  Link,
  useDisclosure,
  Stack,
  Image
} from '@chakra-ui/react';
import Logo from '../../assets/images/logo.png';
import { useRecoilValue } from 'recoil';
import { roomSelector } from '../../recoil/atoms/room';
import ErrorMessage from '../common/errormessage';

const Links: React.ReactElement[] = [];

interface NavLinkProps {
  children: React.ReactElement
}

const NavLink = ({ children }: NavLinkProps) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{ textDecoration: 'none', bg: 'gray.200' }}
    href={'#'}>
    {children}
  </Link>
);

const Header = () => {
  const { isOpen } = useDisclosure();
  const room = useRecoilValue(roomSelector);
  return (
    <>
      <Box bg={room?.branding?.roomHeaderColor ? room.branding.roomHeaderColor : 'blue.100'} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>

          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Image
                boxSize="40px"
                src={room?.branding?.roomHeaderIcon ? room.branding.roomHeaderIcon : Logo}
                alt="MO Logo"
              />
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map((link, index) => (
                <NavLink key={index}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>

        </Flex>

        {isOpen ? (
          <Box pb={4}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link, index) => (
                <NavLink key={index}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
      <ErrorMessage />
    </>
  );
}
export default Header;