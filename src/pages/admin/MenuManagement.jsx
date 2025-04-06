import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://foodhubapi-1.onrender.com/api/admin/restaurant";

const MenuManagement = ({ adminId }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [section, setSection] = useState("");
  const [items, setItems] = useState([{ name: "", price: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editItem, setEditItem] = useState({ name: "", price: "" });
  const [editingSectionName, setEditingSectionName] = useState("");

  useEffect(() => {
    if (adminId) {
      fetchRestaurant();
    }
  }, [adminId]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/${adminId}`);
      setRestaurant(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch restaurant details");
      toast.error("Failed to fetch restaurant details");
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    setError(""); // Reset errors before validating
    if (!adminId) {
      setError("Admin ID is missing! Please refresh the page.");
      return false;
    }
    if (!section.trim()) {
      setError("Section name cannot be empty!");
      return false;
    }
    if (
      items.some((item) => !item.name.trim() || !item.price || item.price <= 0)
    ) {
      setError("Please fill out all item fields correctly!");
      return false;
    }
    return true;
  };

  const startEditing = (sectionId, item) => {
    setEditingItemId(item._id);
    // setEditingSectionId(sectionId);
    setEditItem({ name: item.name, price: item.price  });
  };

  const startEditingSection = (sectionId, sectionName) => {
    setEditingSectionId(sectionId);
    setEditingSectionName(sectionName);
  };

  const handleUpdateItem = async () => {
    if (!editingItemId) return;

    // Find the section that contains the item being edited
    const section = restaurant?.menu?.find((menuSection) =>
        menuSection.items.some((item) => item._id === editingItemId)
    );

    if (!section) {
        toast.error("Failed to find the section for this item.");
        return;
    }

    try {
        await axios.put(
            `${API_BASE_URL}/${adminId}/menu/${section._id}/item/${editingItemId}`,
            editItem
        );
        toast.success("Item updated successfully!");
        fetchRestaurant();
        setEditingItemId(null);
    } catch (error) {
        toast.error("Failed to update item");
    }
};

  // const handleUpdateSection = async () => {
  //   if (!editingSectionId || !editingSectionName.trim()) {
  //     console.log(editingSectionId, editingSectionName)
  //     toast.error("Section name cannot be empty!");
  //     return;
  //   }
  //   try {
  //     await axios.put(`${API_BASE_URL}/${adminId}/menu/${editingSectionId}`, {
  //       section: editingSectionName, // Ensure correct data is sent
  //     });
  //     toast.success("Section name updated successfully!");
  //     fetchRestaurant(); // Refresh menu
  //     setEditingSectionId(null);
  //     setEditingSectionName(""); // Reset input
  //   } catch (error) {
  //     toast.error("Failed to update section name");
  //   }
  // };
  

  const handleDeleteItem = async (sectionId, itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(
        `${API_BASE_URL}/${adminId}/menu/${sectionId}/item/${itemId}`
      );
      toast.success("Item deleted successfully!");
      fetchRestaurant();
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Are you sure you want to delete this section?"))
      return;
    try {
      await axios.delete(`${API_BASE_URL}/${adminId}/menu/${sectionId}`);
      toast.success("Section deleted successfully!");
      fetchRestaurant();
    } catch (error) {
      toast.error("Failed to delete section");
    }
  };

  const handleAddMenu = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateInputs()) return;

    try {
      setLoading(true);
      const existingSection = restaurant?.menu?.find(
        (menuSection) => menuSection.section === section
      );

      if (existingSection) {
        await axios.put(
          `${API_BASE_URL}/${adminId}/menu/${existingSection._id}`,
          {
            items: items.map((item) => ({
              name: item.name,
              price: Number(item.price),
            })),
          }
        );
        toast.success("Items added to the existing section successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/${adminId}/menu`, {
          section,
          items: items.map((item) => ({
            name: item.name,
            price: Number(item.price),
          })),
        });
        toast.success("New menu section added successfully!");
      }

      fetchRestaurant();
      setSection("");
      setItems([{ name: "", price: "" }]);
    } catch (error) {
      setError("Failed to add menu section");
      toast.error("Failed to add menu section");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold">Welcome, {restaurant?.adminName}</h1>
      <h2 className="text-lg">{restaurant?.restaurantName}</h2>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Form to Add New Menu Section */}
      <form onSubmit={handleAddMenu} className="mt-3">
        <input
          type="text"
          placeholder="Section Name"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          list="sections"
          className="border p-2 rounded w-full mb-2"
          disabled={loading}
        />
        <datalist id="sections">
          {restaurant?.menu?.map((menuSection, index) => (
            <option key={index} value={menuSection.section} />
          ))}
        </datalist>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].name = e.target.value;
                setItems(newItems);
              }}
              className="border p-2 rounded w-full"
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].price = Math.max(0, Number(e.target.value));
                setItems(newItems);
              }}
              className="border p-2 rounded w-full"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="bg-red-500 cursor-pointer text-white p-2 rounded"
              disabled={loading}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setItems([...items, { name: "", price: "" }])}
          className="bg-blue-500 cursor-pointer text-white p-2 rounded mr-2"
          disabled={loading}
        >
          Add Item
        </button>
        <button type="submit" className="bg-green-500 cursor-pointer text-white p-2 rounded">
          {loading ? "Adding..." : "Add Section"}
        </button>
      </form>

      {/* Display Existing Menu */}
      <div className="mt-2">
        <h3 className="text-xl font-bold mb-2">Menu</h3>
        {restaurant?.menu && restaurant.menu.length > 0 ? (
          restaurant.menu.map((menuSection, index) => (
            <div key={index} className="mb-3 rounded shadow">
              {/* <h4 className="font-semibold text-lg">{menuSection.section}</h4>
              <ul className=""> */}
              <div className="flex bg-orange-500 text-white items-center gap-2">
                {editingSectionId === menuSection._id ? (
                  <input
                    type="text"
                    value={editingSectionName}
                    onChange={(e) => setEditingSectionName(e.target.value)}
                    className="border p-1 rounded"
                    autoFocus
                  />
                ) : (
                  <h4 className="font-semibold px-2 text-lg">
                    {menuSection.section}
                  </h4>
                )}
                <div>
                  {editingSectionId === menuSection._id ? (
                    <button
                      onClick={handleUpdateSection}
                      className="bg-green-500 cursor-pointer text-white p-1 mr-2 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      {/* <button
                        onClick={() =>
                          startEditingSection(menuSection._id, menuSection.section)
                        }
                        className="bg-yellow-500 text-white p-1 mr-2 rounded"
                      >
                        Edit
                      </button> */}
                      <button
                        onClick={() => handleDeleteSection(menuSection._id)}
                        className="bg-red-500 cursor-pointer text-white px-1 rounded"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
              <ul className="py-2">
                {menuSection.items.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between px-2 my-1 items-center relative"
                  >
                    <span className="flex-1">{item.name}</span>

                    {editingItemId === item._id ? (
                      <input
                      type="number"
                      value={editItem.price === "" ? "" : editItem.price}
                      onChange={(e) =>
                        setEditItem({
                          ...editItem,
                          price: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                      className="border p-1 rounded absolute left-[85%] transform -translate-x-1/2 bg-white shadow-md"
                      autoFocus
                    />
                    ) : (
                      <span
                        className="font-bold w-20 text-center"
                        onClick={() => startEditing(menuSection._id, item)}
                      >
                        ₹{item.price}
                      </span>
                    )}

                    <div className="ml-4">
                      {editingItemId === item._id ? (
                        <button
                          onClick={handleUpdateItem}
                          className="bg-green-500 text-white p-1 mr-2 rounded"
                        >
                          Save
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(menuSection._id, item)}
                            className="bg-yellow-500 mr-4 cursor-pointer text-white px-1 rounded"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteItem(menuSection._id, item._id)
                            }
                            className="bg-red-500 cursor-pointer text-white mr-4 px-1 rounded"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No menu sections added yet.</p>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
