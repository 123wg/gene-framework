import * as dat from 'dat.gui';

/**
 * 测试入口
 */
export class TestUtil {
    public static run() {
        new TestUtil().init();
    }

    public init() {
        const parameters = {
            save: () => {
                console.log('保存');
            },
            undo: () => {
                console.log('撤销');
            },
            redo: () => {
                console.log('恢复');
            },
            startRecord: () => {
                console.log('开始录制');
            },
            stopRecord: () => {
                console.log('停止录制');
            },

            drawPipe: () => {
                console.log('绘制管道');
            },
            drawPolygon: () => {
                console.log('绘制多边形');
            }
        };
        const gui = new dat.GUI();

        gui.add(parameters, 'save').name('保存');
        gui.add(parameters, 'undo').name('撤销');
        gui.add(parameters, 'redo').name('恢复');

        const folder1 = gui.addFolder('录制脚本');
        folder1.add(parameters, 'startRecord').name('开始录制');
        folder1.add(parameters, 'stopRecord').name('停止录制');
        folder1.open();

        const folder2 = gui.addFolder('图元');
        folder2.add(parameters, 'drawPipe').name('管道');
        folder2.add(parameters, 'drawPolygon').name('多边形');
    }
}