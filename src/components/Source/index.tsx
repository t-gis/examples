import { forwardRef, ForwardRefRenderFunction, memo, useCallback, useImperativeHandle, useRef, useState } from "react";
import Editor, { OnMount, loader } from "@monaco-editor/react";
import { Box } from "./index.sty";

import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === "json") {
            return new jsonWorker()
        }
        if (label === "css" || label === "scss" || label === "less") {
            return new cssWorker()
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
            return new htmlWorker()
        }
        if (label === "typescript" || label === "javascript") {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

loader.config({ monaco });

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
                    fontSize: 16
                }}
                onMount={handleEditorDidMount}
            />
        </Box>
    )
}

export default memo(forwardRef(Source));