import { envConfig, logger } from '~/configs/env';
import { AppError, ErrorCode, getHttpErrorCode } from '~/utils/error';
import type {
  AgentDTO,
  AgentListResponse,
  ApiError,
  AuthResponse,
  CaptchaResponse,
  CreateAgentRequest,
  CreateGroupRequest,
  CreatePermissionRequest,
  CreateResourceRequest,
  CreateRoleRequest,
  CreateUserRequest,
  ForgotPasswordRequest,
  GroupDTO,
  LoginRequest,
  PermissionDTO,
  ResetPasswordRequest,
  ResourceDTO,
  RoleDTO,
  UpdateAgentRequest,
  UpdateProfileRequest,
  UpdateUserRequest,
  UserDTO,
  UserPermissionsDTO,
  ValidateTokenResponse,
  PageResponse,
} from '~/types';

const AUTH_TOKEN_KEY = 'auth_token';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem(AUTH_TOKEN_KEY);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const url = `${envConfig.apiBaseUrl}${endpoint}`;
    logger.debug('API Request:', options.method || 'GET', url);

    let response: Response;
    try {
      response = await fetch(url, { ...options, headers });
    } catch (error) {
      logger.error('Network error:', error);
      throw new AppError('Network connection failed', ErrorCode.NETWORK_ERROR);
    }

    if (!response.ok) {
      const errorCode = getHttpErrorCode(response.status);
      let errorData: ApiError = {
        code: errorCode,
        message: response.statusText,
      };
      
      try {
        const jsonError = await response.json();
        errorData = {
          code: jsonError.code || errorCode,
          message: jsonError.message || response.statusText,
        };
      } catch {
        // Use default error data
      }
      
      logger.error('API Error:', response.status, errorData);
      
      if (response.status === 401) {
        this.clearToken();
      }
      
      throw new AppError(errorData.message, errorData.code, response.status);
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    const json = JSON.parse(text);
    return json.data !== undefined ? json.data : json;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  getToken(): string | null {
    return this.token;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/v2/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(response.token);
    return response;
  }

  async getCaptcha(): Promise<CaptchaResponse> {
    return this.request<CaptchaResponse>('/api/v2/captcha');
  }

  async isCaptchaEnabled(): Promise<boolean> {
    return this.request<boolean>('/api/v2/captcha/status');
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    await this.request<void>('/api/v2/password/forgot', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async validateResetToken(token: string): Promise<ValidateTokenResponse> {
    return this.request<ValidateTokenResponse>(`/api/v2/password/validate?token=${encodeURIComponent(token)}`);
  }

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await this.request<void>('/api/v2/password/reset', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getCurrentUser(): Promise<UserDTO> {
    return this.request<UserDTO>('/api/v2/users/me', { method: 'GET' });
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserDTO> {
    return this.request<UserDTO>('/api/v2/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==================== User Management API ====================
  async getUsers(page: number = 0, size: number = 10, sort: string = 'username,asc'): Promise<PageResponse<UserDTO>> {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sort: sort,
    });
    return this.request<PageResponse<UserDTO>>(`/api/v2/users?${params.toString()}`);
  }

  async getUser(id: number): Promise<UserDTO> {
    return this.request<UserDTO>(`/api/v2/users/${id}`);
  }

  async createUser(data: CreateUserRequest): Promise<UserDTO> {
    return this.request<UserDTO>('/api/v2/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: number, data: UpdateUserRequest): Promise<UserDTO> {
    return this.request<UserDTO>(`/api/v2/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: number): Promise<void> {
    return this.request<void>(`/api/v2/users/${id}`, { method: 'DELETE' });
  }

  async assignRoleToUser(userId: number, roleName: string): Promise<UserDTO> {
    return this.request<UserDTO>(`/api/v2/users/${userId}/roles/${roleName}`, {
      method: 'POST',
    });
  }

  async removeRoleFromUser(userId: number, roleName: string): Promise<UserDTO> {
    return this.request<UserDTO>(`/api/v2/users/${userId}/roles/${roleName}`, {
      method: 'DELETE',
    });
  }

  async verifyToken(): Promise<UserDTO | null> {
    if (!this.token) return null;
    try {
      return await this.getCurrentUser();
    } catch {
      this.clearToken();
      return null;
    }
  }

  logout() {
    this.clearToken();
  }

  // ==================== Role API ====================
  async getRoles(): Promise<RoleDTO[]> {
    return this.request<RoleDTO[]>('/api/v2/roles');
  }

  async getRole(id: number): Promise<RoleDTO> {
    return this.request<RoleDTO>(`/api/v2/roles/${id}`);
  }

  async createRole(data: CreateRoleRequest): Promise<RoleDTO> {
    return this.request<RoleDTO>('/api/v2/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRole(id: number, data: Partial<CreateRoleRequest>): Promise<RoleDTO> {
    return this.request<RoleDTO>(`/api/v2/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRole(id: number): Promise<void> {
    return this.request<void>(`/api/v2/roles/${id}`, { method: 'DELETE' });
  }

  async addPermissionToRole(roleId: number, permissionName: string): Promise<RoleDTO> {
    return this.request<RoleDTO>(`/api/v2/roles/${roleId}/permissions/${permissionName}`, {
      method: 'POST',
    });
  }

  async removePermissionFromRole(roleId: number, permissionName: string): Promise<RoleDTO> {
    return this.request<RoleDTO>(`/api/v2/roles/${roleId}/permissions/${permissionName}`, {
      method: 'DELETE',
    });
  }

  // ==================== Permission API ====================
  async getPermissions(): Promise<PermissionDTO[]> {
    return this.request<PermissionDTO[]>('/api/v2/permissions');
  }

  async getPermission(id: number): Promise<PermissionDTO> {
    return this.request<PermissionDTO>(`/api/v2/permissions/${id}`);
  }

  async createPermission(data: CreatePermissionRequest): Promise<PermissionDTO> {
    return this.request<PermissionDTO>('/api/v2/permissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePermission(id: number, data: Partial<CreatePermissionRequest>): Promise<PermissionDTO> {
    return this.request<PermissionDTO>(`/api/v2/permissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePermission(id: number): Promise<void> {
    return this.request<void>(`/api/v2/permissions/${id}`, { method: 'DELETE' });
  }

  // ==================== Group API ====================
  async getGroups(): Promise<GroupDTO[]> {
    return this.request<GroupDTO[]>('/api/v2/groups');
  }

  async getGroup(id: number): Promise<GroupDTO> {
    return this.request<GroupDTO>(`/api/v2/groups/${id}`);
  }

  async createGroup(data: CreateGroupRequest): Promise<GroupDTO> {
    return this.request<GroupDTO>('/api/v2/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGroup(id: number, data: Partial<CreateGroupRequest>): Promise<GroupDTO> {
    return this.request<GroupDTO>(`/api/v2/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGroup(id: number): Promise<void> {
    return this.request<void>(`/api/v2/groups/${id}`, { method: 'DELETE' });
  }

  async addRoleToGroup(groupId: number, roleName: string): Promise<GroupDTO> {
    return this.request<GroupDTO>(`/api/v2/groups/${groupId}/roles/${roleName}`, {
      method: 'POST',
    });
  }

  async removeRoleFromGroup(groupId: number, roleName: string): Promise<GroupDTO> {
    return this.request<GroupDTO>(`/api/v2/groups/${groupId}/roles/${roleName}`, {
      method: 'DELETE',
    });
  }

  // ==================== Resource API ====================
  async getResources(): Promise<ResourceDTO[]> {
    return this.request<ResourceDTO[]>('/api/v2/resources');
  }

  async getResource(id: number): Promise<ResourceDTO> {
    return this.request<ResourceDTO>(`/api/v2/resources/${id}`);
  }

  async createResource(data: CreateResourceRequest): Promise<ResourceDTO> {
    return this.request<ResourceDTO>('/api/v2/resources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateResource(id: number, data: Partial<CreateResourceRequest>): Promise<ResourceDTO> {
    return this.request<ResourceDTO>(`/api/v2/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteResource(id: number): Promise<void> {
    return this.request<void>(`/api/v2/resources/${id}`, { method: 'DELETE' });
  }

  async getResourcesByType(type: string): Promise<ResourceDTO[]> {
    return this.request<ResourceDTO[]>(`/api/v2/resources/type/${type}`);
  }

  async getResourceTree(): Promise<ResourceDTO[]> {
    return this.request<ResourceDTO[]>('/api/v2/resources/tree');
  }

  async getResourceTypes(): Promise<string[]> {
    return this.request<string[]>('/api/v2/resources/types');
  }

  async addPermissionToResource(resourceId: number, permissionName: string): Promise<ResourceDTO> {
    return this.request<ResourceDTO>(`/api/v2/resources/${resourceId}/permissions/${permissionName}`, {
      method: 'POST',
    });
  }

  async removePermissionFromResource(resourceId: number, permissionName: string): Promise<ResourceDTO> {
    return this.request<ResourceDTO>(`/api/v2/resources/${resourceId}/permissions/${permissionName}`, {
      method: 'DELETE',
    });
  }

  // ==================== User Permissions API ====================
  async getUserPermissions(): Promise<UserPermissionsDTO> {
    return this.request<UserPermissionsDTO>('/api/v2/user-permissions');
  }

  // ==================== SSO API ====================
  async createSsoToken(target: string): Promise<{ token?: string; refreshToken?: string; redirectUrl: string; expiresAt?: string; ssoType: 'TOKEN' | 'OAUTH2' }> {
    return this.request<{ token?: string; refreshToken?: string; redirectUrl: string; expiresAt?: string; ssoType: 'TOKEN' | 'OAUTH2' }>('/api/v2/sso/token', {
      method: 'POST',
      body: JSON.stringify({ target }),
    });
  }

  async getExternalSystems(): Promise<Array<{ code: string; name: string; baseUrl: string; ssoEndpoint: string }>> {
    return this.request<Array<{ code: string; name: string; baseUrl: string; ssoEndpoint: string }>>('/api/v2/sso/systems');
  }

  async getDaasSsoTokens(): Promise<{ status: string; data: { token: string; refresh_token: string } }> {
    return this.request<{ status: string; data: { token: string; refresh_token: string } }>('/api/v2/sso/jump/daas');
  }

  // ==================== Agent Management API ====================
  async getAgents(
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortType: string = 'desc',
    keyword?: string
  ): Promise<AgentListResponse> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
      sort_by: sortBy,
      sort_type: sortType,
    });
    if (keyword) {
      params.append('keyword', keyword);
    }
    return this.request<AgentListResponse>(`/api/v2/agents?${params.toString()}`);
  }

  async getAgent(id: string): Promise<AgentDTO> {
    return this.request<AgentDTO>(`/api/v2/agents/${id}`);
  }

  async createAgent(data: CreateAgentRequest): Promise<AgentDTO> {
    return this.request<AgentDTO>('/api/v2/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAgent(id: string, data: UpdateAgentRequest): Promise<AgentDTO> {
    return this.request<AgentDTO>(`/api/v2/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAgent(id: string): Promise<void> {
    return this.request<void>(`/api/v2/agents/${id}`, { method: 'DELETE' });
  }

  async startAgent(id: string): Promise<AgentDTO> {
    return this.request<AgentDTO>(`/api/v2/agents/${id}/start`, { method: 'POST' });
  }

  async stopAgent(id: string): Promise<AgentDTO> {
    return this.request<AgentDTO>(`/api/v2/agents/${id}/stop`, { method: 'POST' });
  }

  async duplicateAgent(id: string): Promise<AgentDTO> {
    return this.request<AgentDTO>(`/api/v2/agents/${id}/duplicate`, { method: 'POST' });
  }

  async triggerAgent(id: string, params?: Record<string, unknown>): Promise<{ agent_id: string; status: string }> {
    return this.request<{ agent_id: string; status: string }>(`/api/v2/agents/${id}/trigger`, {
      method: 'POST',
      body: JSON.stringify(params || {}),
    });
  }

  async getAgentConfig(id: string): Promise<{ agent_config: Record<string, unknown>; trigger_msg: Record<string, unknown> }> {
    return this.request<{ agent_config: Record<string, unknown>; trigger_msg: Record<string, unknown> }>(`/api/v2/agents/${id}/config`);
  }

  async updateAgentConfig(id: string, config: { agent_config?: Record<string, unknown>; trigger_msg?: Record<string, unknown> }): Promise<AgentDTO> {
    return this.request<AgentDTO>(`/api/v2/agents/${id}/config`, {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

}

export const apiService = new ApiService();
