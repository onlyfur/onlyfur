import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image, Video, Music, FileText, Tag, DollarSign } from 'lucide-react';
import { apiClientEnhanced } from '../../services/apiClientEnhanced';

interface ContentFormData {
  title: string;
  description: string;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  tags: string[];
  isPublic: boolean;
  isPremium: boolean;
  price: number;
  category: string;
  mainFile?: File;
  thumbnail?: File;
  additionalFiles: File[];
}

const CONTENT_TYPES = [
  { value: 'IMAGE', label: 'Image', icon: Image, accept: 'image/*' },
  { value: 'VIDEO', label: 'Video', icon: Video, accept: 'video/*' },
  { value: 'AUDIO', label: 'Audio', icon: Music, accept: 'audio/*' },
  { value: 'DOCUMENT', label: 'Document', icon: FileText, accept: '.pdf,.doc,.docx,.txt' }
];

const CATEGORIES = [
  'Art & Design', 'Photography', 'Music', 'Videos', 'Gaming',
  'Fitness', 'Lifestyle', 'Education', 'Entertainment', 'Technology', 'Other'
];

const EnhancedContentUpload: React.FC = () => {
  const navigate = useNavigate();
  const mainFileRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    type: 'IMAGE',
    tags: [],
    isPublic: true,
    isPremium: false,
    price: 0,
    category: '',
    additionalFiles: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ContentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (type: 'main' | 'thumbnail', files: FileList | null) => {
    if (!files || !files[0]) return;

    const file = files[0];
    if (type === 'main') {
      setFormData(prev => ({ ...prev, mainFile: file }));
    } else if (type === 'thumbnail') {
      setFormData(prev => ({ ...prev, thumbnail: file }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.mainFile) {
      setError('Main file is required');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      const uploadData = apiClientEnhanced.createContentFormData({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        tags: formData.tags,
        isPublic: formData.isPublic,
        isPremium: formData.isPremium,
        price: formData.isPremium ? formData.price : undefined,
        category: formData.category,
        mainFile: formData.mainFile,
        thumbnail: formData.thumbnail,
        additionalFiles: formData.additionalFiles
      });

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      const response = await apiClientEnhanced.uploadContent(uploadData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        navigate(`/content/${response.content.id}`);
      } else {
        setError(response.error || 'Upload failed');
      }
    } catch (error: any) {
      setError(apiClientEnhanced.handleError(error));
    } finally {
      setIsUploading(false);
    }
  };

  const selectedType = CONTENT_TYPES.find(t => t.value === formData.type);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Content</h1>
          <p className="text-gray-400">Share your content with the community</p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-3">Content Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CONTENT_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value)}
                    className={`p-4 rounded-lg border-2 transition-colors flex flex-col items-center space-y-2 ${
                      formData.type === type.value
                        ? 'border-orange-500 bg-orange-500 bg-opacity-20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:outline-hidden focus:border-orange-500"
                placeholder="Enter content title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:outline-hidden focus:border-orange-500"
              >
                <option value="">Select category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:outline-hidden focus:border-orange-500"
              placeholder="Describe your content"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-orange-500 bg-opacity-20 text-orange-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-orange-400 hover:text-orange-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-hidden focus:border-orange-500"
                placeholder="Add tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
              >
                <Tag className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  className="text-orange-500"
                />
                <span>Public Content</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  checked={formData.isPremium}
                  onChange={(e) => handleInputChange('isPremium', e.target.checked)}
                  className="text-orange-500"
                />
                <DollarSign className="w-4 h-4" />
                <span>Premium Content</span>
              </label>
            </div>

            {formData.isPremium && (
              <div>
                <label className="block text-sm font-medium mb-2">Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:outline-hidden focus:border-orange-500"
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Main File *</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6">
                {formData.mainFile ? (
                  <div className="text-center">
                    <p className="text-green-400 mb-2">File selected: {formData.mainFile.name}</p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mainFile: undefined }))}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Click to upload main file</p>
                    <p className="text-gray-500 text-sm">Accepted: {selectedType?.accept}</p>
                    <input
                      ref={mainFileRef}
                      type="file"
                      accept={selectedType?.accept}
                      onChange={(e) => handleFileSelect('main', e.target.files)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => mainFileRef.current?.click()}
                      className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Thumbnail (Optional)</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6">
                {formData.thumbnail ? (
                  <div className="text-center">
                    <p className="text-green-400 mb-2">Thumbnail: {formData.thumbnail.name}</p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, thumbnail: undefined }))}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove thumbnail
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 mb-2">Upload thumbnail image</p>
                    <input
                      ref={thumbnailRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect('thumbnail', e.target.files)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => thumbnailRef.current?.click()}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Choose Thumbnail
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isUploading && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-gray-400">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !formData.title.trim() || !formData.mainFile}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Content</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedContentUpload;
