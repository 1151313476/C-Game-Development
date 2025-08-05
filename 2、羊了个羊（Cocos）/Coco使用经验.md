# 将当前节点设为持久根节点，切换场景时不会被销毁

```typescript
    director.addPersistRootNode(this.node);
```

# 监听场景启动完成事件

```typescript
    director.on(Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLaunched, this);
```



