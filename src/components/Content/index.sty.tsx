import styled from "styled-components";

export const Box = styled.div`
    box-sizing: border-box;
    flex: 1;
    padding: 40px 20px;
    height: 100%;
    overflow: auto;
`;

export const ItemBox = styled.div`
    box-sizing: border-box;
    .title {
        margin-top: 0px;
        height: 40px;
        line-height: 40px;
        margin-bottom: 0;
        margin-left: 2px;
        color: #555555;
        .iconfont {
            font-size: 18px;
            margin-right: 6px;
        }
    }
`;

export const SecondItemBox = styled.div`
    border-top: 1px solid #005ce6;
    padding-top: 45px;
    padding-bottom: 20px;
    padding: 45px 0px 20px 0px;
    .second-title {
        font-size: 16px;
        margin: 0;
        line-height: 1;
        font-weight: 300;
        padding: 20px 0px 10px 0px;
        text-indent: 0.8em;
    }
    .second-child {
        display: flex;
        flex-wrap: wrap;
    }
`

export const SecondChildBox = styled.div`
    width: 200px;
    height: 210px;
    padding: 15px 15px;
    transition: .3s;
    &:hover {
        transform: scale(1.1);
    }
    .content {
        cursor: pointer;
        height: 100%;
        border-radius: 2px;
        background: #fff;
        box-shadow: 0 0 3px rgb(150 150 150 / 50%);
        display: flex;
        flex-direction: column;
        .chart-title {
            height: 36px;
            line-height: 2.5;
            text-align: center;
            box-sizing: border-box;
            font-weight: 300;
            color: #2c3b41;
            font-size: 14px;
        }
        .chart-image {
            overflow: hidden;
            flex: 1;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
`