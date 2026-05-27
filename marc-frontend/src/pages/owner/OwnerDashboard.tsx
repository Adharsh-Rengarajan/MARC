import { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import Navbar from "../../components/Navbar";
import OwnerOverview from "./OwnerOverview";
import OwnerProjects from "./OwnerProjects";
import OwnerUsers from "./OwnerUsers";
import OwnerOrders from "./OwnerOrders";

const OwnerDashboard = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Navbar title="Owner Dashboard" />
      <Box className="role-page">
        <Typography className="role-header" component="h1">Owner Dashboard</Typography>
        <Box
          sx={{
            background: "#fff", borderRadius: "10px", mb: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)", px: 2,
          }}
        >
          <Tabs
            value={tab} onChange={(_, v) => setTab(v)}
            TabIndicatorProps={{ style: { background: "#8a2be2", height: 3 } }}
            sx={{
              "& .MuiTab-root": { fontWeight: 700, color: "#4b0082", textTransform: "uppercase", letterSpacing: 1 },
              "& .Mui-selected": { color: "#8a2be2 !important" },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Projects" />
            <Tab label="Team" />
            <Tab label="Orders" />
          </Tabs>
        </Box>
        {tab === 0 && <OwnerOverview />}
        {tab === 1 && <OwnerProjects />}
        {tab === 2 && <OwnerUsers />}
        {tab === 3 && <OwnerOrders />}
      </Box>
    </Box>
  );
};

export default OwnerDashboard;
