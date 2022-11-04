import styled from "styled-components";

export const Box = styled.div`
    box-sizing: border-box;
    position: relative;
    height: 100%;
`

export const SidebarBox = styled.div`
    width: 178px;
    height: 100%;
    color: #000;
    left: 0;
    top: 0;
    background-color: #302d2d;
`

export const SidebarItemBox = styled.div`
    cursor: pointer;
    transition: .3s;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    .label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 12px 15px;
        &:hover, &.active {
            background-color: rgba(255, 255, 255, 0.1);
        }
        .label-title {
            display: flex;
            align-items: center;
            color: #d2d2d2;
            .title-icon {
                display: flex;
                align-items: center;
                margin-right: 4px;
            }
            .title-text {
                font-size: 14px;
                display: flex;
                align-items: center;
                font-weight: bold;
            }
        }
        .collapse-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            transition: .3s;
            color: #d2d2d2;
            .iconfont {
                font-size: 16px;
            }
            &.collapse {
                transform: rotate(90deg);
                transform-origin: center center;
            }
        }
    }
    .children {
        width: 100%;
    }
`

export const SidebarItemChildBox = styled.div`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 10px 0px 10px 30px;
    width: 100%;
    position: relative;
    &:hover, &.active {
        background-color: rgba(255, 255, 255, 0.1);
    }
    &:hover::before {
        content: " ";
        display: block;
        width: 3px;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.3);
    }
    .child-icon {
        width: 6px;
        height: 6px;
        border-radius: 6px;
        background-color: #fff;
        margin-right: 6px;
    }
    .child-title {
        font-weight: 300;
        font-size: 12px;
        color: #d2d2d2;
    }
`