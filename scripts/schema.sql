CREATE TABLE users (
  user_id STRING(36) NOT NULL,
  email STRING(255) NOT NULL,
  username STRING(100) NOT NULL,
  created_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true),
  updated_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true)
) PRIMARY KEY (user_id);

CREATE UNIQUE INDEX idx_users_email ON users(email);

CREATE TABLE categories (
  user_id STRING(36) NOT NULL,
  category_id STRING(36) NOT NULL,
  name STRING(100) NOT NULL,
  color STRING(7),
  created_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true),
  CONSTRAINT FK_categories_user FOREIGN KEY (user_id) REFERENCES users (user_id)
) PRIMARY KEY (user_id, category_id),
  INTERLEAVE IN PARENT users ON DELETE CASCADE;

CREATE TABLE todos (
  todo_id STRING(36) NOT NULL,
  user_id STRING(36) NOT NULL,
  category_id STRING(36),
  title STRING(255) NOT NULL,
  description STRING(MAX),
  status STRING(20) NOT NULL,
  priority STRING(10) NOT NULL,
  due_date DATE,
  created_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true),
  updated_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true),
  completed_at TIMESTAMP,
  CONSTRAINT FK_todos_user FOREIGN KEY (user_id) REFERENCES users (user_id),
  CONSTRAINT FK_todos_category FOREIGN KEY (category_id) REFERENCES categories (category_id)
) PRIMARY KEY (todo_id);

CREATE INDEX idx_todos_user_status ON todos(user_id, status);
CREATE INDEX idx_todos_due_date ON todos(due_date);

CREATE TABLE comments (
  todo_id STRING(36) NOT NULL,
  comment_id STRING(36) NOT NULL,
  user_id STRING(36) NOT NULL,
  content STRING(MAX) NOT NULL,
  created_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true),
  CONSTRAINT FK_comments_todo FOREIGN KEY (todo_id) REFERENCES todos (todo_id),
  CONSTRAINT FK_comments_user FOREIGN KEY (user_id) REFERENCES users (user_id)
) PRIMARY KEY (todo_id, comment_id),
  INTERLEAVE IN PARENT todos ON DELETE CASCADE;

CREATE TABLE attachments (
  todo_id STRING(36) NOT NULL,
  attachment_id STRING(36) NOT NULL,
  user_id STRING(36) NOT NULL,
  filename STRING(255) NOT NULL,
  file_size INT64 NOT NULL,
  mime_type STRING(100) NOT NULL,
  storage_path STRING(500) NOT NULL,
  uploaded_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true),
  CONSTRAINT FK_attachments_todo FOREIGN KEY (todo_id) REFERENCES todos (todo_id),
  CONSTRAINT FK_attachments_user FOREIGN KEY (user_id) REFERENCES users (user_id)
) PRIMARY KEY (todo_id, attachment_id),
  INTERLEAVE IN PARENT todos ON DELETE CASCADE;

CREATE TABLE tags (
  tag_id STRING(36) NOT NULL,
  name STRING(50) NOT NULL,
  created_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true)
) PRIMARY KEY (tag_id);

CREATE UNIQUE INDEX idx_tags_name ON tags(name);

CREATE TABLE todo_tags (
  todo_id STRING(36) NOT NULL,
  tag_id STRING(36) NOT NULL,
  created_at TIMESTAMP NOT NULL OPTIONS (allow_commit_timestamp=true),
  CONSTRAINT FK_todo_tags_todo FOREIGN KEY (todo_id) REFERENCES todos (todo_id),
  CONSTRAINT FK_todo_tags_tag FOREIGN KEY (tag_id) REFERENCES tags (tag_id)
) PRIMARY KEY (todo_id, tag_id),
  INTERLEAVE IN PARENT todos ON DELETE CASCADE;