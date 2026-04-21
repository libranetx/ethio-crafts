'use client';

import { VerificationTask, VerificationTaskStatus } from './types';
import { verificationService } from './data-service';

/**
 * Verification status flow and utilities
 */
export const verificationStatuses = {
  PENDING: 'pending' as VerificationTaskStatus,
  IN_PROGRESS: 'in_progress' as VerificationTaskStatus,
  COMPLETED: 'completed' as VerificationTaskStatus,
  REJECTED: 'rejected' as VerificationTaskStatus,
  RESUBMITTED: 'resubmitted' as VerificationTaskStatus,
};

/**
 * Verification checklist item
 */
export interface ChecklistItem {
  id: keyof VerificationTask['checklist'];
  label: string;
  description: string;
  required: boolean;
}

export const VERIFICATION_CHECKLIST: ChecklistItem[] = [
  {
    id: 'handmade',
    label: 'Handmade Verification',
    description: 'Verify that the product is handmade by the artisan',
    required: true,
  },
  {
    id: 'materials',
    label: 'Materials Verification',
    description: 'Verify the authenticity and quality of materials used',
    required: true,
  },
  {
    id: 'dimensions',
    label: 'Dimensions & Specs',
    description: 'Verify product dimensions match specifications',
    required: true,
  },
  {
    id: 'identity',
    label: 'Identity Verification',
    description: 'Verify artisan identity and cultural authenticity',
    required: true,
  },
];

/**
 * Get status label and color
 */
export const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    badgeColor: 'yellow',
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800',
    badgeColor: 'blue',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800',
    badgeColor: 'green',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    badgeColor: 'red',
  },
  resubmitted: {
    label: 'Resubmitted',
    color: 'bg-purple-100 text-purple-800',
    badgeColor: 'purple',
  },
};

/**
 * Calculate task progress
 */
export function getTaskProgress(task: VerificationTask): number {
  const checklist = task.checklist;
  const checked = Object.values(checklist).filter(Boolean).length;
  const total = Object.keys(checklist).length;
  return Math.round((checked / total) * 100);
}

/**
 * Check if task is overdue
 */
export function isTaskOverdue(task: VerificationTask): boolean {
  if (task.status === 'completed' || task.status === 'rejected') {
    return false;
  }
  return new Date() > task.dueDate;
}

/**
 * Get days remaining for task
 */
export function getDaysRemaining(task: VerificationTask): number {
  const now = new Date();
  const due = new Date(task.dueDate);
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if all required items are verified
 */
export function isVerificationComplete(task: VerificationTask): boolean {
  return VERIFICATION_CHECKLIST.every((item) => {
    if (!item.required) return true;
    return task.checklist[item.id];
  });
}

/**
 * Get pending requirements
 */
export function getPendingRequirements(task: VerificationTask): ChecklistItem[] {
  return VERIFICATION_CHECKLIST.filter(
    (item) => !task.checklist[item.id]
  );
}

/**
 * Format verification notes
 */
export function formatVerificationNotes(task: VerificationTask): string {
  if (!task.notes) return 'No notes provided';
  return task.notes;
}

/**
 * Get rejection reason display
 */
export function getRejectionReasonDisplay(task: VerificationTask): string {
  if (!task.rejectionReason) return 'Not specified';
  return task.rejectionReason;
}

/**
 * Agent verification utilities
 */
export const agentVerificationUtils = {
  /**
   * Get pending tasks for agent
   */
  async getPendingTasks(agentId: string) {
    const tasks = await verificationService.getByAgent(agentId);
    return tasks.filter((t) => t.status !== 'completed' && t.status !== 'rejected');
  },

  /**
   * Get completed tasks for agent
   */
  async getCompletedTasks(agentId: string) {
    const tasks = await verificationService.getByAgent(agentId);
    return tasks.filter((t) => t.status === 'completed' || t.status === 'rejected');
  },

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(agentId: string) {
    const tasks = await agentVerificationUtils.getPendingTasks(agentId);
    return tasks.filter((t) => isTaskOverdue(t));
  },

  /**
   * Mark checklist item as verified
   */
  async markItemVerified(
    taskId: string,
    itemId: keyof VerificationTask['checklist'],
    verified: boolean
  ) {
    const task = await verificationService.getById(taskId);
    if (!task) return null;

    task.checklist[itemId] = verified;
    task.updatedAt = new Date();

    // If all required items are verified, auto-complete
    if (isVerificationComplete(task)) {
      return await verificationService.updateStatus(
        taskId,
        'completed',
        'All requirements verified'
      );
    }

    return task;
  },

  /**
   * Complete verification
   */
  async completeVerification(taskId: string, notes?: string) {
    return await verificationService.updateStatus(taskId, 'completed', notes);
  },

  /**
   * Reject verification
   */
  async rejectVerification(taskId: string, rejectionReason: string, notes?: string) {
    const task = await verificationService.getById(taskId);
    if (!task) return null;

    task.status = 'rejected';
    task.rejectionReason = rejectionReason;
    if (notes) task.notes = notes;
    task.updatedAt = new Date();

    return task;
  },

  /**
   * Request resubmission
   */
  async requestResubmission(taskId: string, items: Array<keyof VerificationTask['checklist']>, notes: string) {
    const task = await verificationService.getById(taskId);
    if (!task) return null;

    // Reset specified items
    items.forEach((item) => {
      task.checklist[item] = false;
    });

    task.status = 'resubmitted';
    task.notes = notes;
    task.updatedAt = new Date();

    return task;
  },
};

/**
 * Artisan verification utilities
 */
export const artisanVerificationUtils = {
  /**
   * Get verification status for artisan
   */
  async getVerificationStatus(artisanId: string) {
    const tasks = await verificationService.getByArtisan(artisanId);
    return {
      pendingCount: tasks.filter((t) => t.status === 'pending').length,
      inProgressCount: tasks.filter((t) => t.status === 'in_progress').length,
      completedCount: tasks.filter((t) => t.status === 'completed').length,
      rejectedCount: tasks.filter((t) => t.status === 'rejected').length,
      resubmittedCount: tasks.filter((t) => t.status === 'resubmitted').length,
      tasks,
    };
  },

  /**
   * Get current active verification task
   */
  async getActiveTask(artisanId: string) {
    const tasks = await verificationService.getByArtisan(artisanId);
    return tasks.find((t) => t.status !== 'completed' && t.status !== 'rejected') || null;
  },

  /**
   * Check if artisan can resubmit
   */
  async canResubmit(artisanId: string): Promise<boolean> {
    const status = await artisanVerificationUtils.getVerificationStatus(artisanId);
    return status.rejectedCount > 0 || status.resubmittedCount > 0;
  },

  /**
   * Resubmit verification task
   */
  async resubmitTask(taskId: string, newSampleImages: string[], notes: string) {
    const task = await verificationService.getById(taskId);
    if (!task) return null;

    // Reset checklist
    Object.keys(task.checklist).forEach((key) => {
      task.checklist[key as keyof VerificationTask['checklist']] = false;
    });

    task.status = 'pending';
    task.sampleImages = newSampleImages;
    task.notes = notes;
    task.agentId = undefined;
    task.updatedAt = new Date();

    return task;
  },
};

/**
 * Verification timeline
 */
export const verificationTimeline = {
  /**
   * Get verification timeline for task
   */
  async getTimeline(taskId: string) {
    const task = await verificationService.getById(taskId);
    if (!task) return [];

    return [
      {
        date: task.createdAt,
        status: 'created' as const,
        label: 'Verification task created',
      },
      task.agentId && {
        date: task.updatedAt,
        status: 'assigned' as const,
        label: 'Task assigned to agent',
      },
      task.status === 'in_progress' && {
        date: task.updatedAt,
        status: 'started' as const,
        label: 'Agent started verification',
      },
      (task.status === 'completed' || task.status === 'rejected') && {
        date: task.updatedAt,
        status: task.status as 'completed' | 'rejected',
        label: task.status === 'completed' ? 'Verification completed' : 'Verification rejected',
      },
    ].filter(Boolean) as Array<{
      date: Date;
      status: 'created' | 'assigned' | 'started' | 'completed' | 'rejected';
      label: string;
    }>;
  },
};

/**
 * Rejection reasons presets
 */
export const REJECTION_REASONS = [
  'Product does not appear to be handmade',
  'Materials do not match description',
  'Dimensions do not match specifications',
  'Insufficient evidence of authenticity',
  'Quality does not meet standards',
  'Images do not clearly show product details',
  'Documentation is incomplete',
  'Artisan identity could not be verified',
  'Product violates cultural guidelines',
  'Other (please specify in notes)',
];

/**
 * Verification report
 */
export async function generateVerificationReport(artisanId: string) {
  const status = await artisanVerificationUtils.getVerificationStatus(artisanId);
  
  const completionRate =
    status.completedCount /
    (status.completedCount + status.rejectedCount + status.resubmittedCount + status.inProgressCount) || 0;

  return {
    artisanId,
    totalTasks: status.tasks.length,
    completedTasks: status.completedCount,
    rejectedTasks: status.rejectedCount,
    pendingTasks: status.pendingCount,
    inProgressTasks: status.inProgressCount,
    resubmittedTasks: status.resubmittedCount,
    completionRate: Math.round(completionRate * 100),
    averageTimeTaken:
      status.completedCount > 0
        ? Math.round(
            status.tasks
              .filter((t) => t.status === 'completed')
              .reduce(
                (sum, t) =>
                  sum +
                  (new Date(t.updatedAt).getTime() -
                    new Date(t.createdAt).getTime()),
                0
              ) /
              status.completedCount /
              (1000 * 60 * 60 * 24)
          )
        : 0,
  };
}
