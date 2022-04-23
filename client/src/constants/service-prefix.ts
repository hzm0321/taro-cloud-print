/**
 * 服务前缀
 */

export const PRODUCTION_CLOUD_SERVICE = "production-0gn9kr9j6aa02d8d";

export const TEST_CLOUD_SERVICE = "test-73xxf";

// FIXME 临时切换环境
export const CLOUD_SERVICE =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_CLOUD_SERVICE
    : TEST_CLOUD_SERVICE;

export const SERVICE_FUNCTION = {
  FILE: "file",
};
