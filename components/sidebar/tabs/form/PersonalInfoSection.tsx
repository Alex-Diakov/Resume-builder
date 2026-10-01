import React, { useState } from 'react';
import { User, ChevronDown, ChevronRight, Image, Upload } from 'lucide-react';
import { ResumeData } from '../../../../types';
import { Button, Input, Label, Switch } from '../../../ui';

interface PersonalInfoSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  resumeData: ResumeData;
  onChangeData: (data: ResumeData) => void;
  handleFieldChange: (field: string, value: any) => void;
  photoError: string | null;
  handlePhotoFile: (file: File) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  isOpen,
  onToggle,
  resumeData,
  onChangeData,
  handleFieldChange,
  photoError,
  handlePhotoFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`border transition-all duration-200 rounded-md-lg overflow-hidden ${
        isOpen
          ? 'border-md-primary/35 bg-md-surface-container shadow-md-elevation-1'
          : 'border-white/[0.08] bg-md-surface-container-low hover:bg-md-surface-container hover:border-white/[0.16]'
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between p-4.5 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-md-primary/40 ${
          isOpen ? 'text-md-on-surface bg-md-surface-container border-b border-white/[0.08]' : 'text-md-on-surface-variant hover:text-md-on-surface bg-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <User className={`w-5 h-5 transition-colors ${isOpen ? 'text-md-primary' : 'text-md-on-surface-variant'}`} />
          <span className="font-display tracking-wide">Personal Details</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-md-primary" /> : <ChevronRight className="w-5 h-5 text-md-on-surface-variant" />}
      </button>

      {isOpen && (
        <div className="p-5 space-y-4.5 bg-transparent">
          {/* Profile Photo Upload Section */}
          <div className="pb-5 border-b border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-md-on-surface-variant">Profile Photo</span>
              {resumeData.photo && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-md-on-surface-variant">Show on resume</span>
                  <Switch
                    id="toggle-photo-display"
                    checked={resumeData.showPhoto !== false}
                    onCheckedChange={(checked) => handleFieldChange('showPhoto', checked)}
                  />
                </div>
              )}
            </div>

            {photoError && (
              <div id="photo-error-message" className="text-xs text-md-error bg-md-error-container/20 border border-md-error/30 px-3 py-2 rounded-md-sm font-normal animate-fade-in">
                {photoError}
              </div>
            )}

            <div className="flex gap-4 items-center">
              {/* Image Preview / Drag Area */}
              <div
                id="photo-drag-zone"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.length) {
                    handlePhotoFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => document.getElementById('photo-upload-input')?.click()}
                className={`w-20 h-20 shrink-0 rounded-md-md border-2 border-dashed flex flex-col items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden group relative ${
                  resumeData.photo
                    ? 'border-solid border-md-primary/60 bg-md-surface-container-lowest'
                    : isDragging
                      ? 'border-md-primary bg-md-primary-container/20'
                      : 'border-md-outline-variant/40 hover:border-md-outline bg-md-surface-container-lowest hover:bg-md-surface-container-low'
                }`}
                title="Click or Drag & Drop photo here"
              >
                {resumeData.photo ? (
                  <>
                    <img
                      src={resumeData.photo}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-[11px] font-medium text-white text-center p-1">
                      <Upload className="w-3.5 h-3.5 mb-1 text-md-primary" />
                      Replace
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-2 text-md-on-surface-variant">
                    <Image className="w-5 h-5 mb-1 text-md-primary group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-medium">Upload</span>
                  </div>
                )}
                <input
                  id="photo-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      handlePhotoFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </div>

              {/* Photo Action / Description */}
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <p className="text-xs font-medium text-md-on-surface">Upload headshot</p>
                  <p className="text-[11px] text-md-on-surface-variant mt-0.5">Recommended: Square format, up to 2MB.</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => document.getElementById('photo-upload-input')?.click()}
                  >
                    {resumeData.photo ? 'Change Photo' : 'Select Image'}
                  </Button>

                  {resumeData.photo && (
                    <Button
                      id="remove-photo-button"
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-md-error hover:text-md-error hover:bg-md-error-container/20"
                      onClick={() => {
                        const updated = { ...resumeData };
                        delete updated.photo;
                        onChangeData(updated);
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label>Full Name</Label>
            <Input
              type="text"
              value={resumeData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="e.g. Alex Diakov"
            />
          </div>

          <div>
            <Label>Professional Title</Label>
            <Input
              type="text"
              value={resumeData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Product Ventures & Innovation"
            />
          </div>

          <div>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={resumeData.contact.email}
              onChange={(e) => handleFieldChange('contact.email', e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <div>
            <Label>Location / City</Label>
            <Input
              type="text"
              value={resumeData.contact.location}
              onChange={(e) => handleFieldChange('contact.location', e.target.value)}
              placeholder="e.g. Kyiv, Ukraine or Remote"
            />
          </div>

          <div>
            <Label>Portfolio / Personal Website</Label>
            <Input
              type="text"
              value={resumeData.contact.website || ''}
              onChange={(e) => handleFieldChange('contact.website', e.target.value)}
              placeholder="https://alexdiakov.design"
            />
          </div>

          <div>
            <Label>LinkedIn Profile</Label>
            <Input
              type="text"
              value={resumeData.contact.linkedin || ''}
              onChange={(e) => handleFieldChange('contact.linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/alex-diakov"
            />
          </div>

          <div>
            <Label optional>Video Pitch (Loom / YouTube)</Label>
            <Input
              type="text"
              value={resumeData.contact.videoPitch || ''}
              onChange={(e) => handleFieldChange('contact.videoPitch', e.target.value)}
              placeholder="https://loom.com/share/..."
            />
          </div>
        </div>
      )}
    </div>
  );
};
