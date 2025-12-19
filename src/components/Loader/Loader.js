import { BounceLoader } from 'react-spinners';

const Loader = ({ loading, size = 115 }) => {
  return (
    <div
      style={{
        width: '90vw',
        height: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <BounceLoader
        color={'#b5156dff'}
        loading={loading}
        size={size}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  );
};

export default Loader;
