"use client";

import { Subtitle } from "@/components/subtitle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Title } from "@/components/title";
import { deleteUserData } from "@/server/settings/delete-user-data";
import { initSampleData } from "@/server/settings/init-sample-data";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";

export function Settings() {
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
    <>
      <Title>Settings</Title>

      <section className="flex flex-col gap-2 mb-6">
        <Subtitle>Appearance</Subtitle>
        <ThemeToggle expanded />
      </section>

      <section className="flex flex-col gap-2 mb-6">
        <Subtitle>Data Management</Subtitle>
        <div className="flex flex-col gap-2">
          <Button color="warning" variant="contained" onClick={handleResetSampleData} disabled={isResetting}>
            Reset Sample Data
          </Button>
          <Button color="error" variant="contained" onClick={() => setIsDeleteModalOpen(true)}>
            Delete All Data
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <Subtitle>Account</Subtitle>
        <div className="flex flex-col gap-2">
          <Button variant="outlined" component="a" href="/auth/logout?returnTo=https://justtrackitapp.com/login">
            Logout
          </Button>
        </div>
      </section>

      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        PaperProps={{
          className: "bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-stone-900 dark:to-stone-950",
        }}
      >
        <DialogTitle className="pt-3 px-3">Delete All Data</DialogTitle>
        <DialogContent className="p-2">
          Are you sure you want to delete all your data? This action cannot be undone.
        </DialogContent>
        <DialogActions className="p-2">
          <Button variant="text" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDeleteData}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
