'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { MapPin, Camera, CheckCircle, AlertCircle, XCircle, Bell, UserCircle2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AgentVerification() {
  const [activeTab, setActiveTab] = useState('verification')
  const [currentStep, setCurrentStep] = useState('task-selection')
  const [showNotifications, setShowNotifications] = useState(false)
  const [verificationData, setVerificationData] = useState({
    measurements: { length: '', width: '', height: '', weight: '' },
    qualityRating: 0,
    authenticityCheck: 'genuine',
    materialsVerified: [] as string[],
    finalDecision: null as 'approve' | 'changes' | 'reject' | null,
    notes: '',
    photosUploaded: 0,
  })

  // Mock tasks
  const pendingTasks = [
    {
      id: 1,
      artisanName: 'Abeba Tekle',
      location: 'Addis Ababa',
      distance: '3.5 km away',
      productTitle: 'Hand-Woven Basket with Geometric Patterns',
      submittedDate: 'Feb 20, 2024',
      status: 'pending',
    },
    {
      id: 2,
      artisanName: 'Girma Assefa',
      location: 'Hawassa',
      distance: '28 km away',
      productTitle: 'Traditional Ethiopian Coffee Roaster',
      submittedDate: 'Feb 19, 2024',
      status: 'pending',
    },
    {
      id: 3,
      artisanName: 'Meaza Getnet',
      location: 'Addis Ababa',
      distance: '5.2 km away',
      productTitle: 'Leather Messenger Bag',
      submittedDate: 'Feb 18, 2024',
      status: 'pending',
    },
  ]

  const selectedTask = pendingTasks[0]

  const agentTaskNotifications = [
    { id: 'TSK-2101', title: 'Verify Leather Messenger Bag', artisan: 'Abeba Handmade', region: 'Bole', priority: 'High', dueDate: 'Apr 22, 2026' },
    { id: 'TSK-2102', title: 'Review Coffee Pot Measurements', artisan: 'Mulu Pottery', region: 'Yeka', priority: 'Medium', dueDate: 'Apr 23, 2026' },
  ]

  const draftQueue = [
    {
      id: 'DRF-3401',
      product: 'Leather Messenger Bag',
      artisan: 'Abeba Handmade',
      verificationStatus: 'Verified',
      draftStatus: 'Ready for Admin Review',
      updatedAt: 'Apr 21, 2026',
    },
    {
      id: 'DRF-3402',
      product: 'Traditional Coffee Roaster',
      artisan: 'Mulu Pottery',
      verificationStatus: 'Verified with Notes',
      draftStatus: 'Needs Metadata Update',
      updatedAt: 'Apr 20, 2026',
    },
  ]

  const handleMaterialToggle = (material: string) => {
    setVerificationData((prev) => ({
      ...prev,
      materialsVerified: prev.materialsVerified.includes(material)
        ? prev.materialsVerified.filter((m) => m !== material)
        : [...prev.materialsVerified, material],
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setVerificationData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="border-b border-border bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Agent Verification Interface</h1>
              <p className="text-muted-foreground mt-1">Agent ID: AG-2847 | Tasks: {pendingTasks.length} pending</p>
            </div>
            <div className="flex items-center gap-2 relative">
              <Link href="/dashboard/agent/fulfillment">
                <Button variant="outline" className="border-border">
                  <Package className="w-4 h-4 mr-2" />
                  Fulfillment
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-border"
                onClick={() => setShowNotifications((prev) => !prev)}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Link href="/dashboard/agent/profile">
                <Button variant="outline" className="border-border">
                  <UserCircle2 className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              {showNotifications && (
                <div className="absolute right-0 top-12 w-96 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
                  <p className="text-sm font-semibold text-foreground mb-3">Task Notifications</p>
                  <div className="space-y-2 max-h-80 overflow-auto">
                    {agentTaskNotifications.map((task) => (
                      <div key={task.id} className="border border-border rounded-lg p-3">
                        <p className="text-sm font-medium text-foreground">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{task.id} - {task.artisan} - {task.region}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`inline-flex px-2 py-1 rounded-full text-[11px] font-medium ${
                            task.priority === 'High' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                          }`}>
                            {task.priority}
                          </span>
                          <p className="text-[11px] text-muted-foreground">Due: {task.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-border flex gap-8">
          {[
            { id: 'verification', label: 'Verification Tasks' },
            { id: 'drafts', label: 'Drafts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary -mb-px'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'verification' && currentStep === 'task-selection' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task List */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-lg font-serif font-bold text-foreground">Pending Verification Tasks</h2>
                  <p className="text-sm text-muted-foreground mt-2">{pendingTasks.length} samples awaiting verification</p>
                </div>

                <div className="divide-y divide-border">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setCurrentStep('verification')}
                      className="p-6 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="grow">
                          <h3 className="font-medium text-foreground text-lg">{task.artisanName}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{task.productTitle}</p>
                        </div>
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                          {task.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="text-sm font-medium text-foreground mt-1 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {task.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Distance</p>
                          <p className="text-sm font-medium text-foreground mt-1">{task.distance}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Submitted</p>
                          <p className="text-sm font-medium text-foreground mt-1">{task.submittedDate}</p>
                        </div>
                      </div>

                      <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                        Start Verification
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
              <h3 className="font-serif font-bold text-foreground mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                    <option>All Tasks</option>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Distance</label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                    <option>All Distances</option>
                    <option>0-10 km</option>
                    <option>10-50 km</option>
                    <option>50+ km</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                    <option>All Priorities</option>
                    <option>High (7+ days)</option>
                    <option>Medium (3-7 days)</option>
                    <option>Low (&lt;3 days)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && currentStep === 'verification' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Verification Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Artisan Info */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-serif font-bold text-foreground mb-4">Artisan Information</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground mt-1">{selectedTask.artisanName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground mt-1">{selectedTask.location}</p>
                  </div>
                </div>
              </div>

              {/* Physical Inspection */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-serif font-bold text-foreground mb-4">Physical Inspection</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Length (cm)</label>
                      <input
                        type="number"
                        name="measurements.length"
                        value={verificationData.measurements.length}
                        onChange={(e) => setVerificationData({
                          ...verificationData,
                          measurements: { ...verificationData.measurements, length: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Width (cm)</label>
                      <input
                        type="number"
                        name="measurements.width"
                        value={verificationData.measurements.width}
                        onChange={(e) => setVerificationData({
                          ...verificationData,
                          measurements: { ...verificationData.measurements, width: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Material Verification */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Materials Verified</label>
                    <div className="space-y-2">
                      {['Straw', 'Natural Dyes', 'No Synthetic Materials', 'Authentic Methods'].map((material) => (
                        <label key={material} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={verificationData.materialsVerified.includes(material)}
                            onChange={() => handleMaterialToggle(material)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="ml-3 text-sm text-foreground">{material}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Quality Rating */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Craftsmanship Quality</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setVerificationData({...verificationData, qualityRating: star})}
                          className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                            verificationData.qualityRating >= star
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Authenticity Check */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Authenticity Check</label>
                    <div className="space-y-2">
                      {[
                        { value: 'genuine', label: 'Genuine - Authentic Ethiopian Craft' },
                        { value: 'concerns', label: 'Concerns - Requires Further Review' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="authenticityCheck"
                            value={option.value}
                            checked={verificationData.authenticityCheck === option.value}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="ml-3 text-sm text-foreground">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Capture */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-serif font-bold text-foreground mb-4">Media Capture</h2>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-muted mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">Upload photos of the product from different angles</p>
                  <p className="text-xs text-muted-foreground mb-4">Minimum 5 photos required</p>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Camera className="w-4 h-4 mr-2" />
                    Capture Photos
                  </Button>
                  {verificationData.photosUploaded > 0 && (
                    <p className="text-sm text-success mt-4">{verificationData.photosUploaded} photos uploaded</p>
                  )}
                </div>
              </div>

              {/* 3D Scan Upload */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-serif font-bold text-foreground mb-4">3D Scan / Model Upload</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload 3D files during verification (GLB, GLTF, OBJ, STL).
                </p>
                <input
                  type="file"
                  accept=".glb,.gltf,.obj,.stl"
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>

              {/* Final Decision */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-serif font-bold text-foreground mb-4">Final Decision</h2>
                <div className="space-y-3 mb-4">
                  {[
                    { value: 'approve', label: 'Approve - Ready for Publishing', icon: CheckCircle, color: 'text-success' },
                    { value: 'changes', label: 'Request Changes - Contact Artisan', icon: AlertCircle, color: 'text-warning' },
                    { value: 'reject', label: 'Reject - Does Not Meet Standards', icon: XCircle, color: 'text-destructive' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                      <input
                        type="radio"
                        name="finalDecision"
                        value={option.value}
                        checked={verificationData.finalDecision === option.value}
                        onChange={(e) => setVerificationData({...verificationData, finalDecision: e.target.value as any})}
                        className="w-4 h-4 text-primary"
                      />
                      <option.icon className={`w-5 h-5 ml-3 ${option.color}`} />
                      <span className="ml-2 text-sm font-medium text-foreground">{option.label}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={verificationData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any additional notes or observations..."
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setCurrentStep('task-selection')}
                  variant="outline"
                  className="flex-1 border-border h-12 font-medium"
                >
                  Back to Tasks
                </Button>
                <Button
                  onClick={() => setCurrentStep('task-selection')}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-medium"
                >
                  Submit Verification
                </Button>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24 space-y-6">
              <div>
                <h3 className="font-serif font-bold text-foreground mb-3">Product</h3>
                <p className="text-sm text-foreground">{selectedTask.productTitle}</p>
                <p className="text-xs text-muted-foreground mt-2">Submitted: {selectedTask.submittedDate}</p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-xs font-medium text-foreground mb-2">Verification Checklist</p>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-center gap-2">
                    <span className={verificationData.measurements.length ? 'text-success' : 'text-muted-foreground'}>✓</span>
                    <span>Measurements recorded</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={verificationData.materialsVerified.length > 0 ? 'text-success' : 'text-muted-foreground'}>✓</span>
                    <span>Materials verified</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={verificationData.qualityRating > 0 ? 'text-success' : 'text-muted-foreground'}>✓</span>
                    <span>Quality rating</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={verificationData.photosUploaded > 0 ? 'text-success' : 'text-muted-foreground'}>✓</span>
                    <span>Photos uploaded</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={verificationData.finalDecision ? 'text-success' : 'text-muted-foreground'}>✓</span>
                    <span>Decision made</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-foreground">Verification Drafts</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Products verified by agents and waiting before platform publishing.
                </p>
              </div>
              <Button variant="outline" className="border-border">Refresh Drafts</Button>
            </div>
            <div className="space-y-3">
              {draftQueue.map((draft) => (
                <div
                  key={draft.id}
                  className="border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{draft.product}</p>
                    <p className="text-xs text-muted-foreground mt-1">{draft.id} - {draft.artisan}</p>
                    <p className="text-xs text-muted-foreground mt-1">Updated: {draft.updatedAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                      {draft.verificationStatus}
                    </span>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      draft.draftStatus === 'Ready for Admin Review'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {draft.draftStatus}
                    </span>
                    <Button variant="outline" className="border-border h-8 text-xs">Open Draft</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
