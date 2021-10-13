import * as React from 'react';
import { List } from "@chakra-ui/react";
import Banner from './_banner';
import { bannerIdsSelector } from '../../../recoil/atoms/banners';
import { useRecoilValue } from 'recoil';

const BannersList = () => {
  const bannersIdsList = useRecoilValue(bannerIdsSelector) as string[];

  return (
    <List spacing={3} overflowY="auto" overflowX="hidden" h="calc(100vh - 64px - 20px)">
      {bannersIdsList.map((bid: string) => (<Banner bannerId={bid} key={bid} />))}; {/** TODO: confirm bannersIdsList is string array  */}
    </List>
  );
};
export default BannersList;

