# Shipment Status Update Responsibility Matrix

**Document Purpose:** Clarify who can perform shipment status updates based on the Ethio-Crafts requirements.

**Status:** ✅ **FINAL DECISION IMPLEMENTED**

---

## Clear Role Assignments

### Role: 👤 **AGENT** (PRIMARY OWNER)

#### Updates Shipment Status ✅
- **Mark as Processed** - Confirms payment, prepares for shipment
- **Mark as Shipped** - Updates with tracking number and carrier
- **Mark as Delivered** - Confirms successful delivery

#### Characteristics
- **Primary Responsibility:** Yes
- **Daily Operation:** Yes (primary workflow)
- **Authority Level:** Full
- **Can Skip Steps:** No (must follow sequence)
- **Requires Tracking:** Yes (for shipping)
- **Triggers Notifications:** Yes (customer notified on each update)

#### Example Workflow
```
Agent receives order with status "paid"
  ↓
Agent marks as "processing" (no fields required)
  ↓ 
[Next day] Agent marks as "shipped"
  - Enters tracking number (REQUIRED)
  - Selects carrier (optional)
  - Sets delivery date (optional)
  ↓
[3-5 days later] Agent confirms "delivered"
  ↓
System marks "completed"
```

---

### Role: 👨‍💼 **ADMIN** (OVERRIDE ONLY)

#### Updates Shipment Status ⚠️
- **Override Only** - Can revert or change status if needed
- **Emergency Only** - For fixing errors, handling disputes
- **Not for Daily Use** - Should not be routine operation

#### Characteristics
- **Primary Responsibility:** No
- **Daily Operation:** No (emergency/oversight)
- **Authority Level:** Full (but restricted use)
- **Can Skip Steps:** Yes (emergency override)
- **Requires Audit Trail:** Yes (must document reason)
- **Notification:** Yes (notifies customer of change)

#### When Admin Overrides
```
Scenario: Agent marked order as shipped but tracking is fake
  ↓
Admin detects error during audit
  ↓
Admin reverts to "processing"
  ↓
Admin notifies customer of change
  ↓
Agent provides correct tracking
  ↓
Order proceeds normally
```

---

### Role: 👤 **CUSTOMER** (READ-ONLY)

#### Updates Shipment Status ❌
- **Cannot Update Any Status** - Read-only access only
- **Can View Status** - Real-time visibility
- **Receives Notifications** - On each status change

#### Characteristics
- **Primary Responsibility:** No
- **Daily Operation:** N/A (view only)
- **Authority Level:** None (read-only)
- **Can Skip Steps:** No (cannot update)
- **View Tracking:** Yes (when available)
- **Notification:** Yes (receives all updates)

#### Customer Experience
```
Order placed
  ↓
Receives notification: "Order Processing"
  ↓
Receives notification: "Order Shipped" + Tracking number
  ↓
Can track package via tracking number
  ↓
Receives notification: "Order Delivered"
  ↓
Can leave review/feedback
```

---

## Responsibility Comparison Table

| Function | Agent | Admin | Customer |
|----------|:-----:|:-----:|:---------:|
| **View Status** | ✅ | ✅ | ✅ |
| **Mark Processing** | ✅ | ⚠️ | ❌ |
| **Mark Shipped** | ✅ | ⚠️ | ❌ |
| **Mark Delivered** | ✅ | ⚠️ | ❌ |
| **Override Status** | ❌ | ✅ | ❌ |
| **Edit Tracking** | ✅ | ✅ | ❌ |
| **Cancel Order** | ❌ | ✅ | ⚠️ |
| **Refund** | ❌ | ✅ | ❌ |
| **Receive Notifications** | ✅ | ✅ | ✅ |
| **Audit Trail** | ✅ | ✅ | ❌ |

**Legend:**
- ✅ = Primary responsibility/full access
- ⚠️ = Limited/emergency access only
- ❌ = No access/responsibility

---

## State Transition Matrix

### Who Can Make Each Transition?

| From Status | To Status | Agent | Admin | Customer | Notes |
|---|---|:---:|:---:|:---:|---|
| `paid` | `processing` | ✅ | ⚠️ | ❌ | No tracking needed |
| `processing` | `shipped` | ✅ | ⚠️ | ❌ | **Tracking required** |
| `shipped` | `delivered` | ✅ | ⚠️ | ❌ | Confirms arrival |
| `delivered` | `completed` | 🔄 | ✅ | ❌ | Auto-triggered by system |
| Any | Any | ❌ | ✅ | ❌ | Admin can override any state |

**Legend:**
- ✅ = Primary workflow (daily operation)
- ⚠️ = Emergency override only
- ❌ = Not allowed
- 🔄 = System automatic

---

## Data Requirements by Role

### Agent Updates

#### Processing Update
```json
{
  "action": "mark_processed",
  "order_id": "ord-001",
  "status": "processing",
  "updated_by_agent_id": "ag-2847"
}
```

#### Shipping Update (REQUIRED FIELDS)
```json
{
  "action": "mark_shipped",
  "order_id": "ord-001",
  "status": "shipped",
  "tracking_number": "ETH-2026-123456",    // REQUIRED
  "carrier_name": "Ethiopian Logistics",    // Optional
  "estimated_delivery": "2026-04-24",      // Optional
  "updated_by_agent_id": "ag-2847"
}
```

#### Delivery Update
```json
{
  "action": "mark_delivered",
  "order_id": "ord-001",
  "status": "delivered",
  "updated_by_agent_id": "ag-2847"
}
```

### Admin Override
```json
{
  "action": "override_status",
  "order_id": "ord-001",
  "old_status": "shipped",
  "new_status": "processing",
  "override_reason": "Fake tracking number detected",
  "updated_by_admin_id": "adm-001",
  "notify_customer": true
}
```

---

## Notification Rules

### Triggered by Agent Updates

| Agent Action | Notification Sent | To | Channels |
|---|---|---|---|
| Mark Processing | ✅ | Customer | Email, In-app |
| Mark Shipped | ✅ | Customer | Email, SMS, In-app |
| Mark Delivered | ✅ | Customer | Email, In-app |

### Triggered by Admin Overrides

| Admin Action | Notification Sent | To | Reason |
|---|---|---|---|
| Override Status | ✅ | Customer | Inform of change |
| Revert Order | ✅ | Customer | Explain correction |
| Force Status | ✅ | Customer + Agent | Transparency |

---

## Validation Rules

### Agent Cannot
- ❌ Skip steps (must follow: processing → shipped → delivered)
- ❌ Go backwards (cannot revert to paid)
- ❌ Ship without tracking number
- ❌ Override admin decisions
- ❌ Access other agents' orders (future: region-based access)

### Admin Can
- ✅ Override any step
- ✅ Fix errors
- ✅ Skip steps (emergency only)
- ✅ Document reason
- ✅ Notify customer

### Customer Cannot
- ❌ Change any status
- ❌ Request refunds directly (admin only)
- ❌ Cancel after shipped
- ❌ Override agent decisions

---

## Implementation Status

### ✅ COMPLETED

| Feature | Location | Status |
|---|---|---|
| Agent Processing UI | `AgentFulfillment.tsx` | ✅ |
| Agent Shipping UI | `AgentFulfillment.tsx` | ✅ |
| Agent Delivery UI | `AgentFulfillment.tsx` | ✅ |
| Notification Integration | `notification-service.ts` | ✅ |
| Validation Rules | `AgentFulfillment.tsx` | ✅ |
| Dashboard Route | `/dashboard/agent/fulfillment` | ✅ |
| Documentation | Multiple MD files | ✅ |

### 🔄 TODO (PRODUCTION)

| Feature | Requirements |
|---|---|
| Real Order Data | Connect to database |
| Authentication | Verify agent identity |
| Agent Assignment | Only show assigned orders |
| Admin Override UI | Admin dashboard integration |
| Audit Logging | Log all status changes |
| Carrier Integration | Auto-update tracking status |

---

## Key Principles

### 1. **Agent Ownership** 👤
Agents are the **primary owners** of fulfillment. They move orders through the normal workflow daily.

### 2. **Sequential Enforcement** ➡️
No skipping steps. Orders must follow: `processing → shipped → delivered`.

### 3. **Tracking Accountability** 📦
Tracking numbers required for shipping. Prevents lost packages.

### 4. **Customer Transparency** 👀
Automatic notifications at each step. Customers always know order status.

### 5. **Admin Oversight** 👨‍💼
Admin can override if needed (errors, disputes), but should not be daily operation.

### 6. **Audit Trail** 📋
All changes logged. Agent who made change, timestamp, and reason documented.

---

## Workflow Diagram

```
CUSTOMER PLACES ORDER
        ↓
    [paid]
        ↓
    👤 AGENT marks as processing (no fields)
        ↓
    [processing]
        ↓
    👤 AGENT marks as shipped (with tracking)
        ↓
    [shipped] ← 👨‍💼 ADMIN can override here if needed
        ↓
    👤 AGENT marks as delivered
        ↓
    [delivered]
        ↓
    🤖 SYSTEM marks as completed
        ↓
    [completed]
        ↓
    👤 CUSTOMER leaves review
```

---

## FAQ

**Q: Can agents revert a shipped order back to processing?**
A: No. Agents can only move forward. Admin can revert if needed.

**Q: What if tracking number is wrong?**
A: Admin can revert order, agent provides correct tracking, marks shipped again.

**Q: Can customers cancel after marked shipped?**
A: No. Admin can override if customer disputes.

**Q: Who determines delivery date?**
A: Agent estimates it based on carrier, system doesn't enforce it.

**Q: Can admin mark order as shipped directly?**
A: Yes, but should only do so in emergencies with documentation.

**Q: Are all status changes audited?**
A: Yes. All changes logged with agent/admin ID, timestamp, and action.

---

## Summary

The Ethio-Crafts platform implements a **clear responsibility model** for shipment status updates:

| Role | Responsibility | Access |
|---|---|---|
| **Agent** | ✅ Primary owner - manages daily fulfillment | Full (process → ship → deliver) |
| **Admin** | ⚠️ Backup owner - emergency overrides only | Limited (override & fix errors) |
| **Customer** | 👀 Observer - receives notifications | Read-only (view + track) |

This ensures **efficiency, accountability, and transparency** while maintaining **strict workflow integrity**.
