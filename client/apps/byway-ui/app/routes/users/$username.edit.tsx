import { useParams } from 'remix';

const UserEditRoute = () => {
  const { username } = useParams();
  return (
    <div>
      <h1>User Edit Route</h1>
      <p>{username}</p>
    </div>
  );
};

export default UserEditRoute
