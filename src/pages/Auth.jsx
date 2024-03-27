import { useEffect, useState } from "react";
import { Button, Form, Input, message, Segmented } from 'antd';
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export default () => {
    const [type, setType] = useState("Login")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem("token")) {
            window.location.replace("/")
        }
    }, [])

    const handleSignup = async (values) => {
        setLoading(true)
        await axios.post("/user/add", values)
            .then(res => {
                if (res?.data?.message) return message.warning(res.data.message)
                if (res?.data) {
                    localStorage.setItem("token", res?.data?.token)
                    window.location.replace("/")
                }
            })
            .catch(err => console.log(err))
            .finally(_ => setLoading(false))
    };

    const handleLogin = async (values) => {
        setLoading(true)
        await axios.post("/user/login", values)
            .then(res => {
                if (res?.data?.message) return message.warning(res.data.message)
                if (res?.data) {
                    localStorage.setItem("token", res?.data?.token)
                    window.location.replace("/")
                }
            })
            .catch(err => console.log(err))
            .finally(_ => setLoading(false))
    };


    return (
        <>
            {/* Shoing Loading comp.  */}
            {loading && <Loading />}

            {/* Form section login and signup  */}
            <h2 align="center" style={{ margin: "50px 0 10px 0" }}> SignUp &amp; Login Form </h2> <br />
            <center>
                <Segmented
                    onChange={setType}
                    options={["Login", "Signup"]}
                    defaultValue="Login" />
            </center><br />
            {
                type === "Login"
                    ? <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 400,
                            width: "80%",
                            display: "block",
                            margin: "auto"
                        }}
                        onFinish={handleLogin}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter username!'
                                },
                            ]}
                        >
                            <Input placeholder="eg. abc" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password placeholder="*********" />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                LOGIN
                            </Button>
                        </Form.Item>
                    </Form>
                    : <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 400,
                            width: "80%",
                            display: "block",
                            margin: "auto"
                        }}
                        onFinish={handleSignup}
                        autoComplete="off"
                    >

                        <Form.Item
                            label="Full Name"
                            name="fullname"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your full name!'
                                },
                            ]}
                        >
                            <Input placeholder="eg. Abc xyz" />
                        </Form.Item>

                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input username!'
                                },
                            ]}
                        >
                            <Input placeholder="eg. abc" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter password!'
                                },
                            ]}
                        >
                            <Input.Password placeholder="*********" />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                SIGNUP
                            </Button>
                        </Form.Item>
                    </Form>
            }
        </>
    )
}