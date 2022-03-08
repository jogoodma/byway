import React from "react";
import { Form } from "remix";
import { User } from "~/pico/users.server";
import {
  Avatar,
  Button,
  Card,
  Center,
  Input,
  InputWrapper,
  Modal,
  Text,
} from "@mantine/core";

export interface UserLoginProps {
  user: User;
}

const UserLogin: React.FC<UserLoginProps> = ({ user }) => {
  return (
    <Card shadow="md" padding="lg">
      <Card.Section>
        <Avatar color="red" radius="xl" />
      </Card.Section>

      <Center>
        <Text size="sm" style={{ lineHeight: 1.5 }}>
          <b>
            {user.firstName} {user.surname}
          </b>
        </Text>
      </Center>
      <Form method="post">
        <input type="hidden" name="publicEci" value={user.publicEci} />
        <InputWrapper id="password" required error="">
          <Input id="password" name="password" placeholder="Your password" />
        </InputWrapper>

        <Button
          type="submit"
          variant="light"
          color="blue"
          fullWidth
          style={{ marginTop: 14 }}
        >
          Login
        </Button>
      </Form>
    </Card>
  );
};

export default UserLogin;
