import queryString from "query-string";
import { currentUserNameAtom } from '../../recoil/atoms/users';
import { useRecoilValue } from 'recoil';

const useQuery = () => {

    const currentUserName = useRecoilValue(currentUserNameAtom);
    
    const urlParamsString = window.location.search + window.location.hash;
    const _options = {parseBooleans: true, parseNumbers: false}
    let queryObj = queryString.parse(urlParamsString, _options);
    if (!queryObj.roomHash) {
      queryObj.roomHash = window.location.pathname.replace("/", "").trim();
    }
    queryObj.userName = currentUserName;

    return queryObj;
  };

  export default useQuery;