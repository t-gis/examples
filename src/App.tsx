import { memo } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "./App.sty"

export default memo(() => (
  <Box>
    <Outlet/>
  </Box>
))
