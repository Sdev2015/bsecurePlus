"use client";

import { ContextProvider } from "@/_features/context";
import { ThemeProvider, createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextPage } from "next";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();
export const HOCWrapper: NextPage<PropsWithChildren> = ({ children }) => {
  const theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <ContextProvider>{children}</ContextProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default HOCWrapper;
