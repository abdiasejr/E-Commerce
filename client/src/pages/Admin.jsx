import React, { useState } from "react";
import { SideBar } from "../components";
import { AdminContent, AddContainer } from "../containers";

const Admin = () => {
  const [option, setOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="admin-page--container">
      <SideBar setOption={setOption} setIsOpen={setIsOpen} />
      {isOpen && option && <AddContainer option={option} setIsOpen={setIsOpen} /> }
      {!isOpen && <AdminContent option={option} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default Admin;
