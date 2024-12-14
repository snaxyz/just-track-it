"use client";

import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Subtitle } from "@/components/subtitle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Title } from "@/components/title";
import { deleteUserData } from "@/server/settings/delete-user-data";
import { initSampleData } from "@/server/settings/init-sample-data";
import {
  Button,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleDeleteData = async () => {
    await deleteUserData();
    setIsDeleteModalOpen(false);
  };

  const handleResetSampleData = async () => {
    try {
      setIsResetting(true);
      await initSampleData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <PageContainer>
      <MainContainer className="px-4 md:px-3 md:py-4">
        <Title>Settings</Title>

        <section className="flex flex-col gap-2 mb-6">
          <Subtitle>Appearance</Subtitle>
          <ThemeToggle expanded />
        </section>

        <section className="flex flex-col gap-2 mb-6">
          <Subtitle>Data Management</Subtitle>
          <div className="flex flex-col gap-2">
            <Button
              color="warning"
              variant="flat"
              onPress={handleResetSampleData}
              isLoading={isResetting}
            >
              Reset Sample Data
            </Button>
            <Button
              color="danger"
              variant="flat"
              onPress={() => setIsDeleteModalOpen(true)}
            >
              Delete All Data
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <Subtitle>Account</Subtitle>
          <div className="flex flex-col gap-2">
            <Button
              variant="bordered"
              as="a"
              href="/auth/logout?returnTo=/login"
            >
              Logout
            </Button>
          </div>
        </section>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          isDismissable={false}
        >
          <ModalContent>
            <ModalHeader className="pt-3 px-2">Delete All Data</ModalHeader>
            <ModalBody className="p-2">
              Are you sure you want to delete all your data? This action cannot
              be undone.
            </ModalBody>
            <ModalFooter className="p-2">
              <Button
                variant="light"
                onPress={() => setIsDeleteModalOpen(false)}
                radius="lg"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                variant="flat"
                onPress={handleDeleteData}
                radius="lg"
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </MainContainer>
    </PageContainer>
  );
}
