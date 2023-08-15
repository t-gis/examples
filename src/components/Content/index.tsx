import { SidebarChildEntity, SidebarDataEntity, SidebarEntity } from "@/pages/Home";
import { createContext, memo, useCallback, useContext, useMemo } from "react";
import { Box, ItemBox, SecondChildBox, SecondItemBox } from "./index.sty";

type ContentContextType = {
    onClick?: (data: SidebarDataEntity) => void
}
const ContentContext = createContext<ContentContextType>(null!);

type ContentProps = {
    data: SidebarEntity[],
    onClick?: ContentContextType["onClick"]
}

const SecondChild = memo((data: SidebarDataEntity) => {

    const { onClick } = useContext(ContentContext);
    const handleClick = useCallback(() => {
        onClick?.(data);
    }, [data])

    // const image = useMemo(() => {
    //     import.meta.globEager("../assets/images/home/*")

    //     new URL(`./dir/${name}.png`, import.meta.url).href

    // }, [data])
    const imageSrc = data.image && data.image[0] === '/' ? data.image : new URL(`../../assets/images/${data.image}`, import.meta.url).href
    return (
        <SecondChildBox onClick={handleClick}>
            <div className="content">
                <div className="chart-title">{data.title}</div>
                <div className="chart-image">
                    <img src={imageSrc} alt="" />
                </div>
            </div>
        </SecondChildBox>
    )
})

const SecondItem = memo(({ title, list }: SidebarChildEntity) => {
    return (
        <SecondItemBox>
            <div className="second-title" id={title}>{title}</div>
            <div className="second-child">
                {list?.map((item, index) => <SecondChild {...item} key={index} />)}
            </div>
        </SecondItemBox>
    )
})

const Item = memo(({ title, children, icon }: SidebarEntity) => {
    return (
        <ItemBox>
            <h3 className="title" id={title}>
                <span className={`iconfont ${icon}`}></span>
                {title}
            </h3>
            <div className="child">
                {children?.map((item, index) => <SecondItem {...item} key={index} />)}
            </div>
        </ItemBox>
    )
})

const Content = memo(({ data, onClick }: ContentProps) => {
    return (
        <Box>
            <ContentContext.Provider value={{
                onClick
            }}>
                {
                    data.map((item, index) => (
                        <Item key={index} {...item} />
                    ))
                }
            </ContentContext.Provider>
        </Box>
    )
})

export default Content;
