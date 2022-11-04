import { SidebarChildEntity, SidebarEntity } from "@/pages/Home";
import { memo, useState } from "react";
import { Box, SidebarItemBox, SidebarBox, SidebarItemChildBox } from "./index.sty";


const SidebarItemChild = memo(({ title }: SidebarChildEntity) => {

    const handleClick = () => {
        document.getElementById(title)?.scrollIntoView({
            behavior: 'smooth'
        })
    }

    return (
        <SidebarItemChildBox onClick={handleClick}>
            <div className="child-icon"></div>
            <div className="child-title">{title}</div>
        </SidebarItemChildBox>
    )
})

const SidebarItem = memo(({ title, icon, children }: SidebarEntity) => {

    const [isCollapse, setIsCollapse] = useState<boolean>(false);

    const handleClick = () => {

        document.getElementById(title)?.scrollIntoView({
            behavior: 'smooth'
        })

        setIsCollapse(!isCollapse);
    }

    return (
        <SidebarItemBox>
            <a className="label" onClick={handleClick}>
                <div className="label-title">
                    <div className="title-icon">
                        <span className={`iconfont ${icon}`}></span>
                    </div>
                    <div className="title-text">{title}</div>
                </div>
                <div className={`collapse-icon ${isCollapse ? 'collapse' : undefined}`}>
                    <span className="iconfont icon-arrow-right"></span>
                </div>
            </a>
            {
                isCollapse && (
                    <div className="children">
                        {(children && children.length) && children.map((item, index) => <SidebarItemChild {...item} key={index} />)}
                    </div>
                )
            }
        </SidebarItemBox>
    )
})

type SidebarProps = {
    data: SidebarEntity[]
}

const Sidebar = memo(({ data }: SidebarProps) => {
    return (
        <Box>
            <SidebarBox>
                {data.map(item => <SidebarItem {...item} key={item.id} />)}
            </SidebarBox>
        </Box>
    )
})

export default Sidebar;