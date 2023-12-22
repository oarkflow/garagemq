import {useMatch} from 'react-router';

export const isCurrentRoute = (path) => !!useMatch(path)

/*
const {hash} = useLocation()
return hash.replaceAll('#', '') === path
*/
