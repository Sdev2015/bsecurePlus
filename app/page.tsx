import AppContainer from "@/components/app-container";
import { Typography } from "@mui/material";

export default function Home() {
  return (
    <main>
      <Typography
        component={"h4"}
        fontSize={{ xs: 32, sm: 35, md: 40, lg: 50 }}
        textAlign={"center"}
        fontWeight={500}
        gutterBottom
      >
        Instant Proctoring
      </Typography>
      <AppContainer />
    </main>
  );
}
