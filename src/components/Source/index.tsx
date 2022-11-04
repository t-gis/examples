import { forwardRef, ForwardRefRenderFunction, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Box } from "./index.sty";

interface SourceProps {
    onRun?: (code: string) => void,
    onReset?: () => void,
    code: string
}

interface SourceHandle {
    setCode: (code: string) => void
}

const Source: ForwardRefRenderFunction<SourceHandle, SourceProps> = ({ onRun, onReset, code }, ref) => {
    const editorRef = useRef<any>(null);
    const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
        editorRef.current = editor;
    }, [])

    const handleReset = onReset && useCallback(onReset, [code]);
    const handleRun = useCallback(() => onRun?.(editorRef.current.getValue()), []);

    useImperativeHandle(ref, () => ({
        setCode: code => editorRef?.current?.setValue(code)
    }))

    return (
        <Box className="source-wrap">
            <div className="source-header">
                <div className="sign">
                    <div className="javascript">JS</div>
                </div>
                <span className="file-tip">JS代码</span>
                <div className="actions">
                    <div className="action" onClick={handleReset}>
                        <span className="iconfont icon-exchangerate"></span>
                        重置
                    </div>
                    <div className="action" onClick={handleRun}>
                        <span className="iconfont icon-play"></span>
                        运行
                    </div>
                </div>
            </div>
            <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                theme="vs-dark"
                options={{
                    fontSize: 14
                }}
                onMount={handleEditorDidMount}
            />
        </Box>
    )
}

export default memo(forwardRef(Source));