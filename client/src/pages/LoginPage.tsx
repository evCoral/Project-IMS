import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    console.log(values);
    try {
      const res = await axios.post("/api/users/login", values);
      if (res.data.success) {
        console.log("Logged in successfully");
        setUser(true);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (user) navigate("/");
    setLoading(false);
  }, [user]);

  return (
    <div>
      <Row align="middle" justify="center" style={{ height: "100vh" }}>
        <Col>
          <h1 style={{ textAlign: "center" }}>Login Page</h1>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button loading={loading} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default LoginPage;
