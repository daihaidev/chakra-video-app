import * as React from 'react';
import { List } from "@chakra-ui/react";
import Badge from './_badge';
import { badgeIdsSelector } from '../../../recoil/atoms/badges';
import { useRecoilValue } from 'recoil';

const BadgesList = () => {
  const badgeIdsList = useRecoilValue(badgeIdsSelector) as string[];

  return (
    <List spacing={4} overflowY="auto" overflowX="hidden" h="calc(100vh - 64px - 20px)">
      {badgeIdsList?.map((bid: string) => (<Badge badgeId={bid} key={bid} />))}; {/** TODO: confirm badgeIdList is string array  */}
    </List>
  );
};
export default BadgesList;