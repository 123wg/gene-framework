import { Document, ShortUUID } from '@gene/core';
import { app } from '@gene/platform';
import * as dat from 'dat.gui';
import { CreatePipeRequest } from './test_sdk/create_pipe_request';
import { EN_AppRequestId } from './test_sdk/config';

/**
 * 测试入口
 */
export class TestUtil {
    public static run() {
        new TestUtil().init();
    }

    public init() {
        const doc = new Document(ShortUUID.uuid());
        app.start(doc);
        app.createCanvas(document.getElementById('container') as HTMLDivElement);
        window.app = app;

        const parameters = {
            save: () => {
                console.log('保存');
            },
            load: () => {
                console.log('从本地加载');
            },
            undo: () => {
                app.doc.transactionMgr.undo();
                app.doc.updateView();
            },
            redo: () => {
                app.doc.transactionMgr.redo();
                app.doc.updateView();
            },
            startRecord: () => {
                console.log('开始录制');
            },
            stopRecord: () => {
                console.log('停止录制');
            },

            drawPipe: () => {
                app.requestMgr.startSession();
                const req = app.requestMgr.createRequest<CreatePipeRequest>(EN_AppRequestId.CREATE_PIPE, [2, 3]);

                // const req = new CreatePipeRequest();
                app.requestMgr.commitRequest(req);
                app.requestMgr.commitSession();
                doc.updateView();
            },
            drawPolygon: () => {
                console.log('绘制多边形');
            },
            drawImage: () => {
                console.log('绘制图片');
            }
        };
        const gui = new dat.GUI();


        gui.add(parameters, 'undo').name('撤销');
        gui.add(parameters, 'redo').name('恢复');

        const folder1 = gui.addFolder('录制脚本');
        folder1.add(parameters, 'startRecord').name('开始录制');
        folder1.add(parameters, 'stopRecord').name('停止录制');
        folder1.open();

        const folder2 = gui.addFolder('图元');
        folder2.add(parameters, 'drawPipe').name('管道');
        folder2.add(parameters, 'drawPolygon').name('多边形');
        folder2.add(parameters, 'drawImage').name('绘制图片');
        folder2.open();

        gui.add(parameters, 'save').name('保存到本地');
        gui.add(parameters, 'load').name('从本地加载');
    }
}
