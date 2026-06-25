/**
 * Generates a default image URL for news articles when no image is provided
 * This creates a data URL with a red background and news icon
 */
export function generateDefaultNewsImageUrl(): string {
  // Create a canvas element to generate the default image
  if (typeof window === 'undefined') {
    // Server-side fallback - return a placeholder that will be replaced client-side
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkVGMkYyIi8+CjxyZWN0IHg9IjEiIHk9IjEiIHdpZHRoPSI3OTgiIGhlaWdodD0iMzk4IiBzdHJva2U9IiNGRUM5QzkiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMzUwIDEzMEg0NTBWMTcwSDM1MFYxMzBaIiBmaWxsPSIjRjU5NDk0Ii8+CjxwYXRoIGQ9Ik0zNzAgMTUwSDQzMFYyMzBIMzcwVjE1MFoiIGZpbGw9IiNGNTk0OTQiLz4KPHBhdGggZD0iTTM4MCAyNTBINDIwVjI3MEgzODBWMjUwWiIgZmlsbD0iI0Y1OTQ5NCIvPgo8dGV4dCB4PSI0MDAiIHk9IjMwMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiNCOTE5MTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPktlaW4gTmV3cy1CaWxkIHZvcmhhbmRlbjwvdGV4dD4KPHRleHQgeD0iNDAwIiB5PSIzMjAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjQkY0MDQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CaWxkIHdpcmQgYmFsZCBob2NoZ2VsYWRlbjwvdGV4dD4KPC9zdmc+';
  }

  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#FEF2F2'; // red-50
  ctx.fillRect(0, 0, 800, 400);

  // Border
  ctx.strokeStyle = '#FEE2E2'; // red-100
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 796, 396);

  // Icon (simplified FileText icon)
  ctx.fillStyle = '#FCA5A5'; // red-300
  ctx.beginPath();
  // Document body
  ctx.rect(350, 130, 100, 100);
  ctx.fill();

  // Document lines
  ctx.fillStyle = '#F87171'; // red-400
  ctx.fillRect(370, 150, 60, 4);
  ctx.fillRect(370, 170, 60, 4);
  ctx.fillRect(370, 190, 60, 4);
  ctx.fillRect(370, 210, 40, 4);

  // Text
  ctx.fillStyle = '#B91C1C'; // red-700
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Kein News-Bild vorhanden', 400, 280);

  ctx.fillStyle = '#DC2626'; // red-600
  ctx.font = '14px sans-serif';
  ctx.fillText('Bild wird bald hochgeladen', 400, 310);

  return canvas.toDataURL('image/png');
}

/**
 * Static default image URL for server-side rendering and fallback
 */
export const DEFAULT_NEWS_IMAGE_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkVGMkYyIi8+CjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSI3OTYiIGhlaWdodD0iMzk2IiBzdHJva2U9IiNGRUUyRTIiIHN0cm9rZS13aWR0aD0iNCIvPgo8cGF0aCBkPSJNMzUwIDEzMEg0NTBWMjMwSDM1MFYxMzBaIiBmaWxsPSIjRkNBNUE1Ii8+CjxwYXRoIGQ9Ik0zNzAgMTUwSDQzMFYxNzBIMzcwVjE1MFoiIGZpbGw9IiNGODcxNzEiLz4KPHBhdGggZD0iTTM3MCAzODBINDMwVjE5MEgzNzBWMTgwWiIgZmlsbD0iI0Y4NzE3MSIvPgo8cGF0aCBkPSJNMzcwIDIxMEg0MzBWMjMwSDM3MFYyMTBaIiBmaWxsPSIjRjg3MTcxIi8+CjxwYXRoIGQ9Ik0zNzAgMjMwSDQxMFYyNTBIMzcwVjIzMFoiIGZpbGw9IiNGODcxNzEiLz4KPHRleHQgeD0iNDAwIiB5PSIyODAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0I5MUMxQyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+S2VpbiBOZXdzLUJpbGQgdm9yaGFuZGVuPC90ZXh0Pgo8dGV4dCB4PSI0MDAiIHk9IjMxMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNEQzI2MjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJpbGQgd2lyZCBiYWxkIGhvY2hnZWxhZGVuPC90ZXh0Pgo8L3N2Zz4K';
