import './index.css';
import './cmd/export_all_cmd';
import svgLogo from './assets/react.svg';
import { TestUtil } from "./test_util";
import { AssetsMgr } from '@gene/core';



//图片预加载
await AssetsMgr.instance().preloadImg(svgLogo);
TestUtil.run();