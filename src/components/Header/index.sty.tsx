import styled from "styled-components";

export const Box = styled.div`
    box-sizing: border-box;
    height: 70px;
    background-color: #005ce6;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    .title {
        font-weight: bold;
        font-size: 20px;
        display: flex;
        align-items: center;
        .icon-home {
            font-size: 24px;
            margin-right: 12px;
            cursor: pointer;
        }
    }
    .navs {
        display: flex;
        font-size: 14px;
        margin-right: 20px;
        .nav-btn {
            cursor: pointer;
            color: #fff;
            text-decoration: none;
            margin-left: 12px;
            &:hover {
                text-decoration: underline;
            }
        }
    }
`