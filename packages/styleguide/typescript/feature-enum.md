### 枚举

#### [建议] 当使用的多个直接量从语义上可归为一类时，应当使用枚举。

示例：

```ts
// GOOD
enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

class Position {
    x: number;
    y: number;

    move(direction: Direction) {
        switch (direction) {
            case Direction.UP:
                this.y--;
                break;
            case Direction.DOWN:
                this.y++;
                break;
            case Direction.LEFT:
                this.x--;
                break;
            case Direction.RIGHT:
                this.x++;
                break;
        }
    }
}

// BAD
type DirectionA = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

class PositionA {
    x: number;
    y: number;

    move(direction: DirectionA) {
        switch (direction) {
            case 'UP':
                this.y--;
                break;
            case 'DOWN':
                this.y++;
                break;
            case 'LEFT':
                this.x--;
                break;
            case 'RIGHT':
                this.x++;
                break;
        }
    }
}
```

#### [建议] 当枚举成员未来可能增减时，为每个成员明确赋值。

解释：

增加成员个数时，如果没有明确赋值，每个成员的值会根据位置发生变化，当旧值已持久化时，会导致不合预期的错误。

示例：

```ts
// GOOD
enum Direction {
    UP = 1,
    RIGHT = 2,
    DOWN = 3,
    LEFT = 4
}

class Model {
    constructor(public direction: Direction) {}
}

function foo(model: Model) {
    // 等同于 model.direction === 3
    if (model.direction === Direction.DOWN) {
        // do something
    }
}

// 然后需求调整增加方向：
enum Direction {
    UP = 1,
    UPRIGHT = 1.5,
    RIGHT = 2,
    RIGHTDOWN = 2.5,
    DOWN = 3,
    LEFTDOWN = 3.5,
    LEFT = 4
}

// 还能正常工作
function foo(model: Model) {
    // 等同于 model.direction === 3
    if (model.direction === Direction.DOWN) {
        // do something
    }
}
```

```ts
//  Bad
enum Direction {
    UP,
    RIGHT,
    DOWN,
    LEFT
}

class Model {
    constructor(public direction: Direction) {}
}

function foo(model: Model) {
    // 等同于 model.direction === 3
    if (model.direction === Direction.DOWN) {
        // do something
    }
}

// 然后需求调整增加方向：
enum Direction {
    UP,
    UPRIGHT,
    RIGHT,
    RIGHTDOWN,
    DOWN,
    LEFTDOWN,
    LEFT
}

// 可能出现不符合预期的情况
function foo(model: Model) {
    // 等同于 model.direction === 4
    if (model.direction === Direction.DOWN) {
        // do something
    }
}
```

#### [强制] 当使用的多个直接量类型不同时，不应归到同一枚举。

解释：

从语法上 `enum` 是支持异构值的，但是从语义上不应该出现。这通常意味着要么取值不当，要么你需要的是个结构体（ `interface` 或 `type` 实现）。

示例：

```ts
// BAD
enum Foo {
    bar = 1,
    baz = '2',
}
```
