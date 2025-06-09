interface VoiceSearchOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

interface VoiceSearchResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

class VoiceSearchService {
  private recognition: any = null;
  private isListening = false;
  private callbacks: {
    onResult?: (result: VoiceSearchResult) => void;
    onError?: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
  } = {};

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition(): void {
    // Check if browser supports Web Speech API
    if (!this.isSupported()) {
      return;
    }

    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.setupRecognition();
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    // Configure recognition settings
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    // Handle recognition results
    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const result = event.results[last];
      
      if (result) {
        const transcript = result[0].transcript;
        const confidence = result[0].confidence || 0.9;
        const isFinal = result.isFinal;

        this.callbacks.onResult?.({
          transcript: transcript.trim(),
          confidence,
          isFinal
        });
      }
    };

    // Handle recognition start
    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart?.();
    };

    // Handle recognition end
    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onEnd?.();
    };

    // Handle recognition errors
    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      let errorMessage = 'Voice recognition error';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Voice recognition service not allowed.';
          break;
        default:
          errorMessage = `Voice recognition error: ${event.error}`;
      }
      
      this.callbacks.onError?.(errorMessage);
    };

    // Handle speech start
    this.recognition.onspeechstart = () => {
      // Speech has been detected
    };

    // Handle speech end
    this.recognition.onspeechend = () => {
      // Speech has stopped
    };
  }

  // Check if voice search is supported
  isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition
    );
  }

  // Start voice recognition
  startListening(options?: VoiceSearchOptions): void {
    if (!this.recognition || this.isListening) {
      return;
    }

    // Apply options
    if (options) {
      if (options.language) {
        this.recognition.lang = options.language;
      }
      if (options.continuous !== undefined) {
        this.recognition.continuous = options.continuous;
      }
      if (options.interimResults !== undefined) {
        this.recognition.interimResults = options.interimResults;
      }
      if (options.maxAlternatives) {
        this.recognition.maxAlternatives = options.maxAlternatives;
      }
    }

    try {
      this.recognition.start();
    } catch (error) {
      this.callbacks.onError?.('Failed to start voice recognition');
    }
  }

  // Stop voice recognition
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Abort voice recognition
  abortListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
    }
  }

  // Set event callbacks
  setCallbacks(callbacks: {
    onResult?: (result: VoiceSearchResult) => void;
    onError?: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
  }): void {
    this.callbacks = callbacks;
  }

  // Get listening status
  getIsListening(): boolean {
    return this.isListening;
  }

  // Process voice command for search
  processVoiceCommand(transcript: string): string {
    let processedQuery = transcript.toLowerCase().trim();
    
    // Remove common voice command phrases
    const commandPhrases = [
      'search for',
      'find',
      'look for',
      'show me',
      'i want to see',
      'i\'m looking for',
      'can you find',
      'onlyfur',
      'on only fur'
    ];
    
    commandPhrases.forEach(phrase => {
      const regex = new RegExp(`^${phrase}\\s*`, 'i');
      processedQuery = processedQuery.replace(regex, '');
    });
    
    // Clean up common speech recognition errors
    const corrections = {
      'very art': 'furry art',
      'for art': 'furry art',
      'furry heart': 'furry art',
      'animation tutorial': 'animation tutorial',
      'character design': 'character design',
      'for suit': 'fursuit',
      'first suit': 'fursuit'
    };
    
    Object.entries(corrections).forEach(([error, correction]) => {
      const regex = new RegExp(error, 'gi');
      processedQuery = processedQuery.replace(regex, correction);
    });
    
    return processedQuery.trim();
  }

  // Get voice search tips
  getVoiceSearchTips(): string[] {
    return [
      'Speak clearly and at a normal pace',
      'Try phrases like "search for digital art" or "find animation tutorials"',
      'Avoid background noise for better recognition',
      'You can say creator names or content types',
      'End with silence to complete your search'
    ];
  }

  // Check microphone permissions
  async checkMicrophonePermission(): Promise<boolean> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  }
}

export const voiceSearchService = new VoiceSearchService();
export type { VoiceSearchOptions, VoiceSearchResult };
