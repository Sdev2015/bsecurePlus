"use client";

import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { NextPage } from "next";

type LoadingDialogMessageProps = {
  message: string;
};

export const LoadingDialogMessage: NextPage<LoadingDialogMessageProps> = ({
  message,
}): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: 5,
        }}
      >
        <Typography variant="h6">{message}</Typography>
        <CircularProgress />
      </Box>
    </Box>
  );
};
