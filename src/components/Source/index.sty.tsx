import styled from "styled-components";

export const Box = styled.div`
    box-sizing: border-box;
    height: 100%;
    background-color: #1e1e1e;
    color: #fff;
    .source-header {
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        white-space: nowrap;
        min-width: 300px;
        text-align: center;
        background-color: #141414;
        color: #fff;
        z-index: 1000;
        position: relative;
        .sign {
            position: absolute;
            left: 10px;
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            .javascript {
                width: 24px;
                height: 24px;
                border-radius: 2px;
                background-color: #3ea6ff;
                font-size: 14px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                letter-spacing: 1px;
            }
        }
        .file-tip {
            font-size: 14px;
        }
        .actions {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 0 20px;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            .action {
                color:#1890ff;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                margin-left: 15px;
                .iconfont {
                    font-size: 20px;
                }
                &:hover {
                    color: #40a9ff;
                }
            }
        }
    }
`