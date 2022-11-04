import {
    createHashRouter,
} from "react-router-dom";

import App from "./App";
import Home from "@/pages/Home";
import Sandcastle from "@/pages/Sandcastle";

const router = createHashRouter([
    {
        path: "",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/editor",
                element: <Sandcastle />
            }
        ]
    }

])

export default router;