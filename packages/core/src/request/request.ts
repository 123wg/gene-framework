/**
 * 
 * 使用RequestMgr.startSession 新建一个Session 
 * session执行request后直接保存
 * 
 * 最终关系
 * RequestMgr中 SessionStack
 * Session[Req,Req,Req], Session[Req,Req,Req]
 * 回放 所有Req拿出来再执行一遍
 * undo/redo undo 取一个Session 所有的Req反向执行
 * 
 * 修改
 * 目的:支持单元测试,隐藏transaction
 * 修改RequestMgr startSession 创建transaction_group
 * 所有的修改通过new Request实现,request的传参和通过RequestMgr提交的方式 参考yt-scss的实现
 * Request提交通过RequestMgr实现
 */