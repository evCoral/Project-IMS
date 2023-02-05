import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Space,
  Table,
  Modal,
  Button,
  Form,
  Input,
  InputNumber,
  Row,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";

function StocksPage() {
  const { user, setUser } = useContext(UserContext);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [data, setData] = useState([] as DataType[]);
  const [loading, setLoading] = useState(true);
  const [openedModal, setOpenedModal] = useState<string | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  interface DataType {
    key: string;
    id: string;
    name: string;
    description: string;
    quantity: number;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <span>{text ?? "No Description"}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            type="link"
            onClick={() => {
              setSelectedItem(record);
              showModal("edit");
            }}
          >
            Edit {record.name}
          </Button>
          <Button
            size="small"
            danger
            onClick={() => {
              setSelectedItem(record);
              showModal("delete");
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Handle Add of Stock
  const handleAddStock = async (values: any) => {
    console.log("Added stocks", values);
    try {
      const res = await axios.post("/api/items/add", values);
      setOpenedModal(null);
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Update of Stock
  const handleUpdateStock = async (values: any) => {
    console.log("Edit stocks", values);
    try {
      const res = await axios.put(`/api/items/update/${values.id}`, values);
      setOpenedModal(null);
      console.log(res);
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Delete of Stock
  const handleDeleteStock = async () => {
    console.log("delete stocks", selectedItem);
    try {
      const res = await axios.delete(`/api/items/delete/${selectedItem._id}`);
      setOpenedModal(null);
      console.log(res);
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Showing of modal based on assigned name
  const showModal = (name: string) => {
    addForm.resetFields();
    editForm.resetFields();
    setOpenedModal(name);
  };

  // Modal Cancel and OK button
  const handleOk = (action: string) => {
    if (action === "add") addForm.submit();
    else if (action === "edit") editForm.submit();
    else if (action === "delete") handleDeleteStock();
  };
  const handleCancel = () => {
    addForm.resetFields();
    editForm.resetFields();
    setOpenedModal(null);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/items");
        const items = res.data.data.map((item: DataType, index: number) => ({
          ...item,
          key: `${item.name}-${index}`,
        }));
        setData(items);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (loading) {
      getData();
    }
  }, [loading]);

  if (!user) return <Navigate to="/login" />;
  return (
    <div>
      <Row
        justify="space-between"
        style={{ padding: "1rem", paddingBottom: "0" }}
      >
        <h1>Inventory</h1>
        <Button onClick={() => showModal("logout")} danger>
          Logout
        </Button>
        <Modal
          title={`Logout confirmation`}
          open={openedModal === "logout"}
          onOk={() => setUser(null)}
          onCancel={handleCancel}
        >
          Are you sure you want to logout?
        </Modal>
      </Row>
      <br />
      <div style={{ paddingLeft: "3rem", paddingRight: "3rem" }}>
        {/* Add Stocks button and form modal */}
        <Button type="primary" onClick={() => showModal("add")}>
          Add Stock
        </Button>
        <Modal
          title="Add Stocks"
          open={openedModal === "add"}
          onOk={() => handleOk("add")}
          onCancel={handleCancel}
        >
          <Form
            form={addForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleAddStock}
            initialValues={{ quantity: 1 }}
            autoComplete="off"
          >
            <Form.Item
              label="Stock Name"
              name="name"
              rules={[{ required: true, message: "Please input stock name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Please stock quantity!" }]}
            >
              <InputNumber min={0} />
            </Form.Item>
          </Form>
        </Modal>
        {/* Stocks Table */}
        <Table columns={columns} dataSource={data} loading={loading} />;
        {/* Edit Modal */}
        <Modal
          title={`Update ${selectedItem?.name}`}
          open={openedModal === "edit"}
          onOk={() => handleOk("edit")}
          onCancel={handleCancel}
        >
          <Form
            form={editForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleUpdateStock}
            initialValues={{ ...selectedItem }}
            autoComplete="off"
          >
            <Form.Item name="id" initialValue={selectedItem?._id} hidden>
              <></>
            </Form.Item>
            <Form.Item
              label="Stock Name"
              name="name"
              rules={[{ required: true, message: "Please input stock name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Please stock quantity!" }]}
            >
              <InputNumber min={0} />
            </Form.Item>
          </Form>
        </Modal>
        {/* Delete Modal */}
        <Modal
          title={`Delete Stock "${selectedItem.name}"`}
          open={openedModal === "delete"}
          onOk={() => handleOk("delete")}
          onCancel={handleCancel}
        >
          Do you want to delete {selectedItem?.name}?
        </Modal>
      </div>
    </div>
  );
}

export default StocksPage;
