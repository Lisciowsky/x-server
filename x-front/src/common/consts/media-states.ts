const mediaStates = {
    ERROR: 'ERROR',
    MEDIA_UPLOAD: 'MEDIA_UPLOAD'
  } as const;
  
  type MediaStates = typeof mediaStates[keyof typeof mediaStates];
  
  export { mediaStates };
  export type { MediaStates };
