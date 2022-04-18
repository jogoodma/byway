import { useParams } from 'remix';

const StoreRoute = () => {
  const { store } = useParams();
  return (
    <div>
      <h1>Store Route</h1>
      <p>{store}</p>
    </div>
  );
};

export default StoreRoute
