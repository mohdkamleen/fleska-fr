import React, { useEffect, useState } from 'react'
import { Avatar, Button, Card, Empty, Segmented, Space, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import Loading from '../components/Loading';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from '../axios';

function OrderComp() {
  const [filter, setFilter] = useState("Orders")
  const [order, setOrder] = useState([])
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    handleGetCurrentUser()
  }, [])

  useEffect(() => {
    handleGetOrder()
  }, [user])

  const handleGetCurrentUser = _ => {
    if (localStorage.getItem("token")) {
      setLoading(true)
      axios.get("/user/get-current")
        .then(res => res?.data && setUser(res?.data))
        .catch(err => console.log(err))
        .finally(_ => setLoading(false))
    }
  }

  const handleGetOrder = _ => {
    setLoading(true)
    axios.get(`/order/${user?._id}`)
      .then(res => res?.data && setOrder(res.data))
      .catch(err => console.log(err))
      .finally(_ => setLoading(false))
  }

  return (
    <div style={{ margin: "50px 10%" }}>
      <ArrowLeftOutlined onClick={_ => navigate(-1)} /> Order History

      <br />
      <br />
 
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {
          order?.length > 0 ? order.map((e, i) => (
            <Card key={i} size='small' hoverable >
              <Space>
                <Avatar.Group
                  maxCount={3}
                  maxStyle={{ background: "#1890ff" }}>
                  {e.cart.map(c => <Avatar shape='square' src={c.image} />)}
                </Avatar.Group>
                <h3> {e.cart.length} Items </h3>
              </Space>
              <h3>Total Amount ₹{e.cart?.map(j => j.amount * j.qnt).reduce((j, k) => j + k)}.00</h3>
              {
                e.friend.length > 0 && e.friend.map(f =>
                  <h3>{f} ({(e.cart?.map(j => j.amount * j.qnt).reduce((j, k) => j + k) / e.friend.length).toFixed(2)})</h3>)
              }
              <h3>Created At {moment(e.createdAt).format('lll')}</h3> 
              <h3>Order Status : {e.status}</h3>

            </Card>
          )).reverse() : <Spin spinning={false} tip="Loading...">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            <Button onClick={() => navigate("/", { replace: true })} style={{ margin: "auto", display: "block" }}>Continue Shopping</Button>
          </Spin>
        }
      </div>  <br />

      {loading && <Loading />}
    </div>
  )
}

export default OrderComp 