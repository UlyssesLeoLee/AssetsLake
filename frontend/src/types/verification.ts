/*
```cypher
CREATE
  (f:File {name: "verification.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/types/verification", type: "module"}),
  (c1:Class {name: "VerificationAppInfo", type: "class", language: "typescript", signature: "interface VerificationAppInfo"}),
  (c2:Class {name: "StartVerificationRequest", type: "class", language: "typescript", signature: "interface StartVerificationRequest"}),
  (c3:Class {name: "StartVerificationResponse", type: "class", language: "typescript", signature: "interface StartVerificationResponse"}),
  (c4:Class {name: "VerifyCodeRequest", type: "class", language: "typescript", signature: "interface VerifyCodeRequest"}),
  (c5:Class {name: "VerifyCodeResponse", type: "class", language: "typescript", signature: "interface VerifyCodeResponse"}),
  (c6:Class {name: "RegisterWithVerificationRequest", type: "class", language: "typescript", signature: "interface RegisterWithVerificationRequest"}),
  (c7:Class {name: "ChangePasswordWithVerificationRequest", type: "class", language: "typescript", signature: "interface ChangePasswordWithVerificationRequest"}),
  (c8:Class {name: "VerificationUserResponse", type: "class", language: "typescript", signature: "interface VerificationUserResponse"}),
  (c9:Class {name: "VerificationMutationResponse", type: "class", language: "typescript", signature: "interface VerificationMutationResponse"}),
  (c10:Class {name: "VerificationOutboxItem", type: "class", language: "typescript", signature: "interface VerificationOutboxItem"}),
  (v1:Variable {name: "challenge_id", type: "variable"}),
  (v2:Variable {name: "verification_token", type: "variable"}),
  (v3:Variable {name: "app_key", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(c1),
  (m)-[:CONTAINS]->(c2),
  (m)-[:CONTAINS]->(c3),
  (m)-[:CONTAINS]->(c4),
  (m)-[:CONTAINS]->(c5),
  (m)-[:CONTAINS]->(c6),
  (m)-[:CONTAINS]->(c7),
  (m)-[:CONTAINS]->(c8),
  (m)-[:CONTAINS]->(c9),
  (m)-[:CONTAINS]->(c10),
  (c1)-[:USES]->(v3),
  (c2)-[:USES]->(v3),
  (c3)-[:USES]->(v1),
  (c3)-[:USES]->(v3),
  (c5)-[:USES]->(v1),
  (c5)-[:USES]->(v2),
  (c6)-[:USES]->(v1),
  (c6)-[:USES]->(v2),
  (c6)-[:USES]->(v3),
  (c7)-[:USES]->(v1),
  (c7)-[:USES]->(v2),
  (c7)-[:USES]->(v3);
```
*/

export interface VerificationAppInfo {
  app_key: string;
  name: string;
  owner_email: string;
  sender_email: string;
  sms_sender_label: string;
  dev_code_visible: boolean;
}

export interface StartVerificationRequest {
  app_key?: string;
  purpose: 'registration' | 'password_change';
  channel?: 'sms' | 'email';
  phone_number?: string;
  email?: string;
  client_ref?: string;
  metadata?: Record<string, unknown>;
}

export interface StartVerificationResponse {
  challenge_id: string;
  app_key: string;
  purpose: string;
  channel: string;
  masked_target: string;
  expires_at: string;
  delivery_status: string;
  dev_code?: string | null;
}

export interface VerifyCodeRequest {
  code: string;
}

export interface VerifyCodeResponse {
  challenge_id: string;
  purpose: string;
  verified: boolean;
  masked_target: string;
  verification_token: string;
  expires_at: string;
}

export interface RegisterWithVerificationRequest {
  app_key?: string;
  challenge_id: string;
  verification_token: string;
  username: string;
  password: string;
  display_name?: string;
  email?: string;
  phone_number?: string;
}

export interface ChangePasswordWithVerificationRequest {
  app_key?: string;
  challenge_id: string;
  verification_token: string;
  username: string;
  new_password: string;
}

export interface VerificationUserResponse {
  id: string;
  username: string;
  display_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  role: string;
}

export interface VerificationMutationResponse {
  success: boolean;
  user?: VerificationUserResponse | null;
}

export interface VerificationOutboxItem {
  id: string;
  challenge_id: string;
  app_key: string;
  channel: string;
  provider: string;
  recipient_masked: string;
  subject?: string | null;
  body: string;
  status: string;
  created_at: string;
  sent_at?: string | null;
}
