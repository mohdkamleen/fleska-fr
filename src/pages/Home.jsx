import { Badge, Button, Drawer, Dropdown, Empty, Flex, Image, Select, Space, Spin } from 'antd'
import { Header } from 'antd/es/layout/layout'
import axios from '../axios/index'
import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined, CopyrightCircleOutlined, DownOutlined } from '@ant-design/icons'
import ButtonGroup from 'antd/es/button/button-group'

const Home = () => {
    const [item, setItems] = useState([])
    const [friend, setFriend] = useState([])
    const [allUser, setAllUser] = useState([])
    const [user, setUser] = useState()
    const [showCart, setShowCart] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        handleGetItems()
        handleGetCurrentUser()
        handleGetAllUser()
    }, [])

    const handleGetCurrentUser = _ => {
        if (localStorage.getItem("token")) {
            setLoading(true)
            axios.get("/user/get-current")
                .then(res => res?.data ? setUser(res?.data) : (localStorage.removeItem("token") && window.location.reload()))
                .catch(err => console.log(err))
                .finally(_ => setLoading(false))
        }
    }

    const handleGetItems = _ => {
        setLoading(true)
        axios.get("/product")
            .then(res => res?.data && setItems(res.data))
            .catch(err => console.log(err))
            .finally(_ => setLoading(false))
    }

    const handleGetAllUser = _ => {
        setLoading(true)
        axios.get("/user")
            .then(res => res?.data && setAllUser(res.data))
            .catch(err => console.log(err))
            .finally(_ => setLoading(false))
    }

    const handleRemoveCart = async data => {
        setLoading(true)
        await axios.patch(`user/remove-cart/${user?._id}`, data)
            .then(res => res?.data && setUser(res.data))
            .catch(err => console.log(err))
            .finally(_ => setLoading(false))
    }

    const handleAddCart = async (data) => {
        setLoading(true)
        user
            ? (
                await axios.patch(`user/add-cart/${user._id}`, data)
                    .then(res => res?.data && setUser(res.data))
                    .catch(err => console.log(err))
                    .finally(_ => setLoading(false))
            )
            : navigate("/auth")
    }

    const handleUpdateCart = (data, qnt) => {
        setLoading(true)
        axios.patch(`user/update-cart/${user?._id}`, { ...data, qnt })
            .then(res => res?.data && setUser(res.data))
            .catch(err => console.log(err))
            .finally(_ => setLoading(false))
    }

    const handleLogout = _ => {
        localStorage.removeItem("token")
        window.location.reload()
    }

    const handleAddOrder = _ => {
        setLoading(true)
        axios.post("/order/add", {
            userId: user?._id,
            cart: user?.cart,
            friend
        }).then(res => {
            if (res?.data) {
                handleGetCurrentUser()
                setShowCart(false)
            }
        })
            .catch(err => console.log(err))
            .finally(_ => setLoading(false))
    }

    const items = [
        {
            key: '1',
            label: <span onClick={_ => navigate("/orders")}>Orders</span>
        },
        {
            key: '4',
            danger: true,
            label: <span onClick={handleLogout}>LogOut</span>,
        },
    ];

    return (
        <>
            {/* Shoing Loading comp.  */}
            {loading && <Loading />}

            {/* Header Section  */}
            <Header style={{ background: "transparent", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 5%" }}>
                <img alt='error' src='https://euh4nf6rkt9.exactdn.com/wp-content/uploads/sites/3/2023/01/fleksa-logo.png?strip=all&lossy=1&sharp=1&ssl=1' height={30} />
                <span>
                    {user?.cart?.length > 0 && <Button
                        onClick={_ => setShowCart(true)}
                        size='large'
                        type='text'
                    > Cart &nbsp; <Badge
                        color='blue'
                        count={user?.cart?.length}></Badge>
                    </Button>}
                    {user ? <Dropdown
                        menu={{
                            items,
                        }}
                    >
                        <Button type='text' size='large' >
                            {user && user?.fullname} <DownOutlined />
                        </Button >
                    </Dropdown> : <Button type='text' size='large' onClick={_ => navigate("/auth")} >
                        My Account <DownOutlined />
                    </Button >}
                </span>
            </Header>

            {/* Show Items  */}
            <Flex wrap='wrap' justify='center' gap={15} style={{ margin: "0px 5%" }}>
                {
                    item?.length > 0 && item.map((e, i) =>
                        <div key={i} style={{ borderRadius: "10px", border: "1px solid lightgray" }}>
                            <Badge.Ribbon color={user?.cart?.map(ac => ac._id).includes(e._id) ? "red" : "blue"} text={
                                user?.cart?.map(ac => ac._id).includes(e._id)
                                    ? <big style={{ cursor: "pointer" }} onClick={() => handleRemoveCart(e)} > Remove </big>
                                    : <big style={{ cursor: "pointer" }} onClick={() => handleAddCart(e)} > Add </big>
                            }>
                                <div style={{ padding: "10px" }}>
                                    <img style={{ borderRadius: "10px", width: "250px" }} src={e.image} alt="error" />
                                    <Flex justify='space-between' align='end' style={{ marginTop: "5px" }}>
                                        <b>{e.title}</b>
                                        <b>₹ {e.amount}.00</b>
                                    </Flex>
                                </div>
                            </Badge.Ribbon>
                        </div>
                    )
                }
            </Flex>


            {/* drawer for cart component  */}
            <Drawer
                open={showCart}
                onClose={_ => setShowCart(false)}
                headerStyle={{ display: "none" }}
            >
                <span><ArrowLeftOutlined onClick={_ => setShowCart(false)} />&ensp; Your Cart </span> <br /><br />
                {
                    user?.cart?.length > 0 ? user?.cart?.map((e, i) => (
                        <Badge.Ribbon key={i} color='red' text={<span style={{ cursor: "pointer" }} onClick={() => handleRemoveCart(e)} > Remove </span>}>
                            <div style={{ border: "1px solid lightgray", padding: "5px 10px", borderRadius: "5px", margin: "7px 0" }}>
                                <Space>
                                    <Image height={70} src={e?.image} /> &nbsp;
                                    <Flex vertical>
                                        <b>{e.title}</b>
                                        <span>{`₹ ${e.amount * e.qnt}`} <b>(Qnt {e.qnt})</b></span>
                                        <ButtonGroup size='small'>
                                            <Button onClick={_ => handleUpdateCart(e, e.qnt + 1)}>+</Button>
                                            <Button disabled={e.qnt === 1} onClick={_ => handleUpdateCart(e, e.qnt - 1)}>-</Button>
                                        </ButtonGroup>
                                    </Flex>
                                </Space>
                            </div>
                        </Badge.Ribbon>
                    )) : (
                        <Spin spinning={false} tip="Loading...">
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            <Button onClick={_ => setShowCart(false)} style={{ margin: "auto", display: "block" }}>Continue Shopping</Button>
                        </Spin>
                    )
                } <br />

                {/* this code for total cart amount */}
                {user?.cart?.length > 0 && <>
                    {/* Show total cart money  */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Total Cart ( {user?.cart?.length} item{user?.cart?.length > 1 && "s"} ) amount : </span>
                        <span>₹ {user?.cart?.length > 0 && user?.cart?.map(e => e?.amount * e?.qnt)?.reduce((e, i) => e + i)}.00</span>
                    </div> <br />

                    {/* Here showing divided money  */}
                    {friend.length > 0 && <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Per person amount : </span>
                        <span>₹ {(user?.cart?.length > 0 && user?.cart?.map(e => e?.amount * e?.qnt)?.reduce((e, i) => e + i) / friend.length).toFixed(2)}</span>
                    </div>} <br />
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Add Friends"
                        mode='multiple'
                        onChange={e => setFriend(e)}
                        defaultValue={user?.username}
                    >
                        {allUser?.length > 0 && allUser.map(e => <Select.Option key={e.username}>{e.fullname}</Select.Option>)}
                    </Select> <br /><br />

                    <Button type="primary" onClick={handleAddOrder}>Continue and Save</Button>
                </>
                }
            </Drawer>

            {/* Footer Section  */}
            <br /><p align="center">All Rights Reserved <CopyrightCircleOutlined /> Fleska {new Date().getFullYear()}. </p>
        </>
    )
}

export default Home