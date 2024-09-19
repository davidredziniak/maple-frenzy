import React, { useState, useContext } from "react";
import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  VStack,
} from "@chakra-ui/react";
import { apiURL } from "../../config";
import toast from "react-hot-toast";
import { AuthContext } from "../Auth/AuthContext";

function PasswordPopup() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { accessToken } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notifications
  const errNotification = (message) => toast.error(message);
  const sucNotification = (message) => toast.success(message);

  const clearFields = () => {
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangePassword = async () => {
    // Minimum 8 characters password validation
    if (password.length < 8) {
      errNotification(
        "Your current password must be at least 8 characters long."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      errNotification("New passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      errNotification("New password must be at least 8 characters long.");
      return;
    }
    if (confirmPassword.length < 8) {
      errNotification("Confirm password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await fetch(apiURL + "/user/changepass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${accessToken}`,
        },
        body: JSON.stringify({ password, newPassword }),
      });

      if (response.ok) {
        sucNotification("Successfully updated password!");
        clearFields();
        onClose();
      } else {
        const errorData = await response.json();
        errNotification(errorData.message || "Something went wrong.");
        clearFields();
      }
    } catch (error) {
      errNotification(error.message);
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Change</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Input
                placeholder="Current Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Text fontSize="sm" color="gray.500">
                Password must be at least 8 characters long.
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleChangePassword}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PasswordPopup;
