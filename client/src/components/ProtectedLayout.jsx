
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import Modal from "./Modal";

export default function ProtectedLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
      </Modal>
      <Navigation/>

      <Outlet />

      <Footer />
    </>
  );
}
