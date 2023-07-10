import React, { ElementRef, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Source from '@/components/Source';
import Stage from '@/components/Stage';
import stores, { TYPE_EXAMPLE_LIST } from '@/stores';

const Sandcastle = memo(() => {

    const [code, setCode] = useState<string>("");
    const [searchParams] = useSearchParams();

    type StageHandle = React.ElementRef<typeof Stage>;
    const stageRef = React.useRef<StageHandle>(null);

    type SourceHandle = ElementRef<typeof Source>;
    const sourceRef = useRef<SourceHandle>(null);

    const getCode = useCallback(() => {
        const id = searchParams.get('id')
        if (id != null) {
            return new Promise<string>(resolve => {
                stores.on(TYPE_EXAMPLE_LIST, (content: any[]) => {
                    const one = content.find(x => x.id === id)
                    resolve(one ? one.content : '')
                })
            })
        }
        const url = searchParams.get("r");
        return new Promise<string>((resolve, reject) => {
            if(url) {
                fetch(url)
                    .then(res => res.text())
                    .then(res => resolve(res))
                    .catch(err => reject(err))
            } else  {
                reject(new Error("url is not defined"))
            }
        })
    }, [code])

    const handleRun = useCallback((code: string) => {        
        code = code.replace('import * as Map2d from "map2d"', "");
        stageRef.current?.writeIframe(code);
    }, [])

    const handleReset = useCallback(() => {
        getCode().then(res => {
            setCode(res);
            sourceRef.current?.setCode(res);
            handleRun(res);
        });
    }, [])

    useEffect(() => {
        handleReset();
    }, [location])

    return (
        <Allotment defaultSizes={[80, 200]}>
            <Allotment.Pane>
                <Source
                    ref={sourceRef}
                    code={code}
                    onRun={handleRun}
                    onReset={handleReset}
                />
            </Allotment.Pane>
            <Allotment.Pane visible>
                <Stage ref={stageRef} />
            </Allotment.Pane>
        </Allotment>
    );
})

export default Sandcastle;