import { forwardRef, ForwardRefRenderFunction, memo, useImperativeHandle, useRef } from "react"
import { Box } from "./index.sty"

type SandcastleProps = {}

type SandcastleHandle = {
    writeIframe: (code: string) => void
}

const Sandcastle: ForwardRefRenderFunction<SandcastleHandle, SandcastleProps> = ((props, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const writeIframe = (code: string) => {        
        if (iframeRef.current) {
            const iframeDoc = iframeRef.current.contentDocument;
            iframeDoc?.open();
            iframeDoc?.write(`
                <head>
                    <script src="./Sandcastle-header.js"></script>
                    <link rel="stylesheet" href="./Sandcastle-header.css" />
                    <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@7.1.0/ol.css" /> -->
                    <!-- <script src="https://cdn.jsdelivr.net/npm/ol@7.1.0/dist/ol.js"></script> -->

                    <link rel="stylesheet" href="./openlayers/v7.1.0/ol.css" />
                    <script src="./openlayers/v7.1.0/ol.js"></script>
                    <script src="./map2d.iife.js"></script>
                    <style>
                        *, html, body {
                            padding: 0;
                            margin: 0;
                        }
                        #map {
                            position: fixed;
                            left: 0px;
                            right: 0px;
                            bottom: 0px;
                            top: 0px;
                            background: #ececec;
                        }
                        #toolbar {
                            margin: 5px;
                            padding: 2px 5px;
                            position: absolute;
                        }
                        .cesium-button input, .cesium-button label {
                            display: flex;
                            align-items: center;
                        }
                        .cesium-button input, .cesium-button label input {
                            margin-right: 4px;
                        }
                    </style>
                </head>
                <body onload="onload()">
                    <div id="map"></div>
                    <div id="toolbar"></div>
                    <script>
                        function onload(){
                            ${code}
                        }
                    </script>
                </body>
            `);
            iframeDoc?.close();
        }
    }
    useImperativeHandle(ref, () => ({
        writeIframe
    }))
    return (
        <Box>
            <iframe ref={iframeRef}></iframe>
        </Box>
    )
}) 

export default memo(forwardRef(Sandcastle));