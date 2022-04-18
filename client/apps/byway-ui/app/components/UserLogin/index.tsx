import React, { useState } from 'react';
import { Avatar } from '@mantine/core';
import { User } from "~/pico/users.server";
import {faker} from "@faker-js/faker";

export interface UserLoginProps {
  user: User;
}

const UserLogin: React.FC<UserLoginProps> = ({ user }) => {
  return (
  <div key={user.email} className="w-72 ring-2 flex flex-col items-center bg-blue-100/30 rounded-lg hover:ring-zinc-600 px-4">
    <div className="flex w-full justify-around items-center my-3">
      <Avatar className="rounded-full ring-2 ring-gray-600" size="lg" />
      <div className="text-slate-500">
        {user.firstName} {user.surname}
      </div>
    </div>
    <input type="password" placeholder="Enter password" className="rounded-lg p-2 mb-4 bg-blue-900 text-white w-full" />
    <button className="rounded-full w-full p-2 mb-4 bg-blue-900 text-white">Login</button>
  </div>
  );
};

export default UserLogin;
