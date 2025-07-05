interface ImageFeatures {
  id: string;
  colors: {
    dominant: string[];
    palette: string[];
    brightness: number;
    saturation: number;
  };
  shapes: {
    geometric_shapes: string[];
    organic_shapes: string[];
    complexity_score: number;
  };
  composition: {
    rule_of_thirds: boolean;
    symmetry: number;
    balance: number;
    focal_points: number;
  };
  style: {
    art_style: string;
    technique: string;
    medium: string;
    genre: string;
  };
  content: {
    objects: string[];
    characters: string[];
    scene_type: string;
    mood: string;
  };
  technical: {
    quality_score: number;
    resolution_category: 'low' | 'medium' | 'high' | 'ultra';
    aspect_ratio: string;
    file_size_category: 'small' | 'medium' | 'large';
  };
}

interface VisualSearchResult {
  id: string;
  similarity_score: number;
  match_factors: {
    color_similarity: number;
    style_similarity: number;
    composition_similarity: number;
    content_similarity: number;
  };
  explanation: string;
  image_url: string;
  title: string;
  creator: string;
  tags: string[];
}

interface VisualSearchOptions {
  search_mode: 'similar' | 'style' | 'color' | 'composition' | 'content';
  color_weight: number;
  style_weight: number;
  composition_weight: number;
  content_weight: number;
  quality_threshold: number;
  limit: number;
}

class VisualSearchEngine {
  private imageDatabase: Map<string, ImageFeatures> = new Map();
  private colorCache: Map<string, string[]> = new Map();

  constructor() {
    this.initializeImageDatabase();
  }

  private initializeImageDatabase(): void {
    // Mock image database with feature vectors
    this.imageDatabase.set('art-001', {
      id: 'art-001',
      colors: {
        dominant: ['#FF6B35', '#2E86AB', '#A23B72'],
        palette: ['#FF6B35', '#2E86AB', '#A23B72', '#F18F01', '#C73E1D'],
        brightness: 0.7,
        saturation: 0.8
      },
      shapes: {
        geometric_shapes: ['circle', 'triangle'],
        organic_shapes: ['curved_lines', 'flowing_forms'],
        complexity_score: 0.6
      },
      composition: {
        rule_of_thirds: true,
        symmetry: 0.3,
        balance: 0.8,
        focal_points: 2
      },
      style: {
        art_style: 'digital_art',
        technique: 'vector',
        medium: 'digital',
        genre: 'character_art'
      },
      content: {
        objects: ['character', 'background', 'props'],
        characters: ['anthropomorphic', 'wolf'],
        scene_type: 'portrait',
        mood: 'energetic'
      },
      technical: {
        quality_score: 0.9,
        resolution_category: 'high',
        aspect_ratio: '16:9',
        file_size_category: 'medium'
      }
    });

    this.imageDatabase.set('art-002', {
      id: 'art-002',
      colors: {
        dominant: ['#4A90E2', '#7ED321', '#BD10E0'],
        palette: ['#4A90E2', '#7ED321', '#BD10E0', '#F5A623', '#D0021B'],
        brightness: 0.6,
        saturation: 0.7
      },
      shapes: {
        geometric_shapes: ['square', 'rectangle'],
        organic_shapes: ['natural_forms', 'landscape_elements'],
        complexity_score: 0.8
      },
      composition: {
        rule_of_thirds: false,
        symmetry: 0.7,
        balance: 0.6,
        focal_points: 3
      },
      style: {
        art_style: 'traditional_art',
        technique: 'painting',
        medium: 'watercolor',
        genre: 'landscape'
      },
      content: {
        objects: ['trees', 'mountains', 'sky'],
        characters: [],
        scene_type: 'landscape',
        mood: 'peaceful'
      },
      technical: {
        quality_score: 0.85,
        resolution_category: 'high',
        aspect_ratio: '4:3',
        file_size_category: 'large'
      }
    });

    this.imageDatabase.set('art-003', {
      id: 'art-003',
      colors: {
        dominant: ['#000000', '#FFFFFF', '#808080'],
        palette: ['#000000', '#FFFFFF', '#808080', '#404040', '#C0C0C0'],
        brightness: 0.4,
        saturation: 0.1
      },
      shapes: {
        geometric_shapes: ['line', 'angle'],
        organic_shapes: ['figure_study', 'anatomy'],
        complexity_score: 0.9
      },
      composition: {
        rule_of_thirds: true,
        symmetry: 0.2,
        balance: 0.9,
        focal_points: 1
      },
      style: {
        art_style: 'sketch',
        technique: 'pencil',
        medium: 'traditional',
        genre: 'study'
      },
      content: {
        objects: ['figure', 'pose'],
        characters: ['anthropomorphic', 'cat'],
        scene_type: 'figure_study',
        mood: 'contemplative'
      },
      technical: {
        quality_score: 0.8,
        resolution_category: 'medium',
        aspect_ratio: '3:4',
        file_size_category: 'small'
      }
    });
  }

  // Extract features from uploaded image
  async extractImageFeatures(imageFile: File): Promise<ImageFeatures> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            resolve(this.getMockFeatures());
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const features = this.analyzeImageData(ctx, canvas);
          resolve(features);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(imageFile);
    });
  }

  // Analyze image data to extract features
  private analyzeImageData(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): ImageFeatures {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Extract colors
    const colors = this.extractColors(pixels);
    
    // Analyze composition
    const composition = this.analyzeComposition(canvas.width, canvas.height);
    
    // Determine style (simplified)
    const style = this.determineStyle(colors, composition);
    
    // Technical analysis
    const technical = this.analyzeTechnical(canvas, imageData);

    return {
      id: `uploaded-${Date.now()}`,
      colors,
      shapes: {
        geometric_shapes: ['detected_shapes'],
        organic_shapes: ['organic_forms'],
        complexity_score: 0.7
      },
      composition,
      style,
      content: {
        objects: ['detected_objects'],
        characters: ['detected_characters'],
        scene_type: 'unknown',
        mood: 'neutral'
      },
      technical
    };
  }

  // Extract dominant colors from pixel data
  private extractColors(pixels: Uint8ClampedArray): ImageFeatures['colors'] {
    const colorMap = new Map<string, number>();
    let totalBrightness = 0;
    let totalSaturation = 0;
    const sampleRate = 10; // Sample every 10th pixel for performance

    for (let i = 0; i < pixels.length; i += 4 * sampleRate) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      const hex = this.rgbToHex(r, g, b);
      colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
      
      // Calculate brightness and saturation
      const brightness = (r + g + b) / 3 / 255;
      const saturation = this.calculateSaturation(r, g, b);
      
      totalBrightness += brightness;
      totalSaturation += saturation;
    }

    const pixelCount = pixels.length / 4 / sampleRate;
    const avgBrightness = totalBrightness / pixelCount;
    const avgSaturation = totalSaturation / pixelCount;

    // Get most frequent colors
    const sortedColors = Array.from(colorMap.entries())
      .sort(([,a], [,b]) => b - a)
      .map(([color]) => color);

    return {
      dominant: sortedColors.slice(0, 3),
      palette: sortedColors.slice(0, 5),
      brightness: avgBrightness,
      saturation: avgSaturation
    };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  private calculateSaturation(r: number, g: number, b: number): number {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    return max === 0 ? 0 : diff / max;
  }

  // Analyze image composition
  private analyzeComposition(width: number, height: number): ImageFeatures['composition'] {
    const aspectRatio = width / height;
    
    return {
      rule_of_thirds: Math.random() > 0.5, // Simplified detection
      symmetry: Math.random(), // 0-1 score
      balance: Math.random(), // 0-1 score
      focal_points: Math.floor(Math.random() * 3) + 1
    };
  }

  // Determine art style from features
  private determineStyle(colors: ImageFeatures['colors'], composition: ImageFeatures['composition']): ImageFeatures['style'] {
    // Simplified style detection based on color and composition
    let artStyle = 'digital_art';
    let technique = 'unknown';
    let medium = 'digital';
    
    if (colors.saturation < 0.3) {
      artStyle = 'sketch';
      technique = 'pencil';
      medium = 'traditional';
    } else if (colors.brightness > 0.8) {
      artStyle = 'watercolor';
      technique = 'painting';
      medium = 'traditional';
    }

    return {
      art_style: artStyle,
      technique,
      medium,
      genre: 'unknown'
    };
  }

  // Analyze technical aspects
  private analyzeTechnical(canvas: HTMLCanvasElement, imageData: ImageData): ImageFeatures['technical'] {
    const pixels = canvas.width * canvas.height;
    let resolutionCategory: 'low' | 'medium' | 'high' | 'ultra';
    
    if (pixels < 500000) resolutionCategory = 'low';
    else if (pixels < 2000000) resolutionCategory = 'medium';
    else if (pixels < 8000000) resolutionCategory = 'high';
    else resolutionCategory = 'ultra';

    const aspectRatio = `${canvas.width}:${canvas.height}`;
    
    // Simple quality assessment based on variance in pixel values
    const quality = this.assessImageQuality(imageData);

    return {
      quality_score: quality,
      resolution_category: resolutionCategory,
      aspect_ratio: aspectRatio,
      file_size_category: 'medium'
    };
  }

  private assessImageQuality(imageData: ImageData): number {
    // Simplified quality assessment based on edge detection and noise
    let edgeCount = 0;
    let noiseLevel = 0;
    const pixels = imageData.data;
    
    for (let i = 0; i < pixels.length - 8; i += 4) {
      const current = pixels[i] + pixels[i + 1] + pixels[i + 2];
      const next = pixels[i + 4] + pixels[i + 5] + pixels[i + 6];
      const diff = Math.abs(current - next);
      
      if (diff > 50) edgeCount++;
      if (diff > 200) noiseLevel++;
    }
    
    const edgeRatio = edgeCount / (pixels.length / 4);
    const noiseRatio = noiseLevel / (pixels.length / 4);
    
    // Higher edge ratio = better quality, lower noise ratio = better quality
    return Math.max(0, Math.min(1, edgeRatio - noiseRatio));
  }

  private getMockFeatures(): ImageFeatures {
    return {
      id: 'mock-upload',
      colors: {
        dominant: ['#FF6B35', '#2E86AB', '#A23B72'],
        palette: ['#FF6B35', '#2E86AB', '#A23B72', '#F18F01', '#C73E1D'],
        brightness: 0.7,
        saturation: 0.8
      },
      shapes: {
        geometric_shapes: ['circle'],
        organic_shapes: ['curved_lines'],
        complexity_score: 0.6
      },
      composition: {
        rule_of_thirds: true,
        symmetry: 0.5,
        balance: 0.7,
        focal_points: 2
      },
      style: {
        art_style: 'digital_art',
        technique: 'digital',
        medium: 'digital',
        genre: 'character_art'
      },
      content: {
        objects: ['character'],
        characters: ['anthropomorphic'],
        scene_type: 'portrait',
        mood: 'neutral'
      },
      technical: {
        quality_score: 0.8,
        resolution_category: 'high',
        aspect_ratio: '1:1',
        file_size_category: 'medium'
      }
    };
  }

  // Visual search based on uploaded image
  async searchByImage(
    targetFeatures: ImageFeatures, 
    options: Partial<VisualSearchOptions> = {}
  ): Promise<VisualSearchResult[]> {
    const {
      search_mode = 'similar',
      color_weight = 0.3,
      style_weight = 0.25,
      composition_weight = 0.25,
      content_weight = 0.2,
      quality_threshold = 0.5,
      limit = 10
    } = options;

    const results: VisualSearchResult[] = [];

    for (const [id, features] of this.imageDatabase) {
      const matchFactors = this.calculateMatchFactors(targetFeatures, features);
      
      // Calculate overall similarity based on search mode
      let similarity = 0;
      
      switch (search_mode) {
        case 'color':
          similarity = matchFactors.color_similarity;
          break;
        case 'style':
          similarity = matchFactors.style_similarity;
          break;
        case 'composition':
          similarity = matchFactors.composition_similarity;
          break;
        case 'content':
          similarity = matchFactors.content_similarity;
          break;
        default: // 'similar'
          similarity = (
            matchFactors.color_similarity * color_weight +
            matchFactors.style_similarity * style_weight +
            matchFactors.composition_similarity * composition_weight +
            matchFactors.content_similarity * content_weight
          );
      }

      if (similarity >= quality_threshold) {
        results.push({
          id,
          similarity_score: similarity,
          match_factors: matchFactors,
          explanation: this.generateVisualExplanation(matchFactors, search_mode),
          image_url: `/images/art/${id}.jpg`,
          title: this.getImageTitle(id),
          creator: this.getImageCreator(id),
          tags: this.getImageTags(features)
        });
      }
    }

    return results
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, limit);
  }

  // Calculate similarity factors between two images
  private calculateMatchFactors(target: ImageFeatures, candidate: ImageFeatures): VisualSearchResult['match_factors'] {
    // Color similarity
    const colorSimilarity = this.calculateColorSimilarity(target.colors, candidate.colors);
    
    // Style similarity
    const styleSimilarity = this.calculateStyleSimilarity(target.style, candidate.style);
    
    // Composition similarity
    const compositionSimilarity = this.calculateCompositionSimilarity(target.composition, candidate.composition);
    
    // Content similarity
    const contentSimilarity = this.calculateContentSimilarity(target.content, candidate.content);

    return {
      color_similarity: colorSimilarity,
      style_similarity: styleSimilarity,
      composition_similarity: compositionSimilarity,
      content_similarity: contentSimilarity
    };
  }

  private calculateColorSimilarity(target: ImageFeatures['colors'], candidate: ImageFeatures['colors']): number {
    // Compare dominant colors
    let colorMatches = 0;
    target.dominant.forEach(targetColor => {
      candidate.dominant.forEach(candidateColor => {
        if (this.colorDistance(targetColor, candidateColor) < 0.2) {
          colorMatches++;
        }
      });
    });
    
    const dominantSimilarity = colorMatches / Math.max(target.dominant.length, candidate.dominant.length);
    
    // Compare brightness and saturation
    const brightnessSimilarity = 1 - Math.abs(target.brightness - candidate.brightness);
    const saturationSimilarity = 1 - Math.abs(target.saturation - candidate.saturation);
    
    return (dominantSimilarity * 0.6 + brightnessSimilarity * 0.2 + saturationSimilarity * 0.2);
  }

  private colorDistance(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 1;
    
    const rDiff = (rgb1.r - rgb2.r) / 255;
    const gDiff = (rgb1.g - rgb2.g) / 255;
    const bDiff = (rgb1.b - rgb2.b) / 255;
    
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff) / Math.sqrt(3);
  }

  private hexToRgb(hex: string): {r: number, g: number, b: number} | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private calculateStyleSimilarity(target: ImageFeatures['style'], candidate: ImageFeatures['style']): number {
    let matches = 0;
    let total = 0;
    
    if (target.art_style === candidate.art_style) matches += 0.4;
    total += 0.4;
    
    if (target.technique === candidate.technique) matches += 0.3;
    total += 0.3;
    
    if (target.medium === candidate.medium) matches += 0.2;
    total += 0.2;
    
    if (target.genre === candidate.genre) matches += 0.1;
    total += 0.1;
    
    return total > 0 ? matches / total : 0;
  }

  private calculateCompositionSimilarity(target: ImageFeatures['composition'], candidate: ImageFeatures['composition']): number {
    let similarity = 0;
    
    // Rule of thirds
    if (target.rule_of_thirds === candidate.rule_of_thirds) similarity += 0.25;
    
    // Symmetry similarity
    similarity += (1 - Math.abs(target.symmetry - candidate.symmetry)) * 0.25;
    
    // Balance similarity
    similarity += (1 - Math.abs(target.balance - candidate.balance)) * 0.25;
    
    // Focal points similarity
    const focalPointDiff = Math.abs(target.focal_points - candidate.focal_points);
    similarity += Math.max(0, 1 - focalPointDiff / 3) * 0.25;
    
    return similarity;
  }

  private calculateContentSimilarity(target: ImageFeatures['content'], candidate: ImageFeatures['content']): number {
    let similarity = 0;
    
    // Object similarity
    const objectMatches = this.calculateArraySimilarity(target.objects, candidate.objects);
    similarity += objectMatches * 0.3;
    
    // Character similarity
    const characterMatches = this.calculateArraySimilarity(target.characters, candidate.characters);
    similarity += characterMatches * 0.3;
    
    // Scene type
    if (target.scene_type === candidate.scene_type) similarity += 0.2;
    
    // Mood
    if (target.mood === candidate.mood) similarity += 0.2;
    
    return similarity;
  }

  private calculateArraySimilarity(arr1: string[], arr2: string[]): number {
    if (arr1.length === 0 && arr2.length === 0) return 1;
    if (arr1.length === 0 || arr2.length === 0) return 0;
    
    const intersection = arr1.filter(item => arr2.includes(item));
    const union = [...new Set([...arr1, ...arr2])];
    
    return intersection.length / union.length;
  }

  private generateVisualExplanation(matchFactors: VisualSearchResult['match_factors'], searchMode: string): string {
    const factors = [];
    
    if (matchFactors.color_similarity > 0.7) factors.push('similar color palette');
    if (matchFactors.style_similarity > 0.7) factors.push('matching art style');
    if (matchFactors.composition_similarity > 0.7) factors.push('similar composition');
    if (matchFactors.content_similarity > 0.7) factors.push('related content');
    
    if (factors.length === 0) {
      return `Basic visual similarity in ${searchMode} characteristics`;
    }
    
    return `Match found due to: ${factors.join(', ')}`;
  }

  private getImageTitle(id: string): string {
    const titles: Record<string, string> = {
      'art-001': 'Energetic Wolf Character',
      'art-002': 'Peaceful Mountain Landscape',
      'art-003': 'Character Study Sketch'
    };
    return titles[id] || 'Untitled Artwork';
  }

  private getImageCreator(id: string): string {
    const creators: Record<string, string> = {
      'art-001': 'FurryArtist_Pro',
      'art-002': 'LandscapeMaster',
      'art-003': 'SketchArtist'
    };
    return creators[id] || 'Unknown Artist';
  }

  private getImageTags(features: ImageFeatures): string[] {
    const tags = [];
    
    tags.push(features.style.art_style);
    tags.push(features.style.medium);
    tags.push(features.content.scene_type);
    
    if (features.colors.saturation > 0.7) tags.push('vibrant');
    if (features.colors.brightness > 0.7) tags.push('bright');
    if (features.composition.rule_of_thirds) tags.push('well-composed');
    if (features.technical.quality_score > 0.8) tags.push('high-quality');
    
    return tags;
  }

  // Search by color palette
  async searchByColor(targetColors: string[], limit: number = 10): Promise<VisualSearchResult[]> {
    const results: VisualSearchResult[] = [];
    
    for (const [id, features] of this.imageDatabase) {
      let colorSimilarity = 0;
      
      targetColors.forEach(targetColor => {
        features.colors.dominant.forEach(candidateColor => {
          const distance = this.colorDistance(targetColor, candidateColor);
          colorSimilarity += Math.max(0, 1 - distance);
        });
      });
      
      colorSimilarity /= (targetColors.length * features.colors.dominant.length);
      
      if (colorSimilarity > 0.3) {
        results.push({
          id,
          similarity_score: colorSimilarity,
          match_factors: {
            color_similarity: colorSimilarity,
            style_similarity: 0,
            composition_similarity: 0,
            content_similarity: 0
          },
          explanation: `Color match: ${(colorSimilarity * 100).toFixed(1)}% similarity`,
          image_url: `/images/art/${id}.jpg`,
          title: this.getImageTitle(id),
          creator: this.getImageCreator(id),
          tags: this.getImageTags(features)
        });
      }
    }
    
    return results
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, limit);
  }

  // Search by style
  async searchByStyle(targetStyle: string, limit: number = 10): Promise<VisualSearchResult[]> {
    const results: VisualSearchResult[] = [];
    
    for (const [id, features] of this.imageDatabase) {
      let styleSimilarity = 0;
      
      if (features.style.art_style === targetStyle) styleSimilarity += 0.5;
      if (features.style.technique === targetStyle) styleSimilarity += 0.3;
      if (features.style.medium === targetStyle) styleSimilarity += 0.2;
      
      if (styleSimilarity > 0) {
        results.push({
          id,
          similarity_score: styleSimilarity,
          match_factors: {
            color_similarity: 0,
            style_similarity: styleSimilarity,
            composition_similarity: 0,
            content_similarity: 0
          },
          explanation: `Style match: ${targetStyle}`,
          image_url: `/images/art/${id}.jpg`,
          title: this.getImageTitle(id),
          creator: this.getImageCreator(id),
          tags: this.getImageTags(features)
        });
      }
    }
    
    return results
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, limit);
  }

  // Get color palette from image
  async extractColorPalette(imageFile: File): Promise<string[]> {
    const features = await this.extractImageFeatures(imageFile);
    return features.colors.palette;
  }

  // Get available styles
  getAvailableStyles(): string[] {
    const styles = new Set<string>();
    
    for (const features of this.imageDatabase.values()) {
      styles.add(features.style.art_style);
      styles.add(features.style.technique);
      styles.add(features.style.medium);
    }
    
    return Array.from(styles);
  }

  // Get image statistics
  getImageStatistics(): {
    total_images: number;
    styles: Record<string, number>;
    color_distribution: Record<string, number>;
    quality_distribution: Record<string, number>;
  } {
    const stats = {
      total_images: this.imageDatabase.size,
      styles: {} as Record<string, number>,
      color_distribution: {} as Record<string, number>,
      quality_distribution: {
        high: 0,
        medium: 0,
        low: 0
      }
    };

    for (const features of this.imageDatabase.values()) {
      // Style distribution
      const style = features.style.art_style;
      stats.styles[style] = (stats.styles[style] || 0) + 1;
      
      // Color distribution (simplified)
      const dominantColor = features.colors.dominant[0];
      if (dominantColor) {
        stats.color_distribution[dominantColor] = (stats.color_distribution[dominantColor] || 0) + 1;
      }
      
      // Quality distribution
      if (features.technical.quality_score > 0.8) stats.quality_distribution.high++;
      else if (features.technical.quality_score > 0.6) stats.quality_distribution.medium++;
      else stats.quality_distribution.low++;
    }

    return stats;
  }
}

export const visualSearchEngine = new VisualSearchEngine();
export type { ImageFeatures, VisualSearchResult, VisualSearchOptions };
