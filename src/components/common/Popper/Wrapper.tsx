import PropTypes from 'prop-types';

type Props = {
    children: JSX.Element;
};

function Wrapper({ children }: Props) {
    return (
        <div className="flex flex-col w-full max-h-[calc((100vh - 96px) - 60px),734px] min-h-100px pt-8 rounded-md bg-white shadow-md">
            {children}
        </div>
    );
}

export default Wrapper;
