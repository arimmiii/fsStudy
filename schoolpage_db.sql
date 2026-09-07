-- 1. 게시판 테이블
CREATE TABLE IF NOT EXISTS public.boards (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL
);

-- 2. 사용자 테이블
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(500) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    fcm_token VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. 관심 게시판 테이블 (사용자 - 게시판)
CREATE TABLE IF NOT EXISTS public.user_boards (
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    board_id BIGINT NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, board_id)
);

-- 4. 관심 키워드 테이블
CREATE TABLE IF NOT EXISTS public.user_keywords (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    keyword VARCHAR(50) NOT NULL
);

-- 5. 게시글 테이블
CREATE TABLE IF NOT EXISTS public.posts (
    id BIGSERIAL PRIMARY KEY,
    board_id BIGINT NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    external_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    url VARCHAR(500) NOT NULL,
    author VARCHAR(100),
    content_hash VARCHAR(100),
    published_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_board_external UNIQUE (board_id, external_id)
);

-- 6. 게시글 변경 이력 테이블
CREATE TABLE IF NOT EXISTS public.post_versions (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. 알림 내역 테이블
CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    reason VARCHAR(20) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 필수 INDEX (성능 최적화)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_user_boards_board_id ON public.user_boards(board_id);
CREATE INDEX IF NOT EXISTS idx_user_keywords_user_id ON public.user_keywords(user_id);
CREATE INDEX IF NOT EXISTS idx_user_keywords_keyword ON public.user_keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_posts_board_id ON public.posts(board_id);
CREATE INDEX IF NOT EXISTS idx_post_versions_post_id ON public.post_versions(post_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON public.notifications(user_id, created_at DESC);