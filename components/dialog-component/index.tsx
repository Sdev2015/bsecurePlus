"use client";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { NextPage } from "next";
import React from "react";

type DialogComponentProps = {
  open: boolean;
  close: () => void;
  message: React.ReactNode;
  title: string | undefined;
};

const DialogComponent: NextPage<DialogComponentProps> = ({
  close,
  message,
  open,
  title,
}): JSX.Element => {
  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={close} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
