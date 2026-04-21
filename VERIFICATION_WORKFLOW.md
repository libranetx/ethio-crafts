# Artisan Verification Workflow Documentation

## Overview

The verification workflow ensures that all products sold on Ethio-Crafts meet quality and authenticity standards. It involves artisans submitting samples and agents performing thorough verification checks.

## Workflow States

```
┌─────────────────────────────────────────────────────────────┐
│                  ARTISAN SUBMISSION PROCESS                  │
├─────────────────────────────────────────────────────────────┤
│ Artisan submits product                                      │
│         ↓                                                     │
│ System creates verification task (PENDING)                   │
│         ↓                                                     │
│ Task assigned to agent (IN_PROGRESS)                         │
│         ↓                                                     │
│ Agent reviews checklist items                                │
│         ├─ Handmade verification                             │
│         ├─ Materials verification                            │
│         ├─ Dimensions verification                           │
│         └─ Identity verification                             │
│         ↓                                                     │
│    ┌────────────────────────────────────┐                    │
│    │ All items verified?                │                    │
│    ├────────────────────────────────────┤                    │
│    │ ✓ YES → COMPLETED                  │                    │
│    │         Product becomes ACTIVE     │                    │
│    │                                    │                    │
│    │ ✗ NO  → REJECTED                   │                    │
│    │         Request resubmission       │                    │
│    │         or admin override          │                    │
│    └────────────────────────────────────┘                    │
│                                                               │
│ If REJECTED:                                                 │
│ Artisan can RESUBMIT with corrections                        │
│         ↓                                                     │
│ Task status → RESUBMITTED (back to IN_PROGRESS)              │
└─────────────────────────────────────────────────────────────┘
```

## Verification Task Status

### Status Definitions

| Status | Description | Agent Action | Artisan Action |
|--------|-------------|--------------|-----------------|
| **PENDING** | Task created, awaiting agent assignment | Review task details | Wait for assignment |
| **IN_PROGRESS** | Agent actively verifying | Check items, gather evidence | Monitor progress |
| **COMPLETED** | All requirements verified | Task done | Product goes ACTIVE |
| **REJECTED** | Requirements not met | Provide rejection reason | Request resubmission |
| **RESUBMITTED** | Artisan resubmitted after rejection | Review new samples | Submit corrections |

## Verification Checklist

All items in the checklist must be verified before completion:

### 1. Handmade Verification
**Purpose:** Confirm the product is handmade by the artisan, not mass-produced

**Agent Should Check:**
- Sample images showing the creation process
- Proof of handcrafting techniques
- Artisan can demonstrate the process
- No signs of factory production
- Unique characteristics of handmade items

**Evidence Types:**
- Process photos
- Video of creation
- Artisan testimonial
- Material samples

### 2. Materials Verification
**Purpose:** Verify that materials match the description and are of good quality

**Agent Should Check:**
- Material authenticity
- Quality of materials used
- Alignment with cultural/traditional practices
- Absence of counterfeit materials
- Durability assessment

**Evidence Types:**
- Material close-ups
- Certificates of authenticity
- Material sourcing information
- Quality comparison

### 3. Dimensions & Specifications
**Purpose:** Confirm product dimensions and specifications match the listing

**Agent Should Check:**
- Accurate measurements in cm/inches
- Weight matches description
- All dimensions provided
- Measurements consistent across samples
- Physical inspection of sample

**Evidence Types:**
- Measurement photos with ruler
- Specification documentation
- Physical dimension verification
- Before/after photos

### 4. Identity Verification
**Purpose:** Confirm artisan identity and verify cultural authenticity

**Agent Should Check:**
- Artisan identity documents (national ID)
- Artisan's background and experience
- Cultural authenticity of product
- Knowledge of traditional techniques
- Fair labor practices

**Evidence Types:**
- ID verification
- Artisan interview
- Background check
- Cultural significance documentation

## Agent Dashboard

### Assigned Tasks View
Agents see all tasks assigned to them:
- Task ID and artisan name
- Product details
- Due date and days remaining
- Current progress percentage
- Overdue status indicator

### Task Details
When viewing a task:
- Artisan information and profile
- Product images and sample photos
- Product description and specifications
- Checklist with verification items
- Notes and previous feedback
- Rejection history if applicable

### Verification Actions

#### Mark Item as Verified
```typescript
await agentVerificationUtils.markItemVerified(taskId, 'handmade', true);
```

#### Add Notes
```typescript
// Notes visible to artisan on rejection
task.notes = "Sample quality excellent. Photos show clear handmade process."
```

#### Complete Verification
```typescript
await agentVerificationUtils.completeVerification(taskId, "All requirements met");
// Product status automatically changes to ACTIVE
```

#### Reject Verification
```typescript
await agentVerificationUtils.rejectVerification(
  taskId,
  "Dimensions do not match specification",
  "Measured 25cm but listed as 30cm. Request resubmission with correct dimensions."
);
```

#### Request Resubmission
```typescript
await agentVerificationUtils.requestResubmission(
  taskId,
  ['dimensions', 'materials'],  // Items to recheck
  "Please resubmit with corrected measurements and clearer material photos"
);
```

## Artisan Workflow

### Task Assignment
1. Artisan submits product for listing
2. System creates verification task
3. Agent is assigned based on region/workload
4. Artisan receives notification

### Checking Status
Artisans can view:
- Current task status and progress
- Agent assigned
- Due date
- Specific requirements being checked
- Notes from agent

### Responding to Rejection
If verification is rejected:
1. Artisan receives notification with reason
2. Reviews rejection details and agent notes
3. Makes corrections to product/samples
4. Resubmits with updated information
5. Agent reviews resubmission

### Handling Accepted Products
Once verified:
1. Product status changes to ACTIVE
2. Product becomes available for sale
3. Artisan receives confirmation notification
4. Product appears in product listings

## Rejection Reasons

Predefined rejection reasons (agents can customize):
- Product does not appear to be handmade
- Materials do not match description
- Dimensions do not match specifications
- Insufficient evidence of authenticity
- Quality does not meet standards
- Images do not clearly show product details
- Documentation is incomplete
- Artisan identity could not be verified
- Product violates cultural guidelines
- Other (with custom explanation)

## Timeline and Deadlines

### Task Timeline
- **Created:** When artisan submits product
- **Due Date:** Typically 14 days from creation
- **Overdue:** If not completed by due date
- **Completed:** When all items verified or rejected

### Checking Deadlines
```typescript
const daysRemaining = getDaysRemaining(task);
const isOverdue = isTaskOverdue(task);
```

## Metrics and Reporting

### Agent Performance
- Tasks completed
- Average time to completion
- Rejection rate
- Resubmission rate
- Average rating from artisans

### Artisan Verification Status
```typescript
const report = await generateVerificationReport(artisanId);
// Returns:
// {
//   totalTasks: 3,
//   completedTasks: 2,
//   rejectedTasks: 1,
//   pendingTasks: 0,
//   inProgressTasks: 0,
//   resubmittedTasks: 0,
//   completionRate: 67,
//   averageTimeTaken: 7  // days
// }
```

## Admin Override

### When to Override
- Agent unavailable/unreliable
- Clear quality evidence provided by artisan
- Exceptional circumstances
- Policy exceptions approved by management

### Override Process
```typescript
// Admin can manually approve verification
await verificationService.updateStatus(taskId, 'completed', 'Admin override - verified quality');
// Product becomes ACTIVE immediately
```

## Quality Standards

### Product Requirements
- Handmade using traditional or contemporary techniques
- High-quality materials appropriate to product type
- Accurate product descriptions and specifications
- Professional presentation and photos
- Reasonable pricing
- Safe and non-hazardous materials

### Artisan Requirements
- Genuine identity and background
- Fair labor practices
- Ethical business conduct
- Commitment to cultural preservation
- Willingness to improve and adapt

## Integration Points

### With Product System
- Verified products automatically get `status: 'active'`
- Unverified products have `status: 'pending_verification'`
- Rejected products have `status: 'rejected'`

### With Notification System
- Artisan notified when task assigned
- Artisan notified on completion/rejection
- Agent notified of new assignments
- Admin notified of rejections/issues

### With Order System
- Can only order active (verified) products
- Artisan info shown in orders
- Verification status visible to customers

## Troubleshooting

### Agent Can't Access Task
- Check task is assigned to agent
- Verify agent account is active
- Check authentication/permissions

### Artisan Can't Resubmit
- Check previous task status is 'rejected'
- Verify rejection reason is clear
- Ensure artisan has correct product ID

### Task Stuck in Progress
- Check if agent is inactive
- Escalate to manager if overdue
- Admin can reassign to different agent

## Best Practices

### For Agents
1. **Be thorough** - Check all evidence carefully
2. **Be fair** - Give artisans benefit of doubt
3. **Be clear** - Explain rejections with specific details
4. **Be timely** - Complete tasks within deadline
5. **Be respectful** - Treat artisans as partners

### For Artisans
1. **Provide clear evidence** - Good photos and documentation
2. **Be detailed** - Explain your process and materials
3. **Be responsive** - Address rejections promptly
4. **Be professional** - Present work professionally
5. **Be honest** - Don't misrepresent products

### For Admins
1. **Monitor** - Track agent and artisan metrics
2. **Support** - Help resolve disputes fairly
3. **Improve** - Update standards based on feedback
4. **Celebrate** - Recognize successful verifications
5. **Scale** - Ensure adequate agent coverage

## API Reference

### Verification Service

```typescript
// Get task by ID
const task = await verificationService.getById(taskId);

// Get tasks by artisan
const tasks = await verificationService.getByArtisan(artisanId);

// Get tasks by agent
const tasks = await verificationService.getByAgent(agentId);

// Get tasks by status
const pending = await verificationService.getByStatus('pending');

// Create new task
const task = await verificationService.create({
  artisanId: 'artisan-001',
  productId: 'prod-001',
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
});

// Update task status
await verificationService.updateStatus(taskId, 'completed', 'All verified');
```

### Agent Utils

```typescript
// Get pending tasks
const pending = await agentVerificationUtils.getPendingTasks(agentId);

// Get completed tasks
const completed = await agentVerificationUtils.getCompletedTasks(agentId);

// Get overdue tasks
const overdue = await agentVerificationUtils.getOverdueTasks(agentId);

// Mark item verified
await agentVerificationUtils.markItemVerified(taskId, 'handmade', true);

// Complete verification
await agentVerificationUtils.completeVerification(taskId, 'All requirements met');

// Reject verification
await agentVerificationUtils.rejectVerification(
  taskId,
  'Dimensions incorrect',
  'Please remeasure and resubmit'
);

// Request resubmission
await agentVerificationUtils.requestResubmission(
  taskId,
  ['dimensions'],
  'Please provide corrected measurements'
);
```

### Artisan Utils

```typescript
// Get verification status
const status = await artisanVerificationUtils.getVerificationStatus(artisanId);

// Get active task
const task = await artisanVerificationUtils.getActiveTask(artisanId);

// Check if can resubmit
const canResubmit = await artisanVerificationUtils.canResubmit(artisanId);

// Resubmit task
await artisanVerificationUtils.resubmitTask(
  taskId,
  ['image1.jpg', 'image2.jpg'],
  'Corrected measurements and material photos'
);
```

## Migration to Real Implementation

When moving to production database:

1. **Create database tables** for `VerificationTask`
2. **Implement agent assignment logic** - geographic distribution, workload balancing
3. **Add image upload** for sample photos
4. **Implement webhooks** for status notifications
5. **Add authentication** for agent/admin access
6. **Create admin dashboard** for oversight
7. **Implement SLA tracking** for compliance
8. **Add fraud detection** for suspicious patterns
