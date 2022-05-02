import { useParams } from "remix";

const StoreEditRoute = () => {
  const { store } = useParams();
  return (
    <div>
      <h1>Store Edit Route</h1>
      <p>{store}</p>
    </div>
  );
};

export default StoreEditRoute;
