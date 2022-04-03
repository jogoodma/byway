import React from "react";

import { Avatar, Button, Card, Center, Text } from "@mantine/core";

export interface NewUserProps {}

const NewUser: React.FC<NewUserProps> = (props) => {
  return (
    <div style={{ width: "10rem" }}>
      <Card shadow="sm" padding="lg">
        <Button color="blue" fullWidth style={{ marginTop: 14 }}>
          New User
        </Button>
      </Card>
    </div>
  );
};

export default NewUser;
