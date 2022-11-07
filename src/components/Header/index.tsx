import { memo } from "react"
import { Box } from "./index.sty";

const Header = () => {
    return (
        <Box>
            <div className="title">TGIS map2d 示例</div>
            <div className="navs">
                <a className="nav-btn" href="./doc/index.html" >doc</a>
            </div>
        </Box>
    )
}

export default memo(Header);