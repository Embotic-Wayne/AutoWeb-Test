/**
 * Shared AgentAction type for AutoWeb monorepo.
 * Used by platform dashboard, project-flow, and backend webhook consumers.
 */

export type AgentStatus =
  | 'detecting'
  | 'analyzing'
  | 'generating'
  | 'deploying'
  | 'escalating';

export type AgentActionType = 'DIRECT_CODE' | 'SLACK_MESSAGE';

export interface AgentAction {
  id: string;
  timestamp: string; // ISO 8601
  status: AgentStatus;
  actionType: AgentActionType;
  payload: string;
  reasoning: string;
}
