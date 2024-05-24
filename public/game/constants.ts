export const
    STEP_LENGTH = 10,

    SIZE = 50,
    SPEED = 0.25,
    FRICTION = 0.9,
    SLIDE_FRICTION = 0.99,
    ROT_SPEED = 0.005,
    ROT_FRICTION = 0.9,
    DASH_POW = 6,
    DASH_COOLDOWN = 500,

    SHOOT_FRAMES = 54,
    SHOOT_POINT = 0.55,
    SHOOT_TIME = 50,

    BULLET_SIZE = 10,
    BULLET_SPEED = 0.75,
    COLLISION_DISTANCE = 25,
    KNOCKBACK = 4,

    CAMERA_ACCELERATION = 0.005,
    CAMERA_FRICTION = 0.8,

    SIZE_PER_PLAYER = 80000,
    WALL_FORCE = 1.5,

    NAME_HEIGHT = 40,
    INFO_HEIGHT = 30,
    LEADERBOARD_SIZE = 5,

    MAX_ROLLBACK = 1000,

    FORWARD_KEYS = new Set(["ArrowUp", "KeyW"]),
    LEFT_KEYS = new Set(["ArrowLeft", "KeyA"]),
    RIGHT_KEYS = new Set(["ArrowRight", "KeyD"]),
    DASH_KEYS = new Set(["ArrowDown", "KeyS", "KeyZ", "KeyL", "ShiftLeft"]),
    SHOOT_KEYS = new Set(["KeyX", "KeyK", "Space"])