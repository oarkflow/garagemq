import type {FC, ReactNode} from 'react';

interface IProps {
    children?: ReactNode;
}

export const NotFound: FC<IProps> = () => {
    return <div>notfound</div>;
};
