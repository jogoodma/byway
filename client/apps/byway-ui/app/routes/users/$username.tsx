import { useParams } from 'remix';

const UserRoute = () => {
  const { username } = useParams();
  return (
    <div>
      <h1>User Route</h1>
      <p>{username}</p>
    </div>
  );
};

export default UserRoute