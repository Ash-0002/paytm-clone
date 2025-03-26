import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const debouceRef = useRef(null);
  const [loading, setLoading] = useState(false);   
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  },[]);

  const fetchUsers = async (query = "") => {
    try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${query}`);
        setUsers(response.data.user || []);
    } catch (error) {
        setError("error while fetching users");
        console.error("Error while fetching users", error);
    } finally {
        setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if(debouceRef.current) {
        clearTimeout(debouceRef.current);
    }

    debouceRef.current = setTimeout(() => {
        fetchUsers(value);
    }
    , 500);
  }

 

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>

      <div className="my-2">
        <input
          type="text"
         onChange={handleSearch}
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        ></input>
      </div>

      <div>
       {users.length > 0 ? (
        users.map((user) => <User user={user} key={user._id} />)
       ) : (
        <p className="text-gray-500">No users Found</p>
       )

       }
      </div> 
    </>
  );
};

function User({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
            <div className="flex flex-col justify-center h-full text-xl">
                {user.firstName[0].toUpperCase()}
            </div>
        </div>
        <div className="flex flex-col justify-center h-full">
            <div>
                {user.firstName} {user.lastName}
            </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-full">
        <Button onClick={(e) => {
            navigate("/send?id=" + user._id + "&name=" + user.firstName)
        }} label={"Send Money"} />
      </div>
    </div>
  );
}

export default Users;
