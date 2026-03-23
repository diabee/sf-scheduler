export interface AppConfig {
  backgroundImage: string;
}

export type ViewState = 'login' | 'dashboard' | 'schedule' | 'upcoming_tasks' | 'schedule_logs';

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  name?: string;
  department?: string;
  memo?: string;
  extension?: string;
  roles: string[];
  enabled: boolean;
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  name?: string;
  department?: string;
  memo?: string;
  extension?: string;
  enabled: boolean;
  roles: string[];
}


export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  name?: string;
  department?: string;
  memo?: string;
  extension?: string;
  roleNames?: string[];
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  name?: string;
  department?: string;
  memo?: string;
  extension?: string;
  enabled?: boolean;
  roleNames?: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
  captchaId?: string;
  captchaCode?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

export interface CaptchaResponse {
  captchaId: string;
  captchaImage: string;
}


export interface ApiError {
  code: string;
  message: string;
  detail?: string;
  path?: string;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Backend DTOs
export type PermissionType = 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';

export interface PermissionDTO {
  id: number;
  name: string;
  description: string;
  type: PermissionType;
}

export interface RoleDTO {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

export interface CreateRoleRequest {
  name: string;
  description: string;
}

export interface CreatePermissionRequest {
  name: string;
  description: string;
  type: PermissionType;
}

export type ResourceType = 'MENU' | 'PORTAL' | 'SF_BUILDER';

export interface ResourceDTO {
  id: number;
  code: string;
  name: string;
  nameEn?: string;
  nameZh?: string;
  description: string;
  descriptionEn?: string;
  descriptionZh?: string;
  type: ResourceType;
  parentId: number | null;
  icon?: string;
  url?: string;
  color?: string;
  ssoEnabled?: boolean;
  ssoType?: 'TOKEN' | 'OAUTH2';
  sortOrder?: number;
  enabled: boolean;
  permissions?: string[];
}

export interface ResourceTreeDTO extends ResourceDTO {
  children: ResourceTreeDTO[];
}

export interface UserPermissionsDTO {
  menus: ResourceTreeDTO[];
  portals: ResourceDTO[];
  permissions: string[];
  roles: string[];
}

export interface GroupDTO {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  enabled: boolean;
  roles: RoleDTO[];
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  parentId?: number;
}

export interface CreateResourceRequest {
  code: string;
  name: string;
  nameEn?: string;
  nameZh?: string;
  description: string;
  descriptionEn?: string;
  descriptionZh?: string;
  type: ResourceType;
  parentId?: number | null;
  icon?: string;
  url?: string;
  color?: string;
  ssoEnabled?: boolean;
  ssoType?: 'TOKEN' | 'OAUTH2';
  enabled?: boolean;
  sortOrder?: number;
}

// Agent Management Types - snake_case to match backend API
export interface AgentApplDTO {
  id: string;
  app_name: string;
  topic_ext: string;
  sf_parallel: Record<string, unknown>;
  wait_time: number;
  wait_for_topic: Record<string, unknown>;
  sf_app_data: Record<string, unknown>;
  sf_design_config_id: string;
  produce_topic?: string;
  active: number;
}

export interface AgentDTO {
  id: string;
  name: string;
  version: string;
  start_flow_id: string;
  description: string;
  agent_config: Record<string, unknown>;
  trigger_msg: Record<string, unknown> | null;
  is_deleted: number;
  active: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  appls: AgentApplDTO[];
  applCount?: number; // computed field (may not exist in API)
}

export interface AgentListResponse {
  agents: AgentDTO[];
  pagination_info: {
    total: number;
    page_index: number;
    page_num: number;
    per_page_size: number;
  };
}

export interface CreateAgentRequest {
  name: string;
  version?: string;
  startFlowId?: string;
  description?: string;
  agentConfig?: Record<string, unknown>;
  triggerMsg?: Record<string, unknown>;
  appls?: CreateAgentApplRequest[];
}

export interface CreateAgentApplRequest {
  appName: string;
  topicExt?: string;
  sfParallel?: Record<string, unknown>;
  waitTime?: number;
  waitForTopic?: Record<string, unknown>;
  sfAppData?: Record<string, unknown>;
  sfDesignConfigId?: string;
  produceTopic?: string;
  active?: number;
}

export interface UpdateAgentRequest {
  name?: string;
  version?: string;
  startFlowId?: string;
  description?: string;
  agentConfig?: Record<string, unknown>;
  triggerMsg?: Record<string, unknown>;
  active?: number;
  appls?: CreateAgentApplRequest[];
}
