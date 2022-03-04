import { useLoaderData } from "remix"
import type { LoaderFunction } from "remix";

type UserChannel = {
  name: string,
  eci: string,
}

type User = {
  firstName: string,
  surname: string,
  email: string,
  password: string,
}

async function fetchUserChannels(eci:string): Promise<UserChannel[]> {
  const resp = await fetch(`http://buyer-server:3000/c/${eci}/query/byway.user.manager/userChannels`, {method:"POST"})
  if (resp.ok) {
    return resp.json()
  }
  throw Error("Error fetching user channels.")
}

async function fetchUser(eci:string): Promise<User> {
  const resp = await fetch(`http://buyer-server:3000/c/${eci}/query/byway.user.entity/getUser`, {method:"POST"})
  if (resp.ok) {
    return resp.json()
  }
  throw Error("Error fetching user.")
}

export let loader: LoaderFunction = async () => {
  const userChannels = await fetchUserChannels('cl05vgib800hd07qh5hgm0xse')
  const userResponses = await Promise.allSettled(
    userChannels?.map(async (channel) => await fetchUser(channel.eci))
  )
  const users = (userResponses.filter(
    (res) => res.status === "fulfilled"
  ) as PromiseFulfilledResult<User>[] | undefined)?.map(u => u.value)
  console.log(users)
  return users
}



export default function Index() {
  const users: User[] = useLoaderData()
  return (
    <>
      <h1>Users</h1>
      {users.map(u => (
        <p>
          {u.firstName} {u.surname}
        </p>
      ))}
    </>
  );
}
