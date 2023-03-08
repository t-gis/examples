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
    }
    .navs {
        display: flex;
        font-size: 14px;
        margin-right: 20px;
        .nav-btn {
            cursor: pointer;
            color: #fff;
            text-decoration: none;
            &:hover {
                text-decoration: underline;
            }
        }
    }
`