import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Forms/CategoryForm";
import { Button, Modal } from "antd";
const CreateCategory = () => {
  const [categories, setcategories] = useState([]);
  const [name, setname] = useState("");
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/category/create-category", {
        name,
      });
      if (data?.success) {
        console.log(data.data);
        toast.success(`${data.data.name} is Created !`);
        getAlLCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong !");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log(selected._id);
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected._id}`,
        {
          name: updatedName,
        }
      );
      if (data.success) {
        toast.success("Updated SuccessFully");
        setSelected(null);
        setUpdatedName("");
        handleCancel();
        getAlLCategories();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  const handleDelete = async (pid) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/category/delete-category/${pid}`
      );
      if (data.success) {
        toast.success(` ${data.data.name} deleted SuccessFully`);
        getAlLCategories();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  const getAlLCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/categories");
      if (data?.success) {
        setcategories(data?.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong !");
    }
  };

  useEffect(() => {
    getAlLCategories();
  }, []);

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                value={name}
                setValue={setname}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
          <div className="w-75">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((c, i) => (
                  <>
                    <tr>
                      <td key={i}>{c.name}</td>
                      <td>
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            setUpdatedName(c.name);
                            setSelected(c);
                            showModal();
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => {
                            console.log(c._id);
                            handleDelete(c._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <>
            <Modal
              title="Update Category"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
