import { Document, ShortUUID } from '@gene/core';
import { app, EN_PlatFormCmdIds } from '@gene/platform';
import * as dat from 'dat.gui';
import { EN_AppCmd } from './cmd/cmd_id';
import { AssetsMgr } from '@gene/core';
import { CreateImageRequest } from './test_sdk/image/create_image_request';

/**
 * 测试入口
 */
export class TestUtil {

    public static async init() {
        await TestUtil.loadImg();
        TestUtil.run();
    }
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
                app.cmdMgr.sendCmd(EN_PlatFormCmdIds.CMD_UNDO);
            },
            redo: () => {
                app.cmdMgr.sendCmd(EN_PlatFormCmdIds.CMD_REDO);
            },
            startRecord: () => {
                console.log('开始录制');
            },
            stopRecord: () => {
                console.log('停止录制');
            },

            drawPipe: () => {
                app.cmdMgr.sendCmd(EN_AppCmd.DRAW_PIPE_CMD);
            },
            drawCircle: () => {
                app.cmdMgr.sendCmd(EN_AppCmd.DRAW_CIRCLE_CMD);
            },
            drawPolygon: () => {
                app.cmdMgr.sendCmd(EN_AppCmd.DRAW_REG_POLYGON);
            },
            drawImage: () => {
                // console.log('绘制图片');
                app.requestMgr.startSession();
                const req = app.requestMgr.createRequest(CreateImageRequest, AssetsMgr.instance().randomImgSrc());
                app.requestMgr.commitRequest(req);
                app.requestMgr.commitSession();
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
        folder2.add(parameters, 'drawCircle').name('圆形');
        folder2.add(parameters, 'drawPolygon').name('多边形');
        folder2.add(parameters, 'drawImage').name('绘制图片');
        folder2.open();

        gui.add(parameters, 'save').name('保存到本地');
        gui.add(parameters, 'load').name('从本地加载');
    }

    /**
     * 预加载一些图片
     */
    public static async loadImg() {
        const images = import.meta.glob<{ default: string }>('./assets/daping/**/*.{png,jpg,jpeg,svg}');
        const promises: Promise<void>[] = [];
        Object.keys(images).forEach(_ => {
            promises.push(new Promise((resolve) => {
                images[_]().then(async module => {
                    await AssetsMgr.instance().preloadImg([module.default]);
                    resolve();
                });
            }));
        });
        await Promise.all(promises);

        console.log(AssetsMgr.instance());
    }
}
