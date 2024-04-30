import { memo, useCallback } from "react"
import { Box } from "./index.sty";

const {
    VITE_TGIS_homeUrl: tgisHomeUrl,
    VITE_TGIS_exp2DUrl: exp2DUrl,
    VITE_TGIS_doc2DUrl: doc2DUrl,
    VITE_TGIS_docIOSUrl: docIOSUrl,
    VITE_TGIS_expIOSUrl: expIOSUrl,
    VITE_TGIS_docAndroidUrl: docAndroidUrl,
    VITE_TGIS_expAndroidUrl: expAndroidUrl,
    VITE_TGIS_exp3DUrl: exp3DUrl,
    VITE_TGIS_doc3DUrl: doc3DUrl
} = import.meta.env;

const Header = () => {

    const handleClick = useCallback(() => {
        // navigate(tgisHomeUrl, {
        //     replace: true
        // })
        window.location = tgisHomeUrl;
    }, [])

    return (
        <Box>
            <div className="title">
                <div onClick={handleClick} className="iconfont icon-home"></div>
                TGIS map2d 示例
            </div>
            <div className="navs">
                <a className="nav-btn" href="./doc/index.html" >2D开发文档</a>
                <a className="nav-btn" href={exp3DUrl} >3D开发示例</a>
                <a className="nav-btn" href={doc3DUrl} >3D开发文档</a>
                <a className="nav-btn" href={expIOSUrl} >iOS开发示例</a>
                <a className="nav-btn" href={docIOSUrl} >iOS开发文档</a>
                <a className="nav-btn" href={expAndroidUrl} >Android开发示例</a>
                <a className="nav-btn" href={docAndroidUrl} >Android文档</a>
            </div>
        </Box>
    )
}

export default memo(Header);